"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGoalById, updateGoal } from "@/services/api/goals";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import type { Goal } from "@/services/api/goals";

const GoalPage: React.FC = () => {
  const { goalId } = useParams();
  const router = useRouter();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGoal = async () => {
      if (!goalId) return;
      const response = await getGoalById(goalId as string);
      if (response.status) {
        setGoal(response.data);
      } else {
        toast.error("خطا در دریافت جزئیات هدف");
      }
      setLoading(false);
    };

    fetchGoal();
  }, [goalId]);

  const handleUpdateGoal = async () => {
    if (!goal) return;

    const response = await updateGoal({
      goalId: goal.id,
      title: goal.title,
      description: goal.description || "",
      category: goal.category || "",
      deadline: goal.deadline ? new Date(goal.deadline).toISOString() : null,
    });

    if (response.status) {
      toast.success("هدف با موفقیت به‌روزرسانی شد");
    } else {
      toast.error("به‌روزرسانی هدف ناموفق بود");
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;

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
            <div className="mb-4">
              <Label htmlFor="title">عنوان</Label>
              <Input
                id="title"
                type="text"
                value={goal.title}
                onChange={(e) => setGoal({ ...goal, title: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="description">توضیحات</Label>
              <Input
                id="description"
                type="text"
                value={goal.description || ""}
                onChange={(e) =>
                  setGoal({ ...goal, description: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="category">دسته‌بندی</Label>
              <Input
                id="category"
                type="text"
                value={goal.category || ""}
                onChange={(e) =>
                  setGoal({ ...goal, category: e.target.value })
                }
                placeholder="مثلاً کوتاه‌مدت یا بلندمدت"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="deadline">ددلاین</Label>
              <Input
                id="deadline"
                type="date"
                value={
                  goal.deadline
                    ? new Date(goal.deadline).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setGoal({ ...goal, deadline: e.target.value })
                }
              />
            </div>
            <Button onClick={handleUpdateGoal}>به‌روزرسانی هدف</Button>
          </Card>
        </motion.div>
      ) : (
        <p>هدف یافت نشد.</p>
      )}
    </div>
  );
};

export default GoalPage;
