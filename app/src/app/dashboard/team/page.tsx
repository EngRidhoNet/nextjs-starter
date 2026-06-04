"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@context/AuthContext";
import { workspaceMembersService, type MemberInfo } from "@services/workspace-members.service";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Users, UserPlus, Loader2, X, ChevronDown, Mail, Shield, Trash2, Search, Filter, MoreHorizontal, Download } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  owner: "bg-purple-50 text-purple-700 border-purple-200",
  admin: "bg-blue-50 text-blue-700 border-blue-200",
  manager: "bg-emerald-50 text-emerald-700 border-emerald-200",
  staff: "bg-gray-50 text-gray-600 border-gray-200",
  ai_operator: "bg-amber-50 text-amber-700 border-amber-200",
};

const ROLES = ["admin", "manager", "staff", "ai_operator"] as const;

function InviteModal({ isOpen, onClose, token, workspaceId, onInvited }: {
  isOpen: boolean; onClose: () => void; token: string; workspaceId: string; onInvited: () => void;
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleSlug, setRoleSlug] = useState("staff");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      await workspaceMembersService.inviteMember(token, workspaceId, { email, fullName: fullName || undefined, roleSlug });
      onInvited(); onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to invite";
      setError(msg.includes("409") ? "User already a member" : msg.includes("404") ? "User not found" : "Failed to invite member");
    }
    setSaving(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200/80">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-[15px] flex items-center gap-2 text-gray-900">
            <UserPlus className="h-4 w-4 text-rose-500" />Invite Member
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleInvite} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invEmail" className="text-[13px] text-gray-700">Email</Label>
            <Input id="invEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="colleague@company.com" required className="rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invName" className="text-[13px] text-gray-700">Full Name (optional)</Label>
            <Input id="invName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Smith" className="rounded-lg" />
          </div>
          <div className="space-y-2">
            <Label className="text-[13px] text-gray-700">Role</Label>
            <div className="relative">
              <button type="button" onClick={() => setRoleOpen(!roleOpen)} className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                <span className="capitalize text-gray-700">{roleSlug.replace("_", " ")}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {roleOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  {ROLES.map((r) => (
                    <button key={r} type="button" onClick={() => { setRoleSlug(r); setRoleOpen(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 capitalize transition-colors ${r === roleSlug ? "bg-rose-50 text-rose-700 font-medium" : "text-gray-700"}`}>{r.replace("_", " ")}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving || !email}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Send Invite</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RoleDropdown({ currentRole, memberId, token, workspaceId, onUpdate }: {
  currentRole: string; memberId: string; token: string; workspaceId: string; onUpdate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newRole: string) => {
    setOpen(false);
    if (newRole === currentRole) return;
    setLoading(true);
    try { await workspaceMembersService.assignRole(token, workspaceId, memberId, newRole); onUpdate(); }
    catch { /* silently fail */ }
    finally { setLoading(false); }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} disabled={loading} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[12px] border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors">
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Shield className="h-3 w-3 text-gray-400" />}
        <span className="capitalize text-gray-600">{currentRole.replace("_", " ")}</span>
        <ChevronDown className="h-3 w-3 text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
            {ROLES.map((r) => (
              <button key={r} onClick={() => handleChange(r)} className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 capitalize transition-colors ${r === currentRole ? "bg-rose-50 text-rose-700 font-medium" : "text-gray-700"}`}>{r.replace("_", " ")}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function TeamPage() {
  const { workspace, tokens } = useAuth();
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = tokens?.accessToken ?? "";
  const workspaceId = workspace?.id ?? "";

  const loadMembers = useCallback(async () => {
    if (!token || !workspaceId) return;
    try {
      const res = await workspaceMembersService.listMembers(token, workspaceId);
      if (res.success) setMembers(res.data);
    } catch { /* silent */ }
    setLoading(false);
  }, [token, workspaceId]);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  const handleRemove = async (memberId: string) => {
    if (!window.confirm("Remove this member?")) return;
    setDeleting(memberId);
    try { await workspaceMembersService.removeMember(token, workspaceId, memberId); await loadMembers(); }
    catch { /* silent */ }
    setDeleting(null);
  };

  const filteredMembers = members.filter(m => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return m.user.fullName?.toLowerCase().includes(term) || m.user.email?.toLowerCase().includes(term);
  });

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-rose-500" /></div>;

  return (
    <main className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            Team
          </h1>
          <p className="text-gray-500 mt-1 text-sm ml-[42px]">Manage workspace members and roles.</p>
        </div>
        <Button onClick={() => setShowInvite(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />Invite Member
        </Button>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-gray-200/80">
        {/* Table Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">Members</span>
            <span className="text-[12px] text-gray-400">({members.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search members"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 pr-3 text-[13px] bg-transparent border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all w-40"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {members.length === 0 ? (
          <p className="text-gray-500 text-center py-12 text-sm">No members yet. Invite someone to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="w-10 px-6 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500/20" />
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="border-b border-gray-50 table-row-hover">
                    <td className="px-6 py-3.5">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500/20" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-200 text-orange-700 text-[10px] font-bold">
                            {m.user.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-900">{m.user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        <span className="truncate">{m.user.email ?? "No email"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 text-[11px] font-medium rounded-full border capitalize ${ROLE_COLORS[m.role.slug] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                        {m.role.slug.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {m.role.slug !== "owner" && workspace?.role === "owner" && (
                        <div className="flex items-center gap-1">
                          <RoleDropdown currentRole={m.role.slug} memberId={m.id} token={token} workspaceId={workspaceId} onUpdate={loadMembers} />
                          <button onClick={() => handleRemove(m.id)} disabled={deleting === m.id} className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 disabled:opacity-50 transition-colors">
                            {deleting === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InviteModal isOpen={showInvite} onClose={() => setShowInvite(false)} token={token} workspaceId={workspaceId} onInvited={loadMembers} />
    </main>
  );
}
