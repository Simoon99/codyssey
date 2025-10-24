# 🎯 Journey UI Integration Guide

## Overview

This guide shows how to connect the journey configuration (`lib/journey-config.json`) to the UI components, ensuring proper task mapping, helper context initialization, and first-message CTAs.

---

## Architecture

```
journey-config.json
       ↓
lib/journey-mapper.ts (utility functions)
       ↓
       ├─→ components/dashboard/journey-view.tsx (orbs + step selection)
       │    └─→ passes stepContext to onHelperSelect callback
       │
       ├─→ lib/hooks/useJourneyStep.ts (state management)
       │
       └─→ components/chat/chat-interface.tsx (helper chat)
            └─→ initializes with firstMessage & tasks
```

---

## Key Files

### 1. **lib/journey-config.json**
- **Purpose**: Single source of truth for journey structure
- **Content**: 5 levels × 3 steps, with tasks, CTAs, first messages, helpers
- **Usage**: Loaded by journey-mapper to drive UI

### 2. **lib/journey-mapper.ts**
- **Purpose**: Utility functions to query journey config
- **Key Functions**:
  - `getAllOrbs()` - Get all 15 orbs (for rendering)
  - `getOrbById(orbId)` - Get specific orb data
  - `getFirstMessage(orbId)` - Get CTA for helper chat
  - `getStepTasks(orbId)` - Get task slugs for a step
  - `getRequiredTasks(orbId)` - Get required task slugs only

### 3. **components/dashboard/journey-view.tsx**
- **Purpose**: Render orbs from journey config; handle step selection
- **What Changed**:
  - Orbs now load from `getAllOrbs()` instead of hardcoded
  - `onHelperSelect` callback now passes full `stepContext` object
  - Card displays step title, CTA, task counts
  - Button says "Let's go 🚀" instead of "START"

### 4. **lib/hooks/useJourneyStep.ts** (NEW)
- **Purpose**: Manage step context and task state
- **Methods**:
  - `setJourneyStep(context)` - Update current step
  - `getCurrentTasks()` - Get all tasks for step
  - `getRequiredTasksList()` - Get required tasks only
  - `areAllRequiredTasksCompleted(completedSlugs)` - Check completion
  - `clearJourneyStep()` - Reset

---

## Integration Points

### Step 1: User Clicks Orb (journey-view.tsx)

The orb click handler now passes rich context:

```typescript
const orb = allOrbs[index];
onHelperSelect(orb.helper, {
  orbId: orb.id,           // "L1S1", "L2S3", etc.
  stepIndex: orb.stepIndex,       // 0, 1, 2
  levelIndex: orb.levelIndex,     // 0-4
  tasks: orb.tasks,               // ["define-problem", "research-competition", ...]
  requiredTasks: orb.requiredTasks, // ["define-problem", "research-competition"]
  firstMessage: orb.firstMessage, // Full CTA from config
  cta: orb.cta,                   // Short button label
});
```

### Step 2: Dashboard Handles Selection

In your dashboard component (e.g., `app/dashboard/page.tsx`):

```typescript
import { useJourneyStep } from "@/lib/hooks/useJourneyStep";
import { JourneyView } from "@/components/dashboard/journey-view";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function Dashboard() {
  const journeyStep = useJourneyStep();
  const [selectedHelper, setSelectedHelper] = useState<string | null>(null);
  const [tasks, setTasks] = useState([]);

  const handleHelperSelect = async (helper: string, stepContext) => {
    // Update local step context
    journeyStep.setJourneyStep(stepContext);
    setSelectedHelper(helper);

    // Load tasks from database for this step
    const loadedTasks = await fetchTasksByStep(
      stepContext.tasks,
      currentProjectId
    );
    setTasks(loadedTasks);
  };

  return (
    <div>
      <JourneyView
        levels={levels}
        currentXP={currentXP}
        onHelperSelect={handleHelperSelect}
        user={user}
        project={project}
      />

      {selectedHelper && (
        <ChatInterface
          helper={selectedHelper}
          tasks={tasks}
          initialMessages={[
            {
              id: "initial",
              role: "assistant",
              content: journeyStep.firstMessage, // Auto-populated CTA!
            },
          ]}
          onSendMessage={handleChatMessage}
          onBackToJourney={() => {
            setSelectedHelper(null);
            journeyStep.clearJourneyStep();
          }}
        />
      )}
    </div>
  );
}
```

