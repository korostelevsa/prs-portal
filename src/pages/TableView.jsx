// src/pages/TableView.jsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, LineChart, Line
} from "recharts";
import {
  Activity, BookOpen, FileDown, FlaskConical, Info, ListChecks, PercentCircle, Stethoscope, Utensils, ChevronRight
} from "lucide-react";

import Card from "../components/Card";
import Button from "../components/Button";
import Chip from "../components/Chip";
import SectionTitle from "../components/SectionTitle";
import RiskBar from "../components/RiskBar";
import RiskCurve from "../components/charts/RiskCurve";

import { CONDITIONS, CATEGORY_COLORS } from "../lib/constants";
import {
  toneFromPercentile,
  labelFromPercentile,
  buildAbsoluteRiskCurve,
} from "../lib/utils";

// ---------------- Small charts used here (local variant for Distribution) ----
const MiniDistribution = ({ percentile = 50 }) => {
  const data = new Array(101).fill(0).map((_, i) => {
    const x = i * 2; const mu = 100; const sigma = 20;
    const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    return { x, y };
  });
  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="x" tickFormatter={(v)=>`${v}%`} tick={{fontSize: 12}} />
        <YAxis hide domain={[0,"auto"]} />
        <Tooltip formatter={(v)=>v.toFixed(4)} labelFormatter={(l)=>`Перцентиль ${l}%`} />
        <Line type="monotone" dataKey="y" strokeWidth={2} dot={false}/>
        <ReferenceLine x={percentile} stroke="#ef4444" strokeDasharray="4 4" />
      </LineChart>
    </ResponsiveContainer>
  );
};

// ---------------- Check-list + diet plan -------------------------------------
function ActionsChecklist({ onExport }) {
  const [items, setItems] = useState([
    { id: 1, text: "Измерить АД в покое (3 дня)", done: false },
    { id: 2, text: "Сдать липидный профиль и HbA1c", done: false },
    { id: 3, text: "Ходьба ≥30 мин/день (5–6 дней/нед)", done: true },
    { id: 4, text: "Записаться к врачу для обсуждения плана", done: false },
  ]);
  const toggle = (id) => setItems(prev => prev.map(it => it.id === id ? { ...it, done: !it.done } : it));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">Отмечайте выполненные пункты — прогресс сохранится.</div>
        <Button variant="outline" icon={FileDown} onClick={onExport}>Экспорт PDF</Button>
      </div>
      <div className="space-y-2">
        {items.map(it => (
          <label key={it.id} className={`flex items-center gap-3 rounded-xl p-3 ring-1 ring-slate-200 ${it.done ? "bg-emerald-50" : "bg-white"}`}>
            <input type="checkbox" checked={it.done} onChange={()=>toggle(it.id)} className="h-5 w-5 rounded"/>
            <span className={`text-sm ${it.done ? "line-through text-slate-500" : ""}`}>{it.text}</span>
          </label>
        ))}
      </div>
      <div className="text-xs text-slate-500">Информация носит образовательный характер и не заменяет консультацию врача.</div>
    </div>
  );
}

