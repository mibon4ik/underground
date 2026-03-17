import React, { useState } from 'react';

const styles = `
.obj-home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 16px;
}
.obj-home-card {
  background: var(--surface);
  border: 1px solid var(--stroke);
  border-radius: 14px;
  padding: 16px;
  cursor: pointer;
  transition: 0.18s ease;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.obj-home-card:hover {
  background: var(--surface2);
  border-color: #3a4660;
  transform: translateY(-2px);
}
.obj-home-card-icon { font-size: 24px; flex-shrink: 0; }
.obj-home-card-body {}
.obj-home-card-title { font-size: 14px; font-weight: 800; margin-bottom: 4px; }
.obj-home-card-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
.obj-home-card.classic { border-left: 2px solid rgba(101,194,255,.3); }
.obj-home-card.hard { border-left: 2px solid rgba(239,68,68,.3); }
.rule-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
.rule-card {
  background: var(--surface);
  border: 1px solid var(--stroke);
  border-radius: 14px;
  padding: 20px;
  text-align: center;
}
.rule-num {
  font-size: 52px;
  font-weight: 1000;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 8px;
}
.rule-title { font-size: 14px; font-weight: 800; margin-bottom: 4px; }
.rule-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
.obj-detail-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.obj-detail-back {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--stroke);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 18px;
  display: grid;
  place-items: center;
  transition: 0.15s;
  flex-shrink: 0;
}
.obj-detail-back:hover { background: var(--surface2); }
.principle-box {
  background: var(--surface2);
  border-left: 3px solid var(--gold);
  border-radius: 0 12px 12px 0;
  padding: 16px 20px;
  margin-bottom: 20px;
}
.principle-label {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 6px;
}
.principle-text { font-size: 14px; color: var(--text); line-height: 1.68; }
.subvar-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
.subvar-btn {
  padding: 9px 14px;
  border-radius: 10px;
  border: 1px solid var(--stroke);
  background: var(--surface);
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s;
}
.subvar-btn:hover { color: var(--text); border-color: #3a4660; }
.subvar-btn.active {
  background: rgba(239,68,68,.12);
  border-color: rgba(239,68,68,.3);
  color: #f87171;
}
.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.category-badge.classic { background: rgba(101,194,255,.1); border: 1px solid rgba(101,194,255,.2); color: #65c2ff; }
.category-badge.hard { background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.2); color: #f87171; }
@media (max-width: 640px) {
  .rule-cards { grid-template-columns: 1fr; }
}
`;

export default function ObjectionsPage({ data }) {
  const [selected, setSelected] = useState(null);
  const [subVariant, setSubVariant] = useState(0);

  const objs = data.objections;
  const selectedObj = selected ? objs.find(o => o.id === selected) : null;

  if (!selected) {
    return (
      <section className="page-animate">
        <style>{styles}</style>
        <div className="page-header">
          <div className="eyebrow">Раздел 4</div>
          <div className="page-title">Работа с возражениями</div>
          <div className="page-desc">Три отказа — не повод сдаться. Каждый ответ клиента — это сигнал, а не финал.</div>
        </div>

        <div className="rule-cards">
          {objs.find(o => o.isRule)?.rules.map((r, i) => (
            <div key={i} className="rule-card">
              <div className="rule-num">{r.num}</div>
              <div className="rule-title">{r.title}</div>
              <div className="rule-desc">{r.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7f8aa0', marginBottom: 10 }}>
            Классические возражения
          </div>
          <div className="obj-home-grid">
            {objs.filter(o => !o.isRule && o.category === 'classic').map(obj => (
              <div key={obj.id} className={`obj-home-card classic`} onClick={() => { setSelected(obj.id); setSubVariant(0); }}>
                <div className="obj-home-card-icon">{obj.icon}</div>
                <div className="obj-home-card-body">
                  <div className="obj-home-card-title">{obj.title}</div>
                  <div className="obj-home-card-desc">{obj.homeDesc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7f8aa0', marginBottom: 10 }}>
            Сложные возражения
          </div>
          <div className="obj-home-grid">
            {objs.filter(o => !o.isRule && o.category === 'hard').map(obj => (
              <div key={obj.id} className={`obj-home-card hard`} onClick={() => { setSelected(obj.id); setSubVariant(0); }}>
                <div className="obj-home-card-icon">{obj.icon}</div>
                <div className="obj-home-card-body">
                  <div className="obj-home-card-title">{obj.title}</div>
                  <div className="obj-home-card-desc">{obj.homeDesc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const obj = selectedObj;
  const activeData = obj.subVariants ? obj.subVariants[subVariant] : obj;

  return (
    <section className="page-animate">
      <style>{styles}</style>
      <div className="obj-detail-header">
        <button className="obj-detail-back" onClick={() => setSelected(null)}>←</button>
        <div>
          <div className="eyebrow">Возражение</div>
          <div style={{ fontSize: 28, fontWeight: 1000, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>{obj.icon}</span> {obj.title}
            <span className={`category-badge ${obj.category}`}>{obj.category === 'classic' ? 'Классическое' : 'Сложное'}</span>
          </div>
        </div>
      </div>

      {obj.subVariants && (
        <div className="subvar-tabs">
          {obj.subVariants.map((sv, i) => (
            <button
              key={sv.id}
              className={`subvar-btn${subVariant === i ? ' active' : ''}`}
              onClick={() => setSubVariant(i)}
            >
              {sv.label}
            </button>
          ))}
        </div>
      )}

      {activeData.principle && (
        <div className="principle-box">
          <div className="principle-label">⚡ Принцип</div>
          <div className="principle-text">{activeData.principle}</div>
        </div>
      )}

      {(activeData.steps || []).map((step, si) => (
        <div key={si}>
          <div className="step-badge">Н <span>{step.label}</span></div>
          <div className="dialog-stack">
            {step.lines.map((line, li) => (
              <div key={li} className="dialog-line">
                <div className={`dialog-speaker ${line.role}`}>{line.role === 'client' ? 'К' : 'М'}</div>
                <div className={`dialog-bubble ${line.role}`}>{line.text}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {activeData.tip && <div className="tip-box" style={{ marginTop: 20 }}><strong>Совет:</strong> {activeData.tip}</div>}

      <div style={{ marginTop: 24 }}>
        <button
          style={{ padding: '10px 18px', borderRadius: 12, border: '1px solid var(--stroke)', background: 'var(--surface)', color: 'var(--muted)', cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: '0.15s' }}
          onClick={() => setSelected(null)}
          onMouseEnter={e => e.target.style.color = 'var(--text)'}
          onMouseLeave={e => e.target.style.color = 'var(--muted)'}
        >
          ← Все возражения
        </button>
      </div>
    </section>
  );
}
