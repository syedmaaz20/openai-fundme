import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, UserProfile, signIn, signOut, getUserProfile } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

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

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          return;
        }

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          await loadUserProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Safety timeout in case Supabase hangs
    const timer = setTimeout(() => {
      console.warn('Auth loading timeout reached, setting loading to false');
      setLoading(false);
    }, 5000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
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

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [loading]);

  // Fix: Force re-fetch session when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        try {
          console.log('Tab became visible, re-fetching session...');
          const { data: { session: currentSession }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error re-fetching session on visibility change:', error);
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
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [session]);

  // Fix: Add periodic session validation
  useEffect(() => {
    const validateSession = async () => {
      if (session) {
        try {
          const { data: { user: currentUser }, error } = await supabase.auth.getUser();
          
          if (error || !currentUser) {
            console.log('Session validation failed, clearing auth state');
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        } catch (error) {
          console.error('Error validating session:', error);
        }
      }
    };

    // Validate session every 5 minutes
    const interval = setInterval(validateSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [session]);

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
    await signOut();
    // Session will be cleared via onAuthStateChange
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