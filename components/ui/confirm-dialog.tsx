"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ConfirmOptions = { title?: string; description?: string; confirmText?: string; cancelText?: string; destructive?: boolean };
type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;
const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; options: ConfirmOptions; resolve?: (v: boolean) => void }>({ open: false, options: {} });
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const confirm = useCallback<ConfirmFn>((options = {}) => new Promise<boolean>((resolve) => setState({ open: true, options, resolve })), []);
  const close = (v: boolean) => { state.resolve?.(v); setState({ open: false, options: {} }); };

  useEffect(() => {
    if (!state.open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state.open]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={() => close(false)}>
          <Card className="w-full max-w-md p-6 space-y-4 border-border/80" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 id="confirm-title" className="text-lg font-bold">{state.options.title || "آیا مطمئن هستید؟"}</h3>
              {state.options.description ? <p className="text-sm text-muted-foreground mt-2 leading-7">{state.options.description}</p> : null}
            </div>
            <div className="flex justify-end gap-2">
              <Button ref={cancelRef} variant="outline" onClick={() => close(false)}>{state.options.cancelText || "انصراف"}</Button>
              <Button variant={state.options.destructive ? "destructive" : "default"} onClick={() => close(true)}>{state.options.confirmText || "تایید"}</Button>
            </div>
          </Card>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
