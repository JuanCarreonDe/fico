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
import { Constants, Database } from "@/database.types";
import { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { createAccount } from "./actions";

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
  setOpenFahterDialog?: (value: SetStateAction<boolean>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const accountSchema = z.object({
  p_name: z.string().min(1, "Account name is required"),
  p_type: z.enum(["bank", "cash", "credit", "savings"]),
  p_initial_balance: z.number().optional(),
});

type AccountFormData =
  Database["public"]["Functions"]["create_account"]["Args"];

export default function AccountForm({
  buttonText = "",
  buttonClassName,
  variant,
  setOpenFahterDialog,
  open: externalOpen,
  onOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const setOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Database["public"]["Functions"]["create_account"]["Args"]>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      p_type: "bank",
    },
  });

  const selectedType = watch("p_type");

  const onSubmit = async (data: AccountFormData) => {
    try {
      const promise = createAccount(data);

      toast.promise(promise, {
        loading: "Creando cuenta...",
        success: () => {
          return "Cuenta creada";
        },
        error: (error) => {
          return `Error al crear la cuenta: ${error}`;
        },
        finally() {
          setOpen(false);
          if (setOpenFahterDialog) setOpenFahterDialog(false);
        },
      });

      reset({
        p_name: "",
        p_currency: "bank",
        p_initial_balance: undefined,
      });
    } catch (error) {
      toast.error("Failed to create account");
      console.error(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName} variant={variant}>
          <Plus />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Agregar cuenta</DialogTitle>
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

            {/* account type */}
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
            {Constants.public.Enums.account_type.map((i) => (
                <Field orientation="horizontal" key={i}>
                  <RadioGroupItem value={i} id={`${i}-account`} />
                  <FieldLabel
                    htmlFor={`${i}-account`}
                    className="font-normal capitalize"
                  >
                    {i === "bank" ? "Banco" : i === "cash" ? "Efectivo" : i === "credit" ? "Crédito" : "Ahorros"}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
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
