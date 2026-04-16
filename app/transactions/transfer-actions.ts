"use server";

import { createTransfer, CreateTransferParams } from "./services/transfer.service";
import { revalidatePath } from "next/cache";

export async function createTransferAction(params: CreateTransferParams) {
  const transferId = await createTransfer(params);
  revalidatePath("/transactions", "page");
  return transferId;
}
