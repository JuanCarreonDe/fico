"use client";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  p_description: z.string().min(1, "Description is required"),
  p_transaction_date: z.string().min(1, "Date is required"),
  // p_type: z.enum(["income", "expense"]),
});

type TransactionFormData = {
  p_account_id: string;
  p_amount: number;
  p_category_id: string;
  p_description: string;
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
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      // p_type: "expense",
      p_transaction_date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      const promise = createTransaction({ ...data, p_type: transactionType });

      toast.promise(promise, {
        loading: "Creando transacción...",
        success: "Transacción creada",
        error: "Error al crear la transacción",
      });

      setOpen(false);
      reset({
        // p_type: "expense",
        // p_transaction_date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      toast.error("Failed to create transaction");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            className="ml-5"
            onClick={() => setTransactionType("expense")}
          >
            <ArrowUpRight />
          </Button>
          <Button
            variant="default"
            className="mr-5 bg-accent"
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
                  <Input
                    id="amount"
                    placeholder="amount"
                    type="number"
                    {...register("p_amount", { valueAsNumber: true })}
                  />
                  {errors.p_amount && (
                    <p className="text-red-500 text-sm">
                      {errors.p_amount.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Input
                    id="description"
                    placeholder="description"
                    {...register("p_description")}
                  />
                  {errors.p_description && (
                    <p className="text-red-500 text-sm">
                      {errors.p_description.message}
                    </p>
                  )}
                </Field>

                {/* Account Select */}
                <Field>
                  <Controller
                    control={control}
                    name="p_account_id"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="account">
                          <SelectValue placeholder="account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {userAccounts?.map((i) => (
                              <SelectItem value={i.id} key={i.name}>
                                {i.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.p_account_id && (
                    <p className="text-red-500 text-sm">
                      {errors.p_account_id.message}
                    </p>
                  )}
                </Field>

                {/* Category Select */}
                <Field>
                  <Controller
                    control={control}
                    name="p_category_id"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {userCategories
                              ?.filter((i) => i.type === transactionType)
                              .map((i) => (
                                <SelectItem value={i.id} key={i.name}>
                                  {i.name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                <Input
                  id="transaction_date"
                  type="date"
                  {...register("p_transaction_date")}
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
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-accent">
                Submit
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
