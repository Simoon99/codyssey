# Database Setup Instructions

## The Errors You're Seeing

1. **"syntax error at or near 'id'"** in seed.sql - This happens when schema.sql hasn't been run first
2. **"syntax error at or near 'IF'"** in dev-setup.sql - This happens because DO blocks need special handling
3. **journey-config.json** - Had duplicate content (now fixed ✅)

## Correct Setup Order

### Option A: Using Supabase Dashboard (Recommended)

Run these files in the SQL Editor in this **exact order**:

#### Step 1: Create Schema
```sql
-- File: db/schema.sql
-- Copy and paste the ENTIRE file into Supabase SQL Editor
-- Click "Run"
```

#### Step 2: Seed Levels and Tasks
```sql
-- File: db/seed.sql
-- Copy and paste the ENTIRE file into Supabase SQL Editor
-- Click "Run"
```

#### Step 3: Create Demo User (Development Only)
```sql
-- File: db/dev-setup.sql
-- Copy and paste the ENTIRE file into Supabase SQL Editor
-- Click "Run"
-- Note: This creates a demo user for development
```

#### Step 4: Run Migrations (If Updating Existing DB)
If you already have a database and need to add new fields:
```sql
-- File: db/migrations/add_project_display_fields.sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS goal TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

### Option B: Using psql Command Line

```bash
# 1. Schema
psql -h YOUR_DB_HOST -U postgres -d postgres -f db/schema.sql

# 2. Seed data
psql -h YOUR_DB_HOST -U postgres -d postgres -f db/seed.sql

# 3. Dev setup (optional)
psql -h YOUR_DB_HOST -U postgres -d postgres -f db/dev-setup.sql
```

### Option C: One-Step Setup (Use This!)

I've created a master setup script below.



