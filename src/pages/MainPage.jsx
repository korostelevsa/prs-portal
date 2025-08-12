import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Chip from "../components/Chip";
import SectionTitle from "../components/SectionTitle";
import DistributionChart from "../components/charts/DistributionChart";
import { Activity, Stethoscope, BookOpen, PercentCircle, Info, Search, Menu, FlaskConical, Heart } from "lucide-react";

export default function MainPage({ onGo }) {
  const steps = [
    { t: "Сырьё", d: "WGS/генотипирование → VCF/PLINK" },
    { t: "QC", d: "Фильтры по call rate, MAF, палиндромы, выравнивание аллелей" },
    { t: "Счёт PRS", d: "Σ (генотип × вес из GWAS/PGS)" },
    { t: "Нормализация", d: "Перцентиль/SD внутри эталонной когорты" },
    { t: "Интерпретация", d: "Относительный и абсолютный риск, с учётом факторов" },
  ];
  const faq = [
    { q: "PRS = диагноз?", a: "Нет. Это статистическая оценка предрасположенности и относительного риска." },
    { q: "Почему у нас с братом разные PRS?", a: "Из‑за рекомбинации и независимого наследования полигенных вариантов." },
    { q: "Можно ли снизить риск?", a: "Да. Образ жизни и контроль факторов (АД, ЛПНП, масса тела, активность) меняют абсолютный риск." },
    { q: "Важна ли ancestry?", a: "Да. Модели чаще обучены на EUR; переносимость на другие группы ограничена и требует калибровки." },
  ];

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-6">
      {/* Баннер */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white p-6 shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Новая версия PRS портала</h2>
          <p className="mt-1 text-sm">Теперь с расширенной статистикой и улучшенной визуализацией</p>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Banner Icon"
          className="h-16 w-16"
        />
      </div>

      <Card className="p-8 bg-gradient-to-br from-slate-50 to-white">
        <div className="text-xs text-slate-500">Посадочная страница</div>
        <div className="mt-1 text-3xl font-semibold">Polygenic Risk Scores (PRS)</div>
        {/* В JSX комментарии пишутся так */}
        <div className="mt-2 text-slate-600 max-w-3xl">
          Полигенные рисковые баллы объединяют множество генетических вариантов (SNP) в одну метрику
          предрасположенности. Здесь вы найдёте объяснение, как считается PRS, как читать отчёт и где он полезен.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => onGo?.("table")} icon={Menu}>Открыть таблицу состояний</Button>
          <Button variant="outline" onClick={() => onGo?.("catalog")} icon={Search}>Перейти к категориям</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <SectionTitle title="Что такое PRS" icon={Info} />
          <div className="mt-3 text-sm text-slate-700">
            PRS — взвешенная сумма эффектов SNP (весов β или log(OR)), полученных из GWAS. Значение сравнивается с
            референсной когортой и переводится в перцентиль.
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Как считается" icon={FlaskConical} />
          <ul className="mt-3 list-disc list-inside text-sm text-slate-700">
            <li>Веса берутся из валидированных полигенных моделей (PGS Catalog/литература).</li>
            <li>Учитываются LD и метод построения (PRS‑CS/LDpred/CT и др.).</li>
            <li>Контроль QC и согласования аллелей обязателен.</li>
          </ul>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Как читать результат" icon={BookOpen} />
          <ul className="mt-3 list-disc list-inside text-sm text-slate-700">
            <li>Перцентиль и категория риска (низкий/средний/высокий).</li>
            <li>Относительный риск (например, OR по сравнению со средним).</li>
            <li>Абсолютный риск зависит от возраста, пола и факторов образа жизни.</li>
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <SectionTitle title="Распределение PRS в популяции" icon={PercentCircle} />
        <div className="mt-2 text-sm text-slate-700">
          Ваше положение на кривой показано красной линией. Большинство людей — около середины; «хвосты» соответствуют
          заметно выше/ниже среднего риску.
        </div>
        <div className="mt-3"><DistributionChart percentile={75} /></div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
          <Chip tone="good">Средний/ниже</Chip>
          <Chip tone="warn">Выше среднего</Chip>
          <Chip tone="bad">Высокий</Chip>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionTitle title="Относительный риск" icon={Activity} />
          <div className="mt-3 text-sm text-slate-700">
            Показывает, во сколько раз ваша вероятность исхода отличается от среднего уровня в популяции. Зависит от перцентиля PRS.
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Абсолютный риск" icon={Stethoscope} />
          <div className="mt-3 text-sm text-slate-700">
            Вероятность события за период (например, 10 лет) с учётом возраста, пола и модифицируемых факторов (курение, ЛПНП, ИМТ, активность).
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionTitle title="Где PRS полезен" icon={Heart} />
          <ul className="mt-3 list-disc list-inside text-sm text-slate-700">
            <li>Стратификация профилактики (например, CAD, T2D, CRC).</li>
            <li>Ранжирование интенсивности наблюдения и скрининга.</li>
            <li>Комбинация с клиническими шкалами для персонализации.</li>
          </ul>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Ограничения" icon={Info} />
          <ul className="mt-3 list-disc list-inside text-sm text-slate-700">
            <li>Не диагностирует заболевание.</li>
            <li>Переносимость между этничностями может снижаться.</li>
            <li>Требуется корректная калибровка абсолютного риска.</li>
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <SectionTitle title="Конвейер анализа данных" icon={FlaskConical} />
        <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
          {steps.map((s, i) => (
            <div key={i} className="rounded-xl p-3 ring-1 ring-slate-200 bg-white/60">
              <div className="text-xs text-slate-500">Шаг {i + 1}</div>
              <div className="font-medium">{s.t}</div>
              <div className="text-slate-600 mt-1">{s.d}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionTitle title="Частые вопросы" icon={BookOpen} />
          <div className="mt-3 space-y-3">
            {faq.map((f, i) => (
              <div key={i} className="text-sm">
                <div className="font-medium">{f.q}</div>
                <div className="text-slate-700">{f.a}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Ссылки и источники" icon={BookOpen} />
          <ul className="mt-3 list-disc list-inside text-sm text-slate-700">
            <li>PGS Catalog — реестр полигенных моделей.</li>
            <li>GWAS Catalog — ассоциации SNP‑фенотип.</li>
            <li>UK Biobank — эталонная ресурсная когорта.</li>
          </ul>
          <div className="mt-3 text-xs text-slate-500">
            Материал носит образовательный характер и не заменяет консультацию врача.
          </div>
        </Card>
      </div>
    </div>
  );
}
