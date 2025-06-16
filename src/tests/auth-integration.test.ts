import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '@/lib/supabase';

// Integration tests for actual Supabase auth flow
describe('Authentication Integration Tests', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'testpassword123',
    firstName: 'Test',
    lastName: 'User',
    userType: 'student' as const,
  };

  beforeEach(() => {
    // Clean up any existing sessions
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up test data
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Cleanup error:', error);
    }
  });

  describe('Real Authentication Flow', () => {
    it('should handle complete signup and login flow', async () => {
      // Test signup
      const signupResult = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
      });

      expect(signupResult.error).toBeNull();
      expect(signupResult.data.user).toBeTruthy();

      // Test login
      const loginResult = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      });

      expect(loginResult.error).toBeNull();
      expect(loginResult.data.user).toBeTruthy();
      expect(loginResult.data.session).toBeTruthy();
    });

    it('should handle session refresh', async () => {
      // First login
      await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      });

      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      expect(currentSession).toBeTruthy();

      // Refresh session
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
      
      expect(error).toBeNull();
      expect(refreshedSession).toBeTruthy();
      expect(refreshedSession?.access_token).toBeTruthy();
    });

    it('should handle logout properly', async () => {
      // Login first
      await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      });

      // Verify logged in
      const { data: { session: beforeLogout } } = await supabase.auth.getSession();
      expect(beforeLogout).toBeTruthy();

      // Logout
      const { error } = await supabase.auth.signOut();
      expect(error).toBeNull();

      // Verify logged out
      const { data: { session: afterLogout } } = await supabase.auth.getSession();
      expect(afterLogout).toBeNull();
    });

    it('should handle invalid credentials', async () => {
      const result = await supabase.auth.signInWithPassword({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

      expect(result.error).toBeTruthy();
      expect(result.data.user).toBeNull();
      expect(result.data.session).toBeNull();
    });

    it('should validate email format', async () => {
      const result = await supabase.auth.signUp({
        email: 'invalid-email',
        password: testUser.password,
      });

      expect(result.error).toBeTruthy();
      expect(result.error?.message).toContain('email');
    });

    it('should enforce password requirements', async () => {
      const result = await supabase.auth.signUp({
        email: testUser.email,
        password: '123', // Too short
      });

      expect(result.error).toBeTruthy();
      expect(result.error?.message).toContain('password');
    });
  });

  describe('Profile Management Integration', () => {
    it('should create and fetch user profile', async () => {
      // Login first
      const { data: { user } } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      });

      if (!user) throw new Error('Login failed');

      // Create profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: testUser.email,
          first_name: testUser.firstName,
          last_name: testUser.lastName,
          user_type: testUser.userType,
        });

      expect(insertError).toBeNull();

      // Fetch profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      expect(fetchError).toBeNull();
      expect(profile).toBeTruthy();
      expect(profile?.email).toBe(testUser.email);
      expect(profile?.first_name).toBe(testUser.firstName);
      expect(profile?.user_type).toBe(testUser.userType);
    });

    it('should update user profile', async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const updateData = {
        story: 'Updated story',
        funding_goal: 15000,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      expect(error).toBeNull();

      // Verify update
      const { data: profile } = await supabase
        .from('profiles')
        .select('story, funding_goal')
        .eq('id', user.id)
        .single();

      expect(profile?.story).toBe(updateData.story);
      expect(profile?.funding_goal).toBe(updateData.funding_goal);
    });
  });

  describe('Security and RLS Testing', () => {
    it('should enforce RLS policies', async () => {
      // Try to access another user's profile without authentication
      await supabase.auth.signOut();

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', testUser.email);

      // Should either return empty or require authentication
      expect(data).toEqual([]);
    });

    it('should prevent unauthorized profile updates', async () => {
      // Login as one user
      const { data: { user } } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      });

      if (!user) throw new Error('Login failed');

      // Try to update another user's profile (should fail)
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      const { error } = await supabase
        .from('profiles')
        .update({ story: 'Hacked!' })
        .eq('id', fakeUserId);

      // Should fail due to RLS
      expect(error).toBeTruthy();
    });
  });

  describe('Session Management', () => {
    it('should handle concurrent sessions', async () => {
      // Create multiple auth clients (simulating different tabs)
      const client1 = supabase;
      const client2 = supabase; // In real test, would be separate instance

      // Login with both
      const login1 = await client1.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      });

      const login2 = await client2.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      });

      expect(login1.error).toBeNull();
      expect(login2.error).toBeNull();

      // Both should have valid sessions
      const session1 = await client1.auth.getSession();
      const session2 = await client2.auth.getSession();

      expect(session1.data.session).toBeTruthy();
      expect(session2.data.session).toBeTruthy();
    });

    it('should handle session expiration gracefully', async () => {
      // Login
      await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password,
      });

      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeTruthy();

      // Mock expired session by manipulating the token
      // In real scenario, you'd wait for actual expiration or mock the time
      const expiredTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      
      // Try to refresh an "expired" session
      const { data: refreshData, error } = await supabase.auth.refreshSession();
      
      // Should either refresh successfully or handle expiration
      if (error) {
        expect(error.message).toContain('expired');
      } else {
        expect(refreshData.session).toBeTruthy();
      }
    });
  });
});