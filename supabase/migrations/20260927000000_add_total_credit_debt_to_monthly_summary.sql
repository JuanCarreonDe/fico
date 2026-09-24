-- ============================================================================
-- 2026-09-27 · Deuda total de tarjetas de crédito en get_monthly_financial_summary
-- (FICO real + demo)
--
-- Cambios:
--   1. get_monthly_financial_summary ahora regresa también total_credit_debt:
--      suma de facturado (credit_balance) + en proceso (credit_pending) de todas
--      las cuentas de crédito del usuario. Reutiliza get_account_balances() para
--      mantener la lógica de fecha de corte consistente (transacciones después
--      del día de corte = pendiente; hasta el corte = facturado).
--
-- Idempotente: DROP + CREATE (el RETURNS TABLE cambia → 42P13 si no se dropea).
-- ============================================================================

DROP FUNCTION IF EXISTS public.get_monthly_financial_summary(text);

CREATE OR REPLACE FUNCTION public.get_monthly_financial_summary(p_month text DEFAULT NULL::text)
RETURNS TABLE(
  monthly_balance numeric,
  total_balance numeric,
  total_expense_month numeric,
  total_income_month numeric,
  total_credit_debt numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  target_month text;
  month_start date;
BEGIN
  IF p_month IS NOT NULL THEN
    target_month := CASE
      WHEN p_month ~ '^\d{4}-\d{2}$' THEN p_month || '-01'
      ELSE p_month
    END;
  ELSE
    target_month := date_trunc('month', CURRENT_DATE)::date::text;
  END IF;

  month_start := target_month::date;

  RETURN QUERY
  WITH monthly_transactions AS (
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'income' THEN amount ELSE 0 END), 0) as income,
      COALESCE(SUM(CASE WHEN t.type = 'expense' THEN amount ELSE 0 END), 0) as expense
    FROM transactions t
    INNER JOIN categories c ON c.id = t.category_id
    WHERE t.user_id = auth.uid()
      AND deleted_at IS NULL
      AND t.is_archived = false
      AND t.type != 'transfer'
      AND transaction_date >= month_start
      AND transaction_date < (month_start + interval '1 month')::date
  ),
  total_balance_calc AS (
    SELECT
      COALESCE(SUM(DISTINCT a.initial_balance),0) +
      COALESCE(SUM(
        CASE
          WHEN t.type = 'income' THEN t.amount
          ELSE -t.amount
        END
      ),0) AS balance
    FROM accounts a
    LEFT JOIN transactions t ON t.account_id = a.id
    WHERE a.user_id = auth.uid()
      AND a.is_archived = false
      AND (t.is_archived = false OR t.is_archived IS NULL)
      AND t.deleted_at IS NULL
      AND (t.type != 'transfer' OR t.type IS NULL)
      AND a.sum_to_total = true
  ),
  credit_debt_calc AS (
    SELECT COALESCE(SUM(
      COALESCE(credit_balance, 0) + COALESCE(credit_pending, 0)
    ), 0) AS debt
    FROM public.get_account_balances()
    WHERE account_type = 'credit'
  )
  SELECT
    (mt.income - mt.expense)::numeric as monthly_balance,
    tb.balance::numeric as total_balance,
    mt.expense::numeric as total_expense_month,
    mt.income::numeric as total_income_month,
    cd.debt::numeric as total_credit_debt
  FROM monthly_transactions mt
  CROSS JOIN total_balance_calc tb
  CROSS JOIN credit_debt_calc cd;
END;
$function$;