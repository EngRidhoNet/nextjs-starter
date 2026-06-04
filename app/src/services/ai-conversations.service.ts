/**
 * AI Conversations Service
 * Calls the Winsta AI backend API
 * Base: /api/v1/ai/conversations
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

function setWorkspaceHeader(workspaceId: string) {
  api.defaults.headers.common['x-workspace-id'] = workspaceId;
}

export interface AiMessage {
  id: string;
  conversationId: string;
  senderType: 'user' | 'ai' | 'system';
  message: string;
  attachments?: unknown;
  metadata?: Record<string, unknown>;
  tokenUsage?: number;
  modelName?: string;
  responseTimeMs?: number;
  createdAt: string;
}

export interface AiConversation {
  id: string;
  workspaceId: string;
  userId: string;
  title?: string;
  contextSummary?: string;
  messages: AiMessage[];
  createdAt: string;
}

export const aiConversationsService = {
  /** POST /ai/conversations */
  async create(token: string, workspaceId: string, data: { title?: string }): Promise<ApiResponse<AiConversation>> {
    setAuthToken(token);
    setWorkspaceHeader(workspaceId);
    const res = await api.post<ApiResponse<AiConversation>>('/ai/conversations', data);
    return res.data;
  },

  /** GET /ai/conversations */
  async list(token: string, workspaceId: string): Promise<ApiResponse<AiConversation[]>> {
    setAuthToken(token);
    setWorkspaceHeader(workspaceId);
    const res = await api.get<ApiResponse<AiConversation[]>>('/ai/conversations');
    return res.data;
  },

  /** GET /ai/conversations/:id */
  async get(token: string, workspaceId: string, conversationId: string): Promise<ApiResponse<AiConversation>> {
    setAuthToken(token);
    setWorkspaceHeader(workspaceId);
    const res = await api.get<ApiResponse<AiConversation>>(`/ai/conversations/${conversationId}`);
    return res.data;
  },

  /** POST /ai/conversations/:id/messages */
  async sendMessage(
    token: string,
    workspaceId: string,
    conversationId: string,
    message: string,
  ): Promise<ApiResponse<{ userMessage: AiMessage; assistantMessage: AiMessage }>> {
    setAuthToken(token);
    setWorkspaceHeader(workspaceId);
    const res = await api.post<ApiResponse<{ userMessage: AiMessage; assistantMessage: AiMessage }>>(
      `/ai/conversations/${conversationId}/messages`,
      { message },
    );
    return res.data;
  },
};
