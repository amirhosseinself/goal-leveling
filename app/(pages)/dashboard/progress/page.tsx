"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { TrendingUp, Target, Sparkles, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageSkeleton } from "@/components/dashboard/skeletons";
import { ErrorState } from "@/components/dashboard/error-state";
import { ActivityAreaChart } from "@/components/charts/activity-area-chart";
import { GoalStatusDonut } from "@/components/charts/goal-status-donut";
import { CountBarChart } from "@/components/charts/count-bar-chart";
import { useGoals, useSkills, useProgressSummary } from "@/hooks/queries";
import type { Goal } from "@prisma/client";
import type { Skill } from "@/services/api/skills";

const ProgressPage: React.FC = () => {
  const goalsQ = useGoals();
  const skillsQ = useSkills();
  const summaryQ = useProgressSummary();
  const goals = (goalsQ.data as Goal[] | undefined) || [];
  const skills = (skillsQ.data as Skill[] | undefined) || [];
  const summary = summaryQ.data as { totalScore?: number; goalProgressCount?: number; skillProgressCount?: number; recentGoalProgress?: { id: string; rating: number; note?: string | null; date: string | Date; goal?: { title?: string } }[]; recentSkillProgress?: { id: string; rating: number; note?: string | null; date: string | Date; skill?: { title?: string } }[]; activitySeries?: { date: string; goalScore: number; skillScore: number; goalCount: number; skillCount: number }[] } | undefined;
  const loading = goalsQ.isLoading || skillsQ.isLoading || summaryQ.isLoading;
  const error = goalsQ.error || skillsQ.error || summaryQ.error;
  const series = useMemo(() => summary?.activitySeries || [], [summary]);
  const series14 = useMemo(() => series.slice(-14), [series]);
  const scoreDonut = useMemo(() => {
    const g = series.reduce((s, d) => s + d.goalScore, 0);
    const sk = series.reduce((s, d) => s + d.skillScore, 0);
    return [
      { name: "اهداف", value: g, color: "#8b5cf6" },
      { name: "مهارت‌ها", value: sk, color: "#22d3ee" },
    ].filter((d) => d.value > 0);
  }, [series]);

  if (loading) return <PageSkeleton />;
  if (error) return <div className="page-container"><ErrorState message={(error as Error).message} onRetry={() => { goalsQ.refetch(); skillsQ.refetch(); summaryQ.refetch(); }} /></div>;

  return (
    <div className="page-container space-y-6">
      <PageHeader eyebrow="ردیابی پیشرفت" title="پیشرفت" description="نمای کلی پیشرفت اهداف و مهارت‌ها و آخرین ثبت‌ها." />
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="امتیاز کل" value={summary?.totalScore ?? 0} icon={<TrendingUp className="h-5 w-5" />} tone="primary" />
        <StatCard label="ثبت‌های پیشرفت هدف" value={summary?.goalProgressCount ?? 0} icon={<Target className="h-5 w-5" />} />
        <StatCard label="ثبت‌های پیشرفت مهارت" value={summary?.skillProgressCount ?? 0} icon={<Sparkles className="h-5 w-5" />} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-2">
          <h2 className="text-xl font-bold mb-1">روند ۳۰ روزه</h2>
          <p className="text-sm text-muted-foreground mb-4">مجموع امتیاز پیشرفت اهداف و مهارت‌ها در هر روز.</p>
          <ActivityAreaChart data={series} height={280} />
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />اهداف</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />مهارت‌ها</span>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-1">سهم امتیاز</h2>
          <p className="text-sm text-muted-foreground mb-4">توزیع امتیاز بین اهداف و مهارت‌ها.</p>
          <GoalStatusDonut data={scoreDonut} height={220} centerValue={summary?.totalScore ?? 0} centerLabel="امتیاز" />
          <div className="space-y-2 mt-4 text-xs">
            {scoreDonut.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-lg bg-background/30 px-3 py-2">
                <span className="flex items-center gap-2 text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />{d.name}</span>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-1">ثبات ثبت ۱۴ روز اخیر</h2>
        <p className="text-sm text-muted-foreground mb-4">تعداد ثبت پیشرفت هدف/مهارت در هر روز.</p>
        <CountBarChart data={series14} height={240} />
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />ثبت هدف</span>
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />ثبت مهارت</span>
        </div>
      </Card>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6"><div className="flex items-center gap-2 mb-4"><Target className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold">پیشرفت اهداف</h2></div><div className="space-y-2">{goals.length === 0 ? <EmptyState title="هدفی وجود ندارد" description="اول یک هدف بساز." /> : goals.map((goal) => (<div key={goal.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/30 p-4"><div className="min-w-0"><div className="font-medium truncate">{goal.title}</div><div className="text-xs text-muted-foreground mt-1">{goal.status || "بدون وضعیت"}{goal.targetValue ? ` • ${goal.currentValue ?? 0}/${goal.targetValue}` : ""}</div></div><Button asChild size="sm" variant="outline"><Link href={`/dashboard/progress/goal/${goal.id}`}>ثبت/مشاهده</Link></Button></div>))}</div></Card>
        <Card className="p-6"><div className="flex items-center gap-2 mb-4"><Sparkles className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold">پیشرفت مهارت‌ها</h2></div><div className="space-y-2">{skills.length === 0 ? <EmptyState title="مهارتی وجود ندارد" description="اول یک مهارت بساز." /> : skills.map((skill) => (<div key={skill.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/30 p-4"><div className="min-w-0"><div className="font-medium truncate">{skill.title}</div><div className="text-xs text-muted-foreground mt-1">{skill.level || "بدون سطح"}</div></div><Button asChild size="sm" variant="outline"><Link href={`/dashboard/progress/skill/${skill.id}`}>ثبت/مشاهده</Link></Button></div>))}</div></Card>
      </section>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6"><div className="flex items-center gap-2 mb-4"><History className="h-5 w-5 text-muted-foreground" /><h2 className="text-xl font-bold">آخرین پیشرفت اهداف</h2></div><div className="space-y-2">{(summary?.recentGoalProgress?.length ?? 0) === 0 ? <p className="text-sm text-muted-foreground">موردی ثبت نشده.</p> : summary!.recentGoalProgress!.map((item) => (<div key={item.id} className="rounded-2xl border border-border/70 bg-background/30 p-4"><div className="flex justify-between gap-3"><div className="font-medium">{item.goal?.title || "هدف"}</div><div className="text-xs px-2 py-1 rounded-full bg-primary/12 text-primary">+{item.rating}</div></div><div className="text-sm text-muted-foreground mt-1">{item.note || "بدون یادداشت"}</div><div className="text-xs text-muted-foreground mt-2">{new Date(item.date).toLocaleDateString("fa-IR")}</div></div>))}</div></Card>
        <Card className="p-6"><div className="flex items-center gap-2 mb-4"><History className="h-5 w-5 text-muted-foreground" /><h2 className="text-xl font-bold">آخرین پیشرفت مهارت‌ها</h2></div><div className="space-y-2">{(summary?.recentSkillProgress?.length ?? 0) === 0 ? <p className="text-sm text-muted-foreground">موردی ثبت نشده.</p> : summary!.recentSkillProgress!.map((item) => (<div key={item.id} className="rounded-2xl border border-border/70 bg-background/30 p-4"><div className="flex justify-between gap-3"><div className="font-medium">{item.skill?.title || "مهارت"}</div><div className="text-xs px-2 py-1 rounded-full bg-primary/12 text-primary">+{item.rating}</div></div><div className="text-sm text-muted-foreground mt-1">{item.note || "بدون یادداشت"}</div><div className="text-xs text-muted-foreground mt-2">{new Date(item.date).toLocaleDateString("fa-IR")}</div></div>))}</div></Card>
      </section>
    </div>
  );
};

export default ProgressPage;
