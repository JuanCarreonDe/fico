import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="w-fit max-w-40 mx-auto">
        <Skeleton className="h-10 w-40" />
        here
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <Card className="w-full md:w-[70%] mx-auto">
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="mx-auto h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
