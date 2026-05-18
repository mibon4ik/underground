import React from 'react';

const styles = `
.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.file-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 15px;
  border-radius: 14px;
  border: 1px solid var(--stroke);
  background: var(--surface2);
  margin-top: 12px;
  font-weight: 800;
  font-size: 13px;
  color: var(--text);
  transition: 0.18s ease;
  cursor: pointer;
  gap: 8px;
}
.file-link:hover { transform: translateY(-1px); border-color: #3b475d; background: #1e2d40; }
`;

const MATERIALS = [
  { title: 'Методичка Underground GYM', tag: 'pptx / pdf', desc: 'Пособие по продукту, залам, картам, услугам, финансам и post-sale.', href: 'Методичка_Underground_GYM.pptx', icon: '📋' },
  { title: 'CRM BIG — Обучение', tag: 'pptx / pdf', desc: 'Пошаговый процесс работы в CRM BIG.', href: 'CRM_BIG_Обучение.pptx', icon: '📊' },
  { title: 'Этапы консультации', tag: 'pptx / pdf', desc: '8 этапов консультации, примеры и кейсы.', href: 'Этапы_консультации_Underground_GYM.pptx', icon: '💬' },
  { title: 'Файл по возражениям', tag: 'встроено', desc: 'Расширенный блок возражений уже встроен прямо в интерфейс по референс-сайту.', href: null, icon: '🎯', internal: 'objections' },
];

export default function MaterialsPage({ onNavigate }) {
  return (
    <section className="page-animate">
      <style>{styles}</style>
      <div className="page-header">
        <div className="eyebrow">Раздел 5</div>
        <div className="page-title">Материалы</div>
        <div className="page-desc">Раздел для исходных файлов. Здесь доступны все обучающие материалы в формате PPTX и PDF.</div>
      </div>

      <div className="materials-grid">
        {MATERIALS.map((m, i) => (
          <div key={i} className="card">
            <div className="mini-head">
              <h3 style={{ fontSize: 16 }}>{m.title}</h3>
              <span className="mini-tag">{m.tag}</span>
            </div>
            <p className="muted">{m.desc}</p>
            {m.internal ? (
              <button className="file-link" onClick={() => onNavigate(m.internal)}>
                {m.icon} Открыть раздел
              </button>
            ) : (
              <a className="file-link" href={m.href} target="_blank" rel="noreferrer">
                {m.icon} Открыть файл
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="note" style={{ marginTop: 20 }}>Чтобы кнопки загрузки файлов работали, рядом с index.html должны лежать файлы с соответствующими именами.</div>
    </section>
  );
}
