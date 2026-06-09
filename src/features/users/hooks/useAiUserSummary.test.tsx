import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AiUserSummaryError,
  generateAiUserSummary,
  type AiUserSummaryErrorCode,
} from '../services/aiUserSummaryService';
import type { AiSummary, User } from '../types/User';
import { useAiUserSummary } from './useAiUserSummary';

vi.mock('../services/aiUserSummaryService', () => ({
  AiUserSummaryError: class AiUserSummaryError extends Error {
    readonly code: AiUserSummaryErrorCode;
    readonly status?: number;

    constructor(code: AiUserSummaryErrorCode, message: string, status?: number) {
      super(message);
      this.name = 'AiUserSummaryError';
      this.code = code;
      this.status = status;
    }
  },
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

  it.each([
    [
      'BACKEND_UNAVAILABLE',
      'Az AI kiszolgáló jelenleg nem érhető el. Ellenőrizd, hogy fut-e a backend.',
    ],
    [
      'CLAUDE_API_ERROR',
      'Az AI szolgáltatás most nem tudott választ adni. Próbáld újra később.',
    ],
    [
      'INVALID_AI_RESPONSE',
      'Az AI válasza nem a várt formátumban érkezett. Kérlek, próbáld újra.',
    ],
    [
      'EMPTY_USERS',
      'Nincs elemezhető felhasználó. Módosítsd a szűrőket vagy adj hozzá új felhasználót.',
    ],
    [
      'REQUEST_FAILED',
      'Nem sikerült elkészíteni az AI elemzést. Kérlek, próbáld újra.',
    ],
  ] satisfies Array<[AiUserSummaryErrorCode, string]>)(
    'shows the mapped message for %s',
    async (code, message) => {
      generateAiUserSummaryMock.mockRejectedValue(
        new AiUserSummaryError(code, 'Failed')
      );

      const { result } = renderHook(() => useAiUserSummary(users));

      await act(async () => {
        await result.current.handleGenerateAiSummary();
      });

      expect(result.current.aiSummary).toBeNull();
      expect(result.current.aiError).toBe(message);
      expect(result.current.isAiLoading).toBe(false);
    }
  );

  it('shows a fallback message for unknown errors', async () => {
    generateAiUserSummaryMock.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAiUserSummary(users));

    await act(async () => {
      await result.current.handleGenerateAiSummary();
    });

    expect(result.current.aiError).toBe(
      'Nem sikerült elkészíteni az AI elemzést. Kérlek, próbáld újra.'
    );
  });
});
