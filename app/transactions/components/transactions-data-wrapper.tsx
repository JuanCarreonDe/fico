import {
  getUserAccounts,
  getUserCategories,
  getDailySummaryByMonth,
} from "../services/transactions.service";
import TransactionListClient from "./transaction-list-client";
import FloatingActions from "./floating-actions";

export default async function TransactionsDataWrapper({
  month,
}: {
  month: string;
}) {
  const [userAccounts, userCategories, dailySummary] = await Promise.all([
    getUserAccounts(),
    getUserCategories(),
    getDailySummaryByMonth({ p_month: month }),
  ]);

  return (
    <>
      <TransactionListClient
        initialDailySummary={dailySummary}
        userAccounts={userAccounts}
        userCategories={userCategories}
      />
      <FloatingActions
        userAccounts={userAccounts}
        userCategories={userCategories}
      />
    </>
  );
}