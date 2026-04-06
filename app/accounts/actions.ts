"use server";
import { Database } from "@/database.types";
import { createClient } from "@/lib/db/server";
import { revalidatePath } from "next/cache";

export async function createAccount(
  params: Database["public"]["Functions"]["create_account"]["Args"],
) {
  const db = await createClient();

  const { error } = await db.rpc("create_account", params);

  if (error) throw new Error(error.message);
  revalidatePath("/transactions", "page");
}

export async function archiveAccount(
  params: Database["public"]["Functions"]["archive_account"]["Args"],
) {
  const db = await createClient();

  const { error } = await db.rpc("archive_account", params);

  if (error) throw new Error(error.message);

  revalidatePath("/transactions", "page");
}

export async function getAccountBalances() {
  const db = await createClient();

  const { error, data } = await db.rpc("get_account_balances");

  if (error) throw new Error(error.message);

  // revalidatePath("/transactions", "page");
  return data;
}
