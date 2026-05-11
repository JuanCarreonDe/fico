import { create } from "zustand";

interface TransactionState {
  isLoading: boolean;
  showAmounts: boolean;
  setIsLoading: (isLoading: boolean) => void;
  toggleShowAmounts: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  isLoading: false,
  showAmounts: true,
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading: isLoading });
  },
  toggleShowAmounts: () => {
    set((state) => ({ showAmounts: !state.showAmounts }));
  },
}));
