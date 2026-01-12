import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PostShimmer() {
  return (
    <Card className="w-3/4 overflow-hidden bg-white m-5 mt-10">
      <CardHeader className="flex flex-row items-center space-x-3">
        <Skeleton className="h-8 w-8 bg-slate-200" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-24 bg-slate-200" />
          <Skeleton className="h-2 w-16 bg-slate-200" />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Skeleton className="h-40 w-full rounded-none bg-slate-200" />
        <Skeleton className="h-10 w-full rounded-none bg-slate-200" />
        <div className="p-3 space-y-4">
          <Skeleton className="h-10 w-3/4 bg-slate-200" />
          <Skeleton className="h-10 w-full bg-slate-200" />
          <Skeleton className="h-10 w-full bg-slate-200" />
        </div>
      </CardContent>
    </Card>
  );
}