function DietPlan() {
  const swaps = [
    { from: "Майонез", to: "Натуральный йогурт" },
    { from: "Колбасы", to: "Бобовые/птица" },
    { from: "Белый рис", to: "Бурый/дикий рис" },
    { from: "Сладкая выпечка", to: "Орехи/фрукты" },
  ];
  const week = [
    { day: "Пн", focus: "Овощи ≥400 г/сут" },
    { day: "Вт", focus: "Рыба 2×/нед" },
    { day: "Ср", focus: "Натрий <2 г/сут" },
    { day: "Чт", focus: "Зерновые цельные" },
    { day: "Пт", focus: "Ходьба 30–45 мин" },
    { day: "Сб", focus: "Орехи/бобовые" },
    { day: "Вс", focus: "Сон 7–8 ч" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <SectionTitle icon={Utensils} title="Быстрые замены (свайпы)" />
        <ul className="mt-3 space-y-2 text-sm">
          {swaps.map((s, i) => (
            <li key={i} className="flex items-center justify-between rounded-xl p-2 ring-1 ring-slate-200">
              <span>{s.from}</span>
              <ChevronRight className="h-4 w-4 text-slate-400"/>
              <span className="font-medium">{s.to}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-4">
        <SectionTitle icon={Activity} title="Фокус недели (4-недельный цикл)" />
        <div className="mt-3 grid grid-cols-7 gap-2 text-sm">
          {week.map((w, i) => (
            <div key={i} className="rounded-xl p-3 ring-1 ring-slate-200 bg-white/60">
              <div className="text-xs text-slate-500">{w.day}</div>
              <div className="font-medium">{w.focus}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <SectionTitle title="Кратко: WGS / GWAS / UK Biobank" icon={BookOpen} />
        <ul className="mt-2 text-sm text-slate-700 list-disc list-inside">
          <li><strong>WGS (30×):</strong> полногеномное покрытие, эталон для частот и LD.</li>
          <li><strong>GWAS:</strong> β/log(OR), ковариаты: пол, возраст, PC, batch.</li>
          <li><strong>UK Biobank:</strong> ~500k участников; генотипирование+импутация; богатые фенотипы.</li>
        </ul>
      </Card>
    </div>
  );
}

// ---------------- Info / Stats / Study panels -------------------------------
function DiseaseInfoPanel({ condition }) {
  const map = {
    CAD: {
      title: "О коронарной болезни сердца",
      summary: "CAD — поражение коронарных артерий, повышающее риск инфаркта. PRS отражает суммарный эффект многих вариантов ДНК, но не является диагнозом.",
      bullets: [
        "Факторы: возраст, пол, семейный анамнез, курение, АГ, дислипидемия, диабет, ожирение, низкая активность.",
        "Симптомы: загрудинная боль при нагрузке, одышка, непереносимость нагрузок.",
        "Скрининг: контроль АД, липидов, глюкозы/HbA1c; оценка 10-летнего клинического риска.",
      ],
    },
    T2D: {
      title: "О сахарном диабете 2 типа",
      summary: "T2D — метаболическое заболевание с инсулинорезистентностью. PRS оценивает генетическую предрасположенность.",
      bullets: [
        "Факторы: ИМТ, висцеральное ожирение, малоподвижность, семейный анамнез, гестационный диабет, возраст.",
        "Скрининг: глюкоза натощак, HbA1c, при факторах риска — чаще.",
        "Профилактика: снижение веса 5–10%, активность ≥150 мин/нед, рацион с высоким содержанием клетчатки.",
      ],
    },
    CRC: {
      title: "О колоректальном раке",
      summary: "CRC — злокачественная опухоль толстой/прямой кишки. PRS отражает фоновые генетические факторы популяционного риска.",
      bullets: [
        "Факторы: возраст, семейный анамнез, красное/переработанное мясо, мало клетчатки, ожирение, алкоголь, курение.",
        "Скрининг: колоноскопия/ФИТ по возрасту и риску.",
        "Симптомы: кровь в стуле, изменение стула, анемия, потеря веса — повод к обследованию.",
      ],
    },
  };
  const info = map[condition.id] || { title: "О заболевании", summary: "", bullets: [] };
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <SectionTitle icon={Info} title={info.title} />
        <p className="mt-2 text-sm text-slate-700">{info.summary}</p>
        <ul className="mt-3 text-sm text-slate-700 list-disc list-inside">{info.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
        <div className="mt-2 text-xs text-slate-500">Образовательный материал. Не заменяет консультацию врача.</div>
      </Card>
    </div>
  );
}

function StatsPanel({ condition }) {
  const snpTotal = condition.id === 'CAD' ? 313000 : condition.id === 'T2D' ? 150000 : 180000;
  const snpCovered = Math.round(snpTotal * condition.qc.snpCoverage);
  const snpMissing = snpTotal - snpCovered;
  const gwas = {
    studies: condition.id === 'CAD' ? 12 : condition.id === 'T2D' ? 10 : 8,
    trainN: condition.id === 'CAD' ? 520000 : condition.id === 'T2D' ? 680000 : 430000,
    auc: condition.id === 'CAD' ? 0.63 : condition.id === 'T2D' ? 0.61 : 0.58,
  };
  const coverageData = [ { name: 'Покрыты', value: snpCovered }, { name: 'Пропуски', value: snpMissing } ];
  const topVariants = Array.from({ length: 8 }).map((_, i) => {
    const rs = 100000 + i * 7 + (condition.id === 'CAD' ? 0 : condition.id === 'T2D' ? 1 : 2);
    const alleles = ['A', 'T', 'G', 'C']; const ea = alleles[(i + 1) % 4];
    const beta = Number((0.02 + i * 0.005).toFixed(3)); const maf = Number((0.42 - i * 0.03).toFixed(2));
    const contrib = Number(((9 - i) * 3.7).toFixed(1)); return { rsid: `rs${rs}`, ea, beta, maf, contrib };
  });
  const exportCSV = () => {
    try {
      const header = 'rsid,EA,beta,MAF,contrib(%)\n';
      const rows = topVariants.map(v => `${v.rsid},${v.ea},${v.beta},${v.maf},${v.contrib}`).join('\n');
      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = `${condition.id}_top_variants_demo.csv`; a.click(); URL.revokeObjectURL(url);
    } catch (e) { alert('Экспорт недоступен в демо-среде'); }
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <SectionTitle title="Сводка GWAS/PGS (демо)" icon={PercentCircle} />
          <ul className="mt-2 text-sm text-slate-700 list-disc list-inside">
            <li>PGS: {condition.model.pgsId} · v{condition.model.version} · {condition.model.genome}</li>
            <li>OR per SD: {condition.orPerSd?.toFixed ? condition.orPerSd.toFixed(2) : condition.orPerSd}</li>
            <li>GWAS исследований: {gwas.studies} · Обучающая выборка ≈ {gwas.trainN.toLocaleString()}</li>
            <li>Дискриминация (AUC, демо): {Math.round(gwas.auc * 1000) / 1000}</li>
            <li>Размер модели: ≈ {snpTotal.toLocaleString()} SNP · покрыто: {snpCovered.toLocaleString()} ({Math.round(condition.qc.snpCoverage * 100)}%)</li>
            <li>Валидации по ancestry: {condition.validatedAncestries.join(', ')}</li>
          </ul>
        </Card>
        <Card className="p-4 md:col-span-2">
          <SectionTitle title="Покрытие модели (демо)" icon={PercentCircle} />
          <div className="mt-3">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={coverageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" strokeWidth={1} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-slate-500">Демо-покрытие по оценке параметров, не для клинического использования.</div>
        </Card>
      </div>
      <Card className="p-4">
        <SectionTitle title="Топ-варианты по вкладу в PRS (демо)" icon={ListChecks} actions={<Button variant="outline" icon={FileDown} onClick={exportCSV}>Экспорт CSV</Button>} />
        <div className="mt-3 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="text-left py-2 pr-2">rsID</th>
                <th className="text-left py-2 pr-2">Эфф. аллель</th>
                <th className="text-left py-2 pr-2">Вес (β)</th>
                <th className="text-left py-2 pr-2">MAF</th>
                <th className="text-left py-2 pr-2">Вклад, %</th>
              </tr>
            </thead>
            <tbody>
              {topVariants.map(v => (
                <tr key={v.rsid} className="border-t border-slate-100">
                  <td className="py-2 pr-2 font-mono">{v.rsid}</td>
                  <td className="py-2 pr-2">{v.ea}</td>
                  <td className="py-2 pr-2">{v.beta}</td>
                  <td className="py-2 pr-2">{v.maf}</td>
                  <td className="py-2 pr-2">{v.contrib}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StudyPanel({ condition }) {
  const study = condition.id === 'CAD'
    ? { name: 'CAD-PRS v1.3.2', cohorts: ['UKB', 'CARDIoGRAM'], trainingN: 520000, ancestries: ['EUR', 'EAS'], build: 'GRCh38', snps: 313000, method: 'Clumping+Thresholding + shrinkage', source: 'PGS Catalog PGS00XXXX', external: ['BioBank Japan (EAS)', 'Multi-ethnic replication'] }
    : condition.id === 'T2D'
    ? { name: 'T2D-PRS v2.1.0', cohorts: ['UKB', 'DIAGRAM'], trainingN: 680000, ancestries: ['EUR', 'SAS', 'AMR'], build: 'GRCh38', snps: 150000, method: 'Bayesian (LDpred-like)', source: 'PGS Catalog PGS00YYYY', external: ['HCHS/SoL (AMR)'] }
    : { name: 'CRC-PRS v0.9.7', cohorts: ['UKB', 'GECCO'], trainingN: 430000, ancestries: ['EUR', 'AFR', 'EAS'], build: 'GRCh38', snps: 180000, method: 'PRS-CSx (multi-ancestry)', source: 'PGS Catalog PGS00ZZZZ', external: ['COGENT (AFR)'] };

  const passport = {
    phenotype: condition.name, pgs_id: condition.model.pgsId, version: condition.model.version, genome_build: condition.model.genome,
    training_cohorts: study.cohorts, training_sample_size: study.trainingN, training_ancestries: study.ancestries,
    model_size_snps: study.snps, method: study.method, source: study.source, external_validations: study.external,
    qc: { call_rate: condition.qc.callRate, snp_coverage: condition.qc.snpCoverage, imputed: condition.qc.imputed, ancestry_detected: condition.qc.ancestry },
    calibration: { absolute_risk_reference: 'Registry-based incidence by age/sex', decile_calibration_available: true },
    limitations: ['PRS не является диагнозом','Переносимость между этничностями ограничена','Абсолютный риск зависит от клинических факторов']
  };

  const exportJSON = () => {
    try {
      const blob = new Blob([JSON.stringify(passport, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = `${condition.id}_study_passport_demo.json`; a.click(); URL.revokeObjectURL(url);
    } catch (e) { alert('Экспорт недоступен в демо-среде'); }
  };

  const rows = [
    ["Название модели", study.name],
    ["PGS ID", condition.model.pgsId],
    ["Версия", condition.model.version],
    ["Сборка генома", condition.model.genome],
    ["Размер модели (SNP)", study.snps.toLocaleString()],
    ["Метод", study.method],
    ["Тренировочные когорты", study.cohorts.join(', ')],
    ["Обучающая выборка", study.trainingN.toLocaleString()],
    ["Атласы/источники", study.source],
    ["Внешние валидации", study.external.join(', ')],
  ];

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <SectionTitle title="Об исследовании (паспорт модели)" icon={BookOpen}
          actions={<div className="flex gap-2">
            <Button variant="outline" icon={BookOpen} onClick={()=>alert('Откройте docs: «Об исследовании PRS — методология, WGS, GWAS, UK Biobank».')}>Документ</Button>
            <Button variant="outline" icon={FileDown} onClick={exportJSON}>Экспорт JSON</Button>
          </div>} />
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-start gap-3">
              <div className="w-44 shrink-0 text-slate-500">{k}</div>
              <div className="font-medium text-slate-800">{v}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <SectionTitle title="QC и калибровка (кратко)" icon={FlaskConical} />
        <ul className="mt-2 text-sm text-slate-700 list-disc list-inside">
          <li>QC: call rate {Math.round(condition.qc.callRate*100)}%, SNP coverage {Math.round(condition.qc.snpCoverage*100)}%, imputed: {String(condition.qc.imputed)}</li>
          <li>Выравнивание аллелей, исключение палиндромных, нормализация Z по ancestry</li>
          <li>Калибровка абсолютного риска по данным инцидентности (возраст/пол)</li>
        </ul>
      </Card>
    </div>
  );
}

// ---------------- Inline detail (tabs) --------------------------------------
function InlineDetail({ condition }) {
  const [tab, setTab] = useState('actions');
  const [lifestyle, setLifestyle] = useState({ smoking: true, ldlImproved: false, bmiDelta: 0, activity: false });
  const base = { base40: 0.02, k: 0.07 };
  const points = useMemo(() => buildAbsoluteRiskCurve({ base, prsZ: condition.prsZ, lifestyle }), [condition, lifestyle]);
  const improved = useMemo(
    () => buildAbsoluteRiskCurve({ base, prsZ: condition.prsZ, lifestyle: { ...lifestyle, smoking: false, ldlImproved: true, activity: true, bmiDelta: -5 } }),
    [condition, lifestyle]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-xs text-slate-500">Категория риска</div>
          <div className="mt-1 text-2xl font-bold">{labelFromPercentile(condition.percentile)}</div>
          <div className="mt-2 text-sm text-slate-600">Перцентиль {condition.percentile} · OR/инд: {condition.individualOR.toFixed(2)}</div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Card className="p-3 text-center"><div className="text-xs text-slate-500">10-летний риск</div><div className="text-xl font-bold">{(condition.tenYearRisk*100).toFixed(1)}%</div></Card>
            <Card className="p-3 text-center"><div className="text-xs text-slate-500">Пожизненный риск</div><div className="text-xl font-bold">{(condition.lifetimeRisk*100).toFixed(1)}%</div></Card>
          </div>
        </Card>
        <Card className="p-5 md:col-span-2">
          <SectionTitle icon={PercentCircle} title="Абсолютный риск по возрасту (демо)" />
          <div className="mt-3"><RiskCurve points={points} compare={improved} /></div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
            <Chip tone="bad">Текущий сценарий</Chip>
            <Chip tone="good">С улучшениями (без курения, ЛПНП −30%, активность, −5 BMI)</Chip>
          </div>
        </Card>
      </div>

      <Card className="p-2">
        <div className="flex items-center gap-2 p-2">
          <button onClick={()=>setTab('actions')} className={`px-4 py-2 rounded-xl text-sm ${tab==='actions'?'bg-slate-900 text-white':'hover:bg-slate-100'}`}>Действия</button>
          <button onClick={()=>setTab('diet')} className={`px-4 py-2 rounded-xl text-sm ${tab==='diet'?'bg-slate-900 text-white':'hover:bg-slate-100'}`}>Питание</button>
          <button onClick={()=>setTab('stats')} className={`px-4 py-2 rounded-xl text-sm ${tab==='stats'?'bg-slate-900 text-white':'hover:bg-slate-100'}`}>Статистика</button>
          <button onClick={()=>setTab('info')} className={`px-4 py-2 rounded-xl text-sm ${tab==='info'?'bg-slate-900 text-white':'hover:bg-slate-100'}`}>О заболевании</button>
          <button onClick={()=>setTab('study')} className={`px-4 py-2 rounded-xl text-sm ${tab==='study'?'bg-slate-900 text-white':'hover:bg-slate-100'}`}>Об исследовании</button>
        </div>
        <div className="p-4">
          <AnimatePresence mode="wait">
            {tab === 'actions' && (
              <motion.div key="ac" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 md:col-span-1">
                    <SectionTitle title="Факторы риска (что-если)" icon={Stethoscope} />
                    <div className="mt-2 space-y-3 text-sm">
                      <label className="flex items-center gap-3"><input type="checkbox" checked={lifestyle.smoking} onChange={()=>setLifestyle(v=>({...v, smoking: !v.smoking}))}/> Курение</label>
                      <label className="flex items-center gap-3"><input type="checkbox" checked={lifestyle.ldlImproved} onChange={()=>setLifestyle(v=>({...v, ldlImproved: !v.ldlImproved}))}/> ЛПНП улучшен (−30%)</label>
                      <label className="flex items-center gap-3"><input type="checkbox" checked={lifestyle.activity} onChange={()=>setLifestyle(v=>({...v, activity: !v.activity}))}/> Активность ≥150 мин/нед</label>
                      <div className="flex items-center gap-3"><span>ΔBMI</span>
                        <input type="range" min={-10} max={10} value={lifestyle.bmiDelta} onChange={(e)=>setLifestyle(v=>({...v, bmiDelta: Number(e.target.value)}))} className="w-full"/>
                        <span className="tabular-nums">{lifestyle.bmiDelta}</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 md:col-span-2"><ActionsChecklist onExport={()=>alert('Экспорт демонстрационный')} /></Card>
                </div>
              </motion.div>
            )}
            {tab === 'diet' && (<motion.div key="di" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}><DietPlan /></motion.div>)}
            {tab === 'stats' && (<motion.div key="st" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}><StatsPanel condition={condition} /></motion.div>)}
            {tab === 'info' && (<motion.div key="inf" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}><DiseaseInfoPanel condition={condition} /></motion.div>)}
            {tab === 'study' && (<motion.div key="stud" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}><StudyPanel condition={condition} /></motion.div>)}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}

// ---------------- Table view (list + expandable rows) ------------------------
export default function TableView({ items = CONDITIONS }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-3">
      <Card className="p-3">
        <div className="grid grid-cols-12 text-xs uppercase tracking-wide text-slate-500">
          <div className="col-span-6 pl-3">Состояние</div>
          <div className="col-span-6">Шкала риска (перцентиль)</div>
        </div>
      </Card>

      {items.map((c) => (
        <Card key={c.id} className="overflow-hidden">
          <button onClick={() => setOpenId(openId === c.id ? null : c.id)} className="w-full grid grid-cols-12 items-center p-4 hover:bg-slate-50 text-left">
            <div className="col-span-6 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl text-white grid place-items-center bg-gradient-to-br ${CATEGORY_COLORS[c.category] || "from-slate-500 to-slate-400"}`}>
                {(() => { const IconComp = c?.icon; const SafeIcon = typeof IconComp === 'function' ? IconComp : null; return SafeIcon ? <SafeIcon className="h-5 w-5"/> : <span className="text-xs">PRS</span>; })()}
              </div>
              <div>
                <div className="font-medium text-slate-900">{c.name}</div>
                <div className="text-xs text-slate-500">{c.category} · PGS {c.model.pgsId} · v{c.model.version}</div>
              </div>
            </div>
            <div className="col-span-6 flex items-center gap-3">
              <div className="flex-1 min-w-[160px]"><RiskBar percentile={c.percentile} /></div>
              <Chip tone={toneFromPercentile(c.percentile)}>{labelFromPercentile(c.percentile)}</Chip>
              <span className={`h-5 w-5 text-slate-400 transition-transform ${openId===c.id ? "rotate-180" : ""}`}>▾</span>
            </div>
          </button>
          <AnimatePresence initial={false}>
            {openId === c.id && (
              <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="border-t border-slate-100 p-4 bg-white/60">
                <InlineDetail condition={c} />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  );
}