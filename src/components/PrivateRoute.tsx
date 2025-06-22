
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
  requiredUserType?: 'student' | 'donor' | 'admin';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredUserType }) => {
  const { isAuthenticated, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Authenticating...</p>
          </div>
        </div>
      </div>
    );
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
