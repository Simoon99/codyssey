/**
 * Prompt Quality Analyzer
 * 
 * Analyzes and scores user prompts for AI coding tools,
 * providing real-time feedback and improvement suggestions.
 */

import { VibecodingTool } from "./vibecoding-intelligence";

export interface PromptAnalysis {
  overallScore: number; // 0-100
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  scores: {
    context: ComponentScore;
    specificity: ComponentScore;
    structure: ComponentScore;
    toolOptimization: ComponentScore;
  };
  strengths: string[];
  improvements: ImprovementSuggestion[];
  improvedPrompt?: string;
  estimatedQuality: "Excellent" | "Good" | "Fair" | "Poor";
}

export interface ComponentScore {
  score: number; // 0-100
  weight: number;
  feedback: string;
  details: string[];
}

export interface ImprovementSuggestion {
  priority: "high" | "medium" | "low";
  category: "context" | "specificity" | "structure" | "tool";
  issue: string;
  suggestion: string;
  example?: string;
}

/**
 * Main function to analyze prompt quality
 */
export function analyzePromptQuality(
  prompt: string,
  tool: VibecodingTool = "cursor",
  projectContext?: {
    hasFiles?: boolean;
    techStack?: string[];
    currentTask?: string;
  }
): PromptAnalysis {
  // Analyze each component
  const contextScore = analyzeContext(prompt, projectContext);
  const specificityScore = analyzeSpecificity(prompt);
  const structureScore = analyzeStructure(prompt);
  const toolOptimizationScore = analyzeToolOptimization(prompt, tool);

  // Calculate weighted overall score
  const overallScore = Math.round(
    contextScore.score * contextScore.weight +
    specificityScore.score * specificityScore.weight +
    structureScore.score * structureScore.weight +
    toolOptimizationScore.score * toolOptimizationScore.weight
  );

  // Determine grade
  const grade = getGrade(overallScore);

  // Collect strengths and improvements
  const { strengths, improvements } = collectFeedback({
    context: contextScore,
    specificity: specificityScore,
    structure: structureScore,
    toolOptimization: toolOptimizationScore
  });

  // Generate improved prompt if score is below 80
  const improvedPrompt = overallScore < 80 ? generateImprovedPrompt(prompt, improvements) : undefined;

  // Determine estimated quality
  const estimatedQuality = getEstimatedQuality(overallScore);

  return {
    overallScore,
    grade,
    scores: {
      context: contextScore,
      specificity: specificityScore,
      structure: structureScore,
      toolOptimization: toolOptimizationScore
    },
    strengths,
    improvements,
    improvedPrompt,
    estimatedQuality
  };
}

/**
 * Analyze context quality
 */
function analyzeContext(
  prompt: string,
  projectContext?: {
    hasFiles?: boolean;
    techStack?: string[];
    currentTask?: string;
  }
): ComponentScore {
  let score = 0;
  const details: string[] = [];
  const maxScore = 100;

  // Check for tech stack mentions (25 points)
  const techStackKeywords = [
    'next.js', 'react', 'typescript', 'javascript', 'node', 'express',
    'supabase', 'postgres', 'mongodb', 'tailwind', 'shadcn', 'prisma',
    'vue', 'angular', 'python', 'django', 'flask', 'ruby', 'rails'
  ];
  const mentionsTechStack = techStackKeywords.some(tech => 
    prompt.toLowerCase().includes(tech)
  );
  if (mentionsTechStack) {
    score += 25;
    details.push("✓ Mentions tech stack or framework");
  } else {
    details.push("✗ No tech stack mentioned");
  }

  // Check for file/location references (25 points)
  const filePatterns = [
    /\w+\.(ts|tsx|js|jsx|py|rb|go|java)/gi,
    /\/[\w-]+\/[\w-]+/g, // path patterns
    /in the [\w-]+ (file|component|module)/i,
    /from [\w/.-]+/i
  ];
  const hasFileReferences = filePatterns.some(pattern => pattern.test(prompt));
  if (hasFileReferences) {
    score += 25;
    details.push("✓ References specific files or locations");
  } else {
    details.push("✗ No file or location references");
  }

  // Check for existing code context (20 points)
  const contextKeywords = [
    'current', 'existing', 'already have', 'using', 'based on',
    'similar to', 'following', 'pattern from', 'like in'
  ];
  const providesContext = contextKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  );
  if (providesContext) {
    score += 20;
    details.push("✓ References existing code or patterns");
  } else {
    details.push("✗ Doesn't reference existing code");
  }

  // Check for project state/constraints (15 points)
  const stateKeywords = [
    'need to', 'want to', 'should', 'must', 'can\'t', 'constraint',
    'requirement', 'integrate with', 'compatible with'
  ];
  const mentionsState = stateKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  );
  if (mentionsState) {
    score += 15;
    details.push("✓ Describes requirements or constraints");
  } else {
    details.push("✗ No requirements or constraints mentioned");
  }

  // Check for data/type context (15 points)
  const dataKeywords = [
    'data structure', 'type', 'interface', 'model', 'schema',
    'object with', 'array of', 'fields:', 'properties:'
  ];
  const mentionsData = dataKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  );
  if (mentionsData) {
    score += 15;
    details.push("✓ Describes data structures or types");
  } else {
    details.push("✗ No data structure information");
  }

  const feedback = generateContextFeedback(score);

  return {
    score,
    weight: 0.30, // 30% of overall score
    feedback,
    details
  };
}

