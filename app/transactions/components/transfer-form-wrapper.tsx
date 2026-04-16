import { getUserAccounts } from "@/app/transactions/services/transactions.service";
import TransferFormClient from "./transfer-form-client";

export default async function TransferFormWrapper() {
  const userAccounts = await getUserAccounts();

  return <TransferFormClient userAccounts={userAccounts} />;
}
