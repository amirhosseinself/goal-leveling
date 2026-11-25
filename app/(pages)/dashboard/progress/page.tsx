"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Target, Sparkles, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageSkeleton } from "@/components/dashboard/skeletons";
import { ErrorState } from "@/components/dashboard/error-state";
import { useGoals, useSkills, useProgressSummary } from "@/hooks/queries";
import type { Goal } from "@prisma/client";
import type { Skill } from "@/services/api/skills";

const ProgressPage: React.FC = () => {
  const goalsQ = useGoals();
  const skillsQ = useSkills();
  const summaryQ = useProgressSummary();
  const goals = (goalsQ.data as Goal[] | undefined) || [];
  const skills = (skillsQ.data as Skill[] | undefined) || [];
  const summary = summaryQ.data as { totalScore?: number; goalProgressCount?: number; skillProgressCount?: number; recentGoalProgress?: { id: string; rating: number; note?: string | null; date: string | Date; goal?: { title?: string } }[]; recentSkillProgress?: { id: string; rating: number; note?: string | null; date: string | Date; skill?: { title?: string } }[] } | undefined;
  const loading = goalsQ.isLoading || skillsQ.isLoading || summaryQ.isLoading;
  const error = goalsQ.error || skillsQ.error || summaryQ.error;

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