### Step 3: Chat Interface Auto-Populates

In `components/chat/chat-interface.tsx`:

```typescript
interface ChatInterfaceProps {
  helper: HelperType;
  tasks?: Array<{
    id: string;
    title: string;
    description: string;
    xp_reward: number;
    required: boolean;
    status: "todo" | "in_progress" | "done";
  }>;
  initialMessages?: ChatMessage[];
  onSendMessage?: (content: string) => Promise<void>;
  onBackToJourney?: () => void;
}

export function ChatInterface({
  helper,
  tasks = [],
  initialMessages = [],
  onSendMessage,
  onBackToJourney,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  return (
    <div>
      {/* First message from journey-config auto-appears */}
      <div className="space-y-4 p-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>

      {/* Tasks for this step */}
      <TasksSection tasks={tasks} onCompleteTask={handleTaskComplete} />

      {/* Chat input */}
      <div className="border-t p-4">
        <input
          type="text"
          placeholder="Ask me anything..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSendMessage?.(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}
```

---

## Task Mapping Flow

### Database Query Pattern

When a user selects a step, load tasks like this:

```typescript
// Get task slugs from step
const taskSlugs = stepContext.tasks;

// Query database for task details
const { data: tasks } = await supabase
  .from("tasks")
  .select("id, slug, title, description, xp_reward, required, order_index")
  .in("slug", taskSlugs)
  .eq("level_id", stepContext.levelIndex + 1)
  .order("order_index", { ascending: true });

// Match with progress
const { data: progress } = await supabase
  .from("task_progress")
  .select("task_id, status")
  .eq("project_id", projectId)
  .eq("user_id", userId)
  .in("task_id", tasks.map(t => t.id));

// Combine
const tasksWithStatus = tasks.map(task => ({
  ...task,
  status: progress.find(p => p.task_id === task.id)?.status || "todo",
}));

setTasks(tasksWithStatus);
```

### Task Completion & Level-Up

When a task is completed:

```typescript
// 1. Mark task as done
await completeTask(userId, projectId, taskId);

// 2. Check if all required tasks in level are done
const requiredTaskIds = stepContext.requiredTasks.map(slug => {
  return tasks.find(t => t.slug === slug)?.id;
});

const { data: completedRequired } = await supabase
  .from("task_progress")
  .select("task_id")
  .in("task_id", requiredTaskIds)
  .eq("status", "done");

// 3. If all required done, level up (handled by backend)
if (completedRequired.length === requiredTaskIds.length) {
  // Backend auto-levels user up
  // Update UI to show next level available
}
```

---

## Helper Chat System Prompts

When initializing a chat with a helper, inject the system prompt:

```typescript
const getSystemPrompt = (helper: string): string => {
  const prompts: Record<string, string> = {
    muse: `You are Muse, the Ideator—a playful, strategic thinker...
    [Full system prompt from JOURNEY_FRAMEWORK.md]`,
    architect: `You are Architect, the Stack Master—obsessed with constraints...
    [Full system prompt from JOURNEY_FRAMEWORK.md]`,
    // ... rest of helpers
  };
  return prompts[helper] || "";
};

// In chat API
export async function POST(request: NextRequest) {
  const { helper, message, projectId } = await request.json();

  const systemPrompt = getSystemPrompt(helper);
  
  // Pass to LLM with system prompt
  const response = await createStreamingChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      ...previousMessages,
      { role: "user", content: message },
    ],
  });

  return response;
}
```

---

## Example: Complete L1S1 (Spark → Muse) Flow

