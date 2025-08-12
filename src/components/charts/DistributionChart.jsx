import React from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

export default function DistributionChart({ percentile = 50 }) {
  const data = new Array(101).fill(0).map((_, i) => {
    const x = i * 2;
    const mu = 100;
    const sigma = 20;
    const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    return { x, y };
  });
  return (
<>
<ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="x" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
        <YAxis hide domain={[0, "auto"]} />
        <Tooltip formatter={(v) => v.toFixed(4)} labelFormatter={(l) => `Перцентиль ${l}%`} />
        <Area type="monotone" dataKey="y" stroke="#60a5fa" fill="url(#grad)" />
        <ReferenceLine x={percentile} stroke="#ef4444" strokeDasharray="4 4" />
      </AreaChart>
    </ResponsiveContainer>
</XAxis>
</Tooltip>
</>
);
}

