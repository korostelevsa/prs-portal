import React from "react";
import { classNames } from "../lib/utils";

export default function Card({ children, className = "" }) {
  return (
<>
<div className={classNames("rounded-2xl bg-white/70 backdrop-blur shadow-md ring-1 ring-slate-100", className)}>
      {children}
    </div>
</>
);
}

