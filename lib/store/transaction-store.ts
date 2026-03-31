import { create } from "zustand";
import { Database } from "@/database.types";

interface TransactionState {
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

  // Actions
  setSummary: (
    summary: Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"],
  ) => void;
  setDailySummaryCurrentMonth: (
    dailySummary: Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"],
  ) => void;
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

  // Initialize data from server
  initializeData: (data: {
    summary: Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"];
    dailySummaryCurrentMonth: Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"];
    accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"];
    userAccounts: Database["public"]["Functions"]["get_user_accounts"]["Returns"];
    userCategories: Database["public"]["Functions"]["get_user_categories"]["Returns"];
  }) => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  // Initial state
  summary: null,
  dailySummaryCurrentMonth: null,
  accountBalances: null,
  userAccounts: null,
  userCategories: null,
  transactionsByDay: {},

  // Setters
  setSummary: (summary) => set({ summary }),
  setDailySummaryCurrentMonth: (dailySummaryCurrentMonth) =>
    set({ dailySummaryCurrentMonth }),
  setAccountBalances: (accountBalances) => set({ accountBalances }),
  setUserAccounts: (userAccounts) => set({ userAccounts }),
  setUserCategories: (userCategories) => set({ userCategories }),
  setTransactionsByDay: (date, transactions) =>
    set((state) => ({
      transactionsByDay: { ...state.transactionsByDay, [date]: transactions },
    })),

  // Initialize data from server
  initializeData: (data) =>
    set({
      summary: data.summary,
      dailySummaryCurrentMonth: data.dailySummaryCurrentMonth,
      accountBalances: data.accountBalances,
      userAccounts: data.userAccounts,
      userCategories: data.userCategories,
    }),
}));
