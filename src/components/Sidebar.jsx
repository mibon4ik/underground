import React from 'react';

const styles = `
.sidebar {
  width: 280px;
  min-width: 280px;
  max-width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--sidebar-bg);
  backdrop-filter: blur(16px);
  border-right: 1px solid var(--stroke);
  padding: 16px 12px 20px;
  z-index: 40;
}
.brand-box {
  padding: 16px;
  border-radius: 22px;
  border: 1px solid var(--stroke);
  background: linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01));
  box-shadow: 0 22px 58px rgba(0,0,0,.32);
  margin-bottom: 16px;
}
.brand {
  font-size: 31px;
  line-height: 0.98;
  font-weight: 1000;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.brand-accent { color: var(--accent); }
.subbrand { margin-top: 10px; color: var(--muted); font-size: 13px; line-height: 1.6; }

.sidebar-search-wrap { position: relative; margin-bottom: 14px; }
.sidebar-search {
  width: 100%;
  padding: 14px 15px 14px 42px;
  border-radius: 15px;
  border: 1px solid var(--stroke);
  background: var(--surface);
  color: var(--text);
  outline: none;
  transition: 0.18s ease;
  font-size: 14px;
}
.sidebar-search:focus {
  border-color: rgba(216,255,71,.34);
  box-shadow: 0 0 0 4px rgba(216,255,71,.08);
}
.sidebar-search::placeholder { color: #78849a; }

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #7d8aa0;
  font-size: 16px;
  pointer-events: none;
}

.nav-title {
  padding: 10px 10px 8px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7f8aa0;
  font-weight: 900;
}

.nav-group { display: flex; flex-direction: column; gap: 6px; }

.nav-item {
  width: 100%;
  text-align: left;
  padding: 13px 14px;
  border-radius: 14px;
  border: 1px solid transparent;
  background: transparent;
  color: #e0e9f7;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.18s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-item:hover {
  background: var(--surface);
  border-color: var(--stroke);
  transform: translateX(2px);
}

.nav-item.active {
  background: linear-gradient(180deg,rgba(216,255,71,.14),rgba(255,255,255,.03));
  border-color: rgba(216,255,71,.22);
  color: #f4ffd0;
}

.nav-item-icon { font-size: 16px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.sidebar-search-icon { display: flex; align-items: center; }

.sidebar-note {
  margin-top: 16px;
  padding: 14px;
  border-radius: 18px;
  background: linear-gradient(180deg,rgba(101,194,255,.08),rgba(255,255,255,.02));
  border: 1px solid rgba(101,194,255,.16);
  font-size: 13px;
  line-height: 1.65;
  color: #dce8fb;
}

.sidebar-admin-btn {
  width: 100%;
  margin-top: 12px;
  padding: 11px 14px;
  border-radius: 14px;
  border: 1px solid rgba(216,255,71,.22);
  background: rgba(216,255,71,.06);
  color: #d8ff47;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.18s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-admin-btn:hover { background: rgba(216,255,71,.12); }
`;

const ICONS = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>,
  product: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  features: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.5 22 9.31 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.31 8.91 8.5 12 2"/></svg>,
  sales: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  crm: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  objections: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  materials: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
};

const NAV_ITEMS = [
  { id: 'home', label: 'Главная', icon: ICONS.home },
  { id: 'product', label: 'Продукт', icon: ICONS.product },
  { id: 'features', label: 'Услуги и фишки', icon: ICONS.features },
  { id: 'sales', label: 'Этапы консультации', icon: ICONS.sales },
  { id: 'crm', label: 'CRM обучение', icon: ICONS.crm },
  { id: 'objections', label: 'Работа с возражениями', icon: ICONS.objections },
  { id: 'materials', label: 'Материалы', icon: ICONS.materials },
  { id: 'contacts', label: 'Контакты', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> },
];

export default function Sidebar({
  activePage,
  onNavigate,
  onSearch,
  searchValue,
  company,
  customPages,
  onOpenAdmin
}) {

  const handleNav = (id) => {
    onNavigate(id);
  };

  return (
    <aside className="sidebar">
      <style>{styles}</style>

      <div className="brand-box">
        <div className="brand">
          {(company?.name || 'Underground').split(' ').map((w, i) =>
            i === 1 ? <span key={i} className="brand-accent"> {w}</span> : w
          )}
        </div>
        <div className="subbrand">{company?.description || 'Фитнес-клуб'}</div>
      </div>

      <div className="sidebar-search-wrap">
        <span className="search-icon sidebar-search-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
        <input
          className="sidebar-search"
          placeholder="Поиск по базе знаний..."
          value={searchValue}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      <div className="nav-title">Основные разделы</div>

      <div className="nav-group">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item${activePage === item.id ? ' active' : ''}`}
            onClick={() => handleNav(item.id)}
          >
            <span className="nav-item-icon">{item.icon || '📄'}</span>
            {item.label}
          </button>
        ))}
      </div>

      {(customPages || []).filter(p => !NAV_ITEMS.some(n => n.id === p.id)).length > 0 && (
        <>
          <div className="nav-title" style={{ marginTop: 14 }}>Мои разделы</div>
          <div className="nav-group">
            {(customPages || []).filter(p => !NAV_ITEMS.some(n => n.id === p.id)).map(page => (
              <button
                key={page.id}
                className={`nav-item${activePage === page.id ? ' active' : ''}`}
                onClick={() => handleNav(page.id)}
              >
                <span className="nav-item-icon">{page.icon || '📄'}</span>
                {page.title}
              </button>
            ))}
          </div>
        </>
      )}

      <button className="sidebar-admin-btn" onClick={onOpenAdmin}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        Админ-панель
      </button>
    </aside>
  );
}