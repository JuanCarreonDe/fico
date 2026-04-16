import { Suspense } from "react";
import TransactionsMonthPicker from "./components/transactions-month-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionsSummaryCard } from "./components/tansactions-summary-card";
import AccountManageWrapper from "./components/account-manage-wrapper";
import TransactionListWrapper from "./components/transaction-list-wrapper";
import TransactionFormWrapper from "./components/transaction-form-wrapper";
import TransferFormWrapper from "./components/transfer-form-wrapper";

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
                <AccountManageWrapper />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Suspense
            fallback={
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className=" mx-auto h-24 w-full" />
                ))}
              </div>
            }
          >
            <TransactionListWrapper />
          </Suspense>
        </div>
      </div>
      <div className="fixed bottom-30 right-0 left-0 h-fit items-center mx-auto w-fit">
        <div className="flex gap-2 items-center">
          <Suspense fallback={<Skeleton className="h-12 w-12 rounded-full" />}>
            <TransferFormWrapper />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex gap-2">
                <Skeleton className="h-15 w-full" />
                <Skeleton className="h-15 w-full" />
              </div>
            }
          >
            <TransactionFormWrapper />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
