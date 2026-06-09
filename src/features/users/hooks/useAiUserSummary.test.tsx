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
    name: 'Anna Smith',
    email: 'anna.smith@example.com',
    phone: '+36 30 123 4567',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2026-06-01',
  },
];

const aiSummary: AiSummary = {
  overview: 'The user base is in a stable state.',
  stats: {
    totalUsers: 1,
    activeUsers: 1,
    inactiveUsers: 0,
    adminUsers: 1,
    managerUsers: 0,
    standardUsers: 0,
  },
  riskLevel: 'Low',
  risks: ['No major risks detected.'],
  recommendations: ['Keep admin permissions up to date.'],
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
      'The AI backend is currently unavailable. Please check that the backend is running.',
    ],
    [
      'CLAUDE_API_ERROR',
      'The AI provider could not return a response. Please try again later.',
    ],
    [
      'INVALID_AI_RESPONSE',
      'The AI response was not in the expected format. Please try again.',
    ],
    [
      'EMPTY_USERS',
      'There are no users to analyze. Adjust the filters or add a new user.',
    ],
    [
      'REQUEST_FAILED',
      'Could not generate the AI analysis. Please try again.',
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
      'Could not generate the AI analysis. Please try again.'
    );
  });
});
