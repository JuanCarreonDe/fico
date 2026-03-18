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
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

// Args: {
//           p_account_id: string

//           p_amount: number

//           p_category_id: string

//           p_description: string

//           p_transaction_date: string
//           p_type: Database["public"]["Enums"]["transaction_type"]
//         }
interface Props{
    userAccounts: Database["public"]["Functions"]["get_user_accounts"]["Returns"];  
    userCategories: Database["public"]["Functions"]["get_user_categories"]["Returns"];
}

export default function TransactionForm({userAccounts, userCategories}: Props) {
  // const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"lg"}>
          +
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Agregar transaccion</DialogTitle>
        </DialogHeader>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                {/* income / expense */}
                <RadioGroup
                  defaultValue="expense"
                  className="flex justify-between"
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
                  <Input id="amount" placeholder="99" required type="number" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input id="description" placeholder="Dinner" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="account">
                    Account
                  </FieldLabel>
                  <Select defaultValue="">
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
                </Field>
                <Field>
                  <FieldLabel htmlFor="category">
                    Category
                  </FieldLabel>
                  <Select defaultValue="">
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
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border"
              captionLayout="dropdown"
            /> */}

                {/* <input type="date" /> */}
                <Field>
                  <FieldLabel htmlFor="transaction_date">Transaction date</FieldLabel>
                  <Input
                    id="transaction_date"
                    required
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </Field>
            <FieldSeparator />

            <Field orientation="horizontal" className="flex justify-end">
              <Button size={"lg"} variant="outline" type="button">
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
