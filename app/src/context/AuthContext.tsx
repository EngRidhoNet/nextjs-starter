"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@services/auth.service";
import { workspacesService, type WorkspaceInfo } from "@services/workspaces.service";
import type { AuthUser, AuthTokens, AuthWorkspace } from "@models/auth.model";

// --- Types ---

interface AuthState {
  user: AuthUser | null;
  workspace: AuthWorkspace | null;
  workspaces: WorkspaceInfo[];
  tokens: AuthTokens | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  refreshWorkspaces: () => Promise<void>;
}

const STORAGE_KEY = "winsta_auth";
const WORKSPACE_KEY = "winsta_active_workspace";

// --- Context ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    workspace: null,
    workspaces: [],
    tokens: null,
    loading: true,
  });

  // Persist to localStorage
  const persist = useCallback((user: AuthUser | null, workspace: AuthWorkspace | null, tokens: AuthTokens | null) => {
    if (typeof window !== "undefined") {
      if (user && tokens) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, workspace, tokens }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(WORKSPACE_KEY);
      }
    }
  }, []);

  const persistActiveWorkspace = useCallback((workspaceId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(WORKSPACE_KEY, workspaceId);
    }
  }, []);

  // Fetch workspaces from API
  const refreshWorkspaces = useCallback(async () => {
    if (!state.tokens?.accessToken) return;
    try {
      const res = await workspacesService.listWorkspaces(state.tokens.accessToken);
      if (res.success && res.data.length > 0) {
        setState((prev) => ({ ...prev, workspaces: res.data }));
      }
    } catch {
      // silent fail
    }
  }, [state.tokens?.accessToken]);

  // Switch active workspace
  const switchWorkspace = useCallback(async (workspaceId: string) => {
    const ws = state.workspaces.find((w) => w.workspace.id === workspaceId);
    if (!ws) return;
    const newWorkspace: AuthWorkspace = {
      id: ws.workspace.id,
      name: ws.workspace.name,
      companyName: ws.workspace.companyName,
      membershipId: ws.membership.id,
      role: ws.membership.role.slug,
    };
    setState((prev) => ({ ...prev, workspace: newWorkspace }));
    persistActiveWorkspace(workspaceId);
    if (state.user && state.tokens) {
      persist(state.user, newWorkspace, state.tokens);
    }
  }, [state.workspaces, state.user, state.tokens, persist, persistActiveWorkspace]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { user, workspace, tokens } = JSON.parse(stored);
          if (user && tokens) {
            setState({ user, workspace: workspace ?? null, workspaces: [], tokens, loading: true });
            authService.setToken(tokens.accessToken);
            // Fetch workspaces list
            workspacesService.listWorkspaces(tokens.accessToken).then((res) => {
              if (res.success) {
                // If we have a stored active workspace, use it; otherwise use first
                const activeId = localStorage.getItem(WORKSPACE_KEY);
                const activeWs = activeId
                  ? res.data.find((w) => w.workspace.id === activeId)
                  : res.data[0];
                const ws = activeWs ?? res.data[0];
                const currentWorkspace: AuthWorkspace = ws
                  ? {
                      id: ws.workspace.id,
                      name: ws.workspace.name,
                      companyName: ws.workspace.companyName,
                      membershipId: ws.membership.id,
                      role: ws.membership.role.slug,
                    }
                  : workspace;
                setState({
                  user,
                  workspace: currentWorkspace,
                  workspaces: res.data,
                  tokens,
                  loading: false,
                });
                if (ws) persistActiveWorkspace(ws.workspace.id);
              } else {
                setState({ user, workspace: workspace ?? null, workspaces: [], tokens, loading: false });
              }
            }).catch(() => {
              setState({ user, workspace: workspace ?? null, workspaces: [], tokens, loading: false });
            });
            return;
          }
        }
      }
    } catch {
      // corrupted storage, ignore
    }
    setState((s) => ({ ...s, loading: false }));
  }, [persistActiveWorkspace]);

  // --- Actions ---

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    const { user, workspace, tokens } = res.data;

    setState({ user, workspace, tokens, loading: false });
    persist(user, workspace, tokens);
    authService.setToken(tokens.accessToken);

    router.push("/dashboard");
  }, [router, persist]);

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    const res = await authService.register({ email, password, fullName });
    const { user, workspace, tokens } = res.data;

    setState({ user, workspace, tokens, loading: false });
    persist(user, workspace, tokens);
    authService.setToken(tokens.accessToken);

    router.push("/dashboard");
  }, [router, persist]);

  const logout = useCallback(async () => {
    try {
      if (state.tokens?.accessToken) {
        await authService.logout(state.tokens.accessToken);
      }
    } catch {
      // ignore logout errors
    }

    setState({ user: null, workspace: null, tokens: null, loading: false });
    persist(null, null, null);
    authService.setToken(null);
    router.push("/login");
  }, [state.tokens, router, persist]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, switchWorkspace, refreshWorkspaces }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Hook ---

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
