/**
 * Authentication Service
 * Calls the Winsta AI backend API (NestJS)
 * Base: /api/v1/auth
 */

import axios from 'axios';
import { getApiBaseUrl } from '@lib/config';
import type { ApiResponse } from '@models/api.model';
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  AuthResponse,
  MeResponse,
  RefreshResponse,
  LogoutResponse,
} from '@models/auth.model';

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

/** Attach Bearer token to requests */
function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export const authService = {
  /** POST /auth/register */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data;
  },

  /** POST /auth/login */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data;
  },

  /** POST /auth/refresh */
  async refresh(data: RefreshTokenRequest): Promise<ApiResponse<RefreshResponse>> {
    const res = await api.post<ApiResponse<RefreshResponse>>('/auth/refresh', data);
    return res.data;
  },

  /** POST /auth/logout (requires auth) */
  async logout(token: string): Promise<ApiResponse<LogoutResponse>> {
    setAuthToken(token);
    const res = await api.post<ApiResponse<LogoutResponse>>('/auth/logout');
    return res.data;
  },

  /** GET /auth/me (requires auth) */
  async me(token: string): Promise<ApiResponse<MeResponse>> {
    setAuthToken(token);
    const res = await api.get<ApiResponse<MeResponse>>('/auth/me');
    return res.data;
  },

  /** Set the auth token for subsequent requests */
  setToken: setAuthToken,
};
