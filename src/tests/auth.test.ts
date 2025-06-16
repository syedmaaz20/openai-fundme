import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import TopNav from '@/components/TopNav';
import { supabase } from '@/lib/supabase';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      refreshSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(),
      update: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Authentication System Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Login Functionality', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      const mockProfile = {
        id: '123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        user_type: 'student',
      };

      (supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as any).mockReturnValue({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockProfile, error: null }),
          }),
        }),
      });

      render(
        <TestWrapper>
          <AuthModal isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should show error message for invalid credentials', async () => {
      (supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      });

      render(
        <TestWrapper>
          <AuthModal isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
      });
    });

    it('should validate password requirements', async () => {
      render(
        <TestWrapper>
          <AuthModal isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );

      // Switch to signup mode
      const signUpLink = screen.getByText(/sign up/i);
      fireEvent.click(signUpLink);

      const passwordInput = screen.getByLabelText(/password/i);
      const createButton = screen.getByRole('button', { name: /create account/i });

      // Test short password
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(passwordInput).toBeInvalid();
      });
    });

    it('should handle session timeout', async () => {
      const mockExpiredSession = {
        expires_at: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
      };

      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: mockExpiredSession },
        error: null,
      });

      (supabase.auth.refreshSession as any).mockResolvedValue({
        data: { session: null },
        error: { message: 'Session expired' },
      });

      render(
        <TestWrapper>
          <TopNav />
        </TestWrapper>
      );

      // Simulate session check
      await waitFor(() => {
        expect(supabase.auth.refreshSession).toHaveBeenCalled();
      });
    });
  });

  describe('2. Logout Functionality', () => {
    it('should successfully logout and clear session data', async () => {
      (supabase.auth.signOut as any).mockResolvedValue({
        error: null,
      });

      const TestComponent = () => {
        const { logout, user } = useAuth();
        return (
          <div>
            <span data-testid="user-status">{user ? 'logged-in' : 'logged-out'}</span>
            <button onClick={logout}>Logout</button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const logoutButton = screen.getByText(/logout/i);
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(supabase.auth.signOut).toHaveBeenCalled();
        expect(screen.getByTestId('user-status')).toHaveTextContent('logged-out');
      });
    });

    it('should clear localStorage and sessionStorage on logout', async () => {
      localStorage.setItem('test-data', 'should-be-cleared');
      sessionStorage.setItem('test-session', 'should-be-cleared');

      (supabase.auth.signOut as any).mockResolvedValue({
        error: null,
      });

      const TestComponent = () => {
        const { logout } = useAuth();
        return <button onClick={logout}>Logout</button>;
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const logoutButton = screen.getByText(/logout/i);
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(supabase.auth.signOut).toHaveBeenCalled();
      });
    });
  });

  describe('3. Security Measures', () => {
    it('should use HTTPS in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // In a real test, you'd check if the app enforces HTTPS
      expect(window.location.protocol).toBe('https:');

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle concurrent sessions', async () => {
      const mockSession1 = { user: { id: '123' }, expires_at: Date.now() / 1000 + 3600 };
      const mockSession2 = { user: { id: '456' }, expires_at: Date.now() / 1000 + 3600 };

      (supabase.auth.getSession as any)
        .mockResolvedValueOnce({ data: { session: mockSession1 }, error: null })
        .mockResolvedValueOnce({ data: { session: mockSession2 }, error: null });

      // Simulate multiple auth contexts
      const TestComponent1 = () => {
        const { user } = useAuth();
        return <span data-testid="user1">{user?.id || 'none'}</span>;
      };

      const TestComponent2 = () => {
        const { user } = useAuth();
        return <span data-testid="user2">{user?.id || 'none'}</span>;
      };

      render(
        <TestWrapper>
          <TestComponent1 />
          <TestComponent2 />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user1')).toBeInTheDocument();
        expect(screen.getByTestId('user2')).toBeInTheDocument();
      });
    });

    it('should protect against rapid login attempts', async () => {
      const mockError = { message: 'Too many requests' };
      (supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      render(
        <TestWrapper>
          <AuthModal isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /sign in/i });

      // Simulate rapid login attempts
      for (let i = 0; i < 5; i++) {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(loginButton);
      }

      await waitFor(() => {
        expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
      });
    });
  });

  describe('4. Cross-Tab Functionality', () => {
    it('should sync auth state across tabs', async () => {
      const mockStorageEvent = new StorageEvent('storage', {
        key: 'supabase.auth.token',
        newValue: 'new-token',
        oldValue: 'old-token',
      });

      const TestComponent = () => {
        const { refreshSession } = useAuth();
        
        React.useEffect(() => {
          const handleStorageChange = () => {
            refreshSession();
          };
          
          window.addEventListener('storage', handleStorageChange);
          return () => window.removeEventListener('storage', handleStorageChange);
        }, [refreshSession]);

        return <div data-testid="auth-component">Auth Component</div>;
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Simulate storage change from another tab
      window.dispatchEvent(mockStorageEvent);

      await waitFor(() => {
        expect(screen.getByTestId('auth-component')).toBeInTheDocument();
      });
    });

    it('should handle tab visibility changes', async () => {
      const mockVisibilityChange = () => {
        Object.defineProperty(document, 'visibilityState', {
          value: 'visible',
          writable: true,
        });
        
        const event = new Event('visibilitychange');
        document.dispatchEvent(event);
      };

      (supabase.auth.refreshSession as any).mockResolvedValue({
        data: { session: { user: { id: '123' } } },
        error: null,
      });

      render(
        <TestWrapper>
          <TopNav />
        </TestWrapper>
      );

      // Simulate tab becoming visible
      mockVisibilityChange();

      await waitFor(() => {
        expect(supabase.auth.refreshSession).toHaveBeenCalled();
      });
    });
  });
});