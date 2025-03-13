"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { getGoalById, updateGoal } from "@/services/api/goals";
import { Goal, GoalCategory, GoalPriority, GoalStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  GoalCategoryTranslations,
  GoalPriorityTranslations,
  GoalStatusTranslations,
} from "@/lib/dictionary";

const GoalPage: React.FC = () => {
  const { goalId } = useParams();
  const router = useRouter();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!goalId) return;

    const fetchGoal = async () => {
      try {
        const response = await getGoalById(goalId as string);
        if (response.status) {
          setGoal(response.data);
        } else {
          toast.error("خطا در دریافت جزئیات هدف");
        }
      } catch (error) {
        console.error(error);
        toast.error("مشکلی رخ داد!");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [goalId]);

  const handleUpdateGoal = async () => {
    if (!goal) return;

    setUpdating(true);
    try {
      const response = await updateGoal({
        goalId: goal.id,
        title: goal.title,
        description: goal.description || "",
        category: goal.category,
        priority: goal.priority,
        status: goal.status,
        deadline: goal.deadline ? new Date(goal.deadline).toISOString() : null,
      });

      if (response.status) {
        toast.success("هدف با موفقیت به‌روزرسانی شد");
      } else {
        toast.error("به‌روزرسانی هدف ناموفق بود");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطایی رخ داد!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">در حال بارگذاری...</p>;

  return (
    <div className="container pt-16">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">جزئیات هدف</h1>
        <Button onClick={() => router.back()}>بازگشت</Button>
      </header>

      {goal ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-6">
            {/* عنوان */}
            <div className="mb-4">
              <Label htmlFor="title">عنوان</Label>
              <Input
                id="title"
                type="text"
                value={goal.title}
                disabled={updating}
                onChange={(e) =>
                  setGoal((prev) => prev && { ...prev, title: e.target.value })
                }
              />
            </div>

            {/* توضیحات */}
            <div className="mb-4">
              <Label htmlFor="description">توضیحات</Label>
              <Input
                id="description"
                type="text"
                value={goal.description || ""}
                disabled={updating}
                onChange={(e) =>
                  setGoal(
                    (prev) => prev && { ...prev, description: e.target.value }
                  )
                }
              />
            </div>

            {/* دسته‌بندی */}
            <div className="mb-4">
              <Label>دسته‌بندی</Label>
              <Select
                value={goal.category || undefined} // در صورتی که goal.category مقدار null داشته باشد، undefined قرار می‌دهیم
                disabled={updating}
                onValueChange={(val: GoalCategory) =>
                  setGoal((prev) => prev && { ...prev, category: val })
                }
              >
                <SelectTrigger className="rtl">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent className="rtl">
                  {Object.values(GoalCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {GoalCategoryTranslations[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* اولویت */}
            <div className="mb-4">
              <Label>اولویت</Label>
              <Select
                value={goal.priority || undefined} // در صورتی که goal.priority مقدار null داشته باشد، undefined قرار می‌دهیم
                disabled={updating}
                onValueChange={(val: GoalPriority) =>
                  setGoal((prev) => prev && { ...prev, priority: val })
                }
              >
                <SelectTrigger className="rtl">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent className="rtl">
                  {Object.values(GoalPriority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {GoalPriorityTranslations[priority]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* وضعیت */}
            <div className="mb-4">
              <Label>وضعیت</Label>
              <Select
                value={goal.status || undefined} // در صورتی که goal.status مقدار null داشته باشد، undefined قرار می‌دهیم
                disabled={updating}
                onValueChange={(val: GoalStatus) =>
                  setGoal((prev) => prev && { ...prev, status: val })
                }
              >
                <SelectTrigger className="rtl">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent className="rtl">
                  {Object.values(GoalStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {GoalStatusTranslations[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ددلاین */}
            <div className="mb-4">
              <Label htmlFor="deadline">ددلاین</Label>
              <Input
                className="rtl"
                id="deadline"
                type="date"
                value={
                  goal.deadline
                    ? new Date(goal.deadline).toISOString().split("T")[0]
                    : ""
                }
                disabled={updating}
                onChange={(e) =>
                  setGoal(
                    (prev) =>
                      prev && {
                        ...prev,
                        deadline: e.target.value
                          ? new Date(e.target.value)
                          : null,
                      }
                  )
                }
              />
            </div>

            {/* دکمه ذخیره */}
            <Button onClick={handleUpdateGoal} disabled={updating}>
              {updating ? "در حال ذخیره..." : "به‌روزرسانی هدف"}
            </Button>
          </Card>
        </motion.div>
      ) : (
        <p className="text-center text-red-500">هدف یافت نشد.</p>
      )}
    </div>
  );
};

export default GoalPage;
