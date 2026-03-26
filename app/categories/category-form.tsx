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
import { Plus } from "lucide-react";
import { createCategory } from "./actions";

const categorySchema = z.object({
  p_name: z.string().min(1, "Category name is required"),
  p_type: z.enum(["income", "expense"]),
});

type AccountFormData =
  Database["public"]["Functions"]["create_category"]["Args"];

export default function CategoryForm() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Database["public"]["Functions"]["create_category"]["Args"]>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      p_type: "expense",
    },
  });

  const selectedType = watch("p_type");

  const onSubmit = async (data: AccountFormData) => {
    try {
      const promise = createCategory(data);
      console.log("🚀 ~ onSubmit ~ promise:", promise);
      console.log("🚀 ~ onSubmit ~ data:", data);

      toast.promise(promise, {
        loading: "Creando categoría...",
        success: "Categoría creada",
        error: (error) => `Error al crear la categoría ${error}`,
      });

      setOpen(false);
      reset({
        p_type: "expense",
      });
    } catch (error) {
      toast.error("Failed to create category");
      console.error(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => {}}>
          <Plus />
          Add
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
                    placeholder="nombre de categoría"
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

            {/* category type */}
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
            <FieldSeparator />

            <Field orientation="horizontal" className="flex justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
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
