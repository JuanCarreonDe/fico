"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { getAccentColor, hexToRgb } from "@/lib/get-accent-color";
import CopyButton from "@/components/copy-button";

const DEFAULT_ACCENT_RGB = "rgb(255, 115, 1)";

interface Props {
  data: {
    month: string;
    total_income: number;
    total_expense: number;
  }[];
}

export default function MonthlyIncomeExpensesChart({ data }: Props) {
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_RGB);

  useEffect(() => {
    const accent = getAccentColor();
    const rgb = accent.startsWith("#") ? hexToRgb(accent) : accent;
    setAccentColor(rgb);
  }, []);

  const chartColors = useMemo(
    () => ({
      fill: accentColor.replace("rgb", "rgba").replace(")", ", 0.4)"),
      stroke: accentColor,
    }),
    [accentColor],
  );

  const chartConfig = useMemo(
    () =>
      ({
        ingresos: {
          label: "Ingresos",
          color: accentColor,
        },
        gastos: {
          label: "Gastos",
          color: chartColors.fill,
        },
      }) satisfies ChartConfig,
    [accentColor, chartColors.fill],
  );

  const chartData = useMemo(
    () =>
      (data ?? []).map((item) => ({
        month: format(new Date(item.month + "-01"), "MMM", { locale: es }),
        ingresos: item.total_income,
        gastos: item.total_expense,
      })),
    [data],
  );

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="transition-opacity duration-300 animate-in fade-in">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle>Ingresos y gastos mensuales</CardTitle>
          <CardDescription>Año actual</CardDescription>
        </div>
        <CopyButton data={data} label="Ingresos y gastos" />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} className="stroke-muted" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, "auto"]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
              className="text-xs fill-muted-foreground"
              padding={{ top: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="ingresos"
              fill="var(--color-ingresos)"
              stroke="var(--color-ingresos)"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="gastos"
              fill="var(--color-gastos)"
              stroke="var(--color-ingresos)"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
