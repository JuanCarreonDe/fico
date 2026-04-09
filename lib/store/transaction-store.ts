import { create } from "zustand";
import { Database } from "@/database.types";
import { createClient } from "@/lib/db/client";

interface TransactionState {
  // Data initialization flag
  isInitialized: boolean;
  isLoading: boolean;

  // Data
  summary:
    | Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"]
    | null;
  dailySummaryCurrentMonth:
    | Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"]
    | null;
  accountBalances:
    | Database["public"]["Functions"]["get_account_balances"]["Returns"]
    | null;
  userAccounts:
    | Database["public"]["Functions"]["get_user_accounts"]["Returns"]
    | null;
  userCategories:
    | Database["public"]["Functions"]["get_user_categories"]["Returns"]
    | null;
  transactionsByDay: {
    [
      key: string
    ]: Database["public"]["Functions"]["get_transactions_by_day"]["Returns"];
  };

  // Loading states
  // isLoading: boolean;

  // Actions
  setSummary: (
    summary: Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"],
  ) => void;
  setDailySummaryCurrentMonth: (
    dailySummary: Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"],
  ) => void;
  setIsLoading: (loading: boolean) => void;
  setAccountBalances: (
    balances: Database["public"]["Functions"]["get_account_balances"]["Returns"],
  ) => void;
  setUserAccounts: (
    accounts: Database["public"]["Functions"]["get_user_accounts"]["Returns"],
  ) => void;
  setUserCategories: (
    categories: Database["public"]["Functions"]["get_user_categories"]["Returns"],
  ) => void;
  setTransactionsByDay: (
    date: string,
    transactions: Database["public"]["Functions"]["get_transactions_by_day"]["Returns"],
  ) => void;
  removeTransaction: (date: string, transactionId: string) => void;

  // Initialize data from server
  initializeData: (data: {
    summary:
      | Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"]
      | null;
    dailySummaryCurrentMonth:
      | Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"]
      | null;
    accountBalances:
      | Database["public"]["Functions"]["get_account_balances"]["Returns"]
      | null;
    userAccounts:
      | Database["public"]["Functions"]["get_user_accounts"]["Returns"]
      | null;
    userCategories:
      | Database["public"]["Functions"]["get_user_categories"]["Returns"]
      | null;
  }) => void;
  refreshData: () => Promise<void>;
  resetStore: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  // Initial state
  isInitialized: false,
  isLoading: false,
  summary: null,
  dailySummaryCurrentMonth: null,
  accountBalances: null,
  userAccounts: null,
  userCategories: null,
  transactionsByDay: {},
  // isLoading: false,

  // Setters
  setSummary: (summary) => set({ summary }),
  setDailySummaryCurrentMonth: (dailySummaryCurrentMonth) =>
    set({ dailySummaryCurrentMonth }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setAccountBalances: (accountBalances) => set({ accountBalances }),
  setUserAccounts: (userAccounts) => set({ userAccounts }),
  setUserCategories: (userCategories) => set({ userCategories }),
  setTransactionsByDay: (date, transactions) =>
    set((state) => ({
      transactionsByDay: { ...state.transactionsByDay, [date]: transactions },
    })),
  removeTransaction: (date, transactionId) =>
    set((state) => {
      const dayTransactions = state.transactionsByDay[date];
      if (!dayTransactions) return state;
      return {
        transactionsByDay: {
          ...state.transactionsByDay,
          [date]: dayTransactions.filter((t) => t.id !== transactionId),
        },
      };
    }),

  // Initialize data from server
  initializeData: (data) =>
    set({
      isInitialized: true,
      isLoading: false,
      summary: data.summary,
      dailySummaryCurrentMonth: data.dailySummaryCurrentMonth,
      accountBalances: data.accountBalances,
      userAccounts: data.userAccounts,
      userCategories: data.userCategories,
    }),

  refreshData: async () => {
    set({ isLoading: true });
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

      set({
        isInitialized: true,
        isLoading: false,
        summary,
        dailySummaryCurrentMonth,
        accountBalances,
        userAccounts,
        userCategories,
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      set({ isLoading: false });
    }
  },

  resetStore: () =>
    set({
      isInitialized: false,
      isLoading: false,
      summary: null,
      dailySummaryCurrentMonth: null,
      accountBalances: null,
      userAccounts: null,
      userCategories: null,
      transactionsByDay: {},
      // isLoading: false,
    }),
}));
