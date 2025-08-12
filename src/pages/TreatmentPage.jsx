import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Pill, Syringe, Droplet, Hospital, Upload as UploadIcon, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

const fmtDate = (iso) => new Date(iso).toLocaleDateString('ru-RU', { day:'2-digit', month:'long', year:'numeric' });

const sampleTreat = [
  // Активные лекарства
  { date: '2025-08-05', kind: 'med', name: 'Аторвастатин', dose: '20 мг', freq: '1 раз/день',
    start: '2025-07-01', end: null, status: 'active',
    outcome: { benefit: 'ЛПНП снизился c 4.2 до 3.1 ммоль/л', issues: 'Кратковременные миалгии — купированы снижением дозы' } },
  { date: '2025-07-25', kind: 'med', name: 'Витамин D3', dose: '2000 МЕ', freq: 'ежедневно',
    start: '2025-07-01', end: null, status: 'active',
    outcome: { benefit: 'Рост 25‑OH до 32 нг/мл', issues: '' } },

  // Завершённые вмешательства
  { date: '2025-06-20', kind: 'surgery', name: 'Лапароскопическая аппендэктомия', facility: 'ГКБ №7',
    status: 'completed', attachments: [{ name: 'discharge_2025-06-21.pdf', kind: 'pdf' }],
    outcome: { benefit: 'Клиническое улучшение, без осложнений', issues: '' } },

  { date: '2025-05-10', kind: 'transfusion', name: 'Переливание эритроцитарной массы (1 ЕД)', indication: 'Анемия Hb 78 г/л',
    status: 'completed', outcome: { benefit: 'Hb 105 г/л на выписке', issues: '' } },

  { date: '2025-04-15', kind: 'procedure', name: 'Физиотерапия (электрофорез)', course: '10 процедур',
    status: 'completed', outcome: { benefit: 'Уменьшение боли по ВАШ с 6 до 3', issues: '—' } },
];

const typeTitle = {
  med: 'Медикамент',
  surgery: 'Операция',
  transfusion: 'Переливание',
  procedure: 'Процедура',
};

const TypeIcon = ({ k }) => {
  const cls = "shrink-0 text-slate-500";
  if (k === 'med') return <Pill className={cls} size={18} />;
  if (k === 'transfusion') return <Droplet className={cls} size={18} />;
  if (k === 'surgery') return <Hospital className={cls} size={18} />;
  return <Syringe className={cls} size={18} />; // procedure
};

