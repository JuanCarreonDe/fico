import { getUserAccounts } from "@/app/transactions/services/transactions.service";
import TransferFormClient from "./transfer-form-client";

interface TransferFormWrapperProps {
  label?: string;
}

export default async function TransferFormWrapper({
  label,
}: TransferFormWrapperProps) {
  const userAccounts = await getUserAccounts();

  return <TransferFormClient userAccounts={userAccounts} label={label} />;
}
