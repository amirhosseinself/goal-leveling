"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGoals, deleteGoal } from "@/services/api/goals";
import { Goal } from "@/services/api/goals";

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGoals = async () => {
      const response = await getGoals();
      if (response.status) {
        setGoals(response.data);
      }
      setLoading(false);
    };
    fetchGoals();
  }, []);

  const handleDelete = async (goalId: string) => {
    const response = await deleteGoal(goalId);
    if (response.status) {
      setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    }
  };

  return (
    <div className="container pt-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">مدیریت اهداف</h1>
        <p className="mt-2 mb-4 text-gray-600 dark:text-gray-300">
          در اینجا می‌توانید اهداف خود را مدیریت کنید.
        </p>
        <Button onClick={() => router.push("/dashboard/goals/new")}>
          افزودن هدف جدید
        </Button>
      </header>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-6">
              <h2 className="text-xl font-semibold mb-2">{goal.title}</h2>
              <p className="text-gray-700 dark:text-gray-400 mb-4">
                {goal.description}
              </p>
              <div className="flex justify-between">
                <Button asChild>
                  <Link href={`/dashboard/goals/${goal.id}`}>مشاهده</Link>
                </Button>
                <Button
                  onClick={() => handleDelete(goal.id)}
                  variant="destructive"
                >
                  حذف
                </Button>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
};

export default GoalsPage;
