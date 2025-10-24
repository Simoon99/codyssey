# 🎓 Codyssey Journey - Crystallized & Complete

## What We've Built

A comprehensive, **non-gated journey framework** that takes vibecoding users from 0 to 1 and beyond. The journey is structured into 5 levels × 3 steps (15 total steps), with 50+ carefully curated tasks, deep acceptance criteria, and helper system prompts to maximize user outcomes.

---

## Key Changes

### 1. **Removed XP Gating** ✅
- All levels have `xp_required = 0` in the database
- Users can freely roam through all levels
- Progression is **task-based, not XP-based**
- Level advancement happens when all required tasks are completed
- XP is still awarded and tracked for gamification and motivational currency

### 2. **Enhanced Seed Data with Optional Tasks** ✅
**55+ tasks added** across 5 levels:
- **Level 1 (Spark)**: 5 required + 7 optional = 12 tasks
- **Level 2 (Build Prep)**: 6 required + 8 optional = 14 tasks
- **Level 3 (Core Build)**: 7 required + 8 optional = 15 tasks
- **Level 4 (Launch)**: 6 required + 9 optional = 15 tasks
- **Level 5 (Grow)**: 6 required + 7 optional = 13 tasks

Each optional task is bonus XP and deeper outcome; optional tasks unlock next level's entry path.

### 3. **Helper System Prompts** ✅
Each of 6 helpers has a full system prompt defining:
- Role and specialty
- Communication style
- Output format
- Guiding questions to ask users
- Context and philosophy

Helpers: **Muse**, **Architect**, **Crafter**, **Hacker**, **Hypebeast**, **Sensei**

### 4. **Acceptance Criteria for Every Task** ✅
Clear checklists showing:
- What "done" means for each task
- Optional enhancements that create depth
- Measurable outcomes and artifacts
- Definition of done for each level

### 5. **First Message CTAs** ✅
Each of 15 steps has a first message CTA that auto-populates when a user enters the helper chat, setting context and creating momentum.

---

## The Complete Journey

### **Level 1: Spark 🌟** (Ideation & Validation)
**3 Steps, 3 Helpers, 12 Tasks**

| Step | Helper | Outcome | Required | Optional |
|------|--------|---------|----------|----------|
| Problem & Market | Muse | Problem statement + competitor insights | 2 | 2 |
| Hypotheses & Validation | Architect | 3 hypotheses + interview script + user feedback | 2 | 2 |
| MVP Scope | Crafter | 3–5 core features + success metrics | 1 | 2 |

**Definition of Done**: Validated MVP scope with user evidence.

---

### **Level 2: Build Prep 🏗️** (Architecture & Planning)
**3 Steps, 3 Helpers, 14 Tasks**

| Step | Helper | Outcome | Required | Optional |
|------|--------|---------|----------|----------|
| Stack & Architecture | Architect | Tech stack + architecture diagram + risk mitigation | 2 | 2 |
| Wireframes & Design | Crafter | Wireframes for 3+ flows + UI system | 1 | 2 |
| Repo & Milestones | Hacker | Git repo + schema + milestones + CI/CD | 3 | 3 |

**Definition of Done**: Repo, schema, and milestone plan set. Ready to code.

---

### **Level 3: Core Build 💻** (MVP Implementation)
**3 Steps, 2 Helpers, 15 Tasks**

| Step | Helper | Outcome | Required | Optional |
|------|--------|---------|----------|----------|
| Foundation | Hacker | Dev env + auth + first feature + monitoring | 3 | 2 |
| Features & UI | Crafter | 2 more features + cohesive UI + animations | 3 | 3 |
| Hardening & Tests | Hacker | Tests + error boundaries + performance audit | 0 | 4 |

**Definition of Done**: MVP core loop functional and demoable. Ready to launch.

---

### **Level 4: Launch 🚀** (Go Live & Marketing)
**3 Steps, 2 Helpers, 15 Tasks**

| Step | Helper | Outcome | Required | Optional |
|------|--------|---------|----------|----------|
| Deployment | Hacker | Production live + analytics + monitoring + support | 2 | 2 |
| Landing & Content | Hypebeast | Landing page + launch narrative + demo video | 2 | 2 |
| Launch & Feedback | Hypebeast | Public launch + 10+ users + feedback + press kit | 2 | 3 |

**Definition of Done**: Production live, launch executed, feedback collected.

---

### **Level 5: Grow 📈** (Retention & Acquisition)
**3 Steps, 2 Helpers, 13 Tasks**

| Step | Helper | Outcome | Required | Optional |
|------|--------|---------|----------|----------|
| Metrics & Growth | Hypebeast → Sensei | Funnel analysis + 3+ experiment hypotheses | 2 | 2 |
| Activation & Retention | Sensei | Onboarding optimized + retention features + habits | 2 | 3 |
| Scale & Referrals | Sensei → Muse | 100 users + referral system + monetization | 1 | 4 |

**Definition of Done**: Repeatable growth loop; 100 users achieved. You've gone 0→1→beyond!

---

## Files Created / Updated

### New Files
1. **`JOURNEY_FRAMEWORK.md`** — Complete framework with:
   - Helper system prompts for each persona
   - First-message CTAs for each step
   - Acceptance criteria for all tasks
   - XP scaling and gamification notes
   - UI usage guidelines

