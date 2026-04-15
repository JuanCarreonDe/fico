"use server";

import { Database } from "@/database.types";
import { createClient } from "@/lib/db/server";
import { revalidatePath } from "next/cache";

export async function createTransaction(
  params: Database["public"]["Functions"]["create_transaction"]["Args"],
) {
  console.log("getDailySummaryByMonth");

  const db = await createClient();

  const { data, error } = await db.rpc("create_transaction", params);

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  revalidatePath("/transactions", "page");

  return data;
}

export async function getTransactionsByDay(
  params: Database["public"]["Functions"]["get_transactions_by_day"]["Args"],
) {
  const db = await createClient();

  const { data, error } = await db.rpc("get_transactions_by_day", params);

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return data;
}

export async function getDailySummaryByMonth(
  params: Database["public"]["Functions"]["get_daily_summary_by_month"]["Args"],
) {
  console.log("getDailySummaryByMonth");

  const db = await createClient();

  const { data, error } = await db.rpc("get_daily_summary_by_month", params);

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteTransaction(
  params: Database["public"]["Functions"]["archive_transaction"]["Args"],
) {
  const db = await createClient();

  const { data, error } = await db.rpc("archive_transaction", params);

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  revalidatePath("/transactions");

  return data;
}
