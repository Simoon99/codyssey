/**
 * Agent Tools - Functions that Helpers can call autonomously
 * 
 * These tools give Helpers agency to:
 * - Save artifacts (documents, code, designs)
 * - Analyze project data
 * - Create and update tasks
 * - Generate structured outputs
 * - Search and retrieve information
 */

import { type HelperType } from "@/lib/types/helpers";

/**
 * Tool definitions for OpenAI function calling
 */
export const AGENT_TOOLS = {
  // Universal tools available to all helpers
  save_artifact: {
    type: "function" as const,
    function: {
      name: "save_artifact",
      description: "Save a document, code snippet, design, or any other artifact for the user. This creates a permanent, downloadable resource they can reference later. Use this when you've created something valuable (problem statement, tech stack doc, wireframe, code, etc.)",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Clear, descriptive title for the artifact (e.g., 'Problem Statement v1', 'Tech Stack Recommendation', 'API Endpoints Spec')",
          },
          content: {
            type: "string",
            description: "The full content of the artifact. Can be markdown, code, JSON, or plain text.",
          },
          type: {
            type: "string",
            enum: ["document", "code", "design", "data", "template"],
            description: "Type of artifact being saved",
          },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Tags to help categorize and find this artifact later",
          },
        },
        required: ["title", "content", "type"],
      },
    },
  },

  analyze_project_data: {
    type: "function" as const,
    function: {
      name: "analyze_project_data",
      description: "Analyze the user's project data to extract insights, identify patterns, or make recommendations. Use this when you need to deeply understand their progress, blockers, or opportunities.",
      parameters: {
        type: "object",
        properties: {
          analysis_type: {
            type: "string",
            enum: ["progress", "blockers", "priorities", "gaps", "metrics"],
            description: "What aspect to analyze",
          },
          focus_area: {
            type: "string",
            description: "Specific area to focus on (e.g., 'onboarding flow', 'tech stack risks', 'marketing strategy')",
          },
        },
        required: ["analysis_type"],
      },
    },
  },

  create_task: {
    type: "function" as const,
    function: {
      name: "create_task",
      description: "Create a new task for the user based on the conversation. Use this when you've identified a specific action item they should complete.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Clear, actionable task title (start with verb: 'Write...', 'Create...', 'Research...')",
          },
          description: {
            type: "string",
            description: "Detailed description of what needs to be done and why",
          },
          priority: {
            type: "string",
            enum: ["high", "medium", "low"],
            description: "Task priority",
          },
          estimated_hours: {
            type: "number",
            description: "Estimated hours to complete",
          },
        },
        required: ["title", "description"],
      },
    },
  },

  update_task_status: {
    type: "function" as const,
    function: {
      name: "update_task_status",
      description: "Update the status of an existing task when the user reports progress or completion",
      parameters: {
        type: "object",
        properties: {
          task_id: {
            type: "string",
            description: "ID of the task to update",
          },
          status: {
            type: "string",
            enum: ["todo", "in_progress", "done"],
            description: "New status for the task",
          },
          notes: {
            type: "string",
            description: "Optional notes about the progress or completion",
          },
        },
        required: ["task_id", "status"],
      },
    },
  },

  schedule_reminder: {
    type: "function" as const,
    function: {
      name: "schedule_reminder",
      description: "Schedule a reminder for the user to follow up on something important",
      parameters: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "What to remind them about",
          },
          days_from_now: {
            type: "number",
            description: "Number of days in the future to send reminder",
          },
        },
        required: ["message", "days_from_now"],
      },
    },
  },

  generate_template: {
    type: "function" as const,
    function: {
      name: "generate_template",
      description: "Generate a structured template or framework for common tasks (user interview script, launch checklist, etc.)",
      parameters: {
        type: "object",
        properties: {
          template_type: {
            type: "string",
            description: "Type of template to generate (e.g., 'interview_script', 'launch_checklist', 'pitch_deck_outline')",
          },
          context: {
            type: "string",
            description: "Relevant context to customize the template for this user's specific situation",
          },
        },
        required: ["template_type"],
      },
    },
  },

  search_resources: {
    type: "function" as const,
    function: {
      name: "search_resources",
      description: "Search for relevant resources, tools, or examples that could help the user",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "What to search for (e.g., 'Next.js auth libraries', 'SaaS pricing examples', 'competitor analysis tools')",
          },
          category: {
            type: "string",
            enum: ["tools", "examples", "tutorials", "templates"],
            description: "Category of resources to search",
          },
        },
        required: ["query"],
      },
    },
  },

  web_search: {
    type: "function" as const,
    function: {
      name: "web_search",
      description: "Search the web for real-time information, current trends, documentation, examples, or any information not in your training data. Use this when you need recent information or want to find the latest best practices.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query (e.g., 'latest Next.js 15 features', 'how to implement Stripe payments in 2024', 'best React state management 2024')",
          },
          num_results: {
            type: "number",
            description: "Number of search results to return (default: 5, max: 10)",
          },
        },
        required: ["query"],
      },
    },
  },

  // Vibecoding-specific tools for 10x Vibecoders
  generate_ai_prompt: {
    type: "function" as const,
    function: {
      name: "generate_ai_prompt",
      description: "Generate an optimized prompt for AI coding tools (Cursor, Lovable, Bolt, v0, Claude). Analyzes requirements and creates a comprehensive prompt that follows best practices for maximum code quality.",
      parameters: {
        type: "object",
        properties: {
          feature_description: {
            type: "string",
            description: "What the user wants to build",
          },
          target_tool: {
            type: "string",
            enum: ["cursor", "lovable", "bolt", "v0", "claude", "chatgpt"],
            description: "Which AI tool this prompt is for",
          },
          tech_stack: {
            type: "string",
            description: "Tech stack being used (e.g., 'Next.js 14, TypeScript, Supabase, Tailwind')",
          },
          context: {
            type: "string",
            description: "Additional context about the project, existing code, or constraints",
          },
        },
        required: ["feature_description", "target_tool"],
      },
    },
  },

  analyze_prompt_quality: {
    type: "function" as const,
    function: {
      name: "analyze_prompt_quality",
      description: "Analyze the quality of a user's AI prompt and provide detailed feedback with a score (0-100) and improvement suggestions. Use this to help users craft better prompts.",
      parameters: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "The prompt to analyze",
          },
          target_tool: {
            type: "string",
            enum: ["cursor", "lovable", "bolt", "v0", "claude", "chatgpt"],
            description: "Which AI tool the prompt is intended for",
          },
        },
        required: ["prompt", "target_tool"],
      },
    },
  },

  suggest_vibecoding_approach: {
    type: "function" as const,
    function: {
      name: "suggest_vibecoding_approach",
      description: "Recommend the best vibecoding workflow and tools for implementing a specific feature. Suggests whether to use Cursor for iteration, Bolt/Lovable for new features, v0 for UI, etc.",
      parameters: {
        type: "object",
        properties: {
          feature_type: {
            type: "string",
            description: "What they want to build (e.g., 'authentication flow', 'dashboard UI', 'REST API', 'landing page')",
          },
          is_new_feature: {
            type: "boolean",
            description: "Whether this is a new feature from scratch or modifying existing code",
          },
          complexity: {
            type: "string",
            enum: ["simple", "moderate", "complex"],
            description: "Estimated complexity of the feature",
          },
          time_constraint: {
            type: "string",
            description: "Timeline or urgency (e.g., '2 hours', '1 day', '1 week')",
          },
        },
        required: ["feature_type", "is_new_feature"],
      },
    },
  },

  validate_ai_output: {
    type: "function" as const,
    function: {
      name: "validate_ai_output",
      description: "Review AI-generated code for common issues: security vulnerabilities, performance problems, missing error handling, edge cases, type safety. Provides a checklist-based review.",
      parameters: {
        type: "object",
        properties: {
          code_description: {
            type: "string",
            description: "What the AI-generated code does",
          },
          code_type: {
            type: "string",
            enum: ["component", "api", "function", "page", "hook", "util"],
            description: "Type of code to review",
          },
          concerns: {
            type: "array",
            items: { type: "string" },
            description: "Specific areas of concern to focus on (e.g., ['security', 'performance', 'error handling'])",
          },
        },
        required: ["code_description", "code_type"],
      },
    },
  },

  recommend_tool_stack: {
    type: "function" as const,
    function: {
      name: "recommend_tool_stack",
      description: "Recommend the optimal combination of AI coding tools for a specific project or workflow. Helps users understand when to use each tool in their vibecoding process.",
      parameters: {
        type: "object",
        properties: {
          project_type: {
            type: "string",
            description: "Type of project (e.g., 'SaaS MVP', 'landing page', 'mobile app', 'API service')",
          },
          experience_level: {
            type: "string",
            enum: ["beginner", "intermediate", "advanced"],
            description: "User's coding experience level",
          },
          priorities: {
            type: "array",
            items: { type: "string" },
            description: "What matters most (e.g., ['speed', 'quality', 'learning', 'customization'])",
          },
        },
        required: ["project_type"],
      },
    },
  },

  save_vibecoding_pattern: {
    type: "function" as const,
    function: {
      name: "save_vibecoding_pattern",
      description: "Save a successful vibecoding pattern (prompt + result) for future reference. Helps users build a library of what works.",
      parameters: {
        type: "object",
        properties: {
          pattern_name: {
            type: "string",
            description: "Name for this pattern (e.g., 'Supabase Auth Setup', 'Responsive Card Grid')",
          },
          prompt_used: {
            type: "string",
            description: "The prompt that generated good results",
          },
          tool_used: {
            type: "string",
            enum: ["cursor", "lovable", "bolt", "v0", "claude", "chatgpt"],
            description: "Which tool was used",
          },
          outcome: {
            type: "string",
            description: "What was successfully created",
          },
          tips: {
            type: "array",
            items: { type: "string" },
            description: "Key learnings or tips for reusing this pattern",
          },
        },
        required: ["pattern_name", "prompt_used", "tool_used", "outcome"],
      },
    },
  },

  estimate_vibecoding_time: {
    type: "function" as const,
    function: {
      name: "estimate_vibecoding_time",
      description: "Estimate how long it will take to build a feature using vibecoding tools vs traditional coding. Helps set realistic expectations.",
      parameters: {
        type: "object",
        properties: {
          feature_description: {
            type: "string",
            description: "What needs to be built",
          },
          scope: {
            type: "string",
            enum: ["minimal", "standard", "comprehensive"],
            description: "How complete the implementation should be",
          },
          includes_testing: {
            type: "boolean",
            description: "Whether testing is included in estimate",
          },
        },
        required: ["feature_description", "scope"],
      },
    },
  },

  get_vibecoding_workflow: {
    type: "function" as const,
    function: {
      name: "get_vibecoding_workflow",
      description: "Get a step-by-step vibecoding workflow for common scenarios (MVP sprint, feature development, refactoring, debugging). Provides detailed prompts for each step.",
      parameters: {
        type: "object",
        properties: {
          workflow_type: {
            type: "string",
            enum: ["mvp_sprint", "new_feature", "rapid_ui", "debug_fix", "refactor", "api_development"],
            description: "Type of workflow needed",
          },
          context: {
            type: "string",
            description: "Specific context or customization needed",
          },
        },
        required: ["workflow_type"],
      },
    },
  },
};

