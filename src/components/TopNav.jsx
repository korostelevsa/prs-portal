import React from "react";
import Button from "./Button";
import { Menu, Search, User, FlaskConical, Stethoscope, FileText, Pill } from "lucide-react";

export default function TopNav({ onNav, current }) {
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <button onClick={() => onNav("home")} className="flex items-center gap-3 group" aria-label="На главную"><div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-semibold group-hover:bg-slate-800">PRS</div><div className="text-slate-800 font-semibold group-hover:text-slate-900">Polygenic Risk Portal</div></button>
        <div className="hidden md:flex items-center gap-2">
          <Button variant={current === "labs" ? "outline" : "ghost"} onClick={() => onNav("labs")} icon={FlaskConical}>Анализы</Button>
          <Button variant={current === "exams" ? "outline" : "ghost"} onClick={() => onNav("exams")} icon={Stethoscope}>Обследования</Button>
          <Button variant={current === "symptoms" ? "outline" : "ghost"} onClick={() => onNav("symptoms")} icon={FileText}>Симптомы</Button>
          <Button variant={current === "treatment" ? "outline" : "ghost"} onClick={() => onNav("treatment")} icon={Pill}>Лечение</Button>
<Button variant={current === "table" ? "outline" : "ghost"} onClick={() => onNav("table")} icon={Menu}>Таблица</Button>
          <Button variant={current === "catalog" ? "outline" : "ghost"} onClick={() => onNav("catalog")} icon={Search}>Категории</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={User}>Иван П.</Button>
        </div>
      </div>
    </div>
  );
}
