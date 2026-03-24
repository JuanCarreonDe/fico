import { createClient } from "@/lib/db/server";

export const getAccountBalances = async () => {
  const db = createClient();
  const { data, error } = await (await db).rpc("get_account_balances");
  if (error) throw error;

  return data;
};
