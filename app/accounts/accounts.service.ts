import { createClient } from "@/lib/db/server";

export const getAccountBalances = async () => {
  const db = await createClient();
  const { data, error } = await db.rpc("get_account_balances");
  if (error) throw error;

  return data;
};
