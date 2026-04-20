"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Database } from "@/database.types";
import { createTransferAction } from "../transfer-actions";
import { toast } from "sonner";
import { ArrowLeftRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransactionStore } from "@/lib/store/transaction-store";

type UserAccountsData =
  Database["public"]["Functions"]["get_user_accounts"]["Returns"];

const getLocalDateString = () => new Date().toLocaleDateString("en-CA");

const transferSchema = z
  .object({
    p_from_account_id: z.string().min(1, "Selecciona cuenta origen"),
    p_to_account_id: z.string().min(1, "Selecciona cuenta destino"),
    p_amount: z.number().min(0.01, "El monto debe ser mayor a 0"),
    p_transaction_date: z.string().min(1, "La fecha es requerida"),
  })
  .refine((data) => data.p_from_account_id !== data.p_to_account_id, {
    message: "Las cuentas deben ser diferentes",
    path: ["p_to_account_id"],
  });

type TransferFormData = {
  p_from_account_id: string;
  p_to_account_id: string;
  p_amount: number;
  p_transaction_date: string;
};

interface TransferFormClientProps {
  userAccounts: UserAccountsData;
  label?: string;
  setIsFatherOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function TransferFormClient({
  userAccounts,
  label,
  setIsFatherOpen,
}: TransferFormClientProps) {
  // const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setIsLoading } = useTransactionStore();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      p_transaction_date: getLocalDateString(),
    },
  });

  const onSubmit = async (data: TransferFormData) => {
    setIsLoading(true);
    toast.promise(createTransferAction(data), {
      loading: "Creando transferencia...",
      success: "Transferencia creada",
      error: (err) => `Error: ${err}`,
      finally() {
        setIsLoading(true);
      },
    });

    setOpen(false);
    reset({
      p_from_account_id: undefined,
      p_to_account_id: undefined,
      p_amount: undefined,
      p_transaction_date: getLocalDateString(),
    });
    // router.refresh();
    if (setIsFatherOpen) setIsFatherOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          reset({
            p_from_account_id: undefined,
            p_to_account_id: undefined,
            p_amount: undefined,
            p_transaction_date: getLocalDateString(),
          });
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        {label ? (
          <Button className="shadow-2xl" size="xl">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="ml-2">{label}</span>
          </Button>
        ) : (
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Transferir entre cuentas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <Field>
                <FieldLabel>Monto</FieldLabel>
                <Controller
                  control={control}
                  name="p_amount"
                  render={({ field }) => (
                    <Input
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
                <FieldLabel>Cuenta origen</FieldLabel>
                <Controller
                  control={control}
                  name="p_from_account_id"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
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
                        >
                          {account.name}
                        </Button>
                      ))}
                    </div>
                  )}
                />
                {errors.p_from_account_id && (
                  <p className="text-red-500 text-sm">
                    {errors.p_from_account_id.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel>Cuenta destino</FieldLabel>
                <Controller
                  control={control}
                  name="p_to_account_id"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
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
                        >
                          {account.name}
                        </Button>
                      ))}
                    </div>
                  )}
                />
                {errors.p_to_account_id && (
                  <p className="text-red-500 text-sm">
                    {errors.p_to_account_id.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel>Fecha</FieldLabel>
                <Controller
                  control={control}
                  name="p_transaction_date"
                  render={({ field }) => (
                    <Input
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

            <Field orientation="horizontal" className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  reset({
                    p_from_account_id: undefined,
                    p_to_account_id: undefined,
                    p_amount: undefined,
                    p_transaction_date: getLocalDateString(),
                  });
                  setOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" variant={"accent"}>
                Transferir
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
