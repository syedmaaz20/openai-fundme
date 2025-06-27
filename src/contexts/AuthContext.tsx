
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username?: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'donor' | 'admin';
  avatar?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string, userType: 'student' | 'donor' | 'admin', username?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const isAuthenticated = !!user && !!session;

  // Fetch user profile from profiles table
  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log('Fetching profile for user:', userId, 'Retry count:', retryCount);
      setProfileLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist and this is a fresh attempt, retry after a short delay
        if (error.code === 'PGRST116' && retryCount < 3) {
          console.log('Profile not found, retrying in 1 second...');
          setTimeout(() => fetchProfile(userId, retryCount + 1), 1000);
          return null;
        }
        
        setProfileLoading(false);
        return null;
      }

      console.log('Profile fetched successfully:', data);
      setProfileLoading(false);
      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileLoading(false);
      return null;
    }
  };

  // Authentication functions
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      console.log('Login successful:', data.user?.id);
      return {};
    } catch (error) {
      setIsLoading(false);
      return { error: 'An unexpected error occurred' };
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
    setIsLoading(true);
    try {
      const metadata: any = {
        firstName,
        lastName,
        userType,
      };

      if (username && userType === 'student') {
        metadata.username = username;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      setIsLoading(false);
      return {};
    } catch (error) {
      setIsLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Set up auth state listener and session management
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');
        
        // Get the current session first
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        console.log('Current session:', currentSession?.user?.id || 'No session');

        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            // Fetch profile and wait for it to complete
            const userProfile = await fetchProfile(currentSession.user.id);
            if (mounted && userProfile) {
              setProfile(userProfile);
            }
          } else {
            setProfile(null);
          }

          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id || 'No user');
        
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Fetch user profile
          const userProfile = await fetchProfile(newSession.user.id);
          if (mounted && userProfile) {
            setProfile(userProfile);
          }
        } else {
          setProfile(null);
        }

        // Only set loading to false after initial auth setup
        if (event !== 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      }
    );

    // Initialize authentication
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Add effect to log current state for debugging
  useEffect(() => {
    console.log('Auth state update:', {
      user: user?.id,
      profile: profile?.first_name || profile?.username,
      isAuthenticated,
      isLoading,
      profileLoading
    });
  }, [user, profile, isAuthenticated, isLoading, profileLoading]);

  const value: AuthContextType = {
    user,
    profile,
    session,
    login,
    signup,
    logout,
    isLoading: isLoading || profileLoading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
