"use client";

import { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { workspacesService } from "@services/workspaces.service";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Building2, Loader2, X, Save } from "lucide-react";

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceModal({ isOpen, onClose }: WorkspaceModalProps) {
  const { workspace, tokens, refreshWorkspaces } = useAuth();
  const [name, setName] = useState(workspace?.name ?? "");
  const [companyName, setCompanyName] = useState(workspace?.companyName ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    let accessToken = tokens?.accessToken;
    if (!accessToken && typeof window !== "undefined") {
      try { const s = JSON.parse(localStorage.getItem("winsta_auth") ?? "{}"); accessToken = s?.tokens?.accessToken; } catch { /* */ }
    }
    if (!workspace || !accessToken) { setMsg("❌ Session expired"); return; }

    setSaving(true); setMsg("");
    try {
      await workspacesService.updateCurrentWorkspace(accessToken, workspace.id, {
        name,
        companyName: companyName || undefined,
      });
      await refreshWorkspaces();
      setMsg("✅ Updated");
      setTimeout(onClose, 800);
    } catch {
      setMsg("❌ Failed");
    }
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-lg flex items-center gap-2"><Building2 className="h-5 w-5 text-indigo-600" />Edit Workspace</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wsName">Workspace Name</Label>
            <Input id="wsName" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wsCompany">Company Name</Label>
            <Input id="wsCompany" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Optional" />
          </div>
          {msg && <p className={`text-sm ${msg.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save
          </Button>
        </div>
      </div>
    </div>
  );
}
