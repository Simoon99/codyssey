# 🚀 Codyssey - Deployment & Development Guide

## Part 1: Development Mode (No Auth)

### Quick Setup

#### Step 1: Create `.env.local` file

In your project root, create or update `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development Mode (Skip Auth)
NEXT_PUBLIC_DEV_MODE=true
```

**Where to find these values:**
- Go to [Supabase Dashboard](https://app.supabase.com)
- Select your project → Settings → API
- Copy `Project URL` and `Anon Key`

#### Step 2: Start Development Server

```bash
npm run dev
```

✅ **Result**: App opens at `http://localhost:3000` and goes straight to dashboard!

### How Dev Mode Works

When `NEXT_PUBLIC_DEV_MODE=true`:
- Root page (`/`) checks environment variable
- If true AND `NODE_ENV === "development"`, redirects directly to `/dashboard`
- Bypasses login/auth flow entirely
- Perfect for testing UI without login

### Environment Variables

| Variable | Dev Value | Prod Value | Purpose |
|----------|-----------|------------|---------|
| `NEXT_PUBLIC_DEV_MODE` | `true` | `false` | Skip auth in dev |
| `NODE_ENV` | `development` | `production` | Automatically set by Next.js |
| `NEXT_PUBLIC_SUPABASE_URL` | Your URL | Your URL | Supabase endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your key | Your key | Supabase public key |

---

## Part 2: Deploy to Vercel

### Prerequisites

1. **Vercel Account**: [Sign up at vercel.com](https://vercel.com/simoon99s-projects)
2. **Vercel CLI**: Install globally
   ```bash
   npm install -g vercel
   ```
3. **GitHub/Git**: Project should be in a git repository

### Deployment Steps

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

Or use `npx`:
```bash
npx vercel --version
```

#### Step 2: Login to Vercel

```bash
vercel login
```

This opens a browser window to authenticate. Follow the prompts.

#### Step 3: Deploy to Vercel

**First Deployment (Link to Vercel):**
```bash
vercel
```

Follow the prompts:
```
? Set up and deploy "~/path/to/vibecoding-helpers"? [Y/n] y
? Which scope do you want to deploy to? simoon99s-projects
? Link to existing project? [y/N] n
? What's your project's name? codyssey
? In which directory is your code? ./
? Want to modify these settings before deploying? [y/N] n
```

**Subsequent Deployments:**
```bash
vercel --prod
```

Or for preview deployments:
```bash
vercel
```

#### Step 4: Set Environment Variables on Vercel

After first deployment, configure environment variables:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_DEV_MODE
```

Or set them in [Vercel Dashboard](https://vercel.com/simoon99s-projects):
1. Go to your project → Settings → Environment Variables
2. Add each variable with its value

**Important Settings:**

| Variable | Development | Production |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Same |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase key | Same |
| `NEXT_PUBLIC_DEV_MODE` | `true` | `false` |

#### Step 5: Redeploy with Environment Variables

After setting env vars:

```bash
vercel --prod --yes
```

---

## Deployment Checklist

- [ ] Vercel account created at https://vercel.com/simoon99s-projects
- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Logged in: `vercel login`
- [ ] Project files pushed to git
- [ ] First deployment: `vercel`
- [ ] Environment variables set via `vercel env add` or dashboard
- [ ] Redeploy with env vars: `vercel --prod --yes`
- [ ] Test app at provided Vercel URL
- [ ] Verify NEXT_PUBLIC_DEV_MODE=false in production

---

## Accessing Your App

### Local Development
```
http://localhost:3000
```
- Dashboard accessible immediately (dev mode)
- No login required
- Full development features

### Vercel Production
```
https://codyssey-[random].vercel.app
```
(URL provided after deployment)

- Authentication required (NEXT_PUBLIC_DEV_MODE=false)
- Production-ready
- Global CDN

---

## Common Issues & Fixes

### Issue: Build fails on Vercel

**Solution**: Check build logs in Vercel dashboard
```bash
vercel logs
```

### Issue: "Cannot find Supabase URL"

**Solution**: Verify environment variables are set
```bash
vercel env ls
```

### Issue: App still goes to login on Vercel

**Solution**: Ensure `NEXT_PUBLIC_DEV_MODE=false` (or not set) in production

```bash
# Check env
vercel env ls

# Update if needed
vercel env add NEXT_PUBLIC_DEV_MODE false
```

### Issue: Changes not reflected after deployment

**Solution**: Redeploy after pushing commits
```bash
git push origin main
vercel --prod --yes
```

---

## Continuous Deployment

### Automatic Deployments (Optional)

If you connect GitHub to Vercel, set it up in the dashboard:

1. Go to Settings → Git Integration
2. Connect GitHub repository
3. Enable "Automatic Deployments" for main branch
4. Every push to `main` auto-deploys

---

## Development vs Production Comparison

| Feature | Local Dev | Vercel Prod |
|---------|-----------|------------|
| URL | localhost:3000 | vercel.app URL |
| Auth | Skipped (dev mode) | Required |
| NEXT_PUBLIC_DEV_MODE | true | false |
| Speed | Fast | Very fast (CDN) |
| Uptime | While running | 99.95% SLA |
| Logs | Console | Vercel dashboard |
| Environment | NODE_ENV=development | NODE_ENV=production |

---

## Quick Commands Reference

```bash
# Development
npm run dev                      # Start dev server (straight to dashboard)

# Vercel
vercel                          # Deploy preview
vercel --prod                   # Deploy production
vercel --prod --yes             # Deploy without prompts
vercel login                    # Login to Vercel account
vercel logout                   # Logout
vercel env ls                   # List environment variables
vercel env add KEY              # Add environment variable
vercel logs                     # View deployment logs
vercel projects ls              # List your projects
vercel domains ls               # List connected domains
```

---

## Next Steps

1. ✅ Set `NEXT_PUBLIC_DEV_MODE=true` in `.env.local`
2. ✅ Run `npm run dev` and test dashboard
3. ✅ Install Vercel CLI: `npm install -g vercel`
4. ✅ Login: `vercel login`
5. ✅ Deploy: `vercel` (first time)
6. ✅ Set env vars on Vercel dashboard
7. ✅ Redeploy: `vercel --prod --yes`
8. ✅ Share Vercel URL with team!

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Issues**: Create an issue for bugs or questions

