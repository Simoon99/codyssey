-- Seed data for Codyssey levels and tasks

-- Insert levels (no XP gating - users can freely roam through all levels)
INSERT INTO levels (id, key, title, description, xp_required, unlocks) VALUES
(1, 'spark', 'Spark', 'Find your idea and validate your vision', 0, '{"helpers": ["muse"]}'),
(2, 'build_prep', 'Build Prep', 'Plan your tech stack and architecture', 0, '{"helpers": ["architect"]}'),
(3, 'core_build', 'Core Build', 'Build your MVP with essential features', 0, '{"helpers": ["hacker", "crafter"]}'),
(4, 'launch', 'Launch', 'Ship your product to the world', 0, '{"helpers": ["hypebeast"]}'),
(5, 'grow', 'Grow', 'Scale and optimize for growth', 0, '{"helpers": ["sensei"]}')
ON CONFLICT (id) DO NOTHING;

-- Insert tasks for Level 1: Spark (Ideation & Validation)
-- Step 1: Muse - Problem & Market scan
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(1, 'define-problem', 'Define the Problem', 'Clearly articulate the problem you''re solving, who it''s for, and why it matters', true, 20, 1),
(1, 'research-competition', 'Research Competition', 'Identify 3-5 competitors and understand their strengths/weaknesses', true, 15, 2),
-- Step 1 optional enhancements
(1, 'identify-target-audience', 'Identify Target Audience', 'Create detailed personas of your ideal 3 users with pain points', false, 15, 1.5),
(1, 'market-size-analysis', 'Market Size Analysis', 'Estimate TAM/SAM/SOM for your market opportunity', false, 15, 1.7),

-- Step 2: Architect - Hypotheses & Validation
(1, 'brainstorm-solutions', 'Brainstorm Solutions', 'Generate multiple solution ideas and tradeoffs with Muse', true, 15, 3),
(1, 'validate-idea', 'Validate Your Idea', 'Talk to 5+ potential users and document feedback', true, 25, 4),
-- Step 2 optional enhancements
(1, 'user-interview-analysis', 'Analyze Interview Patterns', 'Summarize recurring themes and insights from user interviews', false, 20, 3.5),
(1, 'create-value-hypothesis', 'Create Value Hypothesis', 'Write your core value prop and why users will care', false, 15, 3.7),

-- Step 3: Crafter - MVP Scope
(1, 'define-mvp-scope', 'Define MVP Scope', 'List the 3-5 core features for your MVP with clear success metrics', true, 25, 5),
-- Step 3 optional enhancements
(1, 'create-user-stories', 'Create User Stories', 'Write 5-10 user stories for your core features', false, 20, 5.2),
(1, 'design-success-metrics', 'Design Success Metrics', 'Define what "success" looks like for each feature', false, 15, 5.5)
ON CONFLICT (slug) DO NOTHING;

-- Insert tasks for Level 2: Build Prep (Architecture & Planning)
-- Step 1: Architect - Stack & Architecture
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(2, 'choose-tech-stack', 'Choose Tech Stack', 'Select your frontend, backend, and database technologies with reasoning', true, 30, 1),
(2, 'design-architecture', 'Design Architecture', 'Create a high-level system architecture diagram with data flow', true, 30, 2),
-- Step 1 optional enhancements
(2, 'document-dependencies', 'Document Dependencies', 'List all external APIs, libraries, and services you''ll need', false, 15, 1.5),
(2, 'identify-tech-risks', 'Identify Tech Risks', 'Spot potential bottlenecks and plan mitigation strategies', false, 20, 1.8),

-- Step 2: Crafter - Wireframes & Design
(2, 'create-wireframes', 'Create Wireframes', 'Wireframe your key user flows: onboard → core action → success state', true, 20, 3),
-- Step 2 optional enhancements
(2, 'design-ui-system', 'Design UI System', 'Create a basic design system with colors, typography, and components', false, 25, 3.3),
(2, 'create-user-flows', 'Create User Flows', 'Map out detailed user flows with decision points', false, 15, 3.5),

