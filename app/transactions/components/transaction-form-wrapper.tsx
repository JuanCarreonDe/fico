import {
  getUserAccounts,
  getUserCategories,
} from "@/app/transactions/services/transactions.service";
import TransactionFormClient from "./transaction-form-client";

export default async function TransactionFormWrapper() {
  const [userAccounts, userCategories] = await Promise.all([
    getUserAccounts(),
    getUserCategories(),
  ]);

  return (
    <TransactionFormClient userAccounts={userAccounts} userCategories={userCategories} />
  );
}
