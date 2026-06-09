import { useState } from 'react';
import type { User } from '../types/User';

export function useAiUserSummary(users: User[]) {
  const [aiSummary, setAiSummary] = useState('');
  const [isAiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleGenerateAiSummary = async () => {
    try {
      setAiLoading(true);
      setAiError('');
      setAiSummary('');

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

      const data = await response.json();

      setAiSummary(data.summary);
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
