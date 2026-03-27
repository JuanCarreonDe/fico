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
} from "../../components/ui/card";
import { Database } from "@/database.types";
import AccountForm from "@/app/accounts/account-form";
import { CreditCard, Plus } from "lucide-react";
import { AccountCard } from "./account-card";
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AccountDetailsCarouselProps {
  accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"];
  formatCurrency: (amount: number) => string;
}

export function AccountDetailsCarousel({
  accountBalances,
  formatCurrency,
}: AccountDetailsCarouselProps) {
  const [open, setOpen] = React.useState(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => {}}>
          <Plus />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="border border-accent">
        <DialogHeader>
          <DialogTitle>Detalles de cuentas</DialogTitle>
        </DialogHeader>
        <div className="w-full md:w-[70%] mx-auto border border-accent">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent className="p-1">
              {accountBalances?.map((account, index) => (
                <CarouselItem key={index} className="">
                  <AccountCard
                    account={account}
                    formatCurrency={formatCurrency}
                  />
                </CarouselItem>
              ))}
              <CarouselItem className="">
                <Card className="mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Nueva cuenta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="items-center justify-center flex h-full">
                    <AccountForm
                      buttonClassName="w-full h-full"
                      buttonText="Agregar cuenta"
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

          {/* Carousel Indicators */}
          {count > 1 && (
            <div className="py-2 text-center text-sm text-muted-foreground mt-4">
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: count }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full border ${
                      index + 1 === current ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
