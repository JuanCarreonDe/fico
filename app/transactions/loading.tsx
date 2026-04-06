import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full h-full overflow-hidden scrollbar-hide">
      <Skeleton className="w-full h-full" />
    </div>
    // <div className="h-full">
    //   <div className="h-full flex flex-col gap-4">
    //     <div>
    //       <Skeleton className="w-40 m-auto h-10" />
    //     </div>
    //     <div className="flex flex-col gap-4">
    //       <div className="flex flex-col gap-6">
    //         <Skeleton className="w-full md:w-[70%] mx-auto shadow-lg h-96">
    //           {/* <Skeleton className="p-6">
    //       <Skeleton  />
    //       <Skeleton
    //       />
    //     </Skeleton> */}
    //         </Skeleton>
    //       </div>
    //       {/* <TransactionSummary /> */}
    //       <div className="flex flex-col gap-4">
    //         {/* <TransactionList /> */}
    //         <div className="space-y-4">
    //           {[...Array(5)].map((_, i) => (
    //             <Skeleton key={i} className=" mx-auto h-24 w-full" />
    //           ))}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
