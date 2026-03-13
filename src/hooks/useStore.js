import { useState, useEffect, useCallback } from 'react';
import { INITIAL_DATA } from '../data/initialData';

const STORAGE_KEY = 'uf_academy_v2';

export function useStore() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge with initial data to ensure new fields are present
        return deepMerge(INITIAL_DATA, parsed);
      }
    } catch (e) {
      console.warn('Failed to load from localStorage', e);
    }
    return INITIAL_DATA;
  });

  const save = useCallback((newData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, []);

  const update = useCallback((path, value) => {
    setData(prev => {
      const next = deepSet(prev, path, value);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(INITIAL_DATA);
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uf-academy-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((json) => {
    try {
      const parsed = JSON.parse(json);
      save(parsed);
      return true;
    } catch (e) {
      return false;
    }
  }, [save]);

  return { data, save, update, reset, exportData, importData };
}

function deepMerge(base, override) {
  if (typeof base !== 'object' || base === null) return override ?? base;
  if (typeof override !== 'object' || override === null) return base;
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (key in base) {
      result[key] = deepMerge(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
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
