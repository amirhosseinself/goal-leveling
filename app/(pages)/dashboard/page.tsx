"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGoals } from "@/services/api/goals";
import { getSkills } from "@/services/api/skills";
import { getProgressSummary } from "@/services/api/progress";

const DashboardPage: React.FC = () => {
  const [goalCount, setGoalCount] = useState<number>(0);
  const [skillCount, setSkillCount] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // دریافت لیست اهداف
        const goalsResponse = await getGoals();
        if (goalsResponse.status) {
          setGoalCount(goalsResponse.data.length);
        } else {
          console.error("Error fetching goals:", goalsResponse.message);
        }

        // دریافت لیست مهارت‌ها
        const skillsResponse = await getSkills();
        if (skillsResponse.status) {
          setSkillCount(skillsResponse.data.length);
        } else {
          console.error("Error fetching skills:", skillsResponse.message);
        }

        // دریافت خلاصه پیشرفت (امتیاز کلی)
        const progressResponse = await getProgressSummary();
        if (progressResponse.status) {
          setTotalScore(progressResponse.data.totalScore);
        } else {
          console.error("Error fetching progress:", progressResponse.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (loading && firstLoad) {
      toast.success("درحال بارگذاری");
      setFirstLoad(false); // فقط یک بار اجازه نمایش toast را می‌دهد
    }
  }, [loading, firstLoad]);

  return (
    <div className="container pt-16">
      {/* سربرگ داشبورد */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">داشبورد کاربری</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          پیشرفت اهداف، مهارت‌ها و امتیازات شما در یک نگاه
        </p>
      </header>

      {/* بخش‌های داشبورد به صورت Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* کارت مدیریت اهداف */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">اهداف</h2>
          <p className="text-green-700 dark:text-gray-400 mb-4">
            تعداد اهداف ثبت شده: {goalCount}
          </p>
          <Button asChild>
            <Link href="/dashboard/goals">مشاهده و مدیریت اهداف</Link>
          </Button>
        </Card>

        {/* کارت مدیریت مهارت‌ها */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">مهارت‌ها</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            تعداد مهارت‌های شما: {skillCount}
          </p>
          <Button asChild>
            <Link href="/dashboard/skills">مشاهده و مدیریت مهارت‌ها</Link>
          </Button>
        </Card>

        {/* کارت ثبت و مشاهده پیشرفت */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">پیشرفت</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            امتیاز کلی: {totalScore}
          </p>
          <Button asChild>
            <Link href="/dashboard/progress">مشاهده پیشرفت روزانه</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
