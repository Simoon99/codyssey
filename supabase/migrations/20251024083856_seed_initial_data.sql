-- Seed data for Codyssey levels and tasks

-- Insert levels
INSERT INTO levels (id, key, title, description, xp_required, unlocks) VALUES
(1, 'spark', 'Spark', 'Find your idea and validate your vision', 0, '{"helpers": ["muse"]}'),
(2, 'build_prep', 'Build Prep', 'Plan your tech stack and architecture', 100, '{"helpers": ["architect"]}'),
(3, 'core_build', 'Core Build', 'Build your MVP with essential features', 250, '{"helpers": ["hacker", "crafter"]}'),
(4, 'launch', 'Launch', 'Ship your product to the world', 500, '{"helpers": ["hypebeast"]}'),
(5, 'grow', 'Grow', 'Scale and optimize for growth', 1000, '{"helpers": ["sensei"]}')
ON CONFLICT (id) DO NOTHING;

-- Insert tasks for Level 1: Spark
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(1, 'define-problem', 'Define the Problem', 'Clearly articulate the problem you''re solving and who it''s for', true, 20, 1),
(1, 'research-competition', 'Research Competition', 'Identify 3-5 competitors and understand their strengths/weaknesses', true, 15, 2),
(1, 'brainstorm-solutions', 'Brainstorm Solutions', 'Generate multiple solution ideas with Muse', true, 15, 3),
(1, 'validate-idea', 'Validate Your Idea', 'Talk to 5 potential users and gather feedback', true, 25, 4),
(1, 'define-mvp-scope', 'Define MVP Scope', 'List the 3-5 core features for your MVP', true, 25, 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert tasks for Level 2: Build Prep
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(2, 'choose-tech-stack', 'Choose Tech Stack', 'Select your frontend, backend, and database technologies', true, 30, 1),
(2, 'design-architecture', 'Design Architecture', 'Create a high-level system architecture diagram', true, 30, 2),
(2, 'setup-repository', 'Setup Repository', 'Initialize your Git repository and README', true, 20, 3),
(2, 'define-data-model', 'Define Data Model', 'Design your database schema and relationships', true, 30, 4),
(2, 'create-wireframes', 'Create Wireframes', 'Sketch or wireframe your key user flows', true, 20, 5),
(2, 'plan-milestones', 'Plan Milestones', 'Break your MVP into weekly milestones', true, 20, 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert tasks for Level 3: Core Build
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(3, 'setup-dev-environment', 'Setup Dev Environment', 'Configure your local development environment', true, 20, 1),
(3, 'build-auth', 'Build Authentication', 'Implement user signup and login', true, 40, 2),
(3, 'build-core-feature-1', 'Build Core Feature #1', 'Complete your first essential feature', true, 50, 3),
(3, 'build-core-feature-2', 'Build Core Feature #2', 'Complete your second essential feature', true, 50, 4),
(3, 'build-core-feature-3', 'Build Core Feature #3', 'Complete your third essential feature', true, 50, 5),
(3, 'implement-ui', 'Implement UI', 'Build a polished user interface', true, 40, 6),
(3, 'write-tests', 'Write Tests', 'Add unit and integration tests for core features', false, 30, 7)
ON CONFLICT (slug) DO NOTHING;

-- Insert tasks for Level 4: Launch
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(4, 'deploy-production', 'Deploy to Production', 'Deploy your app to a production environment', true, 50, 1),
(4, 'setup-analytics', 'Setup Analytics', 'Implement basic analytics tracking', true, 30, 2),
(4, 'create-landing-page', 'Create Landing Page', 'Build a compelling landing page', true, 40, 3),
(4, 'write-launch-content', 'Write Launch Content', 'Prepare tweets, posts, and launch announcement', true, 40, 4),
(4, 'launch-product', 'Launch Product', 'Ship on Product Hunt, Twitter, or other platforms', true, 60, 5),
(4, 'gather-feedback', 'Gather Early Feedback', 'Collect feedback from first 10 users', true, 40, 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert tasks for Level 5: Grow
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(5, 'analyze-metrics', 'Analyze Key Metrics', 'Review your analytics and identify bottlenecks', true, 50, 1),
(5, 'optimize-onboarding', 'Optimize Onboarding', 'Improve your user onboarding flow', true, 60, 2),
(5, 'plan-growth-experiments', 'Plan Growth Experiments', 'Design 3 growth experiments to run', true, 50, 3),
(5, 'build-referral-system', 'Build Referral System', 'Implement a way for users to invite others', false, 70, 4),
(5, 'improve-retention', 'Improve Retention', 'Implement features to keep users coming back', true, 70, 5),
(5, 'reach-100-users', 'Reach 100 Users', 'Grow your user base to 100 active users', true, 100, 6)
ON CONFLICT (slug) DO NOTHING;
