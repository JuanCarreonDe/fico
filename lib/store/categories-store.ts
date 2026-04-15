import { create } from "zustand";
import { Database } from "@/database.types";
import { createClient } from "@/lib/db/client";

interface CategoryState {
  isInitialized: boolean;
  isLoading: boolean;
  userCategories: Database["public"]["Functions"]["get_user_categories"]["Returns"] | null;

  setUserCategories: (
    categories: Database["public"]["Functions"]["get_user_categories"]["Returns"],
  ) => void;
  addCategory: (
    category: Database["public"]["Functions"]["get_user_categories"]["Returns"][number],
  ) => void;
  removeCategory: (categoryId: string) => void;
  initializeData: (data: {
    userCategories: Database["public"]["Functions"]["get_user_categories"]["Returns"] | null;
  }) => void;
  refreshData: () => Promise<void>;
  resetStore: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  isInitialized: false,
  isLoading: false,
  userCategories: null,

  setUserCategories: (userCategories) => set({ userCategories }),
  addCategory: (category) =>
    set((state) => ({
      userCategories: state.userCategories ? [category, ...state.userCategories] : [category],
    })),
  removeCategory: (categoryId) =>
    set((state) => ({
      userCategories: state.userCategories?.filter((c) => c.id !== categoryId) ?? null,
    })),

  initializeData: (data) =>
    set({
      isInitialized: true,
      isLoading: false,
      userCategories: data.userCategories,
    }),

  refreshData: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const { data: userCategories } = await supabase.rpc("get_user_categories");

      set({
        isInitialized: true,
        isLoading: false,
        userCategories,
      });
    } catch (error) {
      console.error("Error refreshing categories:", error);
      set({ isLoading: false });
    }
  },

  resetStore: () =>
    set({
      isInitialized: false,
      isLoading: false,
      userCategories: null,
    }),
}));