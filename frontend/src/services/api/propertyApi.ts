import { apiClient } from './client';
import type { Property } from '../../types';

export interface PropertyFilterParams {
  location?: string;
  property_type?: string;
  bhk?: number;
  min_budget?: number;
  max_budget?: number;
  min_area?: number;
  max_area?: number;
}

export interface AnalyzePropertyRequest {
  location: string;
  sqft: number;
  bhk: number;
  bathrooms?: number;
  asking_price_lakhs?: number;
  monthly_rent?: number;
}

export interface AnalyzePropertyResponse {
  location: string;
  sqft: number;
  bhk: number;
  bathrooms: number;
  asking_price_lakhs: number;
  fair_value_lakhs: number;
  fair_value_range_lower: number;
  fair_value_range_upper: number;
  price_per_sqft: number;
  monthly_rent: number;
  rent_per_sqft: number;
  annual_yield: number;
  deal_status: string;
  deal_diff_pct: number;
  investment_score: number;
  confidence_score: number;
  recommendation: string;
  risk_radar: Record<string, number>;
  waterfall_factors: Array<{ factor: string; contribution_lakhs: number }>;
  reasons: string[];
  risks: string[];
  forecast?: any;
}

export const propertyApi = {
  async getProperties(params: PropertyFilterParams = {}): Promise<Property[]> {
    const query = new URLSearchParams();
    if (params.location) query.append('location', params.location);
    if (params.property_type) query.append('property_type', params.property_type);
    if (params.bhk) query.append('bhk', params.bhk.toString());
    if (params.min_budget) query.append('min_budget', params.min_budget.toString());
    if (params.max_budget) query.append('max_budget', params.max_budget.toString());
    if (params.min_area) query.append('min_area', params.min_area.toString());
    if (params.max_area) query.append('max_area', params.max_area.toString());

    const qs = query.toString();
    return apiClient<Property[]>(`/api/properties${qs ? `?${qs}` : ''}`);
  },

  async getPropertyById(id: string): Promise<Property> {
    return apiClient<Property>(`/api/properties/${id}`);
  },

  async compareProperties(propertyIds: string[], criteria?: any): Promise<any> {
    return apiClient<any>('/api/properties/compare', {
      method: 'POST',
      body: JSON.stringify({
        property_ids: propertyIds,
        criteria,
      }),
    });
  },

  async analyzeProperty(payload: AnalyzePropertyRequest): Promise<any> {
    return apiClient<any>('/api/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
