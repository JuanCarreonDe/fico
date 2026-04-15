import { Suspense } from "react";
import TransactionsMonthPicker from "./components/transactions-month-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionsSummaryCard } from "./components/tansactions-summary-card";
import AccountManage from "../accounts/account-manage";
// import { TransactionForm } from "./components/transaction-form";
// import { TransactionList } from "./components/transactions-list";

export default async function TransactionsPage() {
  return (
    <div className="h-full flex flex-col gap-4">
      <TransactionsMonthPicker />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <Card className="w-full md:w-[70%] mx-auto">
            <CardContent className="p-6">
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <TransactionsSummaryCard />
                <AccountManage />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">{/* <TransactionList /> */}</div>
      </div>
      <div className="fixed bottom-30 right-0 left-0 h-fit items-center mx-auto w-fit">
        {/* <TransactionForm /> */}
      </div>
    </div>
  );
}
