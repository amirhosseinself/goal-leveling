"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { GoalCategory, GoalPriority, GoalStatus } from "@prisma/client";

import { createGoal } from "@/services/api/goals";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// تعریف تایپ و اعتبارسنجی با Zod با استفاده از Enums پریسما
const goalSchema = z.object({
  title: z.string().min(3, "عنوان باید حداقل ۳ کاراکتر باشد"),
  description: z.string().optional(),
  category: z.enum(Object.values(GoalCategory) as [string, ...string[]]),
  priority: z.enum(Object.values(GoalPriority) as [string, ...string[]]),
  status: z.enum(Object.values(GoalStatus) as [string, ...string[]]),
  deadline: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

const NewGoalPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
  });

  const onSubmit = async (data: GoalFormData) => {
    try {
      const goalData = {
        ...data,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      };

      const response = await createGoal(goalData);
      if (response.status) {
        toast.success("هدف با موفقیت ایجاد شد!");
        router.push(`/dashboard/goals/${response.data.id}`);
      } else {
        toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
      }
    } catch (error) {
      console.log(error);
      toast.error("خطایی رخ داد!");
    }
  };

  return (
    <div className="container pt-16">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">ایجاد هدف جدید</h1>
        <Button onClick={() => router.back()}>بازگشت</Button>
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* عنوان */}
            <div>
              <Label htmlFor="title">عنوان</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="عنوان هدف را وارد کنید"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* توضیحات */}
            <div>
              <Label htmlFor="description">توضیحات (اختیاری)</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="توضیحات هدف را بنویسید"
              />
            </div>

            {/* دسته‌بندی */}
            <div>
              <Label>دسته‌بندی</Label>
              <Select
                onValueChange={(val: GoalCategory) => setValue("category", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(GoalCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* اولویت */}
            <div>
              <Label>اولویت</Label>
              <Select
                onValueChange={(val: GoalPriority) => setValue("priority", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(GoalPriority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-red-500 text-sm">
                  {errors.priority.message}
                </p>
              )}
            </div>

            {/* وضعیت */}
            <div>
              <Label>وضعیت</Label>
              <Select
                onValueChange={(val: GoalStatus) => setValue("status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(GoalStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            {/* ددلاین */}
            <div>
              <Label htmlFor="deadline">ددلاین (تاریخ پایان هدف)</Label>
              <Input id="deadline" type="date" {...register("deadline")} />
            </div>

            {/* دکمه ثبت */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "در حال ثبت..." : "ایجاد هدف"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default NewGoalPage;