-- Step 3: Hacker - Repo & Data & Milestones
(2, 'setup-repository', 'Setup Repository', 'Initialize Git repo, README, and contribution guidelines', true, 20, 4),
(2, 'define-data-model', 'Define Data Model', 'Design your database schema with all relationships', true, 30, 5),
(2, 'plan-milestones', 'Plan Milestones', 'Break your MVP into 2-4 weekly milestones with deliverables', true, 20, 6),
-- Step 3 optional enhancements
(2, 'setup-ci-cd', 'Setup CI/CD Pipeline', 'Configure automated testing and deployment pipeline', false, 25, 6.2),
(2, 'create-deployment-plan', 'Create Deployment Plan', 'Document infrastructure, hosting, and deployment strategy', false, 20, 6.5),
(2, 'write-api-specs', 'Write API Specifications', 'Document all APIs with request/response examples', false, 15, 6.7)
ON CONFLICT (slug) DO NOTHING;

-- Insert tasks for Level 3: Core Build (MVP Implementation)
-- Step 1: Hacker - Foundation
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(3, 'setup-dev-environment', 'Setup Dev Environment', 'Configure local development environment and tooling', true, 20, 1),
(3, 'build-auth', 'Build Authentication', 'Implement user signup, login, and session management', true, 40, 2),
(3, 'build-core-feature-1', 'Build Core Feature #1', 'Complete your first essential feature with basic tests', true, 50, 3),
-- Step 1 optional enhancements
(3, 'setup-logging-monitoring', 'Setup Logging & Monitoring', 'Add structured logging and error tracking', false, 20, 1.5),
(3, 'document-setup-guide', 'Document Setup Guide', 'Write detailed dev environment setup instructions', false, 15, 2.5),

-- Step 2: Crafter - Features & UI
(3, 'build-core-feature-2', 'Build Core Feature #2', 'Complete your second essential feature with UI polish', true, 50, 4),
(3, 'build-core-feature-3', 'Build Core Feature #3', 'Complete your third essential feature', true, 50, 5),
(3, 'implement-ui', 'Implement UI', 'Build a polished, cohesive user interface with design consistency', true, 40, 6),
-- Step 2 optional enhancements
(3, 'add-animations', 'Add Animations & Transitions', 'Enhance UX with smooth animations and micro-interactions', false, 25, 4.5),
(3, 'implement-accessibility', 'Implement Accessibility', 'Add ARIA labels, keyboard navigation, and screen reader support', false, 20, 6.2),
(3, 'optimize-performance', 'Optimize Performance', 'Improve load times and runtime performance', false, 20, 6.5),

-- Step 3: Hacker - Hardening & Tests
(3, 'write-tests', 'Write Tests', 'Add unit and integration tests for core features (minimum 70% coverage)', false, 30, 7),
-- Step 3 optional enhancements
(3, 'setup-error-boundaries', 'Setup Error Boundaries', 'Implement comprehensive error handling and recovery', false, 20, 7.2),
(3, 'create-demo-data', 'Create Demo Data', 'Generate sample data to showcase core features', false, 15, 7.4),
(3, 'performance-audit', 'Performance Audit', 'Run performance profiling and fix top issues', false, 25, 7.6)
ON CONFLICT (slug) DO NOTHING;

-- Insert tasks for Level 4: Launch (Go Live & Marketing)
-- Step 1: Hacker - Deployment
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(4, 'deploy-production', 'Deploy to Production', 'Deploy your app to production with proper infrastructure', true, 50, 1),
(4, 'setup-analytics', 'Setup Analytics', 'Implement tracking for key user events and funnels', true, 30, 2),
-- Step 1 optional enhancements
(4, 'setup-monitoring', 'Setup Monitoring & Alerts', 'Configure uptime monitoring and critical alerts', false, 20, 1.5),
(4, 'setup-customer-support', 'Setup Customer Support', 'Configure support channels (email, chat, or help center)', false, 15, 1.8),

