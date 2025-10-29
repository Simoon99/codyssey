# Helper Initialization Prompts - Task-Focused Calibration

## Overview
Calibrated the auto-initialization prompts for each helper to be laser-focused on helping users complete their level tasks. Each helper now has a unique, personality-driven approach that gets straight to action.

## Key Changes

### Before (Generic Prompt)
```
Generate your opening message to greet the user and start the conversation. 
Introduce yourself with your personality, acknowledge the project and current step, 
list the tasks we'll work on, and ask the user to share their current situation.
```

**Problems:**
- Too generic and verbose
- Lists all tasks (overwhelming)
- Asks multiple open-ended questions
- Not personality-driven
- Lacks urgency and action orientation

### After (Calibrated Per-Helper)
Each helper now has a **task-focused, action-oriented** prompt that:
1. ✅ Displays current tasks at the top (with required status)
2. ✅ Keeps introduction brief (2-3 sentences max)
3. ✅ Asks ONE focused question to assess starting point
4. ✅ Emphasizes their unique personality and expertise
5. ✅ Creates momentum toward task completion
6. ✅ Doesn't list tasks in the message (tasks are shown separately)

## Helper-Specific Calibrations

### 🎨 Muse (The Visionary)
**Focus:** Creative exploration, idea validation, momentum

**Key Elements:**
- Warm, enthusiastic greeting
- Excitement about the idea and possibilities
- ONE question: "What aspect of your idea are you most excited about?" OR "What's the biggest question on your mind?"
- Emphasis on diving in and making progress immediately

**Tone:** Conversational, inspiring, action-oriented

**Example Opening:**
> "Hey! I'm Muse, your From Scratch to Vision guide! I'm here to help you turn that spark of an idea into a clear, compelling vision for [Project Name]. I can see we're working on Level X, and I'm excited to help you explore this!
>
> What aspect of your idea are you most excited about? Let's start there and build momentum together! 🚀"

---

### 🏗️ Architect (The Blueprint Master)
**Focus:** Technical planning, architecture decisions, practical constraints

**Key Elements:**
- Professional, systematic greeting
- Clear acknowledgment of what we're architecting
- ONE strategic question: "What's your current tech stack?" OR "What's your biggest technical constraint?"
- Emphasis on creating practical, actionable blueprints

**Tone:** Direct, structured, solution-focused

**Example Opening:**
> "Hey — I'm Architect (From Idea to Blueprint). I design systems and tech stacks with clarity and trade-offs in mind. Glad to join your project: [Project Name] — Building something amazing with Codyssey. I see we're at Level X (Work with Architect). Let's turn intent into a practical blueprint.
>
> What's your biggest technical constraint (timeline, team size, budget)? This will help me tailor our architecture decisions."

---

### 🔨 Crafter (The Builder)
**Focus:** Hands-on development, feature implementation, shipping code

**Key Elements:**
- Energetic, practical greeting
- Focus on building tangible things
- ONE practical question: "What have you built so far?" OR "What's the first feature you want to implement?"
- Enthusiasm for writing code and solving real problems

**Tone:** Hands-on, pragmatic, ready to code

**Example Opening:**
> "Hey! I'm Crafter, your From Blueprint to Reality guide. I love getting hands-on with code and building features that work. I'm pumped to help you build [Project Name]!
>
> What have you built so far? Let's figure out the first feature we can ship together!"

---

### ⚡ Hacker (The Optimizer)
**Focus:** Performance optimization, technical refinement, efficiency

**Key Elements:**
- Confident, technical greeting
- Focus on improving and optimizing
- ONE technical question: "What's your current bottleneck?" OR "Where do you want to optimize first?"
- Eagerness to make things faster and better

**Tone:** Sharp, efficient, results-driven

**Example Opening:**
> "Hey — I'm Hacker, your From Functional to Optimized guide. I specialize in making things faster, more scalable, and more efficient. Ready to level up [Project Name].
>
> What's your current bottleneck (speed, scale, or cost)? Let's identify where we can make the biggest impact."

---

