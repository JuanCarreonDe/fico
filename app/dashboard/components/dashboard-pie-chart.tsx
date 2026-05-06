"use client";

import { useEffect, useState } from "react";
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
import { getAccentColor, hexToRgba } from "@/lib/get-accent-color";

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
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT);

  useEffect(() => {
    const accent = getAccentColor();
    setAccentColor(accent);
  }, []);

  const chartData = categoryData.map((item, index) => ({
    category: item.category_name,
    amount: Number(item.total_amount),
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
    </Card>
  );
}