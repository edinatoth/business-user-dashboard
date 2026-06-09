import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useUsers } from './useUsers';

describe('useUsers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads users from the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 1,
            name: 'Anna Smith',
            email: 'anna.smith@example.com',
            phone: '+36 30 123 4567',
          },
        ],
      })
    );

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.users).toHaveLength(1);
    });

    expect(result.current.users[0].name).toBe('Anna Smith');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('stores an error message when loading fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => [],
      })
    );

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(
        'Something went wrong while loading users.'
      );
    });

    expect(result.current.users).toHaveLength(0);
    expect(result.current.isLoading).toBe(false);
  });
});
