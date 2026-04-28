"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

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

  return (
    <Field className="flex items-center gap-2">
      <Input
        id="dashboard_month"
        type="month"
        value={month}
        onChange={handleChange}
        className="max-w-40"
        max={currentMonth}
        disabled={isPending}
      />
      {isPending && (
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
      )}
    </Field>
  );
}
