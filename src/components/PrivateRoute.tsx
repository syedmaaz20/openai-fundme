import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
  requiredUserType?: 'student' | 'donor' | 'admin';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredUserType }) => {
  const { isAuthenticated, loading, profile } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Optional: Add safety timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout reached');
        setTimeoutReached(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && !timeoutReached) {
    return (
      <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Authenticating...</p>
            <p className="text-sm text-gray-400 mt-2">This should only take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  // If timeout reached, treat as not authenticated
  if (timeoutReached && loading) {
    console.error('Authentication timeout - redirecting');
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredUserType && profile?.user_type !== requiredUserType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
