import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { ChevronRightIcon } from "lucide-react"

export function TransactionSumary() {
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
        content
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button size="lg" className="w-full">
          Ver cuentas
        </Button>
      </CardFooter>
    </Card>
  )
}
