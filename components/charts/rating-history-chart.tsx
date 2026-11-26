"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./chart-tooltip";
import { EmptyChart } from "./empty-chart";

type Item = { date: string | Date; rating: number; note?: string | null };
const fmt = (d: string) => { try { return new Date(d).toLocaleDateString("fa-IR", { month: "short", day: "numeric" }); } catch { return String(d).slice(5, 10); } };

export function RatingHistoryChart({ items, height = 240 }: { items: Item[]; height?: number }) {
  if (!items?.length) return <EmptyChart message="هنوز پیشرفتی ثبت نشده تا نمودار نمایش داده شود." />;
  const data = [...items]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((p) => ({ date: new Date(p.date).toISOString().slice(0, 10), rating: p.rating }));
  const avg = data.length ? +(data.reduce((s, d) => s + d.rating, 0) / data.length).toFixed(1) : 0;
  return (
    <div style={{ height }} className="w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="gRating" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} minTickGap={24} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={32} />
          <Tooltip content={<ChartTooltip labelFormatter={fmt} />} />
          {avg ? <ReferenceLine y={avg} stroke="#f59e0b" strokeDasharray="4 4" /> : null}
          <Area type="monotone" dataKey="rating" name="امتیاز" stroke="#a78bfa" strokeWidth={2.5} fill="url(#gRating)" dot={{ r: 3, fill: "#a78bfa" }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
