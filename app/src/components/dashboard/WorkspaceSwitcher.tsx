"use client";

import { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { Building2, ChevronDown, Check } from "lucide-react";

export function WorkspaceSwitcher() {
  const { workspace, workspaces, switchWorkspace } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Building2 className="h-4 w-4 text-rose-500 hidden sm:block" />
        <span className="font-medium text-sm text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">
          {workspace?.name ?? "No Workspace"}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-200/80 z-50 py-1">
            <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Workspaces</div>
            {workspaces.map((ws) => (
              <button
                key={ws.workspace.id}
                onClick={() => { switchWorkspace(ws.workspace.id); setOpen(false); }}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                  ws.workspace.id === workspace?.id
                    ? "bg-rose-50 text-rose-700"
                    : "text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium truncate text-[13px]">{ws.workspace.name}</p>
                  <p className="text-[11px] text-gray-400 capitalize">{ws.membership.role.slug}</p>
                </div>
                {ws.workspace.id === workspace?.id && <Check className="h-4 w-4 flex-shrink-0 text-rose-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
