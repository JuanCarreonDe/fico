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

  // revalidatePath("/transactions", "page");
}
