import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3001/api';

export function useStore() {
  const [data, setData] = useState({
    theme: { primary: '#D8FF47', accent: '#65C2FF', bg: '#03060B', surface: '#0D121F', text: '#FFFFFF', muted: '#7D8AA0' },
    company: { name: 'Underground GYM', description: 'Сеть фитнес-клубов №1', values: [], stats: [] },
    product: { items: [] },
    sales: { steps: [] },
    crm: { steps: [] },
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
        headers: { 'Content-Type': 'application/json' },
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
    // Not really applicable for server-side persistence without a master reset endpoint
    // but we can re-fetch
    fetchAll();
  }, [fetchAll]);

  return { data, update, reset, addLead, loading };
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
