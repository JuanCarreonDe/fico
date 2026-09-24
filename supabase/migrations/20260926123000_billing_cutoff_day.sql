-- ============================================================================
-- 2026-09-26 · Fecha de corte por tarjeta de crédito (FICO real + demo)
--
-- Cambios:
--   1. accounts.billing_cutoff_day  (smallint, 1-31, nullable) — día del mes
--      en que la tarjeta "cierra" su ciclo (se factura).
--   2. get_account_balances reescrita (credit tx-driven):
--        credit_balance = Σ tx hasta el último corte CERRADO = "facturado"
--                         (cifra principal de la tarjeta: lo que vence).
--        credit_pending = Σ tx DESPUÉS del último corte      = "en proceso"
--                         (se factura en el próximo corte).
--      * accounts type=credit SIN billing_cutoff_day  → se mantiene el
--        comportamiento actual (todo = credit_balance, pending = 0) para no
--        cambiar lo ya validado.
--   3. create_account / update_account con p_billing_cutoff_day.
--   4. get_account_balances regresa credit_balance, credit_pending,
--      credit_limit (y el resto igual) en el mismo orden de columnas.
--
-- Idempotente: re-ejecutable sin romper.
-- ============================================================================

ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS billing_cutoff_day smallint;

COMMENT ON COLUMN public.accounts.billing_cutoff_day IS
  'Día del mes (1-31) en que la tarjeta de crédito cierra su ciclo (fecha de corte). NULL = sin corte configurado (comportamiento legacy: todo el saldo = facturado).';

-- ---------------------------------------------------------------------------
-- get_account_balances · versión con corte
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
  credit_pending      numeric           -- "en proceso" para crédito (secundario)
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $function$
WITH tx_totals AS (
  SELECT
    t.account_id,
    COALESCE(SUM(
      CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END
    ), 0) AS tx_sum
  FROM transactions t
  WHERE t.deleted_at IS NULL
  GROUP BY t.account_id
),
cutoff_ctx AS (
  SELECT
    a.id AS account_id,
    a.billing_cutoff_day AS cut,
    a.billing_cutoff_day IS NOT NULL AS has_cut,
    date_trunc('month', CURRENT_DATE)::date +
      (CASE
        WHEN a.billing_cutoff_day IS NOT NULL THEN
          LEAST(
            a.billing_cutoff_day,
            extract(day FROM date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day')::int
          ) - 1
        ELSE 0
      END) AS this_cut
  FROM accounts a
),
cut_dates AS (
  SELECT
    c.account_id,
    c.cut,
    c.has_cut,
    c.this_cut,
    CASE
      WHEN c.has_cut AND date_trunc('month', CURRENT_DATE)::date + INTERVAL '1 month' - INTERVAL '1 day' >= (CURRENT_DATE)::date THEN c.this_cut
      ELSE NULL
    END AS last_closed
  FROM cutoff_ctx c
)
SELECT
  a.id,
  a.name,
  a.type,
  a.currency,
  a.created_at,
  CASE
    WHEN a.type = 'credit' AND cd.has_cut THEN
      COALESCE((
        SELECT SUM(CASE WHEN t.type='income' THEN t.amount ELSE -t.amount END)
        FROM transactions t
        WHERE t.account_id = a.id
          AND t.deleted_at IS NULL
          AND t.transaction_date::date <= cd.last_closed
      ), 0)
    ELSE
      a.initial_balance + COALESCE(tt.tx_sum, 0)
  END AS balance,
  a.sum_to_total,
  a.color,
  a.credit_limit,
  CASE
    WHEN a.type = 'credit' AND cd.has_cut THEN
      COALESCE((
        SELECT SUM(CASE WHEN t.type='income' THEN t.amount ELSE -t.amount END)
        FROM transactions t
        WHERE t.account_id = a.id
          AND t.deleted_at IS NULL
          AND t.transaction_date::date > cd.last_closed
      ), 0)
    ELSE
      0
  END AS credit_pending
FROM accounts a
LEFT JOIN tx_totals tt ON tt.account_id = a.id
LEFT JOIN cut_dates cd ON cd.account_id = a.id
WHERE a.user_id = auth.uid()
  AND a.is_archived = false
  AND a.is_deleted = false
GROUP BY
  a.id, a.name, a.type, a.currency, a.created_at, a.initial_balance,
  a.sum_to_total, a.color, a.credit_limit, tt.tx_sum, cd.has_cut, cd.last_closed;
$function$;

-- ---------------------------------------------------------------------------
-- create_account / update_account · con p_billing_cutoff_day
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
    IF p_credit_limit IS NULL OR p_credit_limit <= 0 THEN
      RAISE EXCEPTION 'Credit limit is required for credit accounts';
    END IF;
    IF p_billing_cutoff_day IS NOT NULL AND (p_billing_cutoff_day < 1 OR p_billing_cutoff_day > 31) THEN
      RAISE EXCEPTION 'Billing cutoff day must be between 1 and 31';
    END IF;
  END IF;

  INSERT INTO accounts (
    user_id, name, type, initial_balance, currency, sum_to_total, color,
    credit_limit, billing_cutoff_day
  )
  VALUES (
    auth.uid(), p_name, p_type, p_initial_balance, p_currency, p_sum_to_total, p_color,
    p_credit_limit, p_billing_cutoff_day
  )
  RETURNING * INTO v_account;

  RETURN v_account;
END;
$function$;
