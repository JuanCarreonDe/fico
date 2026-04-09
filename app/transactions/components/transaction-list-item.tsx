"use client";

import { useState, useRef, useCallback } from "react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { deleteTransaction } from "../actions";
import { toast } from "sonner";
import { useTransactionStore } from "@/lib/store/transaction-store";

interface Props {
  item: {
    account_name: string;
    amount: number;
    category_name: string;
    description: string;
    id: string;
    transaction_date: string;
    type: "income" | "expense";
  };
  date: string;
}

export default function TransactionListItem({ item, date }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const removeTransaction = useTransactionStore(
    (state) => state.removeTransaction,
  );
  const refreshData = useTransactionStore((state) => state.refreshData);

  const handleDelete = async () => {
    try {
      const promise = deleteTransaction({ p_transaction_id: item.id });

      setIsDeleteDialogOpen(false);

      toast.promise(promise, {
        loading: "Eliminando transacción...",
        success: () => {
          removeTransaction(date, item.id);
          return "Transacción eliminada";
        },
        error: (error) => {
          return `Error al eliminar la transacción: ${error}`;
        },
        async finally() {
          await refreshData();
        },
      });
    } catch {
      toast.error("Error al eliminar la transacción");
    } finally {
    }
  };

  const handleCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div
        className="flex flex-col gap-2 p-4 bg-card rounded-md select-none cursor-pointer hover:bg-card/60 transition-colors active:bg-muted/80"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="px-2 py-1 bg-secondary rounded-2xl">
              {item.category_name}
            </span>
            <span className="capitalize">{item.type}</span>
          </div>
          <span
            className={`justify-end ${item.type === "income" ? "text-success" : "text-destructive"}`}
          >
            ${item.amount}
          </span>
        </div>
        {item.description && (
          <p className="text-muted-foreground capitalize">{item.description}</p>
        )}
      </div>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        onCancel={handleCancel}
        title="Eliminar transacción"
        description={`¿Estás seguro de que quieres eliminar la transacción de $${item.amount}?`}
      />
    </>
  );
}
