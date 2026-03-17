import { performance } from 'perf_hooks';

const vehicles = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  tankCapacity: i % 2 === 0 ? 50 : undefined,
  avgDailyKm: i % 2 === 0 ? 20 : undefined,
}));

function before() {
  const hasReminders = vehicles.filter(v => v.tankCapacity && v.avgDailyKm).length > 0;
  if (hasReminders) {
    const list = vehicles.filter(v => v.tankCapacity && v.avgDailyKm).map(v => v.id);
  }
}

function after() {
  const vehiclesWithReminders = vehicles.filter(v => v.tankCapacity && v.avgDailyKm);
  const hasReminders = vehiclesWithReminders.length > 0;
  if (hasReminders) {
    const list = vehiclesWithReminders.map(v => v.id);
  }
}

const N = 1000;

const startBefore = performance.now();
for (let i = 0; i < N; i++) {
  before();
}
const endBefore = performance.now();

const startAfter = performance.now();
for (let i = 0; i < N; i++) {
  after();
}
const endAfter = performance.now();

console.log(`Before: ${endBefore - startBefore} ms`);
console.log(`After: ${endAfter - startAfter} ms`);
console.log(`Improvement: ${((endBefore - startBefore) - (endAfter - startAfter)) / (endBefore - startBefore) * 100}%`);
