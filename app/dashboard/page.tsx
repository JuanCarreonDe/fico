"use client";

import { useDashboardStore } from "@/lib/store/dashboard-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function DashboardCharts({
  categoryData,
  dailyData,
  selectedMonth,
}: {
  categoryData: { category_name: string; total_amount: number }[];
  dailyData: {
    day_date: string;
    total_income: number;
    total_expense: number;
  }[];
  selectedMonth: string;
}) {
  const pieData = categoryData.map((item) => ({
    name: item.category_name,
    value: Number(item.total_amount),
  }));

  const monthName = new Date(selectedMonth + "-01").toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Gastos por categoría - {monthName}</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <div className="space-y-2">
              {pieData.map((item, index) => {
                const total = pieData.reduce((sum, p) => sum + p.value, 0);
                const percent = (item.value / total) * 100;
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: [
                            "#0088FE",
                            "#00C49F",
                            "#FFBB28",
                            "#FF8042",
                            "#AF19FF",
                            "#FF19A1",
                            "#19AFFA",
                            "#FF6B6B",
                          ][index % 8],
                        }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ${item.value.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({percent.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No hay gastos este mes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardContent() {
  const {
    isInitialized,
    isLoading,
    selectedMonth,
    categoryExpenseData,
    dailySummaryData,
    setSelectedMonth,
  } = useDashboardStore();

  if (isLoading || !isInitialized) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 rounded-lg border bg-background"
        />
      </div>
      <DashboardCharts
        categoryData={categoryExpenseData ?? []}
        dailyData={dailySummaryData ?? []}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