/**
 * Helper-specific tool configurations
 * Each helper has access to tools relevant to their expertise
 */
/**
 * Vibecoding Journey: 0 → 1 and Beyond
 * 
 * Each helper maintains their unique niche while teaching vibecoding for their domain:
 * 1. Muse: "What can I build with AI tools?" (Ideation)
 * 2. Architect: "How do I architect for AI?" (Planning)
 * 3. Crafter: "How do I design with v0/Lovable?" (Design)
 * 4. Hacker: "How do I code 5x faster?" (Implementation) - MOST COMPREHENSIVE
 * 5. Hypebeast: Traditional marketing focus
 * 6. Sensei: "How do I optimize my AI workflow?" (Scaling)
 */
export const HELPER_TOOL_CONFIGS: Record<HelperType, string[]> = {
  // STAGE 1: IDEATION - "What should I build with vibecoding?"
  muse: [
    // Only essential tools for fast responses
    "web_search", // Latest market trends, recent competitor launches
    // Disabled for speed: save_artifact, create_task, analyze_project_data
  ],
  
  // STAGE 2: ARCHITECTURE - "How do I design for AI-native development?"
  architect: [
    // Core tools
    "save_artifact", // Tech stack docs, architecture diagrams
    "analyze_project_data", // Tech risk analysis
    "create_task",
    "update_task_status",
    "generate_template", // API specs, data models
    "search_resources", // Tech tools and frameworks
    "web_search", // Latest framework releases, security best practices, documentation
    
    // Vibecoding tools (Architecture focus)
    "generate_ai_prompt", // Generate prompts for TECHNICAL implementations (backend, APIs, DB)
    "suggest_vibecoding_approach", // "Should I use Cursor or Bolt for this backend work?"
    "validate_ai_output", // Review AI-generated technical code
    // No analyze_prompt_quality - that's for Hacker during implementation
    // No save_pattern - that's for after building (Hacker)
  ],
  
  // STAGE 3: DESIGN - "How do I create perfect UI prompts for v0/Lovable?"
  crafter: [
    // Core tools
    "save_artifact", // Design systems, wireframes, copy
    "analyze_project_data", // UX flow analysis
    "create_task",
    "generate_template", // Design checklists, style guides
    "search_resources", // Design inspiration, UI patterns
    
    // Vibecoding tools (UI/UX focus)
    "generate_ai_prompt", // Generate prompts for UI/UX (v0, Lovable specific)
    "analyze_prompt_quality", // Analyze UI prompts ONLY
    "save_vibecoding_pattern", // Save successful DESIGN patterns
    // suggest_vibecoding_approach removed - Architect handles tool choices
    // No code validation - Crafter doesn't review code
  ],
  
  // STAGE 4: IMPLEMENTATION - "Master AI coding for 5x speed" (MOST COMPREHENSIVE)
  hacker: [
    // Core tools
    "save_artifact", // Code snippets, deployment guides
    "analyze_project_data", // Code quality, bottlenecks
    "create_task",
    "update_task_status",
    "generate_template", // Setup scripts, testing templates
    "search_resources", // Dev tools, libraries
    "web_search", // Latest library docs, code patterns, debugging solutions
    
    // ALL vibecoding tools (Implementation mastery)
    "analyze_prompt_quality", // Analyze CODING prompts in real-time
    "generate_ai_prompt", // Generate optimized CODING prompts
    "suggest_vibecoding_approach", // "Should I use Cursor for this refactor or Bolt?"
    "validate_ai_output", // Review ALL AI-generated code
    "save_vibecoding_pattern", // Save successful CODE patterns
    "estimate_vibecoding_time", // Estimate feature implementation time
    "get_vibecoding_workflow", // Get step-by-step coding workflows
    // This is THE vibecoding power user
  ],
  
  // STAGE 5: LAUNCH - Traditional marketing focus (minimal vibecoding)
  hypebeast: [
    // Core tools
    "save_artifact", // Launch content, marketing copy
    "analyze_project_data", // Launch readiness
    "create_task",
    "generate_template", // Launch checklists, content calendars
    "schedule_reminder", // Launch day reminders
    "search_resources", // Marketing channels, growth tools
    
    // No vibecoding tools - stays focused on marketing expertise
    // Users should have learned vibecoding by this stage
  ],
  
  // STAGE 6: GROWTH - "How do I optimize and scale with AI?"
  sensei: [
    // Core tools
    "save_artifact", // Growth strategies, experiment plans
    "analyze_project_data", // Metrics and growth opportunities
    "create_task",
    "schedule_reminder", // Follow-up on experiments
    "generate_template", // Experiment frameworks, metric dashboards
    "search_resources", // Growth tactics, case studies
    "web_search", // Latest optimization techniques, performance best practices, case studies
    
    // Vibecoding tools (Optimization focus)
    "save_vibecoding_pattern", // Save successful GROWTH patterns
    "get_vibecoding_workflow", // Get workflows for scaling
    "validate_ai_output", // Review code for performance optimization
    // No prompt generation - not building new, optimizing existing
    // No recommend_tool_stack - already established
  ],
};

