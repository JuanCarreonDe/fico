import TransactionForm from "./components/transactions-form";
import { TransactionList } from "./components/transactions-list";
import { TransactionSumary } from "./components/transactions-summary";
import {
  getDailySummaryCurrentMonth,
  getMonthlyFinancialSummary,
  getTransactionsByDay,
  getUserAccounts,
  getUserCategories,
} from "./services/transactions.service";

export default async function TransactionsPage() {
  const summary = await getMonthlyFinancialSummary();
  const userAccounts = await getUserAccounts();
  const userCategories = await getUserCategories();
  const dailySummaryCurrentMonth = await getDailySummaryCurrentMonth();

  return (
    <div className="p-4 h-full flex flex-col gap-8">
      <div>
        <TransactionSumary summary={summary} />
      </div>
      <div className="flex flex-col gap-4">
        <TransactionList 
          dailySummaryCurrentMonth={dailySummaryCurrentMonth}
          // getTransactionsByDay={getTransactionsByDay}
        />
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
