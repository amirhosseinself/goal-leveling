"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, PlusCircle, History, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageSkeleton } from "@/components/dashboard/skeletons";
import { ErrorState } from "@/components/dashboard/error-state";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { useSkill, useSkillProgress, useCreateSkillProgress, useDeleteSkillProgress } from "@/hooks/queries";
import type { SkillProgress } from "@/services/api/skillProgress";

const SkillProgressPage: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const router = useRouter();
  const confirm = useConfirm();
  const skillQ = useSkill(skillId);
  const progressQ = useSkillProgress(skillId);
  const createProgress = useCreateSkillProgress();
  const deleteProgress = useDeleteSkillProgress();
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");

  const skill = skillQ.data as { id: string; title: string; description?: string | null } | undefined;
  const progressList = ((progressQ.data as SkillProgress[] | undefined) || []);

  const handleAdd = async () => {
    if (!skill || !rating) return toast.error("امتیاز را وارد کنید");
    const res = await createProgress.mutateAsync({ skillId: skill.id, rating: Number(rating), note: note.trim() || undefined });
    if (res.status) {
      const g = (res.data as { gamification?: { gained?: number } }).gamification;
      toast.success(g ? `پیشرفت ثبت شد! +${g.gained} XP` : "پیشرفت ثبت شد");
      setRating(""); setNote("");
    } else toast.error(res.message || "خطا در ثبت پیشرفت");
  };

  const handleDelete = async (id: string) => {
    if (!skill) return;
    const ok = await confirm({ title: "حذف پیشرفت", description: "آیا از حذف این مورد پیشرفت مطمئن هستید؟", confirmText: "حذف", destructive: true });
    if (!ok) return;
    const res = await deleteProgress.mutateAsync({ id, skillId: skill.id });
    if (res.status) toast.success("حذف شد"); else toast.error(res.message || "خطا در حذف");
  };

  const loading = skillQ.isLoading || progressQ.isLoading;
  const error = skillQ.error || progressQ.error;
  if (loading) return <PageSkeleton />;
  if (error) return <div className="page-container"><ErrorState message={(error as Error).message} onRetry={() => { skillQ.refetch(); progressQ.refetch(); }} /></div>;
  if (!skill) return <div className="page-container"><ErrorState message="مهارت یافت نشد." /></div>;

  return (
    <div className="page-container space-y-6">
      <PageHeader eyebrow="ثبت پیشرفت مهارت" title={skill.title} description={skill.description || "تمرین و پیشرفت این مهارت را ثبت کن."} actions={<Button variant="ghost" onClick={() => router.back()} className="gap-1.5"><ArrowRight className="h-4 w-4" />بازگشت</Button>} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-2 text-primary"><PlusCircle className="h-5 w-5" /><h2 className="text-lg font-bold">ثبت پیشرفت جدید</h2></div>
          <div className="space-y-2"><Label htmlFor="rating">امتیاز (1-10)</Label><Input id="rating" type="number" min={1} max={10} value={rating} onChange={(e) => setRating(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="note">یادداشت</Label><Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="چه تمرینی انجام دادی؟" /></div>
          <Button onClick={handleAdd} disabled={createProgress.isPending} className="w-full" size="lg">{createProgress.isPending ? "در حال ثبت..." : "ثبت پیشرفت"}</Button>
        </Card>

        <Card className="p-6 xl:col-span-2">
          <div className="flex items-center gap-2 mb-5"><History className="h-5 w-5 text-muted-foreground" /><h2 className="text-lg font-bold">تاریخچه</h2></div>
          <div className="space-y-3">
            {progressList.length === 0 ? <EmptyState title="هنوز پیشرفتی ثبت نشده" description="اولین تمرین این مهارت را ثبت کن." /> : progressList.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/30 p-4">
                <div>
                  <div className="font-medium">{item.note || "بدون توضیح"}</div>
                  <div className="text-xs text-muted-foreground mt-1">{new Date(item.date).toLocaleDateString("fa-IR")}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-primary/12 text-primary text-sm font-medium">+{item.rating}</div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)} aria-label="حذف پیشرفت"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SkillProgressPage;
