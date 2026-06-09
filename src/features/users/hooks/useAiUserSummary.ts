import { useState } from 'react';
import { generateAiUserSummary } from '../services/aiUserSummaryService';
import type { AiSummary, User } from '../types/User';

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
    } catch {
      setAiError('Nem sikerült elkészíteni az AI elemzést.');
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
