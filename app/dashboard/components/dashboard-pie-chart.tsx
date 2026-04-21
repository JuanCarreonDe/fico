"use client";

import { Pie, PieChart, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

function generateAccentColor(index: number): string {
  const opacity = 1 - index * 0.25;
  return `rgba(255, 115, 1, ${Math.max(opacity, 0.15)})`;
}

interface DashboardPieChartProps {
  categoryData: { category_name: string; total_amount: number }[];
}

export function DashboardPieChart({ categoryData }: DashboardPieChartProps) {
  const chartData = categoryData.map((item, index) => ({
    category: item.category_name,
    amount: Number(item.total_amount),
    fill: generateAccentColor(index),
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
    </Card>
  );
}
