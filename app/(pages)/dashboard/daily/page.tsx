"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CalendarCheck2, Flame, Trophy, Zap, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageSkeleton } from "@/components/dashboard/skeletons";
import { ErrorState } from "@/components/dashboard/error-state";
import { useGamification, useDailyTasks, useGoals, useSkills, useCreateDailyTask, useUpdateDailyTask, useDeleteDailyTask } from "@/hooks/queries";
import { useConfirm } from "@/components/ui/confirm-dialog";
import type { DailyTask } from "@/services/api/dailyTasks";

type Quest = { id: string; title: string; description: string; progress: number; target: number; xpReward: number; status: string };
type GamificationData = { level: number; xp: number; nextLevelXp: number; levelProgress: number; streakCount: number; longestStreak: number; badges: { id: string; title: string; description: string }[]; dailyQuests: Quest[]; weeklyQuests: Quest[] };
const QuestCard = ({ title, description, progress, target, xpReward, status }: Omit<Quest, "id">) => {
  const pct = Math.min(100, Math.round((progress / Math.max(target, 1)) * 100));
  const done = status !== "ACTIVE";
  return (
    <div className={`rounded-2xl border p-4 transition-colors ${done ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/70 bg-background/30"}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="font-medium text-sm">{title}</div>
          <p className="text-xs text-muted-foreground mt-1 leading-6">{description}</p>
        </div>
        <div className="text-[11px] px-2.5 py-1 rounded-full bg-primary/12 text-primary whitespace-nowrap">+{xpReward} XP</div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5"><span>{progress}/{target}</span><span>{done ? "تکمیل شد" : `${pct}%`}</span></div>
      <ProgressBar value={pct} tone={done ? "success" : "primary"} />
    </div>
  );
};

export default function DailyPage() {
  const gq = useGamification();
  const tq = useDailyTasks();
  const goalsQ = useGoals();
  const skillsQ = useSkills();
  const createTask = useCreateDailyTask();
  const updateTask = useUpdateDailyTask();
  const deleteTask = useDeleteDailyTask();
  const [title, setTitle] = useState("");
  const confirm = useConfirm();

  const g = gq.data as GamificationData | undefined;
  const tasks = useMemo(() => (tq.data as DailyTask[] | undefined) || [], [tq.data]);
  const goals = useMemo(() => (goalsQ.data as { title: string; status?: string | null }[] | undefined) || [], [goalsQ.data]);
  const skills = useMemo(() => (skillsQ.data as { title: string }[] | undefined) || [], [skillsQ.data]);

  const loading = gq.isLoading || tq.isLoading || goalsQ.isLoading || skillsQ.isLoading;
  const error = gq.error || tq.error || goalsQ.error || skillsQ.error;

  const doneCount = tasks.filter((t) => t.done).length;
  const today = new Date().toLocaleDateString("fa-IR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await createTask.mutateAsync({ title: title.trim() });
    if (res.status) { setTitle(""); toast.success("تسک اضافه شد"); }
    else toast.error(res.message || "خطا");
  };

  const toggleTask = async (task: DailyTask) => {
    const res = await updateTask.mutateAsync({ id: task.id, done: !task.done });
    if (res.status) {
      const gained = (res.data as { gamification?: { gained?: number } }).gamification?.gained;
      if (!task.done) toast.success(gained ? `انجام شد! +${gained} XP` : "انجام شد!");
    } else toast.error(res.message || "خطا");
  };

  const removeTask = async (id: string) => {
    const ok = await confirm({ title: "حذف تسک", description: "این تسک حذف شود؟", confirmText: "حذف", destructive: true });
    if (!ok) return;
    const res = await deleteTask.mutateAsync(id);
    if (res.status) toast.success("تسک حذف شد");
  };

  const suggested = useMemo(() => {
    const s: string[] = [];
    goals.filter(g => g.status !== "COMPLETED" && g.status !== "CANCELLED").slice(0, 3).forEach(g => s.push(`پیشرفت روی هدف: ${g.title}`));
    skills.slice(0, 2).forEach(sk => s.push(`تمرین مهارت: ${sk.title}`));
    return s.slice(0, 4);
  }, [goals, skills]);

  if (loading) return <PageSkeleton />;
  if (error) return <div className="page-container"><ErrorState message={(error as Error).message} onRetry={() => { gq.refetch(); tq.refetch(); goalsQ.refetch(); skillsQ.refetch(); }} /></div>;

  return (
    <div className="page-container space-y-6">
      <PageHeader
        eyebrow="مرکز فرمان روزانه"
        title="ماموریت‌های امروز"
        description={today}
        backgroundImage="/images/anime-night.jpg"
        actions={<>
          <Button asChild variant="outline"><Link href="/dashboard/progress">ثبت پیشرفت</Link></Button>
          <Button asChild><Link href="/dashboard/goals">مدیریت اهداف</Link></Button>
        </>}
      >
        {g && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2"><span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium">Level {g.level}</span><span className="text-muted-foreground">{g.xp} XP</span></div>
              <span className="text-muted-foreground">تا لول بعدی: {g.nextLevelXp} XP</span>
            </div>
            <ProgressBar value={g.levelProgress} />
          </div>
        )}
      </PageHeader>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Level" value={g?.level ?? 1} sub={`XP کل: ${g?.xp ?? 0}`} icon={<Zap className="h-5 w-5" />} tone="primary" />
        <StatCard label="Streak" value={g?.streakCount ?? 0} sub={`بهترین رکورد: ${g?.longestStreak ?? 0}`} icon={<Flame className="h-5 w-5" />} tone="warning" />
        <StatCard label="تسک‌های امروز" value={`${doneCount}/${tasks.length}`} sub={tasks.length ? `${Math.round((doneCount/Math.max(tasks.length,1))*100)}% انجام شده` : "هنوز تسکی نداری"} icon={<CalendarCheck2 className="h-5 w-5" />} tone="success" />
        <StatCard label="Badgeها" value={g?.badges?.length ?? 0} sub="دستاوردهای باز شده" icon={<Trophy className="h-5 w-5" />} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-2 space-y-5">
          <div>
            <h2 className="text-xl font-bold">چک‌لیست امروز</h2>
            <p className="text-sm text-muted-foreground mt-1">کارهایی که امروز باید انجام بدی را ثبت و تیک بزن.</p>
          </div>
          <div className="flex gap-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلاً: ۳۰ دقیقه مطالعه، ثبت پیشرفت هدف..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTask())} />
            <Button onClick={addTask} className="shrink-0 gap-1.5" disabled={createTask.isPending}><Plus className="h-4 w-4" />{createTask.isPending ? "..." : "افزودن"}</Button>
          </div>
          {suggested.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggested.map((s) => (
                <button key={s} onClick={() => setTitle(s)} className="text-xs px-3 py-1.5 rounded-full border border-border/70 bg-muted/30 hover:bg-muted/60 hover:border-primary/30 transition">{s}</button>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <EmptyState title="هنوز تسکی برای امروز نداری" description="اولین ماموریت امروزت رو اضافه کن تا streak و XP بگیری." />
            ) : tasks.map((task) => (
              <div key={task.id} className={`group flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${task.done ? "bg-emerald-500/5 border-emerald-500/25" : "border-border/70 bg-background/20 hover:bg-background/40"}`}>
                <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                  <span className={`shrink-0 ${task.done ? "text-emerald-400" : "text-muted-foreground"}`}>{task.done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}</span>
                  <input type="checkbox" checked={task.done} onChange={() => toggleTask(task)} className="sr-only" />
                  <div className="min-w-0">
                    <div className={`font-medium truncate ${task.done ? "line-through text-muted-foreground" : ""}`}>{task.title}</div>
                    <div className="text-xs text-muted-foreground">+{task.xpReward} XP</div>
                  </div>
                </label>
                <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)} className="text-muted-foreground hover:text-destructive" aria-label="حذف تسک"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold">کوئست‌های روزانه</h2>
            <p className="text-sm text-muted-foreground mt-1">ماموریت‌های خودکار برای حفظ ریتم.</p>
          </div>
          <div className="space-y-3">
            {g?.dailyQuests?.length ? g.dailyQuests.map((q) => <QuestCard key={q.id} {...q} />) : <p className="text-sm text-muted-foreground">کوئستی فعال نیست.</p>}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold">کوئست‌های هفتگی</h2>
          <div className="space-y-3">
            {g?.weeklyQuests?.length ? g.weeklyQuests.map((q) => <QuestCard key={q.id} {...q} />) : <p className="text-sm text-muted-foreground">کوئست هفتگی فعال نیست.</p>}
          </div>
        </Card>
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold">دستاوردهای اخیر</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {g?.badges?.length ? g.badges.slice(0, 6).map((b) => (
              <div key={b.id} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 mb-1"><Trophy className="h-4 w-4 text-amber-400" /><div className="font-medium text-sm">{b.title}</div></div>
                <div className="text-xs text-muted-foreground leading-6">{b.description}</div>
              </div>
            )) : <EmptyState title="هنوز Badgeای باز نشده" description="با ثبت اولین پیشرفت، اولین دستاوردت را بگیر." />}
          </div>
        </Card>
      </section>
    </div>
  );
}
