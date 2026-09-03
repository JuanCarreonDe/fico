// "use client";
// import * as React from "react";
// import {
//   Carousel,
//   CarouselApi,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
// import { Database } from "@/database.types";
// import AccountForm from "@/app/accounts/account-form";
// import { CreditCard, ListX } from "lucide-react";
// import { AccountCard } from "./account-card";
// import {
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   Dialog,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { AccountBalance } from "./actions";

// interface AccountDetailsCarouselProps {
//   accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"];
//   label?: string;
// }

// export function AccountDetailsCarousel({
//   accountBalances,
//   label = "Manage accounts",
// }: AccountDetailsCarouselProps) {
//   const [open, setOpen] = React.useState(false);
//   const [api, setApi] = React.useState<CarouselApi>();
//   const [current, setCurrent] = React.useState(0);
//   const [count, setCount] = React.useState(0);
//   const [editingAccount, setEditingAccount] = React.useState<AccountBalance | null>(null);
//   const [editOpen, setEditOpen] = React.useState(false);

//   React.useEffect(() => {
//     if (!api) {
//       return;
//     }
//     setCount(api.scrollSnapList().length);
//     setCurrent(api.selectedScrollSnap() + 1);
//     api.on("select", () => {
//       setCurrent(api.selectedScrollSnap() + 1);
//     });
//   }, [accountBalances, api]);

//   const handleEdit = (account: AccountBalance) => {
//     setEditingAccount(account);
//     setEditOpen(true);
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button onClick={() => {}} className="w-full" variant={"outline"}>
//             <ListX />
//             {label}
//           </Button>
//         </DialogTrigger>
//         <DialogContent showCloseButton={false}>
//           <DialogHeader>
//             <DialogTitle>Detalles de cuentas</DialogTitle>
//           </DialogHeader>
//           <div className="w-full md:w-[70%] mx-auto overflow-hidden">
//             <Carousel setApi={setApi} className="w-full">
//               <CarouselContent className="p-1">
//                 {accountBalances?.map((account, index) => (
//                   <CarouselItem key={index} className="">
//                     <AccountCard
//                       account={account}
//                       onEdit={handleEdit}
//                       setOpenFatherDialog={setOpen}
//                     />
//                   </CarouselItem>
//                 ))}
//                 <CarouselItem className="">
//                   <Card className="mx-auto h-full">
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2">
//                         <CreditCard className="w-5 h-5" />
//                         Nueva cuenta
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="items-center justify-center flex h-full">
//                       <AccountForm
//                         buttonClassName="w-full h-full"
//                         buttonText="Agregar cuenta"
//                         variant={"outline"}
//                         setOpenFatherDialog={setOpen}
//                       />
//                     </CardContent>
//                   </Card>
//                 </CarouselItem>
//               </CarouselContent>
//               <div className="hidden md:block">
//                 <CarouselNext />
//                 <CarouselPrevious />
//               </div>
//             </Carousel>
//             {count > 1 && (
//               <div className="py-2 text-center text-sm text-muted-foreground mt-4">
//                 <div className="flex items-center justify-center gap-2">
//                   {Array.from({ length: count }).map((_, index) => (
//                     <div
//                       key={index}
//                       className={`w-2 h-2 rounded-full border ${
//                         index + 1 === current ? "bg-primary" : "bg-muted"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//       <AccountForm
//         open={editOpen}
//         onOpenChange={setEditOpen}
//         account={editingAccount ?? undefined}
//       />
//     </>
//   );
// }
