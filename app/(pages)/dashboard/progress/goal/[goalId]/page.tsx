"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Goal } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getGoalById } from "@/services/api/goals";
import {
  getGoalProgress,
  createGoalProgress,
  GoalProgress,
} from "@/services/api/goalProgress";
import toast from "react-hot-toast";

const GoalDetailsPage: React.FC = () => {
  const { goalId } = useParams();
  const router = useRouter();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [progressList, setProgressList] = useState<GoalProgress[]>([]);
  const [progress, setProgress] = useState("");
  const [note, setNote] = useState(""); // state جدید برای توضیحات
  const [loading, setLoading] = useState<boolean>(true);
  const [addingProgress, setAddingProgress] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!goalId) return;
      setLoading(true);

      try {
        const goalResponse = await getGoalById(goalId as string);
        if (goalResponse.status) {
          setGoal(goalResponse.data);
        } else {
          toast.error("خطا در دریافت اطلاعات هدف");
        }

        const progressResponse = await getGoalProgress(goalId as string);
        if (progressResponse.status) {
          setProgressList(progressResponse.data);
        } else {
          toast.error("خطا در دریافت اطلاعات پیشرفت");
        }
      } catch (error) {
        toast.error("مشکلی در بارگذاری اطلاعات پیش آمد.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [goalId]);

  const handleAddProgress = async () => {
    if (!goal || !progress || isNaN(Number(progress))) {
      toast.error("لطفاً یک مقدار معتبر وارد کنید.");
      return;
    }

    setAddingProgress(true);
    try {
      const response = await createGoalProgress(
        goal.id,
        parseInt(progress),
        note.trim()
      );
      if (response.status) {
        toast.success("پیشرفت با موفقیت ثبت شد.");
        setProgress("");
        setNote(""); // پاک کردن مقدار note بعد از ثبت موفقیت‌آمیز
        setProgressList((prev) => [...prev, response.data]);
      } else {
        toast.error("خطا در ثبت پیشرفت.");
      }
    } catch (error) {
      toast.error("مشکلی در ثبت پیشرفت پیش آمد.");
      console.error("Error adding progress:", error);
    } finally {
      setAddingProgress(false);
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

          {/* فرم ثبت پیشرفت */}
          <div className="mt-6">
            <div>
              <Label htmlFor="progress">ثبت پیشرفت</Label>
              <Input
                className="mt-2"
                id="progress"
                type="number"
                placeholder="0 - 10"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                min={1}
              />
            </div>
            <div className="mt-4 mb-2">
              <Label htmlFor="note">توضیحات (اختیاری)</Label>
              <Input
                className="mt-2"
                id="note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="توضیحی درباره پیشرفت وارد کنید..."
              />
            </div>

            <Button
              className="mt-2"
              onClick={handleAddProgress}
              disabled={addingProgress}
            >
              {addingProgress ? "در حال ثبت..." : "ثبت پیشرفت"}
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
