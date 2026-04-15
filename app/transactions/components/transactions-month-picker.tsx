"use client";
import { Input } from "@/components/ui/input";

export default function TransactionsMonthPicker() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const monthValue = e.target.value;
    // router.push(`/transactions?month=${monthValue}`);
  };

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <Input
      id="transaction_month"
      type="month"
      onChange={handleChange}
      defaultValue={currentMonth}
      className="max-w-40 m-auto"
      max={new Date().toISOString().slice(0, 7)}
    />
  );
}