const Badge = ({ children, tone='slate' }) => {
  const map = {
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
    green: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    red: 'bg-red-100 text-red-800 ring-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  };
  return <span className={"rounded-full px-2.5 py-1 text-xs ring-1 " + (map[tone] || map.slate)}>{children}</span>;
};

export default function TreatmentPage() {
  const [items, setItems] = useState(sampleTreat);
  const [openDates, setOpenDates] = useState({});
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    return items.filter((x) => {
      if (type !== 'all' && x.kind !== type) return false;
      if (status !== 'all' && x.status !== status) return false;
      if (q && !(x.name || '').toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [items, type, status, q]);

  const activeMeds = useMemo(() => filtered.filter(x => x.kind==='med' && x.status==='active'), [filtered]);

  const byDate = useMemo(() => {
    const m = {};
    filtered.forEach((x) => (m[x.date] ||= []).push(x));
    return Object.entries(m).sort((a,b)=> new Date(b[0]) - new Date(a[0]));
  }, [filtered]);

  const toggleAll = (open) => {
    const next = {}; byDate.forEach(([d]) => next[d]=open); setOpenDates(next);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-slate-500">Раздел</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Лечение</h1>
        <p className="mt-2 text-slate-600">
          Всё, что назначалось и выполнялось: лекарства, операции, переливания, процедуры. Для каждого — эффект и возможные осложнения.
        </p>
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <select value={type} onChange={(e)=>setType(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="all">Все типы</option>
            <option value="med">Медикаменты</option>
            <option value="surgery">Операции</option>
            <option value="transfusion">Переливания</option>
            <option value="procedure">Процедуры</option>
          </select>
          <select value={status} onChange={(e)=>setStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="all">Любой статус</option>
            <option value="active">Активно</option>
            <option value="completed">Завершено</option>
            <option value="stopped">Прекращено</option>
          </select>
          <input value={q} onChange={(e)=>setQ(e.target.value)} className="w-64 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Поиск по названию…" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={()=>toggleAll(true)} className="text-sm text-slate-600 hover:underline">Развернуть всё</button>
          <button onClick={()=>toggleAll(false)} className="text-sm text-slate-600 hover:underline">Свернуть всё</button>
        </div>
      </div>

      {/* Активные назначения — быстрый обзор */}
      {activeMeds.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-gradient-to-br from-emerald-50 to-slate-50 p-6 ring-1 ring-emerald-200">
          <div className="mb-4 text-sm font-medium text-slate-700">Активные назначения</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeMeds.map((m, i) => (
              <div key={i} className="rounded-xl bg-white p-4 ring-1 ring-emerald-200 shadow-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Pill size={16} className="text-emerald-600" /> {m.name}
                </div>
                <div className="mt-1 text-sm text-slate-600">{m.dose} · {m.freq}</div>
                <div className="mt-1 text-xs text-slate-500">с {fmtDate(m.start)}{m.end?` по ${fmtDate(m.end)}`:''}</div>
                {m.outcome?.benefit && <div className="mt-2 text-xs text-emerald-700">Польза: {m.outcome.benefit}</div>}
                {m.outcome?.issues && m.outcome.issues !== '—' && <div className="mt-1 text-xs text-yellow-700">Побочные: {m.outcome.issues}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Лента по датам (аккордеоны) */}
      <div className="mt-6 space-y-3">
        {byDate.map(([date, list]) => {
          const total = list.length;
          const meds = list.filter(x=>x.kind==='med').length;
          const surg = list.filter(x=>x.kind==='surgery').length;
          const transf = list.filter(x=>x.kind==='transfusion').length;
          const proc = list.filter(x=>x.kind==='procedure').length;
          const helped = list.filter(x=>x.outcome?.benefit && x.outcome.benefit !== '—').length;
          const issues = list.filter(x=>x.outcome?.issues && x.outcome.issues !== '' && x.outcome.issues !== '—').length;
          const open = !!openDates[date];
          return (
            <div key={date} className="rounded-2xl border bg-white ring-1 ring-slate-200">
              <button type="button" onClick={()=>setOpenDates(s=>({...s,[date]:!s[date]}))} className="w-full px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  <div className="font-semibold">{fmtDate(date)}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-slate-600">всего: {total}</span>
                  <span className="text-slate-600">мед: {meds}</span>
                  <span className="text-slate-600">опер: {surg}</span>
                  <span className="text-slate-600">перел: {transf}</span>
                  <span className="text-slate-600">проц: {proc}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700"><CheckCircle2 size={14}/> польза: {helped}</span>
                  <span className="inline-flex items-center gap-1 text-yellow-700"><AlertTriangle size={14}/> осложн.: {issues}</span>
                </div>
              </button>
              {open && (
                <div className="px-4 pb-4 space-y-3">
                  {list.map((x, i)=> (
                    <div key={i} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 font-medium">
                          <TypeIcon k={x.kind} />
                          <span>{typeTitle[x.kind] || 'Запись'}</span>
                          <span className="text-slate-800">· {x.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge tone={x.status==='active'?'green': x.status==='stopped'?'yellow':'slate'}>
                            {x.status==='active'?'активно': x.status==='stopped'?'прекращено':'завершено'}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        {x.dose && <span className="mr-2">{x.dose}</span>}
                        {x.freq && <span className="mr-2">· {x.freq}</span>}
                        {x.course && <span className="mr-2">{x.course}</span>}
                        {x.indication && <span className="mr-2 text-slate-600">Показания: {x.indication}</span>}
                        {x.facility && <span className="mr-2 text-slate-600">Учреждение: {x.facility}</span>}
                      </div>
                      <div className="mt-2 grid gap-2 text-xs">
                        {x.outcome?.benefit && x.outcome.benefit !== '—' && <div className="text-emerald-700">Польза: {x.outcome.benefit}</div>}
                        {x.outcome?.issues && x.outcome.issues !== '' && x.outcome.issues !== '—' && <div className="text-yellow-700">Осложнения/побочные: {x.outcome.issues}</div>}
                      </div>
                      {x.attachments?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {x.attachments.map((a, j)=>(
                            <span key={j} className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs ring-1 ring-slate-200">
                              <FileText size={14} /> {a.name}
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

      {/* Добавить вручную (демо) */}
      <div className="mt-6 rounded-2xl border bg-white p-6 ring-1 ring-slate-200">
        <div className="text-lg font-semibold">Добавить запись (демо)</div>
        <p className="mt-1 text-slate-600 text-sm">Сохранение без бэкенда не реализовано — прототип формы.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-slate-500">Дата</label>
            <input type="date" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" defaultValue={new Date().toISOString().slice(0,10)} />
          </div>
          <div>
            <label className="block text-xs text-slate-500">Тип</label>
            <select className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option>Медикамент</option><option>Операция</option><option>Переливание</option><option>Процедура</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-500">Название</label>
            <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Напр., Аторвастатин 20 мг" />
          </div>
          <div>
            <label className="block text-xs text-slate-500">Доза/Курс</label>
            <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="20 мг 1 раз/день или 10 процедур" />
          </div>
          <div>
            <label className="block text-xs text-slate-500">Примечания</label>
            <input className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Показания, учреждение, и т.д." />
          </div>
          <div className="md:col-span-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center">
            <div className="font-medium">Прикрепить документы (PDF/PNG/JPEG)</div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
              <UploadIcon size={16} /> Выбрать файлы
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
