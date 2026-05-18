import React from 'react';

export default function CrmPage({ data }) {
  const crm = data.crm || {};
  const { kpis = [], steps = [], funnel = [], requiredFields = [], checklist = [] } = crm;

  return (
    <section className="page-animate">
      <div className="page-header">
        <div className="eyebrow">Раздел 3</div>
        <div className="page-title">CRM обучение</div>
        <div className="page-desc">Пошаговая инструкция по CRM BIG: полный процесс — с первого шага до продажи и реализации сделки.</div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <div key={i} className="kpi">
            <strong>{k.value}</strong>
            <span>{k.label}</span>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        {steps.map((step, i) => (
          <div key={i} className="card">
            <div className="mini-head"><h3>{step.title}</h3><span className="mini-tag">{step.tag}</span></div>
            {step.ordered
              ? <ol>{step.items.map((it, j) => <li key={j}>{it}</li>)}</ol>
              : <ul>{step.items.map((it, j) => <li key={j}>{it}</li>)}</ul>}
            {step.warn && <div className="warn-box">{step.warn}</div>}
            {step.note && <div className="note">{step.note}</div>}
            {step.tip && <div className="tip-box">{step.tip}</div>}
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="mini-head"><h3>Этапы воронки BIG</h3><span className="mini-tag">12 этапов</span></div>
          <ol>{funnel.map((f, i) => <li key={i}>{f}</li>)}</ol>
        </div>
        <div className="card">
          <div className="mini-head"><h3>Обязательные поля при реализации</h3><span className="mini-tag">{requiredFields.length} полей</span></div>
          <ul>{requiredFields.map((f, i) => <li key={i}>{f}</li>)}</ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="mini-head"><h3>Чек-лист менеджера</h3><span className="mini-tag">самопроверка</span></div>
        <div className="split">
          <div>
            {checklist.slice(0, 3).map((c, i) => (
              <div key={i} className="accent-item" style={{ marginBottom: 10 }}>
                <strong>{c.title}</strong>
                <span>{c.desc}</span>
              </div>
            ))}
          </div>
          <div>
            {checklist.slice(3).map((c, i) => (
              <div key={i} className="accent-item" style={{ marginBottom: 10 }}>
                <strong>{c.title}</strong>
                <span>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
