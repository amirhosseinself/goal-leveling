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
import { useGoals, useSkills, useProgressSummary, useGamification } from "@/hooks/queries";
import type { Goal } from "@prisma/client";

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

  const goals = (goalsQ.data as Goal[] | undefined) || [];
  const skills = (skillsQ.data as any[] | undefined) || [];
  const summary = summaryQ.data as any;
  const gami = gamiQ.data as any;
  const loading = goalsQ.isLoading || skillsQ.isLoading || summaryQ.isLoading || gamiQ.isLoading;
  const error = goalsQ.error || skillsQ.error || summaryQ.error || gamiQ.error;

  const stats = useMemo(() => {
    const completed = goals.filter((g) => g.status === "COMPLETED").length;
    const inProgress = goals.filter((g) => g.status === "IN_PROGRESS").length;
    const overdue = goals.filter(isOverdue).length;
    const dueSoon = goals.filter(isDueSoon).length;
    return { completed, inProgress, overdue, dueSoon };
  }, [goals]);

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
            <div><h2 className="text-xl font-bold">کوئست‌های فعال</h2><p className="text-sm text-muted-foreground mt-1">ماموریت‌هایی که الان در جریان هستند.</p></div>
            <Button asChild variant="outline" size="sm"><Link href="/dashboard/daily">همه</Link></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...(gami?.dailyQuests || []), ...(gami?.weeklyQuests || [])].slice(0, 4).map((q: any) => {
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
            {gami?.badges?.slice(0, 6).map((b: any) => (
              <div key={b.id} className="rounded-xl border border-border/70 bg-background/30 p-3"><div className="font-medium text-sm">{b.title}</div><div className="text-xs text-muted-foreground mt-1">{b.description}</div></div>
            ))}
            {!gami?.badges?.length && <p className="text-sm text-muted-foreground">هنوز دستاوردی باز نشده.</p>}
          </div>
        </Card>
      </section>
    </div>
  );
}
