import React, { useState, useCallback } from 'react';

/* ─── AUTH ───────────────────────────────────────────────────── */
const CREDS_KEY   = 'uf_admin_creds';
const SESSION_KEY = 'uf_admin_session';
const DEFAULT_CREDS = { login: 'admin', password: 'uf2024' };
const getCreds    = () => { try { return JSON.parse(localStorage.getItem(CREDS_KEY)) || DEFAULT_CREDS; } catch { return DEFAULT_CREDS; } };
const saveCreds   = c  => localStorage.setItem(CREDS_KEY, JSON.stringify(c));
const hasSession  = () => { try { const s = JSON.parse(localStorage.getItem(SESSION_KEY)); return s && Date.now() < s.exp; } catch { return false; } };
const openSession  = () => localStorage.setItem(SESSION_KEY, JSON.stringify({ exp: Date.now() + 30*24*3600_000 }));
const closeSession = () => localStorage.removeItem(SESSION_KEY);

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const FONTS = [
  { label:'Inter (по умолчанию)', value:'Inter, Arial, Helvetica, sans-serif' },
  { label:'Manrope',  value:'Manrope, sans-serif' },
  { label:'DM Sans',  value:'DM Sans, sans-serif' },
  { label:'Nunito',   value:'Nunito, sans-serif' },
  { label:'Rubik',    value:'Rubik, sans-serif' },
];
const COLOR_KEYS = [
  {key:'bg',label:'Фон глубокий'},{key:'bg2',label:'Фон средний'},
  {key:'surface',label:'Поверхность 1'},{key:'surface2',label:'Поверхность 2'},
  {key:'stroke',label:'Обводка'},{key:'text',label:'Основной текст'},
  {key:'muted',label:'Приглушённый'},{key:'accent',label:'Акцент'},
  {key:'accent2',label:'Акцент 2'},{key:'ok',label:'Успех'},
  {key:'warn',label:'Предупреждение'},{key:'danger',label:'Опасность'},{key:'gold',label:'Золотой'},
];
const PRESETS = [
  { label:'🌑 Тёмный',     p:{bg:'#070a10',bg2:'#0d121b',surface:'#121928',surface2:'#182132',stroke:'#273146',text:'#eef4fb',muted:'#97a3b7',accent:'#d8ff47',accent2:'#65c2ff',ok:'#22c55e',warn:'#f59e0b',danger:'#ef4444',gold:'#d3b05d'} },
  { label:'🔴 Красный',    p:{bg:'#0f0809',bg2:'#160c0d',surface:'#1c1011',surface2:'#221517',stroke:'#3a2122',text:'#faf4f4',muted:'#a89090',accent:'#ff4444',accent2:'#ff8888',ok:'#22c55e',warn:'#f59e0b',danger:'#ef4444',gold:'#d3b05d'} },
  { label:'🔵 Синий',      p:{bg:'#070a14',bg2:'#0a0f1e',surface:'#0f1428',surface2:'#141b32',stroke:'#1e2b4a',text:'#eef4fb',muted:'#7a90b8',accent:'#4d9fff',accent2:'#a8d4ff',ok:'#22c55e',warn:'#f59e0b',danger:'#ef4444',gold:'#d3b05d'} },
  { label:'💜 Фиолетовый', p:{bg:'#0a0710',bg2:'#110d1a',surface:'#161220',surface2:'#1e1829',stroke:'#2e2440',text:'#f0eeff',muted:'#9a8fb8',accent:'#b47fff',accent2:'#e0c4ff',ok:'#22c55e',warn:'#f59e0b',danger:'#ef4444',gold:'#d3b05d'} },
];
const BLOCK_TYPES = [
  { type:'hero',    label:'🌟 Герой',         desc:'Большой баннер с заголовком и текстом' },
  { type:'text',    label:'📝 Текст',          desc:'Карточка с заголовком и произвольным текстом' },
  { type:'cards',   label:'🃏 Карточки',       desc:'Сетка карточек (2 или 3 колонки)' },
  { type:'list',    label:'📋 Список',         desc:'Список с иконками (чекбокс, нумерация, стрелки)' },
  { type:'table',   label:'📊 Таблица',        desc:'Таблица с заголовками и строками' },
  { type:'steps',   label:'🔢 Шаги',           desc:'Пронумерованные шаги / этапы' },
  { type:'alert',   label:'⚠️ Уведомление',   desc:'Цветной блок-предупреждение' },
  { type:'divider', label:'➖ Разделитель',    desc:'Горизонтальная линия с текстом' },
  { type:'stats',   label:'📈 Статистика',     desc:'Сетка числовых показателей' },
  { type:'links',   label:'🔗 Ссылки',         desc:'Список кликабельных ссылок / файлов' },
  { type:'twoCol',  label:'⬛⬛ Два столбца',  desc:'Два текстовых блока рядом' },
];

