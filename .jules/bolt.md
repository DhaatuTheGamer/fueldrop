## 2024-03-17 - Unnecessary computations in Home component
**Learning:** Derived state like filtered notifications or sorted arrays in React components can cause unnecessary recalculations on every re-render, especially when using complex hooks like `useAppContext` that trigger renders frequently.
**Action:** Use `useMemo` for derived state calculations like sorting arrays or filtering lists to prevent re-computation when unrelated state changes.
