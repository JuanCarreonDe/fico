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
import {
  Wallet,
  ListX,
  Trash2,
  Plus,
  ArrowLeftRight,
  ChevronDown,
} from "lucide-react";
import { useRef, useState } from "react";
import { archiveAccount } from "@/app/accounts/actions";
import { toast } from "sonner";
import AccountForm from "@/app/accounts/account-form";
import { AccountIconDisplay } from "@/lib/get-account-icon";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import TransferFormClient from "./transfer-form-client";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

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
    const beforeCutoff = Math.abs(account.credit_balance ?? 0);
    const inProgress = Math.abs(account.credit_pending ?? 0);
    const debt = beforeCutoff + inProgress;
    const available = Math.max(limit - debt, 0);
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
    return { limit, beforeCutoff, inProgress, debt, available, percentage, barColor };
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
              const accountRow = (
                <>
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer select-none min-w-0"
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
                      <span className="font-medium">
                        {account.account_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getAccountTypeLabel(account.account_type)}
                      </span>
                    </div>
                  </div>

                  {isCredit ? (
                    <CollapsibleTrigger
                      asChild
                      className="group flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-muted/50 transition-colors"
                    >
                      <button type="button">
                        <span className="font-medium text-sm">
                          {formatCurrency(credit.available)}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </button>
                    </CollapsibleTrigger>
                  ) : (
                    <span className="font-medium text-sm">
                      {formatCurrency(account.balance || 0)}
                    </span>
                  )}
                </>
              );

              if (!isCredit) {
                return (
                  <Card
                    key={account.account_id}
                    className="rounded-md flex flex-row p-3 justify-between items-center hover:bg-muted/50 transition-colors shadow-none!"
                  >
                    {accountRow}
                  </Card>
                );
              }

              return (
                <Collapsible key={account.account_id}>
                  <Card className="rounded-md p-3 hover:bg-muted/50 transition-colors shadow-none!">
                    <div className="flex items-center justify-between gap-2">
                      {accountRow}
                    </div>
                    <CollapsibleContent>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                          Fecha de corte: día {account.billing_cutoff_day}
                        </span>
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

                      <div className="mt-3 grid grid-cols-2 gap-1.5">
                        <div className="rounded-lg bg-muted/50 p-2.5">
                          <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                            Antes del corte
                          </span>
                          <span className="block text-sm font-semibold mt-0.5">
                            {formatCurrency(credit.beforeCutoff)}
                          </span>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2.5">
                          <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                            En proceso
                          </span>
                          <span className="block text-sm font-semibold mt-0.5">
                            {formatCurrency(credit.inProgress)}
                          </span>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2.5 col-span-1">
                          <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                            Total
                          </span>
                          <span className="block text-sm font-semibold mt-0.5">
                            {formatCurrency(credit.debt)}
                          </span>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 p-2.5 col-span-1">
                          <span className="block text-[10px] uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                            Disponible
                          </span>
                          <span className="block text-sm font-semibold mt-0.5 text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(credit.available)}
                          </span>
                        </div>
                      </div>

                      {credit.percentage !== null && (
                        <div className="mt-2.5">
                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${credit.barColor}`}
                              style={{ width: `${credit.percentage}%` }}
                            />
                          </div>
                          <span className="block text-[10px] text-muted-foreground mt-1">
                            {formatCurrency(credit.debt)} /{" "}
                            {formatCurrency(credit.limit)} de límite
                          </span>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
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
