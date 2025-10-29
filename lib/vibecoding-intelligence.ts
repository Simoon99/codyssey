/**
 * Vibecoding Intelligence - Knowledge Base for AI-Native Development
 * 
 * This module contains comprehensive knowledge about vibecoding best practices,
 * workflows, and guidelines for using AI coding tools effectively.
 */

export interface VibecodingBestPractice {
  id: string;
  category: "prompting" | "workflow" | "tooling" | "debugging" | "architecture";
  title: string;
  description: string;
  do: string[];
  dont: string[];
  example?: string;
  tools: VibecodingTool[];
}

export interface VibecodingWorkflow {
  id: string;
  name: string;
  description: string;
  idealFor: string[];
  tools: VibecodingTool[];
  steps: WorkflowStep[];
  estimatedTime: string;
  complexity: "beginner" | "intermediate" | "advanced";
}

export interface WorkflowStep {
  order: number;
  action: string;
  tool: VibecodingTool;
  promptTemplate?: string;
  expectedOutcome: string;
  tips: string[];
}

export interface AICodeReviewItem {
  category: "structure" | "logic" | "security" | "performance" | "maintainability";
  checkpoint: string;
  questions: string[];
  redFlags: string[];
}

export type VibecodingTool = "cursor" | "lovable" | "bolt" | "v0" | "claude" | "chatgpt" | "github-copilot" | "windsurf";

