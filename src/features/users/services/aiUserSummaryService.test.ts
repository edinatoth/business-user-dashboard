import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateAiUserSummary } from './aiUserSummaryService';
import type { AiSummary, User } from '../types/User';

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

const summary: AiSummary = {
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

describe('generateAiUserSummary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('posts users to the AI summary endpoint and returns the summary', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
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

  it('throws when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      })
    );

    await expect(generateAiUserSummary(users)).rejects.toThrow(
      'AI summary request failed'
    );
  });
});
