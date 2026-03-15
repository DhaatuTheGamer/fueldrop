import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function usePersistedState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Silently fail if storage is full
    }
  }, [key, state]);

  return [state, setState];
}

export function clearPersistedState(keys: string[]) {
  keys.forEach(key => localStorage.removeItem(key));
}
