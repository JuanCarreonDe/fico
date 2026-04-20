"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransactionFormClient from "./transaction-form-client";
import TransferFormClient from "./transfer-form-client";
import { cn } from "@/lib/utils";
import { Database } from "@/database.types";

type UserAccountsData =
  Database["public"]["Functions"]["get_user_accounts"]["Returns"];
type UserCategoriesData =
  Database["public"]["Functions"]["get_user_categories"]["Returns"];

interface FloatingActionsProps {
  userAccounts: UserAccountsData;
  userCategories: UserCategoriesData;
}

export default function FloatingActions({
  userAccounts,
  userCategories,
}: FloatingActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
      )}

      <div className="fixed bottom-30 right-0 left-0 z-50 mx-auto flex flex-col justify-center items-end w-full px-12">
        <div className="items-center flex flex-col">
          {isOpen && (
            <div className="flex flex-col gap-2 items-center mb-2 animate-in slide-in-from-bottom-4 duration-200 absolute bottom-15">
              <TransactionFormClient
                userAccounts={userAccounts}
                userCategories={userCategories}
                label="Gasto"
                defaultType="expense"
                setIsFatherOpen={setIsOpen}
              />
              <TransactionFormClient
                userAccounts={userAccounts}
                userCategories={userCategories}
                label="Ingreso"
                defaultType="income"
                setIsFatherOpen={setIsOpen}
              />
              <TransferFormClient
                userAccounts={userAccounts}
                label="Transferencia"
                setIsFatherOpen={setIsOpen}
              />
            </div>
          )}

          <Button
            size="xl"
            variant={isOpen ? "destructive" : "accent"}
            className={cn("w-fit rounded-full", isOpen && "rotate-90")}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </>
  );
}
