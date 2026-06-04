"use client";

import { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { useIsMobile } from "@hooks/useMediaQuery";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Building2, ChevronDown, Check, Menu, Plus, X, Loader2, Share2, MoreHorizontal } from "lucide-react";
import { workspacesService } from "@services/workspaces.service";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, workspace, workspaces, tokens, switchWorkspace, refreshWorkspaces } = useAuth();
  const isMobile = useIsMobile();
  const [wsOpen, setWsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
      <div className="h-14 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button onClick={onMenuClick} className="p-1.5 -ml-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Workspace Switcher */}
          <div className="relative">
            <button onClick={() => setWsOpen(!wsOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Building2 className="h-4 w-4 text-rose-500 hidden sm:block" />
              <span className="font-medium text-sm text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">
                {workspace?.name ?? "No Workspace"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {wsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setWsOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-200/80 z-50 py-1">
                  <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                    Workspaces
                    <button onClick={() => { setWsOpen(false); setCreateOpen(true); }} className="text-rose-500 hover:text-rose-700 transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {workspaces.map((ws) => (
                    <button key={ws.workspace.id} onClick={() => { switchWorkspace(ws.workspace.id); setWsOpen(false); }}
                      className={[
                        "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                        ws.workspace.id === workspace?.id ? "bg-rose-50 text-rose-700" : "text-gray-700 hover:bg-gray-50",
                      ].join(" ")}>
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
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            Manage
          </button>
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 className="h-3.5 w-3.5" />Share
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal isOpen={createOpen} onClose={() => setCreateOpen(false)} token={tokens?.accessToken ?? ""} onCreated={() => { refreshWorkspaces(); setCreateOpen(false); }} />
    </header>
  );
}

function CreateWorkspaceModal({ isOpen, onClose, token, onCreated }: {
  isOpen: boolean; onClose: () => void; token: string; onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      await workspacesService.createWorkspace(token, { name, companyName: companyName || undefined });
      onCreated();
    } catch { setError("Failed to create workspace"); }
    setSaving(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200/80">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[15px] flex items-center gap-2 text-gray-900"><Plus className="h-4 w-4 text-rose-500" />New Workspace</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div className="space-y-2"><Label htmlFor="newWsName" className="text-[13px] text-gray-700">Workspace Name</Label><Input id="newWsName" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Team Workspace" required className="rounded-lg" /></div>
          <div className="space-y-2"><Label htmlFor="newCompany" className="text-[13px] text-gray-700">Company Name (optional)</Label><Input id="newCompany" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." className="rounded-lg" /></div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving || !name.trim()}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Create Workspace</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
