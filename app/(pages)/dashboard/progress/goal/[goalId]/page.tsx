"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, PlusCircle, History } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageSkeleton } from "@/components/dashboard/skeletons";
import { ErrorState } from "@/components/dashboard/error-state";
import { useGoal, useGoalProgress, useCreateGoalProgress } from "@/hooks/queries";
import type { GoalProgress } from "@/services/api/goalProgress";

const GoalDetailsPage: React.FC = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const router = useRouter();
  const goalQ = useGoal(goalId);
  const progressQ = useGoalProgress(goalId);
  const createProgress = useCreateGoalProgress();
  const [progress, setProgress] = useState("");
  const [note, setNote] = useState("");

  const goal = goalQ.data as any;
  const progressList = ((progressQ.data as GoalProgress[] | undefined) || []);

  const handleAddProgress = async () => {
    if (!goal || !progress || isNaN(Number(progress))) { toast.error("لطفاً یک مقدار معتبر وارد کنید."); return; }
    const res = await createProgress.mutateAsync({ goalId: goal.id, rating: parseInt(progress), note: note.trim() || undefined });
    if (res.status) {
      const g = (res.data as any).gamification;
      toast.success(g ? `پیشرفت ثبت شد! +${g.gained} XP` : "پیشرفت با موفقیت ثبت شد.");
      setProgress(""); setNote("");
    } else toast.error(res.message || "خطا در ثبت پیشرفت.");
  };

  const loading = goalQ.isLoading || progressQ.isLoading;
  const error = goalQ.error || progressQ.error;
  if (loading) return <PageSkeleton />;
  if (error) return <div className="page-container"><ErrorState message={(error as Error).message} onRetry={() => { goalQ.refetch(); progressQ.refetch(); }} /></div>;
  if (!goal) return <div className="page-container"><ErrorState message="هدف یافت نشد." /></div>;

  return (
    <div className="page-container space-y-6">
      <PageHeader eyebrow="ثبت پیشرفت هدف" title={goal.title} description={goal.description || "پیشرفت این هدف را ثبت و تاریخچه را ببین."} actions={<Button variant="ghost" onClick={() => router.back()} className="gap-1.5"><ArrowRight className="h-4 w-4" />بازگشت</Button>} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-2 text-primary"><PlusCircle className="h-5 w-5" /><h2 className="text-lg font-bold">ثبت پیشرفت جدید</h2></div>
          <div className="space-y-2"><Label htmlFor="progress">امتیاز پیشرفت (1-10)</Label><Input id="progress" type="number" placeholder="مثلاً 7" value={progress} onChange={(e) => setProgress(e.target.value)} min={1} max={10} /></div>
          <div className="space-y-2"><Label htmlFor="note">یادداشت (اختیاری)</Label><Input id="note" type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="امروز چه کردی؟" /></div>
          <Button onClick={handleAddProgress} disabled={createProgress.isPending} className="w-full" size="lg">{createProgress.isPending ? "در حال ثبت..." : "ثبت پیشرفت"}</Button>
        </Card>

        <Card className="p-6 xl:col-span-2">
          <div className="flex items-center gap-2 mb-5"><History className="h-5 w-5 text-muted-foreground" /><h2 className="text-lg font-bold">تاریخچه پیشرفت</h2></div>
          {progressList.length > 0 ? (
            <div className="space-y-3">
              {[...progressList].reverse().map((item) => (
                <div key={item.id} className="rounded-2xl border border-border/70 bg-background/30 p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{item.note || "بدون توضیح"}</div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(item.date).toLocaleDateString("fa-IR")}</div>
                  </div>
                  <div className="shrink-0 px-3 py-1 rounded-full bg-primary/12 text-primary text-sm font-medium">+{item.rating}</div>
                </div>
              ))}
            </div>
          ) : <EmptyState title="هنوز پیشرفتی ثبت نشده" description="اولین پیشرفت این هدف را ثبت کن تا XP بگیری." />}
        </Card>
      </div>
    </div>
  );
};

export default GoalDetailsPage;
