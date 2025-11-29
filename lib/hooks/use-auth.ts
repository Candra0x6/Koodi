'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { User, Language } from '../generated/prisma/client';

// Extended user type with relations
interface UserWithLanguage extends User {
  selectedLanguage?: Language | null;
  dailyXp?: number;
}

// Custom event for language changes
export const LANGUAGE_CHANGED_EVENT = 'language-changed';

export function useAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserWithLanguage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (status === 'unauthenticated') {
      setLoading(false);
      setUser(null);
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      try {
        setLoading(true);
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
  }, [session, status]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Listen for language change events
  useEffect(() => {
    const handleLanguageChange = () => {
      fetchUserData();
    };

    window.addEventListener(LANGUAGE_CHANGED_EVENT, handleLanguageChange);
    return () => {
      window.removeEventListener(LANGUAGE_CHANGED_EVENT, handleLanguageChange);
    };
  }, [fetchUserData]);

  return {
    session,
    user,
    isAuthenticated: status === 'authenticated',
    isLoading: loading,
    error,
    status,
    refetch: fetchUserData,
  };
}
