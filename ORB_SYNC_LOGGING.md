# Orb & Task Button Sync Logging

## Overview
Added comprehensive logging to track and debug the synchronization between:
- Active Orbs (visual state in Journey view)
- Active Levels (database journey_progress)
- Tasks Button visibility (chat interface)

## Key Logging Points

### 1. App Load - Journey Progress
When the app loads, you'll see detailed journey data for each helper:

```
[Dashboard] 📊 Loading journey progress for all helpers...
[Dashboard] 📥 Journey data for muse: {
  hasProgress: true,
  currentLevelId: 'L1S1',
  isActive: true,
  tasksCount: 4,
  stats: { ... }
}
[Dashboard] ✅ All journey progress loaded and cached
[Dashboard] 📋 Active helpers with tasks: [
  { helper: 'muse', orbId: 'L1S1', tasksCount: 4, isActive: true }
]
[Dashboard] 📊 Helpers that should show Tasks Button: ['muse']
```

### 2. Active Orb IDs Map
Every time orb states are computed, you'll see:

```
[Dashboard] computeActiveOrbIds {
  muse: 'L1S1',
  architect: 'L2S1',
  crafter: null,
  hacker: null,
  hypebeast: null,
  sensei: null
}
```

### 3. "Let's Go" Button Click
When clicking "Let's go" from an orb card:

```
[Dashboard] handleHelperSelect: received orb context {
  helperType: 'architect',
  context: { orbId: 'L2S1', tasks: [...], ... }
}
[Dashboard] 🚀 Initializing journey for architect orb L2S1
[Dashboard] ✅ Journey initialized: {
  helper: 'architect',
  orbId: 'L2S1',
  tasksCreated: 4
}
[Dashboard] handleHelperSelect: tasks button active {
  helper: 'architect',
  tasksCount: 4,
  showTasksInChat: true
}
```

### 4. Helper Switching
When switching between helpers:

**Direct helper selection (from sidebar):**
```
[Dashboard] handleHelperSelect: direct helper select architect
[Dashboard] ensureStepContextFromProgress: syncing helper architect to orb L2S1
[Dashboard] applyStepContextFromOrb: context set { orbId: 'L2S1', ... }
```

**New chat:**
```
[Dashboard] handleNewChat: tasks button hidden {
  helper: 'architect',
  showTasksInChat: false
}
```

### 5. Step Context Changes
Tracks when active orb context is set:

```
[Dashboard] stepContext changed: {
  orbId: 'L2S1',
  stepIndex: 0,
  levelIndex: 1,
  tasks: [...],
  requiredTasks: [...],
  firstMessage: '...',
  cta: '...'
}
```

## What Changed

### Journey Initialization on Orb Click
- When "Let's go" is clicked, the app now calls `/api/journey/initialize`
- This creates/updates `journey_progress` record in the database
- Creates task records for the orb
- Reloads all journey progress to sync active orb states

### Enhanced State Tracking
- Added `computeActiveOrbIds()` helper that logs the complete helper → orb mapping
- Shows which helpers have active tasks on app load
- Tracks task button visibility state changes

### Database Sync
- Journey progress is properly synced to database when orbs are activated
- Active orbs persist across page reloads
- Multiple helpers can have active orbs simultaneously

## Troubleshooting

### Orb not showing as active?
Check logs for:
1. `[Dashboard] 📥 Journey data for {helper}` - does it have `currentLevelId`?
2. `[Dashboard] computeActiveOrbIds` - is the helper → orb mapping correct?

### Tasks button not appearing?
Check logs for:
1. `[Dashboard] 📊 Helpers that should show Tasks Button` - is your helper listed?
2. `[Dashboard] handleHelperSelect: tasks button active` - did it fire when clicking the orb?

### Orb state lost after refresh?
Check:
1. `[Dashboard] 🚀 Initializing journey for {helper}` - did initialization succeed?
2. `[Dashboard] ✅ Journey initialized` - were tasks created?
3. Database `journey_progress` table - does it have a record for the helper?

## Testing Flow

1. **Fresh start**: Reload app → check which helpers have active orbs in logs
2. **Click orb**: Click "Let's go" → verify initialization logs
3. **Check sync**: Switch tabs → verify orb stays highlighted
4. **Switch helpers**: Select different helper → verify task button state
5. **Reload**: Refresh page → verify orb state persists


