"use client";

import { Field } from "@/components/ui/field";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import MonthSwiper from "@/components/month-swiper";

export default function DashboardMonthPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const month = searchParams.get("month") || currentMonth;
  const [displayMonth, setDisplayMonth] = useState(month);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayMonth(month);
  }, [month]);

  useEffect(() => {
    if (isPending) {
      toast.loading("Cargando transacciones");
    }
    toast.dismiss();
  }, [isPending]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const handleChange = (value: string) => {
    setDisplayMonth(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("month", value);
      startTransition(() => {
        router.push(`/dashboard?${params.toString()}`);
      });
    }, 400);
  };

  return (
    <Field className="m-auto rounded-lg right-0 flex items-center gap-2 w-full px-8">
      <MonthSwiper
        value={displayMonth}
        max={currentMonth}
        onChange={handleChange}
      />
    </Field>
  );
}
