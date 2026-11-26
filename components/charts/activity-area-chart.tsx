"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./chart-tooltip";
import { EmptyChart } from "./empty-chart";

type Point = { date: string; goalScore: number; skillScore: number };
type Props = { data: Point[]; height?: number; showGrid?: boolean };

const fmt = (d: string) => {
  try { return new Date(d).toLocaleDateString("fa-IR", { month: "short", day: "numeric" }); } catch { return d.slice(5); }
};

export function ActivityAreaChart({ data, height = 260, showGrid = true }: Props) {
  const hasData = data?.some((d) => d.goalScore > 0 || d.skillScore > 0);
  if (!data?.length || !hasData) return <EmptyChart message="هنوز پیشرفتی ثبت نشده تا روند نمایش داده شود." />;
  return (
    <div style={{ height }} className="w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gGoal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gSkill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid ? <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} /> : null}
          <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} minTickGap={24} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={36} />
          <Tooltip content={<ChartTooltip labelFormatter={fmt} />} />
          <Area type="monotone" dataKey="goalScore" name="اهداف" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gGoal)" dot={false} activeDot={{ r: 4 }} />
          <Area type="monotone" dataKey="skillScore" name="مهارت‌ها" stroke="#22d3ee" strokeWidth={2.5} fill="url(#gSkill)" dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
