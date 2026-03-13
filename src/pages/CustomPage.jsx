import React from 'react';

// ── Block renderer ────────────────────────────────────────────────────────────
// Each block has: { id, type, ...props }
// Types: hero, text, cards, list, table, steps, gallery, alert, divider, stats, links

export default function CustomPage({ page }) {
  if (!page) return null;
  const blocks = page.blocks || [];

  return (
    <div className="page-animate" style={{ maxWidth: 1100 }}>
      {/* Page header */}
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div className="eyebrow">{page.eyebrow || 'Раздел'}</div>
        <h1 className="page-title" style={{ fontSize: 36 }}>
          <span style={{ marginRight: 12 }}>{page.icon || '📄'}</span>
          {page.title}
        </h1>
        {page.description && (
          <p className="page-desc">{page.description}</p>
        )}
      </div>

      {/* Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {blocks.map(block => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>

      {blocks.length === 0 && (
        <div style={{
          padding: '48px 24px', textAlign: 'center', borderRadius: 20,
          border: '1px dashed var(--stroke)', color: 'var(--muted)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Страница пуста</div>
          <div style={{ fontSize: 14 }}>Добавь блоки в Админ-панели → Страницы → {page.title}</div>
        </div>
      )}
    </div>
  );
}

function BlockRenderer({ block }) {
  switch (block.type) {
    case 'hero':    return <HeroBlock    block={block} />;
    case 'text':    return <TextBlock    block={block} />;
    case 'cards':   return <CardsBlock   block={block} />;
    case 'list':    return <ListBlock    block={block} />;
    case 'table':   return <TableBlock   block={block} />;
    case 'steps':   return <StepsBlock   block={block} />;
    case 'alert':   return <AlertBlock   block={block} />;
    case 'divider': return <DividerBlock block={block} />;
    case 'stats':   return <StatsBlock   block={block} />;
    case 'links':   return <LinksBlock   block={block} />;
    case 'twoCol':  return <TwoColBlock  block={block} />;
    default:        return null;
  }
}

/* ── HERO BLOCK ─────────────────────────────────────────────── */
function HeroBlock({ block }) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      padding: '36px 32px', borderRadius: 24,
      border: '1px solid var(--stroke)',
      background: `linear-gradient(135deg, ${block.colorFrom || 'rgba(216,255,71,.08)'}, ${block.colorTo || 'rgba(101,194,255,.06)'})`,
    }}>
      <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.04), transparent 70%)' }} />
      {block.eyebrow && <div className="eyebrow">{block.eyebrow}</div>}
      <h2 style={{ fontSize: 32, fontWeight: 1000, lineHeight: 1.1, marginBottom: 12 }}>
        {block.icon && <span style={{ marginRight: 10 }}>{block.icon}</span>}
        {block.title}
      </h2>
      {block.text && <p style={{ color: 'var(--muted)', lineHeight: 1.75, maxWidth: 700, fontSize: 15 }}>{block.text}</p>}
    </div>
  );
}

