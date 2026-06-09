"use client";

import { useState } from "react";
import { Pie, PieChart, LabelList } from "recharts";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CopyButton from "@/components/copy-button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { getAccentColor } from "@/lib/get-accent-color";
import { getCategoryTransactions } from "../actions";
import type { TransactionByCategory } from "@/app/transactions/services/transactions.service";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/format-currency";
import { CategoryIconDisplay } from "@/lib/get-category-icon";

const DEFAULT_ACCENT = "#ff7301";

interface DashboardPieChartProps {
  categoryData: {
    category_id: string;
    category_name: string;
    total_amount: number;
    category_icon: string | null;
  }[];
  month?: string;
}

function generateAccentColor(accentHex: string, index: number): string {
  const opacity = 1 - (index + 1) * 0.15;
  const r = parseInt(accentHex.slice(1, 3), 16);
  const g = parseInt(accentHex.slice(3, 5), 16);
  const b = parseInt(accentHex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(opacity, 0.01)})`;
}

export function DashboardPieChart({
  categoryData,
  month,
}: DashboardPieChartProps) {
  const accentColor = getAccentColor() || DEFAULT_ACCENT;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [transactionsData, setTransactionsData] = useState<
    Record<string, TransactionByCategory>
  >({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const total = categoryData.reduce(
    (sum, item) => sum + Number(item.total_amount),
    0,
  );

  const chartData = categoryData.map((item, index) => ({
    category: item.category_name,
    amount: Number(item.total_amount),
    percentage: total > 0 ? (Number(item.total_amount) / total) * 100 : 0,
    fill: generateAccentColor(accentColor, index),
    category_id: item.category_id,
    category_icon: item.category_icon,
  }));

  async function handleToggle(
    open: boolean,
    categoryName: string,
    categoryId: string,
  ) {
    setExpanded((prev) => ({ ...prev, [categoryName]: open }));

    if (open && !transactionsData[categoryName]) {
      setLoading((prev) => ({ ...prev, [categoryName]: true }));
      try {
        const result = await getCategoryTransactions({
          p_category_id: categoryId,
          p_month: month,
        });
        setTransactionsData((prev) => ({ ...prev, [categoryName]: result }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading((prev) => ({ ...prev, [categoryName]: false }));
      }
    }
  }

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="flex flex-col transition-opacity duration-300 animate-in fade-in">
      <CardHeader className="flex flex-row items-start justify-between pb-0 gap-2">
        <div>
          <CardTitle>Gastos por categoría</CardTitle>
          <CardDescription>Distribución del mes</CardDescription>
        </div>
        <CopyButton
          data={categoryData.map(({ category_id, ...rest }) => rest)}
          label="Gastos por categoría"
        />
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
        <div className="w-full flex flex-col gap-2">
          {chartData.map((i) => {
            const isExpanded = expanded[i.category] ?? false;
            const isLoading = loading[i.category] ?? false;
            const txns = transactionsData[i.category] ?? [];

            return (
              <Collapsible
                key={i.category}
                open={isExpanded}
                onOpenChange={(open) =>
                  handleToggle(open, i.category, i.category_id)
                }
              >
                <CollapsibleTrigger className="w-full cursor-pointer">
                  <div className="space-y-2 py-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium capitalize flex items-center gap-1">
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`}
                        />
                        <span className="font-medium capitalize flex items-center gap-1.5">
                          <CategoryIconDisplay
                            icon={i.category_icon ?? null}
                            type="expense"
                            className="h-4 w-4 text-muted-foreground"
                          />

                          {i.category}
                        </span>
                      </span>
                      <div className="text-right text-xs text-muted-foreground flex gap-1">
                        <span>{formatCurrency(i.amount)}</span>
                        <span>|</span>
                        <span className="text-accent">
                          {i.percentage.toString().split(".")[0]}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all border bg-accent"
                        style={{ width: `${i.percentage}%` }}
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pl-2 space-y-1 pb-2">
                    {isLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-3/4" />
                      </div>
                    ) : txns.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2">
                        Sin transacciones este mes
                      </p>
                    ) : (
                      txns.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex justify-between items-center text-xs py-1 border-b border-border/50 last:border-0 gap-8"
                        >
                          <div className="flex gap-1 items-center justify-start w-16 font-semibold">
                            <div className="capitalize text-xs">
                              <span>
                                {format(
                                  new Date(tx.transaction_date + "T00:00:00"),
                                  "EEEE",
                                  {
                                    locale: es,
                                  },
                                )}
                              </span>
                            </div>
                            <span>
                              {format(
                                new Date(tx.transaction_date + "T00:00:00"),
                                "d",
                              )}
                            </span>
                          </div>
                          <div className="flex flex-col flex-1">
                            <span>{tx.description || "Sin descripción"}</span>
                            <span className="text-muted-foreground">
                              {tx.account_name}
                            </span>
                          </div>
                          <span
                            className={`font-medium ${tx.type === "income" ? "text-green-500" : "text-red-500"}`}
                          >
                            {formatCurrency(tx.amount)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col">
        <div className="flex gap-2 justify-end w-full pt-2">
          <CardTitle>Total de gastos:</CardTitle>
          <CardDescription className="text-accent">${formatCurrency(total)}</CardDescription>
        </div>
      </CardFooter>
    </Card>
  );
}
