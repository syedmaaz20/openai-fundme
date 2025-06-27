
import { Link, useNavigate, useLocation } from "react-router-dom";
import React from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Student Profile", href: "/student-profile" },
  { label: "Student Dashboard", href: "/student-dashboard" },
  { label: "Donor Dashboard", href: "/donor-dashboard" },
  { label: "Donor Profile", href: "/donor-profile" },
  { label: "Admin Dashboard", href: "/admin-dashboard" },
];

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (location.pathname !== href) {
      navigate(href);
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  return (
    <header className="sticky top-0 z-30 bg-white bg-opacity-95 shadow-sm w-full">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-blue-700 via-blue-500 to-green-400 bg-clip-text text-transparent">
          EduFund
        </div>
        
        <ul className="hidden md:flex gap-4 text-base font-medium text-gray-700 flex-wrap">
          {navLinks.map(link => (
            <li key={link.label}>
              <Link
                to={link.href}
                className={`relative transition-colors hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 ${
                  location.pathname === link.href ? 'text-blue-600 bg-blue-50' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Mobile: Hamburger button placeholder */}
        <div className="md:hidden">
          <button className="p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default TopNav;
