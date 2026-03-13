import React from 'react';

const styles = `
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 34px;
  padding: 30px;
  border: 1px solid #2b364c;
  background: linear-gradient(110deg, rgba(3,6,11,.97), rgba(15,20,30,.9) 58%, rgba(7,10,16,.96));
  box-shadow: 0 22px 58px rgba(0,0,0,.32);
  margin-bottom: 20px;
}
.hero::after {
  content: '';
  position: absolute;
  right: -60px;
  bottom: -60px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(101,194,255,.12), transparent 68%);
}
.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 18px;
  align-items: end;
}
.hero h1 {
  font-size: 56px;
  line-height: 0.98;
  text-transform: uppercase;
  font-weight: 1000;
  letter-spacing: .02em;
}
.hero p {
  margin-top: 14px;
  max-width: 900px;
  color: #d5def0;
  font-size: 15px;
  line-height: 1.78;
}
.hero-panel {
  padding: 18px;
  border-radius: 24px;
  border: 1px solid var(--stroke);
  background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
}
.hero-panel-title {
  font-size: 12px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: #8b98ae;
  font-weight: 900;
  margin-bottom: 10px;
}
.home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 14px;
  margin-top: 10px;
}
.home-card {
  padding: 18px;
  border-radius: 20px;
  border: 1px solid var(--stroke);
  background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.01));
  box-shadow: 0 22px 58px rgba(0,0,0,.32);
  cursor: pointer;
  transition: 0.18s ease;
}
.home-card:hover {
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
  transform: translateY(-2px);
  border-color: #3a4660;
}
.home-card h3 { font-size: 18px; margin-bottom: 8px; }
.home-card p { font-size: 14px; color: var(--muted); line-height: 1.7; }

@media (max-width: 1180px) { .hero-grid { grid-template-columns: 1fr; } }
@media (max-width: 640px) { .hero h1 { font-size: 32px; } }
`;

export default function HomePage({ data, onNavigate }) {
  const { company } = data;

  return (
    <section className="page-animate">
      <style>{styles}</style>
      <div className="hero">
        <div className="hero-grid">
          <div>
            <h1>{company.name}</h1>
            <p>{company.description}</p>
            <div className="chips">
              {['О компании', 'Методичка продукта', 'Этапы консультации', 'CRM BIG', 'Возражения', 'Действия после продажи'].map(c => (
                <div key={c} className="chip">{c}</div>
              ))}
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-panel-title">Быстрый ориентир</div>
            <ul>
              <li>«Продукт» — всё по залам, картам, услугам, групповым секциям и документации.</li>
              <li>«Этапы консультации» — 8 этапов, кейсы и рабочие формулировки.</li>
              <li>«CRM обучение» — полный пошаговый процесс от лида до реализации сделки.</li>
              <li>«Работа с возражениями» — подробный playbook по классическим и сложным кейсам.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {company.stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="n">{s.value}</div>
            <div className="t">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="mini-head"><h3>О компании</h3><span className="mini-tag">основа</span></div>
          <ul>
            <li>Underground GYM основан в 2016 году.</li>
            <li>Первый зал — подвальное помещение 300 м² на Мустафина 3.</li>
            <li>Сегодня сеть работает в Астане, Алматы и Костанае.</li>
            <li>Миссия компании: <strong>доступный фитнес для каждого</strong>.</li>
            <li>Компания масштабируется и развивает внутреннюю систему обучения.</li>
          </ul>
          <div className="note">Используй этот блок как официальный вводный экран с историей, миссией и масштабом бренда.</div>
        </div>

        <div className="card">
          <div className="mini-head"><h3>Ценности компании</h3><span className="mini-tag">культура</span></div>
          <div className="timeline">
            {company.values.map((v, i) => (
              <div key={i} className="timeline-item">
                <div className="tl-num">{i + 1}</div>
                <strong>{v.title}</strong>
                <span>{v.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-grid">
        {[
          { id: 'product', title: 'Продукт', desc: 'Форматы GYM и BIG, серебряная и золотая карты, ПТ, дежурный тренер, групповые секции, финансы и post-sale.' },
          { id: 'sales', title: 'Этапы консультации', desc: 'Полный каркас диалога: установление контакта, квалификация, презентация, предзакрытие, закрытие, возражения, дожим и эмоции.' },
          { id: 'crm', title: 'CRM BIG', desc: 'Лид, новая сделка, автосделка, воронка, постановка задач, примечания, три касания и обязательные поля при реализации.' },
          { id: 'objections', title: 'Отработка возражений', desc: 'Подробные сценарии Н1 / Н2 / Н3 по классическим и сложным ситуациям, включая негативный опыт, страхи и переполненность.' },
        ].map(card => (
          <div key={card.id} className="home-card" onClick={() => onNavigate(card.id)}>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="footer">{company.name} © внутреннее использование</div>
    </section>
  );
}