-- Step 2: Hypebeast - Landing & Content
(4, 'create-landing-page', 'Create Landing Page', 'Build a compelling landing page with clear value prop and CTA', true, 40, 3),
(4, 'write-launch-content', 'Write Launch Content', 'Prepare tweets, posts, emails, and launch announcement', true, 40, 4),
-- Step 2 optional enhancements
(4, 'create-demo-video', 'Create Demo Video', 'Record a 60-90 second demo video of core features', false, 30, 3.5),
(4, 'design-launch-assets', 'Design Launch Assets', 'Create graphics, banners, and media for social launch', false, 25, 4.2),

-- Step 3: Hypebeast - Launch & Feedback
(4, 'launch-product', 'Launch Product', 'Ship on Product Hunt, Twitter, HN, or other platforms', true, 60, 5),
(4, 'gather-feedback', 'Gather Early Feedback', 'Collect feedback from first 10+ users and document issues', true, 40, 6),
-- Step 3 optional enhancements
(4, 'create-press-kit', 'Create Press Kit', 'Prepare press kit for media outreach', false, 20, 5.3),
(4, 'build-email-list', 'Build Email List', 'Capture emails and create welcome email sequence', false, 25, 6.2),
(4, 'community-engagement', 'Community Engagement', 'Actively engage with launch community and answer questions', false, 15, 6.4)
ON CONFLICT (slug) DO NOTHING;

-- Insert tasks for Level 5: Grow (Retention & Acquisition)
-- Step 1: Hypebeast - Metrics & Growth
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(5, 'analyze-metrics', 'Analyze Key Metrics', 'Review analytics dashboard and identify bottlenecks in funnel', true, 50, 1),
(5, 'plan-growth-experiments', 'Plan Growth Experiments', 'Design 3+ growth experiments with clear hypotheses', true, 50, 2),
-- Step 1 optional enhancements
(5, 'cohort-analysis', 'Cohort Analysis', 'Analyze user cohorts to find patterns and retention drivers', false, 25, 1.5),
(5, 'competitive-benchmarking', 'Competitive Benchmarking', 'Compare metrics against competitors and industry standards', false, 20, 2.2),

-- Step 2: Sensei - Activation & Retention
(5, 'optimize-onboarding', 'Optimize Onboarding', 'Improve user onboarding flow to increase activation rate', true, 60, 3),
(5, 'improve-retention', 'Improve Retention', 'Implement features and messaging to keep users coming back', true, 70, 4),
-- Step 2 optional enhancements
(5, 'implement-push-notifications', 'Implement Push Notifications', 'Add timely, personalized push notifications to drive engagement', false, 30, 3.5),
(5, 'build-habit-loops', 'Build Habit Loops', 'Design features that encourage daily/weekly usage', false, 25, 4.3),
(5, 'create-aha-moment', 'Create AHA Moment', 'Identify and optimize the key moment of value realization', false, 20, 4.5),

-- Step 3: Sensei & Muse - Scale & Referrals
(5, 'reach-100-users', 'Reach 100 Users', 'Grow your user base to 100 active users', true, 100, 5),
(5, 'build-referral-system', 'Build Referral System', 'Implement viral mechanics for user acquisition', false, 70, 5.5),
-- Step 3 optional enhancements
(5, 'create-pricing-strategy', 'Create Pricing Strategy', 'Design monetization model and pricing tiers', false, 35, 5.2),
(5, 'launch-paid-tier', 'Launch Paid Tier', 'Implement subscription or payment system', false, 40, 5.7),
(5, 'plan-next-features', 'Plan Next Features', 'Roadmap for next 3 months based on user feedback', false, 25, 5.9)
ON CONFLICT (slug) DO NOTHING;

