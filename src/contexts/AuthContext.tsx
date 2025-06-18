import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, UserProfile, signIn, signOut, getUserProfile } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    userType: 'student' | 'donor' | 'admin',
    username?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Cleanup function to clear all auth-related data
  const clearAuthData = async () => {
    console.log('Clearing all auth data...');
    
    // Clear React state
    setSession(null);
    setUser(null);
    setProfile(null);
    
    // Clear Supabase session
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.error('Error during Supabase signOut:', error);
    }
    
    // Clear localStorage (Supabase stores session data here)
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('supabase.auth.token') || 
            key.startsWith('sb-') || 
            key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    
    // Clear sessionStorage as well
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('supabase.auth.token') || 
            key.startsWith('sb-') || 
            key.includes('supabase')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  };

  // Handle session timeout with proper cleanup and user notification
  const handleSessionTimeout = async () => {
    console.warn('Session timeout detected - performing complete logout');
    
    // Clear all auth data
    await clearAuthData();
    
    // Show user-friendly notification
    toast({
      title: "Session Expired",
      description: "Your session has expired for security reasons. Please sign in again to continue.",
      variant: "destructive",
      duration: 6000,
    });
    
    // Redirect to homepage
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    let timeoutTimer: NodeJS.Timeout;
    let visibilityListener: (() => void) | null = null;
    let validationInterval: NodeJS.Timeout;
    let authSubscription: any = null;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          await clearAuthData();
          return;
        }

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          await loadUserProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        await clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Safety timeout with comprehensive cleanup
    timeoutTimer = setTimeout(async () => {
      console.warn('Auth loading timeout reached - triggering session timeout handler');
      await handleSessionTimeout();
    }, 5000);

    // Listen for auth changes
    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          // Clear the timeout since we got a response
          if (timeoutTimer) {
            clearTimeout(timeoutTimer);
          }
          
          setSession(session);
          
          if (session?.user) {
            setUser(session.user);
            await loadUserProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }
          
          // Only set loading to false after we've processed the auth change
          if (loading) {
            setLoading(false);
          }
        }
      );
      
      authSubscription = subscription;
      return subscription;
    };

    const subscription = setupAuthListener();

    // Fix: Force re-fetch session when tab becomes active
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        try {
          console.log('Tab became visible, re-fetching session...');
          const { data: { session: currentSession }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error re-fetching session on visibility change:', error);
            await handleSessionTimeout();
            return;
          }

          // Only update if session actually changed
          if (currentSession?.access_token !== session?.access_token) {
            console.log('Session changed, updating state...');
            setSession(currentSession);
            
            if (currentSession?.user) {
              setUser(currentSession.user);
              await loadUserProfile(currentSession.user.id);
            } else {
              setUser(null);
              setProfile(null);
            }
          }
        } catch (error) {
          console.error('Error handling visibility change:', error);
          await handleSessionTimeout();
        }
      }
    };

    visibilityListener = handleVisibilityChange;
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Fix: Add periodic session validation with timeout handling
    const validateSession = async () => {
      if (session) {
        try {
          const { data: { user: currentUser }, error } = await supabase.auth.getUser();
          
          if (error || !currentUser) {
            console.log('Session validation failed, triggering timeout handler');
            await handleSessionTimeout();
          }
        } catch (error) {
          console.error('Error validating session:', error);
          await handleSessionTimeout();
        }
      }
    };

    // Validate session every 5 minutes
    validationInterval = setInterval(validateSession, 5 * 60 * 1000);

    // Cleanup function
    return () => {
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
      }
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      if (visibilityListener) {
        document.removeEventListener("visibilitychange", visibilityListener);
      }
      if (validationInterval) {
        clearInterval(validationInterval);
      }
    };
  }, [loading]);

  const loadUserProfile = async (userId: string) => {
    try {
      const userProfile = await getUserProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfile(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user: authUser } = await signIn(email, password);
      // Session will be updated via onAuthStateChange
    } catch (error) {
      // Handle specific email confirmation error
      if (error instanceof Error && error.message.includes('Email not confirmed')) {
        throw new Error('Please confirm your email address. Check your inbox for a verification link.');
      }
      throw error;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    userType: 'student' | 'donor' | 'admin',
    username?: string
  ) => {
    try {
      // Check if username is unique for students
      if (userType === 'student' && username) {
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .maybeSingle();
        
        if (existingUser) {
          throw new Error('Username already exists');
        }
      }

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile with correct field names
        const profileData: Omit<UserProfile, 'created_at' | 'updated_at'> = {
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
          username: userType === 'student' ? username : undefined,
        };

        // Insert profile directly using supabase client
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error('Failed to create user profile');
        }

        // Session will be updated via onAuthStateChange
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearAuthData();
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      // Redirect to homepage
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local data
      await clearAuthData();
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(updatedProfile);
  };

  const isAuthenticated = !!session?.user;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      login,
      signup,
      logout,
      isAuthenticated,
      updateProfile
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