"use client";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function TransactionsMonthPicker() {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const monthValue = e.target.value;
    // router.push(`/transactions?month=${monthValue}`);
  };

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <Field className="bg-card w-fit max-w-40 m-auto rounded-lg right-0">
      <Input
        id="transaction_month"
        type="month"
        onChange={handleChange}
        defaultValue={currentMonth}
        className="bg-card overflow-hidden w-fit"
        max={new Date().toISOString().slice(0, 7)}
      />
    </Field>
  );
}
