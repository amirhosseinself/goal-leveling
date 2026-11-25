"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ErrorState({ message = "مشکلی در دریافت اطلاعات پیش آمد.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <Card className="p-8 text-center border-destructive/20 bg-destructive/5">
      <div className="mx-auto max-w-md space-y-3">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center"><AlertCircle className="h-6 w-6" /></div>
        <h3 className="font-semibold">خطا</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
        {onRetry ? <Button variant="outline" onClick={onRetry} className="gap-1.5"><RefreshCw className="h-4 w-4" />تلاش دوباره</Button> : null}
      </div>
    </Card>
  );
}
