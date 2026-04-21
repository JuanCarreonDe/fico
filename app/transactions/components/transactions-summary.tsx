import { TransactionsSummaryCard } from "./tansactions-summary-card";
import { Card, CardContent } from "@/components/ui/card";

export function TransactionSummary() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full md:w-[70%] mx-auto">
        <CardContent className="p-6">
          <TransactionsSummaryCard />
        </CardContent>
      </Card>
    </div>
  );
}
