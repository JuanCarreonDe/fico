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

export const getDailySummaryCurrentMonth = async () => {
  const db = createClient();
  const { data, error } = await (
    await db
  ).rpc("get_daily_summary_current_month");
  if (error) throw error;

  return data;
};

export const getTransactionsByDay = async (dayDate: string) => {
  const db = createClient();
  const { data, error } = await (
    await db
  ).rpc("get_transactions_by_day", { p_date: dayDate });
  if (error) throw error;

  return data;
};
