-- ============================================
-- COMPLETE DATABASE SETUP FOR CODYSSEY
-- ============================================
-- This script sets up everything you need:
-- 1. Schema (tables, indexes, triggers)
-- 2. Seed data (levels and tasks)
-- 3. Demo user and project for development
-- ============================================
-- Run this ONCE in Supabase SQL Editor
-- Safe to run multiple times
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PART 1: SCHEMA
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  xp_total INTEGER DEFAULT 0 CHECK (xp_total >= 0),
  current_level INTEGER DEFAULT 1 CHECK (current_level BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  goal TEXT,
  location TEXT,
  avatar_url TEXT,
  external_links JSONB DEFAULT '{}'::jsonb,
  problem_statement TEXT,
  target_audience TEXT,
  value_proposition TEXT,
  tech_stack TEXT,
  current_stage TEXT CHECK (current_stage IN ('ideation', 'mvp_build', 'launching', 'growth', 'scaling')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Levels table (seeded data)
CREATE TABLE IF NOT EXISTS levels (
  id INTEGER PRIMARY KEY CHECK (id BETWEEN 1 AND 5),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  xp_required INTEGER NOT NULL CHECK (xp_required >= 0),
  unlocks JSONB DEFAULT '{"helpers": []}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  required BOOLEAN DEFAULT true,
  xp_reward INTEGER DEFAULT 0 CHECK (xp_reward >= 0),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journeys table (tracks user progress per project)
CREATE TABLE IF NOT EXISTS journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  current_level INTEGER DEFAULT 1 CHECK (current_level BETWEEN 1 AND 5),
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Task progress table
CREATE TABLE IF NOT EXISTS task_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id, task_id)
);

-- Chat Sessions Table (NEW SCHEMA)
-- Stores individual chat sessions for each helper
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  helper TEXT NOT NULL CHECK (helper IN ('muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei')),
  thread_id TEXT NOT NULL, -- OpenAI thread ID
  title TEXT NOT NULL, -- Generated from first message
  last_message_preview TEXT, -- Preview of last message
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages Table (NEW SCHEMA)
-- Stores all messages in a chat session
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tool_calls JSONB, -- Store tool calls if any
  search_results JSONB, -- Web search results and citations
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey Progress Table
-- Tracks which level/step each user is currently on per project
CREATE TABLE IF NOT EXISTS journey_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  current_level_id TEXT NOT NULL, -- e.g., "L1S1", "L2S1"
  helper TEXT NOT NULL CHECK (helper IN ('muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei')),
  is_active BOOLEAN DEFAULT true, -- Is this the currently active journey step
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id, current_level_id, helper)
);

-- Helper Level Tasks Table
-- Tracks task completion for each helper's journey level
CREATE TABLE IF NOT EXISTS helper_level_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  helper TEXT NOT NULL CHECK (helper IN ('muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei')),
  level_id TEXT NOT NULL, -- e.g., "L1S1", "L2S1"
  task_id TEXT NOT NULL, -- e.g., "idea-refinement", "create-project-brief"
  task_title TEXT NOT NULL,
  task_goal TEXT,
  is_required BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  xp_reward INTEGER DEFAULT 10,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id, helper, level_id, task_id)
);

