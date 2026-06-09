import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateAiUserSummary } from '../services/aiUserSummaryService';
import type { AiSummary, User } from '../types/User';
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

const aiSummary: AiSummary = {
  overview: 'A felhasználók állapota stabil.',
  stats: {
    totalUsers: 1,
    activeUsers: 1,
    inactiveUsers: 0,
    adminUsers: 1,
    managerUsers: 0,
    standardUsers: 0,
  },
  riskLevel: 'Low',
  risks: ['Nincs kiemelt kockázat.'],
  recommendations: ['Tartsd naprakészen az admin jogosultságokat.'],
};

const generateAiUserSummaryMock = vi.mocked(generateAiUserSummary);

describe('useAiUserSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates and stores the AI summary', async () => {
    generateAiUserSummaryMock.mockResolvedValue(aiSummary);

    const { result } = renderHook(() => useAiUserSummary(users));

    await act(async () => {
      await result.current.handleGenerateAiSummary();
    });

    expect(generateAiUserSummaryMock).toHaveBeenCalledWith(users);
    expect(result.current.aiSummary).toEqual(aiSummary);
    expect(result.current.aiError).toBe('');
    expect(result.current.isAiLoading).toBe(false);
  });

  it('stores a user-facing error when generation fails', async () => {
    generateAiUserSummaryMock.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAiUserSummary(users));

    await act(async () => {
      await result.current.handleGenerateAiSummary();
    });

    expect(result.current.aiSummary).toBeNull();
    expect(result.current.aiError).toBe(
      'Nem sikerült elkészíteni az AI elemzést.'
    );
    expect(result.current.isAiLoading).toBe(false);
  });
});
