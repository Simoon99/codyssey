# Helper Context Management System

## Overview

The Helper Context Management System ensures that AI helpers have access to evolving project insights throughout the journey. Each helper's learnings, decisions, and artifacts are captured and made available to subsequent helpers, creating a cohesive experience where later helpers can build upon earlier work.

## Architecture

### Database Schema

**Table: `helper_context`**
- Stores structured insights per helper per project
- Unique constraint on `(user_id, project_id, helper)`
- Auto-updates `updated_at` timestamp

**Key Fields:**
- `key_insights`: Array of main takeaways (max 10 recent)
- `decisions_made`: Array of concrete choices (max 10 recent)
- `artifacts_created`: Array of deliverables produced (max 10 recent)
- `context_summary`: 1-2 sentence summary of helper's work
- Helper-specific JSONB fields:
  - `muse_validation`: Problem, users, MVP scope
  - `architect_blueprint`: Tech stack, architecture
  - `crafter_design`: Design system, components
  - `hacker_prompts`: Build prompts, tooling
  - `hypebeast_launch`: Launch strategy
  - `sensei_growth`: Growth metrics, optimization

### AI Context Extraction

**File: `lib/llm/helper-context-extractor.ts`**

Uses GPT-4o-mini to extract structured insights from conversations:
- Analyzes last 10 messages of conversation
- Extracts helper-specific data based on helper role
- Returns JSON with insights, decisions, artifacts, and summary
- Runs asynchronously after each assistant message (min 4 messages)

**Helper-Specific Extraction Prompts:**

- **Muse**: Problem validation, target users, MVP scope, competitor insights
- **Architect**: Tech stack, hosting, database, auth, architecture, integrations, cost
- **Crafter**: Design system, component structure, design tools, visual direction
- **Hacker**: AI tools, prompt macros, CAO structure, build workflow
- **Hypebeast**: Launch channels, content calendar, launch goals, teaser campaign
- **Sensei**: Growth metrics, retention playbook, optimization areas, scaling plan

### Context Distribution

**File: `app/api/context/route.ts`**

Fetches and distributes comprehensive context to helpers:
- Project details (name, description, stage, tech stack, etc.)
- Journey progress (level, XP, tasks completed)
- All completed tasks up to current level
- Other helper conversations (last 2 messages each)
- **Helper insights** (structured context from all helpers)

**HelperContext Type (`lib/llm/provider.ts`):**
```typescript
helperInsights?: Array<{
  helper: string;
  summary?: string;
  keyInsights?: Array<string>;
  decisionsMade?: Array<string>;
  artifactsCreated?: Array<string>;
  // Helper-specific data
  museValidation?: any;
  architectBlueprint?: any;
  crafterDesign?: any;
  hackerPrompts?: any;
  hypebeastLaunch?: any;
  senseiGrowth?: any;
}>;
```

### Opening Messages

**File: `app/api/chat/route.ts`**

All helpers use `generateOpeningPrompt()` which:
1. Sorts tasks (required first)
2. Formats task list with markers (🔵 required, ⚪ optional)
3. Extracts previous helper insights:
   - Prioritizes structured summaries/insights
   - Falls back to conversation messages if no structured data
4. Generates opening message with:
   - Helper intro
   - Complete task list
   - First task focus
   - Contextual question
   - Deliverable promise
   - Previous helper insights section

## API Endpoints

### POST `/api/projects/[id]/context/helper/extract`
**Purpose**: Extract and update helper context from conversation

**Body**:
```json
{
  "helper": "architect",
  "projectName": "My App",
  "conversation": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "messageId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "helperContext": { /* updated helper_context record */ },
  "extracted": {
    "keyInsights": ["..."],
    "decisionsMade": ["..."],
    "artifactsCreated": ["..."],
    "contextSummary": "...",
    "helperSpecificData": { /* ... */ }
  }
}
```

### POST `/api/projects/[id]/context/helper`
**Purpose**: Manually update helper context (advanced use)

**Body**:
```json
{
  "helper": "muse",
  "keyInsights": ["insight 1", "insight 2"],
  "decisionsMade": ["decision 1"],
  "artifactsCreated": ["artifact 1"],
  "helperSpecificData": { "problem": "..." },
  "contextSummary": "Validated core problem and MVP scope",
  "messageId": "uuid"
}
```

### GET `/api/projects/[id]/context/helper?helper=muse`
**Purpose**: Retrieve helper-specific context

**Response**:
```json
{
  "helperContext": {
    "id": "uuid",
    "helper": "muse",
    "key_insights": ["..."],
    "decisions_made": ["..."],
    "artifacts_created": ["..."],
    "muse_validation": { /* ... */ },
    "context_summary": "...",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

## Client Integration

**File: `components/chat/chat-interface.tsx`**

### Context Update Flow

1. **User sends message** → saved to DB
2. **Assistant streams response** → displayed in UI
3. **Stream completes** → `saveMessage()` called
4. **After save**:
   - `syncProjectContext()` → Updates project fields (Muse only)
   - `updateHelperContext()` → Extracts and saves helper insights (all helpers)

### Update Function

```typescript
const updateHelperContext = useCallback(
  async (sessionId: string, messageId?: string) => {
    if (!project?.id) return;

    const cached = messageCache.current.get(sessionId) || [];
    // Only update if we have at least 4 messages (2 exchanges)
    if (cached.length < 4) return;

    const recentConversation = cached.slice(-10);

    await fetch(`/api/projects/${project.id}/context/helper/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        helper,
        projectName: project.name,
        conversation: recentConversation,
        messageId,
      }),
    });
  },
  [helper, project?.id, project?.name, messageCache],
);
```

## Migration Steps

### 1. Run Database Migration
```sql
-- In Supabase SQL Editor
\i db/migrations/add_helper_context_table.sql
```

### 2. Verify Table Creation
```sql
SELECT * FROM helper_context LIMIT 1;
```

### 3. Test Context Extraction
Start a conversation with any helper and check logs for:
```
[Helper Context Extract] Extracting context for muse...
[Helper Context Extract] ✅ Updated muse context with 3 insights
```

### 4. Verify Context Sharing
When starting a new helper, check opening message for:
```
**Previous Helper Insights:**
• Muse: [summary or key insights]
• Architect: [summary or key insights]
```

## Benefits

1. **Continuity**: Later helpers know what earlier helpers decided
2. **Efficiency**: No need to re-explain project basics
3. **Quality**: Context-aware recommendations
4. **Structured**: Machine-readable insights (vs raw transcripts)
5. **Scalable**: Limited to last 10 insights per helper (no bloat)

## Task Order Fix

All helpers now list tasks in the correct order:
- Required tasks first (marked with 🔵)
- Optional tasks second (marked with ⚪)
- First task is always the first in the ordered list

## Example Flow

1. **User starts with Muse**
   - Defines problem, users, MVP scope
   - Context extracted: `{ problem: "...", targetUsers: "...", mvpScope: "..." }`

2. **User moves to Architect**
   - Opening message includes: "**Previous Helper Insights:** • Muse: Validated core problem..."
   - Architect can reference validated problem when suggesting architecture

3. **User moves to Crafter**
   - Opening message includes insights from Muse and Architect
   - Crafter designs UI informed by MVP scope and tech stack choices

4. **And so on...**

## Future Enhancements

- [ ] Visual timeline of helper insights in UI
- [ ] Edit/delete individual insights
- [ ] Export all helper context as PDF
- [ ] Share helper context with team members
- [ ] Context versioning (track changes over time)