/* ── TEXT BLOCK ─────────────────────────────────────────────── */
function TextBlock({ block }) {
  return (
    <div className="card">
      {block.title && <h3 style={{ marginBottom: 12 }}>{block.icon && <span style={{ marginRight: 8 }}>{block.icon}</span>}{block.title}</h3>}
      <div style={{ color: '#dce5f4', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-wrap' }}>{block.content}</div>
    </div>
  );
}

/* ── CARDS BLOCK ────────────────────────────────────────────── */
function CardsBlock({ block }) {
  const cols = block.columns || 2;
  const items = block.items || [];
  return (
    <div>
      {block.title && <div className="eyebrow" style={{ marginBottom: 12 }}>{block.title}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>
        {items.map((item, i) => (
          <div key={i} className="card" style={{ padding: 18 }}>
            {item.icon && <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>}
            {item.title && <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8, color: '#eef4fb' }}>{item.title}</h4>}
            {item.text && <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>{item.text}</p>}
            {item.badge && <span className="mini-tag" style={{ marginTop: 10, display: 'inline-flex' }}>{item.badge}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── LIST BLOCK ─────────────────────────────────────────────── */
function ListBlock({ block }) {
  const items = block.items || [];
  const style = block.style || 'bullet'; // bullet | check | number | arrow
  const icons = { bullet: '•', check: '✓', arrow: '→' };
  return (
    <div className="card">
      {block.title && <h3 style={{ marginBottom: 14 }}>{block.icon && <span style={{ marginRight: 8 }}>{block.icon}</span>}{block.title}</h3>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{
              flexShrink: 0, marginTop: 2,
              width: 24, height: 24, borderRadius: 7,
              background: style === 'check' ? 'rgba(34,197,94,.15)' : 'rgba(216,255,71,.1)',
              border: `1px solid ${style === 'check' ? 'rgba(34,197,94,.25)' : 'rgba(216,255,71,.2)'}`,
              color: style === 'check' ? '#4ade80' : 'var(--accent)',
              display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 900,
            }}>
              {style === 'number' ? i + 1 : icons[style] || '•'}
            </span>
            <div style={{ flex: 1, paddingTop: 3 }}>
              {typeof item === 'string'
                ? <span style={{ color: '#dce5f4', lineHeight: 1.7 }}>{item}</span>
                : <>
                    {item.title && <strong style={{ display: 'block', color: '#eef4fb', marginBottom: 3 }}>{item.title}</strong>}
                    {item.text && <span style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.65 }}>{item.text}</span>}
                  </>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TABLE BLOCK ────────────────────────────────────────────── */
function TableBlock({ block }) {
  const headers = block.headers || [];
  const rows = block.rows || [];
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {block.title && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--stroke)', fontWeight: 800, fontSize: 15 }}>
          {block.icon && <span style={{ marginRight: 8 }}>{block.icon}</span>}{block.title}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          {headers.length > 0 && (
            <thead>
              <tr style={{ borderBottom: '1px solid var(--stroke)', background: 'rgba(255,255,255,.02)' }}>
                {headers.map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 800, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: ri < rows.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                {(Array.isArray(row) ? row : [row]).map((cell, ci) => (
                  <td key={ci} style={{ padding: '11px 16px', color: ci === 0 ? '#eef4fb' : 'var(--muted)', lineHeight: 1.6 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── STEPS BLOCK ────────────────────────────────────────────── */
function StepsBlock({ block }) {
  const items = block.items || [];
  return (
    <div>
      {block.title && <div className="eyebrow" style={{ marginBottom: 12 }}>{block.title}</div>}
      <div className="timeline">
        {items.map((step, i) => (
          <div key={i} className="timeline-item">
            <div className="tl-num">{step.num || i + 1}</div>
            <strong>{step.title}</strong>
            {step.text && <span style={{ display: 'block', marginTop: 4 }}>{step.text}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ALERT BLOCK ────────────────────────────────────────────── */
const ALERT_STYLES = {
  info:    { bg: 'rgba(101,194,255,.08)',  border: 'rgba(101,194,255,.2)',  color: '#a8d4ff' },
  success: { bg: 'rgba(34,197,94,.08)',    border: 'rgba(34,197,94,.2)',    color: '#4ade80' },
  warn:    { bg: 'rgba(245,158,11,.08)',   border: 'rgba(245,158,11,.2)',   color: '#fbbf24' },
  danger:  { bg: 'rgba(239,68,68,.08)',    border: 'rgba(239,68,68,.2)',    color: '#f87171' },
  accent:  { bg: 'rgba(216,255,71,.08)',   border: 'rgba(216,255,71,.2)',   color: '#d8ff47' },
};
function AlertBlock({ block }) {
  const s = ALERT_STYLES[block.variant || 'info'];
  return (
    <div style={{ padding: '16px 18px', borderRadius: 16, background: s.bg, border: `1px solid ${s.border}`, lineHeight: 1.7 }}>
      {block.title && <strong style={{ display: 'block', color: s.color, marginBottom: 6, fontSize: 14 }}>{block.icon && block.icon + ' '}{block.title}</strong>}
      <span style={{ color: '#dce5f4', fontSize: 14 }}>{block.text}</span>
    </div>
  );
}

/* ── DIVIDER BLOCK ──────────────────────────────────────────── */
function DividerBlock({ block }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '8px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--stroke)' }} />
      {block.label && <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{block.label}</span>}
      {block.label && <div style={{ flex: 1, height: 1, background: 'var(--stroke)' }} />}
    </div>
  );
}

/* ── STATS BLOCK ────────────────────────────────────────────── */
function StatsBlock({ block }) {
  const items = block.items || [];
  return (
    <div>
      {block.title && <div className="eyebrow" style={{ marginBottom: 12 }}>{block.title}</div>}
      <div className="kpi-grid">
        {items.map((s, i) => (
          <div key={i} className="kpi">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── LINKS BLOCK ────────────────────────────────────────────── */
function LinksBlock({ block }) {
  const items = block.items || [];
  return (
    <div className="card">
      {block.title && <h3 style={{ marginBottom: 14 }}>{block.icon && <span style={{ marginRight: 8 }}>{block.icon}</span>}{block.title}</h3>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((link, i) => (
          <a key={i} href={link.url || '#'} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, border: '1px solid var(--stroke)', background: 'rgba(255,255,255,.02)', transition: '.15s', textDecoration: 'none', color: 'var(--text)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(101,194,255,.35)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--stroke)'}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{link.icon || '🔗'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{link.title}</div>
              {link.desc && <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>{link.desc}</div>}
            </div>
            <span style={{ color: 'var(--accent2)', fontSize: 12 }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── TWO COLUMN BLOCK ───────────────────────────────────────── */
function TwoColBlock({ block }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {(block.columns || []).map((col, i) => (
        <div key={i} className="card">
          {col.title && <h3 style={{ marginBottom: 10, fontSize: 17 }}>{col.icon && <span style={{ marginRight: 8 }}>{col.icon}</span>}{col.title}</h3>}
          <div style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: 14, whiteSpace: 'pre-wrap' }}>{col.text}</div>
        </div>
      ))}
    </div>
  );
}
