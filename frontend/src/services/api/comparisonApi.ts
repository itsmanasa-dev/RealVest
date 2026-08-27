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

const STORAGE_KEY = 'realvest_saved_comparisons_cache';

function getLocalComparisons(): SavedComparisonDetail[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalComparisons(items: SavedComparisonDetail[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }
}

export const comparisonApi = {
  async searchMatchingProperties(req: RequirementSearchPayload): Promise<Property[]> {
    return apiClient<Property[]>('/api/comparisons/search', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },

  async saveComparison(payload: SaveComparisonPayload): Promise<SavedComparisonDetail> {
    const tempId = `cmp-${Date.now().toString(36)}`;
    const localRecord: SavedComparisonDetail = {
      id: tempId,
      title: payload.title || `Comparison: ${payload.criteria?.locality || 'Bengaluru'}`,
      created_at: new Date().toISOString(),
      criteria: payload.criteria,
      selected_property_ids: payload.selected_property_ids,
      comparison_results: payload.comparison_results,
      top_pick: payload.top_pick,
      recommendation: payload.recommendation,
      reasoning: payload.reasoning,
    };

    try {
      const serverSaved = await apiClient<SavedComparisonDetail>('/api/comparisons', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Update local storage with server response
      const existing = getLocalComparisons().filter((c) => c.id !== serverSaved.id);
      saveLocalComparisons([serverSaved, ...existing]);
      return serverSaved;
    } catch (err) {
      console.warn('Backend save failed, cached to persistent storage:', err);
      const existing = getLocalComparisons();
      saveLocalComparisons([localRecord, ...existing]);
      return localRecord;
    }
  },

  async listSavedComparisons(): Promise<SavedComparisonSummary[]> {
    try {
      const serverList = await apiClient<SavedComparisonSummary[]>('/api/comparisons');
      if (serverList && serverList.length > 0) {
        return serverList;
      }
    } catch (err) {
      console.warn('Backend list failed, reading from persistent local cache:', err);
    }

    // Fallback to local cache
    const local = getLocalComparisons();
    return local.map((c) => {
      const criteria = c.criteria || {};
      const minB = criteria.min_budget || 0;
      const maxB = criteria.max_budget || 0;
      const budgetStr = maxB ? `₹${minB}L – ₹${maxB}L` : 'Open Budget';
      return {
        id: c.id,
        title: c.title,
        created_at: c.created_at,
        location: criteria.locality || 'Bengaluru',
        budget_range: budgetStr,
        goal: criteria.goal || 'Balanced',
        properties_count: (c.selected_property_ids || []).length,
        top_pick: c.top_pick,
        recommendation: c.recommendation,
      };
    });
  },

  async getSavedComparison(id: string): Promise<SavedComparisonDetail> {
    try {
      return await apiClient<SavedComparisonDetail>(`/api/comparisons/${id}`);
    } catch (err) {
      console.warn(`Backend fetch failed for comparison ${id}, checking cache:`, err);
      const found = getLocalComparisons().find((c) => c.id === id);
      if (found) {
        return found;
      }
      throw err;
    }
  },

  async deleteSavedComparison(id: string): Promise<{ status: string; message: string }> {
    // Delete from local cache
    const filtered = getLocalComparisons().filter((c) => c.id !== id);
    saveLocalComparisons(filtered);

    try {
      return await apiClient<{ status: string; message: string }>(`/api/comparisons/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn(`Backend delete failed for ${id}:`, err);
      return { status: 'success', message: 'Deleted from storage' };
    }
  },
};
