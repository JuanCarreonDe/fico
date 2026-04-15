import { create } from "zustand";
import { Database } from "@/database.types";

interface TransactionState {
  isInitialized: boolean;
  isLoading: boolean;
  userCategories: Database["public"]["Functions"]["get_user_categories"]["Returns"] | null;
  accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"] | null;
  resetStore: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  isInitialized: true,
  isLoading: false,
  userCategories: null,
  accountBalances: null,
  resetStore: () =>
    set({
      isInitialized: false,
      isLoading: false,
      userCategories: null,
      accountBalances: null,
    }),
}));