import React from 'react';
import { motion } from 'motion/react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { FuelType } from '../types';

// Simulated 7-day price history
const PRICE_HISTORY: Record<FuelType, number[]> = {
  Petrol: [102.10, 101.95, 101.80, 101.90, 101.70, 101.60, 101.50],
  Diesel: [89.80, 89.65, 89.50, 89.40, 89.35, 89.25, 89.20],
};

function SparklineChart({ data, color = '#E56B25' }: { data: number[]; color?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 140;
  const height = 36;
  const padding = 4;

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkGrad)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      <circle cx={parseFloat(points[points.length - 1].split(',')[0])} cy={parseFloat(points[points.length - 1].split(',')[1])} r={3} fill={color} />
    </svg>
  );
}

interface PriceTrendIndicatorProps {
  fuelType: FuelType;
  fuelPrice: number;
}

export default function PriceTrendIndicator({ fuelType, fuelPrice }: PriceTrendIndicatorProps) {
  // Price trend calculation
  const history = PRICE_HISTORY[fuelType];
  const yesterdayPrice = history[history.length - 2];
  const todayPrice = history[history.length - 1];
  const priceDiff = todayPrice - yesterdayPrice;
  const isFalling = priceDiff < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-bg border-2 border-border rounded-sm transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs text-muted font-body uppercase tracking-wider">Today's Price</p>
          <p className="font-heading font-bold text-2xl text-text">
            ₹{fuelPrice}
            <span className="text-sm text-muted">/L</span>
          </p>
        </div>
        <SparklineChart data={history} color={isFalling ? '#2B825B' : '#E56B25'} />
      </div>
      <div className="flex items-center space-x-2">
        {isFalling ? (
          <TrendingDown size={14} className="text-accent" />
        ) : (
          <TrendingUp size={14} className="text-primary" />
        )}
        <span className={`text-xs font-heading font-bold ${isFalling ? 'text-accent' : 'text-primary'}`}>
          {isFalling ? '↓' : '↑'} ₹{Math.abs(priceDiff).toFixed(2)} since yesterday
        </span>
      </div>
      {isFalling && (
        <p className="text-[10px] text-accent font-body mt-2 bg-accent/10 px-2 py-1 rounded-sm inline-block border border-accent/20">
          Prices are falling — good time to top up!
        </p>
      )}
    </motion.div>
  );
}
