"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Search, Trash2, Eye, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { PageSkeleton } from "@/components/dashboard/skeletons";
import { ErrorState } from "@/components/dashboard/error-state";
import { useSkills, useDeleteSkill } from "@/hooks/queries";
import { useConfirm } from "@/components/ui/confirm-dialog";
import type { Skill } from "@/services/api/skills";
import { SkillLevelTranslations } from "@/lib/dictionary";

const SkillsPage: React.FC = () => {
  const skillsQ = useSkills();
  const del = useDeleteSkill();
  const skills = useMemo(() => (skillsQ.data as Skill[] | undefined) || [], [skillsQ.data]);
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("ALL");
  const router = useRouter();
  const confirm = useConfirm();

  const filtered = useMemo(() => skills.filter((s) => {
    const matchQ = !q.trim() || (s.title + " " + (s.description || "")).toLowerCase().includes(q.toLowerCase());
    const matchLevel = level === "ALL" || s.level === level;
    return matchQ && matchLevel;
  }), [skills, q, level]);

  const handleDelete = async (skillId: string) => {
    const ok = await confirm({ title: "حذف مهارت", description: "آیا از حذف این مهارت مطمئن هستید؟ این عمل قابل برگشت نیست.", confirmText: "حذف", destructive: true });
    if (!ok) return;
    const response = await del.mutateAsync(skillId);
    if (response.status) toast.success("مهارت حذف شد");
    else toast.error(response.message || "خطا در حذف مهارت");
  };

  if (skillsQ.isLoading) return <PageSkeleton />;
  if (skillsQ.error) return <div className="page-container"><ErrorState message={(skillsQ.error as Error).message} onRetry={() => skillsQ.refetch()} /></div>;

  return (
    <div className="page-container space-y-6">
      <PageHeader eyebrow="درخت مهارت" title="مهارت‌های من" description="مهارت‌ها را رشد بده، XP جمع کن و به اهداف وصل‌شان کن." actions={<Button onClick={() => router.push("/dashboard/skills/new")} className="gap-1.5"><Plus className="h-4 w-4" />مهارت جدید</Button>} />
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="جستجو در مهارت‌ها..." value={q} onChange={(e) => setQ(e.target.value)} className="pr-9" /></div>
          <select className="h-11 rounded-xl border border-border/80 bg-background/50 px-3.5 text-sm" value={level} onChange={(e) => setLevel(e.target.value)}><option value="ALL">همه سطوح</option><option value="BEGINNER">مبتدی</option><option value="INTERMEDIATE">متوسط</option><option value="ADVANCED">پیشرفته</option></select>
        </div>
      </Card>
      {filtered.length === 0 ? <EmptyState title="مهارتی یافت نشد" description="یک مهارت جدید اضافه کن یا فیلتر را تغییر بده." action={<Button onClick={() => router.push("/dashboard/skills/new")}>افزودن مهارت</Button>} /> : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((skill) => {
            const xp = skill.xp ?? 0;
            const mastery = skill.masteryLevel ?? 1;
            const pct = Math.min(100, ((xp % 80) / 80) * 100);
            return (
              <Card key={skill.id} className="p-5 flex flex-col bg-card/70 hover:bg-card/90 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-primary/12 text-primary flex items-center justify-center"><Sparkles className="h-5 w-5" /></div><div><h2 className="font-bold leading-6">{skill.title}</h2><div className="text-xs text-muted-foreground">{skill.level ? SkillLevelTranslations[skill.level] : "سطح مشخص نشده"}</div></div></div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-violet-500/12 text-violet-300 border border-violet-500/20">Lv.{mastery}</span>
                </div>
                <div className="mb-4 space-y-1.5"><div className="flex justify-between text-xs text-muted-foreground"><span>Mastery XP</span><span>{xp} XP</span></div><ProgressBar value={pct} /></div>
                <p className="text-sm text-muted-foreground leading-7 line-clamp-2 mb-4 flex-1">{skill.description || "توضیحاتی ثبت نشده است."}</p>
                <div className="flex gap-2 mt-auto"><Button asChild variant="outline" className="flex-1 gap-1.5"><Link href={`/dashboard/skills/${skill.id}`}><Eye className="h-4 w-4" />مشاهده</Link></Button><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(skill.id)} aria-label="حذف مهارت"><Trash2 className="h-4 w-4" /></Button></div>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default SkillsPage;
