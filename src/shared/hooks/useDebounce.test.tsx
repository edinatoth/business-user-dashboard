import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('Anna', 500));

    expect(result.current).toBe('Anna');
  });

  it('updates the value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'Anna' } }
    );

    rerender({ value: 'Dóra' });

    expect(result.current).toBe('Anna');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('Dóra');
  });

  it('clears the previous timeout when the value changes quickly', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'A' } }
    );

    rerender({ value: 'An' });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: 'Ann' });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('A');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('Ann');
  });
});
