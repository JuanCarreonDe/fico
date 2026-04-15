import { create } from "zustand";
import { Database } from "@/database.types";
import { createClient } from "@/lib/db/client";

interface AccountState {
  isInitialized: boolean;
  isLoading: boolean;
  accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"] | null;
  userAccounts: Database["public"]["Functions"]["get_user_accounts"]["Returns"] | null;

  setAccountBalances: (
    balances: Database["public"]["Functions"]["get_account_balances"]["Returns"],
  ) => void;
  setUserAccounts: (
    accounts: Database["public"]["Functions"]["get_user_accounts"]["Returns"],
  ) => void;
  addAccount: (
    account: Database["public"]["Functions"]["get_user_accounts"]["Returns"][number],
  ) => void;
  removeAccount: (accountId: string) => void;
  initializeData: (data: {
    accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"] | null;
    userAccounts: Database["public"]["Functions"]["get_user_accounts"]["Returns"] | null;
  }) => void;
  refreshData: () => Promise<void>;
  resetStore: () => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  isInitialized: false,
  isLoading: false,
  accountBalances: null,
  userAccounts: null,

  setAccountBalances: (accountBalances) => set({ accountBalances }),
  setUserAccounts: (userAccounts) => set({ userAccounts }),
  addAccount: (account) =>
    set((state) => ({
      userAccounts: state.userAccounts ? [account, ...state.userAccounts] : [account],
    })),
  removeAccount: (accountId) =>
    set((state) => ({
      userAccounts: state.userAccounts?.filter((a) => a.id !== accountId) ?? null,
    })),

  initializeData: (data) =>
    set({
      isInitialized: true,
      isLoading: false,
      accountBalances: data.accountBalances,
      userAccounts: data.userAccounts,
    }),

  refreshData: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const [{ data: accountBalances }, { data: userAccounts }] = await Promise.all([
        supabase.rpc("get_account_balances"),
        supabase.rpc("get_user_accounts"),
      ]);

      set({
        isInitialized: true,
        isLoading: false,
        accountBalances,
        userAccounts,
      });
    } catch (error) {
      console.error("Error refreshing accounts:", error);
      set({ isLoading: false });
    }
  },

  resetStore: () =>
    set({
      isInitialized: false,
      isLoading: false,
      accountBalances: null,
      userAccounts: null,
    }),
}));