export const VIBECODING_BEST_PRACTICES: VibecodingBestPractice[] = [
  {
    id: "prompt-context-first",
    category: "prompting",
    title: "Always Start with Context",
    description: "Provide clear context about your project, tech stack, and current state before requesting changes",
    do: [
      "Describe your current project structure",
      "Mention your tech stack and dependencies",
      "Explain what already exists vs what needs to be built",
      "Reference existing files and patterns",
      "State your constraints (time, complexity, dependencies)"
    ],
    dont: [
      "Assume the AI knows your project setup",
      "Skip mentioning critical dependencies",
      "Omit information about existing code",
      "Make vague references to 'the file' or 'that component'"
    ],
    example: "Instead of 'Add authentication', say: 'In our Next.js 14 app using Supabase auth, add a login flow that integrates with our existing dashboard at /dashboard and uses the AuthContext from lib/auth-context.tsx'",
    tools: ["cursor", "lovable", "bolt", "claude", "chatgpt"]
  },
  {
    id: "prompt-specificity",
    category: "prompting",
    title: "Be Extremely Specific About Desired Outcomes",
    description: "Vague prompts generate vague code. Specify exact behaviors, edge cases, and expected results",
    do: [
      "Describe exact user interactions and expected outcomes",
      "Mention edge cases and error states",
      "Specify data structures and types",
      "Include acceptance criteria",
      "Provide examples of desired behavior"
    ],
    dont: [
      "Use vague terms like 'make it better' or 'fix the styling'",
      "Assume the AI will infer your intentions",
      "Leave behavior undefined",
      "Skip edge cases"
    ],
    example: "Instead of 'Make a form', say: 'Create a user registration form with email validation (RFC 5322), password strength indicator (min 8 chars, 1 uppercase, 1 number), error messages below each field in red (#EF4444), submit button disabled until valid, and show success toast on submission'",
    tools: ["cursor", "lovable", "bolt", "v0"]
  },
  {
    id: "prompt-incremental",
    category: "prompting",
    title: "Build Incrementally, Not All at Once",
    description: "Break complex features into smaller, testable pieces and build iteratively",
    do: [
      "Start with the core functionality",
      "Add features one at a time",
      "Test each increment before moving on",
      "Request validation and error handling separately",
      "Build UI after logic is solid"
    ],
    dont: [
      "Request entire features with all edge cases at once",
      "Skip intermediate testing steps",
      "Mix multiple complex changes in one prompt",
      "Add styling, logic, and tests simultaneously"
    ],
    example: "1st: 'Create the basic user model and database schema', 2nd: 'Add validation logic', 3rd: 'Add the API endpoints', 4th: 'Create the UI form', 5th: 'Add error handling and loading states'",
    tools: ["cursor", "claude", "chatgpt"]
  },
  {
    id: "workflow-iterate-in-cursor",
    category: "workflow",
    title: "Use Cursor for Iterative Development",
    description: "Cursor excels at understanding your codebase and making incremental changes across multiple files",
    do: [
      "Use Cursor for refactoring existing code",
      "Reference multiple files in your prompts",
      "Ask Cursor to analyze patterns in your codebase",
      "Use Cursor for bug fixes and optimizations",
      "Leverage Cursor's codebase context for complex changes"
    ],
    dont: [
      "Use Cursor for initial scaffolding (use Bolt/Lovable instead)",
      "Ignore Cursor's suggestions for existing patterns",
      "Make Cursor generate boilerplate from scratch"
    ],
    tools: ["cursor"]
  },
  {
    id: "workflow-rapid-prototyping",
    category: "workflow",
    title: "Rapid Prototyping with Bolt and Lovable",
    description: "Use Bolt and Lovable to quickly generate complete features and UI from scratch",
    do: [
      "Use for new components and features",
      "Provide comprehensive initial prompts",
      "Include design specifications and mockups",
      "Specify complete user flows",
      "Request full working examples with styling"
    ],
    dont: [
      "Use for small tweaks to existing code",
      "Skip design details",
      "Expect deep codebase integration"
    ],
    tools: ["bolt", "lovable"]
  },
  {
    id: "workflow-ui-first-v0",
    category: "workflow",
    title: "Design UI Components with v0",
    description: "v0 specializes in creating beautiful, responsive UI components based on shadcn/ui",
    do: [
      "Use for standalone UI components",
      "Provide design mockups or descriptions",
      "Specify responsive behavior",
      "Request accessibility features",
      "Ask for variant examples"
    ],
    dont: [
      "Use for backend logic",
      "Expect complex state management",
      "Skip responsiveness requirements"
    ],
    tools: ["v0"]
  },
  {
    id: "tooling-right-tool",
    category: "tooling",
    title: "Choose the Right Tool for the Job",
    description: "Different AI tools excel at different tasks - use the right one for maximum efficiency",
    do: [
      "Use Cursor for existing codebase work",
      "Use Bolt/Lovable for new features from scratch",
      "Use v0 for UI component design",
      "Use Claude/ChatGPT for planning and architecture",
      "Use GitHub Copilot for in-line suggestions"
    ],
    dont: [
      "Force one tool for everything",
      "Ignore each tool's strengths",
      "Use complex tools for simple tasks"
    ],
    tools: ["cursor", "bolt", "lovable", "v0", "claude", "chatgpt", "github-copilot"]
  },
  {
    id: "debugging-systematic-approach",
    category: "debugging",
    title: "Systematic AI-Assisted Debugging",
    description: "Use AI to help debug issues methodically rather than blindly trying fixes",
    do: [
      "Provide complete error messages and stack traces",
      "Share relevant code context",
      "Describe what you expected vs what happened",
      "Mention what you've already tried",
      "Ask for explanation before fixes"
    ],
    dont: [
      "Just paste error messages without context",
      "Skip describing the expected behavior",
      "Apply fixes without understanding them",
      "Ignore the root cause"
    ],
    example: "In Next.js 14 app router, getting 'TypeError: Cannot read property id of undefined' at line 45 of app/dashboard/page.tsx when accessing user.id. Expected: user object from Supabase auth context. Already tried: checking if user exists, refreshing token. Full error: [paste stack trace]",
    tools: ["cursor", "claude", "chatgpt"]
  },
  {
    id: "architecture-ai-friendly",
    category: "architecture",
    title: "Design AI-Friendly Architecture",
    description: "Structure your code to make it easier for AI tools to understand and modify",
    do: [
      "Use clear, descriptive naming",
      "Keep functions small and focused",
      "Add comments explaining business logic",
      "Follow consistent patterns",
      "Use TypeScript for better context",
      "Organize files logically"
    ],
    dont: [
      "Use cryptic abbreviations",
      "Create giant multi-purpose functions",
      "Skip type definitions",
      "Mix different patterns"
    ],
    tools: ["cursor", "bolt", "lovable"]
  },
  {
    id: "prompt-error-handling",
    category: "prompting",
    title: "Always Specify Error Handling",
    description: "AI-generated code often lacks proper error handling unless explicitly requested",
    do: [
      "Request try-catch blocks for async operations",
      "Specify user-facing error messages",
      "Ask for loading states",
      "Request validation errors",
      "Specify fallback behavior"
    ],
    dont: [
      "Assume error handling will be added automatically",
      "Skip edge case scenarios",
      "Forget loading and empty states"
    ],
    example: "Add error handling: wrap API call in try-catch, show toast notification on error with message 'Failed to save changes. Please try again.', disable submit button while loading, re-enable on success/error",
    tools: ["cursor", "bolt", "lovable"]
  }
];