/**
 * Get tools for a specific helper
 */
export function getHelperTools(helper: HelperType) {
  const toolNames = HELPER_TOOL_CONFIGS[helper];
  return toolNames.map(name => AGENT_TOOLS[name as keyof typeof AGENT_TOOLS]);
}

/**
 * Tool execution handlers
 * These actually perform the actions when tools are called
 */
export async function executeToolCall(
  toolName: string,
  args: Record<string, any>,
  context: {
    projectId: string;
    userId: string;
    helper: HelperType;
  }
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    switch (toolName) {
      case "save_artifact":
        return await saveArtifact(args, context);
      
      case "analyze_project_data":
        return await analyzeProjectData(args, context);
      
      case "create_task":
        return await createTask(args, context);
      
      case "update_task_status":
        return await updateTaskStatus(args, context);
      
      case "schedule_reminder":
        return await scheduleReminder(args, context);
      
      case "generate_template":
        return await generateTemplate(args, context);
      
      case "search_resources":
        return await searchResources(args, context);
      
      case "web_search":
        return await searchWeb(args, context);
      
      // Vibecoding tools
      case "generate_ai_prompt":
        return await generateAiPrompt(args, context);
      
      case "analyze_prompt_quality":
        return await analyzePromptQualityTool(args, context);
      
      case "suggest_vibecoding_approach":
        return await suggestVibecodingApproach(args, context);
      
      case "validate_ai_output":
        return await validateAiOutput(args, context);
      
      case "recommend_tool_stack":
        return await recommendToolStack(args, context);
      
      case "save_vibecoding_pattern":
        return await saveVibecodingPattern(args, context);
      
      case "estimate_vibecoding_time":
        return await estimateVibecodingTime(args, context);
      
      case "get_vibecoding_workflow":
        return await getVibecodingWorkflow(args, context);
      
      default:
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    console.error(`Tool execution error (${toolName}):`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Individual tool implementations
 */

async function saveArtifact(
  args: { title: string; content: string; type: string; tags?: string[] },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  // TODO: Save to database
  // For now, return success to demonstrate the pattern
  return {
    success: true,
    data: {
      artifact_id: `artifact_${Date.now()}`,
      title: args.title,
      type: args.type,
      saved_at: new Date().toISOString(),
    },
  };
}

async function analyzeProjectData(
  args: { analysis_type: string; focus_area?: string },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  // TODO: Implement actual analysis by querying project data
  return {
    success: true,
    data: {
      analysis_type: args.analysis_type,
      insights: ["Sample insight 1", "Sample insight 2"],
      recommendations: ["Sample recommendation"],
    },
  };
}

async function createTask(
  args: { title: string; description: string; priority?: string; estimated_hours?: number },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  // TODO: Save task to database
  return {
    success: true,
    data: {
      task_id: `task_${Date.now()}`,
      title: args.title,
      created_by: context.helper,
      created_at: new Date().toISOString(),
    },
  };
}

async function updateTaskStatus(
  args: { task_id: string; status: string; notes?: string },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  // TODO: Update task in database
  return {
    success: true,
    data: {
      task_id: args.task_id,
      new_status: args.status,
      updated_at: new Date().toISOString(),
    },
  };
}

async function scheduleReminder(
  args: { message: string; days_from_now: number },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  // TODO: Schedule reminder (could use a job queue)
  return {
    success: true,
    data: {
      reminder_id: `reminder_${Date.now()}`,
      scheduled_for: new Date(Date.now() + args.days_from_now * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
}

async function generateTemplate(
  args: { template_type: string; context?: string },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  // Template generation happens in the AI response, this just logs it
  return {
    success: true,
    data: {
      template_type: args.template_type,
      generated: true,
    },
  };
}

async function searchResources(
  args: { query: string; category?: string },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  // TODO: Implement actual resource search (could use embeddings, web search API, etc.)
  return {
    success: true,
    data: {
      query: args.query,
      results: [
        { title: "Sample Resource 1", url: "https://example.com/1" },
        { title: "Sample Resource 2", url: "https://example.com/2" },
      ],
    },
  };
}

async function searchWeb(
  args: { query: string; num_results?: number },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  const numResults = Math.min(args.num_results || 5, 10); // Max 10 results
  
  try {
    console.log(`[searchWeb] Searching for: "${args.query}"`);
    
    // Try Brave Search API if key is available (2000 free/month)
    if (process.env.BRAVE_SEARCH_API_KEY) {
      console.log(`[searchWeb] Using Brave Search API`);
      const response = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(args.query)}&count=${numResults}`,
        {
          headers: {
            'Accept': 'application/json',
            'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json() as any;
        const results = (data.web?.results || []).map((r: any) => ({
          title: r.title || "Untitled",
          url: r.url,
          snippet: r.description || "No description available",
          // Extract domain from URL for display
          domain: new URL(r.url).hostname.replace('www.', ''),
          // Try to get publication date if available
          date: r.meta_url?.date || null,
        }));
        
        console.log(`[searchWeb] Brave found ${results.length} results`);
        
        return {
          success: true,
          data: {
            query: args.query,
            results,
            source: "Brave Search",
            total_results: results.length,
            // Include formatted results for UI display
            formatted_results: results.map(r => `${r.title}\n${r.snippet}\nSource: ${r.domain}\nURL: ${r.url}`).join('\n\n'),
          },
        };
      }
    }
    
    // Fallback: Use a simple HTML scraping approach for real-time info
    // Search for the query on a simple search engine
    console.log(`[searchWeb] Using fallback: returning synthesized search context`);
    
    // For now, return a "search unavailable" message that tells the AI to use its knowledge
    // This is better than returning nothing
    return {
      success: true,
      data: {
        query: args.query,
        results: [],
        source: "Fallback",
        total_results: 0,
        message: "Web search API not configured. Using AI knowledge base instead. For real-time web results, add BRAVE_SEARCH_API_KEY to your .env file.",
      },
    };
    
  } catch (error) {
    console.error("[searchWeb] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    // Return empty results but success=true so AI can still respond
    return {
      success: true,
      data: {
        query: args.query,
        results: [],
        source: "Error fallback",
        total_results: 0,
        message: `Search unavailable: ${errorMessage}. Using AI knowledge base instead.`,
      },
    };
  }
}

/**
 * Vibecoding Tool Implementations
 */

async function generateAiPrompt(
  args: { feature_description: string; target_tool: string; tech_stack?: string; context?: string },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  const { generateVibecodingPrompt } = await import("@/lib/prompt-generator");
  const { VIBECODING_BEST_PRACTICES, getBestPracticesForTool } = await import("@/lib/vibecoding-intelligence");
  
  const tool = args.target_tool as any;
  const bestPractices = getBestPracticesForTool(tool);
  
  // Build structured prompt
  let prompt = "";
  
  // Add tech stack context if provided
  if (args.tech_stack) {
    prompt += `Tech Stack: ${args.tech_stack}\n\n`;
  }
  
  // Add project context if provided
  if (args.context) {
    prompt += `Context: ${args.context}\n\n`;
  }
  
  // Add feature description
  prompt += `Feature to Build:\n${args.feature_description}\n\n`;
  
  // Add best practice tips for the target tool
  if (bestPractices.length > 0) {
    prompt += `Best Practices for ${tool}:\n`;
    bestPractices.slice(0, 3).forEach((bp) => {
      prompt += `- ${bp.title}: ${bp.description}\n`;
    });
    prompt += "\n";
  }
  
  // Add structure based on tool
  if (tool === "cursor") {
    prompt += `Requirements:\n1. [Specify exact files to modify]\n2. [Describe expected changes]\n3. [List edge cases to handle]\n4. [Specify error handling]\n\nExpected Outcome: [What success looks like]`;
  } else if (tool === "bolt" || tool === "lovable") {
    prompt += `Requirements:\n1. [User flow description]\n2. [UI/UX specifications]\n3. [Data structure needed]\n4. [API endpoints required]\n5. [Error states and validations]\n\nDesign Notes: [Visual/styling requirements]`;
  } else if (tool === "v0") {
    prompt += `Component Requirements:\n1. [Visual description]\n2. [Interactive behaviors]\n3. [Responsive behavior]\n4. [States: default, hover, active, disabled]\n5. [Accessibility requirements]\n\nStyling: [Colors, spacing, animations]`;
  }
  
  return {
    success: true,
    data: {
      prompt,
      target_tool: tool,
      tips: bestPractices.slice(0, 3).map(bp => bp.title),
    },
  };
}

async function analyzePromptQualityTool(
  args: { prompt: string; target_tool: string },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  const { analyzePromptQuality } = await import("@/lib/prompt-analyzer");
  
  const analysis = analyzePromptQuality(args.prompt, args.target_tool as any);
  
  return {
    success: true,
    data: analysis,
  };
}

async function suggestVibecodingApproach(
  args: { feature_type: string; is_new_feature: boolean; complexity?: string; time_constraint?: string },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  const { getRecommendedWorkflow } = await import("@/lib/vibecoding-intelligence");
  
  // Determine recommended tool based on feature type and context
  let recommendedTool = "cursor";
  let workflow = "incremental";
  let reasoning = "";
  
  if (args.is_new_feature) {
    if (args.feature_type.includes("ui") || args.feature_type.includes("component") || args.feature_type.includes("design")) {
      recommendedTool = "v0";
      workflow = "ui_first";
      reasoning = "v0 excels at creating beautiful UI components from scratch with responsive design.";
    } else if (args.feature_type.includes("landing") || args.feature_type.includes("marketing")) {
      recommendedTool = "lovable";
      workflow = "rapid_prototype";
      reasoning = "Lovable is perfect for quickly generating complete landing pages with modern designs.";
    } else if (args.complexity === "complex" || args.feature_type.includes("full") || args.feature_type.includes("complete")) {
      recommendedTool = "bolt";
      workflow = "feature_scaffold";
      reasoning = "Bolt can generate complete features with backend + frontend from scratch.";
    } else {
      recommendedTool = "lovable";
      workflow = "rapid_prototype";
      reasoning = "Lovable is great for new features - provides complete, working code quickly.";
    }
  } else {
    recommendedTool = "cursor";
    workflow = "incremental";
    reasoning = "Cursor is ideal for modifying existing code - it understands your codebase context.";
  }
  
  // Get matching workflow if available
  const workflowData = getRecommendedWorkflow(args.feature_type);
  
  return {
    success: true,
    data: {
      recommended_tool: recommendedTool,
      workflow,
      reasoning,
      workflow_details: workflowData,
      additional_tips: [
        args.time_constraint?.includes("hour") || args.time_constraint?.includes("quick") 
          ? "For speed, use Bolt/Lovable to generate complete features quickly"
          : "Take time to provide detailed context for better results",
        args.complexity === "complex" 
          ? "Break complex features into smaller pieces - build incrementally"
          : "Simple features can be built in one prompt with good specifications",
      ],
    },
  };
}

async function validateAiOutput(
  args: { code_description: string; code_type: string; concerns?: string[] },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  const { AI_CODE_REVIEW_CHECKLIST, getReviewChecklistByCategory } = await import("@/lib/vibecoding-intelligence");
  
  // Get relevant checklist items based on code type and concerns
  const allCategories: Array<"structure" | "logic" | "security" | "performance" | "maintainability"> = 
    ["structure", "logic", "security", "performance", "maintainability"];
  
  const priorityCategories = args.concerns 
    ? allCategories.filter(cat => args.concerns!.some(concern => concern.toLowerCase().includes(cat)))
    : allCategories;
  
  const checklistItems = priorityCategories.flatMap(cat => getReviewChecklistByCategory(cat));
  
  return {
    success: true,
    data: {
      code_type: args.code_type,
      checklist: checklistItems,
      priority_checks: priorityCategories,
      instructions: "Review your AI-generated code against these checkpoints. Pay special attention to red flags.",
    },
  };
}

async function recommendToolStack(
  args: { project_type: string; experience_level?: string; priorities?: string[] },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  let recommendations: any = {
    primary_tool: "",
    supporting_tools: [],
    workflow_description: "",
    learning_path: [],
  };
  
  const projectLower = args.project_type.toLowerCase();
  const priorities = args.priorities || [];
  const experience = args.experience_level || "intermediate";
  
  // Determine primary tool based on project type
  if (projectLower.includes("mvp") || projectLower.includes("saas")) {
    recommendations.primary_tool = "lovable";
    recommendations.supporting_tools = ["cursor", "v0", "claude"];
    recommendations.workflow_description = "Use Lovable for initial scaffold + core features, Cursor for refinements, v0 for polished UI components, Claude for architecture planning.";
  } else if (projectLower.includes("landing") || projectLower.includes("marketing")) {
    recommendations.primary_tool = "lovable";
    recommendations.supporting_tools = ["v0"];
    recommendations.workflow_description = "Lovable for complete landing page, v0 for custom components and sections.";
  } else if (projectLower.includes("ui") || projectLower.includes("design system")) {
    recommendations.primary_tool = "v0";
    recommendations.supporting_tools = ["cursor", "lovable"];
    recommendations.workflow_description = "v0 for component design, Cursor to integrate into codebase, Lovable for complete pages.";
  } else if (projectLower.includes("api") || projectLower.includes("backend")) {
    recommendations.primary_tool = "cursor";
    recommendations.supporting_tools = ["claude"];
    recommendations.workflow_description = "Claude for API design, Cursor to implement with codebase context.";
  } else {
    recommendations.primary_tool = "cursor";
    recommendations.supporting_tools = ["bolt", "claude"];
    recommendations.workflow_description = "Cursor for existing code work, Bolt for new features, Claude for planning.";
  }
  
  // Adjust for experience level
  if (experience === "beginner") {
    recommendations.learning_path = [
      "Start with Lovable/Bolt - they handle full setup and configuration",
      "Learn to write specific prompts with examples",
      "Graduate to Cursor once comfortable reading and modifying code",
    ];
  } else if (experience === "advanced") {
    recommendations.learning_path = [
      "Use Cursor for maximum control and integration",
      "Leverage Claude for complex architecture decisions",
      "Use Bolt/Lovable for rapid prototyping only",
    ];
  }
  
  // Adjust for priorities
  if (priorities.includes("speed")) {
    recommendations.speed_tips = "Use Bolt/Lovable with comprehensive prompts - get 80% done in first generation";
  }
  if (priorities.includes("quality")) {
    recommendations.quality_tips = "Start with Claude for planning, use Cursor for implementation with your patterns";
  }
  
  return {
    success: true,
    data: recommendations,
  };
}

async function saveVibecodingPattern(
  args: { pattern_name: string; prompt_used: string; tool_used: string; outcome: string; tips?: string[] },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  // TODO: Save to database as a reusable pattern
  return {
    success: true,
    data: {
      pattern_id: `pattern_${Date.now()}`,
      pattern_name: args.pattern_name,
      tool: args.tool_used,
      saved_at: new Date().toISOString(),
      reusable: true,
    },
  };
}

async function estimateVibecodingTime(
  args: { feature_description: string; scope: string; includes_testing?: boolean },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  // Base estimates in hours
  const baseEstimates: Record<string, { min: number; max: number }> = {
    minimal: { min: 0.5, max: 2 },
    standard: { min: 2, max: 6 },
    comprehensive: { min: 6, max: 16 },
  };
  
  const estimate = baseEstimates[args.scope] || baseEstimates.standard;
  
  // Adjust for testing
  if (args.includes_testing) {
    estimate.min *= 1.3;
    estimate.max *= 1.5;
  }
  
  // Compare to traditional coding (estimated 3-5x faster with AI)
  const traditional = {
    min: estimate.min * 3,
    max: estimate.max * 5,
  };
  
  return {
    success: true,
    data: {
      scope: args.scope,
      vibecoding_hours: `${estimate.min}-${estimate.max} hours`,
      traditional_hours: `${traditional.min}-${traditional.max} hours`,
      speedup: "3-5x faster with vibecoding",
      breakdown: {
        planning: "10-15 min (Claude for architecture)",
        implementation: `${estimate.min * 0.6}-${estimate.max * 0.6} hours (Cursor/Bolt)`,
        refinement: `${estimate.min * 0.3}-${estimate.max * 0.3} hours (iterations)`,
        testing: args.includes_testing ? `${estimate.min * 0.3}-${estimate.max * 0.3} hours` : "Not included",
      },
    },
  };
}

async function getVibecodingWorkflow(
  args: { workflow_type: string; context?: string },
  context: { projectId: string; userId: string; helper: HelperType }
) {
  const { VIBECODING_WORKFLOWS } = await import("@/lib/vibecoding-intelligence");
  
  // Map workflow type to workflow ID
  const workflowMap: Record<string, string> = {
    mvp_sprint: "mvp-sprint",
    new_feature: "new-feature-full-stack",
    rapid_ui: "rapid-ui-component",
    debug_fix: "debug-and-fix",
    refactor: "refactor-improve",
    api_development: "new-feature-full-stack",
  };
  
  const workflowId = workflowMap[args.workflow_type];
  const workflow = VIBECODING_WORKFLOWS.find(w => w.id === workflowId);
  
  if (!workflow) {
    return {
      success: false,
      error: `Workflow not found: ${args.workflow_type}`,
    };
  }
  
  return {
    success: true,
    data: workflow,
  };
}

