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
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track user activity to prevent unnecessary session checks
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Refresh session and check if it's still valid
  const refreshSession = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setLoading(true);
      
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
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Handle tab visibility changes with retry logic
  const handleVisibilityChange = useCallback(async () => {
    if (document.visibilityState === 'visible' && isInitialized && mountedRef.current) {
      // Only refresh if there's been some time since last activity
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      if (timeSinceActivity > 30000) { // 30 seconds
        updateActivity();
        try {
          await refreshSession();
        } catch (error) {
          console.error('Visibility change refresh failed:', error);
          // Force a session check on next interaction
          setTimeout(() => {
            if (mountedRef.current) {
              refreshSession();
            }
          }, 1000);
        }
      }
    }
  }, [refreshSession, isInitialized]);

  // Handle window focus with immediate session validation
  const handleWindowFocus = useCallback(async () => {
    if (isInitialized && mountedRef.current) {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      if (timeSinceActivity > 30000) { // 30 seconds
        updateActivity();
        try {
          // Quick session validation on focus
          const { data: { session } } = await supabase.auth.getSession();
          if (!session && user) {
            // Session lost, clear user
            setUser(null);
            setLoading(false);
          } else if (session && !user) {
            // Session exists but no user, refresh
            await refreshSession();
          }
        } catch (error) {
          console.error('Focus refresh failed:', error);
        }
      }
    }
  }, [refreshSession, isInitialized, user]);

  // Handle storage events (when auth state changes in another tab)
  const handleStorageChange = useCallback(async (e: StorageEvent) => {
    if (e.key?.includes('supabase.auth.token') && isInitialized && mountedRef.current) {
      // Auth state changed in another tab, refresh our session
      updateActivity();
      setTimeout(() => {
        if (mountedRef.current) {
          refreshSession();
        }
      }, 100);
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
    
    // Get initial session with extended timeout and retry logic
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

    // Set a timeout to prevent infinite loading - extended to 10 seconds
    initTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn('Auth loading timeout - setting loading to false');
        setLoading(false);
        setIsInitialized(true);
        // Try one more session check
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user && mountedRef.current) {
            fetchUserProfile(session.user);
          }
        }).catch(console.error);
      }
    }, 10000); // Extended to 10 seconds

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
          setIsInitialized(true);
        }
      }
    });

    // Add event listeners for tab/window focus and storage changes
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    window.addEventListener('focus', handleWindowFocus, { passive: true });
    window.addEventListener('storage', handleStorageChange, { passive: true });
    
    // Add activity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Set up periodic session check (every 5 minutes when active)
    sessionCheckRef.current = setInterval(async () => {
      if (document.visibilityState === 'visible' && isInitialized && mountedRef.current) {
        const timeSinceActivity = Date.now() - lastActivityRef.current;
        if (timeSinceActivity < 300000) { // Only if active in last 5 minutes
          try {
            // Quick session validation
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && user) {
              setUser(null);
            } else if (session && session.expires_at) {
              const expiresAt = session.expires_at * 1000;
              const timeUntilExpiry = expiresAt - Date.now();
              // Refresh if expiring within 5 minutes
              if (timeUntilExpiry < 300000) {
                await refreshSession();
              }
            }
          } catch (error) {
            console.error('Periodic session check failed:', error);
          }
        }
      }
    }, 300000); // 5 minutes

    return () => {
      mountedRef.current = false;
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
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