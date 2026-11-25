"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { GoalCategory, GoalPriority, GoalStatus } from "@prisma/client";
import { useCreateGoal } from "@/hooks/queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { GoalCategoryTranslations, GoalPriorityTranslations, GoalStatusTranslations } from "@/lib/dictionary";

const goalSchema = z.object({
  title: z.string().min(3, "عنوان باید حداقل ۳ کاراکتر باشد"),
  description: z.string().optional(),
  category: z.enum(Object.values(GoalCategory) as [string, ...string[]]),
  priority: z.enum(Object.values(GoalPriority) as [string, ...string[]]),
  status: z.enum(Object.values(GoalStatus) as [string, ...string[]]),
  deadline: z.string().optional(),
  targetValue: z.string().optional(),
  currentValue: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

const NewGoalPage: React.FC = () => {
  const router = useRouter();
  const createGoal = useCreateGoal();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<GoalFormData>({ resolver: zodResolver(goalSchema) });

  const onSubmit = async (data: GoalFormData) => {
    try {
      const goalData = {
        ...data,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        targetValue: data.targetValue ? Number(data.targetValue) : null,
        currentValue: data.currentValue ? Number(data.currentValue) : null,
      };
      const response = await createGoal.mutateAsync(goalData);
      if (response.status) { toast.success("هدف با موفقیت ایجاد شد!"); router.push(`/dashboard/goals/${response.data.id}`); }
      else toast.error(response.message || "مشکلی پیش آمد. دوباره تلاش کنید.");
    } catch { toast.error("خطایی رخ داد!"); }
  };

  return (
    <div className="page-container space-y-6">
      <PageHeader eyebrow="هدف جدید" title="ایجاد هدف جدید" description="یک هدف واضح با اولویت، وضعیت و معیار اندازه‌گیری تعریف کن." actions={<Button variant="ghost" onClick={() => router.back()} className="gap-1.5"><ArrowRight className="h-4 w-4" />بازگشت</Button>} />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 sm:p-8 max-w-3xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2"><Label htmlFor="title">عنوان</Label><Input id="title" {...register("title")} placeholder="عنوان هدف را وارد کنید" />{errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}</div>
            <div className="space-y-2"><Label htmlFor="description">توضیحات (اختیاری)</Label><Input id="description" {...register("description")} placeholder="توضیحات هدف را بنویسید" /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>دسته‌بندی</Label><Select onValueChange={(val: GoalCategory) => setValue("category", val)}><SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger><SelectContent>{Object.values(GoalCategory).map((category) => <SelectItem key={category} value={category}>{GoalCategoryTranslations[category]}</SelectItem>)}</SelectContent></Select>{errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}</div>
              <div className="space-y-2"><Label>اولویت</Label><Select onValueChange={(val: GoalPriority) => setValue("priority", val)}><SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger><SelectContent>{Object.values(GoalPriority).map((priority) => <SelectItem key={priority} value={priority}>{GoalPriorityTranslations[priority]}</SelectItem>)}</SelectContent></Select>{errors.priority && <p className="text-destructive text-sm">{errors.priority.message}</p>}</div>
              <div className="space-y-2"><Label>وضعیت</Label><Select onValueChange={(val: GoalStatus) => setValue("status", val)}><SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger><SelectContent>{Object.values(GoalStatus).map((status) => <SelectItem key={status} value={status}>{GoalStatusTranslations[status]}</SelectItem>)}</SelectContent></Select>{errors.status && <p className="text-destructive text-sm">{errors.status.message}</p>}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label htmlFor="deadline">ددلاین</Label><Input id="deadline" type="date" {...register("deadline")} /></div>
              <div className="space-y-2"><Label htmlFor="targetValue">مقدار هدف (اختیاری)</Label><Input id="targetValue" type="number" {...register("targetValue")} placeholder="مثلاً 100" /></div>
              <div className="space-y-2"><Label htmlFor="currentValue">مقدار فعلی (اختیاری)</Label><Input id="currentValue" type="number" {...register("currentValue")} placeholder="مثلاً 10" /></div>
            </div>
            <Button type="submit" disabled={isSubmitting || createGoal.isPending} size="lg">{isSubmitting || createGoal.isPending ? "در حال ثبت..." : "ایجاد هدف"}</Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default NewGoalPage;
