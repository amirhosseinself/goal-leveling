"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./chart-tooltip";
import { EmptyChart } from "./empty-chart";

type Point = { date: string; done: number; total: number };
const fmt = (d: string) => { try { return new Date(d).toLocaleDateString("fa-IR", { weekday: "short" }); } catch { return d.slice(5); } };

export function DailyConsistencyChart({ data, height = 220 }: { data: Point[]; height?: number }) {
  const has = data?.some((d) => d.total > 0);
  if (!data?.length || !has) return <EmptyChart message="هنوز داده‌ای برای نمایش ثبات روزانه وجود ندارد." />;
  const chartData = data.map((d) => ({ ...d, remaining: Math.max(0, d.total - d.done), label: fmt(d.date) }));
  return (
    <div style={{ height }} className="w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} width={32} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="done" name="انجام‌شده" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="remaining" name="باقی‌مانده" stackId="a" fill="rgba(148,163,184,0.2)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
