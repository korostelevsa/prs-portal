import React from "react";

export default function WhatYouGetBanner() {
  const stats = [
    { value: "30%", label: "узнают больше о себе" },
    { value: "25%", label: "выявляют серьёзный риск" },
    { value: "75%", label: "рекомендуют программу друзьям" },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-50/60 to-white/60 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="bg-white/80 dark:bg-slate-800/60 rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/20">
          <div className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Что вы получите</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
