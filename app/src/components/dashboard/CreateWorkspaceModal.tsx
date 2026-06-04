"use client";

import { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { workspacesService } from "@services/workspaces.service";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Plus, Building2, Loader2, X, AlertTriangle } from "lucide-react";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const { user, tokens, refreshWorkspaces, switchWorkspace } = useAuth();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setCompanyName("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Get token - try context first, then localStorage fallback
    let accessToken = tokens?.accessToken;
    if (!accessToken && typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("winsta_auth") ?? "{}");
        accessToken = stored?.tokens?.accessToken;
      } catch { /* ignore */ }
    }

    if (!accessToken) {
      setError("Session expired. Please sign in again.");
      return;
    }

    if (!user?.id) {
      setError("User not found. Please sign in again.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await workspacesService.createWorkspace(accessToken, {
        name: name.trim(),
        companyName: companyName.trim() || undefined,
      });
      if (res.success) {
        await refreshWorkspaces();
        switchWorkspace(res.data.workspace.id);
        resetForm();
        onClose();
      } else {
        setError("Failed to create workspace. Please try again.");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosErr?.response?.status === 401) {
        setError("Session expired. Please sign out and sign in again.");
      } else if (axiosErr?.response?.data?.message) {
        setError(axiosErr.response.data.message);
      } else {
        setError(err instanceof Error ? err.message : "Failed to create workspace");
      }
    }
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-600" />Create Workspace
          </h3>
          <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newWsName">Workspace Name *</Label>
            <Input
              id="newWsName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Workspace"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newWsCompany">Company Name</Label>
            <Input
              id="newWsCompany"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Optional"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Workspace
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
