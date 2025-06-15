
import { Link, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/auth/UserMenu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
];

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (location.pathname !== href) {
      navigate(href);
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  return (
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
        </ul>
        
        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <UserMenu />
              ) : (
                <Button
                  onClick={handleAuthClick}
                  className="bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold shadow hover:scale-105 transition"
                >
                  Sign In
                </Button>
              )}
              <a
                href="#"
                className="py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold shadow hover:scale-105 transition"
              >
                Start a Campaign
              </a>
            </>
          )}
        </div>
        
        {/* Mobile: Hamburger button */}
        <div className="md:hidden">
          {/* Just placeholder: for MVP we omit mobile nav */}
        </div>
      </nav>
    </header>
  );
};

export default TopNav;
