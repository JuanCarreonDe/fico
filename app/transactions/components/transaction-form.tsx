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
// import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Args: {
//           p_account_id: string

//           p_amount: number

//           p_category_id: string

//           p_description: string

//           p_transaction_date: string
//           p_type: Database["public"]["Enums"]["transaction_type"]
//         }

const transactionSchema = z.object({
  p_account_id: z.string().min(1, "Account is required"),
  p_amount: z.number().min(0.01, "Amount must be greater than 0"),
  p_category_id: z.string().min(1, "Category is required"),
  p_description: z.string().min(1, "Description is required"),
  p_transaction_date: z.string().min(1, "Date is required"),
  p_type: z.enum(["income", "expense"])
});

type TransactionFormData = Database["public"]["Functions"]["create_transaction"]["Args"];
interface Props{
    userAccounts: Database["public"]["Functions"]["get_user_accounts"]["Returns"];  
    userCategories: Database["public"]["Functions"]["get_user_categories"]["Returns"];
}

export default function TransactionForm({userAccounts, userCategories}: Props) {
  const [open, setOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<Database["public"]["Functions"]["create_transaction"]['Args']>({
  // } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      p_type: "expense",
      p_transaction_date: new Date().toISOString().split('T')[0]
    }
  });

  const selectedType = watch("p_type");

  const onSubmit = async (data: TransactionFormData) => {
    try {
      console.log("Transaction data:", data);
      toast.success("Transaction created successfully!");
      setOpen(false);
      reset({
        p_type: "expense",
        p_transaction_date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      toast.error("Failed to create transaction");
      console.error(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={"lg"}>
          +
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Agregar transaccion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                {/* income / expense */}
                <RadioGroup
                  value={selectedType}
                  onValueChange={(value) => setValue("p_type", value as "income" | "expense")}
                  className="flex justify-between"
                  defaultValue={'expense'}
                >
                  {Constants.public.Enums.transaction_type.map((i) => (
                    <Field orientation="horizontal" key={i}>
                      <RadioGroupItem value={i} id={`${i}-transaction`} />
                      <FieldLabel
                        htmlFor={`${i}-transaction`}
                        className="font-normal capitalize"
                      >
                        {i}
                      </FieldLabel>
                    </Field>
                  ))}
                </RadioGroup>

                <Field>
                  <FieldLabel htmlFor="amount">Amount</FieldLabel>
                  <Input 
                    id="amount" 
                    placeholder="99" 
                    type="number" 
                    {...register("p_amount", { valueAsNumber: true })}
                  />
                  {errors.p_amount && (
                    <p className="text-red-500 text-sm">{errors.p_amount.message}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input 
                    id="description" 
                    placeholder="Dinner" 
                    {...register("p_description")}
                  />
                  {errors.p_description && (
                    <p className="text-red-500 text-sm">{errors.p_description.message}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="account">
                    Account
                  </FieldLabel>
                  <Select 
                    value={watch("p_account_id")}
                    onValueChange={(value) => setValue("p_account_id", value)}
                  >
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {userAccounts?.map(i=>(
                          <SelectItem value={i.id} key={i.name}>{i.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.p_account_id && (
                    <p className="text-red-500 text-sm">{errors.p_account_id.message}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="category">
                    Category
                  </FieldLabel>
                  <Select 
                    value={watch("p_category_id")}
                    onValueChange={(value) => setValue("p_category_id", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {userCategories?.map(i=>(
                          <SelectItem value={i.id} key={i.name}>{i.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.p_category_id && (
                    <p className="text-red-500 text-sm">{errors.p_category_id.message}</p>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

                <Field>
                  <FieldLabel htmlFor="transaction_date">Transaction date</FieldLabel>
                  <Input
                    id="transaction_date"
                    type="date"
                    {...register("p_transaction_date")}
                  />
                  {errors.p_transaction_date && (
                    <p className="text-red-500 text-sm">{errors.p_transaction_date.message}</p>
                  )}
                </Field>
            <FieldSeparator />

            <Field orientation="horizontal" className="flex justify-end">
              <Button size={"lg"} variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size={"lg"} type="submit">
                Submit
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
