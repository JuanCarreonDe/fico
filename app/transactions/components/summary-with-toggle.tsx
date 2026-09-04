"use client";

import * as React from "react";
import { ArrowUpRight, ArrowDownLeft, Scale, Eye, EyeOff } from "lucide-react";
import { TransactionsMetricCard } from "./transactions-metric-card";
import { createClient } from "@/lib/db/client";
import { useAuth } from "@/components/auth-provider";
import { useTransactionStore } from "@/lib/store/transaction-store";

interface Props {
  total_balance: string;
  income: string;
  balance: string;
  expense: string;
}

export default function SummaryWithToggle({
  total_balance,
  income,
  balance,
  expense,
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

  if (loading) {
    return (
      <>
        <div className="text-center mb-8">
          <div className="animate-pulse">
            <div className="h-10 bg-muted rounded w-40 mx-auto mb-2" />
            <div className="h-4 bg-muted rounded w-60 mx-auto" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="animate-pulse h-20 bg-muted rounded-lg" />
          <div className="animate-pulse h-20 bg-muted rounded-lg" />
          <div className="animate-pulse h-20 bg-muted rounded-lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="text-4xl font-bold text-primary mb-2 transition-opacity duration-300 animate-in fade-in">
            {formatValue(total_balance)}
          </div>
        </div>
        <p className="text-sm text-muted-foreground flex items-center justify-center">
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
          Balance total de todas las cuentas
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <TransactionsMetricCard
          title="Ingresos"
          value={formatValue(income)}
          icon={<ArrowDownLeft className="w-4 h-4" />}
          variant="income"
        />

        <TransactionsMetricCard
          title="Balance"
          value={formatValue(balance)}
          icon={<Scale className="w-4 h-4 text-accent" />}
          variant="balance"
        />

        <TransactionsMetricCard
          title="Gastos"
          value={formatValue(expense)}
          icon={<ArrowUpRight className="w-4 h-4" />}
          variant="expense"
        />
      </div>
    </>
  );
}
