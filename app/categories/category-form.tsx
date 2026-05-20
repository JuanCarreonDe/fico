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
import { Database } from "@/database.types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, ChevronDown } from "lucide-react";
import { createCategory } from "./actions";
import { useRouter } from "next/navigation";
import IconPicker from "@/components/icon-picker";
import { CategoryIconDisplay } from "@/lib/get-category-icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const categorySchema = z.object({
  p_name: z.string().min(1, "Category name is required"),
  p_type: z.enum(["income", "expense", "transfer"]),
  p_budget: z.number().optional(),
  p_icon: z.string().min(1, "Icon is required"),
});

type CreateCategoryArgs =
  Database["public"]["Functions"]["create_category"]["Args"];

export default function CategoryForm({
  buttonText = "",
  buttonClassName,
  open: externalOpen,
  onOpenChange,
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      p_type: "expense",
      p_icon: "Tags",
    },
  });

  const selectedType = watch("p_type");
  const selectedIcon = watch("p_icon");

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    await toast.promise(createCategory(data as CreateCategoryArgs), {
      loading: "Creando categoría...",
      success: "Categoría creada",
      error: (err) => `Error al crear la categoría: ${err}`,
    });

    setOpen(false);
      reset({
        p_type: "expense",
        p_icon: "Tags",
      });
    router.refresh();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName}>
          <Plus />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Agregar categoría</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <Input
                    id="name"
                    placeholder="Nombre de la categoría"
                    {...register("p_name")}
                  />
                  {errors.p_name && (
                    <p className="text-red-500 text-sm">
                      {errors.p_name.message}
                    </p>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            <RadioGroup
              value={selectedType}
              onValueChange={(value) =>
                setValue("p_type", value as "income" | "expense")
              }
              className="flex justify-between"
              defaultValue={"expense"}
            >
              {["income", "expense"].map((i) => (
                <Field orientation="horizontal" key={i}>
                  <RadioGroupItem value={i} id={`${i}-category`} />
                  <FieldLabel
                    htmlFor={`${i}-category`}
                    className="font-normal capitalize"
                  >
                    {i === "income" ? "Ingreso" : "Gasto"}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>

            {selectedType === "expense" && (
              <FieldSet>
                <FieldLabel className="text-muted-foreground">
                  Presupuesto mensual
                </FieldLabel>
                <Input
                  id="budget"
                  type="number"
                  placeholder="0.00"
                  {...register("p_budget", {
                    setValueAs: (value) =>
                      value ? parseFloat(value) : undefined,
                  })}
                />
              </FieldSet>
            )}

            <FieldSet>
              <Collapsible className="rounded-md data-[state=open]:bg-muted">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="group w-full justify-between h-auto p-2"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      Icono
                      {selectedIcon ? (
                        <CategoryIconDisplay icon={selectedIcon} type={selectedType} className="h-4 w-4" />
                      ) : null}
                    </span>
                    <ChevronDown className="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2.5 pt-0">
                  <IconPicker
                    value={selectedIcon}
                    onChange={(icon) => setValue("p_icon", icon)}
                  />
                </CollapsibleContent>
              </Collapsible>
            </FieldSet>

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
