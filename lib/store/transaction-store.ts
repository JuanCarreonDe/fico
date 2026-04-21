import { create } from "zustand";

interface TransactionState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading: isLoading });
  },
}));
