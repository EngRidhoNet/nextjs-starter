"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@context/AuthContext";
import { adsService, type AdsSummary } from "@services/ads.service";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Loader2, TrendingUp, DollarSign, Eye, MousePointer, Target, BarChart3, Lightbulb, RefreshCw, Sparkles, ArrowUpRight, ArrowDownRight, PlusCircle, CheckCircle2 } from "lucide-react";

const F = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(1)}K` : String(n);
const $ = (n: number) => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n.toFixed(2)}`;

function getAuth() {
  if (typeof window === "undefined") return { t: "", w: "" };
  try {
    const a = JSON.parse(localStorage.getItem("winsta_auth") ?? "{}");
    return { t: a?.tokens?.accessToken ?? "", w: localStorage.getItem("winsta_active_workspace") ?? "" };
  } catch { return { t: "", w: "" }; }
}

export default function MarketingPage() {
  const ctx = useAuth();
  const [data, setData] = useState<AdsSummary | null>(null);
  const [busy, setBusy] = useState(true);
  const [ai, setAi] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [err, setErr] = useState("");
  const [connecting, setConnecting] = useState(false);

  const load = () => {
    const { t, w } = getAuth();
    const T = ctx.tokens?.accessToken || t;
    const W = ctx.workspace?.id || w;
    if (!T || !W) { setTimeout(() => load(), 300); return; }
    setBusy(true);
    adsService.getSummary(T, W).then(r => {
      if (r.success && r.data.campaigns.length > 0) setData(r.data);
    }).catch(() => {}).finally(() => setBusy(false));
  };

  useEffect(() => { load(); }, [ctx.tokens, ctx.workspace]);

  const connect = async () => {
    const { t, w } = getAuth();
    const T = ctx.tokens?.accessToken || t;
    const W = ctx.workspace?.id || w;
    if (!T || !W) { setErr("Session expired. Sign in again."); return; }
    setConnecting(true); setErr("");
    try {
      await adsService.seedMockData(T, W);
      const r = await adsService.getSummary(T, W);
      if (r.success) setData(r.data);
    } catch { setErr("Failed. Try again."); }
    setConnecting(false);
  };

  const genAI = async () => {
    const { t, w } = getAuth();
    const T = ctx.tokens?.accessToken || t;
    const W = ctx.workspace?.id || w;
    if (!T || !W) return;
    setAiBusy(true);
    try { const r = await adsService.getAiSuggestions(T, W); if (r.success) setAi(r.data.text ?? null); }
    catch { setAi("Failed."); }
    setAiBusy(false);
  };

  const has = data !== null && data.campaigns.length > 0;

  if (busy && !has) return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-rose-500" /></div>;

  return (
    <main className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            Marketing
          </h1>
          <p className="text-gray-500 mt-1 text-sm ml-[42px]">{has ? "Ad performance across Meta & TikTok." : "Connect platforms to get started."}</p>
        </div>
        {has && (
          <Button variant="outline" size="sm" onClick={load} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />Refresh
          </Button>
        )}
      </div>

      {err && <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm">{err}</div>}

      {!has && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={connect} disabled={connecting} className="text-left">
            <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:shadow-md transition-all h-full">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 border border-gray-100"><svg className="h-8 w-8" viewBox="0 0 24 24" fill="#1877F2"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/></svg></div>
                <h3 className="font-semibold text-[15px] text-gray-900 mb-2">Meta Ads</h3>
                <p className="text-sm text-gray-500 mb-4">Facebook & Instagram</p>
                <span className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                  {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                  {connecting ? "Connecting..." : "Connect Account"}
                </span>
              </div>
            </div>
          </button>
          <button onClick={connect} disabled={connecting} className="text-left">
            <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:shadow-md transition-all h-full">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4"><svg className="h-7 w-7" viewBox="0 0 24 24" fill="white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></div>
                <h3 className="font-semibold text-[15px] text-white mb-2">TikTok Ads</h3>
                <p className="text-sm text-gray-400 mb-4">TikTok For Business</p>
                <span className="inline-flex items-center gap-1.5 text-sm text-cyan-400 font-medium bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                  {connecting ? "Connecting..." : "Connect Account"}
                </span>
              </div>
            </div>
          </button>
        </div>
      )}

      {has && data && (
        <>
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl w-fit border border-emerald-100"><CheckCircle2 className="h-4 w-4" /> Meta & TikTok connected</div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Eye, label: "Impressions", value: F(data.totals.impressions), color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
              { icon: MousePointer, label: "Clicks", value: F(data.totals.clicks), color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50" },
              { icon: DollarSign, label: "Spend", value: $(data.totals.spend), color: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
              { icon: Target, label: "ROAS", value: `${data.totals.roas.toFixed(1)}x`, color: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200/80 p-5 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <stat.icon className={`h-4 w-4 bg-gradient-to-br ${stat.color} bg-clip-text`} style={{ color: stat.color.includes("blue") ? "#3B82F6" : stat.color.includes("emerald") ? "#10B981" : stat.color.includes("amber") ? "#F59E0B" : "#8B5CF6" }} />
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-[13px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 flex items-center justify-between border-b border-amber-100/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-amber-100">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[14px] text-gray-900">Sarah&apos;s Insights</h3>
                  <p className="text-[11px] text-gray-500">AI-powered analysis</p>
                </div>
              </div>
              <Button onClick={genAI} disabled={aiBusy} size="sm" variant="outline" className="gap-2 border-amber-200 hover:bg-amber-50">
                {aiBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lightbulb className="h-3.5 w-3.5" />}Generate
              </Button>
            </div>
            {ai && <div className="p-6"><p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{ai}</p></div>}
          </div>

          {/* Campaigns Table */}
          <div className="bg-white rounded-xl border border-gray-200/80">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <h3 className="text-[14px] font-semibold text-gray-900">Campaigns ({data.campaigns.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Impressions</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">CTR</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Spend</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.campaigns.map(c => {
                    const g = c.roas >= 1;
                    return (
                      <tr key={c.id} className="border-b border-gray-50 table-row-hover">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`h-2.5 w-2.5 rounded-full ${g ? "bg-emerald-500" : "bg-rose-400"}`} />
                            <span className="text-sm font-medium text-gray-900">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full border bg-gray-50 text-gray-600 border-gray-200 capitalize">{c.status ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-600">{F(c.impressions)}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-600">{F(c.clicks)}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-600">{c.ctr.toFixed(1)}%</td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 text-right">{$(c.spend)}</td>
                        <td className="px-4 py-3.5 text-right">
                          <span className={`text-sm font-medium flex items-center justify-end gap-0.5 ${g ? "text-emerald-600" : "text-rose-500"}`}>
                            {g ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {c.roas.toFixed(1)}x
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
