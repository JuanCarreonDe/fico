import { createClient } from "@/lib/db/server";
import { Database } from "@/database.types";

export type DailySummary =
  Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"];
export type CategoryBudgetSummary =
  Database["public"]["Functions"]["get_category_budget_summary"]["Returns"];
export type CategorySummary =
  Database["public"]["Functions"]["get_category_summary"]["Returns"];

export type GetDailySummaryByMonthParams =
  Database["public"]["Functions"]["get_daily_summary_by_month"]["Args"];
export type GetAllCategoriesBudgetSummaryParams =
  Database["public"]["Functions"]["get_all_categories_budget_summary"]["Args"];
export type GetCategorySummaryParams =
  Database["public"]["Functions"]["get_category_summary"]["Args"];

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

export const getAllCategoriesBudgetSummary = async (
  params?: GetAllCategoriesBudgetSummaryParams,
) => {
  const db = await createClient();
  let monthParam: string | undefined;
  if (params?.p_month) {
    monthParam =
      params.p_month.length <= 7 ? `${params.p_month}-01` : params.p_month;
  }
  const { data, error } = await db.rpc("get_all_categories_budget_summary", {
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
