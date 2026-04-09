import { create } from "zustand";

interface DashboardState {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedMonth: new Date().toISOString().slice(0, 7),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
}));
