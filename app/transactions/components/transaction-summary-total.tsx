"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactionStore } from "@/lib/store/transaction-store";

interface Props {
  total_balance: string;
}
export default function TransactionSummaryTotal({ total_balance }: Props) {
  const { isLoading } = useTransactionStore();

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <div className="text-4xl font-bold text-primary mb-2 flex items-center justify-center transition-opacity duration-300 animate-in fade-in">
          {total_balance}
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Balance total de todas las cuentas
      </p>
    </>
  );
}
