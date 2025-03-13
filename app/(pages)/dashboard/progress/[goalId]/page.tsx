"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getGoalById, updateGoal } from "@/services/api/goals";
import {
  getGoalProgress,
  createGoalProgress,
  GoalProgress,
} from "@/services/api/goalProgress";
import { Goal } from "@/services/api/goals";

const GoalDetailsPage: React.FC = () => {
  const { goalId } = useParams();
  const router = useRouter();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [progressList, setProgressList] = useState<GoalProgress[]>([]);
  const [progress, setProgress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!goalId) return;

      setLoading(true);
      const goalResponse = await getGoalById(goalId as string);
      if (goalResponse.status) {
        setGoal(goalResponse.data);
      }

      const progressResponse = await getGoalProgress(goalId as string);
      if (progressResponse.status) {
        setProgressList(progressResponse.data);
      }

      setLoading(false);
    };

    fetchData();
  }, [goalId]);

  const handleUpdateGoal = async () => {
    if (!goal) return;

    const response = await updateGoal({
      goalId: goal.id,
      title: goal.title,
      description: goal.description || "",
    });

    if (response.status) {
      alert("هدف با موفقیت به‌روزرسانی شد.");
    }
  };

  const handleAddProgress = async () => {
    if (!goal || !progress) return;

    const response = await createGoalProgress(goal.id, parseInt(progress));
    if (response.status) {
      alert("پیشرفت با موفقیت ثبت شد.");
      setProgress("");
      setProgressList((prev) => [...prev, response.data]);
    }
  };

  return (
    <div className="container pt-16">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">جزئیات هدف</h1>
        <Button onClick={() => router.back()}>بازگشت</Button>
      </header>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : goal ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{goal.title}</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            {goal.description || "توضیحاتی وارد نشده است"}
          </p>

          {/* فرم ویرایش هدف */}
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
          <Button onClick={handleUpdateGoal}>به‌روزرسانی هدف</Button>

          {/* فرم ثبت پیشرفت */}
          <div className="mt-6">
            <Label htmlFor="progress">ثبت پیشرفت</Label>
            <Input
              id="progress"
              type="number"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            />
            <Button className="mt-2" onClick={handleAddProgress}>
              ثبت پیشرفت
            </Button>
          </div>

          {/* نمایش لیست پیشرفت‌ها */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">پیشرفت‌ها</h3>
            {progressList.length > 0 ? (
              <ul className="space-y-2">
                {progressList.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md"
                  >
                    <span className="font-medium">امتیاز: {item.rating}</span> -{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.note || "بدون توضیح"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">هنوز هیچ پیشرفتی ثبت نشده است.</p>
            )}
          </div>
        </Card>
      ) : (
        <p>هدف یافت نشد.</p>
      )}
    </div>
  );
};

export default GoalDetailsPage;
