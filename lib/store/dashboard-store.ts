import { create } from "zustand";
import { createClient } from "@/lib/db/client";

interface DashboardState {
  isInitialized: boolean;
  isLoading: boolean;
  categoryExpenseData: { category_name: string; total_amount: number }[] | null;
  dailySummaryData:
    | { day_date: string; total_expense: number; total_income: number }[]
    | null;
  budgetProgressData:
    | {
        category_id: string;
        category_name: string;
        budget_amount: number;
        spent_amount: number;
        percentage_used: number;
      }[]
    | null;

  loadDashboardData: (month?: string) => Promise<void>;
  refreshDashboardData: () => Promise<void>;
  resetStore: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  isInitialized: false,
  isLoading: false,
  selectedMonth: new Date().toISOString().slice(0, 7),
  categoryExpenseData: null,
  dailySummaryData: null,
  budgetProgressData: null,

  loadDashboardData: async (month?: string) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true });
    try {
      const supabase = createClient();

      const currentMonth = new Date().toISOString().slice(0, 7);
      const currentMonthFullDate = `${currentMonth}-01`;

      const monthParam = month
        ? month.length <= 7
          ? `${month}-01`
          : month
        : currentMonthFullDate;

      const [categoryResponse, dailySummaryResponse, budgetProgressResponse] =
        await Promise.all([
          supabase.rpc("get_category_summary", {
            p_type: "expense",
            p_period: "month",
            p_month: monthParam,
          }),
          supabase.rpc("get_daily_summary_by_month", {
            p_month: monthParam,
          }),
          supabase.rpc("get_all_categories_budget_summary", {
            p_month: monthParam,
          }),
        ]);

      set({
        isInitialized: true,
        isLoading: false,
        categoryExpenseData: categoryResponse.data ?? [],
        dailySummaryData: dailySummaryResponse.data ?? [],
        budgetProgressData: budgetProgressResponse.data ?? [],
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
      categoryExpenseData: null,
      dailySummaryData: null,
      budgetProgressData: null,
    }),
}));
