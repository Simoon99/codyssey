/**
 * Comprehensive Task Completion Prompts for Each Helper
 * 
 * These prompts are designed to maximize helpfulness by providing
 * specific, actionable guidance for each task in the user's journey.
 */

export interface TaskPrompt {
  taskId: string;
  helper: string;
  guidancePrompt: string;
  completionCriteria: string[];
  proactiveSuggestions: string[];
}

/**
 * Task-specific completion guidance for each helper
 */
export const TASK_PROMPTS: Record<string, TaskPrompt> = {
  // ===== LEVEL 1: SPARK =====
  // L1S1: Muse - Problem & Market Scan
  "define-problem": {
    taskId: "define-problem",
    helper: "muse",
    guidancePrompt: `Help the user craft a crystal-clear problem statement by:
1. Asking who experiences this problem specifically
2. Understanding the pain level (nice-to-have vs. must-solve)
3. Quantifying impact (time/money/emotion lost)
4. Identifying why existing solutions fall short
5. Crafting a 1-paragraph problem statement

Example output format:
"[Target audience] struggles with [specific problem] because [root cause]. This costs them [impact] and existing solutions like [alternatives] don't work because [gaps]. This problem is worth solving because [why it matters]."`,
    completionCriteria: [
      "Clear target audience identified",
      "Specific, measurable problem articulated",
      "Root cause understood",
      "Impact quantified",
      "One-paragraph problem statement written"
    ],
    proactiveSuggestions: [
      "Would you like me to help you validate this problem with a quick survey?",
      "Should we identify 3-5 people you can interview about this?",
      "Let's turn this into a compelling pitch paragraph"
    ]
  },
  
  "research-competition": {
    taskId: "research-competition",
    helper: "muse",
    guidancePrompt: `Guide comprehensive competitive analysis by:
1. Identifying 3-5 direct and indirect competitors
2. Analyzing their core features and positioning
3. Finding their strengths (what they do well)
4. Spotting their weaknesses (gaps and complaints)
5. Discovering differentiation opportunities

For each competitor, provide:
- Name & URL
- Target audience
- Key features
- Pricing model
- User complaints (from reviews)
- Opportunity gaps

Then synthesize: "Based on this analysis, you could differentiate by..."`,
    completionCriteria: [
      "3-5 competitors identified with URLs",
      "Strengths and weaknesses documented",
      "User complaints captured",
      "Clear differentiation opportunities identified",
      "Competitive positioning statement written"
    ],
    proactiveSuggestions: [
      "Want me to draft a competitive comparison table?",
      "Should we identify which competitor segment to target first?",
      "Let's map your unique value proposition against these competitors"
    ]
  },

  "identify-target-audience": {
    taskId: "identify-target-audience",
    helper: "muse",
    guidancePrompt: `Create detailed user personas by:
1. Demographics (age, role, context)
2. Psychographics (goals, fears, motivations)
3. Behavioral patterns (how they currently solve this)
4. Pain points and frustrations
5. Success metrics (what would delight them)

Create 2-3 personas with names, backgrounds, and specific quotes that represent their mindset.`,
    completionCriteria: [
      "2-3 detailed personas created",
      "Demographics and psychographics defined",
      "Pain points clearly articulated",
      "Current behavior patterns documented",
      "Success criteria for each persona"
    ],
    proactiveSuggestions: [
      "Should we prioritize one persona for your MVP?",
      "Want to create an interview script for these personas?",
      "Let's map their current journey and identify intervention points"
    ]
  },

  "market-size-analysis": {
    taskId: "market-size-analysis",
    helper: "muse",
    guidancePrompt: `Estimate market opportunity using TAM/SAM/SOM framework:
1. TAM (Total Addressable Market): Maximum theoretical market
2. SAM (Serviceable Addressable Market): Market you can reach
3. SOM (Serviceable Obtainable Market): Market you can capture

For each:
- Define the market segment
- Estimate size (number of users/businesses)
- Calculate revenue potential
- Document assumptions and sources

Help validate if this market is big enough to be venture-scale or if it's better as a lifestyle business.`,
    completionCriteria: [
      "TAM calculated with sources",
      "SAM defined with realistic constraints",
      "SOM estimated for first 1-2 years",
      "Revenue model assumptions documented",
      "Market viability assessment complete"
    ],
    proactiveSuggestions: [
      "Want help finding market research reports?",
      "Should we validate these numbers with industry experts?",
      "Let's create a simple pitch slide with these numbers"
    ]
  },

  // L1S2: Architect - Hypotheses & Validation
  "brainstorm-solutions": {
    taskId: "brainstorm-solutions",
    helper: "architect",
    guidancePrompt: `Generate and evaluate solution hypotheses by:
1. Creating 3-5 different solution approaches
2. Evaluating feasibility (easy/medium/hard to build)
3. Assessing desirability (will users want this?)
4. Analyzing viability (can we monetize?)
5. Recommending MVP approach

For each solution:
- Core mechanism (how it works)
- Key features (3-5 features)
- Build complexity (1-10 scale)
- Unique differentiation
- Risks and assumptions

Then recommend: "Based on your constraints, I'd start with [solution X] because..."`,
    completionCriteria: [
      "3-5 solution approaches documented",
      "Feasibility assessment for each",
      "Trade-offs clearly articulated",
      "MVP recommendation with reasoning",
      "Key assumptions listed"
    ],
    proactiveSuggestions: [
      "Want me to create user stories for your chosen solution?",
      "Should we prototype the core flow on paper?",
      "Let's identify the riskiest assumption to test first"
    ]
  },

  "validate-idea": {
    taskId: "validate-idea",
    helper: "architect",
    guidancePrompt: `Design and execute user validation by:
1. Creating an interview script (8-10 open-ended questions)
2. Identifying 5-10 people to interview
3. Conducting interviews without pitching your solution
4. Documenting raw feedback and quotes
5. Synthesizing patterns and insights

Interview script should:
- Start with their current behavior
- Explore pain points deeply
- Avoid leading questions
- Test willingness to pay
- End with "what would you pay for X?"

After interviews, help identify:
- Validated vs. invalidated assumptions
- Surprising insights
- Common pain themes
- Feature priorities from user language`,
    completionCriteria: [
      "Interview script with 8-10 questions created",
      "5+ users interviewed",
      "Raw notes and quotes documented",
      "Key patterns synthesized",
      "Validated/invalidated assumptions list"
    ],
    proactiveSuggestions: [
      "Want me to help you analyze your interview notes?",
      "Should we adjust your solution based on these insights?",
      "Let's identify your first 10 beta users from these conversations"
    ]
  },

  "user-interview-analysis": {
    taskId: "user-interview-analysis",
    helper: "architect",
    guidancePrompt: `Systematically analyze interview data by:
1. Extracting all pain points mentioned (with frequency)
2. Identifying feature requests and priorities
3. Capturing memorable quotes
4. Finding patterns across interviews
5. Quantifying willingness to pay

Create:
- Pain Point Matrix (frequency x severity)
- Feature Priority List (must-have vs. nice-to-have)
- Quote Library (categorized by theme)
- Insight Summary (key learnings)
- Recommendations (what to build first)`,
    completionCriteria: [
      "Pain points ranked by frequency and severity",
      "Feature priorities from user language",
      "5-10 compelling user quotes captured",
      "Key patterns identified",
      "Clear next steps recommended"
    ],
    proactiveSuggestions: [
      "Should we create a validation report to share with stakeholders?",
      "Want to map these insights to your MVP scope?",
      "Let's identify which pain point to solve first"
    ]
  },

  "create-value-hypothesis": {
    taskId: "create-value-hypothesis",
    helper: "architect",
    guidancePrompt: `Craft a compelling value proposition by:
1. Identifying the #1 pain point to solve
2. Articulating your unique mechanism
3. Quantifying the benefit (time/money saved)
4. Differentiating from alternatives
5. Creating a clear, memorable statement

Use this framework:
"For [target user] who [needs/wants], [product name] is a [category] that [key benefit]. Unlike [alternatives], we [unique differentiator]."

Test your value prop:
- Can you explain it in 10 seconds?
- Would a stranger understand the benefit?
- Is it specific and measurable?
- Does it focus on outcomes, not features?`,
    completionCriteria: [
      "Value proposition written in clear language",
      "Target user and pain clearly identified",
      "Unique differentiator articulated",
      "Measurable benefit stated",
      "10-second pitch version created"
    ],
    proactiveSuggestions: [
      "Want me to help test this value prop with variations?",
      "Should we create landing page copy from this?",
      "Let's turn this into your elevator pitch"
    ]
  },

  // L1S3: Crafter - MVP Scope
  "define-mvp-scope": {
    taskId: "define-mvp-scope",
    helper: "crafter",
    guidancePrompt: `Define a shippable MVP scope by:
1. Listing all possible features
2. Identifying the core user journey (signup → value → habit)
3. Selecting 3-5 features that complete this journey
4. Defining "done" criteria for each feature
5. Estimating build time (be realistic)

For each feature:
- User story ("As a [user], I want to [action] so that [benefit]")
- Acceptance criteria (what "done" looks like)
- Build estimate (hours/days)
- Must-have vs. nice-to-have

Then create a roadmap:
- Week 1-2: Feature X
- Week 3-4: Feature Y
- Week 5-6: Polish & launch

Remember: MVP = Minimum VIABLE Product. It should solve the core pain, not have every feature.`,
    completionCriteria: [
      "3-5 core features defined",
      "User stories for each feature",
      "Acceptance criteria documented",
      "Build timeline estimated",
      "Clear launch criteria set"
    ],
    proactiveSuggestions: [
      "Want me to help you cut more features?",
      "Should we wireframe these core flows?",
      "Let's identify your 'wow moment' feature to prioritize"
    ]
  },

  "create-user-stories": {
    taskId: "create-user-stories",
    helper: "crafter",
    guidancePrompt: `Write clear, actionable user stories by:
1. Using format: "As a [persona], I want to [action], so that [benefit]"
2. Adding acceptance criteria (Given/When/Then)
3. Including edge cases and error states
4. Prioritizing by user value
5. Keeping stories small and testable

For each story:
- Title (verb + noun, e.g., "Upload Profile Photo")
- User story statement
- Acceptance criteria (3-5 specific conditions)
- Edge cases to handle
- Priority (High/Medium/Low)

Example:
**Story: Sign Up with Email**
As a new user, I want to sign up with my email, so that I can access the platform quickly.

Acceptance Criteria:
- Given I'm on the signup page
- When I enter valid email and password
- Then I should receive a verification email
- And I should be redirected to onboarding

Edge Cases:
- Email already exists
- Weak password
- Email server timeout`,
    completionCriteria: [
      "5-10 user stories written",
      "Each story follows format",
      "Acceptance criteria defined",
      "Edge cases documented",
      "Stories prioritized"
    ],
    proactiveSuggestions: [
      "Want to break these into subtasks for development?",
      "Should we estimate story points?",
      "Let's create a sprint plan from these stories"
    ]
  },

  "design-success-metrics": {
    taskId: "design-success-metrics",
    helper: "crafter",
    guidancePrompt: `Define measurable success metrics by:
1. Identifying your North Star Metric (one metric that matters most)
2. Setting up a metrics hierarchy (inputs → outputs → outcomes)
3. Defining target numbers (realistic but ambitious)
4. Planning how to measure each metric
5. Creating a simple dashboard structure

Metric categories:
- Acquisition: How users find you (signups, traffic sources)
- Activation: First-time user success (onboarding completion, "aha moment")
- Engagement: Regular usage (DAU/MAU, session length)
- Retention: Users coming back (D1/D7/D30 retention)
- Referral: User-driven growth (k-factor, invite rate)
- Revenue: Monetization (conversion rate, LTV)

For MVP, focus on:
- North Star Metric: [your key metric]
- 3-5 supporting metrics
- Weekly targets
- What "good" looks like`,
    completionCriteria: [
      "North Star Metric identified",
      "3-5 key metrics defined with targets",
      "Measurement plan for each metric",
      "Success criteria for MVP launch",
      "Dashboard structure planned"
    ],
    proactiveSuggestions: [
      "Want help setting up analytics tracking?",
      "Should we create a metrics dashboard mockup?",
      "Let's identify leading indicators for your North Star"
    ]
  },

  // ===== LEVEL 2: BUILD PREP =====
  // L2S1: Architect - Stack & Architecture
  "choose-tech-stack": {
    taskId: "choose-tech-stack",
    helper: "architect",
    guidancePrompt: `Select optimal tech stack based on constraints:

1. Frontend Framework:
- React/Next.js (best for web apps, SEO)
- Vue/Nuxt (lighter, easier learning curve)
- Svelte/SvelteKit (fastest performance)
- React Native (mobile cross-platform)

2. Backend/API:
- Next.js API routes (full-stack simplicity)
- Express/Fastify (Node.js flexibility)
- Django/FastAPI (Python, great for AI/ML)
- Supabase/Firebase (backend-as-a-service)

3. Database:
- PostgreSQL (relational, powerful)
- MongoDB (document, flexible schema)
- Supabase (Postgres + realtime + auth)
- Firebase (NoSQL + realtime)

4. Hosting:
- Vercel (best for Next.js)
- Netlify (JAMstack sites)
- Railway/Render (full-stack apps)
- AWS/GCP (scalability, complexity)

Ask about:
- Team experience (what do they know?)
- Timeline (need to ship fast?)
- Budget ($0 vs. $50/month vs. unlimited)
- Scale expectations (100 vs. 10k users)
- Special requirements (realtime, AI, etc.)

Provide:
- Recommended stack with reasoning
- Alternative options with tradeoffs
- Getting started resources
- Cost breakdown (free tier → scale)`,
    completionCriteria: [
      "Frontend framework chosen with reasoning",
      "Backend/API approach selected",
      "Database technology decided",
      "Hosting platform identified",
      "Cost analysis completed"
    ],
    proactiveSuggestions: [
      "Want a starter template for this stack?",
      "Should we document setup instructions?",
      "Let's identify potential scaling bottlenecks"
    ]
  },

  "design-architecture": {
    taskId: "design-architecture",
    helper: "architect",
    guidancePrompt: `Create high-level system architecture by:

1. Component Diagram:
- Client (web/mobile app)
- API layer (REST/GraphQL)
- Database (schema overview)
- External services (auth, payments, etc.)
- File storage (if needed)

2. Data Flow:
- User authentication flow
- Core feature data flow
- State management approach
- Caching strategy (if needed)

3. Key Decisions:
- Monolith vs. microservices (start monolith)
- Real-time requirements (WebSockets?)
- File handling (S3, Cloudinary?)
- Background jobs (if needed)

4. Security Considerations:
- Authentication method (JWT, sessions)
- API rate limiting
- Data encryption
- CORS configuration

Create a simple diagram (text-based is fine):
\`\`\`
[User] → [Next.js App] → [API Routes] → [Supabase DB]
                      ↓
                [Auth Service]
                [File Storage]
\`\`\`

Document:
- How data flows for core features
- Third-party integrations needed
- Scaling considerations
- Security measures`,
    completionCriteria: [
      "Architecture diagram created",
      "Key components identified",
      "Data flow documented for core features",
      "Security approach defined",
      "External dependencies listed"
    ],
    proactiveSuggestions: [
      "Want me to review for common pitfalls?",
      "Should we create a database schema next?",
      "Let's identify the critical path for MVP"
    ]
  },

  "document-dependencies": {
    taskId: "document-dependencies",
    helper: "architect",
    guidancePrompt: `Create comprehensive dependency documentation:

1. Core Dependencies:
- List all major libraries/frameworks
- Version constraints
- Why each is needed
- Alternatives considered

2. External APIs/Services:
- Service name and purpose
- Pricing tier
- API limits
- Authentication method
- Fallback strategy

3. Development Tools:
- Package manager (npm, yarn, pnpm)
- Build tools
- Linting/formatting
- Testing framework
- CI/CD platform

4. Production Requirements:
- Environment variables needed
- Secrets management approach
- Monitoring/logging service
- Error tracking (Sentry, etc.)

Create a dependency map:
\`\`\`
CRITICAL (app won't work without):
- next: Frontend framework
- supabase: Database + auth
- stripe: Payments

IMPORTANT (major features need):
- react-hook-form: Form handling
- zod: Validation

NICE-TO-HAVE (DX improvements):
- prettier: Code formatting
- eslint: Code quality
\`\`\``,
    completionCriteria: [
      "All dependencies listed with purposes",
      "External services documented with pricing",
      "Development tools specified",
      "Critical vs. optional dependencies marked",
      "Version constraints documented"
    ],
    proactiveSuggestions: [
      "Want me to create a package.json starter?",
      "Should we identify redundant dependencies?",
      "Let's document setup instructions for new developers"
    ]
  },

  "identify-tech-risks": {
    taskId: "identify-tech-risks",
    helper: "architect",
    guidancePrompt: `Identify and mitigate technical risks:

1. Risk Categories:
- Technical Complexity (can we build this?)
- Scaling Risks (will it handle growth?)
- Third-Party Dependencies (what if X goes down?)
- Security Vulnerabilities (what could go wrong?)
- Cost Overruns (hidden fees?)

2. For Each Risk:
- Description (what's the risk?)
- Likelihood (high/medium/low)
- Impact (critical/major/minor)
- Mitigation strategy
- Contingency plan

3. Common Risks to Consider:
- Database scaling at 10k+ users
- API rate limits with third parties
- Cold start times (serverless)
- Real-time performance issues
- Mobile app review delays
- Payment processing compliance
- Data migration complexity

Create risk register:
\`\`\`
RISK: Supabase free tier limits
- Likelihood: Medium
- Impact: Major (app stops working)
- Mitigation: Monitor usage, upgrade plan ready
- Contingency: Migrate to self-hosted Postgres

RISK: OpenAI API costs spike
- Likelihood: High
- Impact: Critical (burn cash fast)
- Mitigation: Rate limiting, caching, usage alerts
- Contingency: Switch to cheaper model or provider
\`\`\``,
    completionCriteria: [
      "5-10 technical risks identified",
      "Likelihood and impact assessed",
      "Mitigation strategies defined",
      "Contingency plans documented",
      "Monitoring plan for each risk"
    ],
    proactiveSuggestions: [
      "Want to prioritize which risks to address first?",
      "Should we build a risk dashboard?",
      "Let's create a technical spike for the highest risk"
    ]
  },

  // L2S2: Crafter - Wireframes & Design
  "create-wireframes": {
    taskId: "create-wireframes",
    helper: "crafter",
    guidancePrompt: `Design core user flow wireframes by:

1. Identify 3 Critical Flows:
- Onboarding (signup → first value)
- Core Action (main feature usage)
- Success State (completion/result)

2. For Each Screen:
- Screen name and purpose
- Key elements (headers, forms, CTAs)
- User actions available
- Navigation flow
- Success/error states

3. Wireframe Format (use text or tools):
\`\`\`
[SCREEN: Landing Page]
┌─────────────────────────┐
│  Logo         Login      │
├─────────────────────────┤
│                          │
│   [Hero Image]           │
│                          │
│   Headline: Big Promise  │
│   Subhead: Quick benefit │
│                          │
│   [CTA Button]           │
│                          │
└─────────────────────────┘

Next: Signup screen
\`\`\`

4. Design Principles:
- Mobile-first (design for small screens)
- Clear hierarchy (guide the eye)
- Minimal cognitive load (one action per screen)
- Accessible (contrast, font size)
- Fast loading (optimize images)

Focus on:
- User flow clarity (no dead ends)
- CTA prominence (make buttons obvious)
- Error state handling (what if it fails?)
- Loading states (what while waiting?)`,
    completionCriteria: [
      "3 core flows wireframed",
      "All screens documented",
      "Navigation flow clear",
      "Mobile and desktop versions",
      "Error and loading states included"
    ],
    proactiveSuggestions: [
      "Want me to suggest design patterns for each screen?",
      "Should we create interactive prototype?",
      "Let's identify micro-interactions to add delight"
    ]
  },

  "design-ui-system": {
    taskId: "design-ui-system",
    helper: "crafter",
    guidancePrompt: `Create a foundational design system by:

1. Color Palette:
- Primary (brand color, main CTAs)
- Secondary (accents, highlights)
- Neutrals (backgrounds, text, borders)
- Semantic (success, warning, error, info)
- Specify hex codes for each

Example:
\`\`\`
Primary: #3B82F6 (blue)
Secondary: #8B5CF6 (purple)
Success: #10B981 (green)
Error: #EF4444 (red)
Neutral-900: #111827 (dark text)
Neutral-50: #F9FAFB (light bg)
\`\`\`

2. Typography:
- Font family (Headings + Body)
- Scale (h1, h2, h3, body, small)
- Weights (regular, medium, bold)
- Line heights

3. Spacing System:
- Base unit (4px or 8px)
- Scale (4, 8, 12, 16, 24, 32, 48, 64px)

4. Component Styles:
- Buttons (primary, secondary, outline)
- Inputs (text, select, checkbox)
- Cards (shadows, borders, padding)
- Alerts (success, warning, error)

5. Layout Patterns:
- Max content width (1200px?)
- Grid system (12-column?)
- Breakpoints (mobile: 640, tablet: 768, desktop: 1024)

Document in Figma or simple guide:
"Use Inter for UI, 16px base size, 8px spacing grid, primary blue for CTAs"`,
    completionCriteria: [
      "Color palette with hex codes",
      "Typography system defined",
      "Spacing scale documented",
      "Core components styled",
      "Design tokens/variables created"
    ],
    proactiveSuggestions: [
      "Want me to generate Tailwind config from this?",
      "Should we find inspiration for each component?",
      "Let's create a component library structure"
    ]
  },

  "create-user-flows": {
    taskId: "create-user-flows",
    helper: "crafter",
    guidancePrompt: `Map detailed user flows with decision points:

1. Flow Components:
- Entry point (where user starts)
- Steps (actions user takes)
- Decision points (if/else branches)
- Success criteria (goal achieved)
- Exit points (where user goes next)

2. Flow Diagram Format:
\`\`\`
[Start] → [Action 1] → {Decision?}
                          ↓ Yes    ↓ No
                    [Action 2]  [Error State]
                          ↓
                    [Success] → [Next Flow]
\`\`\`

3. Key Flows to Map:
- Authentication (signup, login, forgot password)
- Onboarding (first-time experience → aha moment)
- Core feature (main user action → result)
- Settings (account management)
- Error recovery (what if something breaks?)

4. For Each Flow:
- Happy path (everything works)
- Edge cases (validation errors, network issues)
- Time estimates (how long should this take?)
- Drop-off points (where might users leave?)

5. Optimization Ideas:
- Remove unnecessary steps
- Add progress indicators
- Provide clear error messages
- Enable quick wins early
- Reduce form fields`,
    completionCriteria: [
      "Core flows mapped with diagrams",
      "Decision points identified",
      "Error states documented",
      "Time estimates for each flow",
      "Optimization opportunities noted"
    ],
    proactiveSuggestions: [
      "Want to calculate expected conversion rates?",
      "Should we A/B test variations?",
      "Let's identify friction points to optimize"
    ]
  },

  // L2S3: Hacker - Repo & Milestones
  "setup-repository": {
    taskId: "setup-repository",
    helper: "hacker",
    guidancePrompt: `Initialize professional repository by:

1. Create Repository:
- Platform: GitHub (or GitLab, Bitbucket)
- Name: Clear, lowercase, hyphens (e.g., my-app-name)
- Visibility: Private (until launch) or Public
- Initialize with README

2. README.md Structure:
\`\`\`markdown
# Project Name

Quick description (one sentence)

## 🚀 Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## 📋 Features

- Feature 1
- Feature 2

## 🛠️ Tech Stack

- Next.js 14
- PostgreSQL
- Tailwind CSS

## 📝 License

MIT
\`\`\`

3. Essential Files:
- \`.gitignore\` (node_modules, .env, build files)
- \`.env.example\` (template for environment variables)
- \`package.json\` (dependencies and scripts)
- \`CONTRIBUTING.md\` (if open source)
- \`LICENSE\` (MIT recommended for projects)

4. Folder Structure:
\`\`\`
/src or /app
  /components (reusable UI)
  /lib (utilities, helpers)
  /pages or /app (routes)
/public (static assets)
/tests
\`\`\`

5. Branch Strategy:
- \`main\` (production-ready code)
- \`develop\` (integration branch)
- \`feature/*\` (new features)
- \`fix/*\` (bug fixes)

6. Git Workflow:
- Commit message format: "type: description" (feat:, fix:, docs:)
- Pull request template
- Branch protection rules`,
    completionCriteria: [
      "Repository created and initialized",
      "README with setup instructions",
      "Essential config files added",
      "Folder structure created",
      "Git workflow documented"
    ],
    proactiveSuggestions: [
      "Want me to generate .gitignore and config files?",
      "Should we set up PR templates?",
      "Let's create initial commit with project structure"
    ]
  },

  "define-data-model": {
    taskId: "define-data-model",
    helper: "hacker",
    guidancePrompt: `Design database schema and relationships:

1. Identify Entities (Tables):
- Users (authentication, profile)
- Core domain entities (your app's main data)
- Relationship tables (many-to-many)
- Metadata tables (settings, logs)

2. For Each Table:
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

Define:
- Primary key (usually UUID or auto-increment ID)
- Required fields (NOT NULL)
- Unique constraints
- Foreign keys (relationships)
- Indexes (for query performance)
- Timestamps (created_at, updated_at)

3. Relationships:
- One-to-One (user → profile)
- One-to-Many (user → posts)
- Many-to-Many (users ↔ teams, via user_teams table)

4. Schema Diagram:
\`\`\`
users
- id (PK)
- email

posts
- id (PK)
- user_id (FK → users.id)
- title
- content

comments
- id (PK)
- post_id (FK → posts.id)
- user_id (FK → users.id)
- content
\`\`\`

5. Considerations:
- Soft deletes vs. hard deletes (deleted_at?)
- JSON columns for flexible data
- Full-text search (if needed)
- Audit trail (who changed what when)

6. Migrations:
- Use migration tool (Supabase, Prisma, TypeORM)
- Version control your schema
- Rollback strategy`,
    completionCriteria: [
      "All tables identified and defined",
      "Relationships documented",
      "Schema diagram created",
      "Indexes planned for performance",
      "Migration strategy defined"
    ],
    proactiveSuggestions: [
      "Want me to generate SQL or Prisma schema?",
      "Should we validate this schema with your features?",
      "Let's identify potential query bottlenecks"
    ]
  },

  "plan-milestones": {
    taskId: "plan-milestones",
    helper: "hacker",
    guidancePrompt: `Break MVP into weekly milestones by:

1. Milestone Structure:
- Week 1-2: Foundation (auth, database, base UI)
- Week 3-4: Core Feature #1
- Week 5-6: Core Feature #2 + Polish
- Week 7-8: Testing + Launch Prep

2. For Each Milestone:
\`\`\`
Milestone 1: Foundation (Week 1-2)
Goal: User can sign up and see empty dashboard

Tasks:
□ Set up Next.js project
□ Configure Supabase
□ Build auth flow (signup, login, logout)
□ Create base layout and navigation
□ Deploy to Vercel (staging)

Deliverable: Live staging app with working auth
\`\`\`

3. Task Breakdown:
- Each task = 2-8 hours of work
- Clear acceptance criteria
- Owner assigned (if team)
- Dependencies noted

4. Estimation Tips:
- Be realistic (double your first estimate)
- Buffer for unknowns (20% extra time)
- Account for debugging and polish
- Include code review time

5. Definition of Done:
- Code merged to main
- Tests passing
- Deployed to staging
- Demo-able to users
- Documented in README

6. Risk Management:
- Identify blockers early
- Have parallel work streams
- Cut scope if needed (MVP = Minimum)

Create a simple roadmap:
- [ ] Week 1: Setup + Auth
- [ ] Week 2: Database + API
- [ ] Week 3: Feature 1 (core flow)
- [ ] Week 4: Feature 2 + Polish
- [ ] Week 5: Launch 🚀`,
    completionCriteria: [
      "4-8 weekly milestones defined",
      "Each milestone has clear goal",
      "Tasks broken down with estimates",
      "Dependencies identified",
      "Launch date set"
    ],
    proactiveSuggestions: [
      "Want to convert this to GitHub issues?",
      "Should we create a Gantt chart?",
      "Let's identify the critical path to launch"
    ]
  },

  "setup-ci-cd": {
    taskId: "setup-ci-cd",
    helper: "hacker",
    guidancePrompt: `Set up continuous integration and deployment:

1. CI Pipeline (GitHub Actions, GitLab CI):
\`\`\`yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - run: npm run lint
\`\`\`

2. Automated Checks:
- Linting (ESLint, Prettier)
- Type checking (TypeScript)
- Unit tests (Jest, Vitest)
- Build verification
- Security scanning (npm audit)

3. CD Pipeline (Auto-deploy):
- Staging: Deploy on push to \`develop\` branch
- Production: Deploy on push to \`main\` branch
- Preview: Deploy on PR creation

4. Deployment Targets:
- Vercel (easiest for Next.js)
- Netlify (great for static sites)
- Railway/Render (full-stack apps)
- Custom (AWS, DigitalOcean)

5. Environment Management:
- Development (.env.local)
- Staging (.env.staging)
- Production (.env.production)

6. Deployment Checklist:
- Environment variables synced
- Database migrations run
- Assets optimized
- Error tracking enabled
- Health check endpoint working

7. Monitoring Post-Deploy:
- Error rates
- Response times
- Build times
- Deployment success rate`,
    completionCriteria: [
      "CI pipeline configured",
      "Automated tests running",
      "CD to staging working",
      "Production deployment process defined",
      "Rollback strategy documented"
    ],
    proactiveSuggestions: [
      "Want me to write GitHub Actions config?",
      "Should we set up deployment notifications?",
      "Let's add performance budgets to CI"
    ]
  },

  "create-deployment-plan": {
    taskId: "create-deployment-plan",
    helper: "hacker",
    guidancePrompt: `Create comprehensive deployment strategy:

1. Pre-Launch Checklist:
□ Domain registered and DNS configured
□ SSL certificates installed
□ Environment variables set
□ Database backed up
□ Error tracking configured (Sentry)
□ Analytics installed
□ Performance monitoring ready
□ Rate limiting implemented
□ Security headers configured

2. Launch Day Plan:
- T-24h: Final QA testing
- T-12h: Database migration dry run
- T-1h: Team standby
- T-0: Deploy to production
- T+1h: Smoke tests
- T+6h: Monitor metrics
- T+24h: Review and iterate

3. Rollback Strategy:
- Keep previous version deployed
- Database backup + restore plan
- Feature flags for quick disable
- Health check endpoints
- Rollback trigger criteria

4. Post-Launch Monitoring:
\`\`\`
Week 1: Watch everything closely
- Error rates
- Response times
- User signups
- Core feature usage
- Support requests

Week 2-4: Optimize
- Fix critical bugs
- Improve performance
- Gather user feedback
- Plan next iteration
\`\`\`

5. Scaling Checkpoints:
- 100 users: Optimize queries
- 1,000 users: Add caching
- 10,000 users: Consider CDN
- 100,000 users: Database scaling

6. Disaster Recovery:
- Backup frequency (daily, hourly?)
- Recovery time objective (RTO)
- Recovery point objective (RPO)
- Incident response plan`,
    completionCriteria: [
      "Pre-launch checklist complete",
      "Launch timeline defined",
      "Rollback strategy documented",
      "Monitoring plan in place",
      "Disaster recovery plan ready"
    ],
    proactiveSuggestions: [
      "Want to do a deployment dry run?",
      "Should we create runbook for common issues?",
      "Let's set up alerting for critical metrics"
    ]
  },

  "write-api-specs": {
    taskId: "write-api-specs",
    helper: "hacker",
    guidancePrompt: `Document API specifications using OpenAPI/Swagger:

1. API Overview:
- Base URL (https://api.yourapp.com)
- Authentication method (JWT Bearer tokens)
- Rate limiting (100 req/min per user)
- Versioning strategy (/v1/...)

2. For Each Endpoint:
\`\`\`yaml
POST /api/v1/posts
Description: Create a new post
Auth: Required (Bearer token)

Request Body:
{
  "title": "string (required, max 100 chars)",
  "content": "string (required, max 5000 chars)",
  "tags": ["string"] (optional)
}

Response 201:
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "created_at": "timestamp"
}

Response 400:
{
  "error": "Validation error",
  "details": ["title is required"]
}

Response 401:
{
  "error": "Unauthorized"
}
\`\`\`

3. Key Sections:
- Authentication flow
- Error response format (consistent across all endpoints)
- Pagination (limit, offset, cursor)
- Filtering and sorting
- Webhooks (if applicable)

4. Data Types:
- Use JSON
- Consistent naming (camelCase or snake_case)
- ISO 8601 for dates
- UUIDs for IDs
- Clear type annotations

5. Documentation Tools:
- Swagger UI (interactive docs)
- Postman collections
- Code examples (curl, JavaScript, Python)

6. Versioning Strategy:
- URL versioning (/v1/, /v2/)
- Header versioning (Accept: application/vnd.api+json; version=1)
- Deprecation warnings
- Migration guides`,
    completionCriteria: [
      "All endpoints documented",
      "Request/response schemas defined",
      "Authentication flow described",
      "Error codes documented",
      "Example requests provided"
    ],
    proactiveSuggestions: [
      "Want me to generate Swagger YAML?",
      "Should we create Postman collection?",
      "Let's add rate limiting specs"
    ]
  },

  // Continue with L3S1, L3S2, L3S3...
  // (For brevity, I'll create a few more key ones)

  "setup-dev-environment": {
    taskId: "setup-dev-environment",
    helper: "hacker",
    guidancePrompt: `Set up local development environment:

1. Prerequisites:
- Node.js (v18+ recommended)
- Package manager (npm, yarn, pnpm)
- Git
- Code editor (VS Code recommended)
- Database (PostgreSQL, Docker)

2. Clone and Install:
\`\`\`bash
git clone <repo-url>
cd <project-name>
npm install
\`\`\`

3. Environment Setup:
\`\`\`bash
# Copy example env file
cp .env.example .env.local

# Fill in required values:
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
\`\`\`

4. Run Development Server:
\`\`\`bash
npm run dev
# Open http://localhost:3000
\`\`\`

5. VS Code Extensions:
- ESLint
- Prettier
- TypeScript
- Tailwind CSS IntelliSense
- GitLens

6. Development Tools:
- Hot reload configured
- TypeScript watch mode
- Database GUI (TablePlus, pgAdmin)
- API testing (Postman, Bruno)

7. Common Commands:
\`\`\`bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Check code quality
npm run test      # Run tests
npm run db:push   # Update database schema
\`\`\`

8. Troubleshooting Guide:
- Port already in use → kill process or use different port
- Module not found → npm install
- Database connection error → check DATABASE_URL
- Build errors → clear .next folder and rebuild`,
    completionCriteria: [
      "Development environment documented",
      "Setup instructions clear and tested",
      "All environment variables documented",
      "Common issues and solutions listed",
      "Development workflow explained"
    ],
    proactiveSuggestions: [
      "Want me to create a setup script?",
      "Should we add Docker for local development?",
      "Let's create a video walkthrough of setup"
    ]
  },

  "build-auth": {
    taskId: "build-auth",
    helper: "hacker",
    guidancePrompt: `Implement authentication system:

1. Choose Auth Strategy:
- Supabase Auth (easiest, full-featured)
- NextAuth.js (flexible, self-hosted)
- Auth0/Clerk (managed services)
- Custom JWT (most control, most work)

2. Features to Implement:
- Email/password signup
- Email verification
- Login
- Logout
- Password reset flow
- Session management
- Protected routes

3. User Flow:
\`\`\`
Signup:
1. User submits email + password
2. Hash password (bcrypt, argon2)
3. Create user record
4. Send verification email
5. Redirect to check email page

Login:
1. User submits credentials
2. Verify password hash
3. Generate session/JWT
4. Set secure cookie
5. Redirect to dashboard
\`\`\`

4. Security Best Practices:
- HTTPS only in production
- Secure, httpOnly cookies
- CSRF protection
- Rate limiting on auth endpoints
- Strong password requirements
- Account lockout after failed attempts
- Email verification required

5. Implementation Example (Supabase):
\`\`\`typescript
// Signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
})

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
})

// Get session
const { data: { session } } = await supabase.auth.getSession()

// Protected route middleware
export async function middleware(req: NextRequest) {
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.redirect('/login')
  }
}
\`\`\`

6. OAuth Providers (Optional):
- Google
- GitHub
- Apple

7. Testing Checklist:
□ Signup with valid email
□ Signup with duplicate email (should error)
□ Login with correct password
□ Login with wrong password (should error)
□ Logout clears session
□ Protected routes require auth
□ Password reset flow works
□ Email verification works`,
    completionCriteria: [
      "Auth system implemented and tested",
      "Signup and login flows working",
      "Session management secure",
      "Protected routes enforced",
      "Password reset functional"
    ],
    proactiveSuggestions: [
      "Want to add OAuth providers?",
      "Should we implement magic link login?",
      "Let's add two-factor authentication"
    ]
  },

  "build-core-feature-1": {
    taskId: "build-core-feature-1",
    helper: "hacker",
    guidancePrompt: `Build your first core feature:

1. Feature Scope:
- What: [Define the feature]
- Why: [User value this delivers]
- How: [Technical approach]

2. Implementation Steps:
A. Database schema for feature
B. API endpoints (CRUD operations)
C. Frontend UI components
D. State management
E. Error handling
F. Loading states

3. API Layer Example:
\`\`\`typescript
// app/api/features/route.ts
export async function POST(req: Request) {
  const { userId } = await getSession(req)
  const body = await req.json()
  
  // Validate input
  const validated = schema.parse(body)
  
  // Save to database
  const result = await db.insert(features).values({
    userId,
    ...validated
  })
  
  return Response.json(result)
}
\`\`\`

4. Frontend Component Example:
\`\`\`typescript
export function FeatureForm() {
  const [isLoading, setIsLoading] = useState(false)
  
  async function onSubmit(data: FormData) {
    setIsLoading(true)
    try {
      await fetch('/api/features', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      toast.success('Created!')
    } catch (error) {
      toast.error('Failed to create')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={onSubmit}>
      {/* form fields */}
      <Button disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
\`\`\`

5. Testing Scenarios:
- Happy path (everything works)
- Validation errors (bad input)
- Network errors (API down)
- Loading states (show spinner)
- Empty states (no data yet)
- Edge cases (max limits)

6. Polish:
- Success feedback (toast, animation)
- Error messages (helpful, specific)
- Loading indicators (skeleton, spinner)
- Optimistic updates (instant feedback)
- Keyboard shortcuts (power users)

7. Deployment:
- Test locally thoroughly
- Deploy to staging
- QA on staging
- Deploy to production
- Monitor for errors`,
    completionCriteria: [
      "Feature fully functional",
      "Database schema implemented",
      "API endpoints working",
      "UI components built",
      "Error handling in place",
      "Feature deployed to production"
    ],
    proactiveSuggestions: [
      "Want me to review your code?",
      "Should we add analytics tracking?",
      "Let's write tests for this feature"
    ]
  },

  // Adding key tasks from other levels

  "deploy-production": {
    taskId: "deploy-production",
    helper: "hacker",
    guidancePrompt: `Deploy application to production:

1. Pre-Deployment Checklist:
□ All tests passing
□ Environment variables configured
□ Domain and SSL ready
□ Database migrations tested
□ Error tracking enabled
□ Analytics configured
□ Performance optimized
□ Security review completed

2. Deployment Steps:
A. Choose hosting platform (Vercel, Netlify, Railway)
B. Connect repository
C. Configure build settings
D. Set environment variables
E. Configure custom domain
F. Enable automatic deployments

3. Vercel Deployment:
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or push to main branch for auto-deploy
\`\`\`

4. Environment Setup:
- Production database (separate from dev)
- Environment variables (secrets management)
- API keys and tokens
- Third-party service configs

5. Post-Deployment Verification:
□ Site loads correctly
□ Auth works
□ Database connections work
□ API endpoints respond
□ Images load
□ Forms submit
□ No console errors

6. Monitoring Setup:
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (UptimeRobot)
- Log aggregation (Logtail)

7. Scaling Configuration:
- CDN for static assets
- Database connection pooling
- Caching strategy (Redis if needed)
- Rate limiting

8. Rollback Plan:
- Keep previous deployment live
- Database backup before migration
- Quick rollback command ready
- Team communication channel active`,
    completionCriteria: [
      "Application deployed to production",
      "Custom domain configured",
      "SSL enabled",
      "Monitoring and error tracking active",
      "Rollback plan documented"
    ],
    proactiveSuggestions: [
      "Want to set up staging environment?",
      "Should we create deployment runbook?",
      "Let's configure alerting for downtime"
    ]
  },

  "create-landing-page": {
    taskId: "create-landing-page",
    helper: "hypebeast",
    guidancePrompt: `Design high-converting landing page:

1. Hero Section (Above Fold):
- Compelling headline (5-10 words, clear benefit)
- Subheadline (15-20 words, who it's for, what it does)
- Primary CTA (clear action: "Start Free Trial", "Get Early Access")
- Hero image/video (show product in action)

Example:
\`\`\`
Headline: Build Your MVP in 30 Days, Not 6 Months
Subheadline: AI-powered project helper that guides solo founders from idea to launch with daily coaching and accountability
CTA: [Start Your Journey Free →]
\`\`\`

2. Social Proof Section:
- User testimonials (real names, photos, specific results)
- Logos (if B2B)
- Numbers (users, reviews, achievements)
- Tweets/social mentions

3. Features/Benefits Section:
- 3-5 key features
- Focus on BENEFITS not features
- Bad: "AI-powered chat" → Good: "Get unstuck in minutes with expert AI guidance"
- Use icons/illustrations
- Emphasize outcomes

4. How It Works (3 Steps):
- Step 1: [Simple action]
- Step 2: [Core value delivery]
- Step 3: [Desired outcome]

5. Pricing Section:
- Clear tiers (if applicable)
- Highlight recommended plan
- Money-back guarantee
- FAQ for objections

6. Final CTA:
- Repeat primary CTA
- Add urgency (if authentic)
- Remove friction (no credit card, free trial, cancel anytime)

7. Technical Requirements:
- Fast loading (< 2 seconds)
- Mobile-responsive
- Clear navigation
- Working forms
- Analytics tracking
- A/B testing ready

8. Copywriting Tips:
- Write for skimmers (headers tell the story)
- Use active voice ("You'll launch faster" not "Launches will be faster")
- Address objections ("No coding required", "Cancel anytime")
- Create urgency authentically ("50 early access spots left")
- Focus on transformation ("From idea to launched in 30 days")`,
    completionCriteria: [
      "Landing page live with custom domain",
      "All sections completed",
      "Mobile-responsive design",
      "CTA tracking working",
      "Page load < 3 seconds"
    ],
    proactiveSuggestions: [
      "Want me to critique your copy?",
      "Should we A/B test headline variations?",
      "Let's add video demo to hero section"
    ]
  },

  "launch-product": {
    taskId: "launch-product",
    helper: "hypebeast",
    guidancePrompt: `Execute multi-channel product launch:

1. Launch Channels:
□ Product Hunt (aim for top 5)
□ Twitter/X (thread + announcement)
□ Hacker News (Show HN)
□ Reddit (relevant subreddits)
□ LinkedIn (personal network)
□ Indie Hackers
□ Email list (if you have one)

2. Product Hunt Strategy:
- Launch on Tuesday-Thursday (best traffic)
- Submit at 12:01 AM PST
- Prepare: tagline, description, screenshots, video
- First comment: Story behind the product
- Respond to ALL comments
- Ask friends to support (but no vote manipulation)

3. Tweet Thread Template:
\`\`\`
1/ 🚀 Today I'm launching [Product Name]!

After [X months/years] of building, I'm finally sharing [one-line description]

2/ The Problem 😤
[Describe pain point you experienced]

3/ The Solution ✨
[How your product solves it]

4/ Key Features 🎯
• [Feature 1 + benefit]
• [Feature 2 + benefit]
• [Feature 3 + benefit]

5/ Why I Built This 💭
[Personal story, motivation]

6/ Try It Free 🎁
[Link + special offer]

Show some love if you think this is useful! 🙏
[Link to Product Hunt]
\`\`\`

4. Hacker News Tips:
- Title: "Show HN: [Product Name] – [Clear Description]"
- First comment: Share technical details, tech stack
- Be humble, honest about limitations
- Respond thoughtfully to all feedback
- Don't ask for votes

5. Launch Day Timeline:
- 12:00 AM PST: Submit to Product Hunt
- 8:00 AM: Post Twitter thread
- 9:00 AM: Post to Reddit (relevant subs)
- 10:00 AM: Post to Hacker News
- Throughout day: Respond to ALL comments
- Evening: Send email to supporters
- Next day: Post LinkedIn update

6. Content Formats:
- 2-minute demo video
- Screenshots with annotations
- GIF of key interaction
- Comparison table (you vs. competitors)
- Behind-the-scenes story

7. Engagement Strategy:
- Respond to every comment within 1 hour
- Thank supporters publicly
- Address criticism professionally
- Offer special discounts for launch day
- Collect email addresses

8. Metrics to Track:
- Signups/users
- Traffic sources
- Conversion rate
- Social engagement
- Press mentions
- Product Hunt rank`,
    completionCriteria: [
      "Launch executed across 3+ channels",
      "Product Hunt submission live",
      "Social posts published",
      "All comments responded to",
      "Metrics tracked and documented"
    ],
    proactiveSuggestions: [
      "Want me to review your launch copy?",
      "Should we schedule posts in advance?",
      "Let's create a press kit for journalists"
    ]
  },

  "analyze-metrics": {
    taskId: "analyze-metrics",
    helper: "sensei",
    guidancePrompt: `Analyze growth metrics and identify opportunities:

1. Key Metrics Framework (AARRR):
- Acquisition: Where users come from
- Activation: % completing onboarding
- Retention: % coming back D1/D7/D30
- Referral: Users inviting others
- Revenue: Conversion to paid

2. Data to Collect:
\`\`\`
Acquisition:
- Traffic sources (direct, social, search, referral)
- Signup conversion rate
- Cost per acquisition (CPA)

Activation:
- Onboarding completion rate
- Time to first value
- % of users reaching "aha moment"

Retention:
- D1 retention (% back next day)
- D7 retention (% back in 7 days)
- D30 retention (% back in 30 days)
- Churn rate

Engagement:
- DAU/MAU ratio (daily active / monthly active)
- Session length
- Feature usage rates
- Core action completion

Revenue:
- Free to paid conversion
- Average revenue per user (ARPU)
- Customer lifetime value (LTV)
- Churn rate
\`\`\`

3. Analysis Process:
A. Define your North Star Metric
B. Build funnel from acquisition to goal
C. Identify biggest drop-off points
D. Segment users (cohorts, channels, behaviors)
E. Find correlations (what do retained users do?)

4. Example Analysis:
\`\`\`
Funnel:
1. 1000 visitors
2. 100 signups (10% conversion) ← Opportunity?
3. 50 onboarding complete (50%) ← BIG DROP
4. 20 return D7 (40% retention)
5. 5 become paid (25% conversion)

Insight: Onboarding is broken! Only 50% complete it.
Action: Redesign onboarding to increase completion.
Expected impact: 50% → 80% = +30 active users
\`\`\`

5. Segmentation:
- By source (Twitter users vs. Product Hunt)
- By persona (use case, role, company size)
- By behavior (power users vs. casual)
- By cohort (week of signup)

6. Tools:
- Analytics: Mixpanel, Amplitude, PostHog
- Session replay: FullStory, LogRocket
- Heatmaps: Hotjar
- User feedback: Typeform, Sprig

7. Reporting Template:
\`\`\`
Weekly Growth Report:
- New signups: 50 (+25% vs last week)
- Active users: 120 (40% WoW growth)
- Retention D7: 35% (target: 40%)
- Revenue: $500 MRR (+$200)

Top wins:
- Feature X drove 20% more engagement
- Onboarding improvement → +10% activation

Concerns:
- Churn increased to 8% (investigate)
- Signup conversion dropped (A/B test needed)

Next week focus:
- Fix onboarding step 3 drop-off
- Launch referral program
\`\`\``,
    completionCriteria: [
      "Key metrics identified and tracked",
      "Funnels analyzed for drop-offs",
      "User segments defined",
      "Biggest opportunities prioritized",
      "Weekly reporting established"
    ],
    proactiveSuggestions: [
      "Want me to suggest experiments to run?",
      "Should we set up automated dashboards?",
      "Let's identify your North Star Metric"
    ]
  },

  "optimize-onboarding": {
    taskId: "optimize-onboarding",
    helper: "sensei",
    guidancePrompt: `Improve user onboarding for activation:

1. Onboarding Goals:
- Get user to "aha moment" in < 5 minutes
- Minimize steps to value
- Teach through doing (not reading)
- Create quick win feeling
- Build momentum for continued use

2. Analyze Current Onboarding:
- Map every step (signup → first value)
- Measure completion rate per step
- Identify where users drop off
- Time how long each step takes
- Collect qualitative feedback

3. Optimization Framework:
A. Remove Friction
- Eliminate unnecessary fields
- Use smart defaults
- Allow "skip for now"
- Reduce choices (paradox of choice)

B. Show Value Fast
- Lead with benefit, not setup
- Empty state → filled state quickly
- Provide sample data
- Highlight core feature first

C. Guide Without Annoying
- Progressive disclosure (info when needed)
- Contextual tooltips (not tour)
- Task checklist with progress bar
- Celebrate each completion

D. Personalize Experience
- Ask 2-3 questions to customize
- Show relevant examples
- Adapt based on use case
- Remember progress if they leave

4. Best Practices:
\`\`\`
Bad Onboarding:
1. Read 5 tutorial screens
2. Fill out profile completely
3. Watch 3-minute video
4. Explore on your own
Result: 20% completion

Good Onboarding:
1. "Let's create your first [X]" → does it for them
2. "Great! Now try [Y]" → one more action
3. "You're ready! Here's your dashboard"
Result: 70% completion + aha moment
\`\`\`

5. Aha Moment Examples:
- Slack: Team sends first message
- Dropbox: First file synced across devices
- Airbnb: First listing booked
- Your app: [What's the moment users get it?]

6. Implement:
- Progress indicator (Step 2 of 3)
- Quick wins (checkmarks, celebrations)
- Time estimate ("2 min to get started")
- Option to skip (but encourage completion)
- Re-engagement for incomplete (email)

7. Testing:
- A/B test variations (# of steps, order, copy)
- User interviews (watch people onboard)
- Heatmaps and recordings
- Measure: completion rate, time to complete, D1 retention

8. Post-Onboarding:
- Welcome email with resources
- In-app guidance for next steps
- Personalized recommendations
- Checklist for advanced features`,
    completionCriteria: [
      "Onboarding flow optimized",
      "Time to aha moment reduced",
      "Completion rate increased",
      "User feedback collected",
      "A/B tests running"
    ],
    proactiveSuggestions: [
      "Want me to audit your current onboarding?",
      "Should we add interactive tutorial?",
      "Let's create sample data for new users"
    ]
  },
};

