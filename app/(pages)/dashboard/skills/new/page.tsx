"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { SkillLevel } from "@prisma/client";
import { useCreateSkill } from "@/hooks/queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { SkillLevelTranslations } from "@/lib/dictionary";

const schema = z.object({
  title: z.string().min(2, "عنوان باید حداقل ۲ کاراکتر باشد"),
  description: z.string().optional(),
  requiredPoints: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
});

type FormData = z.infer<typeof schema>;

const NewSkillPage: React.FC = () => {
  const router = useRouter();
  const createSkill = useCreateSkill();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const response = await createSkill.mutateAsync({
      title: data.title,
      description: data.description,
      requiredPoints: data.requiredPoints ? Number(data.requiredPoints) : null,
      level: data.level ?? null,
    });
    if (response.status) { toast.success("مهارت ایجاد شد"); router.push(`/dashboard/skills/${response.data.id}`); }
    else toast.error(response.message || "خطا در ایجاد مهارت");
  };

  return (
    <div className="page-container space-y-6">
      <PageHeader eyebrow="مهارت جدید" title="ایجاد مهارت جدید" description="مهارتی که می‌خواهی رشد بدهی را تعریف کن." actions={<Button variant="ghost" onClick={() => router.back()} className="gap-1.5"><ArrowRight className="h-4 w-4" />بازگشت</Button>} />
      <Card className="p-6 sm:p-8 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="title">عنوان</Label><Input id="title" {...register("title")} />{errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}</div>
          <div className="space-y-2"><Label htmlFor="description">توضیحات</Label><Input id="description" {...register("description")} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="requiredPoints">امتیاز مورد نیاز</Label><Input id="requiredPoints" type="number" min={0} {...register("requiredPoints")} /></div>
            <div className="space-y-2">
              <Label>سطح</Label>
              <Select onValueChange={(v) => setValue("level", v as FormData["level"])}>
                <SelectTrigger><SelectValue placeholder="انتخاب سطح" /></SelectTrigger>
                <SelectContent>{Object.values(SkillLevel).map((level) => <SelectItem key={level} value={level}>{SkillLevelTranslations[level]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting || createSkill.isPending} size="lg">{isSubmitting || createSkill.isPending ? "در حال ثبت..." : "ایجاد مهارت"}</Button>
        </form>
      </Card>
    </div>
  );
};

export default NewSkillPage;
