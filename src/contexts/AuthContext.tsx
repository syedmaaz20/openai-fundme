import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, UserProfile, signIn, signOut, getUserProfile } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
// --- Type Definitions ---
interface AuthContextType {
user: User | null;
profile: UserProfile | null;
session: Session | null;
loading: boolean;
isAuthenticated: boolean;
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
updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}
// --- Auth Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// --- Auth Provider ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [user, setUser] = useState<User | null>(null);
const [profile, setProfile] = useState<UserProfile | null>(null);
const [session, setSession] = useState<Session | null>(null);
const [loading, setLoading] = useState(true);
// --- Session Management ---
useEffect(() => {
const getSession = async () => {
try {
const { data: { session }, error } = await supabase.auth.getSession();
if (error) {
throw error;
}
if (session) {
setSession(session);
setUser(session.user);
const userProfile = await getUserProfile(session.user.id);
setProfile(userProfile);
}
} catch (error) {
console.error('Error getting session:', error);
toast({
title: "Session Error",
description: "Could not retrieve your session. Please try logging in again.",
variant: "destructive",
});
} finally {
setLoading(false);
}
};
getSession();
const { data: authListener } = supabase.auth.onAuthStateChange(
async (_event, session) => {
setSession(session);
setUser(session?.user ?? null);
if (session?.user) {
const userProfile = await getUserProfile(session.user.id);
setProfile(userProfile);
} else {
setProfile(null);
}
setLoading(false);
}
);
return () => {
authListener?.subscription.unsubscribe();
};
}, []);
// --- Authentication Functions ---
const login = async (email, password) => {
setLoading(true);
await signIn(email, password);
// The onAuthStateChange listener will handle updating the state.
setLoading(false);
};
const signup = async (email, password, firstName, lastName, userType, username) => {
setLoading(true);
// This assumes you have a `signUp` function in your supabase lib.
// If not, you would implement it here.
// await signUp(email, password, { data: { first_name: firstName, last_name: lastName, user_type: userType, username } });
setLoading(false);
};
const logout = async () => {
setLoading(true);
await signOut();
// The onAuthStateChange listener will handle clearing the state.
setLoading(false);
};
const updateProfile = async (updates) => {
if (!user) return;
// This assumes you have an `updateUserProfile` function in your supabase lib.
// await updateUserProfile(user.id, updates);
const userProfile = await getUserProfile(user.id);
setProfile(userProfile);
};
// --- Value ---
const value = {
user,
profile,
session,
loading,
isAuthenticated: !!user,
login,
signup,
logout,
updateProfile,
};
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// --- Custom Hook ---
export const useAuth = () => {
const context = useContext(AuthContext);
if (context === undefined) {
throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};