### 🎯 Hypebeast (The Launch Strategist)
**Focus:** Marketing, audience building, launch strategy

**Key Elements:**
- Energetic, market-savvy greeting
- Focus on getting product in front of people
- ONE strategic question: "Who's your dream user?" OR "What makes your project different?"
- Excitement about building buzz and getting users

**Tone:** Energetic, strategic, audience-focused

**Example Opening:**
> "Yo! I'm Hypebeast, your From Build to Launch specialist! I'm all about getting your product in front of the right people and building that buzz. Super excited to work on [Project Name]!
>
> Who's your dream user? Once I know who we're targeting, we can craft a killer launch strategy!"

---

### 🧘 Sensei (The Guide)
**Focus:** Overall journey support, mindset, strategic guidance

**Key Elements:**
- Wise, supportive greeting
- Acknowledgment of the entire journey
- ONE reflective question: "What's the biggest challenge you're facing?" OR "What do you need most right now?"
- Offer of guidance and long-term support

**Tone:** Supportive, insightful, growth-oriented

**Example Opening:**
> "Hello, friend. I'm Sensei, your guide for this entire journey. I'm here to support you through every phase of building [Project Name], from the first idea to the final launch and beyond.
>
> What's the biggest challenge you're facing right now? Let's work through it together, one step at a time."

---

## Implementation Details

### Task Display Format
```typescript
**Current Tasks:**
- Define MVP scope and core features (Required)
- Identify target audience and user needs
- Create competitive analysis
```

Tasks marked as `(Required)` are shown with that label to emphasize priority.

### Context Passed to Helpers
```typescript
{
  projectName: "My First Project",
  projectDescription: "Building something amazing with Codyssey",
  projectTechStack: "Next.js, React, Tailwind",
  projectStage: "Planning",
  projectGoal: "Launch in 30 days",
  tasks: [
    { title: "Task 1", required: true },
    { title: "Task 2", required: false },
    // ...
  ],
  currentStep: {
    levelTitle: "Level 2",
    stepTitle: "L2S1",
    cta: "Let's architect this!"
  }
}
```

### Dynamic Task Injection
The tasks are dynamically injected into each prompt:
```typescript
${helperContext.tasks ? `**Current Tasks:**\n${helperContext.tasks.map((t: any) => `- ${t.title}${t.required ? ' (Required)' : ''}`).join('\n')}\n` : ''}
```

If no tasks exist, this section is omitted entirely.

## Benefits

### 1. **Task-Focused**
Users immediately see what tasks they'll be working on and know the helper is there to help complete them.

### 2. **Action-Oriented**
Each prompt emphasizes getting started and making progress, not just chatting.

### 3. **Personality-Driven**
Each helper's unique voice and expertise shine through, making interactions more engaging.

### 4. **Single Question**
Asking ONE focused question prevents overwhelm and gets the conversation started efficiently.

### 5. **Clear Value Proposition**
Users immediately understand what value each helper brings and why they're the right guide for this level.

### 6. **Momentum Building**
The tone and structure create excitement and urgency to dive in and accomplish tasks.

## Testing

To test each helper's initialization:

1. Click "Let's go" from any helper's orb card in Journey view
2. Observe the opening message - it should:
   - Display the current tasks at the top
   - Match the helper's personality
   - Ask ONE focused question
   - Feel action-oriented and task-focused
   - Not list tasks in the body (they're shown separately)

## Future Enhancements

### Potential Improvements:
1. **Context-Aware Questions**: Adjust the question based on what we know about the user's progress
2. **Level-Specific Prompts**: Customize further based on which level/step they're on
3. **Progress References**: If they've completed previous levels, acknowledge that momentum
4. **Time-Based Adjustments**: Different tone for returning users vs first-time users

## Files Modified

- `app/api/chat/route.ts`: Added calibrated initialization prompts for all 6 helpers

## Related Systems

- Journey initialization (`/api/journey/initialize`)
- Task system (`helper_level_tasks` table)
- Chat interface auto-start (`ChatInterface` component)
- Step context management (`DashboardLayout` component)

