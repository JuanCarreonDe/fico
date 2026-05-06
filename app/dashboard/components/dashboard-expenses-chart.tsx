"use client";

import { useMemo, useState, useEffect } from "react";
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
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getAccentColor, hexToRgb, hexToRgba } from "@/lib/get-accent-color";

const DEFAULT_ACCENT = "#ff7301";
const DEFAULT_ACCENT_RGB = "rgb(255, 115, 1)";

interface Props {
  dailySummaryData: {
    day_date: string;
    total_expense: number;
    total_income: number;
  }[];
}

export default function DashboardExpensesChart({ dailySummaryData }: Props) {
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_RGB);

  useEffect(() => {
    const accent = getAccentColor();
    const rgb = accent.startsWith("#") ? hexToRgb(accent) : accent;
    setAccentColor(rgb);
  }, []);

  const chartConfig = useMemo(
    () =>
      ({
        expenses: {
          label: "Gastos",
          color: accentColor,
        },
      } satisfies ChartConfig),
    [accentColor]
  );

  const chartColors = useMemo(
    () => ({
      fill: accentColor.replace("rgb", "rgba").replace(")", ", 0.4)"),
      stroke: accentColor,
    }),
    [accentColor]
  );

  const chartData = useMemo(
    () =>
      (dailySummaryData ?? [])
        .map((day) => ({
          day: format(new Date(day.day_date + "T00:00:00"), "d", { locale: es }),
          expenses: day.total_expense,
        }))
        .reverse(),
    [dailySummaryData]
  );

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="transition-opacity duration-300 animate-in fade-in">
      <CardHeader>
        <CardTitle>Gastos diarios</CardTitle>
        <CardDescription>Mostrando gastos mesuales</CardDescription>
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
    </Card>
  );
}