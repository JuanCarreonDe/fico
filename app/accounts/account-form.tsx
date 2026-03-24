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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { createAccount } from "./actions";

const accountSchema = z.object({
  p_name: z.string().min(1, "Account name is required"),
  p_type: z.enum(["bank", "cash", "credit", "savings"]),
  p_initial_balance: z.number().optional(),
});

type AccountFormData =
  Database["public"]["Functions"]["create_account"]["Args"];

export default function AccountForm() {
  const [open, setOpen] = useState(false);

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
      console.log("🚀 ~ onSubmit ~ data:", data);
      const promise = createAccount(data);

      toast.promise(promise, {
        loading: "Creando cuenta...",
        success: "Cuenta creada",
        error: "Error al crear la cuenta",
      });

      setOpen(false);
      reset({
        p_type: "bank",
      });
    } catch (error) {
      toast.error("Failed to create account");
      console.error(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full h-full"
          variant={"outline"}
          onClick={() => {}}
        >
          <Plus />
          Add an account
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
                    placeholder="account name"
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
                    placeholder="balance"
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
              className="flex justify-between"
              defaultValue={"bank"}
            >
              {Constants.public.Enums.account_type.map((i) => (
                <Field orientation="horizontal" key={i}>
                  <RadioGroupItem value={i} id={`${i}-account`} />
                  <FieldLabel
                    htmlFor={`${i}-account`}
                    className="font-normal capitalize"
                  >
                    {i}
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
