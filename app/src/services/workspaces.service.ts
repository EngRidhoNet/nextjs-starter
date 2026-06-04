/**
 * Workspaces Service
 * Calls the Winsta AI backend API
 * Base: /api/v1/workspaces
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

export interface WorkspaceMember {
  id: string;
  role: {
    id: string;
    slug: string;
    name: string;
  };
  joinedAt: string;
}

export interface WorkspaceInfo {
  workspace: {
    id: string;
    name: string;
    companyName: string | null;
    createdAt: string;
    updatedAt: string;
  };
  membership: WorkspaceMember;
}

export interface CreateWorkspaceRequest {
  name: string;
  companyName?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  companyName?: string;
}

export const workspacesService = {
  /** GET /workspaces */
  async listWorkspaces(token: string): Promise<ApiResponse<WorkspaceInfo[]>> {
    setAuthToken(token);
    const res = await api.get<ApiResponse<WorkspaceInfo[]>>('/workspaces');
    return res.data;
  },

  /** POST /workspaces */
  async createWorkspace(token: string, data: CreateWorkspaceRequest): Promise<ApiResponse<WorkspaceInfo>> {
    setAuthToken(token);
    const res = await api.post<ApiResponse<WorkspaceInfo>>('/workspaces', data);
    return res.data;
  },

  /** GET /workspaces/current */
  async getCurrentWorkspace(token: string, workspaceId: string): Promise<ApiResponse<WorkspaceInfo>> {
    setAuthToken(token);
    const res = await api.get<ApiResponse<WorkspaceInfo>>('/workspaces/current', {
      headers: { 'x-workspace-id': workspaceId },
    });
    return res.data;
  },

  /** PATCH /workspaces/current */
  async updateCurrentWorkspace(
    token: string,
    workspaceId: string,
    data: UpdateWorkspaceRequest,
  ): Promise<ApiResponse<WorkspaceInfo>> {
    setAuthToken(token);
    const res = await api.patch<ApiResponse<WorkspaceInfo>>('/workspaces/current', data, {
      headers: { 'x-workspace-id': workspaceId },
    });
    return res.data;
  },
};
