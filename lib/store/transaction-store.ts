import { create } from "zustand";

interface TransactionState {
  isLoading: boolean;
  showAmounts: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setShowAmounts: (showAmounts: boolean) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  isLoading: false,
  showAmounts: true,
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading: isLoading });
  },
  setShowAmounts: (showAmounts: boolean) => {
    set({ showAmounts });
  },
}));
