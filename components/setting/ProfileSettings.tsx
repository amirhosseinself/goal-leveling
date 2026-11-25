"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useUserInfo, useUpdateUserInfo } from "@/hooks/queries";

interface Profile { username: string; fullname: string; bio: string; }

const ProfileSettings: React.FC = () => {
  const userQ = useUserInfo();
  const update = useUpdateUserInfo();
  const [profile, setProfile] = useState<Profile>({ username: "", fullname: "", bio: "" });

  useEffect(() => {
    if (userQ.data) {
      const u = userQ.data as any;
      setProfile({ username: u.userName || "", fullname: u.fullName || "", bio: u.bio || "" });
    }
  }, [userQ.data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await update.mutateAsync({ updatingData: { userName: profile.username, fullName: profile.fullname, bio: profile.bio } } as any);
    if (response.status) toast.success("اطلاعات کاربری با موفقیت به‌روزرسانی شد");
    else toast.error(response.message || "خطا در به‌روزرسانی اطلاعات کاربری");
  };

  return (
    <Card className="p-6 sm:p-8 max-w-2xl">
      <h2 className="text-xl font-bold mb-1">تنظیمات پروفایل</h2>
      <p className="text-sm text-muted-foreground mb-6">نام نمایشی و بیوی خود را مدیریت کن.</p>
      {userQ.isLoading ? <div className="space-y-3"><div className="h-11 rounded-xl bg-muted/60 animate-pulse" /><div className="h-11 rounded-xl bg-muted/60 animate-pulse" /><div className="h-11 rounded-xl bg-muted/60 animate-pulse" /></div> : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="username">نام کاربری</Label><Input id="username" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} placeholder="نام کاربری" /></div>
          <div className="space-y-2"><Label htmlFor="fullname">نام کامل</Label><Input id="fullname" value={profile.fullname} onChange={(e) => setProfile({ ...profile, fullname: e.target.value })} placeholder="نام کامل" /></div>
          <div className="space-y-2"><Label htmlFor="bio">بیوگرافی</Label><Input id="bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="درباره خود بنویسید" /></div>
          <Button disabled={update.isPending} type="submit">{update.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}</Button>
        </form>
      )}
    </Card>
  );
};

export default ProfileSettings;
