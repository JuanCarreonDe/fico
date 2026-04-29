"use client";

import TransactionFormClient, {
  TransactionFormClientProps,
} from "./transaction-form-client";

export default function TransactionFormWrapper({
  transaction,
  open,
  onOpenChange,
  userAccounts,
  userCategories,
  isUpdate,
}: TransactionFormClientProps) {
  return (
    <TransactionFormClient
      userAccounts={userAccounts}
      userCategories={userCategories}
      transaction={transaction}
      isUpdate={isUpdate}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
