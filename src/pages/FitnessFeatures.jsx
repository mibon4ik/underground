import React, { useState } from 'react';

export default function FitnessFeatures({ data, onNavigate, addLead }) {
    const [activeTab, setActiveTab] = useState('coaches');
    const [leadStatus, setLeadStatus] = useState(null);

    const S = (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p} style={{ flexShrink: 0 }} />;
    const tabs = [
        { id: 'coaches', label: 'Тренеры', icon: S({ children: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></> }) },
        { id: 'branches', label: 'Филиалы', icon: S({ children: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></> }) },
        { id: 'prices', label: 'Прайс', icon: S({ children: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></> }) },
        { id: 'schedule', label: 'Расписание', icon: S({ children: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> }) },
        { id: 'news', label: 'Новости', icon: S({ children: <><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-4 0V5"/><line x1="10" y1="8" x2="18" y2="8"/><line x1="10" y1="12" x2="18" y2="12"/><line x1="10" y1="16" x2="14" y2="16"/></> }) },
        { id: 'gallery', label: 'Галерея', icon: S({ children: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></> }) },
        { id: 'reviews', label: 'Отзывы', icon: S({ children: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></> }) },
        { id: 'programs', label: 'Программы', icon: S({ children: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></> }) },
        { id: 'shop', label: 'Магазин', icon: S({ children: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></> }) },
        { id: 'promos', label: 'Акции', icon: S({ children: <><polygon points="12 2 15.09 8.5 22 9.31 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.31 8.91 8.5 12 2"/></> }) },
        { id: 'faq', label: 'FAQ', icon: S({ children: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></> }) },
        { id: 'calc', label: 'Рассрочка', icon: S({ children: <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></> }) },
        { id: 'referral', label: 'Реферал', icon: S({ children: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></> }) },
        { id: 'booking', label: 'Бронь', icon: S({ children: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></> }) },
        { id: 'achievements', label: 'Успехи', icon: S({ children: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></> }) },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'coaches':
                return (
                    <div className="features-grid">
                        {(data.coaches || []).map(c => (
                            <div key={c.id} className="feature-card coach-card">
                                <div className="coach-avatar">{c.name ? c.name[0] : '?'}</div>
                                <h3>{c.name}</h3>
                                <p className="coach-regalia">{c.regalia}</p>
                                <div className="coach-branch">{c.branch}</div>
                            </div>
                        ))}
                        {(!data.coaches || data.coaches.length === 0) && <p>Список тренеров скоро появится.</p>}
                    </div>
                );
            case 'branches':
                return (
                    <div className="features-grid">
                        {(data.branches || []).map(b => (
                            <div key={b.id} className="feature-card branch-card">
                                <h3>{b.name}</h3>
                                <p>{b.address}</p>
                                {b.video && (
                                    <div className="video-preview">
                                        <a href={b.video} target="_blank" rel="noreferrer">📹 Смотреть видеообзор</a>
                                    </div>
                                )}
                            </div>
                        ))}
                        {(!data.branches || data.branches.length === 0) && <p>Информация о филиалах скоро появится.</p>}
                    </div>
                );
            case 'prices':
                return (
                    <div className="prices-list">
                        {(data.prices || []).map(p => (
                            <div key={p.id} className="price-item">
                                <span className="price-name">{p.name}</span>
                                <span className="price-value">{p.price} ₸</span>
                            </div>
                        ))}
                        {(!data.prices || data.prices.length === 0) && <p>Прайс-лист на обновлении.</p>}
                    </div>
                );
            case 'schedule':
                return (
                    <div className="schedule-table">
                        {(data.schedule || []).map(s => (
                            <div key={s.id} className="schedule-item">
                                <span className="schedule-day">{s.day}</span>
                                <span className="schedule-time">{s.time}</span>
                                <span className="schedule-activity">{s.activity}</span>
                            </div>
                        ))}
                        {(!data.schedule || data.schedule.length === 0) && <p>Расписание скоро будет опубликовано.</p>}
                    </div>
                );
            case 'news':
                return (
                    <div className="features-grid">
                        {(data.news || []).map(n => (
                            <div key={n.id} className="news-card">
                                <span className="news-date">{n.date}</span>
                                <h3>{n.title}</h3>
                                <p>{n.content}</p>
                            </div>
                        ))}
                        {(!data.news || data.news.length === 0) && <p>Новостей пока нет.</p>}
                    </div>
                );
            case 'gallery':
                return (
                    <div className="gallery-grid">
                        {(data.gallery || []).map(img => (
                            <div key={img.id} className="gallery-item">
                                <img src={img.url} alt={img.caption} style={{ width: '100%', borderRadius: 8 }} />
                                <p>{img.caption}</p>
                            </div>
                        ))}
                        {(!data.gallery || data.gallery.length === 0) && <p>Галерея пуста.</p>}
                    </div>
                );
            case 'reviews':
                return (
                    <div className="features-grid">
                        {(data.reviews || []).map(r => (
                            <div key={r.id} className="review-card">
                                <div className="review-rating">{'⭐'.repeat(r.rating || 5)}</div>
                                <p>"{r.text}"</p>
                                <cite>— {r.author}</cite>
                            </div>
                        ))}
                        {(!data.reviews || data.reviews.length === 0) && <p>Отзывов пока нет.</p>}
                    </div>
                );
            case 'calc':
                return <Calculator data={data.calculator} />;
            case 'booking':
                return <BookingForm addLead={addLead} setStatus={setLeadStatus} status={leadStatus} />;
            case 'promos':
                return (
                    <div className="features-grid">
                        {(data.promos || []).map(p => (
                            <div key={p.id} className="feature-card promo-card">
                                <div className="promo-tag">АКЦИЯ</div>
                                <h3>{p.title}</h3>
                                <div className="promo-discount">-{p.discount}</div>
                                <p>Действует до: {p.ends}</p>
                            </div>
                        ))}
                        {(!data.promos || data.promos.length === 0) && <p>Акций в данный момент нет.</p>}
                    </div>
                );
            case 'faq':
                return (
                    <div className="faq-list">
                        {(data.faq || []).map(f => (
                            <div key={f.id} className="faq-item">
                                <div className="faq-q">{f.q}</div>
                                <div className="faq-a">{f.a}</div>
                            </div>
                        ))}
                        {(!data.faq || data.faq.length === 0) && <p>Раздел в разработке.</p>}
                    </div>
                );
            case 'achievements':
                return (
                    <div className="features-grid">
                        {(data.achievements || []).map(a => (
                            <div key={a.id} className="feature-card achievement-card">
                                <div className="tab-icon">🥇</div>
                                <h3>{a.title}</h3>
                                <p>{a.desc}</p>
                                <span className="coach-branch">{a.date}</span>
                            </div>
                        ))}
                        {(!data.achievements || data.achievements.length === 0) && <p>Наши главные победы скоро здесь!</p>}
                    </div>
                );
            default:
                return <p>Данные для "{activeTab}" настраиваются в админ-панели.</p>;
        }
    };

    return (
        <div className="fitness-features-page">
            <h1 className="page-title">Услуги и Возможности</h1>

            <div className="features-tabs-scroll">
                <div className="features-tabs">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            className={`feature-tab ${activeTab === t.id ? 'active' : ''}`}
                            onClick={() => { setActiveTab(t.id); setLeadStatus(null); }}
                        >
                            <span className="tab-icon">{t.icon}</span>
                            <span className="tab-label">{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="feature-content-area">
                {renderContent()}
            </div>

            <style>{`
        .fitness-features-page { padding: 20px 0; }
        .features-tabs-scroll { overflow-x: auto; margin-bottom: 30px; padding-bottom: 10px; }
        .features-tabs { display: flex; gap: 12px; min-width: max-content; }
        .feature-tab {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: var(--surface2); border: 1px solid var(--stroke); border-radius: 12px;
          padding: 16px 18px; min-width: 88px; max-width: 130px; cursor: pointer; transition: all 0.2s; color: var(--text);
          text-align: center; flex-shrink: 0;
        }
        .feature-tab:hover { border-color: var(--accent); transform: translateY(-3px); }
        .feature-tab.active { background: var(--accent); color: var(--bg); border-color: var(--accent); }
        .tab-icon { font-size: 24px; margin-bottom: 8px; }
        .tab-label { font-size: 12px; font-weight: 600; }

        .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .feature-card { background: var(--surface); border: 1px solid var(--stroke); border-radius: 16px; padding: 24px; transition: 0.3s; position: relative; overflow: hidden; }
        .feature-card:hover { border-color: var(--accent2); background: var(--surface2); }
        
        .coach-avatar { width: 60px; height: 60px; background: var(--accent2); border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: var(--bg); margin-bottom: 16px; }
        .coach-regalia { color: var(--muted); font-size: 14px; margin: 8px 0; }
        .coach-branch { font-size: 13px; background: var(--surface2); width: fit-content; padding: 4px 10px; border-radius: 6px; }

        .prices-list { display: flex; flex-direction: column; gap: 12px; max-width: 600px; }
        .price-item { display: flex; justify-content: space-between; padding: 16px 24px; background: var(--surface); border-radius: 12px; border: 1px solid var(--stroke); }
        .price-name { font-weight: 600; }
        .price-value { color: var(--accent); font-weight: 700; }

        .calc-container { max-width: 500px; background: var(--surface); padding: 32px; border-radius: 20px; border: 1px solid var(--stroke); margin: 0 auto; }
        .calc-f { margin-bottom: 24px; }
        .calc-f label { display: block; margin-bottom: 10px; color: var(--muted); font-size: 14px; }
        .calc-f input { width: 100%; padding: 12px; background: var(--bg); border: 1px solid var(--stroke); color: var(--text); border-radius: 8px; font-size: 18px; font-weight: 600; box-sizing: border-box; }
        .term-btns { display: flex; gap: 10px; }
        .term-btns button { flex: 1; padding: 10px; background: var(--surface2); border: 1px solid var(--stroke); color: var(--text); border-radius: 8px; cursor: pointer; }
        .term-btns button.active { background: var(--accent2); color: var(--bg); border-color: var(--accent2); }
        .calc-result { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--stroke); text-align: center; }
        .calc-result span { display: block; color: var(--muted); margin-bottom: 8px; }
        .calc-result strong { display: block; font-size: 32px; color: var(--accent); }
        
        .feature-btn { width: 100%; padding: 14px; background: var(--accent); color: var(--bg); border: none; border-radius: 10px; font-weight: 700; cursor: pointer; margin-top: 10px; transition: 0.2s; }
        .feature-btn:hover { opacity: 0.9; transform: scale(0.98); }
        .status-msg { text-align: center; margin-top: 15px; color: var(--ok); font-weight: 600; }
        
        .faq-item { background: var(--surface); border: 1px solid var(--stroke); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
        .faq-q { font-weight: 700; color: var(--accent2); margin-bottom: 10px; }
        .faq-a { color: var(--muted); line-height: 1.6; }
        
        .promo-tag { background: var(--accent); color: var(--bg); width: fit-content; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 900; margin-bottom: 10px; }
        .promo-discount { font-size: 48px; font-weight: 900; color: var(--text); }
        
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
        .gallery-item { background: var(--surface); padding: 10px; border-radius: 12px; border: 1px solid var(--stroke); }
        .gallery-item p { margin-top: 8px; font-size: 12px; color: var(--muted); text-align: center; }
        
        .schedule-item { display: grid; grid-template-columns: 120px 100px 1fr; padding: 12px; border-bottom: 1px solid var(--stroke); }
        .schedule-day { font-weight: 700; color: var(--accent2); }
        .schedule-time { color: var(--muted); }
      `}</style>
        </div>
    );
}

function Calculator({ data = {} }) {
    const [amount, setAmount] = useState(100000);
    const terms = data.terms && data.terms.length > 0 ? data.terms : [3, 6, 12];
    const [term, setTerm] = useState(terms[0]);
    const kaspi = data.kaspiPercent || 0;
    const monthly = ((amount * (1 + kaspi / 100)) / term).toFixed(0);

    return (
        <div className="calc-container">
            <h3>Калькулятор рассрочки</h3>
            <div className="calc-f">
                <label>Сумма абонемента (₸)</label>
                <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
            </div>
            <div className="calc-f">
                <label>Срок рассрочки (мес)</label>
                <div className="term-btns">
                    {terms.map(t => (
                        <button key={t} className={term === t ? 'active' : ''} onClick={() => setTerm(t)}>{t} мес</button>
                    ))}
                </div>
            </div>
            <div className="calc-result">
                <span>Ежемесячный платеж:</span>
                <strong>{monthly} ₸ / мес</strong>
                <small>С учетом комиссии {kaspi}%</small>
            </div>
        </div>
    );
}

function BookingForm({ addLead, setStatus, status }) {
    const [form, setForm] = useState({ name: '', phone: '', date: '', time: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const ok = await addLead({ ...form, source: 'Бронирование через сайт' });
        setLoading(false);
        if (ok) {
            setStatus('Заявка успешно отправлена! Администратор свяжется с вами.');
            setForm({ name: '', phone: '', date: '', time: '' });
        } else {
            setStatus('Ошибка при отправке. Попробуйте позже.');
        }
    };

    return (
        <div className="calc-container">
            <h3>Запись на тренировку</h3>
            <form onSubmit={handleSubmit}>
                <div className="calc-f"><label>Имя</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Как к вам обращаться" /></div>
                <div className="calc-f"><label>Телефон</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="+7 (___) ___ __ __" /></div>
                <div className="calc-f"><label>Дата</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></div>
                <button className="feature-btn" type="submit" disabled={loading}>{loading ? 'Отправка...' : 'Записаться'}</button>
                {status && <p className="status-msg">{status}</p>}
            </form>
        </div>
    );
}
