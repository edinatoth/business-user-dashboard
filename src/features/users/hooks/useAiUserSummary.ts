import { useState } from 'react';
import {
  AiUserSummaryError,
  generateAiUserSummary,
  type AiUserSummaryErrorCode,
} from '../services/aiUserSummaryService';
import type { AiSummary, User } from '../types/User';

const AI_ERROR_MESSAGES: Record<AiUserSummaryErrorCode, string> = {
  BACKEND_UNAVAILABLE:
    'Az AI kiszolgáló jelenleg nem érhető el. Ellenőrizd, hogy fut-e a backend.',
  CLAUDE_API_ERROR:
    'Az AI szolgáltatás most nem tudott választ adni. Próbáld újra később.',
  EMPTY_USERS:
    'Nincs elemezhető felhasználó. Módosítsd a szűrőket vagy adj hozzá új felhasználót.',
  INVALID_AI_RESPONSE:
    'Az AI válasza nem a várt formátumban érkezett. Kérlek, próbáld újra.',
  REQUEST_FAILED:
    'Nem sikerült elkészíteni az AI elemzést. Kérlek, próbáld újra.',
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
