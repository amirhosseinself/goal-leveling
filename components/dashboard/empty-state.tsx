import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <Card className="p-10 text-center border-dashed bg-card/40">
      <div className="mx-auto max-w-md space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        {action ? <div className="pt-3 flex justify-center">{action}</div> : null}
      </div>
    </Card>
  );
}
