# Dev Mode Session Fix

## Problem
When running in dev mode (`NEXT_PUBLIC_DEV_MODE=true`), the chat session creation was failing with "Failed to create session" because there was no authenticated user.

## Solution
I've implemented a comprehensive fix that allows the app to work in dev mode without authentication:

### Changes Made

1. **Enhanced Supabase Client (`lib/supabase/server.ts`)**
   - Added `createServiceClient()` - uses service role to bypass RLS
   - Added `getSupabaseClient()` - automatically uses service client in dev mode when no user is authenticated
   - This bypasses Row Level Security (RLS) in development

2. **Updated API Routes**
   - `app/api/chat/sessions/route.ts` - Now uses `getSupabaseClient()` 
   - `app/api/chat/sessions/[id]/messages/route.ts` - Now uses `getSupabaseClient()`
   - Both routes use `00000000-0000-0000-0000-000000000001` as fallback user ID in dev mode

3. **Database Setup Script (`db/dev-setup.sql`)**
   - Creates a demo user with UUID `00000000-0000-0000-0000-000000000001`
   - Creates a demo project with UUID `00000000-0000-0000-0000-000000000002`
   - Safe to run multiple times

### Setup Instructions

You need to run the dev setup SQL script to create the demo user and project:

#### Option 1: Via Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open `db/dev-setup.sql` in your local editor
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click "Run"

#### Option 2: Via Supabase CLI
```bash
supabase db push --file db/dev-setup.sql
```

#### Option 3: Via psql
```bash
psql "your-database-connection-string" -f db/dev-setup.sql
```

### How It Works

**In Development Mode** (`NEXT_PUBLIC_DEV_MODE=true`):
1. API routes use `getSupabaseClient()` which checks for authenticated user
2. If no user found, returns a Supabase client with service role (bypasses RLS)
3. Uses `00000000-0000-0000-0000-000000000001` as the user ID for all operations
4. Works with `00000000-0000-0000-0000-000000000002` project ID (default in chat interface)

**In Production Mode** (any other value or not set):
1. API routes require proper authentication
2. Enforces RLS policies
3. Rejects requests without valid user authentication

### Testing

After running the setup script:
1. Restart your Next.js dev server
2. Navigate to dashboard
3. Click on any helper (e.g., Muse, Architect)
4. Click "Start Your Journey with [Helper]"
5. You should see the helper's opening message streaming in

### Security Note

⚠️ **IMPORTANT**: Always ensure `NEXT_PUBLIC_DEV_MODE=false` or remove it entirely in production deployments. The dev mode bypasses authentication and RLS, which is only safe for local development.

### Troubleshooting

**Error: "Failed to create session"**
- Make sure you've run the `db/dev-setup.sql` script
- Check that `NEXT_PUBLIC_DEV_MODE=true` in your `.env.local`
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Restart your dev server after making changes

**Error: "relation 'projects' does not exist"**
- Run your main database migrations first: `db/schema.sql`
- Then run `db/dev-setup.sql`

**Sessions not appearing**
- The first time you start a journey, a new session is automatically created
- Sessions are listed in the left sidebar (desktop) or info panel (mobile)
- Each helper maintains separate sessions per project

