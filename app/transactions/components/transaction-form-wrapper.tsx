import {
  getUserAccounts,
  getUserCategories,
} from "@/app/transactions/services/transactions.service";
import TransactionFormClient from "./transaction-form-client";

interface TransactionFormWrapperProps {
  label?: string;
  defaultType?: "income" | "expense";
}

export default async function TransactionFormWrapper({
  label,
  defaultType,
}: TransactionFormWrapperProps) {
  const [userAccounts, userCategories] = await Promise.all([
    getUserAccounts(),
    getUserCategories(),
  ]);

  return (
    <TransactionFormClient
      userAccounts={userAccounts}
      userCategories={userCategories}
      label={label}
      defaultType={defaultType}
    />
  );
}
