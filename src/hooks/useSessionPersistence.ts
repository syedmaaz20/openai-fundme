import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface UseSessionPersistenceOptions {
  onSessionRefresh?: () => void;
  onSessionExpired?: () => void;
  refreshInterval?: number;
}

export const useSessionPersistence = (options: UseSessionPersistenceOptions = {}) => {
  const {
    onSessionRefresh,
    onSessionExpired,
    refreshInterval = 300000 // 5 minutes
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckRef = useRef<number>(Date.now());

  const checkAndRefreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        onSessionExpired?.();
        return false;
      }

      if (!session) {
        onSessionExpired?.();
        return false;
      }

      // Check if session is close to expiring (within 5 minutes)
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      if (timeUntilExpiry < 300000) { // Less than 5 minutes
        const { error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('Session refresh error:', refreshError);
          onSessionExpired?.();
          return false;
        }
        
        onSessionRefresh?.();
      }

      lastCheckRef.current = now;
      return true;
    } catch (error) {
      console.error('Session persistence error:', error);
      onSessionExpired?.();
      return false;
    }
  }, [onSessionRefresh, onSessionExpired]);

  const handleVisibilityChange = useCallback(async () => {
    if (document.visibilityState === 'visible') {
      const timeSinceLastCheck = Date.now() - lastCheckRef.current;
      
      // If it's been more than 1 minute since last check, refresh session
      if (timeSinceLastCheck > 60000) {
        await checkAndRefreshSession();
      }
    }
  }, [checkAndRefreshSession]);

  const handleFocus = useCallback(async () => {
    const timeSinceLastCheck = Date.now() - lastCheckRef.current;
    
    // If it's been more than 1 minute since last check, refresh session
    if (timeSinceLastCheck > 60000) {
      await checkAndRefreshSession();
    }
  }, [checkAndRefreshSession]);

  const handleStorageChange = useCallback(async (e: StorageEvent) => {
    // Listen for auth token changes in other tabs
    if (e.key?.includes('supabase.auth.token')) {
      setTimeout(() => checkAndRefreshSession(), 100);
    }
  }, [checkAndRefreshSession]);

  useEffect(() => {
    // Initial session check
    checkAndRefreshSession();

    // Set up periodic session refresh
    intervalRef.current = setInterval(checkAndRefreshSession, refreshInterval);

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAndRefreshSession, handleVisibilityChange, handleFocus, handleStorageChange, refreshInterval]);

  return {
    checkAndRefreshSession,
    lastCheck: lastCheckRef.current
  };
};