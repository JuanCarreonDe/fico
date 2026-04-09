"use client";

import TransactionForm from "./components/transactions-form";
import { TransactionsProvider } from "./components/transactions-provider";
import { TransactionList } from "./components/transactions-list";
import { TransactionSummary } from "./components/transactions-summary";
import TransactionsMonthPicker from "./components/transactions-month-picker";
import { useTransactionStore } from "@/lib/store/transaction-store";

function TransactionsContent() {
  const {
    summary,
    dailySummaryCurrentMonth,
    accountBalances,
    userAccounts,
    userCategories,
  } = useTransactionStore();

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
      <div className="h-full flex flex-col gap-4">
        <TransactionsMonthPicker />
        <div className="flex flex-col gap-4">
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

export default function TransactionsPage() {
  return <TransactionsContent />;
}
