import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Upload as UploadIcon, Image as ImageIcon, FileText } from 'lucide-react';

const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
};

const sampleExams = [
  { date: '2025-07-14', type: 'УЗИ брюшной полости', facility: 'Клиника «Медлайт»', summary: 'Печень, желчный, поджелудочная — без визуальных особенностей. Рекомендаций нет.', attachments: [{ name: 'uzi_2025-07-14.pdf', kind: 'pdf' }] },
  { date: '2025-05-02', type: 'МРТ головного мозга', facility: 'Диагностический центр №3', summary: 'Без острых изменений. Минорные сосудистые изменения (для наблюдения).', attachments: [{ name: 'mri_2025-05-02.png', kind: 'image' }] },
  { date: '2025-01-20', type: 'КТ органов грудной клетки', facility: 'Городская клиническая больница', summary: 'Без очаговых и инфильтративных изменений.', attachments: [{ name: 'ct_2025-01-20.jpeg', kind: 'image' }] },
];

const Badge = ({ children }) => (
  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 ring-1 ring-slate-200">{children}</span>
);

export default function ExamsPage() {
  const [items, setItems] = useState(sampleExams);
  const [open, setOpen] = useState({});
  const byDate = useMemo(() => {
    const m = {};
    items.forEach((x) => (m[x.date] ||= []).push(x));
    return Object.entries(m).sort((a,b) => new Date(b[0]) - new Date(a[0]));
  }, [items]);

  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), type: '', facility: '', summary: '' });

  const addDemo = () => {
    if (!form.type) return;
    setItems([{ ...form, attachments: [] }, ...items]);
    setForm({ date: new Date().toISOString().slice(0,10), type: '', facility: '', summary: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-slate-500">Раздел</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Обследования</h1>
        <p className="mt-2 text-slate-600">
          Инструментальные исследования по датам (УЗИ, МРТ, КТ и др.). Можно прикладывать описания и снимки.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {byDate.map(([date, list]) => {
            const isOpen = !!open[date];
            return (
              <div key={date} className="rounded-2xl border bg-white ring-1 ring-slate-200">
                <button type="button" onClick={() => setOpen((s)=>({ ...s, [date]: !s[date] }))} className="w-full px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    <div className="font-semibold">{fmtDate(date)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{list.length} {list.length===1?'обследование':'обследования'}</Badge>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    {list.map((x, i) => (
                      <div key={i} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-medium">{x.type}</div>
                          <div className="text-xs text-slate-500">{x.facility}</div>
                        </div>
                        <div className="mt-2 text-sm text-slate-700">{x.summary}</div>
                        {x.attachments?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {x.attachments.map((a, j) => (
                              <span key={j} className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs ring-1 ring-slate-200">
                                {a.kind === 'image' ? <ImageIcon size={14} /> : <FileText size={14} />}
                                {a.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border bg-white p-6 ring-1 ring-slate-200">
          <div className="text-lg font-semibold">Добавить обследование</div>
          <p className="mt-1 text-slate-600 text-sm">Укажите базовые данные; загрузка — пока UI‑заглушка.</p>

          <div className="mt-4 grid gap-3">
            <div>
              <label className="block text-xs text-slate-500">Дата</label>
              <input type="date" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-slate-500">Тип</label>
              <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Напр., УЗИ брюшной полости"
                value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-slate-500">Учреждение</label>
              <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Клиника/Центр"
                value={form.facility} onChange={(e)=>setForm({...form, facility:e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-slate-500">Краткое описание</label>
              <textarea className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={4} placeholder="Основные выводы (для быстрого просмотра)"
                value={form.summary} onChange={(e)=>setForm({...form, summary:e.target.value})} />
            </div>

            <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center">
              <div className="font-medium">Прикрепить файлы (PDF/PNG/JPEG)</div>
              <p className="mt-1 text-slate-600 text-sm">Перетащите сюда файлы — прототип UI, без загрузки.</p>
              <div className="mt-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
                  <UploadIcon size={16} /> Выбрать файлы
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <button type="button" onClick={addDemo} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Добавить (демо)</button>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Демо‑раздел. Для мед. решений обязательно консультируйтесь со специалистом.
          </div>
        </div>
      </div>
    </div>
  );
}
