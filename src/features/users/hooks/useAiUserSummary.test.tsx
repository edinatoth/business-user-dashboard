import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateAiUserSummary } from '../services/aiUserSummaryService';
import type { User } from '../types/User';
import { useAiUserSummary } from './useAiUserSummary';

vi.mock('../services/aiUserSummaryService', () => ({
  generateAiUserSummary: vi.fn(),
}));

const users: User[] = [
  {
    id: 1,
    name: 'Anna Kovács',
    email: 'anna.kovacs@example.com',
    phone: '+36 30 123 4567',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2026-06-01',
  },
];

const generateAiUserSummaryMock = vi.mocked(generateAiUserSummary);

describe('useAiUserSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates and stores the AI summary', async () => {
    generateAiUserSummaryMock.mockResolvedValue('Everything looks good.');

    const { result } = renderHook(() => useAiUserSummary(users));

    await act(async () => {
      await result.current.handleGenerateAiSummary();
    });

    expect(generateAiUserSummaryMock).toHaveBeenCalledWith(users);
    expect(result.current.aiSummary).toBe('Everything looks good.');
    expect(result.current.aiError).toBe('');
    expect(result.current.isAiLoading).toBe(false);
  });

  it('stores a user-facing error when generation fails', async () => {
    generateAiUserSummaryMock.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAiUserSummary(users));

    await act(async () => {
      await result.current.handleGenerateAiSummary();
    });

    expect(result.current.aiSummary).toBe('');
    expect(result.current.aiError).toBe(
      'Nem sikerült elkészíteni az AI elemzést.'
    );
    expect(result.current.isAiLoading).toBe(false);
  });
});
