"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import {Database} from "@/database.types";



export function TransactionSumary({summary}: {summary: Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"]}) {
  const featureName = "Balance"

  return (
    <Card size="default" className="mx-auto w-full">
      <CardHeader>
        <CardTitle>{featureName}</CardTitle>
        <CardDescription>
          Weekly snapshots. No more manual exports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {JSON.stringify(summary)}
    </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button size="lg" className="w-full">
          Ver cuentas
        </Button>
      </CardFooter>
    </Card>
  )
}
