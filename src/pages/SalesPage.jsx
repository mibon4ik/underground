import React, { useState } from 'react';

export default function SalesPage({ data }) {
  const [tab, setTab] = useState('flow');
  const s = data.sales;

  return (
    <section className="page-animate">
      <div className="page-header">
        <div className="eyebrow">Раздел 2</div>
        <div className="page-title">Этапы консультации</div>
        <div className="page-desc">Полный разбор 8 этапов консультации с логикой из обучения Underground GYM, примерами формулировок и кейсами менеджера Арайлым.</div>
      </div>

      <div className="tabs-row">
        <button className={`tab-btn${tab === 'flow' ? ' active' : ''}`} onClick={() => setTab('flow')}>8 этапов</button>
        <button className={`tab-btn${tab === 'cases' ? ' active' : ''}`} onClick={() => setTab('cases')}>Лучшие кейсы</button>
      </div>

      {tab === 'flow' && (
        <div className="grid-2">
          {s.stages.map((stage) => (
            <div key={stage.id} className="card">
              <h3>{stage.title}</h3>
              {stage.items && <ul>{stage.items.map((it, i) => <li key={i}>{it}</li>)}</ul>}
              {stage.desc && <p style={{ marginTop: 8 }}>{stage.desc}</p>}
              {stage.good && <div className="example">{stage.good}</div>}
              {stage.bad && <div className="warn-box">{stage.bad}</div>}
              {stage.tip && <div className="tip-box">{stage.tip}</div>}
              {stage.formula && <div className="formula">{stage.formula}</div>}
              {stage.example && <div className="example" style={{ whiteSpace: 'pre-line' }}>{stage.example}</div>}
              {stage.check && <div className="check-box">{stage.check}</div>}
            </div>
          ))}
        </div>
      )}

      {tab === 'cases' && (
        <div className="grid-2">
          {s.cases.map((c, i) => (
            <div key={i} className="card">
              <div className="mini-head"><h3>{c.name}</h3><span className="mini-tag">{c.tag}</span></div>
              <p>{c.desc}</p>
              <div className="note">{c.result}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
