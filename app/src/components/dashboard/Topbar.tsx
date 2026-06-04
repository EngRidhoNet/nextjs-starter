"use client";

import { useAuth } from "@context/AuthContext";
import { useIsMobile } from "@hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { Menu, Share2, MoreHorizontal, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
  onMenuClick: () => void;
}

function getBreadcrumbs(pathname: string, workspaceName?: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  
  if (segments.length > 1) {
    // Skip "dashboard" in display, but use it for href
    for (let i = 1; i < segments.length; i++) {
      const slug = segments[i];
      const href = "/" + segments.slice(0, i + 1).join("/");
      const label = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
      crumbs.push({ label, href });
    }
  }

  if (crumbs.length === 0) {
    crumbs.push({ label: workspaceName || "Dashboard", href: "/dashboard" });
  }

  return crumbs;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, workspace } = useAuth();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname, workspace?.name);

  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
      <div className="h-14 flex items-center justify-between px-4 lg:px-6">
        {/* Left: Menu + Breadcrumbs */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-1.5 -ml-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Back arrow for sub-pages */}
          {pathname !== "/dashboard" && (
            <Link
              href="/dashboard"
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors hidden sm:flex"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}

          {/* Workspace Switcher (as first crumb) */}
          <div className="hidden sm:block">
            <WorkspaceSwitcher />
          </div>

          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <div key={crumb.href} className="flex items-center gap-1.5">
                {(i > 0 || !isMobile) && (
                  <span className="text-gray-300 hidden sm:block">›</span>
                )}
                {i === breadcrumbs.length - 1 ? (
                  <span className="font-semibold text-gray-900 truncate max-w-[180px]">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors truncate max-w-[120px]"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            Manage
          </button>
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
