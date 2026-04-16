"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/database.types";
import { ArrowDownLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import * as React from "react";
import { getTransactionsByDay } from "@/app/transactions/actions";
import { TransactionByDaySkeleton } from "./transactions-by-day-skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import TransactionListItem from "./transaction-list-item";

type DailySummary =
  Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"];
type TransactionsByDay =
  Database["public"]["Functions"]["get_transactions_by_day"]["Returns"];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

interface TransactionListClientProps {
  initialDailySummary: DailySummary | null;
}

export default function TransactionListClient({
  initialDailySummary,
}: TransactionListClientProps) {
  const [transactionsByDay, setTransactionsByDay] = React.useState<
    Record<string, TransactionsByDay>
  >({});
  const [loadingDay, setLoadingDay] = React.useState<string>();
  // const [isOpen, setIsOpen] = React.useState(false);

  const handleLoadDay = async (date: string) => {
    setLoadingDay(date);
    const data = await getTransactionsByDay({ p_date: date });
    setTransactionsByDay((prev) => ({ ...prev, [date]: data }));
    setLoadingDay(undefined);
  };

  // React.useEffect(() => {
  //   if (!loadingDay) return;
  //   handleLoadDay(loadingDay);
  //   // setIsOpen(false);
  // }, [initialDailySummary]);

  if (!initialDailySummary) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card className="mx-auto w-full min-h-fit" key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      {initialDailySummary.map((i) => (
        <Card
          className="mx-auto w-full min-h-fit"
          key={`${i.day_date}${i.total_expense}`}
        >
          <CardContent>
            <Collapsible
              className="rounded-md data-[state=open]:bg-muted"
              onOpenChange={(open) => {
                // setIsOpen(open);
                if (open && !transactionsByDay[i.day_date]) {
                  handleLoadDay(i.day_date);
                }
              }}
              // open={isOpen}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="group w-full justify-between min-h-fit p-2 ring-0 outline-none border-none"
                  disabled={i.total_expense === 0 && i.total_income === 0}
                >
                  <div className="flex gap-2 items-center justify-start">
                    <b>{format(new Date(i.day_date + "T00:00:00"), "d")}</b>
                    <div className="flex flex-col gap-2 justify-start items-start capitalize text-xs">
                      <span>
                        {format(new Date(i.day_date + "T00:00:00"), "EEEE", {
                          locale: es,
                        })}
                      </span>
                      <span>
                        {format(
                          new Date(i.day_date + "T00:00:00"),
                          "MMM. yyyy",
                          {
                            locale: es,
                          },
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col gap-1">
                      <span className="flex gap-1 items-center text-destructive">
                        <ArrowUpRight />
                        {formatCurrency(i.total_expense)}
                      </span>
                      <span className="flex gap-1 items-center text-success">
                        <ArrowDownLeft />
                        {formatCurrency(i.total_income)}
                      </span>
                    </div>
                    <ChevronDown className="group-data-[state=open]:rotate-180" />
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
                <div className="w-full flex flex-col gap-2">
                  {i.day_date === loadingDay && <TransactionByDaySkeleton />}

                  {transactionsByDay[i.day_date]?.map((t) => (
                    <TransactionListItem
                      key={t.id}
                      item={t}
                      date={i.day_date}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
