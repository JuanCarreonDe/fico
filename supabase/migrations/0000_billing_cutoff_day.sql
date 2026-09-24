-- ============================================================================
-- 0000_billing_cutoff_day.sql
-- Fecha de corte por tarjeta de crédito (FICO real + FICO-demo).
--
-- Separa lo FACTURADO (vence / cifra principal del dashboard) de lo
-- EN PROCESO (se factura en el próximo corte).
--
-- NOTA schema (verificado en ambas BD, 2026-09-26):
--   accounts      -> initial_balance, is_archived  (NO hay is_deleted)
--   transactions  -> deleted_at, is_archived
--   RPC se llama desde el feed (account-manage-wrapper -> getAccountBalances)
--
-- Idempotente / re-ejecutable.
-- ============================================================================

-- 1) Día de corte por cuenta (1-31; NULL = sin corte).
ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS billing_cutoff_day smallint;

COMMENT ON COLUMN public.accounts.billing_cutoff_day IS
  'Día del mes (1-31) en que la tarjeta de crédito cierra su ciclo (corte). NULL = sin corte (legacy: balance = suma de todas las tx).';

-- 2) get_account_balances (tx-driven + corte).
DROP FUNCTION IF EXISTS public.get_account_balances();

CREATE OR REPLACE FUNCTION public.get_account_balances()
RETURNS TABLE(
  account_id uuid,
  account_name text,
  account_type text,
  account_currency text,
  account_created_at timestamp with time zone,
  balance numeric,
  account_sum_to_total boolean,
  account_color text,
  credit_limit numeric,
  billing_cutoff_day smallint,
  credit_balance numeric,
  credit_pending numeric
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
    a.billing_cutoff_day,
    CASE
      WHEN a.billing_cutoff_day IS NOT NULL THEN
        date_trunc('month', CURRENT_DATE)::date
          + (CASE
               WHEN extract(day FROM CURRENT_DATE) >= a.billing_cutoff_day
                 THEN
                   LEAST(a.billing_cutoff_day, extract(day FROM (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day'))::int) - 1
               ELSE
                   LEAST(a.billing_cutoff_day, extract(day FROM date_trunc('month', CURRENT_DATE) - interval '1 day')::int) - 1
             END)::int
      ELSE NULL
    END AS last_cutoff
  FROM accounts a
),
billed_tx AS (
  SELECT
    t.account_id,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) AS billed
  FROM transactions t
  JOIN cutoff_ctx c ON c.account_id = t.account_id
  WHERE t.deleted_at IS NULL
    AND c.last_cutoff IS NOT NULL
    AND t.transaction_date::date <= c.last_cutoff
  GROUP BY t.account_id
),
pending_tx AS (
  SELECT
    t.account_id,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) AS pending
  FROM transactions t
  JOIN cutoff_ctx c ON c.account_id = t.account_id
  WHERE t.deleted_at IS NULL
    AND c.last_cutoff IS NOT NULL
    AND t.transaction_date::date > c.last_cutoff
  GROUP BY t.account_id
)
SELECT
  a.id,
  a.name,
  a.type::text,
  a.currency,
  a.created_at,
  CASE
    WHEN a.type = 'credit' AND c.billing_cutoff_day IS NOT NULL THEN COALESCE(b.billed, 0)
    ELSE a.initial_balance + COALESCE(t.tx_sum, 0)
  END AS balance,
  a.sum_to_total,
  a.color,
  a.credit_limit,
  a.billing_cutoff_day,
  CASE
    WHEN a.type = 'credit' AND c.billing_cutoff_day IS NOT NULL THEN COALESCE(b.billed, 0)
    ELSE 0
  END AS credit_balance,
  CASE
    WHEN a.type = 'credit' AND c.billing_cutoff_day IS NOT NULL THEN COALESCE(p.pending, 0)
    ELSE 0
  END AS credit_pending
FROM accounts a
LEFT JOIN tx_totals t ON t.account_id = a.id
LEFT JOIN cutoff_ctx c ON c.account_id = a.id
LEFT JOIN billed_tx b ON b.account_id = a.id
LEFT JOIN pending_tx p ON p.account_id = a.id
WHERE a.user_id = auth.uid()
  AND a.is_archived = false;
$function$;
