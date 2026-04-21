import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardExpensesChartWrapper from "./components/dashboard-expenses-chart-wrapper";
import CategoryChartWrapper from "./components/category-chart-wrapper";
import DashboardMonthPicker from "./components/dashboard-month-picker";
import DashboardBudgetListWrapper from "./components/dashboard-budget-list-wrapper";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="w-fit mx-auto">
        <DashboardMonthPicker />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <DashboardExpensesChartWrapper />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <DashboardBudgetListWrapper />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <CategoryChartWrapper />
        </Suspense>
      </div>
    </div>
  );
}
