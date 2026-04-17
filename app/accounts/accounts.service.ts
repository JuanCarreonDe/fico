import { createClient } from "@/lib/db/server";
import { Database } from "@/database.types";

export type AccountBalance = Database["public"]["Functions"]["get_account_balances"]["Returns"][number];

export const getAccountBalances = async () => {
  const db = await createClient();
  const { data, error } = await db.rpc("get_account_balances");
  if (error) throw error;

  return data as AccountBalance[] | null;
};
