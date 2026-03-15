import { useMemo } from 'react';
import { Location } from '../types';

interface DynamicPricing {
  deliveryFee: number;
  estimatedMinutes: number;
  surgeFactor: number;
  surgeActive: boolean;
}

export function useDynamicPricing(
  location: Location | null,
  quantity: number,
  fuelType: 'Petrol' | 'Diesel'
): DynamicPricing {
  return useMemo(() => {
    const hour = new Date().getHours();

    // Surge during peak hours: 8-10 AM, 5-8 PM
    const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
    const surgeFactor = isPeak ? 1.3 : 1.0;

    // Base delivery fee depends on simulated distance
    let baseFee = 29;
    if (location && location.lat !== 0) {
      // Simulate distance-based fee using lat/lng offset from a "hub"
      const hubLat = 12.9716; // Bangalore center
      const hubLng = 77.5946;
      const distKm = Math.sqrt(
        Math.pow((location.lat - hubLat) * 111, 2) +
        Math.pow((location.lng - hubLng) * 85, 2)
      );
      baseFee = Math.min(99, Math.max(29, Math.round(29 + distKm * 7)));
    }

    const deliveryFee = Math.round(baseFee * surgeFactor);

    // ETA: 8-25 min based on distance + quantity
    let baseMinutes = 8;
    if (location && location.lat !== 0) {
      const hubLat = 12.9716;
      const hubLng = 77.5946;
      const distKm = Math.sqrt(
        Math.pow((location.lat - hubLat) * 111, 2) +
        Math.pow((location.lng - hubLng) * 85, 2)
      );
      baseMinutes = Math.min(25, Math.max(8, Math.round(8 + distKm * 2)));
    }
    // Large orders take slightly longer
    const quantityPenalty = quantity > 20 ? 3 : quantity > 10 ? 2 : 0;
    const estimatedMinutes = baseMinutes + quantityPenalty;

    return {
      deliveryFee,
      estimatedMinutes,
      surgeFactor,
      surgeActive: isPeak,
    };
  }, [location, quantity, fuelType]);
}
