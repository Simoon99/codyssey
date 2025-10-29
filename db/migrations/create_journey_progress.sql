-- Journey Progress Table
-- Tracks which level/step each user is currently on per project
CREATE TABLE IF NOT EXISTS journey_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  current_level_id TEXT NOT NULL, -- e.g., "L1S1", "L2S1"
  helper TEXT NOT NULL CHECK (helper IN ('muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei')),
  is_active BOOLEAN DEFAULT true, -- Is this the currently active journey step
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, project_id, current_level_id, helper)
);

-- Helper Level Tasks Table
-- Tracks task completion for each helper's journey level
CREATE TABLE IF NOT EXISTS helper_level_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  helper TEXT NOT NULL CHECK (helper IN ('muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei')),
  level_id TEXT NOT NULL, -- e.g., "L1S1", "L2S1"
  task_id TEXT NOT NULL, -- e.g., "idea-refinement", "create-project-brief"
  task_title TEXT NOT NULL,
  task_goal TEXT,
  is_required BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  xp_reward INTEGER DEFAULT 10,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, project_id, helper, level_id, task_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_journey_progress_user_project ON journey_progress(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_journey_progress_helper ON journey_progress(helper);
CREATE INDEX IF NOT EXISTS idx_journey_progress_active ON journey_progress(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_helper_level_tasks_user_project ON helper_level_tasks(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_helper_level_tasks_helper ON helper_level_tasks(helper);
CREATE INDEX IF NOT EXISTS idx_helper_level_tasks_level ON helper_level_tasks(level_id);
CREATE INDEX IF NOT EXISTS idx_helper_level_tasks_completed ON helper_level_tasks(is_completed);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_journey_progress_updated_at BEFORE UPDATE ON journey_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_helper_level_tasks_updated_at BEFORE UPDATE ON helper_level_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

