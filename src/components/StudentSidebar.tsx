
import React from "react";
import { LayoutDashboard, PlusCircle, MessageCircle, User2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/profile/student" },
  { label: "Create Campaign", icon: PlusCircle, to: "#" },
  { label: "Messages", icon: MessageCircle, to: "#" },
  { label: "Profile", icon: User2, to: "#" },
];

const StudentSidebar = () => {
  const location = useLocation();
  return (
    <aside className="min-h-screen w-56 bg-white border-r pt-6 pr-1 hidden md:block">
      <nav className="flex flex-col gap-1 px-4">
        <span className="uppercase text-xs text-muted-foreground tracking-wide mb-4 pl-2">Student Menu</span>
        {menu.map((item) => (
          <Link
            to={item.to}
            key={item.label}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-lg font-medium text-gray-700 transition-colors hover:bg-blue-50 ${
              location.pathname === item.to ? "bg-blue-100 text-blue-700" : ""
            }`}
            aria-current={location.pathname === item.to ? "page" : undefined}
          >
            <item.icon size={18} className="shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default StudentSidebar;
