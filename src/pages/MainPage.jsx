import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Heart, Stethoscope, Activity, FlaskConical, ArrowRight, Shield, Pill, Utensils, Sparkles, Brain } from "lucide-react";
import LegacyMain from "./LegacyMain";

/**
 * Посадочная "в стиле Everlab" (без дословного копирования текстов).
 * Внизу рендерится старое содержимое через <LegacyMain />.
 */
export default function MainPage({ onGo }) {
  const howSteps = [
    { icon: Stethoscope, title: "Онбординг с врачом", text: "Короткая консультация, сбор анамнеза и факторов риска." },
    { icon: FlaskConical, title: "Комплексная диагностика", text: "Лабораторные панели, визуализация и функциональные тесты." },
    { icon: Brain,        title: "Результаты и инсайты",   text: "Понятные метрики и разбор приоритетов со специалистом." },
    { icon: Activity,     title: "План и ретест",          text: "Протоколы по образу жизни/терапии и повторная оценка." },
  ];

  const testSets = [
    { icon: Heart,    title: "Сердечно-сосудистые риски", text: "Липиды, воспаление, сосудистые маркеры, нагрузочные тесты." },
    { icon: Shield,   title: "Онкопрофилактика",          text: "Ранние предикторы и визуализация по показаниям." },
    { icon: Pill,     title: "Метаболическое здоровье",   text: "Глюкоза, инсулин, печень, щитовидная железа." },
    { icon: Utensils, title: "Образ жизни",               text: "Сон, активность, состав тела, питание." },
  ];

  const stats = [
    { value: "30%", label: "находят неожиданные маркеры" },
    { value: "8%",  label: "выявляют серьёзный кардиориск" },
    { value: "75%", label: "рекомендуют программу друзьям" },
  ];

  const go = (r) => { if (onGo) onGo(r); };

  return (
<>
<div className="mx-auto max-w-7xl">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-12 sm:pt-16 sm:pb-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Чекап здоровья, только умнее.
              </h1>
              <p className="mt-4 text-slate-600 text-base sm:text-lg">
                Своевременная диагностика распространённых рисков и персональные шаги по их снижению.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => go("catalog")} icon={ArrowRight}>Пройти чекап</Button>
                <Button variant="outline" onClick={() => go("table")} icon={Activity}>Показатели</Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-emerald-400/70 via-teal-400/60 to-cyan-400/70 shadow-lg ring-1 ring-white/50" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-xl bg-white/70 backdrop-blur-md shadow-md" />
              <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-emerald-200/60 backdrop-blur" />
            </div>
          </div>
        </div>
      </section>

      {/* Факт-баннер */}
      <section className="px-4 pb-10">
        <Card className="p-5 bg-emerald-50">
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-sm text-slate-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Почему это работает */}
      <section className="px-4 pb-4">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
            <h2 className="text-xl font-semibold">Новый подход к профилактике</h2>
            <p className="mt-2 text-sm text-white/80">
              Совмещаем комплексную диагностику и современные алгоритмы, чтобы находить ранние предикторы
              и снижать риск с возрастом, а не наращивать его.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> персонализация</span>
              <span className="inline-flex items-center gap-2"><Activity className="h-4 w-4" /> динамика и ретест</span>
              <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4" /> фокус на превенцию</span>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="text-base font-medium text-slate-900">Что входит</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc list-inside">
              <li>Лабораторные панели крови и воспаления</li>
              <li>Визуализация и кардиодиагностика по показаниям</li>
              <li>Оценка образа жизни и факторов риска</li>
              <li>Индивидуальные протоколы и сопровождение</li>
            </ul>
            <div className="mt-4">
              <Button variant="outline" onClick={() => go("catalog")}>Подробнее</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Как это работает</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {howSteps.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-5 h-full">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-medium">{title}</div>
              </div>
              <div className="mt-2 text-sm text-slate-600">{text}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Наборы тестов */}
      <section className="px-4 pb-8">
        <h2 className="text-xl font-semibold mb-4">Наборы тестов</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {testSets.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-medium">{title}</div>
              </div>
              <div className="mt-2 text-sm text-slate-600">{text}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Эксперты */}
      <section className="px-4 pb-10">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Наши эксперты</h2>
            <Button variant="outline" onClick={() => go("table")}>Смотреть показатели</Button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Д-р С. Лу",        role: "Превентивная медицина" },
              { name: "Д-р Р. Муталали",  role: "Кардиология" },
              { name: "Д-р С. Хант",      role: "Гинекология" },
              { name: "Д-р Л. Поттер",    role: "Терапия" },
            ].map((p) => (
              <div key={p.name} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-slate-600">{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="px-4 pb-12">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white p-6 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Готовы начать?</div>
            <div className="text-sm/6 text-white/90">Сделайте первый шаг к проактивному управлению здоровьем.</div>
          </div>
          <Button onClick={() => go("catalog")} icon={ArrowRight}>Начать сегодня</Button>
        </div>
      </section>

      {/* Старое содержимое ниже */}
      <section className="px-4 pb-16">
        <LegacyMain onGo={onGo} />
      </section>
    </div>
</div>
</div>
</div>
</div>
</>
);
}