```typescript
// 1. User clicks L1S1 orb
const stepContext = {
  orbId: "L1S1",
  helper: "muse",
  stepIndex: 0,
  levelIndex: 0,
  tasks: ["define-problem", "research-competition", "identify-target-audience", "market-size-analysis"],
  requiredTasks: ["define-problem", "research-competition"],
  firstMessage: "Hey there! 🚀 Let's nail down the problem...",
  cta: "Define your problem & market",
};

// 2. Journey-view passes this to onHelperSelect
onHelperSelect("muse", stepContext);

// 3. Dashboard receives it
handleHelperSelect("muse", stepContext);
journeyStep.setJourneyStep(stepContext);

// 4. Load tasks from DB
const tasks = await fetchTasksByStep(["define-problem", "research-competition", ...], projectId);
// Returns:
// [
//   { id: "uuid1", slug: "define-problem", title: "Define the Problem", xp_reward: 20, required: true, status: "todo" },
//   { id: "uuid2", slug: "research-competition", title: "Research Competition", xp_reward: 15, required: true, status: "todo" },
//   ...
// ]

// 5. Initialize chat with Muse
<ChatInterface
  helper="muse"
  tasks={tasks}
  initialMessages={[
    {
      id: "1",
      role: "assistant",
      content: "Hey there! 🚀 Let's nail down the problem...", // From stepContext.firstMessage
    },
  ]}
/>

// 6. User sees:
// - Muse's first message with CTA
// - 4 tasks (2 required, 2 optional)
// - Can start chatting or check off tasks

// 7. User completes "Define the Problem"
// - Task marked as done
// - XP awarded
// - UI updates

// 8. User completes "Research Competition" (last required)
// - All required tasks done
// - Level-up triggered
// - L1S2 becomes available (or already was)
```

---

## File Checklist

- ✅ `lib/journey-config.json` — Full config with levels, steps, tasks, CTAs
- ✅ `lib/journey-mapper.ts` — Query functions for orbs, tasks, helpers
- ✅ `components/dashboard/journey-view.tsx` — Updated to use mapper + pass stepContext
- ✅ `lib/hooks/useJourneyStep.ts` — State management for step context
- ✅ `components/chat/chat-interface.tsx` — Receives initialMessages with first CTA
- 📝 `app/dashboard/page.tsx` (or similar) — Needs to use useJourneyStep hook
- 📝 `app/api/chat/route.ts` — Needs to use system prompts from JOURNEY_FRAMEWORK.md
- 📝 Task loading API — Needs to query tasks by slug + level

---

## Next Steps

1. **Load journey-config in dashboard**: Use `useJourneyStep` hook
2. **Fetch tasks from DB**: Implement `fetchTasksByStep(slugs, projectId)`
3. **Inject system prompts**: Use getSystemPrompt(helper) in chat API
4. **Test L1S1 → Muse flow**: User clicks orb → sees first message → completes tasks
5. **Monitor**: Track which helpers/steps are most used
6. **Iterate**: Refine CTAs based on user engagement

---

## Troubleshooting

**Q: Tasks not showing up in chat?**  
A: Make sure `fetchTasksByStep` query matches task slugs from journey-config exactly.

**Q: First message not appearing?**  
A: Check that `initialMessages` is passed to ChatInterface with role="assistant".

**Q: Level not auto-leveling?**  
A: Verify `checkAndApplyLevelUp()` in `lib/levels/progression.ts` is running after task completion.

**Q: Orbs not loading?**  
A: Ensure `lib/journey-config.json` exists and is valid JSON; check console for parse errors.

---

## Glossary

| Term | Definition |
|------|-----------|
| **Orb** | Visual representation of a step (circle) on the journey view |
| **Step** | One of 3 substeps within a level, has a helper and task subset |
| **Level** | One of 5 major milestones (Spark, Build Prep, Core Build, Launch, Grow) |
| **Helper** | AI persona (Muse, Architect, Crafter, Hacker, Hypebeast, Sensei) |
| **Task** | Individual action item (e.g., "define-problem") |
| **CTA** | Call-to-action text shown in step card |
| **First Message** | Helper's opening message when step is selected |
| **stepContext** | Object passed from journey-view to dashboard on orb click |
