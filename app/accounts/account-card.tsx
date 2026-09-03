// "use client";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
// import { Database } from "@/database.types";
// import { formatCurrency } from "@/lib/format-currency";
// import { useRef, useState } from "react";
// import { archiveAccount } from "./actions";
// import { toast } from "sonner";
// import { AccountIconDisplay } from "@/lib/get-account-icon";

// interface AccountCardProps {
//   account: Database["public"]["Functions"]["get_account_balances"]["Returns"][0];
//   onEdit: (account: AccountCardProps["account"]) => void;
//   setOpenFatherDialog?: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export function AccountCard({
//   account,
//   onEdit,
//   setOpenFatherDialog,
// }: AccountCardProps) {
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const longPressFired = useRef(false);
//   const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const LONG_PRESS_MS = 500;

//   const clearLongPressTimer = () => {
//     if (longPressTimer.current) {
//       clearTimeout(longPressTimer.current);
//       longPressTimer.current = null;
//     }
//   };

//   const handlePointerDown = () => {
//     longPressFired.current = false;
//     clearLongPressTimer();
//     longPressTimer.current = setTimeout(() => {
//       longPressFired.current = true;
//       longPressTimer.current = null;
//       setIsDeleteDialogOpen(true);
//     }, LONG_PRESS_MS);
//   };

//   const handlePointerUp = () => {
//     clearLongPressTimer();
//     if (longPressFired.current) return;
//     onEdit(account);
//   };

//   const handlePointerLeave = () => {
//     clearLongPressTimer();
//   };

//   const handleDelete = () => {
//     const promise = archiveAccount({ p_account_id: account.account_id });

//     toast.promise(promise, {
//       loading: "Eliminando cuenta...",
//       success: "Cuenta eliminada",
//       error: (error) => {
//         return `Error al eliminar la cuenta: ${error}`;
//       },
//     });

//     setIsDeleteDialogOpen(false);

//     if (setOpenFatherDialog) return setOpenFatherDialog(false);
//   };

//   const handleCancel = () => {
//     setIsDeleteDialogOpen(false);
//   };

//   return (
//     <Card
//       className="mx-auto relative select-none cursor-pointer"
//       onPointerDown={handlePointerDown}
//       onPointerUp={handlePointerUp}
//       onPointerLeave={handlePointerLeave}
//       onContextMenu={(e) => {
//         e.preventDefault();
//         setIsDeleteDialogOpen(true);
//       }}
//     >
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <AccountIconDisplay type={account.account_type} className="w-5 h-5" />
//           {account.account_name}
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <span className="text-sm text-muted-foreground">
//               Balance actual
//             </span>
//             <span className="text-lg font-semibold">
//               {formatCurrency(account.balance || 0)}
//             </span>
//           </div>
//           {account.account_type && (
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-muted-foreground">
//                 Tipo de cuenta
//               </span>
//               <span className="text-sm font-medium capitalize">
//                 {account.account_type === "bank"
//                   ? "Banco"
//                   : account.account_type === "cash"
//                     ? "Efectivo"
//                     : account.account_type === "credit"
//                       ? "Crédito"
//                       : "Ahorros"}
//               </span>
//             </div>
//           )}
//         </div>
//       </CardContent>
//       <DeleteConfirmationDialog
//         isOpen={isDeleteDialogOpen}
//         onOpenChange={setIsDeleteDialogOpen}
//         onDelete={handleDelete}
//         onCancel={handleCancel}
//         description="¿Estás seguro de que quieres eliminar esta cuenta? Esta acción no se puede deshacer. El nombre de la cuenta seguirá apareciendo en transacciones pasadas y el balance se restará del balance total."
//       />
//     </Card>
//   );
// }
