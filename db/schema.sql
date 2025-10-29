-- Codyssey Database Schema
-- Run this after Supabase project is created

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Chat Sessions Table
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

-- Chat Messages Table
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
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journeys_updated_at BEFORE UPDATE ON journeys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_progress_updated_at BEFORE UPDATE ON task_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journey_progress_updated_at BEFORE UPDATE ON journey_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_helper_level_tasks_updated_at BEFORE UPDATE ON helper_level_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
CREATE TRIGGER update_chat_session_on_message
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_session_timestamp();

