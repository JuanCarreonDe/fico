import { getCategorySummary, getDailySummaryByMonth } from "@/app/transactions/services/transactions.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardMonthPicker from "./components/dashboard-month-picker";
import { Suspense } from "react";

export const revalidate = 0;

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

async function DashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const selectedMonth = resolvedParams.month || currentMonth;
  const monthDate = `${selectedMonth}-01`;

  const categoryData = await getCategorySummary("expense", "month", selectedMonth);
  const dailyData = await getDailySummaryByMonth({ p_month: selectedMonth });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DashboardMonthPicker />
      </div>
      <DashboardCharts
        categoryData={categoryData ?? []}
        dailyData={dailyData ?? []}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}

function DashboardCharts({
  categoryData,
  dailyData,
  selectedMonth,
}: {
  categoryData: { category_name: string; total_amount: number }[];
  dailyData: { day_date: string; total_income: number; total_expense: number }[];
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

  const barData = dailyData
    .map((item) => ({
      date: new Date(item.day_date).toLocaleDateString("es-MX", { day: "numeric" }),
      income: Number(item.total_income),
      expense: Number(item.total_expense),
    }))
    .reverse();

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
                            "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
                            "#AF19FF", "#FF19A1", "#19AFFA", "#FF6B6B",
                          ][index % 8],
                        }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">${item.value.toFixed(2)}</span>
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

      <Card>
        <CardHeader>
          <CardTitle>Ingresos vs Gastos - {monthName}</CardTitle>
        </CardHeader>
        <CardContent>
          {barData.length > 0 ? (
            <div className="space-y-3">
              {barData.map((item) => (
                <div key={item.date} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-10">{item.date}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden flex">
                    {item.income > 0 && (
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${Math.min((item.income / (item.income + item.expense || 1)) * 100, 100)}%` }}
                      />
                    )}
                    {item.expense > 0 && (
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${Math.min((item.expense / (item.income + item.expense || 1)) * 100, 100)}%` }}
                      />
                    )}
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-xs">
                      ${item.income > 0 ? `+${item.income}` : item.expense > 0 ? `-${item.expense}` : 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No hay transacciones este mes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
