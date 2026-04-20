"use client";

import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { deleteTransaction } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

interface Props {
  item: {
    account_name: string;
    amount: number;
    category_name: string;
    description: string | null;
    id: string;
    transaction_date: string;
    type: string;
    is_transfer?: boolean;
    from_account_name?: string | null;
    to_account_name?: string | null;
    transfer_id?: string | null;
  };
  date: string;
}

export default function TransactionListItem({ item, date }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    await toast.promise(deleteTransaction({ p_transaction_id: item.id }), {
      loading: "Eliminando transacción...",
      success: "Transacción eliminada",
      error: (err) => `Error al eliminar la transacción: ${err}`,
    });
    setIsDeleteDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const isTransfer = item.is_transfer;

  return (
    <>
      <div
        className="flex flex-col gap-2 p-4 bg-card rounded-md select-none cursor-pointer hover:bg-card/60 transition-colors active:bg-muted/80"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            {isTransfer ? (
              <>
                <span className="px-2 py-1 bg-secondary rounded-2xl flex items-center gap-1">
                  <ArrowLeftRight className="w-3 h-3" />
                  Transferencia
                </span>
                <span className="text-muted-foreground text-xs">
                  {item.from_account_name} → {item.to_account_name}
                </span>
              </>
            ) : (
              <>
                <span className="px-2 py-1 bg-secondary rounded-2xl">
                  {item.category_name}
                </span>
                <span className="capitalize">
                  {item.type === "income" ? "Ingreso" : "Gasto"}
                </span>
              </>
            )}
          </div>
          <span
            className={`justify-end ${
              isTransfer
                ? "text-primary"
                : item.type === "income"
                  ? "text-success"
                  : "text-destructive"
            }`}
          >
            {isTransfer ? (
              <span className="flex items-center gap-1">
                <ArrowLeftRight className="w-3 h-3" />
                {formatCurrency(item.amount)}
              </span>
            ) : (
              formatCurrency(item.amount)
            )}
          </span>
        </div>
        {!isTransfer && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>{item.account_name}</span>
            {item.description && (
              <span className="capitalize">{item.description}</span>
            )}
          </div>
        )}
      </div>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        onCancel={handleCancel}
        title="Eliminar transacción"
        description={`¿Estás seguro de que quieres eliminar la transacción de ${formatCurrency(item.amount)}?`}
      />
    </>
  );
}