/**
 * Analyze specificity quality
 */
function analyzeSpecificity(prompt: string): ComponentScore {
  let score = 0;
  const details: string[] = [];

  // Check for specific actions/outcomes (30 points)
  const actionVerbs = [
    'create', 'add', 'update', 'delete', 'fix', 'refactor',
    'implement', 'build', 'generate', 'modify', 'remove'
  ];
  const hasAction = actionVerbs.some(verb => 
    prompt.toLowerCase().includes(verb)
  );
  if (hasAction) {
    score += 30;
    details.push("✓ Contains specific action verbs");
  } else {
    details.push("✗ Lacks clear action verbs");
  }

  // Check for detailed requirements (25 points)
  const hasNumberedList = /\d+[.)]/g.test(prompt);
  const hasBulletPoints = /[-•*]\s/g.test(prompt);
  const hasMultipleRequirements = prompt.split(/[,;]/).length >= 3;
  
  if (hasNumberedList || hasBulletPoints || hasMultipleRequirements) {
    score += 25;
    details.push("✓ Multiple specific requirements listed");
  } else {
    details.push("✗ Single vague requirement");
  }

  // Check for UI/UX specifics (20 points)
  const uiKeywords = [
    'button', 'form', 'modal', 'dropdown', 'input', 'color',
    'style', 'responsive', 'hover', 'click', 'display', 'show',
    'hide', 'animation', 'transition', 'layout'
  ];
  const mentionsUI = uiKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  );
  if (mentionsUI) {
    score += 20;
    details.push("✓ Includes UI/UX specifications");
  }

  // Check for edge cases (15 points)
  const edgeCaseKeywords = [
    'if', 'when', 'error', 'empty', 'null', 'undefined',
    'loading', 'failed', 'invalid', 'edge case', 'handle'
  ];
  const mentionsEdgeCases = edgeCaseKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  );
  if (mentionsEdgeCases) {
    score += 15;
    details.push("✓ Considers edge cases or error states");
  } else {
    details.push("✗ No edge case handling specified");
  }

  // Check for acceptance criteria (10 points)
  const acceptanceKeywords = [
    'should', 'must', 'expected', 'when...then', 'success',
    'criteria', 'requirement', 'validate'
  ];
  const hasAcceptance = acceptanceKeywords.filter(keyword => 
    prompt.toLowerCase().includes(keyword)
  ).length >= 2;
  if (hasAcceptance) {
    score += 10;
    details.push("✓ Defines acceptance criteria");
  } else {
    details.push("✗ No clear acceptance criteria");
  }

  const feedback = generateSpecificityFeedback(score);

  return {
    score,
    weight: 0.30, // 30% of overall score
    feedback,
    details
  };
}

/**
 * Analyze structure quality
 */
