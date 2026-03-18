// features/transactions/hooks/useMonthlyFinancialSummary.ts
"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getMonthlyFinancialSummary } from "../services/transactions.service"

export const useTransactionsServices = () => {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchSummary = async () => {
    setLoading(true)

    try {
      const promise = getMonthlyFinancialSummary()

      const data = await toast.promise(promise, {
        loading: "Cargando resumen financiero...",
        error: "No se pudo cargar el resumen"
      })

      setSummary(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  return {
    summary,
    loading,
    refetch: fetchSummary
  }
}