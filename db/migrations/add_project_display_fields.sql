-- Add Project Display Fields
-- These fields are used in the project card UI

-- Add goal, location, and avatar fields
ALTER TABLE projects ADD COLUMN IF NOT EXISTS goal TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN projects.goal IS 'Project goal or target (e.g., "Launch in 30 days", "Reach 1000 users")';
COMMENT ON COLUMN projects.location IS 'Project location or team location (e.g., "Massachusetts, United States")';
COMMENT ON COLUMN projects.avatar_url IS 'URL or data URI for project avatar image';


