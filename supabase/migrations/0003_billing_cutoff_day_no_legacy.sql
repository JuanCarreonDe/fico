-- ============================================================================
-- 0003_billing_cutoff_day_no_legacy.sql   (FICO real + demo)
--
-- "No legacy": para tarjetas de crédito, get_account_balances SIEMPRE aplica
-- el corte (facturado / en proceso). Se elimina la rama que usaba
-- initial_balance + Σtx cuando la tarjeta no tenía día de corte.
--
-- Cambios:
--   1. Backfill: las tarjetas activas sin billing_cutoff_day reciben el día de
--      creación (extract(day from created_at)).
--   2. get_account_balances: para credit, el día de corte efectivo es
--      COALESCE(billing_cutoff_day, día de creación) → nunca cae a legacy.
--      balance / credit_balance = facturado (Σ tx ≤ último corte cerrado),
--      credit_pending      = en proceso (Σ tx > último corte cerrado).
--   3. create_account / update_account: p_billing_cutoff_day es OBLIGATORIO
--      para tarjetas de crédito (y validado 1-31 en ambos).
--
-- Idempotente y sin cambio de firma (CREATE OR REPLACE).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) Backfill day-of-cutoff for existing active credit accounts
-- ---------------------------------------------------------------------------
UPDATE public.accounts
SET billing_cutoff_day = extract(day FROM created_at)::smallint
WHERE type = 'credit'
  AND billing_cutoff_day IS NULL
  AND is_archived = false;

-- ---------------------------------------------------------------------------
-- 2) get_account_balances · sin branch legacy para crédito
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_account_balances()
RETURNS TABLE (
  account_id          uuid,
  account_name        text,
  account_type        text,
  account_currency    text,
  account_created_at  timestamp with time zone,
  balance             numeric,          -- facturado para crédito (principal)
  account_sum_to_total boolean,
  account_color       text,
  credit_limit        numeric,
  billing_cutoff_day  smallint,
  credit_balance      numeric,          -- facturado (igual a balance en crédito)
  credit_pending      numeric           -- "en proceso" para crédito (secundario)
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $function$
WITH tx_totals AS (
  SELECT
    t.account_id,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) AS tx_sum
  FROM transactions t
  WHERE t.deleted_at IS NULL
  GROUP BY t.account_id
),
cutoff_ctx AS (
  SELECT
    a.id AS account_id,
    COALESCE(
      a.billing_cutoff_day,
      extract(day FROM a.created_at)::smallint
    )::int AS cut_day
  FROM accounts a
),
cut_dates AS (
  SELECT
    c.account_id,
    c.cut_day,
    date_trunc('month', CURRENT_DATE)::date
      + (CASE
           WHEN extract(day FROM CURRENT_DATE) >= c.cut_day
             THEN LEAST(c.cut_day, extract(day FROM (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day'))::int) - 1
           ELSE LEAST(c.cut_day, extract(day FROM date_trunc('month', CURRENT_DATE) - interval '1 day')::int) - 1
         END)::int AS last_cutoff
  FROM cutoff_ctx c
),
billed_tx AS (
  SELECT
    t.account_id,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) AS billed
  FROM transactions t
  JOIN cut_dates d ON d.account_id = t.account_id
  WHERE t.deleted_at IS NULL
    AND t.transaction_date::date <= d.last_cutoff
  GROUP BY t.account_id
),
pending_tx AS (
  SELECT
    t.account_id,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) AS pending
  FROM transactions t
  JOIN cut_dates d ON d.account_id = t.account_id
  WHERE t.deleted_at IS NULL
    AND t.transaction_date::date > d.last_cutoff
  GROUP BY t.account_id
)
SELECT
  a.id::uuid,
  a.name::text,
  a.type::text,
  a.currency::text,
  a.created_at,
  CASE
    WHEN a.type = 'credit' THEN COALESCE(b.billed, 0)
    ELSE a.initial_balance + COALESCE(t.tx_sum, 0)
  END AS balance,
  a.sum_to_total,
  a.color,
  a.credit_limit,
  a.billing_cutoff_day,
  CASE
    WHEN a.type = 'credit' THEN COALESCE(b.billed, 0)
    ELSE 0
  END AS credit_balance,
  CASE
    WHEN a.type = 'credit' THEN COALESCE(p.pending, 0)
    ELSE 0
  END AS credit_pending
FROM accounts a
LEFT JOIN tx_totals t ON t.account_id = a.id
LEFT JOIN cutoff_ctx c ON c.account_id = a.id
LEFT JOIN cut_dates d ON d.account_id = a.id
LEFT JOIN billed_tx b ON b.account_id = a.id
LEFT JOIN pending_tx p ON p.account_id = a.id
WHERE a.user_id = auth.uid()
  AND a.is_archived = false
GROUP BY
  a.id, a.name, a.type, a.currency, a.created_at, a.initial_balance,
  a.sum_to_total, a.color, a.credit_limit, a.billing_cutoff_day,
  t.tx_sum, d.last_cutoff, b.billed, p.pending;
$function$;

-- ---------------------------------------------------------------------------
-- 3) create_account · día de corte obligatorio para crédito
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_account(
  p_name text,
  p_type account_type,
  p_initial_balance numeric DEFAULT 0,
  p_currency text DEFAULT 'MXN'::text,
  p_sum_to_total boolean DEFAULT true,
  p_color text DEFAULT NULL::text,
  p_credit_limit numeric DEFAULT NULL::numeric,
  p_billing_cutoff_day smallint DEFAULT NULL::smallint
)
RETURNS accounts
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_account accounts;
BEGIN
  IF trim(p_name) = '' THEN
    RAISE EXCEPTION 'Account name cannot be empty';
  END IF;

  IF EXISTS (
    SELECT 1 FROM accounts
    WHERE user_id = auth.uid()
      AND lower(name) = lower(p_name)
      AND is_archived = false
  ) THEN
    RAISE EXCEPTION 'Account already exists';
  END IF;

  IF p_type = 'credit' THEN
    IF p_billing_cutoff_day IS NULL THEN
      RAISE EXCEPTION 'Billing cutoff day is required for credit accounts';
    END IF;
    IF p_billing_cutoff_day < 1 OR p_billing_cutoff_day > 31 THEN
      RAISE EXCEPTION 'Billing cutoff day must be between 1 and 31';
    END IF;
  END IF;

  INSERT INTO accounts (
    user_id, name, type, initial_balance, currency, sum_to_total, color,
    credit_limit, billing_cutoff_day
  )
  VALUES (
    auth.uid(), p_name, p_type, p_initial_balance, p_currency, p_sum_to_total,
    p_color, p_credit_limit,
    CASE WHEN p_type = 'credit' THEN p_billing_cutoff_day ELSE NULL END
  )
  RETURNING * INTO v_account;

  RETURN v_account;
