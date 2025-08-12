import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ChevronDown, ChevronRight } from 'lucide-react';

const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
};

const withinRange = (val, ref) => {
  if (!ref) return 'normal';
  if (typeof ref.low === 'number' && val < ref.low) return 'low';
  if (typeof ref.high === 'number' && val > ref.high) return 'high';
  return 'normal';
};

const byNameKey = (name) => name.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '_');

const sampleLabs = [
  { date: '2025-08-01', kind: 'Кровь', panel: 'Биохимия',
    results: [
      { name: 'Глюкоза', value: 5.7, unit: 'ммоль/л', ref: { low: 3.9, high: 5.5 } },
      { name: 'ЛПНП (LDL)', value: 4.2, unit: 'ммоль/л', ref: { high: 3.0 } },
      { name: 'ЛПВП (HDL)', value: 1.3, unit: 'ммоль/л', ref: { low: 1.0 } },
      { name: 'Витамин D (25-OH)', value: 22, unit: 'нг/мл', ref: { low: 30, high: 100 } },
    ]},
  { date: '2025-06-12', kind: 'Кровь', panel: 'Общий анализ',
    results: [
      { name: 'Гемоглобин', value: 135, unit: 'г/л', ref: { low: 130, high: 170 } },
      { name: 'Эритроциты', value: 4.7, unit: '×10^12/л', ref: { low: 4.2, high: 5.6 } },
      { name: 'Лейкоциты', value: 7.2, unit: '×10^9/л', ref: { low: 4.0, high: 9.0 } },
    ]},
  { date: '2025-04-03', kind: 'Моча', panel: 'Общий анализ мочи',
    results: [
      { name: 'Белок (моча)', value: 0.1, unit: 'г/л', ref: { high: 0.15 } },
      { name: 'Глюкоза (моча)', value: 0, unit: 'ммоль/л', ref: { high: 0 } },
    ]},
  { date: '2025-02-18', kind: 'Кровь', panel: 'Биохимия',
    results: [
      { name: 'Глюкоза', value: 5.1, unit: 'ммоль/л', ref: { low: 3.9, high: 5.5 } },
      { name: 'ЛПНП (LDL)', value: 3.6, unit: 'ммоль/л', ref: { high: 3.0 } },
      { name: 'Витамин D (25-OH)', value: 28, unit: 'нг/мл', ref: { low: 30, high: 100 } },
    ]},
];

