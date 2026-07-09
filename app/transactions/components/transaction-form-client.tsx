"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createTransaction, updateTransaction } from "../actions";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Database } from "@/database.types";
import { CategoryIconDisplay } from "@/lib/get-category-icon";
import { AccountIconDisplay } from "@/lib/get-account-icon";
import { useTransactionStore } from "@/lib/store/transaction-store";

type UserAccountsData =
  Database["public"]["Functions"]["get_user_accounts"]["Returns"];
type UserCategoriesData =
  Database["public"]["Functions"]["get_user_categories"]["Returns"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type TransactionByDay =
  Database["public"]["Functions"]["get_transactions_by_day"]["Returns"][number];

const getLocalDateString = () => new Date().toLocaleDateString("en-CA");

const transactionSchema = z.object({
  p_account_id: z.string().min(1, "Account is required"),
  p_amount: z.number().min(0, "Amount must be greater than 0"),
  p_category_id: z.string().min(1, "Category is required"),
  p_description: z.string().optional(),
  p_transaction_date: z.string().min(1, "Date is required"),
});

type TransactionFormData = {
  p_account_id: string;
  p_amount: number;
  p_category_id: string;
  p_description?: string;
  p_transaction_date: string;
};

export interface TransactionFormClientProps {
  userAccounts: UserAccountsData;
  userCategories: UserCategoriesData;
  label?: string;
  defaultType?: "income" | "expense";
  setIsFatherOpen?: Dispatch<SetStateAction<boolean>>;
  transaction?: Transaction | TransactionByDay;
  isUpdate?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function TransactionFormClient({
  userAccounts,
  userCategories,
  label = "Agregar",
  defaultType = "expense",
  setIsFatherOpen,
  transaction,
  isUpdate = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: TransactionFormClientProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    transaction?.type === "transfer" || transaction?.type === "transfer"
      ? defaultType
      : (transaction?.type as "income" | "expense") || defaultType,
  );
  const { setIsLoading } = useTransactionStore();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (value: boolean) => controlledOnOpenChange?.(value)
    : setInternalOpen;

  const defaultValues =
    isUpdate && transaction
      ? {
          p_account_id:
            "account_id" in transaction
              ? (transaction.account_id as string)
              : "",
          p_amount: transaction.amount,
          p_description: transaction.description || "",
          p_transaction_date:
            "transaction_date" in transaction
              ? (transaction.transaction_date as string)
              : getLocalDateString(),
          p_category_id:
            "category_id" in transaction
              ? (transaction.category_id as string) || ""
              : "",
        }
      : {
          p_transaction_date: getLocalDateString(),
        };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  const onSubmit = async (data: TransactionFormData) => {
    if (!data.p_amount || data.p_amount < 0.01) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }
    setIsLoading(true);
    const action = isUpdate
      ? updateTransaction({
          ...data,
          p_amount: data.p_amount!,
          p_description: data.p_description || "",
          p_transaction_id: transaction!.id,
          p_type: transactionType,
        })
      : createTransaction({
          ...data,
          p_amount: data.p_amount!,
          p_type: transactionType,
        });

    toast.promise(action, {
      loading: isUpdate
        ? "Actualizando transacción..."
        : "Creando transacción...",
      success: (res) => {
        if (isUpdate) {
          return "Transacción actualizada";
        }
        const transaction = Array.isArray(res) ? res[0] : res;
        if (transactionType === "expense" && transaction) {
          const { budget_amount, remaining_amount, remaining_percentage } =
            transaction;
          if (budget_amount !== null) {
            const remainingFormatted = new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
            }).format(remaining_amount || 0);

            const budgetFormatted = new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
            }).format(budget_amount || 0);

            const percentage = Math.round(remaining_percentage || 0);
            return `Transacción creada. Presupuesto restante: ${remainingFormatted} de ${budgetFormatted} (${percentage}%)`;
          }
          return "Transacción creada";
        }
        return "Transacción creada";
      },
      error: isUpdate
        ? "Error al actualizar la transacción"
        : "Error al crear la transacción",
      finally() {
        setIsLoading(false);
      },
    });
    setOpen(false);
    reset({
      p_amount: undefined,
      p_description: undefined,
      p_account_id: undefined,
      p_category_id: undefined,
    });
    if (setIsFatherOpen) setIsFatherOpen(false);
  };

  const dialogTitle = isUpdate
    ? `Editar ${transactionType === "income" ? "ingreso" : "gasto"}`
    : `Agregar ${transactionType === "income" ? "ingreso" : "gasto"}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          reset({
            p_amount: undefined,
            p_description: undefined,
            p_account_id: undefined,
            p_category_id: undefined,
            p_transaction_date: getLocalDateString(),
          });
        }
        setOpen(newOpen);
      }}
    >
      {!isUpdate && (
        <DialogTrigger asChild>
          {label ? (
            <Button className="shadow-2xl" size="xl">
              {transactionType === "income" ? (
                <ArrowDownLeft />
              ) : (
                <ArrowUpRight />
              )}
              <span className="ml-2">{label}</span>
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="default"
                className="shadow-2xl"
                size={"xl"}
                onClick={() => setTransactionType("income")}
              >
                <ArrowDownLeft />
              </Button>
              <Button
                size={"xl"}
                variant={"accent"}
                className="shadow-2xl"
                onClick={() => setTransactionType("expense")}
              >
                <ArrowUpRight />
              </Button>
            </div>
          )}
        </DialogTrigger>
      )}
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <Controller
                    control={control}
                    name="p_amount"
                    render={({ field }) => (
                      <Input
                        id="amount"
                        placeholder="0.00"
                        type="number"
                        value={field.value || ""}
                        // onChange={field.onChange}

                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                  {errors.p_amount && (
                    <p className="text-red-500 text-sm">
                      {errors.p_amount.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Controller
                    control={control}
                    name="p_description"
                    render={({ field }) => (
                      <Input
                        id="description"
                        placeholder="Descripción (opcional)"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.p_description && (
                    <p className="text-red-500 text-sm">
                      {errors.p_description.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="text-muted-foreground">
                    Cuenta
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="p_account_id"
                    render={({ field }) => (
                      // <div className="flex flex-wrap gap-2 ">
                      <div className="flex gap-2 overflow-x-scroll pb-2 touch-pan-x touch-pan-y select-none">
                        {userAccounts?.map((account) => (
                          <Button
                            key={account.id}
                            type="button"
                            variant={
                              field.value === account.id ? "default" : "outline"
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              field.onChange(account.id);
                            }}
                            className="gap-1.5"
                          >
                            <AccountIconDisplay
                              type={account.type}
                              className="h-4 w-4"
                            />
                            {account.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  />
                  {errors.p_account_id && (
                    <p className="text-red-500 text-sm">
                      {errors.p_account_id.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="text-muted-foreground">
                    Categoría
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="p_category_id"
                    render={({ field }) => (
                      // <div className="flex flex-wrap gap-2">
                      <div className="flex gap-2 overflow-x-scroll pb-2 touch-pan-x touch-pan-y select-none">
                        {userCategories
                          ?.filter((i) => i.type === transactionType)
                          .map((category) => (
                            <Button
                              key={category.id}
                              type="button"
                              variant={
                                field.value === category.id
                                  ? "default"
                                  : "outline"
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                field.onChange(category.id);
                              }}
                              className="whitespace-nowrap shrink-0"
                            >
                              <CategoryIconDisplay
                                icon={category.icon}
                                type={transactionType}
                                className="h-4 w-4 mr-1.5"
                              />
                              {category.name}
                            </Button>
                          ))}
                      </div>
                    )}
                  />
                  {errors.p_category_id && (
                    <p className="text-red-500 text-sm">
                      {errors.p_category_id.message}
                    </p>
                  )}
                </Field>
              </FieldGroup>

              <Field>
                <Controller
                  control={control}
                  name="p_transaction_date"
                  render={({ field }) => (
                    <Input
                      id="transaction_date"
                      type="date"
                      value={field.value || ""}
                      onChange={field.onChange}
                      max={getLocalDateString()}
                    />
                  )}
                />
                {errors.p_transaction_date && (
                  <p className="text-red-500 text-sm">
                    {errors.p_transaction_date.message}
                  </p>
                )}
              </Field>
            </FieldSet>

            <FieldSeparator />

            <Field orientation="horizontal" className="flex justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  reset({
                    p_amount: undefined,
                    p_description: undefined,
                    p_account_id: undefined,
                    p_category_id: undefined,
                    p_transaction_date: getLocalDateString(),
                  });
                  setOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" variant={"accent"}>
                {isUpdate ? "Actualizar" : "Guardar"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
