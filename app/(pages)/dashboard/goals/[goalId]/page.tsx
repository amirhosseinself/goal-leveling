"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowRight, Save, Link2, Plus, Trash2, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { PageSkeleton } from "@/components/dashboard/skeletons";
import { ErrorState } from "@/components/dashboard/error-state";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { useGoal, useSkills, useGoalSkills, useMilestones, useUpdateGoal, useLinkGoalSkill, useUnlinkGoalSkill, useCreateMilestone, useUpdateMilestone, useDeleteMilestone } from "@/hooks/queries";
import { Goal, GoalCategory, GoalPriority, GoalStatus } from "@prisma/client";
import { GoalCategoryTranslations, GoalPriorityTranslations, GoalStatusTranslations, SkillLearningStatusTranslations } from "@/lib/dictionary";
import type { GoalSkillLink } from "@/services/api/goalSkills";
import type { GoalMilestone } from "@/services/api/milestones";

const GoalPage: React.FC = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const router = useRouter();
  const confirm = useConfirm();
  const goalQ = useGoal(goalId);
  const skillsQ = useSkills();
  const linksQ = useGoalSkills(goalId);
  const msQ = useMilestones(goalId);
  const updateGoal = useUpdateGoal();
  const linkSkill = useLinkGoalSkill();
  const unlinkSkill = useUnlinkGoalSkill();
  const createMs = useCreateMilestone();
  const updateMs = useUpdateMilestone();
  const deleteMs = useDeleteMilestone();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [newMilestone, setNewMilestone] = useState("");

  useEffect(() => { if (goalQ.data) setGoal(goalQ.data as Goal); }, [goalQ.data]);

  const skills = (skillsQ.data as { id: string; title: string }[] | undefined) || [];
  const links = (linksQ.data as GoalSkillLink[] | undefined) || [];
  const milestones = (msQ.data as GoalMilestone[] | undefined) || [];

  const handleUpdateGoal = async () => {
    if (!goal) return;
    const res = await updateGoal.mutateAsync({
      goalId: goal.id, title: goal.title, description: goal.description || "", category: goal.category, priority: goal.priority, status: goal.status,
      deadline: goal.deadline ? new Date(goal.deadline).toISOString() : null, targetValue: goal.targetValue ?? null, currentValue: goal.currentValue ?? null,
    } as never);
    if (res.status) toast.success("هدف با موفقیت به‌روزرسانی شد");
    else toast.error(res.message || "به‌روزرسانی هدف ناموفق بود");
  };

  const handleLinkSkill = async () => {
    if (!goal || !selectedSkillId) return;
    const res = await linkSkill.mutateAsync({ goalId: goal.id, skillId: selectedSkillId, learningStatus: "NOT_STARTED" } as never);
    if (res.status) { toast.success("مهارت به هدف متصل شد"); setSelectedSkillId(""); }
    else toast.error(res.message || "خطا در اتصال مهارت");
  };

  const handleUnlink = async (id: string) => {
    if (!goal) return;
    const ok = await confirm({ title: "حذف اتصال مهارت", description: "آیا از حذف اتصال این مهارت مطمئن هستید؟", confirmText: "حذف", destructive: true });
    if (!ok) return;
    const res = await unlinkSkill.mutateAsync({ id, goalId: goal.id });
    if (res.status) toast.success("اتصال حذف شد"); else toast.error(res.message || "خطا در حذف اتصال");
  };

  const addMs = async () => {
    if (!goal || !newMilestone.trim()) return;
    const res = await createMs.mutateAsync({ goalId: goal.id, title: newMilestone.trim(), order: milestones.length } as never);
    if (res.status) setNewMilestone(""); else toast.error(res.message || "خطا");
  };
  const toggleMs = async (ms: GoalMilestone) => {
    if (!goal) return;
    const res = await updateMs.mutateAsync({ id: ms.id, goalId: goal.id, done: !ms.done } as never);
    if (!res.status) toast.error(res.message || "خطا");
  };
  const removeMs = async (id: string) => {
    if (!goal) return;
    const ok = await confirm({ title: "حذف Milestone", description: "این milestone حذف شود؟", confirmText: "حذف", destructive: true });
    if (!ok) return;
    const res = await deleteMs.mutateAsync({ id, goalId: goal.id });
    if (!res.status) toast.error(res.message || "خطا");
  };

  const loading = goalQ.isLoading || skillsQ.isLoading || linksQ.isLoading || msQ.isLoading;
  const error = goalQ.error || skillsQ.error || linksQ.error || msQ.error;
  if (loading) return <PageSkeleton />;
  if (error) return <div className="page-container"><ErrorState message={(error as Error).message} onRetry={() => { goalQ.refetch(); skillsQ.refetch(); linksQ.refetch(); msQ.refetch(); }} /></div>;
  if (!goal) return <div className="page-container"><ErrorState message="هدف یافت نشد." /></div>;

  const pct = goal.targetValue ? Math.min(100, Math.round(((goal.currentValue || 0) / goal.targetValue) * 100)) : 0;
  const msPct = milestones.length ? (milestones.filter(m => m.done).length / milestones.length) * 100 : pct;

  return (
    <div className="page-container space-y-6">
      <PageHeader eyebrow="جزئیات هدف" title={goal.title} description="اطلاعات هدف، milestoneها و مهارت‌های مرتبط را مدیریت کن."
        actions={<><Button variant="outline" onClick={() => router.push(`/dashboard/progress/goal/${goalId}`)}>ثبت پیشرفت</Button><Button variant="ghost" onClick={() => router.back()} className="gap-1.5"><ArrowRight className="h-4 w-4" />بازگشت</Button></>} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="xl:col-span-2 space-y-6">
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 text-primary"><Target className="h-5 w-5" /><h2 className="text-lg font-bold">اطلاعات هدف</h2></div>
            <div className="grid gap-4">
              <div className="space-y-2"><Label htmlFor="title">عنوان</Label><Input id="title" value={goal.title} disabled={updateGoal.isPending} onChange={(e) => setGoal({ ...goal, title: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="description">توضیحات</Label><Input id="description" value={goal.description || ""} disabled={updateGoal.isPending} onChange={(e) => setGoal({ ...goal, description: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>دسته‌بندی</Label><Select value={goal.category || undefined} disabled={updateGoal.isPending} onValueChange={(val: GoalCategory) => setGoal({ ...goal, category: val })}><SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger><SelectContent>{Object.values(GoalCategory).map((c) => <SelectItem key={c} value={c}>{GoalCategoryTranslations[c]}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>اولویت</Label><Select value={goal.priority || undefined} disabled={updateGoal.isPending} onValueChange={(val: GoalPriority) => setGoal({ ...goal, priority: val })}><SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger><SelectContent>{Object.values(GoalPriority).map((p) => <SelectItem key={p} value={p}>{GoalPriorityTranslations[p]}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>وضعیت</Label><Select value={goal.status || undefined} disabled={updateGoal.isPending} onValueChange={(val: GoalStatus) => setGoal({ ...goal, status: val })}><SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger><SelectContent>{Object.values(GoalStatus).map((s) => <SelectItem key={s} value={s}>{GoalStatusTranslations[s]}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label htmlFor="deadline">ددلاین</Label><Input id="deadline" type="date" value={goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : ""} disabled={updateGoal.isPending} onChange={(e) => setGoal({ ...goal, deadline: e.target.value ? new Date(e.target.value) : null })} /></div>
              <div className="space-y-2"><Label htmlFor="targetValue">مقدار هدف</Label><Input id="targetValue" type="number" value={goal.targetValue ?? ""} disabled={updateGoal.isPending} onChange={(e) => setGoal({ ...goal, targetValue: e.target.value === "" ? null : Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label htmlFor="currentValue">مقدار فعلی</Label><Input id="currentValue" type="number" value={goal.currentValue ?? ""} disabled={updateGoal.isPending} onChange={(e) => setGoal({ ...goal, currentValue: e.target.value === "" ? null : Number(e.target.value) })} /></div>
            </div>
            {goal.targetValue ? <div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-muted-foreground">پیشرفت عددی</span><span>{pct}%</span></div><ProgressBar value={pct} tone={pct >= 100 ? "success" : "primary"} /></div> : null}
            <Button onClick={handleUpdateGoal} disabled={updateGoal.isPending} className="gap-1.5"><Save className="h-4 w-4" />{updateGoal.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}</Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Boss Bar / Milestones</h2><p className="text-sm text-muted-foreground">قدم‌های کلیدی برای فتح این هدف.</p></div><span className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground">{milestones.filter(m=>m.done).length}/{milestones.length}</span></div>
            <ProgressBar value={msPct} tone={msPct >= 100 ? "success" : "primary"} className="h-3" />
            <div className="flex gap-2"><Input value={newMilestone} onChange={(e)=>setNewMilestone(e.target.value)} placeholder="Milestone جدید..." onKeyDown={(e)=>e.key==="Enter"&&(e.preventDefault(),addMs())} /><Button onClick={addMs} disabled={createMs.isPending} className="gap-1.5"><Plus className="h-4 w-4" />افزودن</Button></div>
            <div className="space-y-2">
              {milestones.length === 0 ? <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border/70 p-4 text-center">Milestoneای ثبت نشده. برای حالت Boss Quest، milestone اضافه کن.</p> : milestones.map(ms => (
                <div key={ms.id} className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${ms.done ? "bg-emerald-500/5 border-emerald-500/25" : "border-border/70 bg-background/20"}`}>
                  <label className="flex items-center gap-3 cursor-pointer flex-1"><input type="checkbox" checked={ms.done} onChange={()=>toggleMs(ms)} className="h-4 w-4 accent-primary" /><span className={ms.done ? "line-through text-muted-foreground" : ""}>{ms.title}</span></label>
                  <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={()=>removeMs(ms.id)} aria-label="حذف milestone"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary"><Link2 className="h-5 w-5" /><h2 className="text-lg font-bold">مهارت‌های مرتبط</h2></div>
            <div className="space-y-2">
              <Label>افزودن مهارت</Label>
              <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                <SelectTrigger><SelectValue placeholder="یک مهارت انتخاب کنید" /></SelectTrigger>
                <SelectContent>{skills.filter((s) => !links.some((l) => l.skillId === s.id)).map((s) => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={handleLinkSkill} disabled={!selectedSkillId || linkSkill.isPending} variant="outline" className="w-full">اتصال مهارت</Button>
            </div>
            <div className="space-y-2">
              {links.length === 0 ? <p className="text-sm text-muted-foreground">مهارتی متصل نشده است.</p> : links.map((link) => (
                <div key={link.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/20 p-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{link.skill?.title || link.skillId}</div>
                    <div className="text-xs text-muted-foreground mt-1">{link.learningStatus ? SkillLearningStatusTranslations[link.learningStatus] : "نامشخص"}{typeof link.impact === "number" ? ` • تاثیر: ${link.impact}` : ""}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleUnlink(link.id)} aria-label="حذف اتصال مهارت"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoalPage;
