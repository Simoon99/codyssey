# Agentic Helpers - Complete Guide

## 🚀 Overview

Your Helpers have been upgraded from simple chatbots to **autonomous AI agents** powered by OpenAI's Assistants API. They can now:

- **Use tools** to take actions (save artifacts, create tasks, analyze data)
- **Maintain conversation context** with persistent threads
- **Reason about complex problems** with enhanced decision-making
- **Generate structured outputs** (documents, code, designs)
- **Work proactively** to help users achieve their goals

## 🎯 What Changed

### Before (Simple Chat):
- Helpers were stateless chatbots
- No memory between conversations
- Only text responses
- No ability to take actions

### After (Agentic):
- Helpers are autonomous agents with tools
- Persistent conversation threads
- Can save artifacts, create tasks, analyze data
- Proactive and goal-oriented

## 🛠️ Architecture

### 1. Agent Tools (`lib/llm/agent-tools.ts`)

Each helper has access to specific tools based on their role:

#### Universal Tools (All Helpers):
- **save_artifact**: Save documents, code, designs for users
- **analyze_project_data**: Extract insights from project data
- **create_task**: Create actionable tasks for users
- **update_task_status**: Mark tasks as complete
- **schedule_reminder**: Schedule follow-ups
- **generate_template**: Create structured templates
- **search_resources**: Find relevant tools and examples

#### Helper-Specific Tool Access:

**Muse (Ideator)**:
- save_artifact, generate_template, search_resources
- Use case: Saving problem statements, competitive analyses, interview scripts

**Architect (Planner)**:
- save_artifact, analyze_project_data, create_task, generate_template
- Use case: Saving tech stack decisions, analyzing risks, creating development tasks

**Crafter (Designer)**:
- save_artifact, generate_template, search_resources
- Use case: Saving design systems, wireframes, finding design inspiration

**Hacker (Builder)**:
- save_artifact, create_task, update_task_status, generate_template
- Use case: Saving code snippets, tracking development progress

**Hypebeast (Launcher)**:
- save_artifact, create_task, schedule_reminder, generate_template
- Use case: Saving launch content, scheduling launch activities

**Sensei (Growth)**:
- save_artifact, analyze_project_data, schedule_reminder, generate_template
- Use case: Saving growth strategies, analyzing metrics, scheduling experiments

### 2. Agent Provider (`lib/llm/agent-provider.ts`)

Handles OpenAI Assistants API integration:

```typescript
// Create a conversation thread
const threadId = await createThread();

// Run agentic conversation with streaming
const stream = runAgenticConversation(
  helper,
  threadId,
  message,
  context,
  { projectId, userId }
);

// Process events (text, tool calls, tool results)
for await (const event of stream) {
  if (event.type === "text") {
    // Stream text to UI
  }
  if (event.type === "tool_call") {
    // Show tool being used
  }
  if (event.type === "tool_result") {
    // Show tool result
  }
}
```

### 3. Enhanced Instructions

Each helper has enhanced instructions that emphasize their agency:

Example (Muse):
```
You are Muse, the Ideator—a playful, strategic AI agent.

YOUR AGENCY:
You have tools to:
- Save artifacts (problem statements, competitive analyses)
- Generate templates (interview scripts, research frameworks)
- Create tasks for users

WHEN TO USE TOOLS:
- After helping craft a problem statement → save_artifact
- After competitor research → save_artifact
- When user needs interview questions → generate_template
```

### 4. Streaming Events

The API now streams different event types:

```json
// Thread ID (once per conversation)
{ "type": "thread_id", "threadId": "thread_abc123" }

// Text content (streamed)
{ "type": "text", "content": "Let me help you..." }

// Tool call (when agent uses a tool)
{ 
  "type": "tool_call",
  "tool_name": "save_artifact",
  "tool_args": { "title": "Problem Statement", "content": "..." }
}

// Tool result (after tool executes)
{
  "type": "tool_result",
  "tool_name": "save_artifact",
  "result": { "success": true, "data": { "artifact_id": "..." } }
}

// Done
{ "type": "done" }
```

### 5. UI Updates

The chat interface now displays:
- **Tool usage badges** (purple gradient pills showing active tools)
- **Tool results** (green checkmarks with success messages)
- **Thread continuity** (conversations persist across page refreshes)

## 📝 How It Works

### Example: User asks Muse to help with problem statement

1. **User**: "Help me define my problem statement"

2. **Muse** (Agent reasoning):
   - Asks clarifying questions about target audience, pain points
   - Helps user articulate the problem
   
3. **Muse uses tool** (`save_artifact`):
   ```json
   {
     "title": "Problem Statement v1",
     "content": "[Target audience] struggles with...",
     "type": "document",
     "tags": ["problem-statement", "validation"]
   }
   ```

4. **User sees**:
   - 🔮 "Save Artifact" badge (purple)
   - ✓ "Problem Statement v1" success message (green)
   
5. **Result**: Problem statement saved to database, user can download/reference it later

## 🔧 Tool Implementation

To add a new tool:

### 1. Define the tool in `agent-tools.ts`:

```typescript
export const AGENT_TOOLS = {
  your_tool_name: {
    type: "function" as const,
    function: {
      name: "your_tool_name",
      description: "What this tool does and when to use it",
      parameters: {
        type: "object",
        properties: {
          param1: {
            type: "string",
            description: "Description of param1",
          },
        },
        required: ["param1"],
      },
    },
  },
};
```

### 2. Add to helper configurations:

```typescript
export const HELPER_TOOL_CONFIGS: Record<HelperType, string[]> = {
  muse: [
    "save_artifact",
    "your_tool_name", // Add here
  ],
  // ...
};
```

### 3. Implement the handler:

