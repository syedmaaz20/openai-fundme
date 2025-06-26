
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { LogOut, User, Settings, LayoutDashboard, UserCircle, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
];

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout, isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Debug logging to understand the current user state
  useEffect(() => {
    console.log('Current user:', user);
    console.log('Current profile:', profile);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Is loading:', isLoading);
  }, [user, profile, isAuthenticated, isLoading]);

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
    try {
      await logout();
      navigate('/');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDashboard = () => {
    console.log('Dashboard clicked, user type:', profile?.user_type);
    const route = getDashboardRoute();
    console.log('Navigating to:', route);
    navigate(route);
  };

  const handleProfile = () => {
    console.log('Profile clicked, user type:', profile?.user_type);
    const route = getProfileRoute();
    console.log('Navigating to:', route);
    navigate(route);
  };

  const handleSettings = () => {
    console.log('Settings clicked');
    // For now, we'll navigate to profile as settings aren't implemented yet
    const route = getProfileRoute();
    navigate(route);
  };

  const getDashboardRoute = () => {
    switch (profile?.user_type) {
      case 'student':
        return '/student-dashboard';
      case 'donor':
        return '/donor-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/';
    }
  };

  const getProfileRoute = () => {
    switch (profile?.user_type) {
      case 'student':
        return '/student-profile';
      case 'donor':
        return '/donor-profile';
      default:
        return '/';
    }
  };

  // Get display name with fallbacks
  const getDisplayName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (profile?.username) {
      return profile.username;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Use email username as fallback
    }
    return 'User';
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
                    className="relative transition-colors hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50"
                  >
                    {link.label}
                  </a>
                ) : link.href.startsWith("/") ? (
                  <Link
                    to={link.href}
                    className="relative transition-colors hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="relative transition-colors hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            
            {isAuthenticated ? (
              <>
                {profile?.user_type === 'student' && (
                  <li>
                    <button
                      onClick={handleStartCampaign}
                      className="ml-3 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold shadow hover:scale-105 transition"
                    >
                      My Campaign
                    </button>
                  </li>
                )}
                <li className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <User size={16} />
                      <span className="text-sm font-medium">{getDisplayName()}</span>
                      <ChevronDown size={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50 mt-1">
                      <DropdownMenuItem 
                        onClick={handleDashboard}
                        className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <LayoutDashboard size={16} className="mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={handleProfile}
                        className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <UserCircle size={16} className="mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={handleSettings}
                        className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Settings size={16} className="mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 text-red-600"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="ml-3 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold shadow hover:scale-105 transition"
                >
                  Sign In
                </button>
              </li>
            )}
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
