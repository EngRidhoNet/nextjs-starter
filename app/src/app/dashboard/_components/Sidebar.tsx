"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@context/AuthContext";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { LogOut, X, LayoutDashboard, Users, Settings, Search, HelpCircle, Bell, Sparkles, ChevronRight } from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Team", href: "/dashboard/team" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!isOpen && isMobile) return null;

  return (
    <>
      {isMobile && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />}
      <aside className={[
        isMobile ? "fixed inset-y-0 left-0 z-50 w-[260px]" : "relative w-[260px] flex-shrink-0",
        "flex flex-col bg-white border-r border-gray-200/80",
      ].join(" ")}>
        {/* Logo */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <Link href="/dashboard" className="font-bold text-[17px] text-gray-900 tracking-tight">Winsta</Link>
              <span className="text-[10px] text-rose-500 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">AI</span>
            </div>
            {isMobile && <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"><X className="h-4 w-4" /></button>}
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input type="text" placeholder="Search..." className="w-full h-9 pl-9 pr-12 text-sm bg-gray-50 border border-gray-200/80 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all" />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5 font-medium">⌘F</kbd>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => isMobile && onClose()}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                  isActive ? "bg-rose-50/80 text-rose-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                ].join(" ")}>
                <item.icon className={`h-[18px] w-[18px] ${isActive ? "text-rose-600" : "text-gray-400"}`} />
                {item.label}
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-rose-400 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-100">
          <div className="px-3 py-2 space-y-0.5">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <HelpCircle className="h-[18px] w-[18px] text-gray-400" />Help center
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors relative">
              <Bell className="h-[18px] w-[18px] text-gray-400" />Notifications
              <span className="ml-auto flex items-center justify-center h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-bold">3</span>
            </button>
          </div>
          <div className="px-3 py-3 border-t border-gray-100">
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="h-9 w-9 ring-2 ring-gray-100">
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold">
                  {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="mt-1 w-full flex items-center justify-center gap-2 px-3 py-2 text-[13px] text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
