import { getAccountBalances } from "../accounts/accounts.service";
import TransactionForm from "./components/transactions-form";
import { TransactionsProvider } from "./components/transactions-provider";
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
  const dailySummaryCurrentMonth = await getDailySummaryByMonth();
  const accountBalances = await getAccountBalances();
  const userAccounts = await getUserAccounts();
  const userCategories = await getUserCategories();

  return (
    <TransactionsProvider
      initialData={{
        summary,
        dailySummaryCurrentMonth,
        accountBalances,
        userAccounts,
        userCategories,
      }}
    >
      <div className="p-4 h-full flex flex-col gap-4">
        <div>
          <TransactionSummary />
          <div className="flex flex-col gap-4">
            <TransactionList />
          </div>
        </div>
        <div className="fixed bottom-30 right-10">
          <TransactionForm />
        </div>
      </div>
    </TransactionsProvider>
  );
}
