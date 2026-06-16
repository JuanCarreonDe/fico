import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardExpensesChartWrapper from "./components/dashboard-expenses-chart-wrapper";
import CategoryChartWrapper from "./components/category-chart-wrapper";
import DashboardMonthPicker from "./components/dashboard-month-picker";
import DashboardBudgetListWrapper from "./components/dashboard-budget-list-wrapper";
import MonthlyIncomeExpensesChartWrapper from "./components/monthly-income-expenses-chart-wrapper";

export default async function DashboardPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ month?: string }>
}) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const params = await searchParams;
  const month = params?.month || currentMonth;

  return (
    <div className="space-y-4">
      <div className="w-fit mx-auto">
        <DashboardMonthPicker />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <DashboardExpensesChartWrapper month={month} />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <DashboardBudgetListWrapper month={month} />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <CategoryChartWrapper month={month} />
        </Suspense>
      </div>

      <Suspense fallback={<Skeleton className="h-80 w-full" />}>
        <MonthlyIncomeExpensesChartWrapper />
      </Suspense>
    </div>
  );
}
