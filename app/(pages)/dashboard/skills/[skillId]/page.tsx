"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRight, Save, Sparkles } from "lucide-react";
import { SkillLevel } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { PageSkeleton } from "@/components/dashboard/skeletons";
import { ErrorState } from "@/components/dashboard/error-state";
import { useSkill, useUpdateSkill } from "@/hooks/queries";
import { SkillLevelTranslations } from "@/lib/dictionary";
import type { Skill } from "@/services/api/skills";

const SkillPage: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const router = useRouter();
  const skillQ = useSkill(skillId);
  const updateSkill = useUpdateSkill();
  const [skill, setSkill] = useState<Skill | null>(null);

  useEffect(() => { if (skillQ.data) setSkill(skillQ.data as Skill); }, [skillQ.data]);

  const handleSave = async () => {
    if (!skill) return;
    const res = await updateSkill.mutateAsync({ skillId: skill.id, title: skill.title, description: skill.description || "", requiredPoints: skill.requiredPoints ?? null, level: skill.level ?? null } as any);
    if (res.status) toast.success("مهارت به‌روزرسانی شد");
    else toast.error(res.message || "خطا در به‌روزرسانی");
  };

  if (skillQ.isLoading) return <PageSkeleton />;
  if (skillQ.error) return <div className="page-container"><ErrorState message={(skillQ.error as Error).message} onRetry={() => skillQ.refetch()} /></div>;
  if (!skill) return <div className="page-container"><ErrorState message="مهارت یافت نشد." /></div>;

  const xp = skill.xp ?? 0;
  const mastery = skill.masteryLevel ?? 1;
  const pct = Math.min(100, ((xp % 80) / 80) * 100);

  return (
    <div className="page-container space-y-6">
      <PageHeader eyebrow="جزئیات مهارت" title={skill.title} description="اطلاعات مهارت را ویرایش کن و پیشرفتش را ثبت کن."
        actions={<Button variant="ghost" onClick={() => router.back()} className="gap-1.5"><ArrowRight className="h-4 w-4" />بازگشت</Button>} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-2 space-y-5">
          <div className="flex items-center gap-2 text-primary"><Sparkles className="h-5 w-5" /><h2 className="text-lg font-bold">ویرایش مهارت</h2></div>
          <div className="space-y-2"><Label htmlFor="title">عنوان</Label><Input id="title" value={skill.title} onChange={(e) => setSkill({ ...skill, title: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="description">توضیحات</Label><Input id="description" value={skill.description || ""} onChange={(e) => setSkill({ ...skill, description: e.target.value })} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="requiredPoints">امتیاز مورد نیاز</Label><Input id="requiredPoints" type="number" min={0} value={skill.requiredPoints ?? ""} onChange={(e) => setSkill({ ...skill, requiredPoints: e.target.value === "" ? null : Number(e.target.value) })} /></div>
            <div className="space-y-2">
              <Label>سطح</Label>
              <Select value={skill.level || undefined} onValueChange={(v) => setSkill({ ...skill, level: v as Skill["level"] })}>
                <SelectTrigger><SelectValue placeholder="انتخاب سطح" /></SelectTrigger>
                <SelectContent>{Object.values(SkillLevel).map((level) => <SelectItem key={level} value={level}>{SkillLevelTranslations[level]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={updateSkill.isPending} className="gap-1.5"><Save className="h-4 w-4" />{updateSkill.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}</Button>
            <Button variant="outline" onClick={() => router.push(`/dashboard/progress/skill/${skill.id}`)}>ثبت پیشرفت</Button>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">Mastery</h2>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
            <div className="text-sm text-muted-foreground mb-1">سطح تسلط</div>
            <div className="text-4xl font-bold text-primary">Lv.{mastery}</div>
            <div className="text-sm text-muted-foreground mt-2">{xp} XP</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground"><span>پیشرفت تا لول بعدی</span><span>{Math.round(pct)}%</span></div>
            <ProgressBar value={pct} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SkillPage;
