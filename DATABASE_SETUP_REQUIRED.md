# Database Setup Required ⚠️

## Error: Journey Won't Start

You're getting this error because the database tables haven't been created yet:

```
Failed to create session: 500 {}
```

## Root Cause

The `chat_sessions` table (and other required tables) don't exist in your Supabase database yet. The API is trying to insert a new chat session but the table doesn't exist.

## Quick Fix (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: `lfxcpkrorbmaegmqlzht`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Complete Setup Script

1. Open the file: `db/complete-setup.sql`
2. **Copy the ENTIRE file** (all 436 lines)
3. **Paste into Supabase SQL Editor**
4. Click **"Run"** button (or press Ctrl+Enter)
5. Wait for it to complete (should take 5-10 seconds)

### Step 3: Verify It Worked

Run this query in Supabase SQL Editor to confirm tables were created:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'chat_sessions', 
  'chat_messages', 
  'projects', 
  'profiles',
  'journey_progress',
  'helper_level_tasks',
  'user_app_state'
)
ORDER BY table_name;
```

You should see **all 7 tables** listed.

### Step 4: Test Your App

1. Refresh your browser at http://localhost:3000
2. Click on a helper (Muse, Architect, etc.)
3. Click **"Start Your Journey"**
4. ✅ It should work now!

## What Gets Created

The `complete-setup.sql` script creates:

✅ **12 Database Tables**
- `profiles` - User profiles
- `projects` - Projects with full context fields
- `levels` - Journey levels (5 levels)
- `tasks` - Traditional tasks
- `journeys` - User journey progress
- `task_progress` - Task completion tracking
- `chat_sessions` - Helper chat sessions ⭐ (This is what's missing!)
- `chat_messages` - Messages in sessions
- `journey_progress` - Orb-based progress
- `helper_level_tasks` - Per-helper tasks
- `user_app_state` - UI state persistence
- `events` - Analytics events

✅ **Demo User & Project**
- User ID: `00000000-0000-0000-0000-000000000001`
- Project ID: `00000000-0000-0000-0000-000000000002`
- Pre-configured with all fields

✅ **Seed Data**
- 5 levels with tasks
- Required + optional tasks
- Proper task relationships

## Alternative: Step-by-Step Setup

If you prefer to run files separately:

```sql
-- 1. First: Schema (creates tables)
-- Run: db/schema.sql

-- 2. Second: Seed Data (adds levels and tasks)
-- Run: db/seed.sql

-- 3. Third: Dev Setup (adds demo user)
-- Run: db/dev-setup.sql
```

But the **one-click `complete-setup.sql`** is easier! 🚀

## Troubleshooting

### "relation chat_sessions does not exist"
→ You didn't run the setup script yet. Follow Step 2 above.

### "duplicate key value violates unique constraint"
→ You already have data. That's OK! The script uses `IF NOT EXISTS` and `ON CONFLICT` to be safe.

### "permission denied for schema public"
→ You're not connected to the right database. Make sure you're in your Supabase project dashboard.

### Still getting errors?
1. Check the **Supabase SQL Editor output** for specific error messages
2. Check your **browser console** (F12) for more details
3. Check your **terminal** where Next.js is running for API logs

## Need to Start Fresh?

If you want to completely reset your database:

```sql
-- ⚠️ WARNING: This deletes ALL data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then run complete-setup.sql
```

## After Setup

Once the setup completes successfully:

1. ✅ You can create chat sessions
2. ✅ Journey will start properly
3. ✅ All helpers will work
4. ✅ Tasks will track correctly
5. ✅ UI state will persist
6. ✅ Web search citations will display

Ready to build! 🎉

