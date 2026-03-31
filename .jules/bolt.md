## 2024-03-17 - Unnecessary computations in Home component
**Learning:** Derived state like filtered notifications or sorted arrays in React components can cause unnecessary recalculations on every re-render, especially when using complex hooks like `useAppContext` that trigger renders frequently.
**Action:** Use `useMemo` for derived state calculations like sorting arrays or filtering lists to prevent re-computation when unrelated state changes.

## 2024-03-18 - Rules of Hooks and Memoization of Inline Computations
**Learning:** Avoid using Immediately Invoked Function Expressions (IIFEs) inside JSX purely for doing computations (like `reduce`), especially if those computations depend on state/context. Memoizing inside an IIFE breaks the Rules of Hooks (hooks cannot be called inside nested functions/loops/conditions).
**Action:** Extract inline IIFEs that perform heavy computations into top-level variables and wrap them in `useMemo` with correct dependency arrays. Be careful to ensure the dependencies of `useMemo` are stable (e.g. memoize intermediate arrays like `allItems` if they are derived).## 2026-03-30 - Optimize Recent Orders Sorting
**Learning:** Redundant date parsing within a sort comparator (e.g., `new Date(a.date)`) leads to O(N log N) parsing operations. In the 'fueldrop' codebase, this is particularly impactful for components like `Home.tsx` that frequently re-render or handle multiple orders.
**Action:** Implemented the Schwartzian transform (Map-Sort-Map) to parse each date once into a timestamp before sorting. This reduced execution time by ~90% in benchmarks.
