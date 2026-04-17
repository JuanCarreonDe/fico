import { createClient } from "@/lib/db/server";
import { Database } from "@/database.types";

export type CreateTransferParams = Database["public"]["Functions"]["create_transfer"]["Args"];

export const createTransfer = async (params: CreateTransferParams) => {
  const db = await createClient();
  const { data, error } = await db.rpc("create_transfer", params);
  if (error) throw error;

  return data as CreateTransferParams | null;
};
