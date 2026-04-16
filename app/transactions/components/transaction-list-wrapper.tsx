import { getDailySummaryByMonth } from "@/app/transactions/services/transactions.service";
import TransactionListClient from "./transaction-list-client";

export default async function TransactionListWrapper() {
  const dailySummary = await getDailySummaryByMonth();

  return <TransactionListClient initialDailySummary={dailySummary} />;
}