function analyzeStructure(prompt: string): ComponentScore {
  let score = 0;
  const details: string[] = [];

  // Check prompt length (20 points)
  const wordCount = prompt.split(/\s+/).length;
  if (wordCount >= 20 && wordCount <= 200) {
    score += 20;
    details.push(`✓ Good length (${wordCount} words)`);
  } else if (wordCount < 20) {
    score += 5;
    details.push(`✗ Too short (${wordCount} words) - needs more detail`);
  } else {
    score += 10;
    details.push(`○ Quite long (${wordCount} words) - consider breaking down`);
  }

  // Check for logical organization (25 points)
  const hasOrganization = 
    /\d+[.)]/g.test(prompt) || // numbered lists
    /[-•*]\s/g.test(prompt) || // bullet points
    prompt.includes('First,') ||
    prompt.includes('Then,') ||
    prompt.includes('Finally,');
  
  if (hasOrganization) {
    score += 25;
    details.push("✓ Well-organized with clear structure");
  } else {
    details.push("✗ No clear organizational structure");
  }

  // Check for context-action-outcome pattern (25 points)
  const hasContext = /in|using|with|for|from/i.test(prompt.substring(0, prompt.length / 3));
  const hasAction = /create|add|build|implement|fix|update/i.test(prompt);
  const hasOutcome = /should|will|result|display|show|expect/i.test(prompt);
  
  const patternScore = (hasContext ? 10 : 0) + (hasAction ? 10 : 0) + (hasOutcome ? 5 : 0);
  score += patternScore;
  
  if (patternScore >= 20) {
    details.push("✓ Follows context → action → outcome pattern");
  } else {
    details.push("✗ Missing context/action/outcome structure");
  }

  // Check for clarity (15 points)
  const hasAmbiguousTerms = /make it better|improve|fix|update/gi.test(prompt) && 
                           !/specifically|exactly|by adding|by changing/i.test(prompt);
  if (!hasAmbiguousTerms) {
    score += 15;
    details.push("✓ Clear and unambiguous language");
  } else {
    details.push("✗ Contains vague terms without specifics");
  }

  // Check for incremental scope (15 points)
  const scopeKeywords = ['one', 'single', 'first', 'initially', 'start with', 'begin by'];
  const hasIncrementalScope = scopeKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  ) || wordCount < 50;
  
  if (hasIncrementalScope) {
    score += 15;
    details.push("✓ Appropriately scoped (incremental)");
  } else {
    details.push("○ Large scope - consider breaking into steps");
  }

  const feedback = generateStructureFeedback(score);

  return {
    score,
    weight: 0.20, // 20% of overall score
    feedback,
    details
  };
}

/**
 * Analyze tool-specific optimization
 */
