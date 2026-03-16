import { performance } from 'perf_hooks';

interface Vehicle {
  id: string;
  make: string;
  model: string;
}

interface Item {
  id: string;
  vehicleId: string;
}

const numVehicles = 1000;
const numItems = 5000;

const vehicles: Vehicle[] = Array.from({ length: numVehicles }, (_, i) => ({
  id: `v-${i}`,
  make: 'Make',
  model: 'Model'
}));

const items: Item[] = Array.from({ length: numItems }, (_, i) => ({
  id: `i-${i}`,
  vehicleId: `v-${Math.floor(Math.random() * numVehicles)}`
}));

// Baseline
const startBaseline = performance.now();
for (const item of items) {
  const vehicle = vehicles.find(v => v.id === item.vehicleId);
}
const endBaseline = performance.now();

// Optimized
const startOptimized = performance.now();
const vehicleMap = vehicles.reduce((acc, v) => {
  acc[v.id] = v;
  return acc;
}, {} as Record<string, Vehicle>);
for (const item of items) {
  const vehicle = vehicleMap[item.vehicleId];
}
const endOptimized = performance.now();

console.log(`Baseline: ${endBaseline - startBaseline}ms`);
console.log(`Optimized: ${endOptimized - startOptimized}ms`);
