"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Settings, Target, Sparkles, TrendingUp, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageSkeleton } from "@/components/dashboard/skeletons";
import { ErrorState } from "@/components/dashboard/error-state";
import { useUserInfo, useProgressSummary, useGoals, useSkills } from "@/hooks/queries";

const ProfilePage: React.FC = () => {
  const userQ = useUserInfo();
  const summaryQ = useProgressSummary();
  const goalsQ = useGoals();
  const skillsQ = useSkills();
  const loading = userQ.isLoading || summaryQ.isLoading || goalsQ.isLoading || skillsQ.isLoading;
  const error = userQ.error || summaryQ.error || goalsQ.error || skillsQ.error;
  const user = userQ.data as { fullName?: string | null; userName?: string | null; phoneNumber?: string | null; email?: string | null; bio?: string | null } | undefined;
  const summary = summaryQ.data as { totalScore?: number; goalProgressCount?: number; skillProgressCount?: number } | undefined;
  const goals = useMemo(() => (goalsQ.data as { status?: string | null }[] | undefined) || [], [goalsQ.data]);
  const skills = useMemo(() => (skillsQ.data as unknown[] | undefined) || [], [skillsQ.data]);

  if (loading) return <PageSkeleton />;
  if (error) return <div className="page-container"><ErrorState message={(error as Error).message} onRetry={() => { userQ.refetch(); summaryQ.refetch(); goalsQ.refetch(); skillsQ.refetch(); }} /></div>;

  return (
    <div className="page-container space-y-6">
      <PageHeader eyebrow="حساب کاربری" title={user?.fullName || user?.userName || "پروفایل"} description="نمای کلی حساب و پیشرفت شخصی شما." actions={<Button asChild variant="outline" className="gap-1.5"><Link href="/setting"><Settings className="h-4 w-4" />تنظیمات</Link></Button>} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xl font-bold">{(user?.fullName || user?.userName || "U").slice(0, 1)}</div>
            <div><div className="font-bold text-lg">{user?.fullName || "بدون نام"}</div><div className="text-sm text-muted-foreground">@{user?.userName || "username"}</div></div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 py-2 border-b border-border/60"><span className="text-muted-foreground">شماره موبایل</span><span dir="ltr">{user?.phoneNumber || "-"}</span></div>
            <div className="flex justify-between gap-4 py-2 border-b border-border/60"><span className="text-muted-foreground">ایمیل</span><span>{user?.email || "ثبت نشده"}</span></div>
            <div className="pt-2"><div className="text-muted-foreground mb-1">بیو</div><p className="leading-7">{user?.bio || "هنوز بیویی ثبت نشده است."}</p></div>
          </div>
        </Card>
        <div className="xl:col-span-2 space-y-4">
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="اهداف" value={goals.length} icon={<Target className="h-5 w-5" />} />
            <StatCard label="مهارت‌ها" value={skills.length} icon={<Sparkles className="h-5 w-5" />} />
            <StatCard label="امتیاز کل" value={summary?.totalScore ?? 0} icon={<TrendingUp className="h-5 w-5" />} tone="primary" />
            <StatCard label="ثبت پیشرفت" value={(summary?.goalProgressCount ?? 0) + (summary?.skillProgressCount ?? 0)} icon={<Activity className="h-5 w-5" />} />
          </section>
          <Card className="p-6"><h2 className="text-lg font-bold mb-4">خلاصه وضعیت</h2><div className="grid sm:grid-cols-2 gap-3 text-sm"><div className="rounded-xl border border-border/70 bg-background/30 p-4"><div className="text-muted-foreground">اهداف تکمیل‌شده</div><div className="text-xl font-bold mt-1">{goals.filter((g) => g.status === "COMPLETED").length}</div></div><div className="rounded-xl border border-border/70 bg-background/30 p-4"><div className="text-muted-foreground">اهداف در حال انجام</div><div className="text-xl font-bold mt-1">{goals.filter((g) => g.status === "IN_PROGRESS").length}</div></div></div></Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
