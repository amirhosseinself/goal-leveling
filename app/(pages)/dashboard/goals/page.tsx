"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Search, Trash2, Eye, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { PageSkeleton } from "@/components/dashboard/skeletons";
import { ErrorState } from "@/components/dashboard/error-state";
import { useGoals, useDeleteGoal } from "@/hooks/queries";
import { useConfirm } from "@/components/ui/confirm-dialog";
import type { Goal } from "@prisma/client";

const isOverdue = (g: Goal) => g.deadline && new Date(g.deadline) < new Date() && g.status !== "COMPLETED" && g.status !== "CANCELLED";
const statusLabel: Record<string, string> = { IN_PROGRESS: "در حال انجام", COMPLETED: "تمام شده", SUSPENDED: "متوقف", CANCELLED: "لغو شده" };
const priorityLabel: Record<string, string> = { HIGH: "بالا", MEDIUM: "متوسط", LOW: "پایین" };
const statusTone: Record<string, string> = { IN_PROGRESS: "bg-primary/12 text-primary border-primary/20", COMPLETED: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20", SUSPENDED: "bg-amber-500/12 text-amber-400 border-amber-500/20", CANCELLED: "bg-rose-500/12 text-rose-400 border-rose-500/20" };

const GoalsPage: React.FC = () => {
  const goalsQ = useGoals();
  const del = useDeleteGoal();
  const goals = (goalsQ.data as Goal[] | undefined) || [];
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const router = useRouter();
  const confirm = useConfirm();

  const filtered = useMemo(() => {
    let list = [...goals];
    if (q.trim()) list = list.filter((g) => (g.title + " " + (g.description || "")).toLowerCase().includes(q.toLowerCase()));
    if (status !== "ALL") list = list.filter((g) => g.status === status);
    list.sort((a, b) => {
      if (sort === "deadline") return (a.deadline ? new Date(a.deadline).getTime() : Infinity) - (b.deadline ? new Date(b.deadline).getTime() : Infinity);
      if (sort === "priority") { const w: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }; return (w[a.priority || "LOW"] ?? 3) - (w[b.priority || "LOW"] ?? 3); }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [goals, q, status, sort]);

  const handleDelete = async (goalId: string) => {
    const ok = await confirm({ title: "حذف هدف", description: "آیا از حذف این هدف مطمئن هستید؟ این عمل قابل برگشت نیست.", confirmText: "حذف", destructive: true });
    if (!ok) return;
    const response = await del.mutateAsync(goalId);
    if (response.status) toast.success("هدف حذف شد");
  };

  if (goalsQ.isLoading) return <PageSkeleton />;
  if (goalsQ.error) return <div className="page-container"><ErrorState message={(goalsQ.error as Error).message} onRetry={() => goalsQ.refetch()} /></div>;

  return (
    <div className="page-container space-y-6">
      <PageHeader eyebrow="مدیریت اهداف" title="اهداف من" description="اهداف را تعریف کن، اولویت‌بندی کن و پیشرفتشان را دنبال کن." actions={<Button onClick={() => router.push("/dashboard/goals/new")} className="gap-1.5"><Plus className="h-4 w-4" />هدف جدید</Button>} />
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="جستجو در عنوان یا توضیح..." value={q} onChange={(e) => setQ(e.target.value)} className="pr-9" /></div>
          <select className="h-11 rounded-xl border border-border/80 bg-background/50 px-3.5 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}><option value="ALL">همه وضعیت‌ها</option><option value="IN_PROGRESS">در حال انجام</option><option value="COMPLETED">تمام شده</option><option value="SUSPENDED">متوقف شده</option><option value="CANCELLED">لغو شده</option></select>
          <select className="h-11 rounded-xl border border-border/80 bg-background/50 px-3.5 text-sm" value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">جدیدترین</option><option value="deadline">نزدیک‌ترین ددلاین</option><option value="priority">اولویت</option></select>
        </div>
      </Card>
      {filtered.length === 0 ? <EmptyState title="هدفی یافت نشد" description="یک هدف جدید بساز یا فیلترها را تغییر بده." action={<Button onClick={() => router.push("/dashboard/goals/new")}>افزودن هدف</Button>} /> : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((goal) => {
            const pct = goal.targetValue ? Math.min(100, Math.round(((goal.currentValue || 0) / goal.targetValue) * 100)) : null;
            return (
              <Card key={goal.id} className="p-5 flex flex-col bg-card/70 hover:bg-card/90 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3"><h2 className="text-lg font-bold leading-7">{goal.title}</h2>{isOverdue(goal) && <span className="shrink-0 inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-rose-500/12 text-rose-400 border border-rose-500/20"><AlertTriangle className="h-3 w-3" />عقب افتاده</span>}</div>
                <div className="flex flex-wrap gap-2 mb-3">{goal.status && <span className={`text-[11px] px-2.5 py-1 rounded-full border ${statusTone[goal.status] || "bg-muted text-muted-foreground"}`}>{statusLabel[goal.status] || goal.status}</span>}{goal.priority && <span className="text-[11px] px-2.5 py-1 rounded-full border border-border/70 bg-muted/30 text-muted-foreground">اولویت {priorityLabel[goal.priority] || goal.priority}</span>}</div>
                {pct !== null && <div className="mb-3 space-y-1.5"><div className="flex justify-between text-xs text-muted-foreground"><span>پیشرفت عددی</span><span>{goal.currentValue ?? 0}/{goal.targetValue}</span></div><ProgressBar value={pct} tone={pct >= 100 ? "success" : "primary"} /></div>}
                {goal.deadline && <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3"><Clock className="h-3.5 w-3.5" />ددلاین: {new Date(goal.deadline).toLocaleDateString("fa-IR")}</div>}
                <p className="text-sm text-muted-foreground leading-7 line-clamp-2 mb-4 flex-1">{goal.description || "بدون توضیحات"}</p>
                <div className="flex gap-2 mt-auto"><Button asChild variant="outline" className="flex-1 gap-1.5"><Link href={`/dashboard/goals/${goal.id}`}><Eye className="h-4 w-4" />مشاهده</Link></Button><Button onClick={() => handleDelete(goal.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" aria-label="حذف هدف"><Trash2 className="h-4 w-4" /></Button></div>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default GoalsPage;
