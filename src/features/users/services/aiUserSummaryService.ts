import type { AiSummary, User } from '../types/User';

export type AiUserSummaryErrorCode =
  | 'BACKEND_UNAVAILABLE'
  | 'CLAUDE_API_ERROR'
  | 'EMPTY_USERS'
  | 'INVALID_AI_RESPONSE'
  | 'REQUEST_FAILED';

type AiUserSummaryResponse = {
  summary: AiSummary;
};

type ErrorResponse = {
  code?: string;
  message?: string;
};

function getAiUserSummaryEndpoint() {
  const aiApiUrl = import.meta.env.VITE_AI_API_URL ?? 'http://localhost:3001';

  return `${aiApiUrl.replace(/\/$/, '')}/api/ai/user-summary`;
}

export class AiUserSummaryError extends Error {
  readonly code: AiUserSummaryErrorCode;
  readonly status?: number;

  constructor(code: AiUserSummaryErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'AiUserSummaryError';
    this.code = code;
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isAiSummary(value: unknown): value is AiSummary {
  if (!isRecord(value) || !isRecord(value.stats)) {
    return false;
  }

  const stats = value.stats;
  const validRiskLevels = ['Low', 'Medium', 'High'];

  return (
    typeof value.overview === 'string' &&
    validRiskLevels.includes(String(value.riskLevel)) &&
    isStringArray(value.risks) &&
    isStringArray(value.recommendations) &&
    typeof stats.totalUsers === 'number' &&
    typeof stats.activeUsers === 'number' &&
    typeof stats.inactiveUsers === 'number' &&
    typeof stats.adminUsers === 'number' &&
    typeof stats.managerUsers === 'number' &&
    typeof stats.standardUsers === 'number'
  );
}

function isAiUserSummaryResponse(value: unknown): value is AiUserSummaryResponse {
  return isRecord(value) && isAiSummary(value.summary);
}

async function readJsonSafely(response: Response) {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

function getErrorCode(
  response: Response,
  payload: unknown
): AiUserSummaryErrorCode {
  const backendCode = isRecord(payload) ? String((payload as ErrorResponse).code ?? '') : '';

  if (backendCode === 'EMPTY_USERS') {
    return 'EMPTY_USERS';
  }

  if (backendCode === 'CLAUDE_API_ERROR') {
    return 'CLAUDE_API_ERROR';
  }

  if (backendCode === 'INVALID_AI_RESPONSE') {
    return 'INVALID_AI_RESPONSE';
  }

  if (response.status === 503) {
    return 'BACKEND_UNAVAILABLE';
  }

  if (response.status === 502 || response.status === 504) {
    return 'CLAUDE_API_ERROR';
  }

  if (response.status === 422) {
    return 'INVALID_AI_RESPONSE';
  }

  return 'REQUEST_FAILED';
}

export async function generateAiUserSummary(users: User[]) {
  if (users.length === 0) {
    throw new AiUserSummaryError(
      'EMPTY_USERS',
      'Cannot generate an AI summary for an empty users list.'
    );
  }

  let response: Response;

  try {
    response = await fetch(getAiUserSummaryEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users }),
    });
  } catch {
    throw new AiUserSummaryError(
      'BACKEND_UNAVAILABLE',
      'The AI summary backend is unavailable.'
    );
  }

  const data = await readJsonSafely(response);

  if (!response.ok) {
    const code = getErrorCode(response, data);
    const message =
      isRecord(data) && typeof data.message === 'string'
        ? data.message
        : 'AI summary request failed.';

    throw new AiUserSummaryError(code, message, response.status);
  }

  if (!isAiUserSummaryResponse(data)) {
    throw new AiUserSummaryError(
      'INVALID_AI_RESPONSE',
      'The AI summary response did not match the expected shape.',
      response.status
    );
  }

  return data.summary;
}
