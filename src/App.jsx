import { useState, useEffect, useMemo } from "react";
import { useStore } from "./hooks/useStore";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./components/AdminPanel";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import SalesPage from "./pages/SalesPage";
import CrmPage from "./pages/CrmPage";
import ObjectionsPage from "./pages/ObjectionsPage";
import MaterialsPage from "./pages/MaterialsPage";
import CustomPage from "./pages/CustomPage";
import "./styles/global.css";

const STATIC_SEARCH = {
  home: "главная underground fitness компания ценности миссия сеть филиалы история результат команда рост",
  product: "продукт методичка gym big серебряная карта золотая карта пт дежурный тренер групповые секции финансы",
  sales: "этапы консультации установление контакта вопросы квалификация презентация закрытие возражения кейсы",
  crm: "crm big лид новая сделка автосделка смена воронки задача примечание этапы воронки обязательные поля",
  objections: "возражения правило трех н дорого подумаю нет времени обсудить с кем-то рассрочка",
  materials: "материалы pdf методичка crm обучение этапы консультации файлы",
};

export default function App() {
  const { data, update, reset, exportData, importData } = useStore();
  const [activePage, setActivePage] = useState("home");
  const [searchValue, setSearchValue] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);

  // Apply CSS variables from theme
  useEffect(() => {
    const root = document.documentElement;
    const t = data.theme;
    root.style.setProperty("--bg", t.bg);
    root.style.setProperty("--bg2", t.bg2);
    root.style.setProperty("--surface", t.surface);
    root.style.setProperty("--surface2", t.surface2);
    root.style.setProperty("--surface3", t.surface3 || t.surface);
    root.style.setProperty("--stroke", t.stroke);
    root.style.setProperty("--muted", t.muted);
    root.style.setProperty("--text", t.text);
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent2", t.accent2);
    root.style.setProperty("--ok", t.ok);
    root.style.setProperty("--warn", t.warn);
    root.style.setProperty("--danger", t.danger);
    root.style.setProperty("--gold", t.gold);
    root.style.setProperty("--sidebar-bg", t.sidebarBg || "rgba(8,12,18,0.94)");
    root.style.setProperty("--font-family", t.fontFamily || "Inter, Arial, sans-serif");
    document.body.style.fontFamily = t.fontFamily || "Inter, Arial, sans-serif";
    document.body.style.background = `radial-gradient(circle at 12% 0%, rgba(101,194,255,.09), transparent 22%),
      radial-gradient(circle at 90% 0%, rgba(216,255,71,.08), transparent 20%),
      linear-gradient(180deg, ${t.bg} 0%, ${t.bg2} 100%)`;
    document.body.style.color = t.text;
  }, [data.theme]);

  // Keyboard shortcut for admin
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") setAdminOpen(v => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const customPages = useMemo(() => data.customPages || [], [data.customPages]);

  const handleSearch = (val) => {
    setSearchValue(val);
    if (!val.trim()) return;
    const q = val.trim().toLowerCase();
    // Search static pages
    const staticMatch = Object.entries(STATIC_SEARCH).find(([, kw]) => kw.toLowerCase().includes(q));
    if (staticMatch) { setActivePage(staticMatch[0]); return; }
    // Search custom pages
    const customMatch = customPages.find(p =>
      p.title.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.keywords || '').toLowerCase().includes(q)
    );
    if (customMatch) setActivePage(customMatch.id);
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    setSearchValue("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageKey = useMemo(() => `${activePage}-${Date.now()}`, [activePage]);

  const activeCustomPage = customPages.find(p => p.id === activePage);

  const noResult = searchValue && !Object.entries(STATIC_SEARCH).some(([, kw]) =>
    kw.toLowerCase().includes(searchValue.toLowerCase())) &&
    !customPages.some(p =>
      p.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      (p.keywords || '').toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", overflow: "hidden" }}>
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        searchValue={searchValue}
        company={data.company}
        customPages={customPages}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      <main style={{
        flex: 1,
        minWidth: 0,
        width: 0,  /* critical: force flex child to shrink properly */
        overflowX: "hidden",
        overflowY: "auto",
        height: "100vh",
        padding: "28px 32px 48px",
        boxSizing: "border-box",
      }}>
        {noResult && (
          <div className="empty-search">
            По запросу «{searchValue}» ничего не найдено.
          </div>
        )}

        {activePage === "home"       && <HomePage       key={pageKey} data={data} onNavigate={handleNavigate} />}
        {activePage === "product"    && <ProductPage    key={pageKey} data={data} />}
        {activePage === "sales"      && <SalesPage      key={pageKey} data={data} />}
        {activePage === "crm"        && <CrmPage        key={pageKey} data={data} />}
        {activePage === "objections" && <ObjectionsPage key={pageKey} data={data} />}
        {activePage === "materials"  && <MaterialsPage  key={pageKey} onNavigate={handleNavigate} />}

        {activeCustomPage && (
          <CustomPage key={pageKey} page={activeCustomPage} />
        )}
      </main>

      {adminOpen && (
        <AdminPanel
          data={data}
          onUpdate={update}
          onReset={reset}
          onExport={exportData}
          onImport={importData}
          onClose={() => setAdminOpen(false)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
