"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // ایمپورت کامپوننت Switch
import toast from "react-hot-toast";

const SecuritySettings = () => {
  const [otpEnabled, setOtpEnabled] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // در اینجا می‌توان درخواست API برای ذخیره تغییرات ارسال کرد
    toast.success(
      otpEnabled
        ? "احراز هویت دو مرحله‌ای فعال شد"
        : "احراز هویت دو مرحله‌ای غیرفعال شد"
    );
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">تنظیمات امنیت</h2>
      <form onSubmit={handleSubmit} className="space-y-4 rtl">
        <div className="flex items-center justify-between">
          <Label htmlFor="otp">فعال‌سازی OTP</Label>
          <Switch
            className="ltr"
            id="otp"
            checked={otpEnabled}
            onCheckedChange={setOtpEnabled}
          />
        </div>
        <Button type="submit">به‌روزرسانی</Button>
      </form>
    </Card>
  );
};

export default SecuritySettings;
