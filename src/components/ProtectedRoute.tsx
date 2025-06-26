
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'student' | 'donor' | 'admin';
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredUserType,
  fallbackPath = '/'
}) => {
  const { isAuthenticated, profile, isLoading, session } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  // But only if we don't have a session yet
  if (isLoading && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if not authenticated and loading is complete
  if (!isLoading && !isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check user type if required and we have profile data
  if (!isLoading && requiredUserType && profile && profile.user_type !== requiredUserType) {
    return <Navigate to={fallbackPath} replace />;
  }

  // If we're authenticated but still loading profile, show the children
  // This prevents the redirect loop issue
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Fallback loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
