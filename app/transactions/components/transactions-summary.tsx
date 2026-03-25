"use client";
import * as React from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Database } from "@/database.types";
import AccountForm from "@/app/accounts/account-form";

export function TransactionSumary({
  summary,
  accountBalances,
}: {
  summary: Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"];
  accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"];
}) {
  const featureName = "Balance";

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className="flex flex-col gap-4">
      <Carousel setApi={setApi} className="w-full md:w-[70%] m-auto">
        <CarouselContent className="p-1">
          <CarouselItem className="">
            <Card
              size="default"
              className="mx-auto w-full h-full border-transparent border"
            >
              <CardHeader>
                <CardTitle>{featureName}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre>{JSON.stringify(summary[0], null, 2)}</pre>
              </CardContent>
            </Card>
          </CarouselItem>
          {accountBalances?.map((i, index) => (
            <CarouselItem key={index} className="">
              <Card size="default" className="mx-auto w-full h-full">
                <CardHeader>
                  <CardTitle>{i.account_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre>{JSON.stringify(i, null, 2)}</pre>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
          <CarouselItem className="">
            <Card size="default" className="mx-auto w-full h-full">
              <CardHeader>
                <CardTitle>New Account</CardTitle>
              </CardHeader>
              <CardContent className="items-center justify-center flex h-full">
                <AccountForm
                  buttonClassName="w-full h-full"
                  buttonText="Add account"
                  variant={"outline"}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselNext />
          <CarouselPrevious />
        </div>
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full border ${index + 1 === current ? "bg-accent" : "bg-card"}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
