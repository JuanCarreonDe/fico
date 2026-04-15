"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useDashboardStore } from "@/lib/store/dashboard-store";

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const { isInitialized: dashboardInitialized, loadDashboardData, resetStore: resetDashboardStore } =
    useDashboardStore();
  const loadingRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user || dashboardInitialized || loadingRef.current) return;

      loadingRef.current = true;

      try {
        await loadDashboardData();
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        loadingRef.current = false;
      }
    };

    loadData();
  }, [user, dashboardInitialized, loadDashboardData]);

  useEffect(() => {
    if (!user) {
      resetDashboardStore();
    }
  }, [user, resetDashboardStore]);

  return <>{children}</>;
}