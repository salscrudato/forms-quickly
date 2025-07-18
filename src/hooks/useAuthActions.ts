import { useState, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInAnonymously,
  signOut as firebaseSignOut,
  type User 
} from 'firebase/auth';
import { auth } from '@/firebase';

interface UseAuthActionsReturn {
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signInAsGuest: () => Promise<User>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthActions = (): UseAuthActionsReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInAsGuest = useCallback(async (): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in as guest';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    signIn,
    signInAsGuest,
    signOut,
    clearError,
  };
};