END;
$function$;

-- ---------------------------------------------------------------------------
-- 3) update_account · día de corte obligatorio para crédito (y validado 1-31)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_account(
  p_account_id uuid,
  p_name text,
  p_type account_type,
  p_initial_balance numeric,
  p_currency text,
  p_sum_to_total boolean,
  p_color text DEFAULT NULL::text,
  p_credit_limit numeric DEFAULT NULL::numeric,
  p_billing_cutoff_day smallint DEFAULT NULL::smallint
)
RETURNS accounts
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_account accounts;
  v_tx_sum numeric;
  v_desired_balance numeric;
  v_current_type account_type;
BEGIN
  IF trim(p_name) = '' THEN
    RAISE EXCEPTION 'Account name cannot be empty';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM accounts
    WHERE user_id = auth.uid() AND id = p_account_id
  ) THEN
    RAISE EXCEPTION 'Account not found for user';
  END IF;

  IF EXISTS (
    SELECT 1 FROM accounts
    WHERE user_id = auth.uid()
      AND lower(name) = lower(p_name)
      AND id <> p_account_id
      AND is_archived = false
  ) THEN
    RAISE EXCEPTION 'Account name already exists';
  END IF;

  SELECT type INTO v_current_type FROM accounts WHERE id = p_account_id;

  IF COALESCE(p_type, v_current_type) = 'credit' THEN
    IF p_billing_cutoff_day IS NULL THEN
      RAISE EXCEPTION 'Billing cutoff day is required for credit accounts';
    END IF;
    IF p_billing_cutoff_day < 1 OR p_billing_cutoff_day > 31 THEN
      RAISE EXCEPTION 'Billing cutoff day must be between 1 and 31';
    END IF;
    v_desired_balance := p_initial_balance;
  ELSE
    SELECT COALESCE(SUM(
      CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END
    ), 0) INTO v_tx_sum
    FROM transactions t
    WHERE t.account_id = p_account_id AND t.deleted_at IS NULL;

    v_desired_balance := p_initial_balance - v_tx_sum;
  END IF;

  UPDATE accounts SET
    name = COALESCE(p_name, name),
    type = COALESCE(p_type, type),
    initial_balance = COALESCE(v_desired_balance, initial_balance),
    currency = COALESCE(p_currency, currency),
    sum_to_total = COALESCE(p_sum_to_total, sum_to_total),
    color = COALESCE(p_color, color),
    credit_limit = COALESCE(p_credit_limit, credit_limit),
    billing_cutoff_day = CASE
      WHEN COALESCE(p_type, v_current_type) = 'credit'
      THEN p_billing_cutoff_day
      ELSE NULL
    END,
    updated_at = NOW()
  WHERE id = p_account_id RETURNING * INTO v_account;

  RETURN v_account;
END;
$function$;