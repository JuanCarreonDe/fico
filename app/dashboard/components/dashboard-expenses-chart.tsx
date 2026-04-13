"use client";

import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const chartConfig = {
  expenses: {
    label: "Gastos",
    color: "rgb(255, 115, 1)",
  },
} satisfies ChartConfig;

const chartColors = {
  fill: "rgba(255, 115, 1, 0.4)",
  stroke: "rgb(255, 115, 1)",
};

export function DashboardExpensesChart() {
  const dailySummaryData = useDashboardStore((state) => state.dailySummaryData);

  const chartData = (dailySummaryData ?? [])
    .filter((day) => day.total_expense > 0)
    .map((day) => ({
      day: format(new Date(day.day_date + "T00:00:00"), "d", { locale: es }),
      expenses: day.total_expense,
    }))
    .reverse();

  if (chartData.length === 0) {
    return null;
  }

  const totalExpenses = chartData.reduce((sum, day) => sum + day.expenses, 0);
  const lastDayExpenses = chartData[chartData.length - 1]?.expenses || 0;
  const previousDayExpenses = chartData[chartData.length - 2]?.expenses || 0;
  const percentChange =
    previousDayExpenses > 0
      ? ((lastDayExpenses - previousDayExpenses) / previousDayExpenses) * 100
      : 0;
  const isTrendingUp = percentChange >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos diarios</CardTitle>
        <CardDescription>Mostrando gastos del mes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} className="stroke-muted" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs fill-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
              className="text-xs fill-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="expenses"
              type="natural"
              fill={chartColors.fill}
              fillOpacity={0.4}
              stroke={chartColors.stroke}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Total: {formatCurrency(totalExpenses)}
              <span className="text-muted-foreground">•</span>
              {isTrendingUp ? (
                <span className="text-destructive flex items-center gap-1">
                  +{percentChange.toFixed(1)}%{" "}
                  <TrendingUp className="h-4 w-4" />
                </span>
              ) : (
                <span className="text-success flex items-center gap-1">
                  {percentChange.toFixed(1)}%{" "}
                  <TrendingUp className="h-4 w-4 rotate-180" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Comparado con ayer
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
