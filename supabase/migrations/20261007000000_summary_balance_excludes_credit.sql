-- ============================================================================
-- 2026-10-07 · get_monthly_financial_summary: la deuda de TDC se resta UNA vez
--
-- Problema:
--   total_balance_calc sumaba las cuentas de crédito con sum_to_total = true
--   (ya restando la deuda dentro del balance) y además se reportaba
--   total_credit_debt para restarla otra vez en la UI → doble descuento.
--   Además total_credit_debt llegaba negativo (facturado + en proceso son
--   negativos al deber), lo que obligaba a interpretar el signo en la UI.
--
-- Cambios:
--   1. total_balance_calc excluye account_type = 'credit':
--      total_balance = dinero en tus cuentas no-crédito
--      (banco / efectivo / ahorros). La deuda ya no vive dentro de él.
--
--   2. total_credit_debt ahora regresa la deuda POSITIVA (lo que se debe):
--        por tarjeta: GREATEST(0, -(facturado + en proceso))
--      Un saldo a favor (sobrepago) aporta 0: no es deuda.
--
-- Con esto la UI puede hacer:  real = total_balance - total_credit_debt
-- sin importar el valor de accounts.sum_to_total.
--
-- Idempotente: DROP + CREATE (el RETURNS TABLE cambió → 42P13 si no se dropea).
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
      AND t.deleted_at IS NULL
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
      AND a.type != 'credit'                       -- (1) la deuda no vive aquí
      AND (t.is_archived = false OR t.is_archived IS NULL)
      AND t.deleted_at IS NULL
      AND (t.type != 'transfer' OR t.type IS NULL)
      AND a.sum_to_total = true
  ),
  credit_debt_calc AS (
    -- Para cuentas de crédito, credit_balance = facturado y credit_pending =
    -- movimientos posteriores al último corte ("en proceso"). Ambos son
    -- negativos cuando se debe dinero, por eso se invierte el signo.
    SELECT COALESCE(
      SUM(
        GREATEST(
          0,
          -(COALESCE(g.credit_balance, 0) + COALESCE(g.credit_pending, 0))
        )
      ),
      0
    ) AS debt
    FROM public.get_account_balances() g
    WHERE g.account_type = 'credit'
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
