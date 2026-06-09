import { useEffect, useState } from 'react';
import type { User } from '../types/User';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users',
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load users');
        }

        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setErrorMessage('Something went wrong while loading users.');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    users,
    setUsers,
    isLoading,
    errorMessage,
  };
}