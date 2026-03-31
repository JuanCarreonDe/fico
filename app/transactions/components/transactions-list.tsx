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
import { getTransactionsByDay } from "@/app/transactions/actions";
import { TransactionByDaySkeleton } from "./transactions-by-day-skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import TransactionListItem from "./transaction-list-item";
import { useTransactionStore } from "@/lib/store/transaction-store";

export function TransactionList() {
  const dailySummaryCurrentMonth = useTransactionStore(
    (state) => state.dailySummaryCurrentMonth,
  );
  const setTransactionsByDay = useTransactionStore(
    (state) => state.setTransactionsByDay,
  );
  const transactionsByDay = useTransactionStore(
    (state) => state.transactionsByDay,
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleLoadDay = async (
    params: Database["public"]["Functions"]["get_transactions_by_day"]["Args"],
  ) => {
    setIsLoading(true);

    const data = await getTransactionsByDay(params);

    setTransactionsByDay(params.p_date, data);

    setIsLoading(false);
  };

  return dailySummaryCurrentMonth?.map((i) => (
    <Card className="mx-auto w-full min-h-fit" key={i.day_date}>
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
              className="group w-full justify-between min-h-fit p-2 border ring-0 outline-none"
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
                    {format(new Date(i.day_date + "T00:00:00"), "MMM. yyyy", {
                      locale: es,
                    })}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex flex-col gap-1">
                  <span className="flex gap-1 items-center text-destructive">
                    <ArrowUpRight />${i.total_expense}
                  </span>
                  <span className="flex gap-1 items-center text-success">
                    <ArrowDownLeft />${i.total_income}
                  </span>
                </div>
                <ChevronDown className="group-data-[state=open]:rotate-180" />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
            <div className="w-full flex flex-col gap-2">
              {isLoading && <TransactionByDaySkeleton />}

              {transactionsByDay[i.day_date]?.map((t) => (
                <TransactionListItem key={t.id} item={t} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  ));
}
