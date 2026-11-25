"use client";

import React from "react";
import { Shield, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

const SecuritySettings = () => {
  return (
    <Card className="p-6 sm:p-8 max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-bold mb-1">تنظیمات امنیت</h2>
        <p className="text-sm text-muted-foreground">وضعیت امنیت و روش ورود در این اپ شخصی.</p>
      </div>
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
        <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <div className="font-medium mb-1">ورود مبتنی بر OTP</div>
          <p className="text-sm text-muted-foreground leading-7">ورود این اپ به صورت OTP با شماره موبایل انجام می‌شود. برای استفاده شخصی، کد OTP می‌تواند از طریق متغیر محیطی <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">OTP_DEV_CODE</code> تنظیم شود.</p>
        </div>
      </div>
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3">
        <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-medium mb-1">قبل از عمومی شدن</div>
          <p className="text-sm text-muted-foreground leading-7">اگر بعداً اپ عمومی شد، باید ارسال SMS واقعی، محدودسازی تلاش، و مدیریت نشست‌ها اضافه شود.</p>
        </div>
      </div>
    </Card>
  );
};

export default SecuritySettings;
