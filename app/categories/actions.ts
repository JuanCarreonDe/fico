"use server";
import { Database } from "@/database.types";
import { createClient } from "@/lib/db/server";
import { revalidatePath } from "next/cache";

export type CreateCategoryParams = Database["public"]["Functions"]["create_category"]["Args"];
export type UpdateCategoryParams = Database["public"]["Functions"]["update_category"]["Args"];
export type ArchiveCategoryParams = Database["public"]["Functions"]["archive_category"]["Args"];
export type CategoryBudgetSummary = Database["public"]["Functions"]["get_category_budget_summary"]["Returns"];
export type UserCategory = Database["public"]["Functions"]["get_user_categories"]["Returns"][number];

export async function createCategory(
  params: CreateCategoryParams,
) {
  const db = await createClient();

  const { data, error } = await db.rpc("create_category", params);

  if (error) throw new Error(error.message);

  revalidatePath("/transactions");
  revalidatePath("/settings");

  return data;
}

export async function updateCategory(
  params: UpdateCategoryParams,
) {
  const db = await createClient();

  const { error } = await db.rpc("update_category", params);

  if (error) throw new Error(error.message);

  revalidatePath("/transactions");
  revalidatePath("/settings");
}

export async function getCategories() {
  const db = await createClient();

  const { error, data } = await db.rpc("get_user_categories");

  if (error) throw new Error(error.message);
  return data as UserCategory[] | null;
}

export async function archiveCategory(
  params: ArchiveCategoryParams,
) {
  const db = await createClient();

  const { error } = await db.rpc("archive_category", params);

  if (error) throw new Error(error.message);

  revalidatePath("/transactions");
  revalidatePath("/settings");
}

export async function getCategoryBudgetSummary(
  params: Database["public"]["Functions"]["get_category_budget_summary"]["Args"],
) {
  const db = await createClient();

  const { data, error } = await db.rpc("get_category_budget_summary", params);

  if (error) throw new Error(error.message);

  return data as CategoryBudgetSummary | null;
}
