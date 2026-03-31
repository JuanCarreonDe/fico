"use client";
import { TransactionsSummaryCard } from "./tansactions-summary-card";
import { AccountDetailsCarousel } from "../../accounts/account-details-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useTransactionStore } from "@/lib/store/transaction-store";

export function TransactionSummary() {
  const accountBalances = useTransactionStore((state) => state.accountBalances);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full md:w-[70%] mx-auto shadow-lg">
        <CardContent className="p-6">
          <TransactionsSummaryCard formatCurrency={formatCurrency} />
          <AccountDetailsCarousel
            accountBalances={accountBalances || []}
            formatCurrency={formatCurrency}
          />
        </CardContent>
      </Card>
    </div>
  );
}