export const VIBECODING_WORKFLOWS: VibecodingWorkflow[] = [
  {
    id: "new-feature-full-stack",
    name: "Build New Full-Stack Feature",
    description: "Complete workflow for building a new feature from planning to deployment",
    idealFor: ["New major features", "MVP development", "Complete user flows"],
    tools: ["claude", "cursor", "bolt"],
    estimatedTime: "2-4 hours",
    complexity: "intermediate",
    steps: [
      {
        order: 1,
        action: "Plan architecture and data model",
        tool: "claude",
        promptTemplate: "I'm building [feature]. My stack is [stack]. Help me design: 1) Database schema, 2) API endpoints needed, 3) Component structure, 4) State management approach. Current codebase structure: [describe]",
        expectedOutcome: "Clear architecture plan with data models, API design, and component hierarchy",
        tips: [
          "Be specific about your existing patterns",
          "Mention any constraints (auth, permissions, etc.)",
          "Ask for trade-offs between different approaches"
        ]
      },
      {
        order: 2,
        action: "Generate database schema and migrations",
        tool: "cursor",
        promptTemplate: "Based on this data model [paste from step 1], create: 1) Database migration file in [location], 2) TypeScript types in [location], 3) Follow pattern from [existing migration]. Use [Supabase/Prisma/etc]",
        expectedOutcome: "Migration files and TypeScript types matching your database setup",
        tips: [
          "Reference existing migration patterns",
          "Include indexes and foreign keys",
          "Request RLS policies if using Supabase"
        ]
      },
      {
        order: 3,
        action: "Build backend API endpoints",
        tool: "cursor",
        promptTemplate: "Create API routes for [feature]: 1) GET /api/[resource] - list with pagination, 2) POST /api/[resource] - create with validation, 3) PUT /api/[resource]/[id] - update, 4) DELETE /api/[resource]/[id]. Follow pattern from [existing API]. Include error handling and auth checks.",
        expectedOutcome: "Complete CRUD API with validation, auth, and error handling",
        tips: [
          "Reference existing API route structure",
          "Specify exact validation rules",
          "Include rate limiting if needed"
        ]
      },
      {
        order: 4,
        action: "Create UI components",
        tool: "bolt",
        promptTemplate: "Build [feature] UI with: 1) List view with [columns], 2) Create/edit form with [fields], 3) Delete confirmation modal. Style: [describe or attach mockup]. Include loading states, empty states, error messages. Use [component library].",
        expectedOutcome: "Complete UI with all states and interactions",
        tips: [
          "Provide visual examples or mockups",
          "Specify responsive behavior",
          "Include accessibility requirements"
        ]
      },
      {
        order: 5,
        action: "Integrate frontend with backend",
        tool: "cursor",
        promptTemplate: "Connect [component] to API endpoints: 1) Add data fetching with [React Query/SWR/etc], 2) Handle loading/error states, 3) Implement optimistic updates, 4) Add success notifications. Follow pattern from [existing feature].",
        expectedOutcome: "Fully integrated feature with proper state management",
        tips: [
          "Reference existing data fetching patterns",
          "Test all error scenarios",
          "Verify auth is working"
        ]
      },
      {
        order: 6,
        action: "Test and refine",
        tool: "cursor",
        promptTemplate: "Review [feature] for: 1) Edge cases [list specific ones], 2) Error handling completeness, 3) Performance issues, 4) Security concerns. Run tests and fix any issues found.",
        expectedOutcome: "Bug-free, performant feature ready for deployment",
        tips: [
          "Test on different screen sizes",
          "Try invalid inputs",
          "Check network error scenarios"
        ]
      }
    ]
  },
  {
    id: "rapid-ui-component",
    name: "Rapid UI Component Creation",
    description: "Quick workflow for creating polished UI components",
    idealFor: ["Standalone components", "Design system pieces", "Reusable widgets"],
    tools: ["v0", "cursor"],
    estimatedTime: "30-60 minutes",
    complexity: "beginner",
    steps: [
      {
        order: 1,
        action: "Design component with v0",
        tool: "v0",
        promptTemplate: "Create a [component type] with: [detailed description]. Style: [modern/minimal/playful]. Colors: [palette]. Include: [specific features]. Make it responsive and accessible.",
        expectedOutcome: "Beautiful, working component code",
        tips: [
          "Provide visual references if possible",
          "Specify exact interactive behaviors",
          "Request multiple variants if needed"
        ]
      },
      {
        order: 2,
        action: "Integrate into codebase",
        tool: "cursor",
        promptTemplate: "Integrate this component [paste v0 code] into our codebase: 1) Adapt to our [styling system], 2) Update imports to use our [component library], 3) Add TypeScript types, 4) Place in [location]. Match style of [existing component].",
        expectedOutcome: "Component integrated and styled consistently",
        tips: [
          "Ensure component follows your naming conventions",
          "Add proper prop types",
          "Test in context of your app"
        ]
      }
    ]
  },
  {
    id: "debug-and-fix",
    name: "AI-Assisted Debugging",
    description: "Systematic approach to debugging with AI assistance",
    idealFor: ["Bug fixes", "Performance issues", "Unexpected behavior"],
    tools: ["cursor", "claude"],
    estimatedTime: "30-90 minutes",
    complexity: "intermediate",
    steps: [
      {
        order: 1,
        action: "Gather debugging information",
        tool: "cursor",
        promptTemplate: "Analyze this bug: Error: [paste error]. File: [file:line]. Expected: [behavior]. Actual: [behavior]. Code: [paste relevant code]. Show me: 1) What's causing this, 2) Why it's happening, 3) Related code that might be affected.",
        expectedOutcome: "Clear explanation of the bug's root cause",
        tips: [
          "Include full error messages",
          "Provide before/after context",
          "Mention recent changes"
        ]
      },
      {
        order: 2,
        action: "Implement fix",
        tool: "cursor",
        promptTemplate: "Fix the bug by [approach from step 1]. Ensure: 1) Fix doesn't break [related functionality], 2) Add safeguards for similar issues, 3) Update [types/tests] if needed. Follow patterns from [similar code].",
        expectedOutcome: "Bug fixed with proper safeguards",
        tips: [
          "Test the fix thoroughly",
          "Consider edge cases",
          "Update tests if needed"
        ]
      }
    ]
  },
  {
    id: "refactor-improve",
    name: "Code Refactoring and Optimization",
    description: "Improve existing code quality and performance",
    idealFor: ["Technical debt", "Performance optimization", "Code cleanup"],
    tools: ["cursor", "claude"],
    estimatedTime: "1-3 hours",
    complexity: "advanced",
    steps: [
      {
        order: 1,
        action: "Analyze current code",
        tool: "claude",
        promptTemplate: "Review this code [paste code] for: 1) Performance bottlenecks, 2) Code smells, 3) Repeated patterns, 4) Opportunities for abstraction. Context: [usage patterns, performance requirements].",
        expectedOutcome: "Detailed analysis with specific improvement suggestions",
        tips: [
          "Provide usage context",
          "Mention performance requirements",
          "Ask about trade-offs"
        ]
      },
      {
        order: 2,
        action: "Implement improvements",
        tool: "cursor",
        promptTemplate: "Refactor [file/function] to: 1) [improvement 1 from analysis], 2) [improvement 2], 3) [improvement 3]. Keep: [critical behaviors]. Ensure backward compatibility with [dependent code].",
        expectedOutcome: "Improved code that maintains all functionality",
        tips: [
          "Refactor incrementally",
          "Test after each change",
          "Keep git commits granular"
        ]
      }
    ]
  },
  {
    id: "mvp-sprint",
    name: "MVP Sprint (0 to Deploy)",
    description: "Rapid MVP development from idea to deployment",
    idealFor: ["New projects", "Hackathons", "Quick prototypes"],
    tools: ["claude", "lovable", "cursor"],
    estimatedTime: "4-8 hours",
    complexity: "advanced",
    steps: [
      {
        order: 1,
        action: "Plan MVP scope and architecture",
        tool: "claude",
        promptTemplate: "Help me plan an MVP for [idea]. Target users: [audience]. Core value: [main benefit]. Timeline: [timeframe]. Help me: 1) Define minimal feature set, 2) Choose tech stack, 3) Design data model, 4) Create implementation roadmap.",
        expectedOutcome: "Clear MVP spec with scope and architecture",
        tips: [
          "Be ruthless about scope",
          "Choose familiar technologies",
          "Focus on one core value prop"
        ]
      },
      {
        order: 2,
        action: "Generate project scaffold",
        tool: "lovable",
        promptTemplate: "Create a [stack] app with: 1) Authentication, 2) [core feature], 3) [core feature 2]. Use: [database], [styling]. Include: basic routing, error handling, responsive design.",
        expectedOutcome: "Working scaffold with basic features",
        tips: [
          "Start with proven templates",
          "Include auth from the start",
          "Keep UI simple initially"
        ]
      },
      {
        order: 3,
        action: "Implement core features",
        tool: "cursor",
        promptTemplate: "In my [Lovable-generated] app, build [core feature]: [detailed requirements]. Integrate with existing [auth/database/UI].",
        expectedOutcome: "Core features working end-to-end",
        tips: [
          "Build one feature fully before starting next",
          "Test continuously",
          "Don't perfectionism"
        ]
      },
      {
        order: 4,
        action: "Polish and deploy",
        tool: "cursor",
        promptTemplate: "Prepare for deployment: 1) Add loading states to all async operations, 2) Improve error messages, 3) Add basic SEO metadata, 4) Set up environment variables for [platform]. Fix any console errors/warnings.",
        expectedOutcome: "Production-ready MVP",
        tips: [
          "Test in production-like environment",
          "Set up basic analytics",
          "Prepare rollback plan"
        ]
      }
    ]
  }
];

