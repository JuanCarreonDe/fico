"use client";
import { Input } from "@/components/ui/input";
import { getDailySummaryByMonth } from "../actions";
import { useTransactionStore } from "@/lib/store/transaction-store";

export default function TransactionsMonthPicker() {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { setDailySummaryCurrentMonth, setIsLoading } = useTransactionStore();

  const handleClick = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const monthValue = e.target.value; // Format: "YYYY-MM"
    const monthFullDate = `${monthValue}-01`;

    setIsLoading(true);

    const res = await getDailySummaryByMonth({
      p_month: monthFullDate,
    });

    setDailySummaryCurrentMonth(res);
    setIsLoading(false);
  };

  return (
    <Input
      id="transaction_date"
      type="month"
      onChange={handleClick}
      defaultValue={currentMonth}
      className="max-w-40 m-auto"
      max={currentMonth}
    />
  );
}
