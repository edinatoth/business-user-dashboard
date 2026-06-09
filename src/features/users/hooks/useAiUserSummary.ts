import { useState } from 'react';
import {
  AiUserSummaryError,
  generateAiUserSummary,
  type AiUserSummaryErrorCode,
} from '../services/aiUserSummaryService';
import type { AiSummary, User } from '../types/User';

const AI_ERROR_MESSAGES: Record<AiUserSummaryErrorCode, string> = {
  BACKEND_UNAVAILABLE:
    'The AI backend is currently unavailable. Please check that the backend is running.',
  CLAUDE_API_ERROR:
    'The AI provider could not return a response. Please try again later.',
  EMPTY_USERS:
    'There are no users to analyze. Adjust the filters or add a new user.',
  INVALID_AI_RESPONSE:
    'The AI response was not in the expected format. Please try again.',
  REQUEST_FAILED:
    'Could not generate the AI analysis. Please try again.',
};

function getAiErrorMessage(error: unknown) {
  if (error instanceof AiUserSummaryError) {
    return AI_ERROR_MESSAGES[error.code];
  }

  return AI_ERROR_MESSAGES.REQUEST_FAILED;
}

export function useAiUserSummary(users: User[]) {
  const [aiSummary, setAiSummary] = useState<AiSummary | null>(null);
  const [isAiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleGenerateAiSummary = async () => {
    try {
      setAiLoading(true);
      setAiError('');
      setAiSummary(null);

      const summary = await generateAiUserSummary(users);

      setAiSummary(summary);
    } catch (error) {
      setAiError(getAiErrorMessage(error));
    } finally {
      setAiLoading(false);
    }
  };

  return {
    handleGenerateAiSummary,
    aiSummary,
    isAiLoading,
    aiError,
  };
}
