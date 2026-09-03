"use server";
import { Database } from "@/database.types";
import { createClient } from "@/lib/db/server";
import { revalidatePath } from "next/cache";

export type CreateAccountParams = Database["public"]["Functions"]["create_account"]["Args"];
export type UpdateAccountParams = Database["public"]["Functions"]["update_account"]["Args"];
export type ArchiveAccountParams = Database["public"]["Functions"]["archive_account"]["Args"];
export type AccountBalance = Database["public"]["Functions"]["get_account_balances"]["Returns"][number];

export async function createAccount(
  params: CreateAccountParams,
) {
  const db = await createClient();

  const { data, error } = await db.rpc("create_account", params);

  if (error) throw new Error(error.message);

  revalidatePath("/transactions");
  revalidatePath("/settings");

  return data;
}

export async function updateAccount(
  params: UpdateAccountParams,
) {
  const db = await createClient();

  const { data, error } = await db.rpc("update_account", params);

  if (error) throw new Error(error.message);

  revalidatePath("/transactions");
  revalidatePath("/settings");

  return data;
}

export async function archiveAccount(
  params: ArchiveAccountParams,
) {
  const db = await createClient();

  const { error } = await db.rpc("archive_account", params);

  if (error) throw new Error(error.message);

  revalidatePath("/transactions");
  revalidatePath("/settings");

  return { accountId: params.p_account_id };
}

export async function getAccountBalances() {
  const db = await createClient();

  const { error, data } = await db.rpc("get_account_balances");

  if (error) throw new Error(error.message);

  return data as AccountBalance[] | null;
}
