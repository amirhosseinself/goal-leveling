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
import { GoalStatusDonut } from "@/components/charts/goal-status-donut";
import { CountBarChart } from "@/components/charts/count-bar-chart";
import { useUserInfo, useProgressSummary, useGoals, useSkills } from "@/hooks/queries";

const ProfilePage: React.FC = () => {
  const userQ = useUserInfo();
  const summaryQ = useProgressSummary();
  const goalsQ = useGoals();
  const skillsQ = useSkills();
  const loading = userQ.isLoading || summaryQ.isLoading || goalsQ.isLoading || skillsQ.isLoading;
  const error = userQ.error || summaryQ.error || goalsQ.error || skillsQ.error;
  const user = userQ.data as { fullName?: string | null; userName?: string | null; phoneNumber?: string | null; email?: string | null; bio?: string | null } | undefined;
  const summary = summaryQ.data as { totalScore?: number; goalProgressCount?: number; skillProgressCount?: number; activitySeries?: { date: string; goalScore: number; skillScore: number; goalCount: number; skillCount: number }[] } | undefined;
  const goals = useMemo(() => (goalsQ.data as { status?: string | null }[] | undefined) || [], [goalsQ.data]);
  const skills = useMemo(() => (skillsQ.data as unknown[] | undefined) || [], [skillsQ.data]);
  const goalDonut = useMemo(() => {
    const completed = goals.filter((g) => g.status === "COMPLETED").length;
    const inProgress = goals.filter((g) => g.status === "IN_PROGRESS").length;
    const other = Math.max(0, goals.length - completed - inProgress);
    return [
      { name: "تکمیل‌شده", value: completed, color: "#10b981" },
      { name: "در حال انجام", value: inProgress, color: "#8b5cf6" },
      { name: "سایر", value: other, color: "#64748b" },
    ].filter((d) => d.value > 0);
  }, [goals]);
  const activity14 = useMemo(() => (summary?.activitySeries || []).slice(-14), [summary]);

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-1">وضعیت اهداف</h2>
              <p className="text-sm text-muted-foreground mb-4">توزیع وضعیت اهداف شما.</p>
              <GoalStatusDonut data={goalDonut} height={210} centerValue={goals.length} centerLabel="هدف" />
            </Card>
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-1">فعالیت ۱۴ روز اخیر</h2>
              <p className="text-sm text-muted-foreground mb-4">تعداد ثبت پیشرفت روزانه.</p>
              <CountBarChart data={activity14} height={210} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
