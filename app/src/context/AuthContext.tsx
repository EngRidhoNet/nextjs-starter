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
import type { AuthUser, AuthTokens, AuthWorkspace } from "@models/auth.model";

// --- Types ---

interface AuthState {
  user: AuthUser | null;
  workspace: AuthWorkspace | null;
  tokens: AuthTokens | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const STORAGE_KEY = "winsta_auth";

// --- Context ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    workspace: null,
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
      }
    }
  }, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { user, workspace, tokens } = JSON.parse(stored);
          if (user && tokens) {
            setState({ user, workspace: workspace ?? null, tokens, loading: false });
            authService.setToken(tokens.accessToken);
            return;
          }
        }
      }
    } catch {
      // corrupted storage, ignore
    }
    setState((s) => ({ ...s, loading: false }));
  }, []);

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
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
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
