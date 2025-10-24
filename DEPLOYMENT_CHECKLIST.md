# 🚀 Codyssey Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

---

## ✅ Pre-Deployment Checklist

### 1. Database Setup (Supabase)
- [ ] Supabase project created
- [ ] `db/schema.sql` executed successfully
- [ ] `db/policies.sql` executed (RLS enabled)
- [ ] `db/seed.sql` executed (levels & tasks populated)
- [ ] Test query: `SELECT * FROM levels;` returns 5 rows
- [ ] Test query: `SELECT * FROM tasks;` returns sample tasks

### 2. Authentication Setup
- [ ] GitHub OAuth app created for production
  - Homepage URL: `https://your-domain.com`
  - Callback URL: `https://your-domain.com/auth/callback`
- [ ] Client ID and Secret copied
- [ ] Supabase: Authentication → Providers → GitHub configured
- [ ] Test login flow in incognito mode

### 3. API Keys & Secrets
- [ ] OpenAI API key obtained
- [ ] OpenAI account has billing enabled
- [ ] Test OpenAI key with curl:
  ```bash
  curl https://api.openai.com/v1/models \
    -H "Authorization: Bearer $OPENAI_API_KEY"
  ```
- [ ] All secrets stored securely (never in git!)

### 4. Environment Variables
Create `.env.local` with:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
- [ ] `OPENAI_API_KEY` (keep secret!)
- [ ] `NEXT_PUBLIC_APP_URL`

### 5. Code Quality
- [ ] All TypeScript errors resolved: `npm run type-check`
- [ ] Linter passes: `npm run lint`
- [ ] Build succeeds locally: `npm run build`
- [ ] Test in production mode: `npm start`
- [ ] No console errors in browser

### 6. Testing (Manual)
- [ ] Sign up new user with GitHub OAuth
- [ ] Profile created automatically
- [ ] Dashboard loads with Level 1 unlocked
- [ ] Muse helper visible in sidebar
- [ ] Click "START" on Level 1
- [ ] Task view loads with tasks
- [ ] Complete a task (awards XP)
- [ ] Chat with Muse (demo response works)
- [ ] External links in project hub
- [ ] Logout works correctly

---

## 🌐 Vercel Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: Production-ready Codyssey MVP"
git push origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Select your GitHub repository
3. Project Settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Environment Variables
Add these in Vercel project settings → **Environment Variables**:

| Variable | Value | Type |
|----------|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Plain Text |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR...` | Plain Text |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR...` | **Secret** |
| `OPENAI_API_KEY` | `sk-proj-xxxxx` | **Secret** |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Plain Text |

**Important:** Mark sensitive keys as **Secret** ✓

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (~2-3 minutes)
- [ ] Check deployment logs for errors
- [ ] Visit deployment URL

### Step 5: Post-Deployment Verification
- [ ] Site loads without errors
- [ ] GitHub OAuth redirects correctly
- [ ] Can sign up and create account
- [ ] Dashboard renders properly
- [ ] Tasks load correctly
- [ ] Chat interface works
- [ ] XP awards on task completion
- [ ] Check Vercel logs for runtime errors
- [ ] Check Supabase logs for database errors

---

## 🔒 Security Checks

### Production Security
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] `.env.local` not committed to git
- [ ] Service role key marked as secret in Vercel
- [ ] OpenAI key marked as secret in Vercel
- [ ] RLS policies enabled on all Supabase tables
- [ ] No API keys exposed in client-side code
- [ ] CORS configured correctly (Next.js handles this)

### Test RLS Policies
```sql
-- In Supabase SQL Editor, test as authenticated user:
SELECT * FROM profiles WHERE id != auth.uid();
-- Should return 0 rows (can't see other users)

SELECT * FROM projects WHERE owner_id != auth.uid();
-- Should return 0 rows (can't see other projects)
```

---

## 🎯 Custom Domain (Optional)

### Step 1: Add Domain in Vercel
1. Vercel project → Settings → Domains
2. Add your domain (e.g., `codyssey.app`)
3. Copy DNS records provided

### Step 2: Update DNS
Add records at your domain registrar:
- **Type**: A or CNAME
- **Name**: @ or subdomain
- **Value**: Vercel's target

### Step 3: Update Environment Variables
- [ ] Update `NEXT_PUBLIC_APP_URL` to your custom domain
- [ ] Redeploy Vercel

### Step 4: Update GitHub OAuth
- [ ] Update Homepage URL to custom domain
- [ ] Update Callback URL to custom domain + `/auth/callback`
- [ ] Update Supabase GitHub provider settings

### Step 5: Test
- [ ] Visit custom domain
- [ ] SSL certificate auto-provisioned (https://)
- [ ] OAuth flow works with new domain

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Optional)
- [ ] Enable Vercel Analytics in project settings
- [ ] Add Vercel Speed Insights for performance

