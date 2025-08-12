import React, { useMemo, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Chip from "../components/Chip";
import TableView from "./TableView";
import { CONDITIONS, CATEGORY_COLORS } from "../lib/constants";
import { toneFromPercentile } from "../lib/utils";
import { Menu, ArrowLeft } from "lucide-react";

// Вертикальная стопка чипов риска (справа)
function RiskStack({ counts, className = "" }) {
  return (
    <div className={"flex flex-col items-end gap-1 " + className}>
      <Chip tone="bad">Высокий: {counts.bad}</Chip>
      <Chip tone="warn">Средний: {counts.warn}</Chip>
      <Chip tone="good">Низкий: {counts.good}</Chip>
    </div>
  );
}

export default function Catalog() {
  const [selected, setSelected] = useState(null);

  // Группировка по категориям и подсчёт разбивки по уровням риска
  const categories = useMemo(() => {
    const map = new Map();
    for (const c of CONDITIONS) {
      const arr = map.get(c.category) || [];
      arr.push(c);
      map.set(c.category, arr);
    }
    return Array.from(map.entries()).map(([name, items]) => {
      const counts = { bad: 0, warn: 0, good: 0 };
      for (const it of items) {
        const tone = toneFromPercentile(it.percentile ?? 0);
        counts[tone] += 1;
      }
      const Icon = items[0]?.icon || Menu;
      const grad = CATEGORY_COLORS?.[name] || "from-slate-500/90 to-slate-400/70";
      const avg = Math.round(items.reduce((s, x) => s + (x.percentile ?? 0), 0) / (items.length || 1));
      return { name, items, counts, Icon, grad, avg };
    });
  }, []);

  if (selected) {
    const cat = categories.find((c) => c.name === selected);
    return (
      <div className="mx-auto max-w-7xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" icon={ArrowLeft} onClick={() => setSelected(null)}>Назад к категориям</Button>
        </div>

        <Card className="relative p-5">
          <div className="flex items-start gap-3 pr-28">
            <div className={`h-12 w-12 rounded-xl text-white grid place-items-center bg-gradient-to-br ${cat.grad}`}>
              <cat.Icon className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="text-xs text-slate-500">Категория</div>
              <div className="text-xl font-semibold">{cat.name}</div>
              <div className="mt-1 text-xs text-slate-500">Всего состояний: {cat.items.length}</div>
              <div className="text-xs text-slate-500">Ср. перцентиль: {cat.avg}%</div>
            </div>
          </div>
          <RiskStack counts={cat.counts} className="absolute right-5 top-5" />
        </Card>

        <TableView items={cat.items} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="text-2xl font-semibold">Категории</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(({ name, items, counts, Icon, grad, avg }) => (
          <Card key={name} className="relative p-5">
            <div className="flex items-start gap-3 pr-28">
              <div className={`h-12 w-12 rounded-xl text-white grid place-items-center bg-gradient-to-br ${grad}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-500">Категория</div>
                <div className="text-lg font-semibold">{name}</div>
                <div className="mt-1 text-xs text-slate-500">Всего состояний: {items.length}</div>
                <div className="text-xs text-slate-500">Ср. перцентиль: {avg}%</div>
              </div>
            </div>

            {/* Вертикальные чипы рисков фиксируются в правом верхнем углу карточки */}
            <RiskStack counts={counts} className="absolute right-5 top-5" />

            <div className="mt-4 flex justify-end">
              <Button onClick={() => setSelected(name)}>Открыть</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
