"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import { Database } from "@/database.types";
import { Trash2, Wallet, ListX } from "lucide-react";
import { useState } from "react";
import { archiveAccount } from "./actions";
import { toast } from "sonner";
import AccountForm from "./account-form";

interface Props {
  accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"];
  formatCurrency: (amount: number) => string;
}

export default function AccountManage({
  accountBalances,
  formatCurrency,
}: Props) {
  const [listOpen, setListOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<
    | Database["public"]["Functions"]["get_account_balances"]["Returns"][number]
    | null
  >(null);

  const getAccountIcon = (type: string | null) => {
    return <Wallet className="h-4 w-4" />;
  };

  const getAccountColor = (type: string | null) => {
    switch (type) {
      case "bank":
        return "bg-blue-500/10 text-blue-500";
      case "cash":
        return "bg-green-500/10 text-green-500";
      case "credit":
        return "bg-purple-500/10 text-purple-500";
      case "savings":
        return "bg-amber-500/10 text-amber-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const openDeleteDialog = (
    account: Database["public"]["Functions"]["get_account_balances"]["Returns"][number],
  ) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
    setListOpen(false);
  };

  const handleDelete = () => {
    if (!selectedAccount) return;

    const promise = archiveAccount({
      p_account_id: selectedAccount.account_id,
    });

    toast.promise(promise, {
      loading: "Eliminando cuenta...",
      success: "Cuenta eliminada",
      error: (error) => {
        return `Error al eliminar la cuenta: ${error}`;
      },
    });

    setDeleteDialogOpen(false);
    setSelectedAccount(null);
  };

  return (
    <>
      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogTrigger asChild>
          <Button variant={"outline"} className="w-full">
            <ListX />
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Cuentas</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 max-h-100 overflow-y-auto">
            {accountBalances.map((account) => (
              <Card
                key={account.account_id}
                className="rounded-md flex flex-row p-3 justify-between items-center hover:bg-muted/50 transition-colors"
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => openDeleteDialog(account)}
                >
                  <div
                    className={`p-2 rounded-full ${getAccountColor(account.account_type)}`}
                  >
                    {getAccountIcon(account.account_type)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{account.account_name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {account.account_type || "Cuenta"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {formatCurrency(account.balance || 0)}
                  </span>
                </div>
              </Card>
            ))}

            <Card
              className="rounded-md flex flex-row p-3 justify-between items-center hover:bg-muted/50 transition-colors cursor-pointer border-dashed"
              onClick={() => {
                setListOpen(false);
                setAddAccountOpen(true);
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-full bg-muted">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="font-medium text-muted-foreground">
                  Agregar cuenta
                </span>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setListOpen(true);
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-full bg-red-500/10">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              Eliminar cuenta
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="bg-muted/50 p-3 rounded-lg">
              <span className="text-sm text-muted-foreground">Cuenta: </span>
              <span className="font-medium">
                {selectedAccount?.account_name}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de que quieres eliminar esta cuenta? Esta acción no
              se puede deshacer. El nombre de la cuenta seguirá apareciendo en
              transacciones pasadas y el balance se restará del balance total.
            </p>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setListOpen(true);
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AccountForm
        open={addAccountOpen}
        onOpenChange={setAddAccountOpen}
        buttonClassName="hidden"
        buttonText=""
        variant="default"
      />
    </>
  );
}
