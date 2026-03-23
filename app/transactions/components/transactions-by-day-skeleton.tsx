// components/transactions/transaction-list-skeleton.tsx

import { Skeleton } from "@/components/ui/skeleton"

export function TransactionByDaySkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="border h-4 w-full" />
      <Skeleton className="border h-4 w-full" />
      <Skeleton className="border h-4 w-full" />
    </div>
  )
}