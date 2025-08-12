import React, { useState } from "react";
import TopNav from "./components/TopNav";
import MainPage from "./pages/MainPage";
import TableView from "./pages/TableView";
import Catalog from "./pages/Catalog";

export default function App() {
  const [route, setRoute] = useState("home");
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <TopNav current={route} onNav={setRoute} />
      {route === "home" && <MainPage onGo={setRoute} />}
      {route === "table" && <TableView />}
      {route === "catalog" && <Catalog />}
      <footer className="mx-auto max-w-7xl p-6 text-xs text-slate-500">
        Демо. Числа и графики иллюстративны и не являются мед. рекомендациями.
      </footer>
    </div>
  );
}
