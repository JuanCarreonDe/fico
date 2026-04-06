import { createClient } from "@/lib/db/server";

export const getMonthlyFinancialSummary = async () => {
  const db = createClient();
  const { data, error } = await (await db).rpc("get_monthly_financial_summary");
  if (error) throw error;

  return data;
};

export const getUserAccounts = async () => {
  const db = createClient();
  const { data, error } = await (await db).rpc("get_user_accounts");
  if (error) throw error;

  return data;
};

export const getUserCategories = async () => {
  const db = createClient();
  const { data, error } = await (await db).rpc("get_user_categories");
  if (error) throw error;

  return data;
};

export const getDailySummaryByMonth = async () => {
  const db = createClient();
  const { data, error } = await (await db).rpc("get_daily_summary_by_month");
  if (error) throw error;

  return data;
};