export const AI_CODE_REVIEW_CHECKLIST: AICodeReviewItem[] = [
  {
    category: "structure",
    checkpoint: "Code Organization",
    questions: [
      "Is the code in the right file/location?",
      "Does it follow the project's folder structure?",
      "Are imports organized and necessary?",
      "Is there unnecessary duplication?"
    ],
    redFlags: [
      "Multiple unrelated concerns in one file",
      "Files over 300 lines",
      "Circular dependencies",
      "Unused imports or dead code"
    ]
  },
  {
    category: "structure",
    checkpoint: "Type Safety",
    questions: [
      "Are all variables and functions properly typed?",
      "Are there any 'any' types that should be specific?",
      "Are interfaces/types reused appropriately?",
      "Are enums used instead of string literals where appropriate?"
    ],
    redFlags: [
      "Excessive use of 'any'",
      "Type assertions without validation",
      "Missing return types on functions",
      "Inconsistent type definitions"
    ]
  },
  {
    category: "logic",
    checkpoint: "Error Handling",
    questions: [
      "Are all async operations wrapped in try-catch?",
      "Are errors logged appropriately?",
      "Are user-facing error messages clear and helpful?",
      "Is there fallback behavior for failures?"
    ],
    redFlags: [
      "Uncaught promise rejections",
      "Generic error messages",
      "Silent failures",
      "No error boundaries in React components"
    ]
  },
  {
    category: "logic",
    checkpoint: "Edge Cases",
    questions: [
      "What happens with empty/null/undefined data?",
      "Are array operations safe (check length)?",
      "Is there validation for user inputs?",
      "What happens if the API fails or times out?"
    ],
    redFlags: [
      "No null checks before accessing properties",
      "Assuming arrays have elements",
      "No input validation",
      "Missing loading/empty states"
    ]
  },
  {
    category: "security",
    checkpoint: "Authentication & Authorization",
    questions: [
      "Are all protected routes/API endpoints checking auth?",
      "Are user IDs/permissions verified server-side?",
      "Is sensitive data excluded from client responses?",
      "Are API keys and secrets in environment variables?"
    ],
    redFlags: [
      "Auth checks only on client-side",
      "Hardcoded credentials",
      "Exposed API keys in code",
      "Trusting client-provided user IDs"
    ]
  },
  {
    category: "security",
    checkpoint: "Data Validation",
    questions: [
      "Is all user input validated and sanitized?",
      "Are SQL queries parameterized (no string concatenation)?",
      "Is there protection against XSS?",
      "Are file uploads validated and limited?"
    ],
    redFlags: [
      "Direct database queries with user input",
      "innerHTML with user-provided content",
      "No file type/size restrictions",
      "Missing CSRF protection"
    ]
  },
  {
    category: "performance",
    checkpoint: "Database & API Efficiency",
    questions: [
      "Are database queries optimized (proper indexes)?",
      "Is there proper pagination for large datasets?",
      "Are N+1 queries avoided?",
      "Is there appropriate caching?"
    ],
    redFlags: [
      "Fetching all records without pagination",
      "Multiple sequential API calls in loops",
      "No database indexes on frequently queried fields",
      "Loading entire objects when only IDs are needed"
    ]
  },
  {
    category: "performance",
    checkpoint: "Frontend Performance",
    questions: [
      "Are large lists virtualized?",
      "Are images optimized and lazy-loaded?",
      "Are expensive calculations memoized?",
      "Is code-splitting used for large bundles?"
    ],
    redFlags: [
      "Rendering 1000+ items without virtualization",
      "Large images without optimization",
      "Expensive calculations in render",
      "Massive bundle sizes"
    ]
  },
  {
    category: "maintainability",
    checkpoint: "Code Clarity",
    questions: [
      "Are variable and function names descriptive?",
      "Is complex logic commented?",
      "Are magic numbers extracted to constants?",
      "Is the code easy to understand without context?"
    ],
    redFlags: [
      "Single-letter variables (except loop counters)",
      "Functions with unclear purposes",
      "Unexplained magic numbers",
      "Complex logic without comments"
    ]
  },
  {
    category: "maintainability",
    checkpoint: "Testing Readiness",
    questions: [
      "Are functions pure and testable?",
      "Are dependencies injected rather than hardcoded?",
      "Is business logic separated from UI?",
      "Are there clear interfaces/contracts?"
    ],
    redFlags: [
      "Functions with side effects everywhere",
      "Tightly coupled code",
      "Business logic in components",
      "Difficult to mock dependencies"
    ]
  }
];

