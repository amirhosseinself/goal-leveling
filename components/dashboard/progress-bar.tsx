import { cn } from "@/lib/utils";

type Props = { value: number; tone?: "primary" | "success" | "warning"; className?: string };
const tones = {
  primary: "from-violet-500 to-fuchsia-500",
  success: "from-emerald-500 to-teal-400",
  warning: "from-amber-500 to-orange-400",
};

export function ProgressBar({ value, tone = "primary", className }: Props) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2.5 rounded-full bg-muted/80 overflow-hidden", className)}>
      <div className={cn("h-full rounded-full bg-gradient-to-l transition-all duration-500", tones[tone])} style={{ width: `${safe}%` }} />
    </div>
  );
}
