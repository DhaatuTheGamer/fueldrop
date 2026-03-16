import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { clearPersistedState, usePersistedState } from './usePersistedState';

describe('clearPersistedState', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'removeItem');
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should remove multiple keys from localStorage', () => {
    const keys = ['key1', 'key2', 'key3'];

    clearPersistedState(keys);

    expect(localStorage.removeItem).toHaveBeenCalledTimes(3);
    expect(localStorage.removeItem).toHaveBeenNthCalledWith(1, 'key1');
    expect(localStorage.removeItem).toHaveBeenNthCalledWith(2, 'key2');
    expect(localStorage.removeItem).toHaveBeenNthCalledWith(3, 'key3');
  });

  it('should handle an empty array gracefully', () => {
    clearPersistedState([]);
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });
});

describe('usePersistedState', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'setItem');
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return default value if nothing is in localStorage', () => {
    const { result } = renderHook(() => usePersistedState('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('defaultValue');
    expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should return value from localStorage if it exists', () => {
    localStorage.setItem('existingKey', JSON.stringify('existingValue'));
    const { result } = renderHook(() => usePersistedState('existingKey', 'defaultValue'));
    expect(result.current[0]).toBe('existingValue');
    expect(localStorage.getItem).toHaveBeenCalledWith('existingKey');
  });

  it('should update state and localStorage when setState is called', () => {
    const { result } = renderHook(() => usePersistedState('testKey', 'defaultValue'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('newValue'));
  });

  it('should fallback to default value if localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => usePersistedState('errorKey', 'fallbackValue'));
    expect(result.current[0]).toBe('fallbackValue');
  });

  it('should handle complex objects', () => {
    const defaultObj = { a: 1, b: 'two' };
    const { result } = renderHook(() => usePersistedState('objKey', defaultObj));

    expect(result.current[0]).toEqual(defaultObj);

    const newObj = { a: 2, b: 'three', c: true };
    act(() => {
      result.current[1](newObj as any);
    });

    expect(result.current[0]).toEqual(newObj);
    expect(localStorage.setItem).toHaveBeenCalledWith('objKey', JSON.stringify(newObj));
  });
});
