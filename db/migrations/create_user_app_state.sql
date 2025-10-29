-- User App State Table
-- Stores the current application state per user per project
CREATE TABLE IF NOT EXISTS user_app_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  selected_helper TEXT CHECK (selected_helper IN ('muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei')),
  active_orb_id TEXT, -- e.g., "L1S1", "L2S1"
  step_context JSONB, -- Full step context object
  view_mode TEXT CHECK (view_mode IN ('journey', 'chat', 'tasks')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_app_state_user_project ON user_app_state(user_id, project_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_app_state_updated_at 
  BEFORE UPDATE ON user_app_state
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE user_app_state IS 'Stores user application state for persistence across sessions';
COMMENT ON COLUMN user_app_state.selected_helper IS 'Currently selected helper (muse, architect, etc.)';
COMMENT ON COLUMN user_app_state.active_orb_id IS 'Active journey orb/step ID (e.g., L1S1)';
COMMENT ON COLUMN user_app_state.step_context IS 'Full step context including tasks, level info, etc.';
COMMENT ON COLUMN user_app_state.view_mode IS 'Current view mode (journey, chat, or tasks)';


