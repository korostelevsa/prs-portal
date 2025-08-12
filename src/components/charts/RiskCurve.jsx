import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function RiskCurve({
  data,
  xKey = 'name',
  yKey = 'value',
  color = '#2563eb',
  showLegend = false
}) {
  const demoData = [
    { name: 'Q1', value: 12 },
    { name: 'Q2', value: 18 },
    { name: 'Q3', value: 9 },
    { name: 'Q4', value: 22 },
  ];
  const chartData = Array.isArray(data) && data.length ? data : demoData;

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
