import { performance } from 'perf_hooks';

const orders = Array.from({ length: 1000 }, (_, i) => ({
  id: i.toString(),
  date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
}));

function before() {
  return [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 2);
}

function after() {
  return orders
    .map(order => ({ order, time: new Date(order.date).getTime() }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 2)
    .map(item => item.order);
}

function afterString() {
  return [...orders].sort((a, b) => b.date > a.date ? -1 : (b.date < a.date ? 1 : 0)).slice(0, 2);
}

const N = 1000;

console.log('Running benchmarks...');

const startBefore = performance.now();
for (let i = 0; i < N; i++) {
  before();
}
const endBefore = performance.now();
console.log(`Before: ${endBefore - startBefore} ms`);

const startAfter = performance.now();
for (let i = 0; i < N; i++) {
  after();
}
const endAfter = performance.now();
console.log(`After (Map-Sort-Map): ${endAfter - startAfter} ms`);
console.log(`Improvement: ${((endBefore - startBefore) - (endAfter - startAfter)) / (endBefore - startBefore) * 100}%`);

const startAfterString = performance.now();
for (let i = 0; i < N; i++) {
  afterString();
}
const endAfterString = performance.now();
console.log(`After (String Compare): ${endAfterString - startAfterString} ms`);
console.log(`Improvement (String Compare): ${((endBefore - startBefore) - (endAfterString - startAfterString)) / (endBefore - startBefore) * 100}%`);
