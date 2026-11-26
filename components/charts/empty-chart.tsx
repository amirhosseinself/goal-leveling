import { BarChart3 } from "lucide-react";

export function EmptyChart({ message = "داده کافی برای نمایش نمودار وجود ندارد." }: { message?: string }) {
  return (
    <div className="h-full min-h-[180px] flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm border border-dashed border-border/60 rounded-xl bg-background/20">
      <BarChart3 className="h-8 w-8 opacity-40" />
      <span>{message}</span>
    </div>
  );
}
