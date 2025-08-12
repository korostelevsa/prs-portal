import React from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend } from "recharts";

export default function RiskCurve({ points, compare }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="age" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} domain={[0, 100]} />
        <Tooltip formatter={(v) => `${v}%`} labelFormatter={(l) => `Возраст ${l}`} />
        <Line type="monotone" dataKey="risk" strokeWidth={2} dot={false} />
        {compare && <Line type="monotone" data={compare} dataKey="risk" strokeWidth={2} dot={false} />}
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}
