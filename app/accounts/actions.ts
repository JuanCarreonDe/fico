"use server";
import { Database } from "@/database.types";
import { createClient } from "@/lib/db/server";

export async function createAccount(
  params: Database["public"]["Functions"]["create_account"]["Args"],
) {
  const db = await createClient();

  const { error } = await db.rpc("create_account", params);

  if (error) throw error;
}