/**
 * Get best practices by category
 */
export function getBestPracticesByCategory(category: VibecodingBestPractice['category']): VibecodingBestPractice[] {
  return VIBECODING_BEST_PRACTICES.filter(bp => bp.category === category);
}

/**
 * Get best practices for a specific tool
 */
export function getBestPracticesForTool(tool: VibecodingTool): VibecodingBestPractice[] {
  return VIBECODING_BEST_PRACTICES.filter(bp => bp.tools.includes(tool));
}

/**
 * Get workflow by complexity level
 */
export function getWorkflowsByComplexity(complexity: VibecodingWorkflow['complexity']): VibecodingWorkflow[] {
  return VIBECODING_WORKFLOWS.filter(wf => wf.complexity === complexity);
}

/**
 * Get recommended workflow for a use case
 */
export function getRecommendedWorkflow(useCase: string): VibecodingWorkflow | null {
  const lowerUseCase = useCase.toLowerCase();
  
  for (const workflow of VIBECODING_WORKFLOWS) {
    if (workflow.idealFor.some(ideal => lowerUseCase.includes(ideal.toLowerCase()))) {
      return workflow;
    }
  }
  
  return null;
}

/**
 * Get code review checklist by category
 */
export function getReviewChecklistByCategory(category: AICodeReviewItem['category']): AICodeReviewItem[] {
  return AI_CODE_REVIEW_CHECKLIST.filter(item => item.category === category);
}

