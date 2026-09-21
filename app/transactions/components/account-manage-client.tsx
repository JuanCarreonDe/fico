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
import { formatCurrency } from "@/lib/format-currency";
import { Wallet, ListX, Trash2, Plus, ArrowLeftRight } from "lucide-react";
import { useRef, useState } from "react";
import { archiveAccount } from "@/app/accounts/actions";
import { toast } from "sonner";
import AccountForm from "@/app/accounts/account-form";
import { AccountIconDisplay } from "@/lib/get-account-icon";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import TransferFormClient from "./transfer-form-client";

type AccountBalance =
  Database["public"]["Functions"]["get_account_balances"]["Returns"][number];
type UserAccountsData =
  Database["public"]["Functions"]["get_user_accounts"]["Returns"];

interface AccountManageClientProps {
  accountBalances: AccountBalance[] | null;
  userAccounts: UserAccountsData;
}

export default function AccountManageClient({
  accountBalances,
  userAccounts,
}: AccountManageClientProps) {
  const router = useRouter();
  const [listOpen, setListOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountBalance | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [editAccountOpen, setEditAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountBalance | null>(
    null,
  );
  const [payAccount, setPayAccount] = useState<AccountBalance | null>(null);
  const longPressFired = useRef(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const LONG_PRESS_MS = 500;

  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleRowPointerDown = (account: AccountBalance) => {
    longPressFired.current = false;
    clearLongPressTimer();
    longPressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      longPressTimer.current = null;
      setSelectedAccount(account);
      setDeleteDialogOpen(true);
      setListOpen(false);
    }, LONG_PRESS_MS);
  };

  const handleRowPointerUp = (account: AccountBalance) => {
    clearLongPressTimer();
    if (longPressFired.current) return;
    setEditingAccount(account);
    setListOpen(false);
    setEditAccountOpen(true);
  };

  const handleRowPointerLeave = () => {
    clearLongPressTimer();
  };

  const getAccountColor = (color: string | null) => {
    if (color) {
      return { backgroundColor: `${color}1A`, color };
    }
    return {
      backgroundColor: "var(--muted)",
      color: "var(--muted-foreground)",
    };
  };

  const getAccountTypeLabel = (type: string | null) => {
    if (type === "bank") return "Banco";
    if (type === "cash") return "Efectivo";
    if (type === "credit") return "Crédito";
    if (type === "savings") return "Ahorros";
    return "Cuenta";
  };

  const getCreditUsage = (account: AccountBalance) => {
    const limit = account.credit_limit ?? 0;
    const debt = account.balance < 0 ? Math.abs(account.balance) : 0;
    const percentage =
      limit > 0 ? Math.min(100, Math.round((debt / limit) * 100)) : null;
    const barColor =
      percentage === null
        ? ""
        : percentage >= 80
          ? "bg-red-500"
          : percentage >= 50
            ? "bg-amber-500"
            : "bg-emerald-500";
    return { limit, debt, percentage, barColor };
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;
    setIsLoading(true);
    toast.promise(
      archiveAccount({ p_account_id: selectedAccount.account_id }),
      {
        loading: "Eliminando cuenta...",
        success: "Cuenta eliminada",
        error: (err) => `Error al eliminar la cuenta: ${err}`,
      },
    );

    setDeleteDialogOpen(false);
    setSelectedAccount(null);
    setIsLoading(false);
    router.refresh();
  };

  return (
    <>
      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full transition-opacity duration-300 animate-in fade-in"
          >
            <ListX />
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Cuentas</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 max-h-100 overflow-y-auto p-1">
            {!accountBalances && !isLoading && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Cargando cuentas...
              </div>
            )}
            {isLoading && (
              <>
                <Skeleton className="h-15" />
                <Skeleton className="h-15" />
              </>
            )}
            {accountBalances?.map((account) => {
              const isCredit = account.account_type === "credit";
              const credit = getCreditUsage(account);
              return (
                <Card
                  key={account.account_id}
                  className="rounded-md flex flex-row p-3 justify-between items-center hover:bg-muted/50 transition-colors shadow-none!"
                >
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                    onPointerDown={() => handleRowPointerDown(account)}
                    onPointerUp={() => handleRowPointerUp(account)}
                    onPointerLeave={handleRowPointerLeave}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedAccount(account);
                      setDeleteDialogOpen(true);
                      setListOpen(false);
                    }}
                  >
                    <div
                      className="p-2 rounded-full"
                      style={getAccountColor(account.account_color)}
                    >
                      <AccountIconDisplay
                        type={account.account_type}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{account.account_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {getAccountTypeLabel(account.account_type)}
                      </span>
                    </div>
                  </div>

                  {isCredit ? (
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="font-medium text-sm">
                        {credit.debt > 0
                          ? `Deuda: ${formatCurrency(credit.debt)}`
                          : "Sin deuda"}
                      </span>
                      {credit.percentage !== null && (
                        <>
                          <div className="h-1.5 w-28 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${credit.barColor}`}
                              style={{ width: `${credit.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {credit.percentage}% de {formatCurrency(credit.limit)}
                          </span>
                        </>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        onClick={() => {
                          setPayAccount(account);
                          setListOpen(false);
                        }}
                      >
                        <ArrowLeftRight className="h-3 w-3" />
                        Pagar
                      </Button>
                    </div>
                  ) : (
                    <span className="font-medium text-sm">
                      {formatCurrency(account.balance || 0)}
                    </span>
                  )}
                </Card>
              );
            })}

            <Card
              className="rounded-md flex flex-row p-3 justify-between items-center hover:bg-muted/50 transition-colors cursor-pointer border-dashed shadow-none!"
              onClick={() => {
                setListOpen(false);
                setAddAccountOpen(true);
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-full bg-muted">
                  <Plus className="h-4 w-4 text-muted-foreground" />
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
        key="add-account-form"
        open={addAccountOpen}
        onOpenChange={setAddAccountOpen}
        buttonClassName="hidden"
        buttonText=""
        variant="default"
      />

      <AccountForm
        key={editingAccount?.account_id ?? "edit-account-form"}
        open={editAccountOpen}
        onOpenChange={setEditAccountOpen}
        account={editingAccount ?? undefined}
        buttonClassName="hidden"
        buttonText=""
        setOpenFatherDialog={setListOpen}
      />

      <TransferFormClient
        userAccounts={userAccounts}
        hideTrigger
        open={payAccount !== null}
        onOpenChange={(openNow) => {
          if (!openNow) {
            setPayAccount(null);
            setListOpen(true);
          }
        }}
        presetToAccountId={payAccount?.account_id}
        presetFromAccountId={userAccounts.find((a) => a.type !== "credit")?.id}
      />
    </>
  );
}