### Error Monitoring (Future)
- [ ] Set up Sentry for error tracking
- [ ] Configure error alerts

### Database Monitoring
- [ ] Check Supabase dashboard for:
  - Database size and growth
  - API requests per day
  - Active connections
  - Slow queries

---

## 🐛 Common Deployment Issues

### Issue: Build Fails
**Symptoms:** Deployment stops during build
**Fix:**
1. Check Vercel build logs
2. Run `npm run build` locally to reproduce
3. Fix TypeScript/ESLint errors
4. Push fix and redeploy

### Issue: Environment Variables Not Working
**Symptoms:** App loads but features broken
**Fix:**
1. Verify all env vars set in Vercel
2. Check spelling (case-sensitive!)
3. Redeploy after adding vars
4. Check Vercel logs for "undefined" errors

### Issue: GitHub OAuth Fails in Production
**Symptoms:** Login redirects to error page
**Fix:**
1. Verify callback URL matches production domain
2. Check Client ID/Secret in Supabase
3. Test OAuth app is not suspended
4. Clear cookies and try incognito

### Issue: Database Queries Fail
**Symptoms:** 401 errors, RLS denials
**Fix:**
1. Check RLS policies in Supabase
2. Verify `auth.users` table has user
3. Check Supabase logs for policy denials
4. Re-run `db/policies.sql` if needed

### Issue: Chat Not Working
**Symptoms:** No responses from helpers
**Fix:**
1. Verify `OPENAI_API_KEY` is set in Vercel
2. Check OpenAI account has credits
3. Look at Vercel function logs for errors
4. Test Edge runtime is enabled for chat route

---

## 📝 Post-Launch Tasks

### Immediate (Day 1)
- [ ] Share launch on Twitter/X
- [ ] Post to Product Hunt (optional)
- [ ] Share in Discord/Slack communities
- [ ] Monitor Vercel logs for errors
- [ ] Watch Supabase usage dashboard

### Week 1
- [ ] Set up basic analytics dashboard
- [ ] Create feedback form (TypeForm, Tally)
- [ ] Monitor user signups and engagement
- [ ] Fix critical bugs reported by users
- [ ] Gather initial user feedback

### Month 1
- [ ] Analyze user behavior and retention
- [ ] Identify most/least used features
- [ ] Plan v1.1 improvements based on feedback
- [ ] Consider adding more seed tasks
- [ ] Optimize slow database queries

---

## 🎉 Launch Announcement Template

**Twitter/X:**
```
🎓 Launching Codyssey — your gamified journey from 0 to 1!

✨ Level up from Spark to Grow
🤖 Get guidance from 6 AI helpers
⚡ Complete tasks, earn XP, unlock mentors

Perfect for indie builders using @cursor_ai, @lovable, or @boltdotNew

Try it: [your-url]

#BuildInPublic #IndieHackers
```

**LinkedIn:**
```
Excited to launch Codyssey! 🚀

After weeks of building, I'm thrilled to share a gamified platform that turns product development into an adventure.

Key features:
• 5-level progression system (Spark → Grow)
• 6 specialized AI helper personas
• Task management with XP rewards
• Built with Next.js, Supabase, and OpenAI

Perfect for vibecoders and indie builders going from idea to launch.

Check it out: [your-url]

Feedback welcome! 🙏

#ProductLaunch #AI #IndieDev #SaaS
```

**Product Hunt:**
```
Title: Codyssey - Level up your journey from 0 to 1

Tagline: Build your dream project with AI helpers, one level at a time

Description:
Codyssey turns product development into a gamified adventure. Progress through 5 levels from Spark (ideation) to Grow (100+ users), guided by 6 specialized AI helpers. Complete tasks, earn XP, unlock mentors, and build with confidence.

Perfect for indie makers using tools like Cursor, Lovable, and Bolt.

Built with: Next.js, Supabase, OpenAI, Tailwind CSS
```

---

## ✅ Final Pre-Launch Checklist

One last time before hitting publish:

- [ ] All environment variables set in Vercel
- [ ] GitHub OAuth works in production
- [ ] Can sign up, complete task, and chat with helper
- [ ] No errors in Vercel logs
- [ ] Database has seed data
- [ ] README and docs are up to date
- [ ] Social media posts drafted
- [ ] Monitoring dashboards ready
- [ ] Feedback collection method set up

---

## 🚀 Ready to Launch!

When all boxes are checked:

1. Take a deep breath 😌
2. Click deploy in Vercel
3. Test one more time in production
4. Share with the world! 🎉

**Good luck with your launch! 🎓✨**

---

**Need help?** Check [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) or [README.md](./README.md)

**Last updated:** October 23, 2025

