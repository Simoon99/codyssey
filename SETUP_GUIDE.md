# 🚀 Codyssey Setup Guide

This guide will walk you through setting up Codyssey from scratch.

## Prerequisites Checklist

- [ ] Node.js 18 or higher installed
- [ ] npm or yarn installed
- [ ] Supabase account created (https://supabase.com)
- [ ] OpenAI account with API key (https://platform.openai.com)
- [ ] GitHub account for OAuth

## Step 1: Install Dependencies

```bash
cd codyssey
npm install
```

## Step 2: Set Up Supabase

### Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization and enter project details:
   - Name: "codyssey" (or your preferred name)
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to you
4. Wait for project to be created (~2 minutes)

### Get API Keys

1. Go to Project Settings (gear icon) → API
2. Copy these values:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Go to Project Settings → API → Service Role key
   - Copy **service_role key** (`SUPABASE_SERVICE_ROLE_KEY`)
   - ⚠️ Keep this secret! Never commit to git

### Run Database Setup

1. Go to SQL Editor in your Supabase project
2. Create a new query
3. Copy and paste contents of `db/schema.sql`
4. Click "Run"
5. Wait for completion (should see "Success")

6. Create another new query
7. Copy and paste contents of `db/policies.sql`
8. Click "Run"

9. Create another new query
10. Copy and paste contents of `db/seed.sql`
11. Click "Run"

### Verify Database Setup

Go to Table Editor and verify these tables exist:
- profiles
- projects
- levels (should have 5 rows)
- tasks (should have ~30 rows)
- journeys
- task_progress
- helper_chats
- chat_messages
- events

## Step 3: Configure GitHub OAuth

### Create GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in details:
   - **Application name**: Codyssey Dev
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/callback`
4. Click "Register application"
5. Copy **Client ID**
6. Click "Generate a new client secret"
7. Copy **Client Secret** (shown only once!)

### Configure in Supabase

1. In Supabase, go to Authentication → Providers
2. Find "GitHub" in the list
3. Toggle "Enable GitHub provider" ON
4. Paste:
   - GitHub Client ID
   - GitHub Client Secret
5. Click "Save"

## Step 4: Get OpenAI API Key

1. Go to https://platform.openai.com
2. Sign in or create account
3. Go to API Keys section
4. Click "Create new secret key"
5. Name it "Codyssey"
6. Copy the key (shown only once!)
7. ⚠️ Add credits to your account if needed

## Step 5: Configure Environment Variables

1. In the `codyssey` folder, copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in all values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-only keys
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Save the file
4. ⚠️ **NEVER** commit `.env.local` to git!

## Step 6: Run Development Server

```bash
npm run dev
```

You should see:
```
   ▲ Next.js 16.0.0
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 2.3s
```

## Step 7: Test the Application

1. Open http://localhost:3000 in your browser
2. You should be redirected to `/login`
3. Click "Continue with GitHub"
4. Authorize the app
5. You should be redirected to `/dashboard`
6. Verify you see:
   - Your name/email in the top right
   - Level 1 unlocked in the journey view
   - Muse helper available in the sidebar

## Step 8: Test Key Features

### Test Auth
- [x] Login with GitHub works
- [x] Profile created automatically
- [x] Redirects to dashboard

### Test Dashboard
- [x] Three-panel layout displays
- [x] Journey view shows 5 levels
- [x] Level 1 is unlocked, others locked
- [x] Profile card shows stats

### Test Chat
- [x] Click Muse helper in sidebar
- [x] Chat interface loads
- [x] Type a message and send
- [x] Receive streaming response
- [x] Message appears in history

### Test Project
- [x] Demo project auto-created
- [x] Project name visible in profile card

## Troubleshooting

### "Unauthorized" Error
- Check Supabase RLS policies ran successfully
- Verify you're logged in
- Check browser console for auth errors

### "Failed to fetch" on Chat
- Verify `OPENAI_API_KEY` is set correctly in `.env.local`
- Check OpenAI account has credits
- Restart dev server after changing `.env.local`

### GitHub OAuth Fails
- Verify callback URL is exactly: `http://localhost:3000/auth/callback`
- Check GitHub OAuth app settings
- Verify client ID and secret in Supabase

### Database Errors
- Check all SQL scripts ran without errors
- Verify tables exist in Supabase Table Editor
- Check Supabase logs for specific errors

### Build Errors
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Restart dev server

## Production Deployment

See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for detailed production deployment instructions.

### Quick Vercel Deploy

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add all environment variables (use production Supabase URL)
5. Deploy!

Don't forget to:
- Create production GitHub OAuth app
- Update callback URL to production domain
- Update `NEXT_PUBLIC_APP_URL` to production URL

## Next Steps

After setup is complete:

1. **Explore the Dashboard** - Navigate through the UI
2. **Chat with Helpers** - Try different AI personas
3. **Complete Tasks** - (Manual via Supabase for now)
4. **Customize** - Adjust styling, add features
5. **Deploy** - Share with users!

## Need Help?

- Check [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for detailed documentation
- Check [README.md](./README.md) for quick reference
- Review Supabase logs for errors
- Check browser console for client errors
- Review Vercel logs for deployment issues

## Security Reminders

⚠️ **NEVER** commit these to git:
- `.env.local`
- Service role keys
- OpenAI API keys
- OAuth secrets

✅ **ALWAYS** use `.env.local` for local development
✅ **ALWAYS** use environment variables in Vercel for production

---

**Setup Complete!** 🎉

You're ready to start building with Codyssey! Happy coding! 🚀

