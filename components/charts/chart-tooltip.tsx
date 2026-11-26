"use client";

import { cn } from "@/lib/utils";

type PayloadItem = { name?: string; value?: number | string; color?: string; dataKey?: string };
type Props = { active?: boolean; payload?: PayloadItem[]; label?: string; labelFormatter?: (l: string) => string };

export function ChartTooltip({ active, payload, label, labelFormatter }: Props) {
  if (!active || !payload?.length) return null;
  return (
    <div className={cn("rounded-xl border border-border/70 bg-card/95 backdrop-blur px-3 py-2 shadow-xl text-xs")}>
      {label ? <div className="text-muted-foreground mb-1.5 font-medium">{labelFormatter ? labelFormatter(label) : label}</div> : null}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name || p.dataKey}
            </span>
            <span className="font-semibold text-foreground">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