const uid = () => `b_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;

function makeBlock(type) {
  const base = { id: uid(), type };
  switch(type) {
    case 'hero':    return {...base, eyebrow:'РАЗДЕЛ', icon:'🏢', title:'Заголовок раздела', text:'Описание раздела. Редактируй в Админ-панели.', colorFrom:'rgba(216,255,71,.08)', colorTo:'rgba(101,194,255,.06)'};
    case 'text':    return {...base, icon:'📌', title:'Заголовок блока', content:'Введи текст здесь. Поддерживаются переносы строк.'};
    case 'cards':   return {...base, title:'Карточки', columns:2, items:[{icon:'✅',title:'Пункт 1',text:'Описание первого пункта.'},{icon:'💡',title:'Пункт 2',text:'Описание второго пункта.'}]};
    case 'list':    return {...base, icon:'📋', title:'Список', style:'check', items:['Первый пункт','Второй пункт','Третий пункт']};
    case 'table':   return {...base, icon:'📊', title:'Таблица', headers:['Колонка 1','Колонка 2','Колонка 3'], rows:[['Ячейка A1','Ячейка A2','Ячейка A3'],['Ячейка B1','Ячейка B2','Ячейка B3']]};
    case 'steps':   return {...base, title:'Шаги', items:[{num:1,title:'Первый шаг',text:'Описание шага.'},{num:2,title:'Второй шаг',text:'Описание шага.'}]};
    case 'alert':   return {...base, variant:'info', icon:'ℹ️', title:'Заголовок уведомления', text:'Текст уведомления.'};
    case 'divider': return {...base, label:'Раздел'};
    case 'stats':   return {...base, title:'Показатели', items:[{value:'100%',label:'Метрика 1'},{value:'50+',label:'Метрика 2'},{value:'24/7',label:'Метрика 3'}]};
    case 'links':   return {...base, icon:'🔗', title:'Ссылки', items:[{icon:'📄',title:'Название файла / ссылки',desc:'Описание',url:'#'}]};
    case 'twoCol':  return {...base, columns:[{icon:'💡',title:'Левый блок',text:'Текст левой колонки.'},{icon:'🔥',title:'Правый блок',text:'Текст правой колонки.'}]};
    default:        return base;
  }
}

/* ─── CSS ────────────────────────────────────────────────────── */
const css = `
.ap-overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:9000;display:flex;align-items:flex-start;justify-content:flex-end;backdrop-filter:blur(6px);animation:apFI .18s ease}
@keyframes apFI{from{opacity:0}to{opacity:1}}
@keyframes apSL{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes apPP{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}

/* Login */
.ap-login-wrap{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9100}
.ap-login{width:min(92vw,380px);background:#0c1118;border:1px solid #273146;border-radius:24px;padding:32px 28px;box-shadow:0 32px 80px rgba(0,0,0,.7);animation:apPP .22s ease}
.ap-login-logo{font-size:11px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:#d8ff47;margin-bottom:6px}
.ap-login-title{font-size:22px;font-weight:1000;color:#eef4fb;margin-bottom:4px}
.ap-login-sub{font-size:13px;color:#97a3b7;margin-bottom:22px;line-height:1.55}
.ap-login-lbl{display:block;font-size:11px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:#6a7890;margin-bottom:7px}
.ap-login-inp{width:100%;padding:13px 14px;border-radius:13px;border:1px solid #273146;background:#121928;color:#eef4fb;outline:none;font-size:14px;transition:.14s;font-family:inherit}
.ap-login-inp:focus{border-color:rgba(216,255,71,.4);box-shadow:0 0 0 3px rgba(216,255,71,.07)}
.ap-login-inp.err{border-color:rgba(239,68,68,.5)}
.ap-login-err{display:flex;align-items:center;gap:8px;padding:10px 13px;border-radius:11px;margin-bottom:14px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.22);color:#f87171;font-size:13px;font-weight:700}
.ap-login-btn{width:100%;padding:14px;border-radius:13px;border:none;background:#d8ff47;color:#0a0d12;font-size:14px;font-weight:900;cursor:pointer;transition:.14s;font-family:inherit}
.ap-login-btn:hover{background:#c8ef36}
.ap-login-btn:disabled{opacity:.6;cursor:not-allowed}
.ap-cancel{width:100%;padding:11px;margin-top:10px;border-radius:13px;border:1px solid #273146;background:transparent;color:#97a3b7;font-size:13px;font-weight:700;cursor:pointer;transition:.14s;font-family:inherit}
.ap-cancel:hover{color:#eef4fb;border-color:#3a4660}
.ap-hint{margin-top:16px;padding:10px 13px;border-radius:10px;background:rgba(216,255,71,.05);border:1px solid rgba(216,255,71,.1);font-size:12px;color:#8a9aaa;line-height:1.6}
.ap-hint code{color:#d8ff47;background:rgba(216,255,71,.08);padding:1px 5px;border-radius:4px}

/* Panel */
.ap-panel{width:min(94vw,900px);height:100vh;background:#080c14;border-left:1px solid #1e2b3a;display:flex;flex-direction:column;overflow:hidden;animation:apSL .22s ease}
.ap-head{padding:14px 18px;border-bottom:1px solid #1e2b3a;display:flex;align-items:center;justify-content:space-between;background:rgba(6,9,16,.97);flex-shrink:0;gap:10px}
.ap-head-l{display:flex;align-items:center;gap:9px}
.ap-head-title{font-size:16px;font-weight:1000;color:#eef4fb}
.ap-head-title em{color:#d8ff47;font-style:normal}
.ap-user-badge{display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(216,255,71,.07);border:1px solid rgba(216,255,71,.14);font-size:11px;font-weight:800;color:#c8ef80}
.ap-head-r{display:flex;align-items:center;gap:6px}
.ap-saved{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:7px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);color:#4ade80;font-size:11px;font-weight:800;animation:apFI .2s ease}
.ap-ico-btn{width:30px;height:30px;border-radius:8px;border:1px solid #273146;background:#121928;color:#97a3b7;cursor:pointer;font-size:14px;display:grid;place-items:center;transition:.13s}
.ap-ico-btn:hover{background:#1a2435;color:#eef4fb}

/* Tabs */
.ap-tabs{display:flex;gap:0;padding:0 12px;border-bottom:1px solid #1e2b3a;background:rgba(6,9,16,.7);flex-shrink:0;overflow-x:auto}
.ap-tab{padding:11px 13px;border:none;background:none;color:#6a7890;font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent;transition:.13s;white-space:nowrap;flex-shrink:0;font-family:inherit}
.ap-tab:hover{color:#c8d8f0}
.ap-tab.on{color:#d8ff47;border-bottom-color:#d8ff47}

/* Body */
.ap-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:18px 18px 32px}
.ap-sec{font-size:10px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:#6a7890;margin:20px 0 11px;display:flex;align-items:center;gap:8px}
.ap-sec:first-child{margin-top:0}
.ap-sec::after{content:'';flex:1;height:1px;background:#1e2b3a}
.ap-f{margin-bottom:11px}
.ap-lbl{display:block;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#6a7890;margin-bottom:5px}
.ap-in,.ap-ta,.ap-sel{width:100%;padding:9px 11px;border-radius:10px;border:1px solid #1e2b3a;background:#0e1520;color:#eef4fb;outline:none;font-size:13px;transition:.13s;font-family:inherit;box-sizing:border-box}
.ap-in:focus,.ap-ta:focus,.ap-sel:focus{border-color:rgba(216,255,71,.35);box-shadow:0 0 0 3px rgba(216,255,71,.06)}
.ap-ta{resize:vertical;min-height:64px}
.ap-sel option{background:#0e1520}
.ap-2col{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.ap-3col{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px}

/* Buttons */
.ap-btn{padding:8px 14px;border-radius:9px;border:none;font-size:12px;font-weight:800;cursor:pointer;transition:.13s;display:inline-flex;align-items:center;gap:6px;font-family:inherit;white-space:nowrap}
.ap-btn-accent{background:#d8ff47;color:#0a0d12}.ap-btn-accent:hover{background:#c8ef36}
.ap-btn-sec{background:#0e1520;border:1px solid #1e2b3a;color:#eef4fb}.ap-btn-sec:hover{background:#172030}
.ap-btn-red{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#f87171}.ap-btn-red:hover{background:rgba(239,68,68,.18)}
.ap-btn-green{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);color:#4ade80}.ap-btn-green:hover{background:rgba(34,197,94,.18)}
.ap-btn-blue{background:rgba(101,194,255,.1);border:1px solid rgba(101,194,255,.2);color:#7ec7ff}.ap-btn-blue:hover{background:rgba(101,194,255,.18)}
.ap-btn:disabled{opacity:.5;cursor:not-allowed}
.ap-btns{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px}

/* Color picker */
.ap-color-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:9px}
.ap-color-wrap{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:10px;border:1px solid #1e2b3a;background:#0e1520}
.ap-swatch{width:24px;height:24px;border-radius:6px;border:none;cursor:pointer;padding:0;background:none;flex-shrink:0}
.ap-hex{flex:1;background:none;border:none;color:#eef4fb;font-size:12px;outline:none;font-family:'JetBrains Mono','Fira Code',monospace;min-width:0}

/* List rows */
.ap-li{display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:9px;border:1px solid #1e2b3a;background:#0e1520;margin-bottom:5px}
.ap-li input{flex:1;background:none;border:none;color:#eef4fb;font-size:13px;outline:none;font-family:inherit;min-width:0}
.ap-li-del{width:22px;height:22px;border-radius:6px;border:1px solid rgba(239,68,68,.18);background:rgba(239,68,68,.07);color:#f87171;cursor:pointer;font-size:11px;display:grid;place-items:center;flex-shrink:0;transition:.13s}
.ap-li-del:hover{background:rgba(239,68,68,.16)}
.ap-add-row{width:100%;padding:8px;border-radius:9px;border:1px dashed #1e2b3a;background:none;color:#6a7890;font-size:12px;font-weight:700;cursor:pointer;transition:.13s;font-family:inherit;margin-top:4px;box-sizing:border-box}
.ap-add-row:hover{border-color:rgba(216,255,71,.3);color:#d8ff47}

/* Accordion card */
.ap-card{border-radius:12px;border:1px solid #1e2b3a;background:#0e1520;margin-bottom:8px;overflow:hidden}
.ap-card-head{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;cursor:pointer;user-select:none;transition:.13s}
.ap-card-head:hover{background:#131d2a}
.ap-card-head-l{display:flex;align-items:center;gap:8px;min-width:0}
.ap-card-title{font-size:13px;font-weight:800;color:#e8f0fc;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ap-cat-tag{font-size:9px;font-weight:800;padding:2px 6px;border-radius:4px;background:#162030;color:#6a8aaa;letter-spacing:.07em;text-transform:uppercase;flex-shrink:0}
.ap-card-body{padding:0 14px 14px;animation:apFI .15s ease}
.ap-step{padding:9px;border-radius:9px;border:1px solid #162030;background:#0a1018;margin-bottom:6px}
.ap-step-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px}
.ap-step-lbl{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;background:rgba(216,255,71,.07);border:1px solid rgba(216,255,71,.14);color:#d8ff47;font-size:11px;font-weight:900}
.ap-dline{display:flex;align-items:flex-start;gap:5px;margin-bottom:5px}
.ap-role-sel{width:44px;padding:4px 5px;border-radius:6px;border:1px solid #1e2b3a;background:#0a1018;font-size:11px;font-weight:900;cursor:pointer;outline:none;transition:.13s;font-family:inherit}
.ap-role-sel.client{color:#98a2b3}.ap-role-sel.manager{color:#7ec7ff}

/* Pages tab */
.ap-page-list{display:flex;flex-direction:column;gap:7px;margin-bottom:14px}
.ap-page-row{display:flex;align-items:center;gap:8px;padding:10px 13px;border-radius:12px;border:1px solid #1e2b3a;background:#0e1520;transition:.13s;cursor:pointer}
.ap-page-row:hover{background:#131d2a;border-color:#2e3f55}
.ap-page-row.selected{border-color:rgba(216,255,71,.3);background:rgba(216,255,71,.05)}
.ap-page-row-icon{font-size:20px;flex-shrink:0}
.ap-page-row-info{flex:1;min-width:0}
.ap-page-row-title{font-size:13px;font-weight:800;color:#eef4fb;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ap-page-row-desc{font-size:12px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px}
.ap-page-row-count{font-size:11px;color:#6a7890;flex-shrink:0;padding:2px 7px;background:#162030;border-radius:6px}
.ap-page-row-actions{display:flex;gap:5px;flex-shrink:0}

/* Block editor */
.ap-block-list{display:flex;flex-direction:column;gap:6px}
.ap-block-row{border-radius:10px;border:1px solid #1e2b3a;background:#0e1520;overflow:hidden}
.ap-block-row-head{display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;user-select:none;transition:.13s}
.ap-block-row-head:hover{background:#131d2a}
.ap-block-type-icon{font-size:16px;flex-shrink:0}
.ap-block-type-label{font-size:12px;font-weight:800;color:#eef4fb;flex:1}
.ap-block-row-actions{display:flex;gap:4px;flex-shrink:0}
.ap-move-btn{width:22px;height:22px;border-radius:5px;border:1px solid #273146;background:#0a1018;color:#97a3b7;cursor:pointer;font-size:11px;display:grid;place-items:center;transition:.12s}
.ap-move-btn:hover{background:#1e2a3a;color:#eef4fb}
.ap-block-body{padding:0 12px 12px;animation:apFI .15s ease}

/* Block picker */
.ap-block-picker{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:8px;margin-top:12px}
.ap-bp-item{display:flex;align-items:flex-start;gap:10px;padding:11px 12px;border-radius:11px;border:1px solid #1e2b3a;background:#0e1520;cursor:pointer;transition:.13s;text-align:left}
.ap-bp-item:hover{border-color:rgba(216,255,71,.3);background:rgba(216,255,71,.04)}
.ap-bp-icon{font-size:20px;flex-shrink:0;margin-top:1px}
.ap-bp-label{font-size:13px;font-weight:800;color:#eef4fb;margin-bottom:2px}
.ap-bp-desc{font-size:11px;color:var(--muted);line-height:1.45}

/* Info */
.ap-info{padding:12px 14px;border-radius:11px;border:1px solid #1e2b3a;background:#0e1520;font-size:13px;color:#97a3b7;line-height:1.7;margin-bottom:11px}
.ap-info code{background:#0a1018;padding:1px 5px;border-radius:4px;color:#d8ff47;font-size:11px}
.ap-flash{padding:9px 12px;border-radius:9px;margin-bottom:11px;font-size:13px;font-weight:700;animation:apFI .2s ease}
.ap-flash.ok{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.22);color:#4ade80}
.ap-flash.err{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.22);color:#f87171}
.ap-pwd-box{padding:14px;border-radius:12px;border:1px solid #1e2b3a;background:#0e1520;margin-bottom:11px}
.ap-pwd-box-title{font-size:13px;font-weight:800;color:#e8f0fc;margin-bottom:12px}
.ap-eye-wrap{position:relative}
.ap-eye-wrap .ap-in{padding-right:38px}
.ap-eye-btn{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:13px;color:#6a7890}
`;

/* ─── LOGIN ──────────────────────────────────────────────────── */
function LoginScreen({ onSuccess, onClose }) {
  const [login,   setLogin]   = useState('');
  const [pwd,     setPwd]     = useState('');
  const [showPwd, setShow]    = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const submit = e => {
    e.preventDefault(); setLoading(true); setError('');
    setTimeout(() => {
      const c = getCreds();
      if (login.trim() === c.login && pwd === c.password) { openSession(); onSuccess(); }
      else setError('Неверный логин или пароль');
      setLoading(false);
    }, 380);
  };

  return (
    <div className="ap-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <style>{css}</style>
      <div className="ap-login-wrap">
        <div className="ap-login">
          <div className="ap-login-logo">Underground Fitness Academy</div>
          <div className="ap-login-title">Панель администратора</div>
          <div className="ap-login-sub">Введите логин и пароль для редактирования.</div>
          {error && <div className="ap-login-err">⚠ {error}</div>}
          <form onSubmit={submit}>
            <div className="ap-f">
              <label className="ap-login-lbl">Логин</label>
              <input className={`ap-login-inp${error?' err':''}`} type="text" placeholder="admin"
                value={login} onChange={e=>{setLogin(e.target.value);setError('');}} autoFocus autoComplete="username" />
            </div>
            <div className="ap-f" style={{position:'relative'}}>
              <label className="ap-login-lbl">Пароль</label>
              <div className="ap-eye-wrap">
                <input className={`ap-login-inp${error?' err':''}`} type={showPwd?'text':'password'} placeholder="••••••••"
                  value={pwd} onChange={e=>{setPwd(e.target.value);setError('');}} autoComplete="current-password" />
                <button type="button" className="ap-eye-btn" onClick={()=>setShow(v=>!v)}>{showPwd?'🙈':'👁'}</button>
              </div>
            </div>
            <button className="ap-login-btn" type="submit" disabled={loading||!login||!pwd}>
              {loading ? '⏳ Проверка…' : '🔓 Войти'}
            </button>
          </form>
          <button className="ap-cancel" onClick={onClose}>Отмена</button>
          <div className="ap-hint">По умолчанию: логин <code>admin</code>, пароль <code>uf2024</code></div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PANEL ─────────────────────────────────────────────── */
export default function AdminPanel({ data, onUpdate, onReset, onExport, onImport, onClose, onNavigate }) {
  const [authed,  setAuthed]  = useState(() => hasSession());
  const [tab,     setTab]     = useState('pages');
  const [saved,   setSaved]   = useState(false);
  const [expObj,  setExpObj]  = useState(null);

  const save = useCallback((path, val) => {
    onUpdate(path, val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [onUpdate]);

  const logout = () => { closeSession(); setAuthed(false); };

  const handleImport = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { if (onImport(ev.target.result)) { setSaved(true); setTimeout(()=>setSaved(false),2000); } };
    r.readAsText(f);
  };

  if (!authed) return <LoginScreen onSuccess={()=>setAuthed(true)} onClose={onClose} />;

  const TABS = [
    {id:'pages',   label:'📄 Страницы'},
    {id:'theme',   label:'🎨 Тема'},
    {id:'company', label:'🏢 Компания'},
    {id:'obj',     label:'🎯 Возражения'},
    {id:'sales',   label:'💬 Продажи'},
    {id:'crm',     label:'📊 CRM'},
    {id:'access',  label:'🔑 Доступ'},
    {id:'data',    label:'💾 Данные'},
  ];

  return (
    <div className="ap-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <style>{css}</style>
      <div className="ap-panel">
        <div className="ap-head">
          <div className="ap-head-l">
            <span className="ap-head-title">⚙️ <em>Админ</em>-панель</span>
            <span className="ap-user-badge">👤 {getCreds().login}</span>
          </div>
          <div className="ap-head-r">
            {saved && <span className="ap-saved">✓ Сохранено</span>}
            <button className="ap-ico-btn" title="Выйти" onClick={logout}>🚪</button>
            <button className="ap-ico-btn" title="Закрыть" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="ap-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`ap-tab${tab===t.id?' on':''}`} onClick={()=>setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="ap-body">
          {tab==='pages'   && <PagesTab    data={data} save={save} onNavigate={onNavigate} onClose={onClose} />}
          {tab==='theme'   && <ThemeTab    data={data} save={save} />}
          {tab==='company' && <CompanyTab  data={data} save={save} />}
          {tab==='obj'     && <ObjTab      data={data} save={save} expObj={expObj} setExpObj={setExpObj} />}
          {tab==='sales'   && <SalesTab    data={data} save={save} />}
          {tab==='crm'     && <CrmTab      data={data} save={save} />}
          {tab==='access'  && <AccessTab   logout={logout} />}
          {tab==='data'    && <DataTab     data={data} onReset={onReset} onExport={onExport} onImport={handleImport} />}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGES TAB  — full page builder
══════════════════════════════════════════════════════════════ */
function PagesTab({ data, save, onNavigate, onClose }) {
  const pages = data.customPages || [];
  const [selectedId, setSelectedId] = useState(null);
  const [showPicker,  setShowPicker] = useState(false);
  const [expandedBlock, setExpandedBlock] = useState(null);

  const selected = pages.find(p => p.id === selectedId);

  const updPages = newPages => save(['customPages'], newPages);

  const addPage = () => {
    const p = {
      id: `page_${Date.now()}`,
      icon: '📄',
      title: 'Новая страница',
      eyebrow: 'МОЙ РАЗДЕЛ',
      description: 'Описание страницы',
      keywords: '',
      blocks: [],
    };
    updPages([...pages, p]);
    setSelectedId(p.id);
    setExpandedBlock(null);
  };

  const deletePage = id => {
    updPages(pages.filter(p => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updatePage = (id, field, val) => {
    updPages(pages.map(p => p.id === id ? {...p, [field]: val} : p));
  };

  const addBlock = type => {
    const block = makeBlock(type);
    const newPages = pages.map(p => p.id === selectedId
      ? {...p, blocks: [...(p.blocks || []), block]}
      : p
    );
    updPages(newPages);
    setExpandedBlock(block.id);
    setShowPicker(false);
  };

  const deleteBlock = bid => {
    updPages(pages.map(p => p.id === selectedId
      ? {...p, blocks: (p.blocks || []).filter(b => b.id !== bid)}
      : p
    ));
    if (expandedBlock === bid) setExpandedBlock(null);
  };

  const updateBlock = (bid, newBlock) => {
    updPages(pages.map(p => p.id === selectedId
      ? {...p, blocks: (p.blocks || []).map(b => b.id === bid ? newBlock : b)}
      : p
    ));
  };

  const moveBlock = (bid, dir) => {
    const blocks = [...(selected?.blocks || [])];
    const idx = blocks.findIndex(b => b.id === bid);
    if (dir === 'up' && idx > 0) { [blocks[idx-1], blocks[idx]] = [blocks[idx], blocks[idx-1]]; }
    else if (dir === 'down' && idx < blocks.length-1) { [blocks[idx], blocks[idx+1]] = [blocks[idx+1], blocks[idx]]; }
    else return;
    updPages(pages.map(p => p.id === selectedId ? {...p, blocks} : p));
  };

  const dupPage = p => {
    const n = {...JSON.parse(JSON.stringify(p)), id:`page_${Date.now()}`, title: p.title+' (копия)'};
    n.blocks = n.blocks.map(b => ({...b, id: uid()}));
    updPages([...pages, n]);
    setSelectedId(n.id);
  };

  // Page list view
  if (!selected) {
    return (
      <>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <span className="ap-sec" style={{margin:0,flex:1}}>Мои страницы ({pages.length})</span>
          <button className="ap-btn ap-btn-accent" onClick={addPage}>+ Создать страницу</button>
        </div>

        {pages.length === 0 && (
          <div className="ap-info" style={{textAlign:'center',padding:'28px 16px'}}>
            <div style={{fontSize:36,marginBottom:10}}>📄</div>
            <div style={{fontSize:14,fontWeight:800,color:'#e8f0fc',marginBottom:6}}>Страниц пока нет</div>
            <div>Нажми «+ Создать страницу» чтобы добавить свой раздел.<br/>Можно создать любое количество страниц: филиалы, скрипты, FAQ и т.д.</div>
          </div>
        )}

        <div className="ap-page-list">
          {pages.map(p => (
            <div key={p.id} className="ap-page-row" onClick={()=>setSelectedId(p.id)}>
              <div className="ap-page-row-icon">{p.icon || '📄'}</div>
              <div className="ap-page-row-info">
                <div className="ap-page-row-title">{p.title}</div>
                {p.description && <div className="ap-page-row-desc">{p.description}</div>}
              </div>
              <div className="ap-page-row-count">{(p.blocks||[]).length} блоков</div>
              <div className="ap-page-row-actions" onClick={e=>e.stopPropagation()}>
                <button className="ap-btn ap-btn-blue" style={{padding:'4px 9px',fontSize:11}}
                  onClick={()=>{ onNavigate && onNavigate(p.id); onClose && onClose(); }}>
                  👁 Смотреть
                </button>
                <button className="ap-btn ap-btn-sec" style={{padding:'4px 9px',fontSize:11}} onClick={()=>dupPage(p)}>⎘</button>
                <button className="ap-btn ap-btn-red" style={{padding:'4px 9px',fontSize:11}}
                  onClick={()=>{ if(window.confirm(`Удалить страницу "${p.title}"?`)) deletePage(p.id); }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  // Page editor view
  const blocks = selected.blocks || [];
  const BLOCK_TYPE_MAP = Object.fromEntries(BLOCK_TYPES.map(b => [b.type, b]));

  return (
    <>
      {/* Back button */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
        <button className="ap-btn ap-btn-sec" onClick={()=>{setSelectedId(null);setExpandedBlock(null);}}>← Назад</button>
        <span style={{color:'var(--muted)',fontSize:13}}>{selected.icon} {selected.title}</span>
        <div style={{flex:1}}/>
        <button className="ap-btn ap-btn-blue" style={{fontSize:12}}
          onClick={()=>{ onNavigate && onNavigate(selected.id); onClose && onClose(); }}>
          👁 Открыть страницу
        </button>
        <button className="ap-btn ap-btn-red" style={{fontSize:12}}
          onClick={()=>{ if(window.confirm(`Удалить страницу "${selected.title}"?`)) { deletePage(selected.id); setSelectedId(null); } }}>
          🗑 Удалить
        </button>
      </div>

      {/* Page meta */}
      <div className="ap-sec">Настройки страницы</div>
      <div className="ap-2col">
        <div className="ap-f">
          <label className="ap-lbl">Иконка (эмодзи)</label>
          <input className="ap-in" value={selected.icon||''} onChange={e=>updatePage(selected.id,'icon',e.target.value)} />
        </div>
        <div className="ap-f">
          <label className="ap-lbl">Плашка (eyebrow)</label>
          <input className="ap-in" value={selected.eyebrow||''} onChange={e=>updatePage(selected.id,'eyebrow',e.target.value)} />
        </div>
      </div>
      <div className="ap-f">
        <label className="ap-lbl">Название страницы (в сайдбаре)</label>
        <input className="ap-in" value={selected.title} onChange={e=>updatePage(selected.id,'title',e.target.value)} />
      </div>
      <div className="ap-f">
        <label className="ap-lbl">Описание (под заголовком)</label>
        <textarea className="ap-ta" rows={2} value={selected.description||''} onChange={e=>updatePage(selected.id,'description',e.target.value)} />
      </div>
      <div className="ap-f">
        <label className="ap-lbl">Ключевые слова для поиска</label>
        <input className="ap-in" value={selected.keywords||''} onChange={e=>updatePage(selected.id,'keywords',e.target.value)} placeholder="филиал, адрес, контакты..." />
      </div>

      {/* Blocks */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',margin:'20px 0 11px'}}>
        <span className="ap-sec" style={{margin:0,flex:1}}>Блоки страницы ({blocks.length})</span>
        <button className="ap-btn ap-btn-accent" onClick={()=>setShowPicker(v=>!v)}>
          {showPicker ? '✕ Закрыть' : '+ Добавить блок'}
        </button>
      </div>

      {/* Block type picker */}
      {showPicker && (
        <div style={{marginBottom:16,padding:14,borderRadius:13,border:'1px solid #1e2b3a',background:'#0a1018'}}>
          <div style={{fontSize:12,fontWeight:800,color:'var(--muted)',marginBottom:10,letterSpacing:'.1em',textTransform:'uppercase'}}>Выберите тип блока</div>
          <div className="ap-block-picker">
            {BLOCK_TYPES.map(bt => (
              <button key={bt.type} className="ap-bp-item" onClick={()=>addBlock(bt.type)}>
                <span className="ap-bp-icon">{bt.label.split(' ')[0]}</span>
                <div>
                  <div className="ap-bp-label">{bt.label.split(' ').slice(1).join(' ')}</div>
                  <div className="ap-bp-desc">{bt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Block list */}
      {blocks.length === 0 && !showPicker && (
        <div className="ap-info" style={{textAlign:'center',padding:'20px 14px'}}>
          Нет блоков. Нажми «+ Добавить блок» чтобы наполнить страницу.
        </div>
      )}

      <div className="ap-block-list">
        {blocks.map((block, bi) => {
          const btInfo = BLOCK_TYPE_MAP[block.type] || {label: block.type, desc:''};
          const isOpen = expandedBlock === block.id;
          return (
            <div key={block.id} className="ap-block-row">
              <div className="ap-block-row-head" onClick={()=>setExpandedBlock(isOpen ? null : block.id)}>
                <span className="ap-block-type-icon">{btInfo.label.split(' ')[0]}</span>
                <span className="ap-block-type-label">
                  {btInfo.label.split(' ').slice(1).join(' ')}
                  {block.title ? <span style={{color:'var(--muted)',fontWeight:400,marginLeft:6}}>— {block.title}</span> : null}
                </span>
                <div className="ap-block-row-actions" onClick={e=>e.stopPropagation()}>
                  <button className="ap-move-btn" title="Вверх" disabled={bi===0} onClick={()=>moveBlock(block.id,'up')}>↑</button>
                  <button className="ap-move-btn" title="Вниз" disabled={bi===blocks.length-1} onClick={()=>moveBlock(block.id,'down')}>↓</button>
                  <button className="ap-move-btn" style={{color:'#f87171',borderColor:'rgba(239,68,68,.2)'}} title="Удалить"
                    onClick={()=>{ if(window.confirm('Удалить блок?')) deleteBlock(block.id); }}>✕</button>
                </div>
                <span style={{fontSize:11,color:'#6a7890',marginLeft:4}}>{isOpen?'▲':'▼'}</span>
              </div>
              {isOpen && (
                <div className="ap-block-body">
                  <BlockEditor block={block} onChange={nb=>updateBlock(block.id, nb)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── BLOCK EDITORS ─────────────────────────────────────────── */
function BlockEditor({ block, onChange }) {
  const set = (field, val) => onChange({...block, [field]: val});

  switch(block.type) {
    case 'hero':    return <HeroEditor    block={block} set={set} onChange={onChange} />;
    case 'text':    return <TextEditor    block={block} set={set} />;
    case 'cards':   return <CardsEditor   block={block} set={set} onChange={onChange} />;
    case 'list':    return <ListEditor    block={block} set={set} onChange={onChange} />;
    case 'table':   return <TableEditor   block={block} set={set} onChange={onChange} />;
    case 'steps':   return <StepsEditor   block={block} set={set} onChange={onChange} />;
    case 'alert':   return <AlertEditor   block={block} set={set} />;
    case 'divider': return <DividerEditor block={block} set={set} />;
    case 'stats':   return <StatsEditor   block={block} set={set} onChange={onChange} />;
    case 'links':   return <LinksEditor   block={block} set={set} onChange={onChange} />;
    case 'twoCol':  return <TwoColEditor  block={block} set={set} onChange={onChange} />;
    default:        return <div className="ap-info">Неизвестный тип блока: {block.type}</div>;
  }
}

function HeroEditor({ block, set, onChange }) {
  return (
    <>
      <div className="ap-2col">
        <div className="ap-f"><label className="ap-lbl">Иконка</label><input className="ap-in" value={block.icon||''} onChange={e=>set('icon',e.target.value)} /></div>
        <div className="ap-f"><label className="ap-lbl">Плашка eyebrow</label><input className="ap-in" value={block.eyebrow||''} onChange={e=>set('eyebrow',e.target.value)} /></div>
      </div>
      <div className="ap-f"><label className="ap-lbl">Заголовок</label><input className="ap-in" value={block.title||''} onChange={e=>set('title',e.target.value)} /></div>
      <div className="ap-f"><label className="ap-lbl">Текст</label><textarea className="ap-ta" rows={3} value={block.text||''} onChange={e=>set('text',e.target.value)} /></div>
      <div className="ap-2col">
        <div className="ap-f">
          <label className="ap-lbl">Цвет фона «от»</label>
          <div className="ap-color-wrap">
            <input type="color" className="ap-swatch" value={block.colorFrom?.replace(/rgba?\([^)]+\)/,'') || '#d8ff47'} onChange={e=>set('colorFrom',e.target.value+'22')} />
            <input type="text" className="ap-hex" value={block.colorFrom||''} onChange={e=>set('colorFrom',e.target.value)} />
          </div>
        </div>
        <div className="ap-f">
          <label className="ap-lbl">Цвет фона «до»</label>
          <div className="ap-color-wrap">
            <input type="color" className="ap-swatch" value={block.colorTo?.replace(/rgba?\([^)]+\)/,'') || '#65c2ff'} onChange={e=>set('colorTo',e.target.value+'22')} />
            <input type="text" className="ap-hex" value={block.colorTo||''} onChange={e=>set('colorTo',e.target.value)} />
          </div>
        </div>
      </div>
    </>
  );
}

function TextEditor({ block, set }) {
  return (
    <>
      <div className="ap-2col">
        <div className="ap-f"><label className="ap-lbl">Иконка</label><input className="ap-in" value={block.icon||''} onChange={e=>set('icon',e.target.value)} /></div>
        <div className="ap-f"><label className="ap-lbl">Заголовок</label><input className="ap-in" value={block.title||''} onChange={e=>set('title',e.target.value)} /></div>
      </div>
      <div className="ap-f"><label className="ap-lbl">Содержимое (поддерживает переносы строк)</label>
        <textarea className="ap-ta" rows={6} value={block.content||''} onChange={e=>set('content',e.target.value)} style={{minHeight:120}} /></div>
    </>
  );
}

function CardsEditor({ block, set, onChange }) {
  const items = block.items || [];
  const updItem = (i, f, v) => set('items', items.map((x,idx)=>idx===i?{...x,[f]:v}:x));
  return (
    <>
      <div className="ap-2col">
        <div className="ap-f"><label className="ap-lbl">Заголовок группы</label><input className="ap-in" value={block.title||''} onChange={e=>set('title',e.target.value)} /></div>
        <div className="ap-f"><label className="ap-lbl">Колонок (1-4)</label>
          <select className="ap-sel" value={block.columns||2} onChange={e=>set('columns',Number(e.target.value))}>
            <option value={1}>1 колонка</option><option value={2}>2 колонки</option>
            <option value={3}>3 колонки</option><option value={4}>4 колонки</option>
          </select>
        </div>
      </div>
      {items.map((item,i) => (
        <div key={i} className="ap-step" style={{marginBottom:8}}>
          <div className="ap-step-head">
            <span className="ap-step-lbl">Карточка {i+1}</span>
            <button className="ap-btn ap-btn-red" style={{padding:'3px 8px',fontSize:11}} onClick={()=>set('items',items.filter((_,idx)=>idx!==i))}>✕</button>
          </div>
          <div className="ap-2col">
            <div className="ap-f"><label className="ap-lbl">Иконка</label><input className="ap-in" value={item.icon||''} onChange={e=>updItem(i,'icon',e.target.value)} /></div>
            <div className="ap-f"><label className="ap-lbl">Тег (badge)</label><input className="ap-in" value={item.badge||''} onChange={e=>updItem(i,'badge',e.target.value)} /></div>
          </div>
          <div className="ap-f"><label className="ap-lbl">Заголовок карточки</label><input className="ap-in" value={item.title||''} onChange={e=>updItem(i,'title',e.target.value)} /></div>
          <div className="ap-f"><label className="ap-lbl">Текст</label><textarea className="ap-ta" rows={2} value={item.text||''} onChange={e=>updItem(i,'text',e.target.value)} /></div>
        </div>
      ))}
      <button className="ap-add-row" onClick={()=>set('items',[...items,{icon:'⭐',title:'Новая карточка',text:'',badge:''}])}>+ Карточка</button>
    </>
  );
}

function ListEditor({ block, set, onChange }) {
  const items = block.items || [];
  const isObj = items.length > 0 && typeof items[0] === 'object';
  return (
    <>
      <div className="ap-2col">
        <div className="ap-f"><label className="ap-lbl">Иконка</label><input className="ap-in" value={block.icon||''} onChange={e=>set('icon',e.target.value)} /></div>
        <div className="ap-f"><label className="ap-lbl">Заголовок</label><input className="ap-in" value={block.title||''} onChange={e=>set('title',e.target.value)} /></div>
      </div>
      <div className="ap-f"><label className="ap-lbl">Стиль</label>
        <select className="ap-sel" value={block.style||'bullet'} onChange={e=>set('style',e.target.value)}>
          <option value="bullet">• Буллет</option><option value="check">✓ Чекбокс</option>
          <option value="number">1 Нумерация</option><option value="arrow">→ Стрелка</option>
        </select>
      </div>
      <div className="ap-f"><label className="ap-lbl">Режим пунктов</label>
        <select className="ap-sel" value={isObj?'rich':'simple'} onChange={e=>{
          if(e.target.value==='rich') set('items',items.map(x=>typeof x==='string'?{title:x,text:''}:x));
          else set('items',items.map(x=>typeof x==='object'?x.title||'':x));
        }}>
          <option value="simple">Простой (только текст)</option>
          <option value="rich">Расширенный (заголовок + текст)</option>
        </select>
      </div>
      {items.map((item,i)=> (
        isObj
          ? <div key={i} className="ap-step" style={{marginBottom:6}}>
              <div className="ap-step-head">
                <span className="ap-step-lbl">Пункт {i+1}</span>
                <button className="ap-btn ap-btn-red" style={{padding:'3px 8px',fontSize:11}} onClick={()=>set('items',items.filter((_,idx)=>idx!==i))}>✕</button>
              </div>
              <div className="ap-f"><label className="ap-lbl">Заголовок</label><input className="ap-in" value={item.title||''} onChange={e=>set('items',items.map((x,idx)=>idx===i?{...x,title:e.target.value}:x))} /></div>
              <div className="ap-f"><label className="ap-lbl">Описание</label><textarea className="ap-ta" rows={2} value={item.text||''} onChange={e=>set('items',items.map((x,idx)=>idx===i?{...x,text:e.target.value}:x))} /></div>
            </div>
          : <div key={i} className="ap-li">
              <input value={item} onChange={e=>set('items',items.map((x,idx)=>idx===i?e.target.value:x))} />
              <button className="ap-li-del" onClick={()=>set('items',items.filter((_,idx)=>idx!==i))}>✕</button>
            </div>
      ))}
      <button className="ap-add-row" onClick={()=>set('items',[...items, isObj?{title:'Новый пункт',text:''}:'Новый пункт'])}>+ Пункт</button>
    </>
  );
}

function TableEditor({ block, set, onChange }) {
  const headers = block.headers || [];
  const rows    = block.rows    || [];
  const cols    = headers.length || 2;
  return (
    <>
      <div className="ap-2col">
        <div className="ap-f"><label className="ap-lbl">Иконка</label><input className="ap-in" value={block.icon||''} onChange={e=>set('icon',e.target.value)} /></div>
        <div className="ap-f"><label className="ap-lbl">Заголовок</label><input className="ap-in" value={block.title||''} onChange={e=>set('title',e.target.value)} /></div>
      </div>
      <div className="ap-sec">Заголовки колонок</div>
      <div style={{display:'flex',gap:6,marginBottom:8,flexWrap:'wrap'}}>
        {headers.map((h,i)=>(
          <div key={i} className="ap-li" style={{flex:'1 1 120px'}}>
            <input value={h} onChange={e=>set('headers',headers.map((v,idx)=>idx===i?e.target.value:v))} />
            <button className="ap-li-del" onClick={()=>{
              set('headers',headers.filter((_,idx)=>idx!==i));
              set('rows',rows.map(r=>Array.isArray(r)?r.filter((_,idx)=>idx!==i):[r]));
            }}>✕</button>
          </div>
        ))}
        <button className="ap-add-row" style={{flex:'0 0 auto',minWidth:100}} onClick={()=>{
          set('headers',[...headers,'Колонка']);
          set('rows',rows.map(r=>Array.isArray(r)?[...r,'']:['',r,'']));
        }}>+ Колонка</button>
      </div>
      <div className="ap-sec">Строки</div>
      {rows.map((row,ri)=>{
        const cells = Array.isArray(row) ? row : [row];
        return (
          <div key={ri} style={{display:'flex',gap:5,marginBottom:5,alignItems:'center'}}>
            {Array.from({length:cols}).map((_,ci)=>(
              <input key={ci} className="ap-in" style={{flex:1,minWidth:0}} value={cells[ci]||''} onChange={e=>{
                const nr = Array.from({length:cols},(_,idx)=>idx===ci?e.target.value:(cells[idx]||''));
                set('rows',rows.map((v,idx)=>idx===ri?nr:v));
              }} />
            ))}
            <button className="ap-li-del" onClick={()=>set('rows',rows.filter((_,idx)=>idx!==ri))}>✕</button>
          </div>
        );
      })}
      <button className="ap-add-row" onClick={()=>set('rows',[...rows,Array(cols).fill('')])}>+ Строка</button>
    </>
  );
}

function StepsEditor({ block, set, onChange }) {
  const items = block.items || [];
  return (
    <>
      <div className="ap-f"><label className="ap-lbl">Заголовок группы</label><input className="ap-in" value={block.title||''} onChange={e=>set('title',e.target.value)} /></div>
      {items.map((step,i)=>(
        <div key={i} className="ap-step" style={{marginBottom:7}}>
          <div className="ap-step-head">
            <span className="ap-step-lbl">Шаг {step.num||i+1}</span>
            <button className="ap-btn ap-btn-red" style={{padding:'3px 8px',fontSize:11}} onClick={()=>set('items',items.filter((_,idx)=>idx!==i))}>✕</button>
          </div>
          <div className="ap-2col">
            <div className="ap-f"><label className="ap-lbl">Номер</label><input className="ap-in" value={step.num||i+1} onChange={e=>set('items',items.map((x,idx)=>idx===i?{...x,num:e.target.value}:x))} /></div>
            <div className="ap-f"><label className="ap-lbl">Заголовок шага</label><input className="ap-in" value={step.title||''} onChange={e=>set('items',items.map((x,idx)=>idx===i?{...x,title:e.target.value}:x))} /></div>
          </div>
          <div className="ap-f"><label className="ap-lbl">Описание</label><textarea className="ap-ta" rows={2} value={step.text||''} onChange={e=>set('items',items.map((x,idx)=>idx===i?{...x,text:e.target.value}:x))} /></div>
        </div>
      ))}
      <button className="ap-add-row" onClick={()=>set('items',[...items,{num:items.length+1,title:'Новый шаг',text:''}])}>+ Шаг</button>
    </>
  );
}

function AlertEditor({ block, set }) {
  return (
    <>
      <div className="ap-2col">
        <div className="ap-f"><label className="ap-lbl">Тип</label>
          <select className="ap-sel" value={block.variant||'info'} onChange={e=>set('variant',e.target.value)}>
            <option value="info">ℹ️ Инфо (синий)</option>
            <option value="success">✅ Успех (зелёный)</option>
            <option value="warn">⚠️ Внимание (жёлтый)</option>
            <option value="danger">🚫 Опасность (красный)</option>
            <option value="accent">⚡ Акцент (жёлто-зелёный)</option>
          </select>
        </div>
        <div className="ap-f"><label className="ap-lbl">Иконка</label><input className="ap-in" value={block.icon||''} onChange={e=>set('icon',e.target.value)} /></div>
      </div>
      <div className="ap-f"><label className="ap-lbl">Заголовок</label><input className="ap-in" value={block.title||''} onChange={e=>set('title',e.target.value)} /></div>
      <div className="ap-f"><label className="ap-lbl">Текст</label><textarea className="ap-ta" rows={3} value={block.text||''} onChange={e=>set('text',e.target.value)} /></div>
    </>
  );
}

function DividerEditor({ block, set }) {
  return (
    <div className="ap-f"><label className="ap-lbl">Текст разделителя (необязательно)</label>
      <input className="ap-in" value={block.label||''} onChange={e=>set('label',e.target.value)} placeholder="Например: Дополнительно" /></div>
  );
}

function StatsEditor({ block, set, onChange }) {
  const items = block.items || [];
  return (
    <>
      <div className="ap-f"><label className="ap-lbl">Заголовок группы</label><input className="ap-in" value={block.title||''} onChange={e=>set('title',e.target.value)} /></div>
      {items.map((s,i)=>(
        <div key={i} className="ap-li">
          <input style={{width:90,flex:'0 0 90px'}} value={s.value} onChange={e=>set('items',items.map((x,idx)=>idx===i?{...x,value:e.target.value}:x))} placeholder="100%" />
          <input style={{flex:1}} value={s.label} onChange={e=>set('items',items.map((x,idx)=>idx===i?{...x,label:e.target.value}:x))} placeholder="Подпись" />
          <button className="ap-li-del" onClick={()=>set('items',items.filter((_,idx)=>idx!==i))}>✕</button>
        </div>
      ))}
      <button className="ap-add-row" onClick={()=>set('items',[...items,{value:'—',label:'Показатель'}])}>+ Показатель</button>
    </>
  );
}

function LinksEditor({ block, set, onChange }) {
  const items = block.items || [];
  const updItem = (i,f,v)=>set('items',items.map((x,idx)=>idx===i?{...x,[f]:v}:x));
  return (
    <>
      <div className="ap-2col">
        <div className="ap-f"><label className="ap-lbl">Иконка</label><input className="ap-in" value={block.icon||''} onChange={e=>set('icon',e.target.value)} /></div>
        <div className="ap-f"><label className="ap-lbl">Заголовок</label><input className="ap-in" value={block.title||''} onChange={e=>set('title',e.target.value)} /></div>
      </div>
      {items.map((link,i)=>(
        <div key={i} className="ap-step" style={{marginBottom:7}}>
          <div className="ap-step-head">
            <span className="ap-step-lbl">{link.icon||'🔗'} Ссылка {i+1}</span>
            <button className="ap-btn ap-btn-red" style={{padding:'3px 8px',fontSize:11}} onClick={()=>set('items',items.filter((_,idx)=>idx!==i))}>✕</button>
          </div>
          <div className="ap-2col">
            <div className="ap-f"><label className="ap-lbl">Иконка</label><input className="ap-in" value={link.icon||''} onChange={e=>updItem(i,'icon',e.target.value)} /></div>
            <div className="ap-f"><label className="ap-lbl">Название</label><input className="ap-in" value={link.title||''} onChange={e=>updItem(i,'title',e.target.value)} /></div>
          </div>
          <div className="ap-f"><label className="ap-lbl">URL</label><input className="ap-in" value={link.url||''} onChange={e=>updItem(i,'url',e.target.value)} placeholder="https://..." /></div>
          <div className="ap-f"><label className="ap-lbl">Описание</label><input className="ap-in" value={link.desc||''} onChange={e=>updItem(i,'desc',e.target.value)} /></div>
        </div>
      ))}
      <button className="ap-add-row" onClick={()=>set('items',[...items,{icon:'📄',title:'Новая ссылка',desc:'',url:'#'}])}>+ Ссылка</button>
    </>
  );
}

function TwoColEditor({ block, set, onChange }) {
  const cols = block.columns || [{icon:'',title:'',text:''},{icon:'',title:'',text:''}];
  const updCol = (i,f,v)=>set('columns',cols.map((x,idx)=>idx===i?{...x,[f]:v}:x));
  return (
    <>
      {[0,1].map(i=>(
        <div key={i} className="ap-step" style={{marginBottom:8}}>
          <div className="ap-step-head"><span className="ap-step-lbl">{i===0?'Левый':'Правый'} столбец</span></div>
          <div className="ap-2col">
            <div className="ap-f"><label className="ap-lbl">Иконка</label><input className="ap-in" value={cols[i]?.icon||''} onChange={e=>updCol(i,'icon',e.target.value)} /></div>
            <div className="ap-f"><label className="ap-lbl">Заголовок</label><input className="ap-in" value={cols[i]?.title||''} onChange={e=>updCol(i,'title',e.target.value)} /></div>
          </div>
          <div className="ap-f"><label className="ap-lbl">Текст</label><textarea className="ap-ta" rows={4} value={cols[i]?.text||''} onChange={e=>updCol(i,'text',e.target.value)} /></div>
        </div>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   THEME TAB
══════════════════════════════════════════════════════════════ */
function ThemeTab({ data, save }) {
  const t = data.theme;
  return (<>
    <div className="ap-sec">Цветовые переменные</div>
    <div className="ap-color-grid">
      {COLOR_KEYS.map(({key,label})=>(
        <div key={key} className="ap-f">
          <label className="ap-lbl">{label}</label>
          <div className="ap-color-wrap">
            <input type="color" className="ap-swatch" value={t[key]||'#000'} onChange={e=>save(['theme',key],e.target.value)} />
            <input type="text" className="ap-hex" value={t[key]||''} onChange={e=>save(['theme',key],e.target.value)} />
          </div>
        </div>
      ))}
    </div>
    <div className="ap-sec">Шрифт</div>
    <div className="ap-f">
      <label className="ap-lbl">Семейство</label>
      <select className="ap-sel" value={t.fontFamily} onChange={e=>save(['theme','fontFamily'],e.target.value)}>
        {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
      </select>
    </div>
    <div className="ap-sec">Пресеты палитры</div>
    <div className="ap-btns">
      {PRESETS.map(pr=>(
        <button key={pr.label} className="ap-btn ap-btn-sec"
          onClick={()=>Object.entries(pr.p).forEach(([k,v])=>save(['theme',k],v))}>
          {pr.label}
        </button>
      ))}
    </div>
  </>);
}

/* ══════════════════════════════════════════════════════════════
   COMPANY TAB
══════════════════════════════════════════════════════════════ */
function CompanyTab({ data, save }) {
  const co = data.company;
  return (<>
    <div className="ap-sec">Основное</div>
    <div className="ap-f"><label className="ap-lbl">Название</label><input className="ap-in" value={co.name} onChange={e=>save(['company','name'],e.target.value)} /></div>
    <div className="ap-f"><label className="ap-lbl">Описание сайдбара</label><textarea className="ap-ta" rows={3} value={co.description} onChange={e=>save(['company','description'],e.target.value)} /></div>
    <div className="ap-sec">Статистика</div>
    <div className="ap-2col">
      {co.stats.map((s,i)=>(
        <React.Fragment key={i}>
          <div className="ap-f"><label className="ap-lbl">Значение {i+1}</label><input className="ap-in" value={s.value} onChange={e=>save(['company','stats'],co.stats.map((x,idx)=>idx===i?{...x,value:e.target.value}:x))} /></div>
          <div className="ap-f"><label className="ap-lbl">Подпись {i+1}</label><input className="ap-in" value={s.label} onChange={e=>save(['company','stats'],co.stats.map((x,idx)=>idx===i?{...x,label:e.target.value}:x))} /></div>
        </React.Fragment>
      ))}
    </div>
    <div className="ap-sec">Ценности</div>
    {co.values.map((v,i)=>(
      <div key={i} className="ap-card" style={{marginBottom:7}}>
        <div style={{padding:'10px 12px'}}>
          <div className="ap-f"><label className="ap-lbl">Заголовок {i+1}</label><input className="ap-in" value={v.title} onChange={e=>save(['company','values'],co.values.map((x,idx)=>idx===i?{...x,title:e.target.value}:x))} /></div>
          <div className="ap-f"><label className="ap-lbl">Описание</label><textarea className="ap-ta" rows={2} value={v.desc} onChange={e=>save(['company','values'],co.values.map((x,idx)=>idx===i?{...x,desc:e.target.value}:x))} /></div>
        </div>
      </div>
    ))}
  </>);
}

/* ══════════════════════════════════════════════════════════════
   OBJECTIONS TAB
══════════════════════════════════════════════════════════════ */
function ObjTab({ data, save, expObj, setExpObj }) {
  const objs = (data.objections||[]).filter(o=>!o.isRule);
  const updObjs = list => save(['objections'],[...(data.objections||[]).filter(o=>o.isRule),...list]);
  const addObj = ()=>{
    const n={id:`obj_${Date.now()}`,icon:'💬',title:'Новое возражение',category:'classic',homeDesc:'Описание.',principle:'Принцип.',tip:'',
      steps:[{label:'1',lines:[{role:'client',text:'Клиент'},{role:'manager',text:'Менеджер'}]}]};
    updObjs([...objs,n]); setExpObj(n.id);
  };
  const upd=(id,f,v)=>updObjs(objs.map(o=>o.id===id?{...o,[f]:v}:o));
  const del=id=>updObjs(objs.filter(o=>o.id!==id));
  const addStep=id=>{const o=objs.find(x=>x.id===id);upd(id,'steps',[...(o.steps||[]),{label:String((o.steps?.length||0)+1),lines:[{role:'manager',text:''}]}]);};
  const delStep=(id,si)=>{const o=objs.find(x=>x.id===id);upd(id,'steps',o.steps.filter((_,i)=>i!==si));};
  const updStep=(id,si,f,v)=>{const o=objs.find(x=>x.id===id);upd(id,'steps',o.steps.map((s,i)=>i===si?{...s,[f]:v}:s));};
  const addLine=(id,si)=>{const o=objs.find(x=>x.id===id);updStep(id,si,'lines',[...o.steps[si].lines,{role:'manager',text:''}]);};
  const delLine=(id,si,li)=>{const o=objs.find(x=>x.id===id);updStep(id,si,'lines',o.steps[si].lines.filter((_,i)=>i!==li));};
  const updLine=(id,si,li,f,v)=>{const o=objs.find(x=>x.id===id);updStep(id,si,'lines',o.steps[si].lines.map((l,i)=>i===li?{...l,[f]:v}:l));};

  return (<>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
      <span className="ap-sec" style={{margin:0,flex:1}}>Возражения ({objs.length})</span>
      <button className="ap-btn ap-btn-accent" onClick={addObj}>+ Добавить</button>
    </div>
    {objs.map(obj=>(
      <div key={obj.id} className="ap-card">
        <div className="ap-card-head" onClick={()=>setExpObj(expObj===obj.id?null:obj.id)}>
          <div className="ap-card-head-l">
            <span style={{fontSize:17}}>{obj.icon}</span>
            <span className="ap-card-title">{obj.title}</span>
            <span className="ap-cat-tag">{obj.category==='classic'?'Классическое':'Сложное'}</span>
          </div>
          <span style={{fontSize:11,color:'#6a7890'}}>{expObj===obj.id?'▲':'▼'}</span>
        </div>
        {expObj===obj.id&&(
          <div className="ap-card-body">
            <div className="ap-2col">
              <div className="ap-f"><label className="ap-lbl">Иконка</label><input className="ap-in" value={obj.icon} onChange={e=>upd(obj.id,'icon',e.target.value)} /></div>
              <div className="ap-f"><label className="ap-lbl">Категория</label>
                <select className="ap-sel" value={obj.category} onChange={e=>upd(obj.id,'category',e.target.value)}>
                  <option value="classic">Классическое</option><option value="hard">Сложное</option>
                </select></div>
            </div>
            <div className="ap-f"><label className="ap-lbl">Название</label><input className="ap-in" value={obj.title} onChange={e=>upd(obj.id,'title',e.target.value)} /></div>
            <div className="ap-f"><label className="ap-lbl">Описание для карточки</label><input className="ap-in" value={obj.homeDesc||''} onChange={e=>upd(obj.id,'homeDesc',e.target.value)} /></div>
            <div className="ap-f"><label className="ap-lbl">Принцип</label><textarea className="ap-ta" rows={3} value={obj.principle||''} onChange={e=>upd(obj.id,'principle',e.target.value)} /></div>
            <div className="ap-f"><label className="ap-lbl">Совет</label><textarea className="ap-ta" rows={2} value={obj.tip||''} onChange={e=>upd(obj.id,'tip',e.target.value)} /></div>
            <div className="ap-sec" style={{marginTop:14}}>Шаги диалога</div>
            {(obj.steps||[]).map((step,si)=>(
              <div key={si} className="ap-step">
                <div className="ap-step-head">
                  <span className="ap-step-lbl">Н <strong>{step.label}</strong></span>
                  <div style={{display:'flex',gap:5}}>
                    <button className="ap-btn ap-btn-green" style={{padding:'2px 8px',fontSize:11}} onClick={()=>addLine(obj.id,si)}>+ реплика</button>
                    <button className="ap-btn ap-btn-red" style={{padding:'2px 8px',fontSize:11}} onClick={()=>delStep(obj.id,si)}>✕ шаг</button>
                  </div>
                </div>
                {step.lines.map((ln,li)=>(
                  <div key={li} className="ap-dline">
                    <select className={`ap-role-sel ${ln.role}`} value={ln.role} onChange={e=>updLine(obj.id,si,li,'role',e.target.value)}>
                      <option value="client">К</option><option value="manager">М</option>
                    </select>
                    <textarea className="ap-ta" rows={2} style={{flex:1,minHeight:44}} value={ln.text} onChange={e=>updLine(obj.id,si,li,'text',e.target.value)} />
                    <button className="ap-li-del" style={{marginTop:2}} onClick={()=>delLine(obj.id,si,li)}>✕</button>
                  </div>
                ))}
              </div>
            ))}
            <div className="ap-btns" style={{marginTop:7}}>
              <button className="ap-add-row" style={{flex:1,margin:0}} onClick={()=>addStep(obj.id)}>+ Шаг Н{(obj.steps?.length||0)+1}</button>
              <button className="ap-btn ap-btn-red" onClick={()=>del(obj.id)}>🗑 Удалить</button>
            </div>
          </div>
        )}
      </div>
    ))}
    <button className="ap-add-row" onClick={addObj}>+ Новое возражение</button>
  </>);
}

/* ══════════════════════════════════════════════════════════════
   SALES TAB
══════════════════════════════════════════════════════════════ */
function SalesTab({ data, save }) {
  const {stages,cases} = data.sales;
  return (<>
    <div className="ap-sec">Этапы консультации</div>
    {stages.map((s,i)=>(
      <div key={i} className="ap-card" style={{marginBottom:7}}>
        <div style={{padding:'10px 12px'}}>
          <div className="ap-f"><label className="ap-lbl">Этап {i+1} — заголовок</label>
            <input className="ap-in" value={s.title} onChange={e=>save(['sales','stages'],stages.map((x,idx)=>idx===i?{...x,title:e.target.value}:x))} /></div>
          {s.desc!==undefined&&<div className="ap-f"><label className="ap-lbl">Описание</label>
            <textarea className="ap-ta" rows={2} value={s.desc||''} onChange={e=>save(['sales','stages'],stages.map((x,idx)=>idx===i?{...x,desc:e.target.value}:x))} /></div>}
        </div>
      </div>
    ))}
    <div className="ap-sec">Кейсы</div>
    {cases.map((c,i)=>(
      <div key={i} className="ap-card" style={{marginBottom:7}}>
        <div style={{padding:'10px 12px'}}>
          <div className="ap-2col">
            <div className="ap-f"><label className="ap-lbl">Имя</label><input className="ap-in" value={c.name} onChange={e=>save(['sales','cases'],cases.map((x,idx)=>idx===i?{...x,name:e.target.value}:x))} /></div>
            <div className="ap-f"><label className="ap-lbl">Тег</label><input className="ap-in" value={c.tag} onChange={e=>save(['sales','cases'],cases.map((x,idx)=>idx===i?{...x,tag:e.target.value}:x))} /></div>
          </div>
          <div className="ap-f"><label className="ap-lbl">Описание</label><textarea className="ap-ta" rows={3} value={c.desc} onChange={e=>save(['sales','cases'],cases.map((x,idx)=>idx===i?{...x,desc:e.target.value}:x))} /></div>
          <div className="ap-f"><label className="ap-lbl">Результат</label><textarea className="ap-ta" rows={2} value={c.result} onChange={e=>save(['sales','cases'],cases.map((x,idx)=>idx===i?{...x,result:e.target.value}:x))} /></div>
          <button className="ap-btn ap-btn-red" style={{fontSize:11}} onClick={()=>save(['sales','cases'],cases.filter((_,idx)=>idx!==i))}>🗑 Удалить</button>
        </div>
      </div>
    ))}
    <button className="ap-add-row" onClick={()=>save(['sales','cases'],[...cases,{name:'Новый кейс',tag:'кейс',desc:'Описание.',result:'Результат.'}])}>+ Кейс</button>
  </>);
}

/* ══════════════════════════════════════════════════════════════
   CRM TAB
══════════════════════════════════════════════════════════════ */
function CrmTab({ data, save }) {
  const {funnel,kpis,requiredFields} = data.crm;
  return (<>
    <div className="ap-sec">KPI плитки</div>
    <div className="ap-2col">
      {kpis.map((k,i)=>(
        <React.Fragment key={i}>
          <div className="ap-f"><label className="ap-lbl">Значение {i+1}</label><input className="ap-in" value={k.value} onChange={e=>save(['crm','kpis'],kpis.map((x,idx)=>idx===i?{...x,value:e.target.value}:x))} /></div>
          <div className="ap-f"><label className="ap-lbl">Подпись {i+1}</label><input className="ap-in" value={k.label} onChange={e=>save(['crm','kpis'],kpis.map((x,idx)=>idx===i?{...x,label:e.target.value}:x))} /></div>
        </React.Fragment>
      ))}
    </div>
    <div className="ap-sec">Воронка BIG</div>
    {funnel.map((item,i)=>(
      <div key={i} className="ap-li">
        <input value={item} onChange={e=>save(['crm','funnel'],funnel.map((v,idx)=>idx===i?e.target.value:v))} />
        <span style={{color:'#6a7890',fontSize:10,padding:'1px 6px',background:'#162030',borderRadius:4,flexShrink:0}}>#{i+1}</span>
        <button className="ap-li-del" onClick={()=>save(['crm','funnel'],funnel.filter((_,idx)=>idx!==i))}>✕</button>
      </div>
    ))}
    <button className="ap-add-row" onClick={()=>save(['crm','funnel'],[...funnel,'Новый этап'])}>+ Этап</button>
    <div className="ap-sec">Обязательные поля</div>
    {requiredFields.map((f,i)=>(
      <div key={i} className="ap-li">
        <input value={f} onChange={e=>save(['crm','requiredFields'],requiredFields.map((v,idx)=>idx===i?e.target.value:v))} />
        <button className="ap-li-del" onClick={()=>save(['crm','requiredFields'],requiredFields.filter((_,idx)=>idx!==i))}>✕</button>
      </div>
    ))}
    <button className="ap-add-row" onClick={()=>save(['crm','requiredFields'],[...requiredFields,'Новое поле'])}>+ Поле</button>
  </>);
}

/* ══════════════════════════════════════════════════════════════
   ACCESS TAB
══════════════════════════════════════════════════════════════ */
function AccessTab({ logout }) {
  const [curL,setCurL]=useState(''); const [curP,setCurP]=useState('');
  const [newL,setNewL]=useState(''); const [newP,setNewP]=useState('');
  const [conf,setConf]=useState('');
  const [flash,setFlash]=useState(null);
  const [show,setShow]=useState({c:false,n:false,k:false});
  const msg=(type,text)=>{setFlash({type,text});setTimeout(()=>setFlash(null),3500);};
  const submit=e=>{
    e.preventDefault(); const creds=getCreds();
    if(curL!==creds.login||curP!==creds.password){msg('err','Текущие данные неверны.');return;}
    if(!newL.trim()){msg('err','Логин не может быть пустым.');return;}
    if(newP.length<4){msg('err','Пароль — минимум 4 символа.');return;}
    if(newP!==conf){msg('err','Пароли не совпадают.');return;}
    saveCreds({login:newL.trim(),password:newP}); closeSession();
    msg('ok','Сохранено. Выполняется выход…');
    setCurL('');setCurP('');setNewL('');setNewP('');setConf('');
    setTimeout(()=>logout(),1600);
  };
  const eye=key=>(
    <button type="button" className="ap-eye-btn" onClick={()=>setShow(s=>({...s,[key]:!s[key]}))}>
      {show[key]?'🙈':'👁'}
    </button>
  );
  return (<>
    <div className="ap-sec">Смена логина и пароля</div>
    <div className="ap-info">Укажите текущие данные, затем новые. После сохранения сессия завершится.</div>
    {flash&&<div className={`ap-flash ${flash.type}`}>{flash.type==='ok'?'✓ ':'⚠ '}{flash.text}</div>}
    <form onSubmit={submit}>
      <div className="ap-pwd-box">
        <div className="ap-pwd-box-title">Текущие данные</div>
        <div className="ap-f"><label className="ap-lbl">Логин</label><input className="ap-in" type="text" value={curL} onChange={e=>setCurL(e.target.value)} autoComplete="username" /></div>
        <div className="ap-f"><label className="ap-lbl">Пароль</label><div className="ap-eye-wrap"><input className="ap-in" type={show.c?'text':'password'} value={curP} onChange={e=>setCurP(e.target.value)} />{eye('c')}</div></div>
      </div>
      <div className="ap-pwd-box">
        <div className="ap-pwd-box-title">Новые данные</div>
        <div className="ap-f"><label className="ap-lbl">Новый логин</label><input className="ap-in" type="text" value={newL} onChange={e=>setNewL(e.target.value)} autoComplete="new-username" /></div>
        <div className="ap-f"><label className="ap-lbl">Новый пароль (мин. 4 символа)</label><div className="ap-eye-wrap"><input className="ap-in" type={show.n?'text':'password'} value={newP} onChange={e=>setNewP(e.target.value)} />{eye('n')}</div></div>
        <div className="ap-f" style={{marginBottom:0}}><label className="ap-lbl">Повторите пароль</label><div className="ap-eye-wrap"><input className="ap-in" type={show.k?'text':'password'} value={conf} onChange={e=>setConf(e.target.value)} />{eye('k')}</div></div>
      </div>
      <button className="ap-btn ap-btn-accent" type="submit" style={{width:'100%',justifyContent:'center',padding:12}} disabled={!curL||!curP||!newL||!newP||!conf}>
        🔐 Сохранить
      </button>
    </form>
    <div className="ap-sec" style={{marginTop:22}}>Сессия</div>
    <div className="ap-info">Сессия хранится в <code>localStorage</code> — активна 30 дней или до ручного выхода.</div>
    <button className="ap-btn ap-btn-red" onClick={()=>{if(window.confirm('Завершить сессию?'))logout();}}>🚪 Выйти</button>
  </>);
}

/* ══════════════════════════════════════════════════════════════
   DATA TAB
══════════════════════════════════════════════════════════════ */
function DataTab({ data, onReset, onExport, onImport }) {
  const size=(()=>{try{return(new Blob([JSON.stringify(data)]).size/1024).toFixed(1)+' KB';}catch{return'—';}})();
  const pagesCount = (data.customPages||[]).length;
  const blocksCount = (data.customPages||[]).reduce((s,p)=>s+(p.blocks||[]).length,0);
  return (<>
    <div className="ap-sec">Локальная база данных</div>
    <div className="ap-info">
      Хранилище: <code>localStorage</code> · Размер: <strong style={{color:'#d8ff47'}}>{size}</strong><br/>
      Кастомных страниц: <strong style={{color:'#d8ff47'}}>{pagesCount}</strong> · Блоков: <strong style={{color:'#d8ff47'}}>{blocksCount}</strong>
    </div>
    <div className="ap-btns">
      <button className="ap-btn ap-btn-accent" onClick={onExport}>📥 Экспорт JSON</button>
      <label className="ap-btn ap-btn-sec" style={{cursor:'pointer'}}>
        📤 Импорт JSON<input type="file" accept=".json" onChange={onImport} style={{display:'none'}} />
      </label>
      <button className="ap-btn ap-btn-red" onClick={()=>{if(window.confirm('Сбросить ВСЕ данные до исходных?\nКастомные страницы тоже удалятся!'))onReset();}}>
        🔄 Сброс
      </button>
    </div>
    <div className="ap-sec" style={{marginTop:22}}>Инструкция</div>
    <div className="ap-info">
      <ul style={{paddingLeft:16,margin:0,lineHeight:1.9}}>
        <li>Все изменения сохраняются автоматически.</li>
        <li>Экспортируй JSON как резервную копию перед крупными правками.</li>
        <li>Импорт полностью заменяет текущие данные (включая страницы).</li>
        <li>Данные привязаны к браузеру и устройству.</li>
      </ul>
    </div>
  </>);
}
