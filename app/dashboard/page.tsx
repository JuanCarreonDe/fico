"use client";

import { useState } from "react";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { DashboardCharts } from "./components/dashboard-charts";
import { DashboardExpensesChart } from "./components/dashboard-expenses-chart";
import { Input } from "@/components/ui/input";

function DashboardContent() {
  const { isInitialized, isLoading, categoryExpenseData, loadDashboardData } =
    useDashboardStore();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const monthValue = e.target.value;
    setSelectedMonth(monthValue);
    await loadDashboardData(monthValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          id="transaction_date"
          type="month"
          value={selectedMonth}
          onChange={handleChange}
          className="max-w-40 m-auto"
          max={currentMonth}
        />
      </div>
      {isLoading || !isInitialized ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-muted animate-pulse rounded-xl" />
            <div className="h-64 bg-muted animate-pulse rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardExpensesChart />
          <DashboardCharts categoryData={categoryExpenseData ?? []} />
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
