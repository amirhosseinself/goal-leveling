"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Target, Sparkles, TrendingUp, Trophy, Flame, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { PageSkeleton } from "@/components/dashboard/skeletons";
import { ErrorState } from "@/components/dashboard/error-state";
import { GoalStatusDonut } from "@/components/charts/goal-status-donut";
import { ActivityAreaChart } from "@/components/charts/activity-area-chart";
import { useGoals, useSkills, useProgressSummary, useGamification } from "@/hooks/queries";
import type { Goal } from "@prisma/client";

type Quest = { id: string; title: string; progress: number; target: number; xpReward: number; status: string; type: string };
type Gami = { level: number; xp: number; levelProgress: number; streakCount: number; longestStreak: number; badges: { id: string; title: string; description: string }[]; dailyQuests: Quest[]; weeklyQuests: Quest[] };
type Summary = { totalScore?: number; activitySeries?: { date: string; goalScore: number; skillScore: number; goalCount: number; skillCount: number }[] };

const isOverdue = (g: Goal) => g.deadline && new Date(g.deadline) < new Date() && g.status !== "COMPLETED" && g.status !== "CANCELLED";
const isDueSoon = (g: Goal) => {
  if (!g.deadline || g.status === "COMPLETED" || g.status === "CANCELLED") return false;
  const d = new Date(g.deadline).getTime() - Date.now();
  return d >= 0 && d <= 7 * 24 * 60 * 60 * 1000;
};

