import type { Property, MarketHotZone } from '../types';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

// Verified real geographic coordinates for Bengaluru key corridors & micro-markets
export const BENGALURU_CENTER: GeoCoordinate = {
  lat: 12.9716,
  lng: 77.5946,
};

export const MICRO_MARKET_COORDS: Record<string, GeoCoordinate> = {
  'whitefield': { lat: 12.9698, lng: 77.7499 },
  'indiranagar': { lat: 12.9784, lng: 77.6408 },
  'hsr layout': { lat: 12.9121, lng: 77.6446 },
  'electronic city': { lat: 12.8452, lng: 77.6602 },
  'koramangala': { lat: 12.9352, lng: 77.6245 },
  'bellandur': { lat: 12.9260, lng: 77.6762 },
  'marathahalli': { lat: 12.9591, lng: 77.7011 },
  'hebbal': { lat: 13.0358, lng: 77.5970 },
  'yelahanka': { lat: 13.1007, lng: 77.5963 },
  'sarjapur road': { lat: 12.9165, lng: 77.6833 },
  'jayanagar': { lat: 12.9308, lng: 77.5838 },
  'malleshwaram': { lat: 13.0031, lng: 77.5643 },
  'jp nagar': { lat: 12.9063, lng: 77.5857 },
  'bannerghatta road': { lat: 12.8876, lng: 77.5969 },
  'thanisandra': { lat: 13.0547, lng: 77.6329 },
  'kr puram': { lat: 13.0040, lng: 77.6968 },
  'banashankari': { lat: 12.9255, lng: 77.5468 },
  'btm layout': { lat: 12.9166, lng: 77.6101 },
  'domlur': { lat: 12.9609, lng: 77.6387 },
  'rajaji nagar': { lat: 12.9982, lng: 77.5530 },
};

/**
 * Deterministically resolve a property's verified geographic coordinate.
 * Slight deterministic offset per property ID prevents markers from overlapping in the same micro-market.
 */
export function getPropertyCoordinate(property: Property): GeoCoordinate {
  const locKey = (property.location || '').toLowerCase().trim();
  const baseCoord = MICRO_MARKET_COORDS[locKey] ||
    Object.entries(MICRO_MARKET_COORDS).find(([key]) => locKey.includes(key))?.[1] ||
    BENGALURU_CENTER;

  // Generate a small, deterministic dispersion (+/- 0.008 deg ~ 800m) based on property ID
  let hash = 0;
  for (let i = 0; i < property.id.length; i++) {
    hash = (hash << 5) - hash + property.id.charCodeAt(i);
    hash |= 0;
  }

  const offsetLat = ((Math.abs(hash) % 100) / 100 - 0.5) * 0.012;
  const offsetLng = ((Math.abs(hash >> 3) % 100) / 100 - 0.5) * 0.012;

  return {
    lat: baseCoord.lat + offsetLat,
    lng: baseCoord.lng + offsetLng,
  };
}

/**
 * Get geographic center coordinate for a hot zone.
 */
export function getHotZoneCoordinate(zone: MarketHotZone): GeoCoordinate {
  const nameKey = (zone.name || '').toLowerCase();
  for (const [key, coord] of Object.entries(MICRO_MARKET_COORDS)) {
    if (nameKey.includes(key)) {
      return coord;
    }
  }
  return BENGALURU_CENTER;
}
