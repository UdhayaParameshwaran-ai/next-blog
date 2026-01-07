import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function PostCardShimmer() {
  return (
    <Card className="w-full max-w-[280px] overflow-hidden bg-white m-5 mt-10">
      <CardHeader className="flex flex-row items-center space-x-3">
        <Skeleton className="h-8 w-8 bg-slate-200" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-24 bg-slate-200" />
          <Skeleton className="h-2 w-16 bg-slate-200" />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Skeleton className="h-10 w-full rounded-none bg-slate-200" />
        <div className="p-3 space-y-2">
          <Skeleton className="h-4 w-3/4 bg-slate-200" />
          <Skeleton className="h-3 w-full bg-slate-200" />
        </div>
      </CardContent>
    </Card>
  );
}
