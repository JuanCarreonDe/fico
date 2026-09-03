"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";

export default function DashboardMonthPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const month = searchParams.get("month") || currentMonth;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", e.target.value);
    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`);
    });
  };

  useEffect(() => {
    if (isPending) {
      toast.loading("Cargando transacciones");
    }
    toast.dismiss();
  }, [isPending]);

  return (
    <Field className="bg-card w-fit m-auto rounded-lg right-0 flex items-center gap-2">
      <Input
        id="dashboard_month"
        type="month"
        value={month}
        onChange={handleChange}
        className="bg-card overflow-hidden w-fit max-w-md"
        max={currentMonth}
        disabled={isPending}
      />
    </Field>
  );
}
