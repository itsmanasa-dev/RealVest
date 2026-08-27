import type { Property, AssetCategory } from '../types';
import { mockProperties } from '../data/mockProperties';

export interface PropertyFilter {
  query?: string;
  category?: string;
  locality?: string;
  minPriceLakhs?: number;
  maxPriceLakhs?: number;
  bhk?: number;
  minYield?: number;
}

export const propertyService = {
  /**
   * Returns all properties or filtered properties
   */
  async getProperties(filter?: PropertyFilter): Promise<Property[]> {
    // Simulated async API call ready for real backend
    await new Promise((res) => setTimeout(res, 30));

    if (!filter) return [...mockProperties];

    return mockProperties.filter((p) => {
      if (filter.query) {
        const q = filter.query.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (filter.category && filter.category !== 'All Assets' && filter.category !== 'all') {
        if (p.category.toLowerCase() !== filter.category.toLowerCase()) return false;
      }

      if (filter.locality && filter.locality !== 'all') {
        if (!p.location.toLowerCase().includes(filter.locality.toLowerCase())) return false;
      }

      if (filter.minPriceLakhs !== undefined && p.askingPriceLakhs < filter.minPriceLakhs) {
        return false;
      }

      if (filter.maxPriceLakhs !== undefined && p.askingPriceLakhs > filter.maxPriceLakhs) {
        return false;
      }

      if (filter.bhk !== undefined && filter.bhk > 0 && p.bhk !== filter.bhk) {
        return false;
      }

      if (filter.minYield !== undefined && p.annualYield < filter.minYield) {
        return false;
      }

      return true;
    });
  },

  /**
   * Get single property by ID or code
   */
  async getPropertyById(id: string): Promise<Property | undefined> {
    await new Promise((res) => setTimeout(res, 20));
    return mockProperties.find((p) => p.id === id || p.code.toLowerCase() === id.toLowerCase());
  },

  /**
   * Get featured properties for Dashboard
   */
  async getFeaturedProperties(limit: number = 3): Promise<Property[]> {
    await new Promise((res) => setTimeout(res, 20));
    return mockProperties.slice(0, limit);
  },

  /**
   * Get top pick property from a list of properties
   */
  getTopPick(properties: Property[]): Property | undefined {
    if (properties.length === 0) return undefined;
    return [...properties].sort((a, b) => b.investmentScore - a.investmentScore)[0];
  }
};