const buildTrends = (labs) => {
  const map = {};
  labs.forEach((entry) => {
    entry.results.forEach((r) => {
      const k = byNameKey(r.name);
      if (!map[k]) map[k] = { name: r.name, unit: r.unit, points: [] };
      map[k].points.push({ date: entry.date, value: r.value });
    });
  });
  Object.values(map).forEach((m) => {
    m.points.sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  return map;
};

const Spark = ({ data }) => (
  <div className="h-12 w-full">
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" hide />
        <YAxis hide />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default function LabsPage() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('summary');
  const [kind, setKind] = useState('all');
  const [openDates, setOpenDates] = useState({});

  const filteredLabs = useMemo(() => {
    if (kind === 'all') return sampleLabs;
    return sampleLabs.filter((l) => l.kind === kind);
  }, [kind]);

  const trends = useMemo(() => buildTrends(filteredLabs), [filteredLabs]);

  const allRows = useMemo(() => {
    const rows = [];
    filteredLabs.forEach((day) => {
      day.results.forEach((r) => {
        if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return;
        const status =
          !r.ref ? 'normal' :
          (typeof r.ref.high === 'number' && r.value > r.ref.high) ? 'high' :
          (typeof r.ref.low === 'number' && r.value < r.ref.low) ? 'low' : 'normal';
        rows.push({ date: day.date, kind: day.kind, panel: day.panel, ...r, status });
      });
    });
    rows.sort((a, b) => new Date(b.date) - new Date(a.date));
    return rows;
  }, [filteredLabs, query]);

  const rowsByDate = useMemo(() => {
    const map = {};
    allRows.forEach((r) => { (map[r.date] ||= []).push(r); });
    Object.keys(map).forEach((d) => {
      map[d].sort((a, b) => {
        const w = (s) => (s === 'high' ? 0 : s === 'low' ? 1 : 2);
        const dw = w(a.status) - w(b.status);
        if (dw !== 0) return dw;
        return a.name.localeCompare(b.name, 'ru');
      });
    });
    return Object.entries(map).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [allRows]);

  const toggleDate = (d) => setOpenDates((s) => ({ ...s, [d]: !s[d] }));
  const setAll = (open) => {
    const next = {}; rowsByDate.forEach(([d]) => next[d] = open);
    setOpenDates(next);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-slate-500">Раздел</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Анализы</h1>
        <p className="mt-2 text-slate-600">
          Хронология лабораторных результатов (кровь/моча/слюна). Фильтр по типам, поиск, и свёртывающиеся блоки по датам.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex rounded-lg bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          {['summary','biomarkers','upload'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={'px-4 py-2 text-sm ' + (tab === t ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50')}>
              {t === 'summary' ? 'Сводка' : t === 'biomarkers' ? 'Показатели' : 'Загрузка'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setAll(true)} className="text-sm text-slate-600 hover:underline">Развернуть всё</button>
          <button onClick={() => setAll(false)} className="text-sm text-slate-600 hover:underline">Свернуть всё</button>
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="all">Все типы</option>
            <option value="Кровь">Кровь</option>
            <option value="Моча">Моча</option>
            <option value="Слюна">Слюна</option>
          </select>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск показателя…" className="w-64 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
        </div>
      </div>

      {tab === 'summary' && (
        <div className="mt-6 grid grid-cols-1 gap-6">
          <div className="rounded-2xl border bg-gradient-to-br from-sky-50 to-slate-50 p-6 ring-1 ring-slate-200">
            <div className="mb-4 text-sm font-medium text-slate-600">Ключевые показатели и тренды</div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.values(buildTrends(filteredLabs)).slice(0, 6).map((t) => {
                const last = t.points[t.points.length - 1]?.value ?? '—';
                return (
                  <div key={t.name} className="rounded-xl bg-white p-4 ring-1 ring-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-sm text-slate-500">{t.unit || ''}</div>
                    </div>
                    <div className="mt-2 text-2xl font-semibold">{last}</div>
                    <div className="mt-2"><Spark data={t.points} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'biomarkers' && (
        <div className="mt-6 space-y-3">
          {rowsByDate.map(([date, items]) => {
            const total = items.length;
            const high = items.filter((r) => r.status === 'high').length;
            const low  = items.filter((r) => r.status === 'low').length;
            const normal = total - high - low;
            const open = !!openDates[date];
            return (
              <div key={date} className="rounded-2xl border bg-white ring-1 ring-slate-200">
                <button type="button" onClick={() => toggleDate(date)} className="w-full px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    <div className="font-semibold">{fmtDate(date)}</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-600">всего: {total}</span>
                    <span className="text-emerald-700">в норме: {normal}</span>
                    <span className="text-red-700">выше: {high}</span>
                    <span className="text-yellow-700">ниже: {low}</span>
                  </div>
                </button>
                {open && (
                  <div className="px-4 pb-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-500">
                            <th className="py-2 pr-4">Показатель</th>
                            <th className="py-2 pr-4">Значение</th>
                            <th className="py-2 pr-4">Реф. интервал</th>
                            <th className="py-2 pr-4">Статус</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {items.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="py-2 pr-4">{r.name}</td>
                              <td className="py-2 pr-4">{r.value} {r.unit}</td>
                              <td className="py-2 pr-4">
                                {r.ref ? <>{typeof r.ref.low === 'number' ? r.ref.low : '—'} — {typeof r.ref.high === 'number' ? r.ref.high : '—'} {r.unit}</> : <span className="text-slate-400">нет данных</span>}
                              </td>
                              <td className="py-2 pr-4">
                                <span className={"rounded-full px-2.5 py-1 text-xs " + (r.status==='high'?'bg-red-100 text-red-800 ring-1 ring-red-200': r.status==='low'?'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200':'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200')}>
                                  {r.status==='high'?'выше':r.status==='low'?'ниже':'в норме'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'upload' && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 text-center">
            <div className="text-lg font-semibold">Загрузите результаты (PDF/PNG/JPEG)</div>
            <p className="mt-2 text-slate-600 text-sm">
              Перетащите сюда файлы с лабораторными результатами. Распознавание и парсинг — в следующей итерации.
            </p>
            <div className="mt-4">
              <label className="inline-block cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                Выбрать файлы
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple className="hidden" />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 ring-1 ring-slate-200">
            <div className="text-lg font-semibold">Добавить вручную</div>
            <p className="mt-1 text-slate-600 text-sm">Укажите дату, показатель, значение и единицы измерения.</p>
            <form className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-500">Дата</label>
                <input type="date" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" defaultValue={new Date().toISOString().slice(0,10)} />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Показатель</label>
                <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Напр., Глюкоза" />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Значение</label>
                <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Напр., 5.2" />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Ед. изм.</label>
                <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="ммоль/л" />
              </div>
              <div className="sm:col-span-2">
                <button type="button" className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  Добавить (демо)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
