export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string
          currency: string
          id: string
          initial_balance: number
          is_archived: boolean
          name: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          initial_balance?: number
          is_archived?: boolean
          name: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          initial_balance?: number
          is_archived?: boolean
          name?: string
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          budget: number | null
          created_at: string
          icon: string | null
          id: string
          is_archived: boolean | null
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          icon?: string | null
          id?: string
          is_archived?: boolean | null
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          icon?: string | null
          id?: string
          is_archived?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accent_color: string | null
          avatar_url: string | null
          full_name: string | null
          id: string
          show_amounts: boolean | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          accent_color?: string | null
          avatar_url?: string | null
          full_name?: string | null
          id: string
          show_amounts?: boolean | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          accent_color?: string | null
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          show_amounts?: boolean | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          category_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          transaction_date: string
          transfer_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          category_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          transaction_date: string
          transfer_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          category_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          transaction_date?: string
          transfer_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      archive_account: { Args: { p_account_id: string }; Returns: undefined }
      archive_category: { Args: { p_category_id: string }; Returns: undefined }
      archive_transaction: {
        Args: { p_transaction_id: string }
        Returns: undefined
      }
      create_account: {
        Args: {
          p_currency?: string
          p_initial_balance?: number
          p_name: string
          p_type: Database["public"]["Enums"]["account_type"]
        }
        Returns: {
          created_at: string
          currency: string
          id: string
          initial_balance: number
          is_archived: boolean
          name: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at: string
          user_id: string
        }
      }
      create_category: {
        Args: {
          p_budget?: number
          p_icon?: string
          p_name: string
          p_type: Database["public"]["Enums"]["transaction_type"]
        }
        Returns: {
          budget: number | null
          created_at: string
          icon: string | null
          id: string
          is_archived: boolean | null
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
      }
      create_transaction: {
        Args: {
          p_account_id: string
          p_amount: number
          p_category_id: string
          p_description?: string
          p_transaction_date: string
          p_type: Database["public"]["Enums"]["transaction_type"]
        }
        Returns: {
          account_id: string
          amount: number
          budget_amount: number
          category_id: string
          created_at: string
          deleted_at: string
          description: string
          id: string
          is_archived: boolean
          remaining_amount: number
          remaining_percentage: number
          spent_amount: number
          transaction_date: string
          transfer_id: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }[]
      }
      create_transfer: {
        Args: {
          p_amount: number
          p_from_account_id: string
          p_to_account_id: string
          p_transaction_date: string
        }
        Returns: string
      }
      get_account_balances: {
        Args: Record<string, never>
        Returns: {
          account_created_at: string
          account_currency: string
          account_id: string
          account_name: string
          account_type: string
          balance: number
        }[]
      }
      get_all_categories_budget_summary: {
        Args: { p_month?: string }
        Returns: {
          budget_amount: number
          category_icon: string | null
          category_id: string
          category_name: string
          percentage_used: number | null
          spent_amount: number
        }[]
      }
      get_category_budget_summary: {
        Args: { p_category_id: string }
        Returns: {
          budget_amount: number | null
          remaining_amount: number | null
          remaining_percentage: number | null
          spent_amount: number
        }[]
      }
      get_category_summary: {
        Args: {
          p_month?: string
          p_period?: string
          p_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Returns: {
          category_icon: string | null
          category_id: string
          category_name: string
          total_amount: number
        }[]
      }
      get_daily_summary_by_month: {
        Args: { p_month?: string }
        Returns: {
          day_date: string
          total_expense: number
          total_income: number
        }[]
      }
      get_monthly_financial_summary: {
        Args: { p_month?: string }
        Returns: {
          monthly_balance: number
          total_balance: number
          total_expense_month: number
          total_income_month: number
        }[]
      }
      get_recent_transactions: {
        Args: { limit_count?: number }
        Returns: {
          account_id: string
          amount: number
          category_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          transaction_date: string
          transfer_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }[]
      }
      get_spending_projection: {
        Args: Record<string, never>
        Returns: {
          avg_daily_expense: number
          days_in_period: number
          days_with_transactions: number
          diff_vs_last_month: number
          has_previous_month: boolean
          projected_end_balance: number
        }[]
      }
      get_transactions_by_category: {
        Args: { p_category_id: string; p_month?: string }
        Returns: {
          account_id: string
          account_name: string
          amount: number
          category_icon: string | null
          category_id: string
          category_name: string
          description: string | null
          id: string
          is_transfer: boolean
          transaction_date: string
          type: string
        }[]
      }
      get_transactions_by_day: {
        Args: { p_date: string }
        Returns: {
          account_id: string
          account_name: string
          amount: number
          category_icon: string | null
          category_id: string
          category_name: string
          description: string | null
          from_account_name: string | null
          id: string
          is_transfer: boolean
          to_account_name: string | null
          transaction_date: string
          transfer_id: string | null
          type: string
        }[]
      }
      get_user_accounts: {
        Args: Record<string, never>
        Returns: {
          id: string
          name: string
          type: Database["public"]["Enums"]["account_type"]
        }[]
      }
      get_user_categories: {
        Args: Record<string, never>
        Returns: {
          budget: number | null
          icon: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
        }[]
      }
      update_account: {
        Args: {
          p_account_id: string
          p_currency: string
          p_initial_balance: number
          p_name: string
          p_type: Database["public"]["Enums"]["account_type"]
        }
        Returns: {
          created_at: string
          currency: string
          id: string
          initial_balance: number
          is_archived: boolean
          name: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at: string
          user_id: string
        }
      }
      update_category: {
        Args: {
          p_budget?: number
          p_category_id: string
          p_icon?: string
          p_name: string
          p_type: Database["public"]["Enums"]["transaction_type"]
        }
        Returns: {
          budget: number | null
          created_at: string
          icon: string | null
          id: string
          is_archived: boolean | null
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
      }
      update_transaction: {
        Args: {
          p_account_id: string
          p_amount: number
          p_category_id: string
          p_description: string
          p_transaction_date: string
          p_transaction_id: string
          p_type: Database["public"]["Enums"]["transaction_type"]
        }
        Returns: {
          account_id: string
          amount: number
          category_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          transaction_date: string
          transfer_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
      }
    }
    Enums: {
      account_type: "bank" | "cash" | "credit" | "savings"
      transaction_type: "income" | "expense" | "transfer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const Constants = {
  public: {
    Enums: {
      account_type: ["bank", "cash", "credit", "savings"],
      transaction_type: ["income", "expense", "transfer"],
    },
  },
} as const
