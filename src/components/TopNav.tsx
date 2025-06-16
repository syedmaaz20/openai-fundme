import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { LogOut, User, Loader2 } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
];

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (location.pathname !== href) {
      navigate(href);
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const handleStartCampaign = () => {
    navigate('/student-profile');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderAuthSection = () => {
    // Show loading spinner only for a brief moment during initial load
    if (loading) {
      return (
        <li className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </li>
      );
    }

    if (isAuthenticated && user) {
      return (
        <>
          {user.userType === 'student' && (
            <li>
              <button
                onClick={handleStartCampaign}
                className="ml-3 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold shadow hover:scale-105 transition"
              >
                My Campaign
              </button>
            </li>
          )}
          <li className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <User size={16} />
              )}
              <span className="text-sm font-medium">{user.firstName}</span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 ml-1"
                disabled={isLoggingOut}
                title="Sign out"
              >
                {isLoggingOut ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} />
                )}
              </button>
            </div>
          </li>
        </>
      );
    }

    return (
      <li>
        <button
          onClick={() => setShowAuthModal(true)}
          className="ml-3 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold shadow hover:scale-105 transition"
        >
          Sign In
        </button>
      </li>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white bg-opacity-95 shadow-sm w-full">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-blue-700 via-blue-500 to-green-400 bg-clip-text text-transparent">
            EduFund
          </div>
          
          <ul className="hidden md:flex gap-7 text-base font-medium text-gray-700">
            {navLinks.map(link => (
              <li key={link.label}>
                {["/", "/about", "/how-it-works"].includes(link.href) ? (
                  <a
                    href={link.href}
                    onClick={e => handleNavClick(e, link.href)}
                    className="relative transition-colors hover:text-blue-600"
                  >
                    {link.label}
                  </a>
                ) : link.href.startsWith("/") ? (
                  <Link
                    to={link.href}
                    className="relative transition-colors hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="relative transition-colors hover:text-blue-600"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            
            {renderAuthSection()}
          </ul>
          
          {/* Mobile: Hamburger button */}
          <div className="md:hidden">
            {/* Just placeholder: for MVP we omit mobile nav */}
          </div>
        </nav>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default TopNav;