"use client";

import { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { usersService } from "@services/users.service";
import { workspacesService } from "@services/workspaces.service";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Settings, User, Building2, Loader2, Save, Key, BellRing } from "lucide-react";

export default function SettingsPage() {
  const { user, workspace, tokens, refreshWorkspaces } = useAuth();
  const token = tokens?.accessToken ?? "";
  const wsId = workspace?.id ?? "";

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [wsName, setWsName] = useState(workspace?.name ?? "");
  const [companyName, setCompanyName] = useState(workspace?.companyName ?? "");
  const [wsSaving, setWsSaving] = useState(false);
  const [wsMsg, setWsMsg] = useState("");

  const initials = user?.fullName?.split(" ").map(n => n.charAt(0).toUpperCase()).join("").slice(0,2) ?? "U";

  return (
    <main className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
            <Settings className="h-4 w-4 text-white" />
          </div>
          Settings
        </h1>
        <p className="text-gray-500 mt-1 text-sm ml-[42px]">Manage your profile and workspace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <User className="h-4 w-4 text-rose-500" />
            <h3 className="text-[14px] font-semibold text-gray-900">Profile</h3>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-gray-100">
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">{user?.fullName}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className={`inline-flex mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${user?.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                  {user?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] text-gray-700">Full Name</Label>
              <Input value={fullName} onChange={e=>setFullName(e.target.value)} className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] text-gray-700">Email</Label>
              <Input value={user?.email??""} disabled className="bg-gray-50 rounded-lg" />
            </div>
            {profileMsg && <p className={`text-sm ${profileMsg.includes("✅")?"text-emerald-600":"text-rose-600"}`}>{profileMsg}</p>}
            <Button onClick={async()=>{setProfileSaving(true);setProfileMsg("");try{await usersService.updateProfile(token,{fullName});setProfileMsg("✅ Profile updated")}catch{setProfileMsg("❌ Failed")}setProfileSaving(false)}} disabled={profileSaving||!fullName.trim()} className="w-full gap-2">{profileSaving?<Loader2 className="h-4 w-4 animate-spin"/>:<Save className="h-4 w-4"/>}Save Profile</Button>
          </div>
        </div>

        {/* Workspace Card */}
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-rose-500" />
            <h3 className="text-[14px] font-semibold text-gray-900">Workspace</h3>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <Building2 className="h-7 w-7 text-emerald-600"/>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{workspace?.name}</p>
                <p className="text-sm text-gray-500">{workspace?.companyName??"No company"}</p>
                <span className="inline-flex mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full border bg-purple-50 text-purple-700 border-purple-200 capitalize">{workspace?.role}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] text-gray-700">Workspace Name</Label>
              <Input value={wsName} onChange={e=>setWsName(e.target.value)} className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] text-gray-700">Company Name</Label>
              <Input value={companyName} onChange={e=>setCompanyName(e.target.value)} placeholder="Optional" className="rounded-lg" />
            </div>
            {wsMsg && <p className={`text-sm ${wsMsg.includes("✅")?"text-emerald-600":"text-rose-600"}`}>{wsMsg}</p>}
            <Button onClick={async()=>{if(!wsId)return;setWsSaving(true);setWsMsg("");try{await workspacesService.updateCurrentWorkspace(token,wsId,{name:wsName,companyName:companyName||undefined});await refreshWorkspaces();setWsMsg("✅ Workspace updated")}catch{setWsMsg("❌ Failed")}setWsSaving(false)}} disabled={wsSaving||!wsName.trim()} className="w-full gap-2">{wsSaving?<Loader2 className="h-4 w-4 animate-spin"/>:<Save className="h-4 w-4"/>}Save Workspace</Button>
          </div>
        </div>
      </div>

      {/* Coming soon cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden opacity-60">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Key className="h-4 w-4 text-gray-400" />
            <h3 className="text-[14px] font-semibold text-gray-900">Security</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500">Password & 2FA coming soon.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden opacity-60">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <BellRing className="h-4 w-4 text-gray-400" />
            <h3 className="text-[14px] font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500">Email preferences coming soon.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
