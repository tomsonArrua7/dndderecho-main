import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-white/5", className)} {...props} />;
}

export const CardSkeleton = () => (
  <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
    <Skeleton className="h-8 w-24 rounded-xl" />
  </div>
);

export { Skeleton };
