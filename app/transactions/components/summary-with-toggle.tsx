"use client";

import * as React from "react";
import { ArrowUpRight, ArrowDownLeft, Scale, Eye, EyeOff } from "lucide-react";
import { TransactionsMetricCard } from "./transactions-metric-card";
import { createClient } from "@/lib/db/client";
import { useAuth } from "@/components/auth-provider";
import { useTransactionStore } from "@/lib/store/transaction-store";
import { formatCurrency } from "@/lib/format-currency";

interface Props {
  total_balance: number;
  income: number;
  balance: number;
  expense: number;
  credit_debt: number;
}

export default function SummaryWithToggle({
  total_balance,
  income,
  balance,
  expense,
  credit_debt,
}: Props) {
  const { user } = useAuth();
  const supabase = React.useMemo(() => createClient(), []);

  const [showAmounts, setShowAmounts] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  const showAmountsRef = React.useRef(true);
  const initialShowAmountsRef = React.useRef(true);
  const pendingSavedRef = React.useRef(true);
  const isMountedRef = React.useRef(true);

  const saveToDb = React.useCallback(
    async (valueToSave: boolean) => {
      if (!user?.id) return;

      await supabase
        .from("profiles")
        .upsert(
          { id: user.id, show_amounts: valueToSave },
          { onConflict: "id" },
        );
    },
    [user, supabase],
  );

  React.useEffect(() => {
    async function fetchShowAmounts() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("show_amounts")
        .eq("id", user.id)
        .single();

      const savedValue = data?.show_amounts ?? true;
      setShowAmounts(savedValue);
      showAmountsRef.current = savedValue;
      initialShowAmountsRef.current = savedValue;
      pendingSavedRef.current = savedValue;
      useTransactionStore.getState().setShowAmounts(savedValue);
      setLoading(false);
    }

    fetchShowAmounts();
  }, [user, supabase]);

  React.useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      const currentValue = showAmountsRef.current;
      const initialValue = initialShowAmountsRef.current;
      const savedValue = pendingSavedRef.current;

      if (currentValue !== initialValue && currentValue !== savedValue) {
        saveToDb(currentValue);
      }
    };
  }, [saveToDb]);

  React.useEffect(() => {
    if (loading) return;
    if (showAmounts === pendingSavedRef.current) return;

    const timer = setTimeout(async () => {
      await saveToDb(showAmounts);
      pendingSavedRef.current = showAmounts;
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [showAmounts, loading, saveToDb]);

  const handleToggle = () => {
    const newValue = !showAmounts;
    setShowAmounts(newValue);
    showAmountsRef.current = newValue;
    useTransactionStore.getState().setShowAmounts(newValue);
  };

  const formatValue = (value: string) => {
    return showAmounts ? value : "******";
  };

  // Deuda de TDC en positivo (lo que se debe).
  const debt = Math.abs(Number(credit_debt) || 0);
  const realBalance = total_balance - debt;
  const hasDebt = debt > 0;
  const pctDebt =
    total_balance > 0 ? Math.min(100, (debt / total_balance) * 100) : 0;

  if (loading) {
    return (
      <>
        <div className="text-center mb-8">
          <div className="animate-pulse">
            <div className="h-10 bg-muted rounded w-40 mx-auto mb-2" />
            <div className="h-4 bg-muted rounded w-60 mx-auto" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="animate-pulse h-20 bg-muted rounded-lg" />
          <div className="animate-pulse h-20 bg-muted rounded-lg" />
          <div className="animate-pulse h-20 bg-muted rounded-lg" />
          <div className="animate-pulse h-20 bg-muted rounded-lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-center mb-8 flex flex-col gap-1">
        <div className="relative inline-block">
          <div className="text-4xl font-bold text-primary mb-2 transition-opacity duration-300 animate-in fade-in">
            {formatValue(formatCurrency(total_balance))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground flex items-center justify-center ">
          <button
            onClick={handleToggle}
            className="px-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showAmounts ? "Ocultar montos" : "Mostrar montos"}
          >
            {showAmounts ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
          Saldo en tus cuentas
        </p>
        {hasDebt && (
          <div className="mt-2 flex items-center justify-center gap-2 sm:gap-5 animate-in fade-in duration-500">
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm sm:text-base font-semibold tabular-nums text-red-600 dark:text-red-400">
                {formatValue(`− ${formatCurrency(debt)}`)}
              </span>
              <span className="text-[10px] tracking-wide text-muted-foreground text-left">
                TDC por pagar
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="flex h-5 items-center sm:h-6">
                <span className="block h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:w-24">
                  <span
                    className="block h-full rounded-full bg-red-500 transition-[width] duration-500"
                    style={{ width: `${pctDebt}%` }}
                  />
                </span>
              </span>
              <span className="text-[10px] tracking-wide text-muted-foreground text-center">
                {total_balance > 0
                  ? `${Math.round(pctDebt)}% comprometido`
                  : "Sin saldo"}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span
                className={`text-sm sm:text-base font-semibold tabular-nums ${
                  realBalance < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-accent"
                }`}
              >
                {formatValue(formatCurrency(realBalance))}
              </span>
              <span className="text-[10px] tracking-wide text-muted-foreground text-right">
                Real
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <TransactionsMetricCard
          title="Ingresos"
          value={formatValue(formatCurrency(income))}
          icon={<ArrowDownLeft className="w-4 h-4" />}
          variant="income"
        />

        <TransactionsMetricCard
          title="Balance"
          value={formatValue(formatCurrency(balance))}
          icon={<Scale className="w-4 h-4 text-accent" />}
          variant="balance"
        />

        <TransactionsMetricCard
          title="Gastos"
          value={formatValue(formatCurrency(expense))}
          icon={<ArrowUpRight className="w-4 h-4" />}
          variant="expense"
        />
      </div>
    </>
  );
}
