import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'student' | 'donor' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, userType: User['userType']) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const mountedRef = useRef(true);
  const sessionCheckRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef(Date.now());

  // Track user activity to prevent unnecessary session checks
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Refresh session and check if it's still valid
  const refreshSession = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      // First try to refresh the session
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.warn('Session refresh failed:', error.message);
        // If refresh fails, try to get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user && mountedRef.current) {
          await fetchUserProfile(currentSession.user);
        } else if (mountedRef.current) {
          setUser(null);
        }
        return;
      }

      if (session?.user && mountedRef.current) {
        await fetchUserProfile(session.user);
      } else if (mountedRef.current) {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      if (mountedRef.current) {
        setUser(null);
      }
    }
  }, []);

  // Handle tab visibility changes
  const handleVisibilityChange = useCallback(async () => {
    if (document.visibilityState === 'visible' && isInitialized) {
      // Only refresh if there's been some time since last activity
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      if (timeSinceActivity > 30000) { // 30 seconds
        await refreshSession();
      }
    }
  }, [refreshSession, isInitialized]);

  // Handle window focus
  const handleWindowFocus = useCallback(async () => {
    if (isInitialized) {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      if (timeSinceActivity > 30000) { // 30 seconds
        await refreshSession();
      }
    }
  }, [refreshSession, isInitialized]);

  // Handle storage events (when auth state changes in another tab)
  const handleStorageChange = useCallback(async (e: StorageEvent) => {
    if (e.key === 'supabase.auth.token' && isInitialized) {
      // Auth state changed in another tab, refresh our session
      setTimeout(() => refreshSession(), 100);
    }
  }, [refreshSession, isInitialized]);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    if (!mountedRef.current) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (profile && mountedRef.current) {
        setUser({
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          userType: profile.user_type,
          avatar: profile.avatar_url
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mountedRef.current) {
            setLoading(false);
            setIsInitialized(true);
          }
          return;
        }

        if (session?.user && mountedRef.current) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn('Auth loading timeout - setting loading to false');
        setLoading(false);
        setIsInitialized(true);
      }
    }, 5000); // 5 second timeout

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;

      updateActivity();

      try {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
        } else if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    });

    // Add event listeners for tab/window focus and storage changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('storage', handleStorageChange);
    
    // Add activity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Set up periodic session check (every 5 minutes when active)
    sessionCheckRef.current = setInterval(async () => {
      if (document.visibilityState === 'visible' && isInitialized) {
        const timeSinceActivity = Date.now() - lastActivityRef.current;
        if (timeSinceActivity < 300000) { // Only if active in last 5 minutes
          await refreshSession();
        }
      }
    }, 300000); // 5 minutes

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      if (sessionCheckRef.current) {
        clearInterval(sessionCheckRef.current);
      }
      subscription.unsubscribe();
      
      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('storage', handleStorageChange);
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [handleVisibilityChange, handleWindowFocus, handleStorageChange, updateActivity, loading, isInitialized]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    updateActivity();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user && mountedRef.current) {
        await fetchUserProfile(data.user);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, userType: User['userType']) => {
    setLoading(true);
    updateActivity();
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user && mountedRef.current) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
          });

        if (profileError) {
          throw new Error(profileError.message);
        }

        // Fetch the created profile
        await fetchUserProfile(data.user);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const logout = async () => {
    setLoading(true);
    updateActivity();
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      if (mountedRef.current) {
        setUser(null);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      isAuthenticated,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};