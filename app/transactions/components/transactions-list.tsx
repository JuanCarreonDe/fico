"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Database } from "@/database.types";
import { ArrowDownLeft, ArrowUpRight, ChevronDown } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import { getTransactionsByDay } from "@/app/transactions/actions";
import { TransactionByDaySkeleton } from "./transactions-by-day-skeleton";

interface Props {
  dailySummaryCurrentMonth: Database["public"]["Functions"]["get_daily_summary_current_month"]["Returns"];
  //   getTransactionsByDay:Database["public"]["Functions"]["get_daily_summary_current_month"]["Returns"];
}

export function TransactionList({ dailySummaryCurrentMonth }: Props) {
  const [transactionsByDay, setTransactionsByDay] = useState<{
    [
      key: string
    ]: Database["public"]["Functions"]["get_transactions_by_day"]["Returns"];
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleLoadDay = async (
    params: Database["public"]["Functions"]["get_transactions_by_day"]["Args"],
  ) => {
    setIsLoading(true);

    const data = await getTransactionsByDay(params);

    setTransactionsByDay((prev) => ({
      ...prev,
      [params.p_date]: data,
    }));

    setIsLoading(false);
    // await toast.promise(promise, {
    //   loading: "Cargando transacciones...",
    //   error: "Error al cargar",
    //   success: (data) => {
    //     setTransactionsByDay((prev) => ({
    //       ...prev,
    //       [params.p_date]: data,
    //     }));
    //     return "Transacciones cargadas exitosamente";
    //   },
    // });
  };

  return dailySummaryCurrentMonth.map((i) => (
    <Card className="mx-auto w-full" key={i.day_date}>
      <CardContent>
        <Collapsible
          className="rounded-md data-[state=open]:bg-muted border"
          onOpenChange={(open) => {
            if (open) {
              if (open && !transactionsByDay[i.day_date]) {
                handleLoadDay({ p_date: i.day_date });
              }
            }
          }}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="group w-full justify-between min-h-fit p-2 border"
              disabled={i.total_expense === 0 && i.total_expense === 0}
            >
              <b>{i.day_date.slice(8)}</b>
              <div className="flex gap-2 items-center">
                <div className="flex flex-col gap-1">
                  <span className="flex gap-1 items-center text-green-400">
                    <ArrowDownLeft />${i.total_income}
                  </span>
                  <span className="flex gap-1 items-center text-red-400">
                    <ArrowUpRight />${i.total_expense}
                  </span>
                </div>
                <ChevronDown className="group-data-[state=open]:rotate-180" />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
            <div className=" w-full">
              {isLoading && <TransactionByDaySkeleton />}
              {transactionsByDay[i.day_date]?.map((t) => (
                <div key={t.id}>
                  {t.description} - ${t.amount}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  ));
}
