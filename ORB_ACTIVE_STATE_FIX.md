# Orb Active State Fix - Computing Active Orbs Correctly

## Issue
The `computeActiveOrbIds` function was returning all `null` values even though the API was successfully syncing journey progress with active orbs (L1S1, L2S1, L3S1). This caused the journey visualization to not properly highlight active orbs based on database state.

## Root Cause

### Problem 1: Timing Issue with `useCallback`
The `computeActiveOrbIds` was defined as a `useCallback` but was being called directly in the render:

```typescript
const computeActiveOrbIds = useCallback(() => {
  // ... computation logic
}, [allJourneyProgress, stepContext, selectedHelper]);

// Called during render, BEFORE allJourneyProgress is loaded
const activeOrbIds = computeActiveOrbIds();
```

When the component first renders, `allJourneyProgress` has its initial state (all helpers with `progress: null`). Even though `useCallback` has the dependencies, calling it directly during render means it executes with the initial empty state.

### Problem 2: Not Reactive to Data Changes
Even after `loadAllJourneyProgress()` completes and updates `allJourneyProgress`, the `activeOrbIds` variable wasn't recalculated because:
1. It was computed once during initial render
2. The `useCallback` doesn't automatically trigger a re-render when dependencies change
3. Only the memoized function updates, not the result of calling it

## Solution

### Changed from `useCallback` + Direct Call to `useMemo`

**Before:**
```typescript
// Define a memoized function
const computeActiveOrbIds = useCallback(() => {
  const map: Record<HelperType, string | null> = { ... };
  // ... computation logic
  return map;
}, [allJourneyProgress, stepContext, selectedHelper]);

// Call it during render (uses stale initial state)
const activeOrbIds = computeActiveOrbIds();
```

**After:**
```typescript
// Compute the value with useMemo - automatically recomputes when dependencies change
const activeOrbIds = useMemo(() => {
  const map: Record<HelperType, string | null> = { ... };
  
  (Object.keys(allJourneyProgress) as HelperType[]).forEach((helper) => {
    const progressData = allJourneyProgress[helper];
    const currentLevelId = progressData?.progress?.current_level_id;
    map[helper] = currentLevelId ?? null;
  });
  
  // Override with stepContext for selected helper if present
  if (stepContext?.orbId) {
    map[selectedHelper] = stepContext.orbId;
  }
  
  return map;
}, [allJourneyProgress, stepContext, selectedHelper]);
```

### Key Differences

1. **`useMemo`** computes and caches the **value** (the map object)
2. **`useCallback`** computes and caches the **function** itself
3. With `useMemo`, the value **automatically updates** when dependencies change
4. With `useCallback` + direct call, you get the result from whenever you call it

## Enhanced Logging

Added detailed logging to track the computation:

```typescript
console.log("[Dashboard] 🔍 Computing activeOrbIds (useMemo)");
console.log("[Dashboard] 📊 allJourneyProgress keys:", Object.keys(allJourneyProgress));

(Object.keys(allJourneyProgress) as HelperType[]).forEach((helper) => {
  const progressData = allJourneyProgress[helper];
  const currentLevelId = progressData?.progress?.current_level_id;
  
  console.log(`[Dashboard] 🔍 ${helper}:`, {
    hasProgress: !!progressData?.progress,
    currentLevelId,
    fullProgress: progressData?.progress
  });
  
  map[helper] = currentLevelId ?? null;
});

console.log("[Dashboard] ✅ Final activeOrbIds map:", map);
```

## Expected Behavior After Fix

### On Initial Load
```
[Dashboard] 🔍 Computing activeOrbIds (useMemo)
[Dashboard] 📊 allJourneyProgress keys: [ 'muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei' ]
[Dashboard] 🔍 muse: { hasProgress: false, currentLevelId: undefined, fullProgress: null }
...
[Dashboard] ✅ Final activeOrbIds map: { muse: null, architect: null, ... }
```

### After Data Loads
```
[Dashboard] ✅ All journey progress loaded and cached
[Dashboard] 📋 Active helpers with tasks: [
  { helper: 'muse', orbId: 'L1S1', tasksCount: 3, isActive: true },
  { helper: 'architect', orbId: 'L2S1', tasksCount: 4, isActive: true },
  { helper: 'crafter', orbId: 'L3S1', tasksCount: 2, isActive: true }
]
[Dashboard] 🔍 Computing activeOrbIds (useMemo)  <-- Recomputes automatically!
[Dashboard] 🔍 muse: { hasProgress: true, currentLevelId: 'L1S1', fullProgress: {...} }
[Dashboard] 🔍 architect: { hasProgress: true, currentLevelId: 'L2S1', fullProgress: {...} }
[Dashboard] 🔍 crafter: { hasProgress: true, currentLevelId: 'L3S1', fullProgress: {...} }
[Dashboard] ✅ Final activeOrbIds map: { 
  muse: 'L1S1', 
  architect: 'L2S1', 
  crafter: 'L3S1',
  hacker: null,
  hypebeast: null,
  sensei: null
}
```

### When Clicking "Let's go" on an Orb
```
[Dashboard] ⭐ Overriding architect with stepContext orbId: L2S1
```

## Testing

1. Refresh the app and check browser console
2. You should see `Computing activeOrbIds (useMemo)` twice:
   - Once on initial render (with all null)
   - Once after journey progress loads (with actual orb IDs)
3. The journey visualization should highlight the correct orbs
4. When you switch between helpers, their active orbs should persist
5. The Tasks button should appear for helpers with active tasks

## Files Changed

- `components/dashboard/dashboard-layout.tsx`:
  - Converted `computeActiveOrbIds` from `useCallback` to `useMemo` pattern
  - Removed direct function call, now using memoized value
  - Updated `ensureStepContextFromProgress` to remove circular dependency
  - Enhanced logging to show full progress data structure