2. **`lib/journey-config.json`** — JSON configuration file:
   - Full journey structure (5 levels × 3 steps)
   - Helper metadata and unlock levels
   - CTAs and first messages
   - Task mapping to each step
   - XP scaling rules

3. **`JOURNEY_CRYSTALLIZED.md`** (this file) — Summary and usage guide

### Updated Files
1. **`db/seed.sql`**
   - Set all levels to `xp_required = 0` (no gating)
   - Added 55+ tasks with detailed descriptions
   - Organized by level and step
   - Marked required vs. optional

2. **`lib/levels/progression.ts`**
   - Removed XP gating from `checkAndApplyLevelUp()`
   - Now uses only required task completion for progression
   - Kept XP tracking and profile updates for gamification

---

## Implementation Guide

### For the Frontend (UI Integration)

#### 1. Load Journey Config
```typescript
import journeyConfig from "@/lib/journey-config.json";
const levels = journeyConfig.journey.levels;
```

#### 2. Display Level Steps with Orbs
Each level has 3 steps. For each step:
```typescript
const step = levels[levelIndex].steps[stepIndex];
// Use step.cta for button/card label
// Use step.firstMessage to populate helper chat on click
// Use step.tasks to load task list for this step
// Use step.requiredTasks to highlight required tasks
```

#### 3. Auto-Populate Helper First Message
When user clicks on a step or task:
```typescript
const message = step.firstMessage; // Pre-written, contextual
sendToHelper(helper, message);
```

#### 4. Display Acceptance Criteria
Show checklist from `JOURNEY_FRAMEWORK.md` for each task:
- As inline checklists on task detail view
- Help users know when they're truly done
- Optional: Allow users to self-check items

#### 5. Helper System Prompts
Include in `llm/provider.ts` when initializing helper chats:
```typescript
const systemPrompt = getHelperSystemPrompt(helper);
// Found in JOURNEY_FRAMEWORK.md
```

### For the Backend (Database & API)

#### 1. Seed New Tasks
```bash
# The updated seed.sql includes all 55+ tasks
# Run migrations to apply
npm run db:migrate
```

#### 2. Verify Level Gating Removal
- Check that `levels.xp_required = 0` for all levels
- Verify `progression.ts` removed XP gate logic
- Test: user should access Level 2 without completing Level 1

#### 3. Test Progression Logic
- Complete all required tasks in Level 1
- Verify automatic level-up to Level 2
- Verify XP still accumulates (for gamification)

---

## Usage Examples

### User Journey: First Time
1. **Onboarding**: Muse generates 3 concepts → user picks → project created → Level 1 starts
2. **Level 1, Step 1**: Click orb → see "Define your problem & market" CTA → Muse first message auto-populates
3. **Completing tasks**: User completes `define-problem`, `research-competition` → can optionally do `identify-target-audience`, `market-size-analysis` for bonus XP
4. **All required tasks done**: Level 1 complete → auto-unlock Level 2

### Vibecoder Power User (Skipping Ahead)
- User can jump to Level 3 if they want to start coding
- Tasks are there waiting; helpers ready to guide
- No artificial gatekeeping; choice is theirs

### Re-engagement (Optional Tasks)
- User completes MVP but skipped "accessibility"
- In Level 3 Step 2, they see optional `implement-accessibility`
- Tempted by XP bonus? They do it, get 20 XP + better product
- This is how we drive depth without forcing

---

## Key Principles

✅ **Free Roaming**: No XP gates lock levels  
✅ **Task-Based**: Progression is about completing work, not grinding XP  
✅ **Vibecoder-First**: Helpers solve real problems (ideation, validation, unblocking)  
✅ **Optional Depth**: Bonus tasks let users go deeper if they want  
✅ **Clear Artifacts**: Each step produces a deliverable (doc, diagram, wireframes, code, URL)  
✅ **First Message Magic**: CTAs that set context and create momentum  
✅ **Acceptance Criteria**: Users always know what "done" means  

---

## Metrics to Track

With this framework, track:
- Tasks completed per user (required vs. optional)
- Level progression speed (days to reach Level 3, Level 5, etc.)
- Helper engagement (which helpers are most used?)
- Optional task completion rates (which bonuses drive engagement?)
- Churn rate by level (where do users drop off?)
- Time-to-value by level (how long to first shipped feature?)

---

## Next Steps

1. **Run migrations** to seed new tasks and remove XP gates
2. **Update UI** to use `journey-config.json` for orb rendering
3. **Update helper init** to use system prompts from `JOURNEY_FRAMEWORK.md`
4. **Test progression logic** to ensure task-based leveling works
5. **Add acceptance criteria** to task detail view
6. **Monitor** first 5–10 users through the journey
7. **Iterate** on CTAs and system prompts based on user feedback

---

## Questions?

Refer to:
- **`JOURNEY_FRAMEWORK.md`** for complete helper prompts and acceptance criteria
- **`lib/journey-config.json`** for UI integration
- **`db/seed.sql`** for task definitions
- **`lib/levels/progression.ts`** for backend logic
