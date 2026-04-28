import { Suspense } from "react";
import TransactionsMonthPicker from "./components/transactions-month-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionsSummaryCard } from "./components/tansactions-summary-card";
import AccountManageWrapper from "./components/account-manage-wrapper";
import TransactionListWrapper from "./components/transaction-list-wrapper";
import FloatingActionsWrapper from "./components/floating-actions-wrapper";

export default async function TransactionsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ month?: string }>
}) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const params = await searchParams;
  const month = params?.month || currentMonth;

  return (
    <div className="h-full flex flex-col gap-4">
      <TransactionsMonthPicker />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <Card className="w-full md:w-[70%] mx-auto">
            <CardContent className="p-6">
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <TransactionsSummaryCard month={month} />
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
            <TransactionListWrapper month={month} />
          </Suspense>
        </div>
      </div>
      <Suspense>
        <FloatingActionsWrapper />
      </Suspense>
    </div>
  );
}
