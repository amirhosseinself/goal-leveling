import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted/60", className)} />;
}

export function StatCardSkeleton() {
  return (
    <Card className="p-5 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-28" />
    </Card>
  );
}

export function ListCardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <Card className="p-5 space-y-4">
      <Skeleton className="h-5 w-40" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-2xl" />)}
      </div>
    </Card>
  );
}

export function PageSkeleton() {
  return (
    <div className="page-container space-y-6">
      <Card className="p-8 space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <Skeleton className="h-3 w-full rounded-full" />
      </Card>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ListCardSkeleton lines={4} />
        <ListCardSkeleton lines={3} />
        <ListCardSkeleton lines={3} />
      </div>
    </div>
  );
}
