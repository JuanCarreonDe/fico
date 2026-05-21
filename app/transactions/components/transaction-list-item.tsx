"use client";

import { useState, useRef } from "react";
import { formatCurrency } from "@/lib/format-currency";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { deleteTransaction } from "../actions";
import { toast } from "sonner";
import { ArrowLeftRight } from "lucide-react";
import { CategoryIconDisplay } from "@/lib/get-category-icon";
import { AccountIconDisplay } from "@/lib/get-account-icon";

import { Database } from "@/database.types";
import TransactionFormWrapper from "./transaction-form-wrapper";

type TransactionByDay =
  Database["public"]["Functions"]["get_transactions_by_day"]["Returns"][number];
type UserAccountsData =
  Database["public"]["Functions"]["get_user_accounts"]["Returns"];
type UserCategoriesData =
  Database["public"]["Functions"]["get_user_categories"]["Returns"];

interface Props {
  item: TransactionByDay;
  date: string;
  userAccounts: UserAccountsData;
  userCategories: UserCategoriesData;
}

const LONG_PRESS_DURATION = 500;

export default function TransactionListItem({
  item,
  date,
  userAccounts,
  userCategories,
}: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

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

  const handlePointerDown = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setIsDeleteDialogOpen(true);
    }, LONG_PRESS_DURATION);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!isLongPress.current && !item.is_transfer) {
      setIsEditModalOpen(true);
    }
  };

  const handlePointerLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const isTransfer = item.is_transfer;
  const account = userAccounts?.find((a) => a.id === item.account_id);

  return (
    <>
      <div
        className="flex flex-col gap-2 p-4 bg-card rounded-md select-none cursor-pointer hover:bg-card/60 transition-colors ring-1 ring-foreground/10"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            {isTransfer ? (
              <>
                <span className="px-2 py-1 bg-accent rounded-2xl flex items-center gap-1">
                  <ArrowLeftRight className="w-3 h-3" />
                  Transferencia
                </span>
                <span className="text-muted-foreground text-xs">
                  {item.from_account_name} → {item.to_account_name}
                </span>
              </>
            ) : (
              <>
                <span className="px-2 py-1 bg-accent rounded-2xl flex items-center gap-1">
                  <CategoryIconDisplay icon={item.category_icon} type={item.type} className="w-3 h-3" />
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
            <span className="flex items-center gap-1">
              <AccountIconDisplay type={account?.type ?? null} className="h-3 w-3" />
              {item.account_name}
            </span>
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
      {!isTransfer && (
        <TransactionFormWrapper
          transaction={item}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          userAccounts={userAccounts}
          userCategories={userCategories}
          isUpdate={true}
        />
      )}
    </>
  );
}
