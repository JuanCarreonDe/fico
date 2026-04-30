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
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
    }, 200);
  };

  return (
    <>
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-200",
            closing ? "opacity-0" : "opacity-100",
          )}
        />
      )}

      <div
        className={cn(
          "fixed bottom-30 right-10 z-50 flex flex-col justify-center items-end w-fit transition-opacity duration-300",
          closing && "opacity-0",
        )}
      >
        <div className="items-center flex flex-col">
          {(isOpen || closing) && (
            <div
              className={cn(
                "flex flex-col gap-2 items-center mb-2 absolute bottom-15",
                isOpen && "animate-in slide-in-from-bottom-4 duration-200",
                closing && "animate-out slide-out-to-bottom-4 duration-200",
              )}
            >
              <TransactionFormClient
                userAccounts={userAccounts}
                userCategories={userCategories}
                label="Gasto"
                defaultType="expense"
                setIsFatherOpen={handleClose}
              />
              <TransactionFormClient
                userAccounts={userAccounts}
                userCategories={userCategories}
                label="Ingreso"
                defaultType="income"
                setIsFatherOpen={handleClose}
              />
              <TransferFormClient
                userAccounts={userAccounts}
                label="Transferencia"
                setIsFatherOpen={handleClose}
              />
            </div>
          )}

          <Button
            size="xl"
            variant={isOpen ? "destructive" : "accent"}
            className={cn(
              "rounded-full transition-transform duration-200",
              isOpen && "rotate-90",
            )}
            onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </>
  );
}
