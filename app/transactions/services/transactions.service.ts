import { createClient } from "@/lib/db/server";
import { Database } from "@/database.types";

export type MonthlyFinancialSummary = Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"];
export type UserAccount = Database["public"]["Functions"]["get_user_accounts"]["Returns"][number];
export type UserCategory = Database["public"]["Functions"]["get_user_categories"]["Returns"][number];
export type DailySummary = Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"];
export type CategorySummary = Database["public"]["Functions"]["get_category_summary"]["Returns"];

export const getMonthlyFinancialSummary = async () => {
  const db = await createClient();
  const { data, error } = await db.rpc("get_monthly_financial_summary");
  if (error) throw error;

  return data as MonthlyFinancialSummary | null;
};

export const getUserAccounts = async () => {
  const db = await createClient();
  const { data, error } = await db.rpc("get_user_accounts");
  if (error) throw error;

  return data as UserAccount[] | null;
};

export const getUserCategories = async () => {
  const db = await createClient();
  const { data, error } = await db.rpc("get_user_categories");
  if (error) throw error;

  return data as UserCategory[] | null;
};

export const getDailySummaryByMonth = async (params?: { p_month?: string }) => {
  const db = await createClient();
  let monthParam: string | undefined;
  if (params?.p_month) {
    monthParam =
      params.p_month.length <= 7 ? `${params.p_month}-01` : params.p_month;
  }
  const { data, error } = await db.rpc("get_daily_summary_by_month", {
    p_month: monthParam,
  });
  if (error) throw error;

  return data as DailySummary | null;
};

export const getCategorySummary = async (
  type: "income" | "expense",
  period: string,
  month?: string,
) => {
  const db = await createClient();
  let monthParam: string | undefined;
  if (month) {
    monthParam = month.length <= 7 ? `${month}-01` : month;
  }
  const { data, error } = await db.rpc("get_category_summary", {
    p_type: type,
    p_period: period,
    p_month: monthParam,
  });
  if (error) throw error;

  return data as CategorySummary | null;
};
