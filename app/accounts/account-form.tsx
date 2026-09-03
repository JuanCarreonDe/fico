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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { SetStateAction, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { createAccount, updateAccount, AccountBalance } from "./actions";
import { AccountIconDisplay } from "@/lib/get-account-icon";
import { useRouter } from "next/navigation";
import { Constants, Database } from "@/database.types";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";

interface Props {
  variant?:
    | "default"
    | "link"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | null
    | undefined;
  buttonClassName?: string;
  buttonText?: string;
  setOpenFatherDialog?: (value: SetStateAction<boolean>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  account?: AccountBalance;
}

const createAccountSchema = z.object({
  p_name: z.string().min(1, "Account name is required"),
  p_type: z.enum(["bank", "cash", "credit", "savings"]),
  p_initial_balance: z.number().optional(),
  p_sum_to_total: z.boolean().optional(),
  p_color: z.string().optional(),
});

const updateAccountSchema = z.object({
  p_name: z.string().min(1, "Account name is required"),
  p_type: z.enum(["bank", "cash", "credit", "savings"]),
  p_initial_balance: z.number().optional(),
  p_sum_to_total: z.boolean(),
  p_currency: z.string(),
  p_account_id: z.string(),
  p_color: z.string().optional(),
});

type CreateFormData = Database["public"]["Functions"]["create_account"]["Args"];
type UpdateFormData = Database["public"]["Functions"]["update_account"]["Args"];
const accountTypes = Constants.public.Enums.account_type;

export default function AccountForm({
  buttonText = "",
  buttonClassName,
  variant,
  setOpenFatherDialog,
  open: externalOpen,
  onOpenChange,
  account,
}: Props) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const setOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };

  const isEditMode = !!account;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateFormData | (UpdateFormData & { p_account_id: string })>({
    resolver: zodResolver(
      isEditMode ? updateAccountSchema : createAccountSchema,
    ),
    defaultValues: isEditMode
      ? {
          p_name: account.account_name,
          p_type: account.account_type as
            | "bank"
            | "cash"
            | "credit"
            | "savings",
          p_initial_balance: account.balance ?? 0,
          p_sum_to_total: account.account_sum_to_total ?? true,
          p_currency: account.account_currency,
          p_account_id: account.account_id,
          p_color: account.account_color ?? undefined,
        }
      : {
          p_type: "bank",
          p_sum_to_total: true,
          p_color: "#ff7301",
        },
  });

  const selectedType = useWatch({ control, name: "p_type" });
  const selectedColor = useWatch({ control, name: "p_color" });

  useEffect(() => {
    if (isEditMode) {
      reset({
        p_name: account.account_name,
        p_type: account.account_type as "bank" | "cash" | "credit" | "savings",
        p_initial_balance: account.balance ?? 0,
        p_sum_to_total: account.account_sum_to_total ?? true,
        p_currency: account.account_currency,
        p_account_id: account.account_id,
        p_color: account.account_color ?? undefined,
      });
    }
  }, [account, isEditMode, reset]);

  const onSubmit = async (
    data: CreateFormData | (UpdateFormData & { p_account_id: string }),
  ) => {
    if (isEditMode) {
      await toast.promise(
        updateAccount(data as UpdateFormData & { p_account_id: string }),
        {
          loading: "Actualizando cuenta...",
          success: "Cuenta actualizada",
          error: (err) => `Error al actualizar la cuenta: ${err}`,
        },
      );
    } else {
      await toast.promise(createAccount(data as CreateFormData), {
        loading: "Creando cuenta...",
        success: "Cuenta creada",
        error: (err) => `Error al crear la cuenta: ${err}`,
      });
    }

    setOpen(false);
    if (setOpenFatherDialog) setOpenFatherDialog(false);

    if (!isEditMode) {
      reset({
        p_name: "",
        p_currency: "bank",
        p_initial_balance: undefined,
        p_sum_to_total: true,
        p_color: "#ff7301",
      });
    }
    router.refresh();
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && !isEditMode) {
      reset({
        p_name: "",
        p_currency: "bank",
        p_initial_balance: undefined,
        p_sum_to_total: true,
        p_color: "#ff7301",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button className={buttonClassName} variant={variant}>
            <Plus />
            {buttonText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Actualizar cuenta" : "Agregar cuenta"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <Input
                    id="name"
                    placeholder="Nombre de la cuenta"
                    {...register("p_name")}
                  />
                  {errors.p_name && (
                    <p className="text-red-500 text-sm">
                      {errors.p_name.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Input
                    id="initial_balance"
                    placeholder="Balance inicial"
                    type="number"
                    step="0.01"
                    {...register("p_initial_balance", { valueAsNumber: true })}
                  />
                  {errors.p_initial_balance && (
                    <p className="text-red-500 text-sm">
                      {errors.p_initial_balance.message}
                    </p>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            <RadioGroup
              value={selectedType}
              onValueChange={(value) =>
                setValue(
                  "p_type",
                  value as "bank" | "cash" | "credit" | "savings",
                )
              }
              className="grid grid-cols-2 md:grid-cols-1"
              defaultValue={"bank"}
            >
              {accountTypes.map((i) => (
                <Field orientation="horizontal" key={i}>
                  <RadioGroupItem value={i} id={`${i}-account`} />
                  <FieldLabel
                    htmlFor={`${i}-account`}
                    className="font-normal capitalize flex items-center gap-2"
                  >
                    <AccountIconDisplay type={i} className="h-4 w-4" />
                    {i === "bank"
                      ? "Banco"
                      : i === "cash"
                        ? "Efectivo"
                        : i === "credit"
                          ? "Crédito"
                          : "Ahorros"}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>

            <Field className="flex flex-row gap-2 items-center justify-start">
              <Input
                type="checkbox"
                id="p_sum_to_total"
                {...register("p_sum_to_total")}
                className="min-w-5 min-h-5 h-5 w-fit! border"
              ></Input>
              <Label className="w-fit">Incluir en el saldo total</Label>

              {errors.p_sum_to_total && (
                <p className="text-red-500 text-sm">
                  {errors.p_sum_to_total.message}
                </p>
              )}
            </Field>

            <Field className="">
              <FieldLabel className="text-muted-foreground">
                Color del icono
              </FieldLabel>
              <div className="flex justify-between gap-4">
                <ColorPicker
                  value={selectedColor || "#ff7301"}
                  onChange={(e) => setValue("p_color", e.target.value)}
                  // presets={[
                  //   "#3b82f6",
                  //   "#10b981",
                  //   "#8b5cf6",
                  //   "#f59e0b",
                  //   "#ef4444",
                  //   "#ec4899",
                  //   "#06b6d4",
                  //   "#84cc16",
                  // ]}
                />
              </div>
            </Field>
            <FieldSeparator />

            <Field orientation="horizontal" className="flex justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
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
