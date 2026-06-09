import type { AiSummary, User } from '../types/User';

type AiUserSummaryResponse = {
  summary: AiSummary;
};

export async function generateAiUserSummary(users: User[]) {
  const response = await fetch('http://localhost:3001/api/ai/user-summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ users }),
  });

  if (!response.ok) {
    throw new Error('AI summary request failed');
  }

  const data = (await response.json()) as AiUserSummaryResponse;

  return data.summary;
}
