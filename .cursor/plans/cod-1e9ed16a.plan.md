<!-- 1e9ed16a-d8e9-4647-be6b-3b983f05c9a4 d7e68348-5862-4edd-b2d8-aab559481433 -->
# Codyssey MVP (Web + Supabase)

## Overview

Build a fast MVP as a Next.js web app with Supabase auth/db [[memory:4370321]]. Include: gamified 5-level journey, Helper AI chats (Muse→Sensei), and a simple project hub that stores external links (Cursor/Lovable/Bolt/GitHub). Exclude complex third‑party API integrations.

## Scope

- In: Auth, level system with XP gating, Helper chats (OpenAI), project hub (saved URLs), basic analytics (events table), unit/E2E tests, deploy.
- Out (for now): Leaderboards, billing/monetization, deep integrations to tools, team/multi-user projects, complex settings.

## Architecture

- Framework: Next.js (App Router) + React, TypeScript, Tailwind.
- Auth/DB: Supabase (RLS-on by default, Postgres). OAuth (GitHub) and magic link optional.
- LLM: OpenAI server-side (streaming), swappable provider interface later.
- Runtime: Vercel hosting, Supabase project. Edge runtime for chat streaming route.
- State: Server components + minimal client state (Zustand or React state).

## Data Model (tables)

- users (from Supabase auth)
- profiles: id (uuid, pk, fk->auth.users), display_name, xp_total, current_level
- projects: id, owner_id, name, description, external_links (jsonb: {cursor, lovable, bolt, github, demo})
- journeys: id, user_id, project_id, current_level, xp, status ('active'|'completed')
- levels: id (1..5), key, title, xp_required, unlocks (jsonb: helpers)
- tasks: id, level_id, slug, title, description, required (bool), xp_reward
- task_progress: id, user_id, project_id, task_id, status ('todo'|'done'), completed_at
- helper_chats: id, project_id, user_id, helper ('muse'|'architect'|'crafter'|'hacker'|'hypebeast'|'sensei'), title
- chat_messages: id, chat_id, role ('system'|'user'|'assistant'), content, created_at
- events (analytics): id, user_id, project_id, name, data (jsonb)

RLS policies: owners can read/write own profiles/projects/journeys/chats/messages/progress; public read of levels/tasks.

## Level Progression

- Levels 1..5 with thresholds. Completing all required tasks in a level awards level-up and unlocks Helpers.
- XP: add on task completion; gate unlocking by required tasks OR xp_required (whichever is stricter).
- Unlocked Helpers by level:
- L1 Spark: muse
- L2 Build Prep: architect
- L3 Core Build: hacker, crafter
- L4 Launch: hypebeast
- L5 Grow: sensei

## Helper Personas (system prompts)

- muse: ideation; style: playful strategist; output 3 concise, validated concepts.
- architect: stack planning; constraints-first; outputs milestones/tasks scoped to MVP.
- crafter: UI/brand; outputs UI tweaks, color tokens, copy.
- hacker: unblocker; outputs focused fixes, diffs, commands.
- hypebeast: launch content; outputs tweet threads, ship posts, visuals ideas.
- sensei: growth; outputs first 100 users plan, metrics, experiments.

## UX Flow

1) Onboarding

- Auth → pick vibe + interest → Muse chat generates 3 concepts → user picks one → create project & initialize journey to L1.

2) Dashboard (main view)

- **Left sidebar**: Helper avatars (circular icons), active helper highlighted, "+ New Chat" button, collapsible History (Today/Last 7 Days), settings at bottom
- **Center**: Main content area showing current chat or progress view (vertical level path with character mascot, colored orbs for levels, unlocked/locked states)
- **Right sidebar**: User profile card with avatar, stats (level, XP, tasks completed), current project quick links

3) Helpers (/helpers/[helper] or main view state)

- Chat interface embedded in center panel with Helper persona active in sidebar
- Messages rendered as cards/bubbles; bot responses can include action buttons
- History panel shows recent chat threads

4) Project Hub (/project/[id])

- Modal or dedicated view to edit project name/desc; manage external links (Cursor, Lovable, Bolt, GitHub, Demo)
- Shows task progress and current journey state

## Key Routes & Files

- app/(auth)/login, callback
- app/dashboard/page.tsx (server)
- app/helpers/[helper]/page.tsx (client chat UI)
- app/project/[id]/page.tsx
- app/api/chat/[helper]/route.ts (POST stream)
- lib/supabase/server.ts, lib/llm/provider.ts, lib/levels/progression.ts
- components/ui/ *(card, button, progress), components/chat/* (MessageList, Composer)
- db/sql/schema.sql, db/sql/policies.sql, db/seed/levels_tasks.sql

## Implementation Steps

1) Scaffold Next.js + Tailwind + Supabase client (server & browser helpers).
2) Auth: Sign in with GitHub + magic link fallback; profile row on signup.
3) DB schema + RLS policies + seeds (levels/tasks). Migrations via SQL files.
4) Progression service: computeLevelState(user_id, project_id), canCompleteTask, awardXp, levelUp.
5) Dashboard UI: current level, tasks list (mark done), unlocked helpers.
6) Project hub UI: CRUD project + store external links (jsonb), validation.
7) Helper chat API: route handler wraps OpenAI with persona prompts, streams responses, saves assistant/user messages.
8) Chat UI: streaming, retry, “create task from selection.”
9) Events logging: minimal client util to emit key events to events table.
10) Tests: unit (progression), route tests (chat), E2E (auth→onboard→muse→select→dashboard→complete task→level up).
11) Deployment: Vercel + Supabase. RLS verified. Edge runtime for chat.

## Env & Config

- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server-only, migrations/cron)
- OPENAI_API_KEY (server-only)
- NEXT_PUBLIC_APP_URL
Provide .env.example; never overwrite real .env.

## Testing Strategy

- Unit: lib/levels/progression.spec.ts (task gating, xp thresholds, idempotency).
- API: app/api/chat/[helper]/route.spec.ts (prompt guards, token limits, role checks).
- E2E: Playwright—auth, onboarding, project create, muse selection, task completion, helper unlock.

## Accessibility & Performance

- Keyboard-first chat input, ARIA roles, reduced motion option.
- Streamed responses; RUM not included.

## Cut/Deferral List (if time constrained)

- Skip magic link; ship only GitHub OAuth.
- Skip create-task-from-selection; add later.
- Skip events table; console-only metrics during dev.

## Post-MVP Next Steps

- Team projects, leaderboards, shareable journey cards, billing, deeper tool integrations.

### To-dos

- [ ] Scaffold Next.js app with Tailwind and Supabase client setup
- [ ] Implement Supabase auth (GitHub OAuth) and profile provisioning
- [ ] Create DB schema, RLS policies, and seed levels/tasks
- [ ] Implement level progression and XP awarding service
- [ ] Build dashboard with level progress and tasks UI
- [ ] Implement project hub with external link management
- [ ] Add Helper chat API with OpenAI and persona prompts
- [ ] Create chat UI with streaming and history
- [ ] Add minimal events logging utility and table
- [ ] Write unit, API, and Playwright E2E tests
- [ ] Deploy to Vercel and configure Supabase; verify RLS and envs