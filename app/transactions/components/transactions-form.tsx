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
import { Constants, Database } from "@/database.types";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createTransaction } from "../actions";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";

const transactionSchema = z.object({
  p_account_id: z.string().min(1, "Account is required"),
  p_amount: z.number().min(0.01, "Amount must be greater than 0"),
  p_category_id: z.string().min(1, "Category is required"),
  p_description: z.string().optional(),
  p_transaction_date: z.string().min(1, "Date is required"),
  // p_type: z.enum(["income", "expense"]),
});

type TransactionFormData = {
  p_account_id: string;
  p_amount: number;
  p_category_id: string;
  p_description?: string;
  p_transaction_date: string;
  // p_type: "income" | "expense";
};
// Database["public"]["Functions"]["create_transaction"]["Args"];

interface Props {
  userAccounts: Database["public"]["Functions"]["get_user_accounts"]["Returns"];
  userCategories: Database["public"]["Functions"]["get_user_categories"]["Returns"];
}

export default function TransactionForm({
  userAccounts,
  userCategories,
}: Props) {
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
    try {
      setOpen(false);
      const promise = Promise.all([
        createTransaction({ ...data, p_type: transactionType }),
      ]);

      toast.promise(promise, {
        loading: "Creando transacción...",
        success: "Transacción creada",
        error: () => {
          setOpen(true);
          return "Error al crear la transacción";
        },
      });

      // // Wait for the transaction to be created
      // await promise;

      // // Refresh all data to update UI immediately
      // await onTransactionCreated();

      reset({
        // p_type: "expense",
        // p_transaction_date: new Date().toISOString().split("T")[0],
        p_amount: undefined,
        p_description: undefined,
        p_account_id: undefined,
        p_category_id: undefined,
      });
    } catch (error) {
      toast.error("Failed to create transaction");
      console.error(error);
    }
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
        <div className="flex flex-col gap-4">
          <Button
            size={"xl"}
            className="ml-5 text-accent"
            onClick={() => setTransactionType("expense")}
          >
            <ArrowUpRight />
          </Button>
          <Button
            variant="outline"
            size={"xl"}
            className="mr-5"
            onClick={() => setTransactionType("income")}
          >
            <ArrowDownLeft />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        // onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add {transactionType}</DialogTitle>
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
                        placeholder="amount"
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
                        placeholder="description"
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

                {/* Account Buttons */}
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

                {/* Category Buttons */}
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
                Cancel
              </Button>
              <Button type="submit" variant={"accent"}>
                Submit
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
