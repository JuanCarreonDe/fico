"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import CopyButton from "@/components/copy-button";
import { CategoryIconDisplay } from "@/lib/get-category-icon";

type BudgetCategory = {
  category_id: string;
  category_name: string;
  budget_amount: number;
  spent_amount: number;
  percentage_used: number | null;
  category_icon: string | null;
};

interface DashboardBudgetListProps {
  data: BudgetCategory[] | null;
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
    percentage_used: number | null;
    category_icon: string | null;
  };
}) {
  const pct = category.percentage_used ?? 0;
  const percentage = Math.min(pct, 100);

  return (
    <div className="space-y-2 py-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium capitalize flex items-center gap-1.5">
          <CategoryIconDisplay icon={category.category_icon} type="expense" className="h-4 w-4 text-muted-foreground" />
          {category.category_name}
        </span>
        <div className="text-right text-xs text-muted-foreground">
          <span>{formatCurrency(category.spent_amount)}</span>
          <span className="mx-1">|</span>
          <span>{formatCurrency(category.budget_amount)}</span>
          <span className="mx-1">|</span>
          <span className={"text-accent"}>
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all border border-accent ${getProgressColor(pct)}`}
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
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardTitle className="text-lg">Presupuestos del mes</CardTitle>
        <CopyButton data={data.map(({ category_id, ...rest }) => rest)} label="Presupuestos del mes" />
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
