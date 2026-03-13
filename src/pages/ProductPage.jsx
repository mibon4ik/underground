import React, { useState } from 'react';

const TABS = [
  { id: 'halls', label: 'О залах' },
  { id: 'plans', label: 'Типы абонементов' },
  { id: 'services', label: 'Виды услуг' },
  { id: 'groups', label: 'Групповые секции' },
  { id: 'finance', label: 'Финансы и документы' },
  { id: 'after', label: 'После продажи' },
];

export default function ProductPage({ data }) {
  const [tab, setTab] = useState('halls');
  const p = data.product;

  return (
    <section className="page-animate">
      <div className="page-header">
        <div className="eyebrow">Раздел 1</div>
        <div className="page-title">Продукт</div>
        <div className="page-desc">Полный блок по методическому пособию: история и масштаб, филиалы и форматы залов, типы абонементов, персональные тренировки, дежурный тренер, групповые секции, финансы, документация и действия после продажи.</div>
      </div>

      <div className="tabs-row">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'halls' && <HallsTab p={p} />}
      {tab === 'plans' && <PlansTab p={p} />}
      {tab === 'services' && <ServicesTab p={p} />}
      {tab === 'groups' && <GroupsTab p={p} />}
      {tab === 'finance' && <FinanceTab p={p} />}
      {tab === 'after' && <AfterTab p={p} />}
    </section>
  );
}

function HallsTab({ p }) {
  const h = p.halls;
  return (
    <div className="grid-2">
      <div className="card">
        <div className="mini-head"><h3>Форматы залов</h3><span className="mini-tag">gym / big</span></div>
        <h4>{h.gym.title}</h4>
        <ul>{h.gym.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
        <h4>{h.big.title}</h4>
        <ul>{h.big.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
        <div className="formula">Логика презентации: GYM — доступный и понятный базовый формат. BIG — расширенный формат с дополнительными зонами, сауной и более широкой тренировочной инфраструктурой.</div>
      </div>
      <div className="card">
        <div className="mini-head"><h3>Филиалы сети</h3><span className="mini-tag">11 клубов</span></div>
        <h4>{h.silverBranches.title}</h4>
        <ul>{h.silverBranches.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
        <h4>{h.goldBranches.title}</h4>
        <ul>{h.goldBranches.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
        <div className="note">{h.scheduleNote}</div>
      </div>
      <div className="card">
        <div className="mini-head"><h3>Как презентовать филиал</h3><span className="mini-tag">скрипт</span></div>
        <div className="accent-list">
          {h.presentationGuide.map((g, i) => (
            <div key={i} className="accent-item">
              <strong>{g.title}</strong>
              <span>{g.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="mini-head"><h3>Факты для доверия</h3><span className="mini-tag">масштаб</span></div>
        <ul>
          <li>Сеть обслуживает более 10 000 клиентов ежемесячно.</li>
          <li>В компании более 170 персональных тренеров.</li>
          <li>Компания выросла из одного подвального зала до сети в нескольких городах.</li>
        </ul>
      </div>
    </div>
  );
}

function PlansTab({ p }) {
  return (
    <div className="grid-2">
      {p.plans.map((plan, i) => (
        <div key={i} className="card">
          <div className="mini-head"><h3>{plan.title}</h3><span className="mini-tag">{plan.tag}</span></div>
          <ul>{plan.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

function ServicesTab({ p }) {
  return (
    <div className="grid-2">
      <div className="card">
        <div className="mini-head"><h3>{p.pt.title}</h3><span className="mini-tag">подробно</span></div>
        <ul>{p.pt.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
        <div className="tip-box">{p.pt.tip}</div>
      </div>
      <div className="card">
        <div className="mini-head"><h3>{p.dj.title}</h3><span className="mini-tag">режим</span></div>
        <ul>{p.dj.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
        <h4>Расписание ДЖ</h4>
        <ul>{p.dj.schedule.map((it, i) => <li key={i}>{it}</li>)}</ul>
        <div className="warn-box">{p.dj.warn}</div>
      </div>
    </div>
  );
}

function GroupsTab({ p }) {
  return (
    <div className="grid-2">
      <div className="card">
        <div className="mini-head"><h3>Групповые секции</h3><span className="mini-tag">расписание</span></div>
        <ul>{p.groups.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
      </div>
      <div className="card">
        <div className="mini-head"><h3>Правила посещения</h3><span className="mini-tag">важно</span></div>
        <ul>{p.groups.rules.map((it, i) => <li key={i}>{it}</li>)}</ul>
      </div>
    </div>
  );
}

function FinanceTab({ p }) {
  const f = p.finance;
  return (
    <div className="grid-2">
      <div className="card">
        <div className="mini-head"><h3>Валовая прибыль</h3><span className="mini-tag">формула</span></div>
        <div className="formula"><strong>{f.formula}</strong></div>
        <div className="check-box">Это нужно менеджеру и для расчёта сделки, и для корректного заполнения обязательных полей при реализации.</div>
      </div>
      <div className="card">
        <div className="mini-head"><h3>Документы для физических лиц</h3><span className="mini-tag">физлицо</span></div>
        <ol>{f.physDocs.map((it, i) => <li key={i}>{it}</li>)}</ol>
      </div>
      <div className="card">
        <div className="mini-head"><h3>Документы для юридических лиц</h3><span className="mini-tag">юрлицо</span></div>
        <ol>{f.legalDocs.map((it, i) => <li key={i}>{it}</li>)}</ol>
        <div className="note">Закрывающие документы: ЭСФ + АВР в 2 экземплярах.</div>
      </div>
      <div className="card">
        <div className="mini-head"><h3>Как объяснять финансовую часть</h3><span className="mini-tag">продажа</span></div>
        <ul>{f.tips.map((it, i) => <li key={i}>{it}</li>)}</ul>
      </div>
    </div>
  );
}

function AfterTab({ p }) {
  const a = p.afterSale;
  return (
    <div className="grid-2">
      <div className="card">
        <div className="mini-head"><h3>Действия после продажи</h3><span className="mini-tag">post-sale</span></div>
        <ol>{a.steps.map((it, i) => <li key={i}>{it}</li>)}</ol>
      </div>
      <div className="card">
        <div className="mini-head"><h3>Пример записи в WhatsApp</h3><span className="mini-tag">шаблон</span></div>
        <p>{a.example}</p>
        <div className="warn-box">{a.warn}</div>
      </div>
    </div>
  );
}
