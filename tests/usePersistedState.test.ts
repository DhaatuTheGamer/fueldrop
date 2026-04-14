import { renderHook, act } from '@testing-library/react';
import { usePersistedState, clearPersistedState } from '../src/hooks/usePersistedState';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('usePersistedState', () => {
  const key = 'test-key';
  const defaultValue = 'default-value';

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return default value when localStorage is empty', () => {
    const { result } = renderHook(() => usePersistedState(key, defaultValue));
    expect(result.current[0]).toBe(defaultValue);
    // Even though it uses defaultValue, the effect sets it in localStorage
    expect(localStorage.getItem(key)).toBe(JSON.stringify(defaultValue));
  });

  it('should return stored value if it exists in localStorage', () => {
    const storedValue = 'stored-value';
    localStorage.setItem(key, JSON.stringify(storedValue));

    const { result } = renderHook(() => usePersistedState(key, defaultValue));
    expect(result.current[0]).toBe(storedValue);
  });

  it('should update state and localStorage when setter is called', () => {
    const { result } = renderHook(() => usePersistedState(key, defaultValue));
    const newValue = 'new-value';

    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toBe(newValue);
    expect(localStorage.getItem(key)).toBe(JSON.stringify(newValue));
  });

  it('should handle functional updates', () => {
    const { result } = renderHook(() => usePersistedState<number>(key, 1));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(localStorage.getItem(key)).toBe(JSON.stringify(2));
  });

  it('should return default value and not crash if localStorage.getItem throws an error', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Access denied');
    });

    const { result } = renderHook(() => usePersistedState(key, defaultValue));
    expect(result.current[0]).toBe(defaultValue);

    getItemSpy.mockRestore();
  });

  it('should return default value if stored value is invalid JSON', () => {
    localStorage.setItem(key, 'invalid json {[');

    const { result } = renderHook(() => usePersistedState(key, defaultValue));
    expect(result.current[0]).toBe(defaultValue);
  });

  it('should not crash if localStorage.setItem throws an error (e.g., storage full)', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    const { result } = renderHook(() => usePersistedState(key, defaultValue));
    const newValue = 'new-value';

    act(() => {
      result.current[1](newValue);
    });

    // The state should still update successfully in memory
    expect(result.current[0]).toBe(newValue);

    setItemSpy.mockRestore();
  });
});

describe('clearPersistedState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should remove multiple keys from localStorage', () => {
    const keys = ['key1', 'key2', 'key3'];
    keys.forEach(key => localStorage.setItem(key, JSON.stringify('value')));

    // Set an extra key that shouldn't be cleared
    localStorage.setItem('other-key', JSON.stringify('other-value'));

    clearPersistedState(['key1', 'key2']);

    expect(localStorage.getItem('key1')).toBeNull();
    expect(localStorage.getItem('key2')).toBeNull();
    // key3 was not passed to clearPersistedState
    expect(localStorage.getItem('key3')).not.toBeNull();
    expect(localStorage.getItem('other-key')).not.toBeNull();
  });
});
