"use client";

import React from "react";
import { Database } from "@/database.types";
import { useTransactionStore } from "@/lib/store/transaction-store";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  children: React.ReactNode;
  initialData?: {
    summary: Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"] | null;
    dailySummaryCurrentMonth: Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"] | null;
    accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"] | null;
    userAccounts: Database["public"]["Functions"]["get_user_accounts"]["Returns"] | null;
    userCategories: Database["public"]["Functions"]["get_user_categories"]["Returns"] | null;
  };
}

export function TransactionsProvider({ children, initialData }: Props) {
  const storeInitialized = useTransactionStore((state) => state.isInitialized);
  const [isClientInitialized, setIsClientInitialized] = React.useState(false);

  React.useEffect(() => {
    if (!storeInitialized && initialData?.summary) {
      useTransactionStore.getState().initializeData({
        summary: initialData.summary,
        dailySummaryCurrentMonth: initialData.dailySummaryCurrentMonth ?? null,
        accountBalances: initialData.accountBalances ?? null,
        userAccounts: initialData.userAccounts ?? null,
        userCategories: initialData.userCategories ?? null,
      });
    }
    setIsClientInitialized(true);
  }, [storeInitialized, initialData]);

  if (!isClientInitialized) {
    return <Skeleton className="" />;
  }

  return <>{children}</>;
}
