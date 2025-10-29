-- ============================================
-- HELPER CONTEXT TABLE MIGRATION
-- ============================================
-- This table stores evolving project context insights
-- that each helper learns and updates throughout the journey.
-- Other helpers can reference these insights for continuity.
-- ============================================

CREATE TABLE IF NOT EXISTS helper_context (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  helper TEXT NOT NULL CHECK (helper IN ('muse', 'architect', 'crafter', 'hacker', 'hypebeast', 'sensei')),
  
  -- Core insights updated by each helper
  key_insights JSONB DEFAULT '[]'::jsonb, -- Array of key learnings
  decisions_made JSONB DEFAULT '[]'::jsonb, -- Array of decisions/choices
  artifacts_created JSONB DEFAULT '[]'::jsonb, -- Array of deliverables produced
  
  -- Helper-specific context fields
  muse_validation JSONB, -- Problem, users, scope validation
  architect_blueprint JSONB, -- Tech stack, architecture decisions
  crafter_design JSONB, -- Design system, UI components
  hacker_prompts JSONB, -- Build prompts, tooling choices
  hypebeast_launch JSONB, -- Launch strategy, marketing assets
  sensei_growth JSONB, -- Growth metrics, optimization plans
  
  -- Summary for quick reference
  context_summary TEXT, -- AI-generated summary of this helper's work
  last_updated_by_message_id UUID, -- Reference to triggering chat message
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, project_id, helper)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_helper_context_project 
  ON helper_context(project_id, user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_helper_context_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS trigger_update_helper_context_timestamp ON helper_context;
CREATE TRIGGER trigger_update_helper_context_timestamp
  BEFORE UPDATE ON helper_context
  FOR EACH ROW
  EXECUTE FUNCTION update_helper_context_timestamp();

-- Add this to complete-setup.sql as well
COMMENT ON TABLE helper_context IS 'Stores evolving project context insights per helper for journey continuity';

