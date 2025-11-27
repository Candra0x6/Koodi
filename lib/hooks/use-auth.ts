'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { User, Language } from '../generated/prisma/client';

// Extended user type with relations
interface UserWithLanguage extends User {
  selectedLanguage?: Language | null;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserWithLanguage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (status === 'unauthenticated') {
        setLoading(false);
        setUser(null);
        return;
      }

      if (status === 'authenticated' && session?.user?.id) {
        try {
          const res = await fetch('/api/user/profile');
          if (!res.ok) throw new Error('Failed to fetch user data');
          const userData = await res.json();
          setUser(userData.result);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load user data');
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserData();
  }, [session, status]);

  return {
    session,
    user,
    isAuthenticated: status === 'authenticated',
    isLoading: loading,
    error,
    status,
  };
}
