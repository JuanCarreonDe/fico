"use server";

import { createClient } from "@/lib/db/server";

export async function getTransactionsAndAccounts() {
  const db = await createClient();

  // Get all transactions
  const { data: transactions, error: transactionsError } = await db
    .from("transactions")
    .select("*")
    .order("transaction_date", { ascending: false });

  if (transactionsError) throw transactionsError;

  // Get all accounts
  const { data: accounts, error: accountsError } = await db
    .from("accounts")
    .select("*");

  if (accountsError) throw accountsError;

  return {
    transactions: transactions || [],
    accounts: accounts || [],
  };
}
