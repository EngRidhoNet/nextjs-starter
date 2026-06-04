"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@context/AuthContext";
import { aiConversationsService, type AiMessage } from "@services/ai-conversations.service";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Bot, User, Send, Loader2, Plus, MessageSquare, Trash2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  senderType: string;
  message: string;
  createdAt: string;
  tokenUsage?: number;
}

interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
}

export default function AiChatPage() {
  const { user, workspace, tokens } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const token = tokens?.accessToken ?? "";
  const wsId = workspace?.id ?? "";

  const loadConversations = useCallback(async () => {
    if (!token || !wsId) return;
    try {
      const res = await aiConversationsService.list(token, wsId);
      if (res.success) setConversations(res.data.map(c => ({
        id: c.id,
        title: c.title ?? "New Chat",
        messages: (c.messages ?? []).map(m => ({ ...m, senderType: m.senderType })),
      })));
    } catch { /* silent */ }
    setLoading(false);
  }, [token, wsId]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeId, conversations]);

  const activeConv = conversations.find(c => c.id === activeId);

  const handleNew = async () => {
    if (!token || !wsId) return;
    try {
      const res = await aiConversationsService.create(token, wsId, { title: "New Chat" });
      if (res.success) {
        const newConv = { id: res.data.id, title: "New Chat", messages: [] };
        setConversations(prev => [newConv, ...prev]);
        setActiveId(res.data.id);
      }
    } catch { /* silent */ }
  };

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || !activeId || !token || !wsId || sending) return;
    setInput("");
    setSending(true);

    // Optimistic user message
    const tempUser: Message = { id: Date.now().toString(), senderType: "user", message: msg, createdAt: new Date().toISOString() };
    setConversations(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, tempUser] } : c));

    try {
      const res = await aiConversationsService.sendMessage(token, wsId, activeId, msg);
      if (res.success) {
        setConversations(prev => prev.map(c => {
          if (c.id !== activeId) return c;
          // Replace temp user + add assistant
          const msgs = c.messages.filter(m => m.id !== tempUser.id);
          return {
            ...c,
            messages: [...msgs,
              { id: res.data.userMessage.id, senderType: "user", message: res.data.userMessage.message, createdAt: res.data.userMessage.createdAt },
              { id: res.data.assistantMessage.id, senderType: "ai", message: res.data.assistantMessage.message, createdAt: res.data.assistantMessage.createdAt, tokenUsage: res.data.assistantMessage.tokenUsage ?? undefined },
            ],
          };
        }));
      }
    } catch {
      setConversations(prev => prev.map(c => c.id === activeId ? { ...c, messages: c.messages.filter(m => m.id !== tempUser.id) } : c));
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!user) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-rose-500" /></div>;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      {/* Conversation sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} border-r border-gray-200/80 bg-white flex-shrink-0 transition-all overflow-hidden flex flex-col`}>
        <div className="p-3 border-b border-gray-100">
          <Button onClick={handleNew} className="w-full gap-2" size="sm">
            <Plus className="h-3.5 w-3.5" />New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
          ) : conversations.length === 0 ? (
            <p className="text-[11px] text-gray-400 text-center py-8">No conversations</p>
          ) : (
            conversations.map(c => (
              <button
                key={c.id}
                onClick={() => { setActiveId(c.id); setSidebarOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all flex items-center gap-2 ${c.id === activeId ? "bg-rose-50/80 text-rose-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{c.title ?? "Chat"}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toggle sidebar + title */}
        <div className="h-11 border-b border-gray-200/80 bg-white flex items-center px-4 gap-2 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
          <span className="font-medium text-[13px] text-gray-700 truncate">{activeConv?.title ?? "Sarah AI"}</span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F7F7F5]">
          {!activeId ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-rose-400" />
              </div>
              <p className="font-semibold text-[15px] text-gray-700">Sarah Mitchell</p>
              <p className="text-[13px] text-gray-400">Partnerships & Growth Manager</p>
              <Button onClick={handleNew} className="mt-3 gap-2"><Plus className="h-3.5 w-3.5" />Start a Conversation</Button>
            </div>
          ) : !activeConv?.messages.length ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center">
                <Bot className="h-6 w-6 text-rose-300" />
              </div>
              <p className="text-[13px]">Send a message to start chatting with Sarah.</p>
            </div>
          ) : (
            activeConv.messages.filter(m => m.senderType !== "system").map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}>
                {msg.senderType === "ai" && (
                  <Avatar className="h-7 w-7 flex-shrink-0 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-rose-100 to-amber-100 text-rose-600 text-[10px]">
                      <Bot className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.senderType === "user" ? "bg-gray-900 text-white rounded-br-md" : "bg-white border border-gray-200/80 text-gray-800 rounded-bl-md shadow-sm"}`}>
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                  {msg.tokenUsage && <p className="text-[10px] mt-1 opacity-40">{msg.tokenUsage} tokens</p>}
                </div>
                {msg.senderType === "user" && (
                  <Avatar className="h-7 w-7 flex-shrink-0 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-200 text-orange-700 text-[10px] font-bold">
                      {user.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        {activeId && (
          <div className="p-4 bg-white border-t border-gray-200/80 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Sarah..."
                disabled={sending}
                className="flex-1 rounded-lg"
              />
              <Button onClick={handleSend} disabled={sending || !input.trim()} size="icon" className="rounded-lg">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
