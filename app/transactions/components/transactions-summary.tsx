"use client";
import { Database } from "@/database.types";
import { TransactionsSummaryCard } from "./tansactions-summary-card";
import { AccountDetailsCarousel } from "../../accounts/account-details-carousel";
import { Card, CardContent } from "@/components/ui/card";

export function TransactionSummary({
  summary,
  accountBalances,
}: {
  summary: Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"];
  accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"];
}) {
  // Calculate totals from account balances
  const totalBalance =
    accountBalances?.reduce(
      (sum, account) => sum + (account.balance || 0),
      0,
    ) || 0;
  const totalIncome = summary[0]?.total_income_month || 0;
  const totalExpenses = summary[0]?.total_expense_month || 0;
  const netBalance = totalIncome - totalExpenses;

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
          <TransactionsSummaryCard
            totalBalance={totalBalance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            netBalance={netBalance}
            formatCurrency={formatCurrency}
          />
          <AccountDetailsCarousel
            accountBalances={accountBalances}
            formatCurrency={formatCurrency}
          />
        </CardContent>
      </Card>
    </div>
  );
}
