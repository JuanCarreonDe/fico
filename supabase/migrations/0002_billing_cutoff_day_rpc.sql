-- FICO - billing_cutoff_day para create_account/update_account
-- Aplicar a AMBAS BD (real y demo): DROP + CREATE para evitar 42P13 (no se puede
-- cambiar la firma de una función existente, hay que DROP de la firma previa).
-- Idempotente: el DROP usa IF EXISTS y la firma exacta del estado previo.

DROP FUNCTION IF EXISTS public.create_account(
  text, account_type, numeric, text, boolean, text, numeric
);

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
    SELECT 1
    FROM accounts
    WHERE user_id = auth.uid()
      AND lower(name) = lower(p_name)
      AND is_archived = false
  ) THEN
    RAISE EXCEPTION 'Account already exists';
  END IF;

  IF p_type = 'credit' AND p_billing_cutoff_day IS NOT NULL
     AND (p_billing_cutoff_day < 1 OR p_billing_cutoff_day > 31) THEN
    RAISE EXCEPTION 'Billing cutoff day must be between 1 and 31';
  END IF;

  INSERT INTO accounts (
    user_id,
    name,
    type,
    initial_balance,
    currency,
    sum_to_total,
    color,
    credit_limit,
    billing_cutoff_day
  )
  VALUES (
    auth.uid(),
    p_name,
    p_type,
    p_initial_balance,
    p_currency,
    p_sum_to_total,
    p_color,
    p_credit_limit,
    CASE WHEN p_type = 'credit' THEN p_billing_cutoff_day ELSE NULL END
  )
  RETURNING * INTO v_account;

  RETURN v_account;
END;
$function$;

DROP FUNCTION IF EXISTS public.update_account(
  uuid, text, account_type, numeric, text, boolean, text, numeric
);

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
    SELECT 1
    FROM accounts
    WHERE user_id = auth.uid()
      AND lower(name) = lower(p_name)
      AND id <> p_account_id
      AND is_archived = false
  ) THEN
    RAISE EXCEPTION 'Account name already exists';
  END IF;

  SELECT type INTO v_current_type FROM accounts WHERE id = p_account_id;

  IF COALESCE(p_type, v_current_type) = 'credit' THEN
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
      THEN COALESCE(p_billing_cutoff_day, billing_cutoff_day)
      ELSE NULL
    END,
    updated_at = NOW()
  WHERE id = p_account_id RETURNING * INTO v_account;

  RETURN v_account;
END;
$function$;
