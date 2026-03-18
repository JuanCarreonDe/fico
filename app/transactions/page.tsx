import TransactionForm from "./components/transaction-form";
import { TransactionSumary } from "./components/transactions-summary";
import { getMonthlyFinancialSummary, getUserAccounts, getUserCategories } from "./services/transactions.service";

export default async function TransactionsPage (){
   const summary = await getMonthlyFinancialSummary()
  const userAccounts = await getUserAccounts()
  const userCategories = await getUserCategories()
  return (
    <div className="p-4 h-full">
        <TransactionSumary summary={summary}/>
        <div className="fixed bottom-20 right-10">
        <TransactionForm userAccounts={userAccounts} userCategories={userCategories}/>
        </div>
    </div>
  )
}
