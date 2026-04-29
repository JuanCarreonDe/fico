import { getDailySummaryByMonth } from "@/app/transactions/services/transactions.service";
import TransactionListClient from "./transaction-list-client";
import {
  getUserAccounts,
  getUserCategories,
} from "@/app/transactions/services/transactions.service";

export default async function TransactionListWrapper({
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
    <TransactionListClient
      initialDailySummary={dailySummary}
      userAccounts={userAccounts}
      userCategories={userCategories}
    />
  );
}
