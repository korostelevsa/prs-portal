import React, { useMemo, useState } from 'react';
import { CalendarClock, PlusCircle } from 'lucide-react';

const fmtDT = (d) => new Date(d).toLocaleString('ru-RU', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' });

const init = [
  { id: 1, at: '2025-08-10T09:30:00Z', text: 'Эпизодические боли в груди при нагрузке, 5–10 минут.', severity: 3, tags: ['боль','нагрузка'] },
  { id: 2, at: '2025-08-01T20:10:00Z', text: 'Нарушения сна последние 2 недели.', severity: 2, tags: ['сон'] },
];

export default function SymptomsPage() {
  const [entries, setEntries] = useState(init);
  const [text, setText] = useState('');
  const [severity, setSeverity] = useState(2);
  const [tags, setTags] = useState('');

  const addEntry = () => {
    if (!text.trim()) return;
    const id = (entries[0]?.id || 0) + 1;
    const e = {
      id,
      at: new Date().toISOString(),
      text: text.trim(),
      severity: Number(severity),
      tags: tags.split(',').map(s => s.trim()).filter(Boolean),
    };
    setEntries([e, ...entries]);
    setText(''); setSeverity(2); setTags('');
  };

  const grouped = useMemo(() => {
    const days = {};
    entries.forEach(e => {
      const d = e.at.slice(0,10);
      (days[d] ||= []).push(e);
    });
    return Object.entries(days).sort((a,b)=> new Date(b[0]) - new Date(a[0]));
  }, [entries]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-slate-500">Раздел</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Симптомы</h1>
        <p className="mt-2 text-slate-600">
          Свободное описание жалоб и событий. Далее записи могут анализироваться ИИ (следующий этап).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 ring-1 ring-slate-200">
          <div className="text-lg font-semibold">Новая запись</div>
          <p className="mt-1 text-slate-600 text-sm">Опишите симптомы в свободной форме. Можно указать выраженность и теги.</p>
          <div className="mt-4 grid gap-3">
            <div>
              <label className="block text-xs text-slate-500">Симптомы (текст)</label>
              <textarea rows={5} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Напр., Периодические головные боли, усиливаются к вечеру…" value={text} onChange={(e)=>setText(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500">Выраженность: {severity}</label>
                <input type="range" min="1" max="5" value={severity} onChange={(e)=>setSeverity(e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Теги (через запятую)</label>
                <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="головная боль, бессонница" value={tags} onChange={(e)=>setTags(e.target.value)} />
              </div>
            </div>
            <div>
              <button type="button" onClick={addEntry} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                <PlusCircle size={16} /> Добавить
              </button>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Демо. Для медицинских решений обращайтесь к врачу.
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 ring-1 ring-slate-200">
          <div className="text-lg font-semibold">Лента симптомов</div>
          <div className="mt-4 space-y-4">
            {grouped.map(([d, list]) => (
              <div key={d} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="mb-2 inline-flex items-center gap-2 text-sm text-slate-600">
                  <CalendarClock size={16} /> {new Date(d).toLocaleDateString('ru-RU', { day:'2-digit', month:'long', year:'numeric' })}
                </div>
                <div className="space-y-3">
                  {list.sort((a,b)=> new Date(b.at)-new Date(a.at)).map(e => (
                    <div key={e.id} className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div>{fmtDT(e.at)}</div>
                        <div className={"rounded-full px-2 py-0.5 " + (e.severity>=4?'bg-red-100 text-red-800': e.severity>=3?'bg-yellow-100 text-yellow-800':'bg-emerald-100 text-emerald-800')}>
                          уровень {e.severity}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">{e.text}</div>
                      {e.tags?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {e.tags.map((t,i)=>(<span key={i} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 ring-1 ring-slate-200">#{t}</span>))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
