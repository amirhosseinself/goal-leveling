"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./chart-tooltip";
import { EmptyChart } from "./empty-chart";

type Point = { date: string; goalCount: number; skillCount: number };
const fmt = (d: string) => { try { return new Date(d).toLocaleDateString("fa-IR", { month: "short", day: "numeric" }); } catch { return d.slice(5); } };

export function CountBarChart({ data, height = 220 }: { data: Point[]; height?: number }) {
  const has = data?.some((d) => d.goalCount > 0 || d.skillCount > 0);
  if (!data?.length || !has) return <EmptyChart message="هنوز ثبت پیشرفتی برای نمایش فعالیت وجود ندارد." />;
  return (
    <div style={{ height }} className="w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} minTickGap={24} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} width={32} />
          <Tooltip content={<ChartTooltip labelFormatter={fmt} />} />
          <Bar dataKey="goalCount" name="ثبت هدف" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="skillCount" name="ثبت مهارت" fill="#22d3ee" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
