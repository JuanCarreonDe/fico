import { Skeleton } from "@/components/ui/skeleton";

export function TransactionByDaySkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-12 w-full bg-card" />
      <Skeleton className="h-12 w-full bg-card" />
    </div>
  );
}
