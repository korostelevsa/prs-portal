import React from "react";
import { classNames } from "../lib/utils";

export default function Chip({ children, tone = "slate" }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "good" && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        tone === "warn" && "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        tone === "bad" && "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
        tone === "info" && "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
        tone === "slate" && "bg-slate-50 text-slate-700 ring-1 ring-slate-200"
      )}>
      {children}
    </span>
  );
}
