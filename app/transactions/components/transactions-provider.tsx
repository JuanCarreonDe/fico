"use client";

import { useEffect } from "react";
import { Database } from "@/database.types";
import { useTransactionStore } from "@/lib/store/transaction-store";

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

  useEffect(() => {
    // Initialize store with server data
    initializeData(initialData);
  }, [initialData, initializeData]);

  return <>{children}</>;
}