```typescript
async function yourToolName(
  args: { param1: string },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  // Your implementation
  return {
    success: true,
    data: { /* result data */ },
  };
}

// Add to executeToolCall switch
case "your_tool_name":
  return await yourToolName(args, context);
```

## 🎨 Customizing Instructions

To modify how a helper behaves:

Edit `AGENT_INSTRUCTIONS` in `lib/llm/agent-provider.ts`:

```typescript
const AGENT_INSTRUCTIONS: Record<HelperType, string> = {
  muse: `
    You are Muse...
    
    YOUR AGENCY:
    - List your tools
    
    WHEN TO USE TOOLS:
    - Be specific about when to use each tool
    
    YOUR APPROACH:
    - How you help users
  `,
};
```

## 🧪 Testing the Agentic System

### Manual Testing:

1. **Start a conversation with any helper**
2. **Ask them to create something**:
   - "Create a problem statement for me"
   - "Design a tech stack document"
   - "Generate a launch checklist"

3. **Watch for tool usage**:
   - Purple badge appears showing tool being called
   - Green checkmark shows success
   - Content is saved/created

4. **Verify persistence**:
   - Refresh page
   - Continue conversation
   - Context should be maintained

### Testing Each Helper:

**Muse**:
```
User: "Help me analyze my competitors"
Expected: Muse asks questions, then uses save_artifact to save analysis
```

**Architect**:
```
User: "What tech stack should I use?"
Expected: Architect recommends stack, uses save_artifact to save recommendations
```

**Crafter**:
```
User: "Design a color palette for me"
Expected: Crafter suggests palette, uses save_artifact to save design system
```

**Hacker**:
```
User: "Show me how to implement auth"
Expected: Hacker provides code, uses save_artifact to save code snippet
```

**Hypebeast**:
```
User: "Write a Product Hunt launch post"
Expected: Hypebeast writes copy, uses save_artifact to save launch content
```

**Sensei**:
```
User: "What metrics should I track?"
Expected: Sensei suggests metrics, uses save_artifact to save metrics framework
```

## 🚨 Troubleshooting

### Issue: Tools not being called

**Possible causes**:
1. Helper instructions not emphasizing tool usage
2. Tool descriptions unclear
3. Context missing required information

**Solution**: Update `AGENT_INSTRUCTIONS` to be more explicit about when to use tools

### Issue: Streaming not working

**Possible causes**:
1. Runtime set to "edge" instead of "nodejs"
2. OpenAI API key not set
3. Network issues

**Solution**: 
- Check `app/api/chat/route.ts` has `export const runtime = "nodejs"`
- Verify `OPENAI_API_KEY` in environment

### Issue: Thread not persisting

**Possible causes**:
1. ThreadId not being stored in state
2. ThreadId not being sent in subsequent requests

**Solution**: Verify `threadId` state management in `chat-interface.tsx`

## 📊 Monitoring Agent Behavior

Add logging to understand agent decisions:

```typescript
// In agent-provider.ts
console.log('Tool called:', toolName, toolArgs);
console.log('Tool result:', result);

// In chat interface
console.log('Agent event:', event);
```

## 🔒 Security Considerations

1. **Tool authorization**: Verify user owns projectId before executing tools
2. **Rate limiting**: Implement rate limits on tool calls
3. **Input validation**: Validate all tool arguments
4. **Sensitive data**: Never save API keys or sensitive data in artifacts

## 🎯 Best Practices

1. **Clear instructions**: Make tool usage explicit in agent instructions
2. **User feedback**: Show tool usage in UI so users understand what's happening
3. **Error handling**: Gracefully handle tool failures
4. **Context management**: Keep context concise to save tokens
5. **Thread cleanup**: Delete old threads to manage costs

## 🚀 Next Steps

### Potential Enhancements:

1. **Persistent artifacts**: Save artifacts to database
2. **Artifact library**: UI for viewing/managing all artifacts
3. **Inter-agent communication**: Agents can consult each other
4. **Scheduled actions**: Execute tools on schedule
5. **Multi-step workflows**: Chain multiple tools together
6. **Custom tools per project**: Let users define custom tools

### Database Schema for Artifacts:

```sql
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  helper HelperType NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL, -- 'document', 'code', 'design', 'data', 'template'
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## 💡 Example Use Cases

### 1. End-to-End Problem Validation (Muse)

User converses with Muse about their idea. Muse:
1. Asks clarifying questions
2. **save_artifact**: Problem statement
3. **generate_template**: Interview script
4. **save_artifact**: Competitive analysis
5. **create_task**: "Conduct 5 user interviews"
6. **schedule_reminder**: Follow up in 1 week

### 2. Complete Tech Stack Setup (Architect)

User asks Architect to design architecture. Architect:
1. Asks about constraints
2. **save_artifact**: Tech stack document
3. **save_artifact**: Architecture diagram
4. **analyze_project_data**: Identify risks
5. **create_task**: "Setup repository"
6. **create_task**: "Configure database"
7. **generate_template**: Setup instructions

### 3. Launch Campaign Creation (Hypebeast)

User prepares to launch. Hypebeast:
1. **save_artifact**: Product Hunt description
2. **save_artifact**: Tweet thread
3. **save_artifact**: Launch checklist
4. **create_task**: "Submit to Product Hunt"
5. **schedule_reminder**: "Launch day - 6AM"
6. **schedule_reminder**: "Post to Twitter - 12PM"

## 📖 Further Reading

- [OpenAI Assistants API Docs](https://platform.openai.com/docs/assistants)
- [Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [Streaming with Assistants](https://platform.openai.com/docs/assistants/streaming)

---

**Your Helpers are now autonomous agents. They don't just chat—they act!** 🚀

