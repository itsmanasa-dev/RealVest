import type { MarketData, MarketHotZone } from '../types';
import { marketData, mockHotZones } from '../data/mockProperties';

export const marketService = {
  /**
   * Get macro market data and historical HPI time series
   */
  async getMarketOverview(): Promise<MarketData> {
    await new Promise((res) => setTimeout(res, 30));
    return marketData;
  },

  /**
   * Get Bengaluru micro-market hot zones
   */
  async getHotZones(): Promise<MarketHotZone[]> {
    await new Promise((res) => setTimeout(res, 20));
    return mockHotZones;
  },

  /**
   * Get single hot zone by ID
   */
  async getHotZoneById(id: string): Promise<MarketHotZone | undefined> {
    await new Promise((res) => setTimeout(res, 20));
    return mockHotZones.find((z) => z.id === id);
  }
};
