import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { ArrowRight, Activity } from "lucide-react";
import LegacyMain from "./LegacyMain";

/**
 * Главная: баннер с картинкой-декором + отдельный блок с процентами ниже.
 */
export default function MainPage({ onGo }) {
  const stats = [
    { value: "22%", label: "узнают больше о себе" },
    { value: "25%", label: "выявляют серьёзный кардиориск" },
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
              {/* ЛЕВАЯ КОЛОНКА — заголовок и CTA */}
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

              {/* ПРАВАЯ КОЛОНКА — баннер с декором (квадрат с % удалён) */}
              <div className="relative">
                <div
                  className="aspect-[4/3] w-full rounded-3xl p-1"
                  style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(16,185,129,0.85) 45%, rgba(34,211,238,0.75))",
                  }}
                >
                  <div className="h-full w-full rounded-2xl overflow-hidden relative bg-white/6 backdrop-blur-md shadow-2xl ring-1 ring-white/10">
                    {/* Декоративные элементы и контент (опущены для компактности) */}

                    {/* Блок с процентом справа удалён по задаче */}

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* Новый отдельный блок: переносим процентную информацию в отдельный full-width ряд ниже */}
      <div className="w-full bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Card className="w-full p-6">
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
              {stats.map((s) => (
                <div key={s.label} className="flex-1 text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-red-600">{s.value}</div>
                  <div className="mt-1 text-sm text-slate-700">{s.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Подключаем устаревшую страницу (может использоваться в других роутингах) */}
      <LegacyMain />
    </>
  );
}
