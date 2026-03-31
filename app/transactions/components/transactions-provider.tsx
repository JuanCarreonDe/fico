"use client";

import React from "react";
import { Database } from "@/database.types";
import { useTransactionStore } from "@/lib/store/transaction-store";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  children: React.ReactNode;
  initialData: {
    summary: Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"];
    dailySummaryCurrentMonth: Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"];
    accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"];
    userAccounts: Database["public"]["Functions"]["get_user_accounts"]["Returns"];
    userCategories: Database["public"]["Functions"]["get_user_categories"]["Returns"];
  };
}

export function TransactionsProvider({ children, initialData }: Props) {
  const initializeData = useTransactionStore((state) => state.initializeData);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    // Initialize store with server data
    initializeData(initialData);
    setIsInitialized(true);
  }, [initialData, initializeData]);

  // Don't render children until store is initialized
  if (!isInitialized) {
    return <Skeleton className="" />;
  }

  return <>{children}</>;
}