export default function DashboardPage() {
  const goalsQ = useGoals();
  const skillsQ = useSkills();
  const summaryQ = useProgressSummary();
  const gamiQ = useGamification();

  const goals = useMemo(() => (goalsQ.data as Goal[] | undefined) || [], [goalsQ.data]);
  const skills = useMemo(() => (skillsQ.data as { id: string }[] | undefined) || [], [skillsQ.data]);
  const summary = summaryQ.data as Summary | undefined;
  const gami = gamiQ.data as Gami | undefined;
  const loading = goalsQ.isLoading || skillsQ.isLoading || summaryQ.isLoading || gamiQ.isLoading;
  const error = goalsQ.error || skillsQ.error || summaryQ.error || gamiQ.error;

  const stats = useMemo(() => {
    const completed = goals.filter((g) => g.status === "COMPLETED").length;
    const inProgress = goals.filter((g) => g.status === "IN_PROGRESS").length;
    const overdue = goals.filter(isOverdue).length;
    const dueSoon = goals.filter(isDueSoon).length;
    const other = Math.max(0, goals.length - completed - inProgress - overdue);
    return { completed, inProgress, overdue, dueSoon, other };
  }, [goals]);

  const goalDonut = useMemo(() => [
    { name: "تکمیل‌شده", value: stats.completed, color: "#10b981" },
    { name: "در حال انجام", value: stats.inProgress, color: "#8b5cf6" },
    { name: "عقب‌افتاده", value: stats.overdue, color: "#f43f5e" },
    { name: "سررسید نزدیک", value: stats.dueSoon, color: "#f59e0b" },
    { name: "سایر", value: stats.other, color: "#64748b" },
  ].filter((d) => d.value > 0), [stats]);

  const activity14 = useMemo(() => (summary?.activitySeries || []).slice(-14), [summary]);

  if (loading) return <PageSkeleton />;
  if (error) return <div className="page-container"><ErrorState message={(error as Error).message} onRetry={() => { goalsQ.refetch(); skillsQ.refetch(); summaryQ.refetch(); gamiQ.refetch(); }} /></div>;

  return (
    <div className="page-container space-y-6">
      <PageHeader
        eyebrow="داشبورد گیمیفای‌شده"
        title={`Level ${gami?.level ?? 1} • ${gami?.xp ?? 0} XP`}
        description={`Streak فعلی: ${gami?.streakCount ?? 0} روز • بهترین رکورد: ${gami?.longestStreak ?? 0} روز`}
        backgroundImage="/images/goal-peak.jpg"
        actions={<><Button asChild><Link href="/dashboard/daily" className="gap-1.5">ماموریت‌های امروز <ArrowLeft className="h-4 w-4" /></Link></Button><Button asChild variant="outline"><Link href="/dashboard/progress">ثبت پیشرفت</Link></Button></>}
      >
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground"><span>پیشرفت تا Level بعدی</span><span>{gami?.levelProgress ?? 0}%</span></div>
          <ProgressBar value={gami?.levelProgress ?? 0} />
        </div>
      </PageHeader>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="اهداف" value={goals.length} icon={<Target className="h-5 w-5" />} />
        <StatCard label="مهارت‌ها" value={skills.length} icon={<Sparkles className="h-5 w-5" />} />
        <StatCard label="امتیاز کل" value={summary?.totalScore ?? 0} icon={<TrendingUp className="h-5 w-5" />} tone="primary" />
        <StatCard label="Badgeها" value={gami?.badges?.length ?? 0} icon={<Trophy className="h-5 w-5" />} tone="warning" />
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="تکمیل‌شده" value={stats.completed} tone="success" />
        <StatCard label="در حال انجام" value={stats.inProgress} tone="primary" />
        <StatCard label="عقب‌افتاده" value={stats.overdue} tone="danger" />
        <StatCard label="سررسید نزدیک" value={stats.dueSoon} tone="warning" />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <div><h2 className="text-xl font-bold">روند پیشرفت ۱۴ روز اخیر</h2><p className="text-sm text-muted-foreground mt-1">مجموع امتیاز ثبت‌شده اهداف و مهارت‌ها در هر روز.</p></div>
            <Button asChild variant="outline" size="sm"><Link href="/dashboard/progress">جزئیات</Link></Button>
          </div>
          <ActivityAreaChart data={activity14} height={260} />
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />اهداف</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />مهارت‌ها</span>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-1">وضعیت اهداف</h2>
          <p className="text-sm text-muted-foreground mb-4">نمای کلی وضعیت همه اهداف.</p>
          <GoalStatusDonut data={goalDonut} height={220} centerValue={goals.length} centerLabel="هدف" />
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {goalDonut.map((d) => (
              <div key={d.name} className="flex items-center justify-between gap-2 rounded-lg bg-background/30 px-2.5 py-1.5">
                <span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />{d.name}</span>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <div><h2 className="text-xl font-bold">کوئست‌های فعال</h2><p className="text-sm text-muted-foreground mt-1">ماموریت‌هایی که الان در جریان هستند.</p></div>
            <Button asChild variant="outline" size="sm"><Link href="/dashboard/daily">همه</Link></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...(gami?.dailyQuests || []), ...(gami?.weeklyQuests || [])].slice(0, 4).map((q) => {
              const pct = Math.min(100, Math.round((q.progress / Math.max(q.target, 1)) * 100));
              return (
                <div key={q.id} className="rounded-2xl border border-border/70 bg-background/30 p-4">
                  <div className="flex justify-between gap-3 text-sm mb-1"><span className="font-medium">{q.title}</span><span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{q.type === "DAILY" ? "روزانه" : "هفتگی"}</span></div>
                  <div className="text-xs text-muted-foreground mb-3">{q.progress}/{q.target} • +{q.xpReward} XP</div>
                  <ProgressBar value={pct} tone={q.status !== "ACTIVE" ? "success" : "primary"} />
                </div>
              );
            })}
            {!gami?.dailyQuests?.length && !gami?.weeklyQuests?.length && <p className="text-sm text-muted-foreground">کوئستی فعال نیست.</p>}
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5"><Flame className="h-5 w-5 text-amber-400" /><h2 className="text-xl font-bold">دستاوردها</h2></div>
          <div className="space-y-3">
            {gami?.badges?.slice(0, 6).map((b) => (
              <div key={b.id} className="rounded-xl border border-border/70 bg-background/30 p-3"><div className="font-medium text-sm">{b.title}</div><div className="text-xs text-muted-foreground mt-1">{b.description}</div></div>
            ))}
            {!gami?.badges?.length && <p className="text-sm text-muted-foreground">هنوز دستاوردی باز نشده.</p>}
          </div>
        </Card>
      </section>
    </div>
  );
}
