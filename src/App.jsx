import React, { useState } from "react";
import TopNav from "./components/TopNav";
import MainPage from "./pages/MainPage";
import TableView from "./pages/TableView";
import Catalog from "./pages/Catalog";
import LabsPage from "./pages/LabsPage";
import ExamsPage from "./pages/ExamsPage";
import SymptomsPage from "./pages/SymptomsPage";
import TreatmentPage from "./pages/TreatmentPage";

export default function App() {
  const [route, setRoute] = useState("home");
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <TopNav current={route} onNav={setRoute} />
      {route === "home" && <MainPage onGo={setRoute} />}
      {route === "table" && <TableView />}
      {route === "catalog" && <Catalog />}
      {route === "labs" && <LabsPage />}
      {route === "exams" && <ExamsPage />}
      {route === "symptoms" && <SymptomsPage />}
      {route === "treatment" && <TreatmentPage />}
      <footer className="mx-auto max-w-7xl p-6 text-xs text-slate-500">
        Демо. Данные иллюстративны и не являются мед. рекомендациями.
      </footer>
    </div>
  );
}
