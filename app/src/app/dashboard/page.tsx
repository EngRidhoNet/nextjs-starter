"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@context/AuthContext";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { ProfileModal } from "@components/dashboard/ProfileModal";
import { WorkspaceModal } from "@components/dashboard/WorkspaceModal";
import { CreateWorkspaceModal } from "@components/dashboard/CreateWorkspaceModal";
import { 
  Building2, Shield, Loader2, Pencil, Plus, 
  TrendingUp, Users, ArrowRight, Filter, ArrowUpDown,
  Search, MoreHorizontal, Download, CheckCircle2,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";

// Chart component
function BudgetChart() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueData = [4200, 5800, 7200, 6800, 9100, 8400, 11200, 13546, 10800, 9200, 8600, 7900];
  const expenseData = [3800, 4200, 5100, 5600, 6200, 5800, 7800, 8300, 7200, 6800, 6100, 5400];
  
  const maxVal = Math.max(...revenueData, ...expenseData);
  const chartW = 680;
  const chartH = 180;
  const padL = 0;
  const padR = 0;
  const padT = 10;
  const padB = 25;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  
  const toX = (i: number) => padL + (i / (months.length - 1)) * plotW;
  const toY = (v: number) => padT + plotH - (v / maxVal) * plotH;
  
  const revPath = revenueData.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");
  const expPath = expenseData.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");
  
  const revAreaPath = `${revPath} L${toX(months.length - 1)},${chartH - padB} L${toX(0)},${chartH - padB} Z`;
  const expAreaPath = `${expPath} L${toX(months.length - 1)},${chartH - padB} L${toX(0)},${chartH - padB} Z`;

  const [activeRange, setActiveRange] = useState("All");
  const ranges = ["D", "M", "Y", "All", "Custom"];

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">Consolidated budget</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-[2px] rounded-full bg-blue-500"></span>
              <span className="text-[11px] text-gray-500">Revenues</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-[2px] rounded-full bg-rose-400"></span>
              <span className="text-[11px] text-gray-500">Expenditures</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center ml-3 bg-gray-100 rounded-lg p-0.5">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={[
                  "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all",
                  activeRange === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                ].join(" ")}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 relative">
        <div className="absolute right-0 top-0 text-[11px] text-gray-400">↑ $0 - $20,000</div>
        <svg 
          viewBox={`0 0 ${chartW} ${chartH}`} 
          className="w-full h-[200px]"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
            <line
              key={pct}
              x1={padL}
              y1={padT + plotH * (1 - pct)}
              x2={chartW - padR}
              y2={padT + plotH * (1 - pct)}
              stroke="#f0f0ed"
              strokeWidth="1"
            />
          ))}

          {/* Revenue area fill */}
          <path d={revAreaPath} fill="url(#revGradient)" opacity="0.15" />
          {/* Expense area fill */}
          <path d={expAreaPath} fill="url(#expGradient)" opacity="0.08" />
          
          {/* Revenue line */}
          <path d={revPath} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Expense line */}
          <path d={expPath} fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />

          {/* Interactive hover zones */}
          {months.map((_, i) => (
            <rect
              key={i}
              x={toX(i) - plotW / months.length / 2}
              y={padT}
              width={plotW / months.length}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHoveredIdx(i)}
            />
          ))}

          {/* Hover indicator */}
          {hoveredIdx !== null && (
            <>
              <line
                x1={toX(hoveredIdx)}
                y1={padT}
                x2={toX(hoveredIdx)}
                y2={chartH - padB}
                stroke="#E5E5E2"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle cx={toX(hoveredIdx)} cy={toY(revenueData[hoveredIdx])} r="4" fill="#3B82F6" stroke="white" strokeWidth="2" />
              <circle cx={toX(hoveredIdx)} cy={toY(expenseData[hoveredIdx])} r="4" fill="#F87171" stroke="white" strokeWidth="2" />
            </>
          )}

          {/* Month labels */}
          {months.map((m, i) => (
            <text
              key={m}
              x={toX(i)}
              y={chartH - 5}
              textAnchor="middle"
              className="text-[9px] fill-gray-400"
            >
              {m}
            </text>
          ))}

          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#F87171" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tooltip */}
        {hoveredIdx !== null && (
          <div 
            className="absolute bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 pointer-events-none animate-fadeIn z-10"
            style={{ 
              left: `${Math.min(Math.max((hoveredIdx / (months.length - 1)) * 100, 10), 80)}%`,
              top: "20px",
              transform: "translateX(-50%)"
            }}
          >
            <p className="text-[11px] font-semibold text-gray-900 mb-1">{months[hoveredIdx]}</p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-[2px] bg-blue-500 rounded-full"></span>
                <span className="text-[11px] text-gray-600">${revenueData[hoveredIdx].toLocaleString()}</span>
                <span className="text-[10px] text-emerald-500 font-medium">
                  +{((revenueData[hoveredIdx] - expenseData[hoveredIdx]) / expenseData[hoveredIdx] * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-[2px] bg-rose-400 rounded-full"></span>
                <span className="text-[11px] text-gray-600">${expenseData[hoveredIdx].toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Score card component
function ScoreCard({ label, score, maxScore, color }: { label: string; score: number; maxScore: number; color: string }) {
  const colorMap: Record<string, { dot: string; text: string }> = {
    blue: { dot: "bg-blue-500", text: "text-blue-600" },
    emerald: { dot: "bg-emerald-500", text: "text-emerald-600" },
    amber: { dot: "bg-amber-500", text: "text-amber-600" },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200/80">
      <div className={`h-2 w-2 rounded-full ${c.dot}`}></div>
      <div>
        <p className="text-[10px] text-gray-500 font-medium leading-none mb-0.5">{label}</p>
        <p className="text-sm font-bold text-gray-900">
          {score} <span className="text-gray-400 font-normal text-[11px]">/ {maxScore}</span>
        </p>
      </div>
    </div>
  );
}

// Sample deals data
const DEALS = [
  { id: "01", name: "Summer Campaign", contact: "Tyra Dhillon", email: "tyra@winsta.ai", value: 3912, source: "Social Networks", sourceColor: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "02", name: "Q4 Partnership", contact: "Brittni Lando", email: "brittni@winsta.ai", value: 2345, source: "Outreach", sourceColor: "bg-gray-50 text-gray-600 border-gray-200" },
  { id: "03", name: "Brand Awareness", contact: "Kevin Chen", email: "kevin@winsta.ai", value: 13864, source: "Referrals", sourceColor: "bg-rose-50 text-rose-700 border-rose-200" },
  { id: "04", name: "Product Launch", contact: "Josh Ryan", email: "josh@winsta.ai", value: 6314, source: "Word-of-mouth", sourceColor: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "05", name: "Holiday Special", contact: "Chieko Chute", email: "chieko@winsta.ai", value: 5982, source: "Outreach", sourceColor: "bg-gray-50 text-gray-600 border-gray-200" },
];

export default function DashboardPage() {
  const { user, workspace, workspaces: rawWs, loading, switchWorkspace } = useAuth();
  const workspaces = rawWs ?? [];
  const [showProfile, setShowProfile] = useState(false);
  const [showWsEdit, setShowWsEdit] = useState(false);
  const [showCreateWs, setShowCreateWs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDeals = useMemo(() => {
    if (!searchTerm) return DEALS;
    const term = searchTerm.toLowerCase();
    return DEALS.filter(d => 
      d.name.toLowerCase().includes(term) || 
      d.contact.toLowerCase().includes(term) ||
      d.email.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-rose-500 mx-auto" />
        <p className="text-gray-500 text-sm">Loading your workspace...</p>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white w-full max-w-sm text-center p-8 shadow-sm border border-gray-200/80 rounded-xl">
        <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <Shield className="h-6 w-6 text-rose-500" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Session Expired</h3>
        <p className="text-sm text-gray-500 mb-6">Please sign in again to continue.</p>
        <Button onClick={() => (window.location.href = "/login")} className="w-full">Go to Login</Button>
      </div>
    </div>
  );

  const initials = (user.fullName ?? "").split(" ").map((n) => n.charAt(0).toUpperCase()).join("").slice(0, 2) || "U";

  return (
    <main className="p-6 lg:p-8 space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200/80">
            <Building2 className="h-7 w-7 text-gray-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{workspace?.name || "My Workspace"}</h1>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <CheckCircle2 className="h-3 w-3" />
                Active
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-500">
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-[8px] font-bold">{initials}</AvatarFallback>
                </Avatar>
                {user.fullName}
              </span>
              <span className="text-[12px] text-gray-400">
                {workspace?.companyName || "Personal Workspace"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ScoreCard label="Teams" score={workspaces.length} maxScore={10} color="blue" />
          <ScoreCard label="Status" score={workspace?.role === "owner" ? 10 : 7} maxScore={10} color="emerald" />
          <ScoreCard label="Activity" score={7.8} maxScore={10} color="amber" />
        </div>
      </div>

      {/* Consolidated Budget Chart */}
      <BudgetChart />

      {/* Deals Table */}
      <div className="bg-white rounded-xl border border-gray-200/80">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              All deals
              <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort
            </button>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 pr-3 text-[13px] bg-transparent border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all w-36"
              />
            </div>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors shadow-sm"
              onClick={() => setShowCreateWs(true)}>
              <Plus className="h-3.5 w-3.5" />
              Add New
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-10 px-6 py-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500/20" />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Deals</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="border-b border-gray-50 table-row-hover group cursor-pointer">
                  <td className="px-6 py-3.5">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500/20" />
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{deal.id}</td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{deal.name}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-200 text-orange-700 text-[10px] font-bold">
                          {deal.contact.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-900 font-medium">{deal.contact}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{deal.email}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">${deal.value.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex px-2.5 py-1 text-[11px] font-medium rounded-full border ${deal.sourceColor}`}>
                      {deal.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workspace Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-gray-900">Your Workspaces</h2>
          <button
            onClick={() => setShowCreateWs(true)}
            className="text-[13px] text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => {
            const isActive = ws.workspace.id === workspace?.id;
            return (
              <div 
                key={ws.workspace.id}
                onClick={() => switchWorkspace(ws.workspace.id)}
                className={[
                  "group cursor-pointer bg-white rounded-xl border transition-all duration-200 p-5",
                  isActive 
                    ? "border-rose-200 bg-rose-50/30 shadow-sm" 
                    : "border-gray-200/80 hover:border-gray-300 hover:shadow-sm"
                ].join(" ")}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Building2 className="h-5 w-5 text-gray-500" />
                  </div>
                  {isActive && (
                    <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">Active</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm truncate">{ws.workspace.name}</h3>
                <p className="text-[13px] text-gray-500 mt-1">{ws.workspace.companyName ?? "Personal Workspace"}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-[11px] text-gray-400 capitalize">{ws.membership.role.slug}</span>
                  <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    {isActive ? "Current" : "Switch"} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* Add Workspace Card */}
          <div 
            onClick={() => setShowCreateWs(true)}
            className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 hover:border-rose-300 bg-transparent transition-all duration-200 p-5 flex flex-col items-center justify-center min-h-[180px] text-center group"
          >
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-rose-50 transition-colors">
              <Plus className="h-5 w-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
            </div>
            <h3 className="font-medium text-gray-600 text-sm">Create Workspace</h3>
            <p className="text-[11px] text-gray-400 mt-1">Add a new workspace</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <WorkspaceModal isOpen={showWsEdit} onClose={() => setShowWsEdit(false)} />
      <CreateWorkspaceModal isOpen={showCreateWs} onClose={() => setShowCreateWs(false)} />
    </main>
  );
}
