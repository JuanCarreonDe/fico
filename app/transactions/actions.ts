"use server"

import { Database } from "@/database.types"
import { createClient } from "@/lib/db/server"

export async function createTransaction(params: Database["public"]["Functions"]['create_transaction']['Args']) {
  const db = await createClient()

  const { error } = await db.rpc("create_transaction", params)

  if (error) throw error
}

export async function getTransactionsByDay(params: Database["public"]["Functions"]['get_transactions_by_day']['Args']) {
  const db = await createClient()

  const { data, error } = await db.rpc("get_transactions_by_day", params)

  if (error) throw error

  return data
}