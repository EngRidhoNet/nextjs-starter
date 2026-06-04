"use client";

import { useState } from "react";
import { useIsMobile } from "@hooks/useMediaQuery";
import { Sidebar } from "@components/dashboard/Sidebar";
import { Topbar } from "@components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex">
      <Sidebar isMobile={isMobile} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
