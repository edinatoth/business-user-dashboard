import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AiUserSummaryError,
  generateAiUserSummary,
} from './aiUserSummaryService';
import type { AiSummary, User } from '../types/User';

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

const summary: AiSummary = {
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

async function expectAiError(
  promise: Promise<AiSummary>,
  code: AiUserSummaryError['code']
) {
  await expect(promise).rejects.toMatchObject({
    name: 'AiUserSummaryError',
    code,
  });
}

describe('generateAiUserSummary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('posts users to the AI summary endpoint and returns the summary', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ summary }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(generateAiUserSummary(users)).resolves.toEqual(summary);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/ai/user-summary',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users }),
      }
    );
  });

  it('throws EMPTY_USERS before calling the backend for an empty list', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expectAiError(generateAiUserSummary([]), 'EMPTY_USERS');

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('throws BACKEND_UNAVAILABLE when fetch cannot reach the backend', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed')));

    await expectAiError(generateAiUserSummary(users), 'BACKEND_UNAVAILABLE');
  });

  it('throws BACKEND_UNAVAILABLE for a 503 response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({ message: 'Backend unavailable' }),
      })
    );

    await expectAiError(generateAiUserSummary(users), 'BACKEND_UNAVAILABLE');
  });

  it('throws CLAUDE_API_ERROR for Claude provider failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({ code: 'CLAUDE_API_ERROR' }),
      })
    );

    await expectAiError(generateAiUserSummary(users), 'CLAUDE_API_ERROR');
  });

  it('throws INVALID_AI_RESPONSE when the backend returns malformed success data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ summary: { overview: 'Missing fields' } }),
      })
    );

    await expectAiError(generateAiUserSummary(users), 'INVALID_AI_RESPONSE');
  });

  it('throws INVALID_AI_RESPONSE for backend validation errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ code: 'INVALID_AI_RESPONSE' }),
      })
    );

    await expectAiError(generateAiUserSummary(users), 'INVALID_AI_RESPONSE');
  });

  it('throws REQUEST_FAILED for unknown non-ok responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Unexpected error' }),
      })
    );

    await expectAiError(generateAiUserSummary(users), 'REQUEST_FAILED');
  });
});
