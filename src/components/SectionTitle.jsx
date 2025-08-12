import React from "react";

export default function SectionTitle({ icon: Icon, title, actions }) {
  return (
<>
<div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-slate-500" />}
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{title}</h3>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
</>
);
}

