/**
 * Users Service
 * Calls the Winsta AI backend API
 * Base: /api/v1/users
 */

import axios from 'axios';
import { getApiBaseUrl } from '@lib/config';
import type { ApiResponse } from '@models/api.model';
import type { AuthUser } from '@models/auth.model';

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string;
}

export const usersService = {
  /** GET /users/profile */
  async getProfile(token: string): Promise<ApiResponse<AuthUser>> {
    setAuthToken(token);
    const res = await api.get<ApiResponse<AuthUser>>('/users/profile');
    return res.data;
  },

  /** PATCH /users/profile */
  async updateProfile(token: string, data: UpdateProfileRequest): Promise<ApiResponse<AuthUser>> {
    setAuthToken(token);
    const res = await api.patch<ApiResponse<AuthUser>>('/users/profile', data);
    return res.data;
  },

  /** DELETE /users/profile (deactivate) */
  async deactivateProfile(token: string): Promise<ApiResponse<{ deleted: boolean }>> {
    setAuthToken(token);
    const res = await api.delete<ApiResponse<{ deleted: boolean }>>('/users/profile');
    return res.data;
  },
};