/**
 * Get task-specific guidance prompt
 */
export function getTaskGuidance(taskId: string): TaskPrompt | undefined {
  return TASK_PROMPTS[taskId];
}

/**
 * Get all tasks for a specific helper
 */
export function getHelperTasks(helper: string): TaskPrompt[] {
  return Object.values(TASK_PROMPTS).filter(task => task.helper === helper);
}

/**
 * Build enhanced system prompt with task guidance
 */
export function buildTaskAwarePrompt(taskIds: string[]): string {
  const tasks = taskIds
    .map(id => TASK_PROMPTS[id])
    .filter(Boolean);

  if (tasks.length === 0) return "";

  let prompt = "\n\n---\n\n**TASK COMPLETION GUIDANCE:**\n\n";
  prompt += "You have access to detailed guidance for helping users complete these tasks:\n\n";

  tasks.forEach((task) => {
    prompt += `**${task.taskId}:**\n`;
    prompt += `${task.guidancePrompt}\n\n`;
    prompt += `**Completion Criteria:**\n`;
    task.completionCriteria.forEach(criteria => {
      prompt += `- ${criteria}\n`;
    });
    prompt += `\n**Proactive Suggestions:**\n`;
    task.proactiveSuggestions.forEach(suggestion => {
      prompt += `- ${suggestion}\n`;
    });
    prompt += `\n---\n\n`;
  });

  prompt += "When users ask for help with these tasks, reference this guidance to provide comprehensive, actionable support.";

  return prompt;
}