function analyzeToolOptimization(prompt: string, tool: VibecodingTool): ComponentScore {
  let score = 0;
  const details: string[] = [];

  // Base score for tool-aware prompting
  if (tool === "cursor") {
    // Cursor excels at codebase context
    if (/file|component|function|class|existing|refactor|update/i.test(prompt)) {
      score += 30;
      details.push("✓ Leverages Cursor's codebase awareness");
    } else {
      details.push("○ Could better utilize Cursor's code understanding");
    }

    // References to multiple files
    if ((prompt.match(/\.\w{2,4}\b/g) || []).length >= 2) {
      score += 20;
      details.push("✓ References multiple files (good for Cursor)");
    }

    // Pattern references
    if (/pattern|similar to|like|follow|match/i.test(prompt)) {
      score += 25;
      details.push("✓ References patterns (Cursor can find similar code)");
    } else {
      details.push("○ Could reference existing patterns");
    }

    // Incremental changes
    if (/add|update|modify|change|fix/i.test(prompt) && prompt.split(/\s+/).length < 100) {
      score += 25;
      details.push("✓ Focused incremental change (ideal for Cursor)");
    }

  } else if (tool === "lovable" || tool === "bolt") {
    // Lovable/Bolt excel at new features from scratch
    if (/create|build|generate|new|from scratch/i.test(prompt)) {
      score += 30;
      details.push("✓ Appropriate for new feature generation");
    } else {
      details.push("○ Consider using Cursor for existing code changes");
    }

    // Complete feature description
    if (prompt.split(/\s+/).length >= 40) {
      score += 25;
      details.push("✓ Comprehensive feature description");
    } else {
      details.push("○ Could provide more complete feature specification");
    }

    // UI/styling details
    if (/color|style|design|responsive|layout|component/i.test(prompt)) {
      score += 25;
      details.push("✓ Includes UI/design specifications");
    } else {
      details.push("○ Could add more UI/design details");
    }

    // User flow
    if (/user|click|submit|form|interaction|flow/i.test(prompt)) {
      score += 20;
      details.push("✓ Describes user interaction flow");
    }

  } else if (tool === "v0") {
    // v0 excels at UI components
    if (/component|ui|design|layout|interface/i.test(prompt)) {
      score += 30;
      details.push("✓ Component-focused (perfect for v0)");
    }

    // Visual specifications
    if (/color|size|spacing|border|shadow|gradient/i.test(prompt)) {
      score += 25;
      details.push("✓ Includes visual styling details");
    } else {
      details.push("○ Add more visual specifications for better results");
    }

    // Responsive design
    if (/responsive|mobile|desktop|tablet|breakpoint/i.test(prompt)) {
      score += 25;
      details.push("✓ Mentions responsive behavior");
    }

    // Component variants
    if (/variant|state|hover|active|disabled/i.test(prompt)) {
      score += 20;
      details.push("✓ Specifies component states/variants");
    }

  } else if (tool === "claude" || tool === "chatgpt") {
    // Claude/ChatGPT excel at planning and problem-solving
    if (/plan|design|architect|analyze|review|explain/i.test(prompt)) {
      score += 30;
      details.push("✓ Leverages AI for planning/analysis");
    }

    // Problem context
    if (/problem|issue|challenge|need|goal|objective/i.test(prompt)) {
      score += 25;
      details.push("✓ Clearly states the problem/goal");
    }

    // Asks for alternatives
    if (/option|alternative|approach|way|solution|recommend/i.test(prompt)) {
      score += 25;
      details.push("✓ Requests multiple approaches (good!)");
    }

    // Context-rich
    if (prompt.split(/\s+/).length >= 50) {
      score += 20;
      details.push("✓ Provides rich context for analysis");
    }
  }

  // Ensure score doesn't exceed 100
  score = Math.min(score, 100);

  const feedback = generateToolOptimizationFeedback(score, tool);

  return {
    score,
    weight: 0.20, // 20% of overall score
    feedback,
    details
  };
}

/**
 * Generate feedback for context score
 */
function generateContextFeedback(score: number): string {
  if (score >= 80) return "Excellent context! AI will have clear understanding of your codebase.";
  if (score >= 60) return "Good context provided. Consider adding more specifics about your tech stack.";
  if (score >= 40) return "Basic context. Add information about your existing code and structure.";
  return "Insufficient context. AI won't understand your project setup. Add tech stack, file locations, and existing patterns.";
}

/**
 * Generate feedback for specificity score
 */
function generateSpecificityFeedback(score: number): string {
  if (score >= 80) return "Highly specific requirements! AI will generate exactly what you need.";
  if (score >= 60) return "Fairly specific. Consider adding more details about edge cases and expected behavior.";
  if (score >= 40) return "Somewhat vague. Be more specific about what you want and how it should behave.";
  return "Too vague. AI will make many assumptions. Add specific requirements, edge cases, and acceptance criteria.";
}

/**
 * Generate feedback for structure score
 */
function generateStructureFeedback(score: number): string {
  if (score >= 80) return "Well-structured prompt! Easy for AI to parse and understand.";
  if (score >= 60) return "Decent structure. Consider using numbered lists or bullet points for clarity.";
  if (score >= 40) return "Could be better organized. Break down requirements into clear steps.";
  return "Poorly structured. Organize your prompt with clear sections: context, requirements, expected outcome.";
}

/**
 * Generate feedback for tool optimization score
 */
function generateToolOptimizationFeedback(score: number, tool: VibecodingTool): string {
  if (score >= 80) return `Excellent! Prompt is well-optimized for ${tool}.`;
  if (score >= 60) return `Good fit for ${tool}. Could be more optimized.`;
  if (score >= 40) return `Okay for ${tool}, but not leveraging its strengths.`;
  return `Not well-suited for ${tool}. Consider a different tool or restructure your prompt.`;
}

