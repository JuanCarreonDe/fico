"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { Database } from "@/database.types";
import { Pen, Trash, Wallet } from "lucide-react";
import { SetStateAction, useState } from "react";
import { archiveAccount } from "./actions";
import { toast } from "sonner";

interface AccountCardProps {
  account: Database["public"]["Functions"]["get_account_balances"]["Returns"][0];
  formatCurrency: (amount: number) => string;
  setOpenFahterDialog?: (value: SetStateAction<boolean>) => void;
}

export function AccountCard({
  account,
  formatCurrency,
  setOpenFahterDialog,
}: AccountCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    const promise = archiveAccount({ p_account_id: account.account_id });

    toast.promise(promise, {
      loading: "Eliminando cuenta...",
      success: "Cuenta eliminada",
      error: (error) => {
        return `Error al eliminar la cuenta: ${error}`;
      },
    });

    setIsDeleteDialogOpen(false);

    if (setOpenFahterDialog) return setOpenFahterDialog(false);
  };

  const handleCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="mx-auto relative">
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
      <div className="flex justify-end gap-1 px-3">
        <Button
          variant={"destructive"}
          onClick={() => setIsDeleteDialogOpen(true)}
          className="w-full"
        >
          <Trash />
        </Button>
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDelete}
          onCancel={handleCancel}
          description="¿Estás seguro de que quieres eliminar esta cuenta? Esta acción no se puede deshacer. El nombre de la cuenta seguirá apareciendo en transacciones pasadas y el balance se restará del balance total."
        />
      </div>
    </Card>
  );
}
