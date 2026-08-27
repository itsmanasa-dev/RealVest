import { apiClient } from './client';
import type { Property } from '../../types';

export interface RequirementSearchPayload {
  locality?: string;
  min_budget?: number;
  max_budget?: number;
  property_type?: string;
  bhk?: number;
  min_sqft?: number;
  max_sqft?: number;
  goal?: string;
  risk?: string;
  holding_period?: string;
}

export interface SaveComparisonPayload {
  title?: string;
  criteria: any;
  selected_property_ids: string[];
  comparison_results: any;
  top_pick: string;
  recommendation: string;
  reasoning: string[];
}

export interface SavedComparisonSummary {
  id: string;
  title: string;
  created_at: string;
  location: string;
  budget_range: string;
  goal: string;
  properties_count: number;
  top_pick: string;
  recommendation: string;
}

export interface SavedComparisonDetail {
  id: string;
  title: string;
  created_at: string;
  criteria: any;
  selected_property_ids: string[];
  comparison_results: any;
  top_pick: string;
  recommendation: string;
  reasoning: string[];
}

export const comparisonApi = {
  async searchMatchingProperties(req: RequirementSearchPayload): Promise<Property[]> {
    return apiClient<Property[]>('/api/comparisons/search', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },

  async saveComparison(payload: SaveComparisonPayload): Promise<SavedComparisonDetail> {
    return apiClient<SavedComparisonDetail>('/api/comparisons', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async listSavedComparisons(): Promise<SavedComparisonSummary[]> {
    return apiClient<SavedComparisonSummary[]>('/api/comparisons');
  },

  async getSavedComparison(id: string): Promise<SavedComparisonDetail> {
    return apiClient<SavedComparisonDetail>(`/api/comparisons/${id}`);
  },

  async deleteSavedComparison(id: string): Promise<{ status: string; message: string }> {
    return apiClient<{ status: string; message: string }>(`/api/comparisons/${id}`, {
      method: 'DELETE',
    });
  },
};
