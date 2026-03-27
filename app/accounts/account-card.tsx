"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Database } from "@/database.types";
import { Wallet } from "lucide-react";

interface AccountCardProps {
  account: Database["public"]["Functions"]["get_account_balances"]["Returns"][0];
  formatCurrency: (amount: number) => string;
}

export function AccountCard({ account, formatCurrency }: AccountCardProps) {
  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          {account.account_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Balance actual
            </span>
            <span className="text-lg font-semibold">
              {formatCurrency(account.balance || 0)}
            </span>
          </div>
          {account.account_type && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Tipo de cuenta
              </span>
              <span className="text-sm font-medium capitalize">
                {account.account_type}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
