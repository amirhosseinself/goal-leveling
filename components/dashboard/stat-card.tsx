import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
  tone?: "default" | "primary" | "success" | "warning" | "danger";
};

const tones = {
  default: "from-card to-card border-border/70",
  primary: "from-primary/15 to-card border-primary/20",
  success: "from-emerald-500/12 to-card border-emerald-500/20",
  warning: "from-amber-500/12 to-card border-amber-500/20",
  danger: "from-rose-500/12 to-card border-rose-500/20",
};

export function StatCard({ label, value, sub, icon, tone = "default" }: Props) {
  return (
    <Card className={`p-5 bg-gradient-to-b ${tones[tone]} relative overflow-hidden`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</div>
          {sub ? <div className="text-xs text-muted-foreground">{sub}</div> : null}
        </div>
        {icon ? <div className="rounded-xl bg-background/60 border border-border/60 p-2.5 text-primary">{icon}</div> : null}
      </div>
    </Card>
  );
}
