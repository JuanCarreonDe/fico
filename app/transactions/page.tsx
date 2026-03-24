import { getAccountBalances } from "../accounts/accounts.service";
import TransactionForm from "./components/transactions-form";
import { TransactionList } from "./components/transactions-list";
import { TransactionSumary } from "./components/transactions-summary";
import {
  getDailySummaryCurrentMonth,
  getMonthlyFinancialSummary,
  getUserAccounts,
  getUserCategories,
} from "./services/transactions.service";

export default async function TransactionsPage() {
  const summary = await getMonthlyFinancialSummary();
  const userAccounts = await getUserAccounts();
  const userCategories = await getUserCategories();
  const dailySummaryCurrentMonth = await getDailySummaryCurrentMonth();
  const accountBalances = await getAccountBalances();

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div>
        <TransactionSumary
          summary={summary}
          accountBalances={accountBalances}
        />
      </div>
      {/* <div className="flex flex-col gap-4 flex-1 overflow-auto p-1"> */}
      <div className="flex flex-col gap-4">
        <TransactionList dailySummaryCurrentMonth={dailySummaryCurrentMonth} />
      </div>
      <div className="fixed bottom-20 right-10">
        <TransactionForm
          userAccounts={userAccounts}
          userCategories={userCategories}
        />
      </div>
    </div>
  );
}
