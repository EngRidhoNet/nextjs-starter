"use client";

import { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { usersService } from "@services/users.service";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Loader2, X, Save } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, tokens } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    let accessToken = tokens?.accessToken;
    if (!accessToken && typeof window !== "undefined") {
      try { const s = JSON.parse(localStorage.getItem("winsta_auth") ?? "{}"); accessToken = s?.tokens?.accessToken; } catch { /* */ }
    }
    if (!accessToken) { setMsg("❌ Session expired"); return; }

    setSaving(true); setMsg("");
    try {
      await usersService.updateProfile(accessToken, { fullName });
      setMsg("✅ Updated");
      setTimeout(onClose, 800);
    } catch {
      setMsg("❌ Failed");
    }
    setSaving(false);
  };

  // Reset when opened
  const handleOpen = () => { setFullName(user?.fullName ?? ""); setMsg(""); };

  if (!isOpen) return null;

  // Call handleOpen on mount-style effect via the parent, but since we can't,
  // we sync when isOpen becomes true
  if (isOpen && fullName !== (user?.fullName ?? "") && !msg) {
    setFullName(user?.fullName ?? "");
  }

  const initials = fullName?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200/80">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[15px] text-gray-900">Edit Profile</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-center">
            <Avatar className="h-20 w-20 ring-2 ring-gray-100">
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileName" className="text-[13px] text-gray-700">Full Name</Label>
            <Input id="profileName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" className="rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label className="text-[13px] text-gray-700">Email</Label>
            <Input value={user?.email ?? ""} disabled className="bg-gray-50 rounded-lg" />
          </div>
          {msg && <p className={`text-sm ${msg.startsWith("✅") ? "text-emerald-600" : "text-rose-600"}`}>{msg}</p>}
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !fullName.trim()}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save
          </Button>
        </div>
      </div>
    </div>
  );
}
