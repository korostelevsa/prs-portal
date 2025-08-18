import React from "react";
import Button from "./Button";
import { Menu, User } from "lucide-react";

export default function TopNav({ onNav, current }) {
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-semibold">PRS</div>
          <div className="text-slate-800 font-semibold">Polygenic Risk Portal</div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button variant={current === "labs" ? "outline" : "ghost"} onClick={() => onNav("labs")}>Анализы</Button>
          <Button variant={current === "exams" ? "outline" : "ghost"} onClick={() => onNav("exams")}>Обследования</Button>
          <Button variant={current === "symptoms" ? "outline" : "ghost"} onClick={() => onNav("symptoms")}>Симптомы</Button>
          <Button variant={current === "treatment" ? "outline" : "ghost"} onClick={() => onNav("treatment")}>Лечение</Button>
          <Button variant={current === "table" ? "outline" : "ghost"} onClick={() => onNav("table")} icon={Menu}>Таблица</Button>
          <Button variant={current === "catalog" ? "outline" : "ghost"} onClick={() => onNav("catalog")} icon={Menu}>Генетика</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={User}>Иван П.</Button>
        </div>
      </div>
    </div>
  );
}

/*
 * SkipToContent
 * A tiny component that renders an accessible skip link for keyboard users.
 * Place near the top of the app (App.jsx) to allow jumping straight to #main-content.
 */
export function SkipToContent({ targetId = 'main-content', children = 'Skip to main content' }) {
  return (
    <a className="skip-to-content" href={`#${targetId}`} onClick={() => {
      const target = document.getElementById(targetId);
      if (target) setTimeout(() => target.focus({ preventScroll: true }));
    }}>
      {children}
    </a>
  );
}

/*
 * markKeyboardUsers - toggles an HTML class when keyboard navigation is used.
 * Helps CSS fallback in index.css to style :focus states.
 */
export function markKeyboardUsers() {
  // Using passive setup; no effect on existing component logic.
  window.addEventListener('keydown', function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('keyboard-user');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }, { once: true });
}
