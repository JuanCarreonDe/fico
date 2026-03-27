import { getAccountBalances } from "../accounts/accounts.service";
import TransactionForm from "./components/transactions-form";
import { TransactionList } from "./components/transactions-list";
import { TransactionSummary } from "./components/transactions-summary";
import {
  getDailySummaryByMonth,
  getMonthlyFinancialSummary,
  getUserAccounts,
  getUserCategories,
} from "./services/transactions.service";

export default async function TransactionsPage() {
  const summary = await getMonthlyFinancialSummary();
  const userAccounts = await getUserAccounts();
  const userCategories = await getUserCategories();
  const dailySummaryCurrentMonth = await getDailySummaryByMonth();
  const accountBalances = await getAccountBalances();

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div>
        <TransactionSummary
          summary={summary}
          accountBalances={accountBalances}
        />
        <div className="flex flex-col gap-4">
          <TransactionList
            dailySummaryCurrentMonth={dailySummaryCurrentMonth}
          />
        </div>
      </div>
      <div className="fixed bottom-30 right-10">
        <TransactionForm
          userAccounts={userAccounts}
          userCategories={userCategories}
        />
      </div>
    </div>
  );
}
