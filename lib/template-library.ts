import { type HelperType } from "./types/helpers";

export interface PromptTemplate {
  id: string;
  icon: string;
  title: string;
  description: string;
  prompt: string;
  category: "quick" | "deep" | "review";
}

/**
 * Curated Quick Actions - Essential, high-value actions for vibecoding success
 * Each action provides immediate, practical value for building and launching
 */
export const HELPER_TEMPLATES: Record<HelperType, PromptTemplate[]> = {
  // 🪄 MUSE - Idea Validation & Strategy
  muse: [
    {
      id: "validate-idea",
      icon: "✅",
      title: "Validate My Idea",
      description: "Framework + experiments",
      category: "quick",
      prompt: "Help me validate my project idea. Give me a validation framework with key questions, red flags to watch for, and 3-5 quick experiments I can run this week to test demand.",
    },
    {
      id: "competitor-research",
      icon: "🔍",
      title: "Competitor Research",
      description: "Find and analyze competitors",
      category: "quick",
      prompt: "Help me research competitors. Show me how to find them, what to analyze, how to identify gaps in the market, and opportunities to differentiate.",
    },
    {
      id: "mvp-scope",
      icon: "🎯",
      title: "Define MVP Scope",
      description: "Ruthlessly prioritize features",
      category: "quick",
      prompt: "Help me define my MVP scope. Give me a framework for deciding what's essential vs nice-to-have, with examples of successful MVP cuts that led to faster launches.",
    },
    {
      id: "target-audience",
      icon: "👥",
      title: "Define Target Audience",
      description: "Who exactly are you building for",
      category: "quick",
      prompt: "Help me precisely define my target audience. Give me a framework covering demographics, pain points, where they hang out online, and how to reach them.",
    },
    {
      id: "value-proposition",
      icon: "⭐",
      title: "Unique Value Prop",
      description: "What makes you different",
      category: "quick",
      prompt: "Help me craft my unique value proposition. Show me how to articulate what makes my solution different, better, and worth choosing over alternatives.",
    },
    {
      id: "elevator-pitch",
      icon: "💬",
      title: "Elevator Pitch",
      description: "One-liner that sells",
      category: "quick",
      prompt: "Help me craft a killer elevator pitch. Give me a proven template, strong examples, and key elements that make pitches memorable and compelling.",
    },
    {
      id: "monetization",
      icon: "💰",
      title: "Monetization Strategy",
      description: "Revenue models that work",
      category: "deep",
      prompt: "Show me monetization options for my product. Give me 5-7 revenue models (subscription, one-time, freemium) with pros/cons and when to use each.",
    },
    {
      id: "user-interviews",
      icon: "🎤",
      title: "User Interview Guide",
      description: "Talk to potential users",
      category: "quick",
      prompt: "Create a user interview guide. Give me 10 powerful questions to ask potential users, tips on listening, and what signals indicate real demand.",
    },
  ],
  
  // 🧱 ARCHITECT - System Design & Build Prompts
  architect: [
    {
      id: "mvp-scaffold",
      icon: "🏗️",
      title: "MVP Scaffold Prompt",
      description: "Initial app structure",
      category: "quick",
      prompt: "Generate a prompt for scaffolding my MVP. Create a complete prompt describing project structure, tech stack, folder organization, and initial setup for AI coding tools.",
    },
    {
      id: "database-schema",
      icon: "🗄️",
      title: "Database Schema Prompt",
      description: "Design data model",
      category: "quick",
      prompt: "Generate a database schema prompt. Create a detailed prompt describing tables, fields, relationships, indexes, and constraints for my data model.",
    },
    {
      id: "auth-system",
      icon: "🔐",
      title: "Auth System Prompt",
      description: "Login & registration",
      category: "deep",
      prompt: "Generate an authentication prompt. Create a complete prompt covering user registration, login, password reset, session management, and protected routes.",
    },
    {
      id: "api-routes",
      icon: "🔌",
      title: "API Routes Prompt",
      description: "Backend endpoints",
      category: "quick",
      prompt: "Generate an API routes prompt. Create a structured prompt describing endpoints, request/response formats, validation, and error handling.",
    },
    {
      id: "payment-integration",
      icon: "💳",
      title: "Payment Integration",
      description: "Stripe/payment setup",
      category: "deep",
      prompt: "Generate a payment integration prompt. Create a detailed prompt covering Stripe setup, subscription plans, checkout flow, webhooks, and billing management.",
    },
    {
      id: "feature-module",
      icon: "🎯",
      title: "Feature Module Prompt",
      description: "Complete feature",
      category: "deep",
      prompt: "Generate a feature module prompt. Create a detailed prompt covering frontend UI, backend logic, database changes, and integration for my feature.",
    },
    {
      id: "deployment",
      icon: "🚀",
      title: "Deployment Setup",
      description: "Go live configuration",
      category: "quick",
      prompt: "Generate a deployment prompt. Create a prompt describing build settings, environment variables, hosting setup (Vercel/Netlify), and deployment pipeline.",
    },
    {
      id: "email-system",
      icon: "📧",
      title: "Email System Prompt",
      description: "Transactional emails",
      category: "quick",
      prompt: "Generate an email system prompt. Create a prompt describing email service integration, templates (welcome/reset/notification), and sending logic.",
    },
  ],
  
  // 🎨 CRAFTER - UI/UX Design Prompts
  crafter: [
    {
      id: "landing-page",
      icon: "🎨",
      title: "Landing Page Prompt",
      description: "Hero + features + CTA",
      category: "deep",
      prompt: "Generate a landing page prompt. Create a detailed UI prompt covering hero section, features, testimonials, CTA buttons, responsive design, and visual style.",
    },
    {
      id: "dashboard-layout",
      icon: "📊",
      title: "Dashboard Prompt",
      description: "App main interface",
      category: "deep",
      prompt: "Generate a dashboard prompt. Create a comprehensive prompt describing sidebar navigation, header, main content area, cards, charts, and responsive behavior.",
    },
    {
      id: "design-system",
      icon: "🎨",
      title: "Design System Prompt",
      description: "Colors, spacing, typography",
      category: "deep",
      prompt: "Generate a design system prompt. Create a prompt defining color palette, spacing scale, typography hierarchy, shadows, borders, and component tokens.",
    },
    {
      id: "form-component",
      icon: "📝",
      title: "Form Component",
      description: "Inputs + validation",
      category: "quick",
      prompt: "Generate a form prompt. Create a detailed prompt covering input fields, validation, error states, success feedback, loading states, and accessibility.",
    },
    {
      id: "navigation",
      icon: "🧭",
      title: "Navigation System",
      description: "Header/sidebar/mobile",
      category: "quick",
      prompt: "Generate a navigation prompt. Create a prompt describing header/sidebar structure, mobile menu, active states, dropdowns, and smooth transitions.",
    },
    {
      id: "modal-dialog",
      icon: "💬",
      title: "Modal/Dialog Prompt",
      description: "Overlays & popups",
      category: "quick",
      prompt: "Generate a modal prompt. Create a prompt describing overlay behavior, animations, focus management, close actions, and different modal types (confirm, info, form).",
    },
    {
      id: "pricing-page",
      icon: "💰",
      title: "Pricing Page Prompt",
      description: "Plans comparison",
      category: "quick",
      prompt: "Generate a pricing page prompt. Create a prompt covering pricing cards, feature comparison, billing toggle (monthly/yearly), highlighted plan, and CTAs.",
    },
    {
      id: "responsive-mobile",
      icon: "📱",
      title: "Mobile Responsive",
      description: "Mobile-first design",
      category: "deep",
      prompt: "Generate a mobile responsive prompt. Create a prompt covering breakpoints, touch targets, mobile navigation, gestures, and mobile-specific optimizations.",
    },
  ],
  
  // ⚙️ HACKER - Code Implementation Prompts
  hacker: [
    {
      id: "feature-implementation",
      icon: "⚡",
      title: "Feature Implementation",
      description: "Build new functionality",
      category: "quick",
      prompt: "Generate a feature implementation prompt. Create a structured prompt using Context-Action-Outcome: describe existing code, what to build, and success criteria.",
    },
    {
      id: "bug-fix",
      icon: "🐛",
      title: "Bug Fix Prompt",
      description: "Debug and resolve issues",
      category: "quick",
      prompt: "Generate a bug fix prompt. Create a detailed prompt describing the issue, expected vs current behavior, relevant code context, and what needs to change.",
    },
    {
      id: "api-integration",
      icon: "🔌",
      title: "API Integration",
      description: "Connect external services",
      category: "quick",
      prompt: "Generate an API integration prompt. Create a prompt covering authentication, endpoint calls, error handling, response parsing, and rate limiting.",
    },
    {
      id: "refactoring",
      icon: "🔧",
      title: "Refactoring Prompt",
      description: "Improve code quality",
      category: "deep",
      prompt: "Generate a refactoring prompt. Create a prompt describing current code structure, problems to solve, desired improvements, and constraints to maintain.",
    },
    {
      id: "performance-optimization",
      icon: "🚀",
      title: "Performance Optimization",
      description: "Speed up your app",
      category: "deep",
      prompt: "Generate a performance prompt. Create a prompt identifying bottlenecks, describing optimization targets, and specifying improvements to implement.",
    },
    {
      id: "error-handling",
      icon: "🛡️",
      title: "Error Handling",
      description: "Robust error management",
      category: "quick",
      prompt: "Generate an error handling prompt. Create a prompt describing try-catch blocks, error boundaries, logging, user-friendly messages, and recovery strategies.",
    },
    {
      id: "security-audit",
      icon: "🔒",
      title: "Security Review",
      description: "Find vulnerabilities",
      category: "review",
      prompt: "Generate a security audit prompt. Create a prompt asking AI to review code for vulnerabilities: SQL injection, XSS, CSRF, exposed secrets, and insecure dependencies.",
    },
    {
      id: "testing",
      icon: "✅",
      title: "Testing Setup",
      description: "Add tests to code",
      category: "deep",
      prompt: "Generate a testing prompt. Create a prompt describing test cases, edge cases, mocking strategy, coverage targets, and testing best practices.",
    },
  ],
  
  // 📣 HYPEBEAST - Launch & Marketing
  hypebeast: [
    {
      id: "launch-strategy",
      icon: "🚀",
      title: "Launch Strategy",
      description: "Complete go-to-market plan",
      category: "deep",
      prompt: "Create a launch strategy for my product. Include pre-launch, launch day, and post-launch tactics. Show me where to post, when to post, and what to say.",
    },
    {
      id: "launch-checklist",
      icon: "✅",
      title: "Launch Checklist",
      description: "Don't miss anything",
      category: "review",
      prompt: "Give me a comprehensive launch checklist. Cover website, social profiles, ProductHunt, press kit, analytics, and distribution channels.",
    },
    {
      id: "landing-copy",
      icon: "✍️",
      title: "Landing Page Copy",
      description: "Conversion-focused writing",
      category: "quick",
      prompt: "Help me write landing page copy that converts. Give me a structure with headlines, benefits, social proof, and CTAs with proven examples.",
    },
    {
      id: "producthunt",
      icon: "🏆",
      title: "ProductHunt Launch",
      description: "Maximize PH success",
      category: "deep",
      prompt: "Create a ProductHunt launch strategy. Include preparation timeline, launch day tactics, hunter outreach, comment responses, and post-launch follow-up.",
    },
    {
      id: "content-calendar",
      icon: "📅",
      title: "Content Calendar",
      description: "30-day posting plan",
      category: "quick",
      prompt: "Give me a 30-day content calendar. Include content types, posting frequency, platform mix, and themes that build anticipation and engagement.",
    },
    {
      id: "viral-posts",
      icon: "📱",
      title: "Viral Post Templates",
      description: "Social media formats",
      category: "quick",
      prompt: "Share viral post templates I can customize. Include formats for Twitter/X, LinkedIn, and Reddit that have high engagement rates.",
    },
    {
      id: "twitter-growth",
      icon: "🐦",
      title: "Twitter Growth Plan",
      description: "Build audience on X",
      category: "deep",
      prompt: "Give me a Twitter growth plan. Include content pillars, posting frequency, engagement tactics, thread templates, and how to attract followers.",
    },
    {
      id: "community-building",
      icon: "👥",
      title: "Community Building",
      description: "Early adopters + advocates",
      category: "deep",
      prompt: "Show me how to build a community. Include platforms to use (Discord, Slack, Circle), engagement tactics, and turning users into advocates.",
    },
  ],
  
  // 🧘 SENSEI - Growth & Scale
  sensei: [
    {
      id: "metrics-dashboard",
      icon: "📊",
      title: "Essential Metrics",
      description: "Track what matters",
      category: "quick",
      prompt: "Tell me which metrics to track for my MVP. Give me essential KPIs, how to measure them, and what good/bad numbers look like in the first 3 months.",
    },
    {
      id: "analytics-setup",
      icon: "📉",
      title: "Analytics Setup",
      description: "Track user behavior",
      category: "quick",
      prompt: "Guide me through analytics setup. Show me which events to track, how to set up funnels, cohort analysis, and make data-driven decisions.",
    },
    {
      id: "retention-strategies",
      icon: "🔄",
      title: "Retention Strategies",
      description: "Keep users coming back",
      category: "deep",
      prompt: "Share retention strategies for my product. Include onboarding best practices, email sequences, feature engagement hooks, and reducing churn.",
    },
    {
      id: "feedback-system",
      icon: "💬",
      title: "User Feedback System",
      description: "Collect and prioritize",
      category: "deep",
      prompt: "Design a user feedback system. Show me how to collect feedback, prioritize requests, identify patterns, and decide what to build next.",
    },
    {
      id: "growth-experiments",
      icon: "🧪",
      title: "Growth Experiments",
      description: "Test and iterate",
      category: "quick",
      prompt: "Suggest growth experiments I can run. Give me 5-7 low-effort, high-impact tests with clear success metrics and timeline.",
    },
    {
      id: "pricing-strategy",
      icon: "💰",
      title: "Pricing Strategy",
      description: "Find optimal pricing",
      category: "deep",
      prompt: "Help me develop a pricing strategy. Include pricing models, how to test prices, psychological pricing tactics, and when to charge.",
    },
    {
      id: "referral-program",
      icon: "🎁",
      title: "Referral Program",
      description: "Viral growth loop",
      category: "deep",
      prompt: "Help me design a referral program. Give me incentive structures, sharing mechanics, tracking systems, and examples of successful referral programs.",
    },
    {
      id: "product-market-fit",
      icon: "✨",
      title: "Measure PMF",
      description: "Are you there yet?",
      category: "review",
      prompt: "Help me measure product-market fit. Give me the PMF survey, retention metrics to watch, NPS score guidelines, and qualitative signals of strong PMF.",
    },
  ],
};

/**
 * Get templates for a specific helper
 */
export function getTemplatesForHelper(helper: HelperType): PromptTemplate[] {
  return HELPER_TEMPLATES[helper] || [];
}
