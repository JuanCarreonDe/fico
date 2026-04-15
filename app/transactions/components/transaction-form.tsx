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
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createTransaction } from "../actions";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Database } from "@/database.types";

type UserAccountsData =
  Database["public"]["Functions"]["get_user_accounts"]["Returns"];
type UserCategoriesData =
  Database["public"]["Functions"]["get_user_categories"]["Returns"];

const transactionSchema = z.object({
  p_account_id: z.string().min(1, "Account is required"),
  p_amount: z.number().min(0.01, "Amount must be greater than 0"),
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

export function TransactionForm({
  userAccounts,
  userCategories,
}: {
  userAccounts: UserAccountsData;
  userCategories: UserCategoriesData;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense",
  );

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      p_transaction_date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    await toast.promise(
      createTransaction({
        ...data,
        p_type: transactionType,
      }),
      {
        loading: "Creando transacción...",
        success: (res) => {
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
        error: "Error al crear la transacción",
      },
    );

    setOpen(false);
    reset({
      p_amount: undefined,
      p_description: undefined,
      p_account_id: undefined,
      p_category_id: undefined,
    });
    router.refresh();
  };

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
            p_transaction_date: new Date().toISOString().split("T")[0],
          });
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            Agregar {transactionType === "income" ? "ingreso" : "gasto"}
          </DialogTitle>
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
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
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
                      <div className="flex gap-2 overflow-x-auto pb-2">
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
                            className="whitespace-nowrap shrink-0"
                          >
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
                      <div className="flex gap-2 overflow-x-auto pb-2">
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
                      max={new Date().toISOString().split("T")[0]}
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
                    p_transaction_date: new Date().toISOString().split("T")[0],
                  });
                  setOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" variant={"accent"}>
                Guardar
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
