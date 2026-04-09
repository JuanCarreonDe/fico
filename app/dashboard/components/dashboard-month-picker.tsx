"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function DashboardMonthPicker() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const router = useRouter();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value;
    router.push(`/dashboard?month=${newMonth}`);
  }, [router]);

  return (
    <Field className="">
      <Input
        id="dashboard_month"
        type="month"
        defaultValue={currentMonth}
        onChange={handleChange}
        className="max-w-40"
        max={currentMonth}
      />
    </Field>
  );
}
