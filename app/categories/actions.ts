"use server";
import { Database } from "@/database.types";
import { createClient } from "@/lib/db/server";

export async function createCategory(
  params: Database["public"]["Functions"]["create_category"]["Args"],
) {
  const db = await createClient();

  const { error } = await db.rpc("create_category", params);

  if (error) throw new Error(error.message);
}
