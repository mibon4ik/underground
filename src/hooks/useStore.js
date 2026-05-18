import { useState, useEffect, useCallback } from 'react';

const raw = import.meta.env.VITE_API_URL || '/api';
const API_BASE = raw.startsWith('http') ? raw.replace(/\/?$/, '/api') : raw;
const getToken = () => localStorage.getItem('uf_admin_token');
const authHeaders = () => {
  const t = getToken();
  return t ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}` } : { 'Content-Type': 'application/json' };
};

export function useStore() {
  const [data, setData] = useState({
    theme: { primary: '#D8FF47', accent: '#65C2FF', bg: '#03060B', bg2: '#03060B', surface: '#0D121F', surface2: '#0D121F', surface3: '#0D121F', text: '#FFFFFF', muted: '#7D8AA0', stroke: 'rgba(255,255,255,0.1)', accent2: '#65C2FF', ok: '#22C55E', warn: '#F59E0B', danger: '#EF4444', gold: '#D3B05D', sidebarBg: 'rgba(8,12,18,0.94)', fontFamily: 'Inter, Arial, sans-serif' },
    company: { name: 'Underground GYM', description: 'Сеть фитнес-клубов №1', values: [], stats: [] },
    product: { items: [], halls: { gym: { title: '', items: [] }, big: { title: '', items: [] }, silverBranches: { title: '', items: [] }, goldBranches: { title: '', items: [] }, presentationGuide: [], scheduleNote: '' }, plans: [], pt: { title: '', items: [], tip: '' }, dj: { title: '', items: [], schedule: [], warn: '' }, groups: { items: [], rules: [] }, finance: { formula: '', physDocs: [], legalDocs: [], tips: [] }, afterSale: { steps: [], example: '', warn: '' } },
    sales: { stages: [], cases: [] },
    crm: { kpis: [], steps: [], funnel: [], requiredFields: [], checklist: [] },
    objections: [],
    customPages: [],
    prices: [],
    coaches: [],
    branches: [],
    leads: [],
    calculator: { terms: [3, 6, 12], kaspiPercent: 0 },
    schedule: [],
    news: [],
    gallery: [],
    reviews: [],
    workout_programs: [],
    shop: [],
    booking: [],
    referral: [],
    promos: [],
    faq: [],
    achievements: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const keys = [
        'theme', 'company', 'product', 'sales', 'crm', 'objections',
        { key: 'pages', stateKey: 'customPages' },
        'prices', 'coaches', 'branches', 'leads', 'calculator',
        'schedule', 'news', 'gallery', 'reviews', 'workout_programs',
        'shop', 'booking', 'referral', 'promos', 'faq', 'achievements'
      ];

      const results = await Promise.all(keys.map(async (k) => {
        const key = typeof k === 'string' ? k : k.key;
        const stateKey = typeof k === 'string' ? k : k.stateKey;
        try {
          const res = await fetch(`${API_BASE}/data/${key}`);
          if (res.ok) {
            const json = await res.json();
            return { [stateKey]: json };
          }
        } catch (e) {
          console.warn(`Failed to fetch ${key}`);
        }
        return { [stateKey]: Array.isArray(data[stateKey]) ? [] : {} };
      }));

      const merged = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setData(prev => ({ ...prev, ...merged }));
    } catch (err) {
      console.error('Failed to load store', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const update = useCallback(async (path, value) => {
    // path is usually ['key', ...subpath]
    const rootKey = path[0];
    const filename = rootKey === 'customPages' ? 'pages' : rootKey;

    setData(prev => {
      const newData = deepSet(prev, path, value);

      // Persist to backend
      fetch(`${API_BASE}/data/${filename}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newData[rootKey]),
      }).catch(err => console.error('Save failed', err));

      return newData;
    });
  }, []);

  const addLead = useCallback(async (lead) => {
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      if (res.ok) {
        const { lead: savedLead } = await res.json();
        setData(prev => ({ ...prev, leads: [...(prev.leads || []), savedLead] }));
        return true;
      }
    } catch (err) {
      console.error('Lead save failed', err);
    }
    return false;
  }, []);

  const reset = useCallback(async () => {
    fetchAll();
  }, [fetchAll]);

  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback(async (jsonStr) => {
    try {
      const imported = JSON.parse(jsonStr);
      const keys = Object.keys(imported);
      const results = await Promise.all(keys.map(async (key) => {
        const filename = key === 'customPages' ? 'pages' : key;
        try {
          const res = await fetch(`${API_BASE}/data/${filename}`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(imported[key]),
          });
          return res.ok;
        } catch {
          return false;
        }
      }));
      if (results.every(Boolean)) {
        await fetchAll();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchAll]);

  return { data, update, reset, addLead, loading, exportData, importData };
}

function deepSet(obj, path, value) {
  if (!path.length) return value;
  const [head, ...tail] = path;
  if (Array.isArray(obj)) {
    const arr = [...obj];
    arr[head] = deepSet(arr[head], tail, value);
    return arr;
  }
  return { ...obj, [head]: deepSet(obj[head], tail, value) };
}
