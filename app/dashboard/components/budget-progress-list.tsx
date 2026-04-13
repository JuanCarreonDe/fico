"use client";

import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ACCENT_COLOR = "rgb(255, 115, 1)";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getProgressColor(percentage: number): string {
  if (percentage > 100) return "bg-red-500";
  if (percentage >= 80) return "bg-amber-500";
  return ACCENT_COLOR;
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
  const isOverBudget = category.percentage_used > 100;

  return (
    <div className="space-y-2 py-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{category.category_name}</span>
        <div className="text-right text-xs text-muted-foreground">
          <span>{formatCurrency(category.spent_amount)}</span>
          <span className="mx-1">|</span>
          <span>{formatCurrency(category.budget_amount)}</span>
          <span className="mx-1">|</span>
          <span
            className={
              isOverBudget
                ? "text-red-500 font-medium"
                : category.percentage_used >= 80
                ? "text-amber-500 font-medium"
                : "text-accent font-medium"
            }
          >
            {Math.round(category.percentage_used)}%
          </span>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getProgressColor(category.percentage_used)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function BudgetProgressList() {
  const budgetProgressData = useDashboardStore(
    (state) => state.budgetProgressData,
  );

  if (!budgetProgressData || budgetProgressData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Presupuestos del mes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {budgetProgressData.map((category) => (
            <BudgetProgressItem key={category.category_id} category={category} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}