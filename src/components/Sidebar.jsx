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

.nav-item-icon { font-size: 16px; flex-shrink: 0; }

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

const NAV_ITEMS = [
  { id: 'home', label: 'Главная', icon: '🏠' },
  { id: 'product', label: 'Продукт', icon: '🏋️' },
  { id: 'sales', label: 'Этапы консультации', icon: '💬' },
  { id: 'crm', label: 'CRM обучение', icon: '📊' },
  { id: 'objections', label: 'Работа с возражениями', icon: '🎯' },
  { id: 'materials', label: 'Материалы', icon: '📁' },
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
          {company.name.split(' ').map((w, i) =>
            i === 1 ? <span key={i} className="brand-accent"> {w}</span> : w
          )}
        </div>
        <div className="subbrand">{company.description}</div>
      </div>

      <div className="sidebar-search-wrap">
        <span className="search-icon">⌕</span>
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
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {(customPages || []).length > 0 && (
        <>
          <div className="nav-title" style={{ marginTop: 14 }}>Мои разделы</div>
          <div className="nav-group">
            {(customPages || []).map(page => (
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
        ⚙️ Админ-панель
      </button>
    </aside>
  );
}