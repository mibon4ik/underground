import React, { useState } from 'react';

export default function FitnessFeatures({ data, onNavigate, addLead }) {
    const [activeTab, setActiveTab] = useState('coaches');
    const [leadStatus, setLeadStatus] = useState(null);

    const tabs = [
        { id: 'coaches', label: '🏆 Тренеры', icon: '👤' },
        { id: 'branches', label: '📍 Филиалы', icon: '🏢' },
        { id: 'prices', label: '💰 Прайс', icon: '💵' },
        { id: 'schedule', label: '🕒 Расписание', icon: '📅' },
        { id: 'news', label: '🔥 Новости', icon: '📰' },
        { id: 'gallery', label: '📸 Галерея', icon: '🖼️' },
        { id: 'reviews', label: '⭐ Отзывы', icon: '💬' },
        { id: 'programs', label: '💪 Программы', icon: '🏋️' },
        { id: 'shop', label: '🛒 Магазин', icon: '🛍️' },
        { id: 'promos', label: '🏷 Акции', icon: '✨' },
        { id: 'faq', label: '❓ FAQ', icon: '❔' },
        { id: 'calc', label: '🧮 Рассрочка', icon: '🧮' },
        { id: 'referral', label: '🎁 Реферал', icon: '🤝' },
        { id: 'booking', label: '🗓 Бронь', icon: '✍️' },
        { id: 'achievements', label: '🏆 Успехи', icon: '🥇' },
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
          padding: 16px; min-width: 100px; cursor: pointer; transition: all 0.2s; color: var(--text);
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
