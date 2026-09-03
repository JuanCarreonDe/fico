"use client";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { useEffect } from "react";

export default function TransactionsMonthPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const month = searchParams.get("month") || currentMonth;

  useEffect(() => {
    if (isPending) {
      toast.loading("Cargando transacciones");
    }
    toast.dismiss();
  }, [isPending]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", e.target.value);
    startTransition(() => {
      router.push(`/transactions?${params.toString()}`);
    });
  };

  return (
    <Field className="bg-card w-fit m-auto rounded-lg right-0 flex items-center gap-2">
      <Input
        id="transaction_month"
        type="month"
        onChange={handleChange}
        value={month}
        className="bg-card overflow-hidden w-fit max-w-md"
        max={currentMonth}
        disabled={isPending}
      />
      {/* <div className="animate-spin h-4 border-2 border-primary border-t-transparent rounded-full" /> */}
    </Field>
  );
}
