import React, { useMemo, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Chip from "../components/Chip";
import TableView from "./TableView";
import { CONDITIONS } from "../lib/constants";
import { Menu, ArrowLeft } from "lucide-react";

export default function Catalog() {
  const [selected, setSelected] = useState(null);
  const groups = useMemo(() => {
    const map = {};
    for (const c of CONDITIONS) {
      (map[c.category] = map[c.category] || []).push(c);
    }
    return map;
  }, []);

  const statsFor = (arr) => {
    const n = arr.length;
    const avg = Math.round(arr.reduce((s, x) => s + x.percentile, 0) / n);
    const high = arr.filter((x) => x.percentile >= 85).length;
    const ancestries = Array.from(new Set(arr.flatMap((x) => x.validatedAncestries))).slice(0, 5).join(", ");
    return { n, avg, high, ancestries };
  };

  if (selected) {
    const isAll = selected === '__ALL__';
    const items = isAll ? CONDITIONS : (groups[selected] || []);
    const s = statsFor(items);
    return (
      <div className="mx-auto max-w-7xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">{isAll ? 'Раздел' : 'Категория'}</div>
            <div className="text-xl font-semibold">{isAll ? 'Все риски' : selected}</div>
            <div className="text-sm text-slate-600 mt-1">
              Состояний: {s.n} · Ср. перцентиль: {s.avg}% · Высокий риск (≥85%): {s.high}
            </div>
          </div>
          <Button variant="outline" icon={ArrowLeft} onClick={() => setSelected(null)}>Назад к категориям</Button>
        </div>
        <TableView items={items} />
      </div>
    );
  }

  const entries = Object.entries(groups);
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {entries.map(([cat, arr]) => {
          const s = statsFor(arr);
          return (
            <Card key={cat} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-500">Категория</div>
                  <div className="text-lg font-semibold">{cat}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Chip tone="info">Состояний: {s.n}</Chip>
                    <Chip>Ср. перцентиль: {s.avg}%</Chip>
                    <Chip tone={s.high>0?'warn':'good'}>Высокий риск: {s.high}</Chip>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">Валидации: {s.ancestries || '—'}</div>
                </div>
                <div className="h-12 w-12 rounded-xl text-white grid place-items-center bg-gradient-to-br from-slate-500 to-slate-400">
                  <Menu className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex justify-end"><Button onClick={()=>setSelected(cat)}>Открыть</Button></div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
