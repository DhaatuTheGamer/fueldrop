const { performance } = require('perf_hooks');

const M = 1000; // number of vehicles
const N = 5000; // number of items

const vehicles = Array.from({ length: M }, (_, i) => ({ id: `v${i}`, make: 'Make', model: 'Model' }));
const items = Array.from({ length: N }, (_, i) => ({ id: `i${i}`, vehicleId: `v${i % M}` }));

// Baseline O(N*M)
const start1 = performance.now();
let found1 = 0;
for (const item of items) {
  const vehicle = vehicles.find(v => v.id === item.vehicleId);
  if (vehicle) found1++;
}
const end1 = performance.now();
const time1 = end1 - start1;

// Optimized O(N+M)
const start2 = performance.now();
let found2 = 0;
const vehicleMap = vehicles.reduce((acc, v) => {
  acc.set(v.id, v);
  return acc;
}, new Map());
for (const item of items) {
  const vehicle = vehicleMap.get(item.vehicleId);
  if (vehicle) found2++;
}
const end2 = performance.now();
const time2 = end2 - start2;

console.log(`Baseline O(N*M) time: ${time1.toFixed(2)}ms`);
console.log(`Optimized O(N+M) time: ${time2.toFixed(2)}ms`);
console.log(`Improvement: ${(time1 / time2).toFixed(2)}x faster`);
