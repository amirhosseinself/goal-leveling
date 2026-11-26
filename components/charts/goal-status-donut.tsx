"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "./chart-tooltip";
import { EmptyChart } from "./empty-chart";

type Slice = { name: string; value: number; color: string };
type Props = { data: Slice[]; height?: number; centerLabel?: string; centerValue?: string | number };

export function GoalStatusDonut({ data, height = 220, centerLabel, centerValue }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <EmptyChart message="هدفی برای نمایش وضعیت وجود ندارد." />;
  return (
    <div style={{ height }} className="relative w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="85%" paddingAngle={3} stroke="none">
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue !== undefined) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue !== undefined ? <div className="text-2xl font-bold">{centerValue}</div> : null}
          {centerLabel ? <div className="text-xs text-muted-foreground mt-0.5">{centerLabel}</div> : null}
        </div>
      )}
    </div>
  );
}
