"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useUserInfo, useUpdateUserInfo } from "@/hooks/queries";

const AccountSettings = () => {
  const userQ = useUserInfo();
  const update = useUpdateUserInfo();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (userQ.data) {
      const u = userQ.data as any;
      setEmail(u.email || "");
      setPhoneNumber(u.phoneNumber || "");
    }
  }, [userQ.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await update.mutateAsync({ updatingData: { email } } as any);
    if (res.status) toast.success("اطلاعات حساب به‌روزرسانی شد");
    else toast.error(res.message || "خطا در به‌روزرسانی");
  };

  return (
    <Card className="p-6 sm:p-8 max-w-2xl">
      <h2 className="text-xl font-bold mb-1">تنظیمات حساب</h2>
      <p className="text-sm text-muted-foreground mb-6">اطلاعات ورود و تماس حساب شخصی.</p>
      {userQ.isLoading ? <div className="space-y-3"><div className="h-11 rounded-xl bg-muted/60 animate-pulse" /><div className="h-11 rounded-xl bg-muted/60 animate-pulse" /></div> : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2"><Label htmlFor="phone">شماره موبایل (شناسه ورود)</Label><Input id="phone" type="text" value={phoneNumber} disabled dir="ltr" className="text-left opacity-70" /></div>
          <div className="space-y-2"><Label htmlFor="email">ایمیل (اختیاری)</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" dir="ltr" className="text-left" /></div>
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">این اپ شخصی با ورود OTP کار می‌کند؛ رمز عبور استفاده نمی‌شود.</div>
          <Button type="submit" disabled={update.isPending}>{update.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}</Button>
        </form>
      )}
    </Card>
  );
};

export default AccountSettings;
