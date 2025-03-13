"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGoal } from "@/services/api/goals";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const NewGoalPage: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGoal = async () => {
    if (!title.trim()) {
      toast.error("عنوان نمی‌تواند خالی باشد.");
      return;
    }

    setLoading(true);

    const goalData = {
      title,
      description,
      category: category.trim() ? category : null,
      deadline: deadline ? new Date(deadline).toISOString() : null,
    };

    const response = await createGoal(goalData);

    if (response.status) {
      toast.success("هدف با موفقیت ایجاد شد!");
      router.push(`/dashboard/goals/${response.data.id}`);
    } else {
      toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
    }

    setLoading(false);
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
          {/* فیلد عنوان */}
          <div className="mb-4">
            <Label htmlFor="title">عنوان</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان هدف را وارد کنید"
            />
          </div>

          {/* فیلد توضیحات */}
          <div className="mb-4">
            <Label htmlFor="description">توضیحات (اختیاری)</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات هدف را بنویسید"
            />
          </div>

          {/* فیلد دسته‌بندی */}
          <div className="mb-4">
            <Label htmlFor="category">دسته‌بندی (مثلاً کوتاه‌مدت/بلندمدت)</Label>
            <Input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="دسته‌بندی هدف را وارد کنید"
            />
          </div>

          {/* فیلد ددلاین */}
          <div className="mb-4">
            <Label htmlFor="deadline">ددلاین (تاریخ پایان هدف)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* دکمه ثبت */}
          <Button onClick={handleCreateGoal} disabled={loading}>
            {loading ? "در حال ثبت..." : "ایجاد هدف"}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default NewGoalPage;
