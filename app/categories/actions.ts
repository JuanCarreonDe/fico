"use server";
import { Database } from "@/database.types";
import { createClient } from "@/lib/db/server";
import { revalidatePath } from "next/cache";

export async function createCategory(
  params: Database["public"]["Functions"]["create_category"]["Args"],
) {
  const db = await createClient();

  const { error } = await db.rpc("create_category", params);

  if (error) throw new Error(error.message);
  revalidatePath("/transactions", "page");
}

export async function updateCategory(
  params: Database["public"]["Functions"]["update_category"]["Args"],
) {
  const db = await createClient();

  const { error } = await db.rpc("update_category", params);

  if (error) throw new Error(error.message);

  revalidatePath("/transactions", "page");
}

export async function getCategories() {
  const db = await createClient();

  const { error, data } = await db.rpc("get_user_categories");

  if (error) throw new Error(error.message);
  return data;
}

export async function archiveCategory(
  params: Database["public"]["Functions"]["archive_category"]["Args"],
) {
  const db = await createClient();

  const { error } = await db.rpc("archive_category", params);

  if (error) throw new Error(error.message);

  revalidatePath("/transactions", "page");
}

export async function getCategoryBudgetSummary(
  params: Database["public"]["Functions"]["get_category_budget_summary"]["Args"],
) {
  const db = await createClient();

  const { data, error } = await db.rpc("get_category_budget_summary", params);

  if (error) throw new Error(error.message);

  return data;
}
