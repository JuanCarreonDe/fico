"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BudgetCategory = {
  category_id: string;
  category_name: string;
  budget_amount: number;
  spent_amount: number;
  percentage_used: number;
};

interface DashboardBudgetListProps {
  data: BudgetCategory[] | null;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getProgressColor(percentage: number): string {
  if (percentage > 100) return "bg-accent";
  if (percentage >= 80) return "bg-accent/80";
  return "bg-accent/40";
}

function BudgetProgressItem({
  category,
}: {
  category: {
    category_name: string;
    budget_amount: number;
    spent_amount: number;
    percentage_used: number;
  };
}) {
  const percentage = Math.min(category.percentage_used, 100);

  return (
    <div className="space-y-2 py-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{category.category_name}</span>
        <div className="text-right text-xs text-muted-foreground">
          <span>{formatCurrency(category.spent_amount)}</span>
          <span className="mx-1">|</span>
          <span>{formatCurrency(category.budget_amount)}</span>
          <span className="mx-1">|</span>
          <span className={"text-accent"}>
            {Math.round(category.percentage_used)}%
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all border border-accent ${getProgressColor(category.percentage_used)}`}
          style={{
            width: `${percentage}%`,
            minWidth: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

export default function DashboardBudgetList({
  data,
}: DashboardBudgetListProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card className="transition-opacity duration-300 animate-in fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Presupuestos del mes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {data.map((category) => (
            <BudgetProgressItem
              key={category.category_id}
              category={category}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
