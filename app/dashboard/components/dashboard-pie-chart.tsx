"use client";

import { Pie, PieChart, LabelList } from "recharts";

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
} from "@/components/ui/chart";
import { getAccentColor } from "@/lib/get-accent-color";

const DEFAULT_ACCENT = "#ff7301";

interface DashboardPieChartProps {
  categoryData: { category_name: string; total_amount: number }[];
}

function generateAccentColor(accentHex: string, index: number): string {
  const opacity = 1 - (index + 1) * 0.15;
  const r = parseInt(accentHex.slice(1, 3), 16);
  const g = parseInt(accentHex.slice(3, 5), 16);
  const b = parseInt(accentHex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(opacity, 0.01)})`;
}

export function DashboardPieChart({ categoryData }: DashboardPieChartProps) {
  const accentColor = getAccentColor() || DEFAULT_ACCENT;

  const total = categoryData.reduce(
    (sum, item) => sum + Number(item.total_amount),
    0,
  );

  const chartData = categoryData.map((item, index) => ({
    category: item.category_name,
    amount: Number(item.total_amount),
    percentage: total > 0 ? (Number(item.total_amount) / total) * 100 : 0,
    fill: generateAccentColor(accentColor, index),
  }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="flex flex-col transition-opacity duration-300 animate-in fade-in">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gastos por categoría</CardTitle>
        <CardDescription>Distribución del mes</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto w-full max-h-50 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              outerRadius={70}
              stroke={accentColor}
            >
              <LabelList
                dataKey="category"
                position="outside"
                className="fill-foreground text-xs"
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col">
        <div className="w-full flex flex-col gap-2">
          {chartData.map((i) => (
            <div className="space-y-2 py-2" key={i.category}>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium capitalize">{i.category}</span>
                <div className="text-right text-xs text-muted-foreground flex gap-1">
                  <span>${i.amount}</span>
                  <span>|</span>
                  <span className="text-accent">
                    {i.percentage.toString().split(".")[0]}%
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all border bg-accent`}
                  style={{
                    width: `${i.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 justify-end w-full">
          <CardTitle>Total de gastos:</CardTitle>
          <CardDescription className="text-accent">${total}</CardDescription>
        </div>
      </CardFooter>
    </Card>
  );
}
