import { createClient } from "@/lib/db/server";
import { Database } from "@/database.types";

export type MonthlyFinancialSummary =
  Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"];
export type UserAccount =
  Database["public"]["Functions"]["get_user_accounts"]["Returns"][number];
export type UserCategory =
  Database["public"]["Functions"]["get_user_categories"]["Returns"][number];
export type DailySummary =
  Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"];
export type CategorySummary =
  Database["public"]["Functions"]["get_category_summary"]["Returns"];

export type GetMonthlyFinancialSummaryParams =
  Database["public"]["Functions"]["get_monthly_financial_summary"]["Args"];
export type GetUserAccountsParams =
  Database["public"]["Functions"]["get_user_accounts"]["Args"];
export type GetUserCategoriesParams =
  Database["public"]["Functions"]["get_user_categories"]["Args"];
export type GetDailySummaryByMonthParams =
  Database["public"]["Functions"]["get_daily_summary_by_month"]["Args"];
export type GetCategorySummaryParams =
  Database["public"]["Functions"]["get_category_summary"]["Args"];

export const getMonthlyFinancialSummary = async (
  _params?: GetMonthlyFinancialSummaryParams,
) => {
  const db = await createClient();
  const { data, error } = await db.rpc("get_monthly_financial_summary");
  if (error) throw error;

  return data;
};

export const getUserAccounts = async (_params?: GetUserAccountsParams) => {
  const db = await createClient();
  const { data, error } = await db.rpc("get_user_accounts");
  if (error) throw error;

  return data;
};

export const getUserCategories = async (_params?: GetUserCategoriesParams) => {
  const db = await createClient();
  const { data, error } = await db.rpc("get_user_categories");
  if (error) throw error;

  return data;
};

export const getDailySummaryByMonth = async (
  params?: GetDailySummaryByMonthParams,
) => {
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

  return data;
};

export const getCategorySummary = async (params?: GetCategorySummaryParams) => {
  const db = await createClient();
  let monthParam: string | undefined;
  if (params?.p_month) {
    monthParam =
      params.p_month.length <= 7 ? `${params.p_month}-01` : params.p_month;
  }
  const { data, error } = await db.rpc("get_category_summary", {
    p_type: params?.p_type ?? "expense",
    p_period: params?.p_period ?? "month",
    p_month: monthParam,
  });
  if (error) throw error;

  return data;
};
