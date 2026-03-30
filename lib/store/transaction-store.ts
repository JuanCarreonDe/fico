// import { create } from "zustand";
// import { Database } from "@/database.types";

// interface TransactionState {
//   // Data
//   summary:
//     | Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"]
//     | null;
//   dailySummaryCurrentMonth:
//     | Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"]
//     | null;
//   accountBalances:
//     | Database["public"]["Functions"]["get_account_balances"]["Returns"]
//     | null;
//   transactionsByDay: {
//     [
//       key: string
//     ]: Database["public"]["Functions"]["get_transactions_by_day"]["Returns"];
//   };

//   // Loading states
//   isLoadingSummary: boolean;
//   isLoadingDailySummary: boolean;
//   isLoadingAccountBalances: boolean;

//   // Actions
//   setSummary: (
//     summary: Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"],
//   ) => void;
//   setDailySummaryCurrentMonth: (
//     dailySummary: Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"],
//   ) => void;
//   setAccountBalances: (
//     balances: Database["public"]["Functions"]["get_account_balances"]["Returns"],
//   ) => void;
//   setTransactionsByDay: (
//     date: string,
//     transactions: Database["public"]["Functions"]["get_transactions_by_day"]["Returns"],
//   ) => void;

//   // Refresh actions
//   refreshAllData: () => Promise<void>;
//   refreshSummary: () => Promise<void>;
//   refreshDailySummary: () => Promise<void>;
//   refreshAccountBalances: () => Promise<void>;

//   // Transaction created callback
//   onTransactionCreated: () => Promise<void>;
// }

// export const useTransactionStore = create<TransactionState>((set, get) => ({
//   // Initial state
//   summary: null,
//   dailySummaryCurrentMonth: null,
//   accountBalances: null,
//   transactionsByDay: {},

//   isLoadingSummary: false,
//   isLoadingDailySummary: false,
//   isLoadingAccountBalances: false,

//   // Setters
//   setSummary: (summary) => set({ summary }),
//   setDailySummaryCurrentMonth: (dailySummaryCurrentMonth) =>
//     set({ dailySummaryCurrentMonth }),
//   setAccountBalances: (accountBalances) => set({ accountBalances }),
//   setTransactionsByDay: (date, transactions) =>
//     set((state) => ({
//       transactionsByDay: { ...state.transactionsByDay, [date]: transactions },
//     })),

//   // Refresh actions
//   refreshAllData: async () => {
//     await Promise.all([
//       get().refreshSummary(),
//       get().refreshDailySummary(),
//       get().refreshAccountBalances(),
//     ]);
//   },

//   refreshSummary: async () => {
//     set({ isLoadingSummary: true });
//     try {
//       const { refreshSummaryClient } =
//         await import("@/app/transactions/actions-client");
//       const summary = await refreshSummaryClient();
//       set({ summary, isLoadingSummary: false });
//     } catch (error) {
//       console.error("Error refreshing summary:", error);
//       set({ isLoadingSummary: false });
//     }
//   },

//   refreshDailySummary: async () => {
//     set({ isLoadingDailySummary: true });
//     try {
//       const { refreshDailySummaryClient } =
//         await import("@/app/transactions/actions-client");
//       const dailySummaryCurrentMonth = await refreshDailySummaryClient();
//       set({ dailySummaryCurrentMonth, isLoadingDailySummary: false });
//     } catch (error) {
//       console.error("Error refreshing daily summary:", error);
//       set({ isLoadingDailySummary: false });
//     }
//   },

//   refreshAccountBalances: async () => {
//     set({ isLoadingAccountBalances: true });
//     try {
//       const { refreshAccountBalancesClient } =
//         await import("@/app/transactions/actions-client");
//       const accountBalances = await refreshAccountBalancesClient();
//       set({ accountBalances, isLoadingAccountBalances: false });
//     } catch (error) {
//       console.error("Error refreshing account balances:", error);
//       set({ isLoadingAccountBalances: false });
//     }
//   },

//   // Called when a new transaction is created
//   onTransactionCreated: async () => {
//     // Refresh all data to reflect the new transaction
//     await get().refreshAllData();

//     // Clear cached transactions by day since they might be outdated
//     set({ transactionsByDay: {} });
//   },
// }));
