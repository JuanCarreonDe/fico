import { create } from "zustand";
import { createClient } from "@/lib/db/client";

interface DashboardState {
  isInitialized: boolean;
  isLoading: boolean;
  selectedMonth: string;
  categoryExpenseData:
    | { category_name: string; total_amount: number }[]
    | null;
  dailySummaryData:
    | {
        day_date: string;
        total_income: number;
        total_expense: number;
      }[]
    | null;

  setSelectedMonth: (month: string) => void;
  loadDashboardData: () => Promise<void>;
  refreshDashboardData: () => Promise<void>;
  resetStore: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  isInitialized: false,
  isLoading: false,
  selectedMonth: new Date().toISOString().slice(0, 7),
  categoryExpenseData: null,
  dailySummaryData: null,

  setSelectedMonth: (month) => {
    set({ selectedMonth: month });
    get().loadDashboardData();
  },

  loadDashboardData: async () => {
    const { selectedMonth, isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true });
    try {
      const supabase = createClient();
      const monthParam =
        selectedMonth.length <= 7 ? `${selectedMonth}-01` : selectedMonth;

      const [categoryResponse, dailyResponse] = await Promise.all([
        supabase.rpc("get_category_summary", {
          p_type: "expense",
          p_period: "month",
          p_month: monthParam,
        }),
        supabase.rpc("get_daily_summary_by_month", {
          p_month: monthParam,
        }),
      ]);

      set({
        isInitialized: true,
        isLoading: false,
        categoryExpenseData: categoryResponse.data ?? [],
        dailySummaryData: dailyResponse.data ?? [],
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      set({ isLoading: false });
    }
  },

  refreshDashboardData: async () => {
    await get().loadDashboardData();
  },

  resetStore: () =>
    set({
      isInitialized: false,
      isLoading: false,
      selectedMonth: new Date().toISOString().slice(0, 7),
      categoryExpenseData: null,
      dailySummaryData: null,
    }),
}));