-- User App State Table
-- Stores the current application state per user per project
CREATE TABLE IF NOT EXISTS user_app_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  selected_helper TEXT CHECK (selected_helper IN ('muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei')),
  active_orb_id TEXT, -- e.g., "L1S1", "L2S1"
  step_context JSONB, -- Full step context object
  view_mode TEXT CHECK (view_mode IN ('journey', 'chat', 'tasks')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Events table (analytics)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_journeys_user_id ON journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_journeys_project_id ON journeys(project_id);
CREATE INDEX IF NOT EXISTS idx_task_progress_user_id ON task_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_task_progress_project_id ON task_progress(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_project_id ON chat_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_helper ON chat_sessions(helper);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_journey_progress_user_project ON journey_progress(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_journey_progress_helper ON journey_progress(helper);
CREATE INDEX IF NOT EXISTS idx_journey_progress_active ON journey_progress(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_helper_level_tasks_user_project ON helper_level_tasks(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_helper_level_tasks_helper ON helper_level_tasks(helper);
CREATE INDEX IF NOT EXISTS idx_helper_level_tasks_level ON helper_level_tasks(level_id);
CREATE INDEX IF NOT EXISTS idx_helper_level_tasks_completed ON helper_level_tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_user_app_state_user_project ON user_app_state(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_journeys_updated_at ON journeys;
CREATE TRIGGER update_journeys_updated_at BEFORE UPDATE ON journeys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_task_progress_updated_at ON task_progress;
CREATE TRIGGER update_task_progress_updated_at BEFORE UPDATE ON task_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_journey_progress_updated_at ON journey_progress;
CREATE TRIGGER update_journey_progress_updated_at BEFORE UPDATE ON journey_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_helper_level_tasks_updated_at ON helper_level_tasks;
CREATE TRIGGER update_helper_level_tasks_updated_at BEFORE UPDATE ON helper_level_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_app_state_updated_at ON user_app_state;
CREATE TRIGGER update_user_app_state_updated_at BEFORE UPDATE ON user_app_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update chat session timestamp when message is added
CREATE OR REPLACE FUNCTION update_chat_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET 
    updated_at = NOW(),
    last_message_at = NOW(),
    last_message_preview = CASE
      WHEN NEW.role = 'user' THEN LEFT(NEW.content, 100)
      ELSE last_message_preview
    END
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update chat session on new message
DROP TRIGGER IF EXISTS update_chat_session_on_message ON chat_messages;
CREATE TRIGGER update_chat_session_on_message
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_session_timestamp();

-- ============================================
-- PART 2: SEED DATA (Levels and Tasks)
-- ============================================

-- Insert levels
INSERT INTO levels (id, key, title, description, xp_required, unlocks) VALUES
(1, 'spark', 'Spark', 'Find your idea and validate your vision', 0, '{"helpers": ["muse"]}'),
(2, 'build_prep', 'Build Prep', 'Plan your tech stack and architecture', 0, '{"helpers": ["architect"]}'),
(3, 'core_build', 'Core Build', 'Build your MVP with essential features', 0, '{"helpers": ["hacker", "crafter"]}'),
(4, 'launch', 'Launch', 'Ship your product to the world', 0, '{"helpers": ["hypebeast"]}'),
(5, 'grow', 'Grow', 'Scale and optimize for growth', 0, '{"helpers": ["sensei"]}')
ON CONFLICT (id) DO NOTHING;

-- Insert Level 1 tasks
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(1, 'define-problem', 'Define the Problem', 'Clearly articulate the problem you''re solving, who it''s for, and why it matters', true, 20, 1),
(1, 'research-competition', 'Research Competition', 'Identify 3-5 competitors and understand their strengths/weaknesses', true, 15, 2),
(1, 'identify-target-audience', 'Identify Target Audience', 'Create detailed personas of your ideal 3 users with pain points', false, 15, 1.5),
(1, 'market-size-analysis', 'Market Size Analysis', 'Estimate TAM/SAM/SOM for your market opportunity', false, 15, 1.7),
(1, 'brainstorm-solutions', 'Brainstorm Solutions', 'Generate multiple solution ideas and tradeoffs with Muse', true, 15, 3),
(1, 'validate-idea', 'Validate Your Idea', 'Talk to 5+ potential users and document feedback', true, 25, 4),
(1, 'user-interview-analysis', 'Analyze Interview Patterns', 'Summarize recurring themes and insights from user interviews', false, 20, 3.5),
(1, 'create-value-hypothesis', 'Create Value Hypothesis', 'Write your core value prop and why users will care', false, 15, 3.7),
(1, 'define-mvp-scope', 'Define MVP Scope', 'List the 3-5 core features for your MVP with clear success metrics', true, 25, 5),
(1, 'create-user-stories', 'Create User Stories', 'Write 5-10 user stories for your core features', false, 20, 5.2),
(1, 'design-success-metrics', 'Design Success Metrics', 'Define what "success" looks like for each feature', false, 15, 5.5)
ON CONFLICT (slug) DO NOTHING;

-- Insert Level 2 tasks
INSERT INTO tasks (level_id, slug, title, description, required, xp_reward, order_index) VALUES
(2, 'choose-tech-stack', 'Choose Tech Stack', 'Select your frontend, backend, and database technologies with reasoning', true, 30, 1),
(2, 'design-architecture', 'Design Architecture', 'Create a high-level system architecture diagram with data flow', true, 30, 2),
(2, 'document-dependencies', 'Document Dependencies', 'List all external APIs, libraries, and services you''ll need', false, 15, 1.5),
(2, 'identify-tech-risks', 'Identify Tech Risks', 'Spot potential bottlenecks and plan mitigation strategies', false, 20, 1.8),
(2, 'create-wireframes', 'Create Wireframes', 'Wireframe your key user flows: onboard → core action → success state', true, 20, 3),
(2, 'design-ui-system', 'Design UI System', 'Create a basic design system with colors, typography, and components', false, 25, 3.3),
(2, 'create-user-flows', 'Create User Flows', 'Map out detailed user flows with decision points', false, 15, 3.5),
(2, 'setup-repository', 'Setup Repository', 'Initialize Git repo, README, and contribution guidelines', true, 20, 4),
(2, 'define-data-model', 'Define Data Model', 'Design your database schema with all relationships', true, 30, 5),
(2, 'plan-milestones', 'Plan Milestones', 'Break your MVP into 2-4 weekly milestones with deliverables', true, 20, 6),
(2, 'setup-ci-cd', 'Setup CI/CD Pipeline', 'Configure automated testing and deployment pipeline', false, 25, 6.2),
(2, 'create-deployment-plan', 'Create Deployment Plan', 'Document infrastructure, hosting, and deployment strategy', false, 20, 6.5),
(2, 'write-api-specs', 'Write API Specifications', 'Document all APIs with request/response examples', false, 15, 6.7)
ON CONFLICT (slug) DO NOTHING;

-- Note: Add more levels (3, 4, 5) as needed following the same pattern
-- See db/seed.sql for complete task list

-- ============================================
-- PART 3: DEMO USER (Development Only)
-- ============================================

-- Insert demo user if not exists
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  'demo@vibecoding.com',
  crypt('demo-password', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Demo User"}'::jsonb,
  false,
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'::uuid
);

-- Insert demo profile if not exists
INSERT INTO profiles (id, display_name, avatar_url, xp_total, current_level)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Builder',
  NULL,
  0,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001'::uuid
);

-- Insert demo project if not exists
INSERT INTO projects (
  id,
  owner_id,
  name,
  description,
  goal,
  location,
  avatar_url,
  external_links,
  problem_statement,
  target_audience,
  value_proposition,
  tech_stack,
  current_stage
)
SELECT
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'My First Project',
  'Building something amazing with Codyssey',
  'Launch in 30 days',
  'Massachusetts, United States',
  NULL,
  '{"github": "", "demo": "", "cursor": "", "lovable": "", "bolt": ""}'::jsonb,
  'Users need better tools to ship their ideas faster',
  'Indie hackers, startups, and developers building MVPs',
  'Ship your MVP 10x faster with AI-powered helpers',
  'Next.js, TypeScript, Supabase, OpenAI',
  'mvp_build'
WHERE NOT EXISTS (
  SELECT 1 FROM projects WHERE id = '00000000-0000-0000-0000-000000000002'::uuid
);

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- ✅ Schema created
-- ✅ Levels and tasks seeded
-- ✅ Demo user and project created
-- 
-- Demo credentials:
-- Email: demo@vibecoding.com
-- User ID: 00000000-0000-0000-0000-000000000001
-- Project ID: 00000000-0000-0000-0000-000000000002
-- ============================================

