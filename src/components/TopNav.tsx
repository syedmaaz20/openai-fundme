import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
];

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout, isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
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
      setShowLogoutDialog(false);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const confirmLogout = () => {
    setShowLogoutDialog(true);
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

  // Show loading skeleton while checking session
  if (loading) {
    return (
      <header className="sticky top-0 z-30 bg-white bg-opacity-95 shadow-sm w-full">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-blue-700 via-blue-500 to-green-400 bg-clip-text text-transparent">
            EduFund
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </nav>
      </header>
    );
  }

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
            
            {isAuthenticated && user ? (
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
                    <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.first_name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <User size={16} />
                      )}
                      <span className="text-sm font-medium">{profile?.first_name || user.email}</span>
                      <ChevronDown size={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50">
                      <DropdownMenuItem onClick={() => navigate(getDashboardRoute())}>
                        <LayoutDashboard size={16} className="mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(getProfileRoute())}>
                        <UserCircle size={16} className="mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings size={16} className="mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={confirmLogout}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
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
            {!isAuthenticated ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold shadow hover:scale-105 transition text-sm"
              >
                Sign In
              </button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.first_name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User size={16} />
                  )}
                  <span className="text-sm font-medium">{profile?.first_name || user?.email}</span>
                  <ChevronDown size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50">
                  <DropdownMenuItem onClick={() => navigate(getDashboardRoute())}>
                    <LayoutDashboard size={16} className="mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(getProfileRoute())}>
                    <UserCircle size={16} className="mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings size={16} className="mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={confirmLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default TopNav;