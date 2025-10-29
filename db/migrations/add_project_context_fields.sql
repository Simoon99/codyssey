-- Add Project Context Fields to Projects Table
-- These fields enable AI helpers to have rich project memory and context

-- Add context fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS problem_statement TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS target_audience TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS value_proposition TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS current_stage TEXT CHECK (current_stage IN ('ideation', 'mvp_build', 'launching', 'growth', 'scaling'));

-- Add comments for documentation
COMMENT ON COLUMN projects.problem_statement IS 'What problem does the project solve? Who has this problem?';
COMMENT ON COLUMN projects.target_audience IS 'Who are the ideal users? Specific demographics, roles, company sizes, etc.';
COMMENT ON COLUMN projects.value_proposition IS 'What unique value does this project provide? Why is it better than alternatives?';
COMMENT ON COLUMN projects.tech_stack IS 'Technology stack: Frontend, Backend, Database, Infra, APIs, etc.';
COMMENT ON COLUMN projects.current_stage IS 'Current development stage: ideation, mvp_build, launching, growth, or scaling';

-- Update the updated_at trigger if it exists
-- (Assumes update_updated_at_column function exists from previous migrations)

