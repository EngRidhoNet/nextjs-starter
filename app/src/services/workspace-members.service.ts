/**
 * Workspace Members Service
 * Calls the Winsta AI backend API
 * Base: /api/v1/workspace-members
 */

import axios from 'axios';
import { getApiBaseUrl } from '@lib/config';
import type { ApiResponse } from '@models/api.model';

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export interface MemberInfo {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string | null;
    avatarUrl: string | null;
  };
  role: {
    id: string;
    slug: string;
    name: string;
  };
  invitedBy: string | null;
  joinedAt: string;
}

export const workspaceMembersService = {
  /** GET /workspace-members */
  async listMembers(token: string, workspaceId: string): Promise<ApiResponse<MemberInfo[]>> {
    setAuthToken(token);
    const res = await api.get<ApiResponse<MemberInfo[]>>('/workspace-members', {
      headers: { 'x-workspace-id': workspaceId },
    });
    return res.data;
  },

  /** POST /workspace-members/invite */
  async inviteMember(
    token: string,
    workspaceId: string,
    data: { email: string; fullName?: string; roleSlug: string },
  ): Promise<ApiResponse<MemberInfo>> {
    setAuthToken(token);
    const res = await api.post<ApiResponse<MemberInfo>>(
      '/workspace-members/invite',
      data,
      { headers: { 'x-workspace-id': workspaceId } },
    );
    return res.data;
  },

  /** PATCH /workspace-members/:id/role */
  async assignRole(
    token: string,
    workspaceId: string,
    memberId: string,
    roleSlug: string,
  ): Promise<ApiResponse<MemberInfo>> {
    setAuthToken(token);
    const res = await api.patch<ApiResponse<MemberInfo>>(
      `/workspace-members/${memberId}/role`,
      { roleSlug },
      { headers: { 'x-workspace-id': workspaceId } },
    );
    return res.data;
  },

  /** DELETE /workspace-members/:id */
  async removeMember(
    token: string,
    workspaceId: string,
    memberId: string,
  ): Promise<ApiResponse<{ removed: boolean }>> {
    setAuthToken(token);
    const res = await api.delete<ApiResponse<{ removed: boolean }>>(
      `/workspace-members/${memberId}`,
      { headers: { 'x-workspace-id': workspaceId } },
    );
    return res.data;
  },
};
