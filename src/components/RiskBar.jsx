import React from "react";
import { toneFromPercentile } from "../lib/utils";

export default function RiskBar({ percentile }) {
  const tone = toneFromPercentile(percentile);
  const grad = tone === "bad" ? "from-rose-500 to-rose-400" : tone === "warn" ? "from-amber-500 to-amber-400" : "from-emerald-500 to-emerald-400";
  return (
<>
<div className="w-full">
      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${grad}`} style={{ width: `${percentile}%` }} />
      </div>
      <div className="mt-1 text-xs text-slate-600">{percentile}%</div>
    </div>
</>
);
}

