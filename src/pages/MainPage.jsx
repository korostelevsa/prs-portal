import React from 'react';

export default function MainPage() {
  // Демо-данные (можно заменить на реальные)
  const categories = [
    { name: 'Сердечно-сосудистые', total: 12, avgPercentile: 62, risk: { high: 2, medium: 4, low: 6 } },
    { name: 'Метаболические',      total:  9, avgPercentile: 55, risk: { high: 1, medium: 3, low: 5 } },
    { name: 'Неврологические',     total:  7, avgPercentile: 48, risk: { high: 0, medium: 2, low: 5 } },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Баннер */}
        <section className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="text-xs text-slate-500">Посадочная страница</div>
          <h1 className="mt-1 text-3xl font-semibold">Polygenic Risk Scores (PRS)</h1>

          <h2 className="mt-6 text-xl font-semibold text-slate-700">
            Что люди получают в результате теста
          </h2>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="text-5xl font-bold leading-none">86%</div>
              <p className="text-slate-600">находят важную информацию о себе</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-5xl font-bold leading-none">14%</div>
              <p className="text-slate-600">выявляют серьёзный риск</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-5xl font-bold leading-none">75%</div>
              <p className="text-slate-600">рекомендуют программу друзьям</p>
            </div>
          </div>
        </section>

        {/* Категории */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Категории</h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="rounded-xl border bg-white p-6 shadow-sm flex justify-between">
                <div className="min-w-0">
                  <div className="text-lg font-medium">{cat.name}</div>

                  <div className="mt-2 text-slate-500">
                    всего состояний:{" "}
                    <span className="font-semibold text-slate-700">{cat.total}</span>
                  </div>

                  <div className="mt-1 text-slate-500">
                    ср. перцентиль:{" "}
                    <span className="font-semibold text-slate-700">{cat.avgPercentile}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 text-right">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="text-sm">высокий: <b>{cat.risk.high}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="text-sm">средний: <b>{cat.risk.medium}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
                    <span className="text-sm">низкий: <b>{cat.risk.low}</b></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
