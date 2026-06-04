/**
 * Ads Analytics Service
 * Calls the Winsta AI backend API
 * Base: /api/v1/ads/analytics
 */

import axios from 'axios';
import { getApiBaseUrl } from '@lib/config';
import type { ApiResponse } from '@models/api.model';

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

function setAuth(token: string, wsId: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  api.defaults.headers.common['x-workspace-id'] = wsId;
}

export interface CampaignPerformance {
  id: string;
  name: string;
  status: string | null;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  roas: number;
}

export interface AdsSummary {
  workspaceId: string;
  from: string;
  to: string;
  totals: {
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
    ctr: number;
    roas: number;
  };
  campaigns: CampaignPerformance[];
  winningCampaigns: CampaignPerformance[];
  underperformingCampaigns: CampaignPerformance[];
}

export interface CampaignDetail {
  campaign: {
    id: string;
    campaignName: string;
    status: string | null;
    budget: number | null;
    startDate: string | null;
    endDate: string | null;
  };
  performance: CampaignPerformance;
  reports: Array<{
    id: string;
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    spend: number;
    roas: number;
    reportDate: string;
  }>;
}

export interface AiSuggestion {
  text: string;
  modelName?: string;
  tokenUsage?: number;
}

export const adsService = {
  /** GET /ads/analytics/summary */
  async getSummary(token: string, workspaceId: string, from?: string, to?: string): Promise<ApiResponse<AdsSummary>> {
    setAuth(token, workspaceId);
    const params = new URLSearchParams();
    if (from) params.set('fromDate', from);
    if (to) params.set('toDate', to);
    const res = await api.get<ApiResponse<AdsSummary>>('/ads/analytics/summary', { params });
    return res.data;
  },

  /** GET /ads/analytics/campaigns/:id */
  async getCampaignDetail(token: string, workspaceId: string, campaignId: string): Promise<ApiResponse<CampaignDetail>> {
    setAuth(token, workspaceId);
    const res = await api.get<ApiResponse<CampaignDetail>>(`/ads/analytics/campaigns/${campaignId}`);
    return res.data;
  },

  /** POST /ads/analytics/ai-suggestions */
  async getAiSuggestions(token: string, workspaceId: string, from?: string, to?: string): Promise<ApiResponse<AiSuggestion>> {
    setAuth(token, workspaceId);
    const res = await api.post<ApiResponse<AiSuggestion>>('/ads/analytics/ai-suggestions', { fromDate: from, toDate: to });
    return res.data;
  },

  /** POST /ads/analytics/seed — seed mock campaign data */
  async seedMockData(token: string, workspaceId: string): Promise<ApiResponse<{ campaigns: number; reports: number }>> {
    setAuth(token, workspaceId);
    const res = await api.post<ApiResponse<{ campaigns: number; reports: number }>>('/ads/analytics/seed');
    return res.data;
  },
};
