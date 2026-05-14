"use server";

import { Database } from "@/database.types";
import { createClient } from "@/lib/db/server";
import { getTransactionsByCategory } from "@/app/transactions/services/transactions.service";

export async function getDailySummaryByMonth(
  params: Database["public"]["Functions"]["get_category_summary"]["Args"],
) {
  const db = await createClient();

  const { data, error } = await db.rpc("get_category_summary", params);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function getCategoryTransactions(
  params: Database["public"]["Functions"]["get_transactions_by_category"]["Args"],
) {
  return getTransactionsByCategory(params);
}
