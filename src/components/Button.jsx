import React from "react";
import { classNames } from "../lib/utils";

export default function Button({ children, onClick, variant = "solid", icon: Icon, className = "", disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
        variant === "solid" && "bg-slate-900 text-white hover:bg-slate-800",
        variant === "ghost" && "hover:bg-slate-100",
        variant === "outline" && "border border-slate-200 hover:bg-slate-50",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}>
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
