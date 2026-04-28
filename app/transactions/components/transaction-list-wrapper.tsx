import { getDailySummaryByMonth } from "@/app/transactions/services/transactions.service";
import TransactionListClient from "./transaction-list-client";

export default async function TransactionListWrapper({ month }: { month: string }) {
  const dailySummary = await getDailySummaryByMonth({ p_month: month });

  return <TransactionListClient initialDailySummary={dailySummary} />;
}
