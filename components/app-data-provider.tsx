"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useTransactionStore } from "@/lib/store/transaction-store";
import { createClient } from "@/lib/db/client";

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const { isInitialized, initializeData, resetStore } = useTransactionStore();
  const loadingRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user || isInitialized || loadingRef.current) return;

      loadingRef.current = true;
      useTransactionStore.setState({ isLoading: true });

      try {
        const supabase = createClient();
        const [
          { data: summary },
          { data: dailySummaryCurrentMonth },
          { data: accountBalances },
          { data: userAccounts },
          { data: userCategories },
        ] = await Promise.all([
          supabase.rpc("get_monthly_financial_summary"),
          supabase.rpc("get_daily_summary_by_month"),
          supabase.rpc("get_account_balances"),
          supabase.rpc("get_user_accounts"),
          supabase.rpc("get_user_categories"),
        ]);

        initializeData({
          summary,
          dailySummaryCurrentMonth,
          accountBalances,
          userAccounts,
          userCategories,
        });
      } catch (error) {
        console.error("Error loading app data:", error);
        useTransactionStore.setState({ isLoading: false });
      } finally {
        loadingRef.current = false;
      }
    };

    loadData();
  }, [user, isInitialized, initializeData]);

  useEffect(() => {
    if (!user) {
      resetStore();
    }
  }, [user, resetStore]);

  return <>{children}</>;
}