/**
 * Collect strengths and improvements from all scores
 */
function collectFeedback(scores: {
  context: ComponentScore;
  specificity: ComponentScore;
  structure: ComponentScore;
  toolOptimization: ComponentScore;
}): { strengths: string[]; improvements: ImprovementSuggestion[] } {
  const strengths: string[] = [];
  const improvements: ImprovementSuggestion[] = [];

  // Context feedback
  if (scores.context.score >= 70) {
    strengths.push("Strong contextual information");
  } else if (scores.context.score < 50) {
    improvements.push({
      priority: "high",
      category: "context",
      issue: "Insufficient project context",
      suggestion: "Add information about your tech stack, file structure, and existing code patterns",
      example: "In my Next.js 14 app using Supabase and TypeScript, located in app/dashboard/..."
    });
  }

  // Specificity feedback
  if (scores.specificity.score >= 70) {
    strengths.push("Clear and specific requirements");
  } else if (scores.specificity.score < 50) {
    improvements.push({
      priority: "high",
      category: "specificity",
      issue: "Requirements are too vague",
      suggestion: "Break down exactly what you want: specific actions, expected outcomes, and edge cases",
      example: "Create a form with email field (RFC 5322 validation), submit button (disabled while loading), show error toast on failure"
    });
  }

  // Structure feedback
  if (scores.structure.score >= 70) {
    strengths.push("Well-organized prompt structure");
  } else if (scores.structure.score < 50) {
    improvements.push({
      priority: "medium",
      category: "structure",
      issue: "Prompt lacks clear structure",
      suggestion: "Organize using numbered lists: 1) Context, 2) Requirements, 3) Expected outcome",
      example: "1) In file X using pattern Y, 2) Add feature Z with behaviors A, B, C, 3) Should result in..."
    });
  }

  // Tool optimization feedback
  if (scores.toolOptimization.score >= 70) {
    strengths.push("Optimized for the selected tool");
  } else if (scores.toolOptimization.score < 50) {
    improvements.push({
      priority: "medium",
      category: "tool",
      issue: "Not leveraging tool's strengths",
      suggestion: "Tailor your prompt to the tool's capabilities",
      example: "For Cursor: reference existing files and patterns. For Bolt/Lovable: provide complete feature specs"
    });
  }

  return { strengths, improvements };
}

/**
 * Get letter grade from score
 */
function getGrade(score: number): "A+" | "A" | "B" | "C" | "D" | "F" {
  if (score >= 95) return "A+";
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "F";
}

/**
 * Get estimated quality from score
 */
function getEstimatedQuality(score: number): "Excellent" | "Good" | "Fair" | "Poor" {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}

/**
 * Generate an improved version of the prompt
 */
function generateImprovedPrompt(prompt: string, improvements: ImprovementSuggestion[]): string {
  let improved = prompt;
  
  // Add context template if missing
  if (improvements.some(i => i.category === "context")) {
    improved = `[Context: In my {tech-stack} app, located in {file/directory}, using {patterns}]\n\n${improved}`;
  }

  // Add structure if missing
  if (improvements.some(i => i.category === "structure" || i.category === "specificity")) {
    const parts = improved.split(/[.,]/);
    if (parts.length > 2) {
      improved = parts
        .map((part, i) => `${i + 1}. ${part.trim()}`)
        .join('\n');
    }
  }

  // Add acceptance criteria template
  if (improvements.some(i => i.category === "specificity")) {
    improved += `\n\nExpected outcome: {describe what success looks like}\nEdge cases to handle: {list edge cases}\nError handling: {describe error states}`;
  }

  return improved;
}

/**
 * Quick check if prompt needs improvement
 */
export function needsImprovement(prompt: string): boolean {
  const analysis = analyzePromptQuality(prompt);
  return analysis.overallScore < 70;
}

/**
 * Get quick tips for improving a prompt
 */
export function getQuickTips(prompt: string, tool: VibecodingTool = "cursor"): string[] {
  const analysis = analyzePromptQuality(prompt, tool);
  return analysis.improvements
    .filter(i => i.priority === "high")
    .map(i => i.suggestion);
}

