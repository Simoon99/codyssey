# 🚀 Codyssey - Quick Start Guide

## Development (No Auth)

### 1️⃣ Create `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_MODE=true
```

Get these from [Supabase Dashboard](https://app.supabase.com) → Your Project → Settings → API

### 2️⃣ Start Dev Server

```bash
npm run dev
```

✅ Opens at `http://localhost:3000` **straight to the dashboard!**

No login needed. Happy coding! 🎉

---

## Deployment to Vercel

### 1️⃣ Install Vercel CLI

```bash
npm install -g vercel
```

### 2️⃣ Login

```bash
vercel login
```

(Browser opens for authentication)

### 3️⃣ Deploy

**First time:**
```bash
vercel
```

Follow prompts. Select your Vercel account (`simoon99s-projects`)

**Subsequent times:**
```bash
vercel --prod --yes
```

### 4️⃣ Set Environment Variables

Option A - CLI:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_DEV_MODE  # Set to: false
```

Option B - Dashboard:
1. Go to https://vercel.com/simoon99s-projects
2. Click your project → Settings → Environment Variables
3. Add the 3 variables above

### 5️⃣ Redeploy with Env Vars

```bash
vercel --prod --yes
```

### ✅ Done!

Your app is live at the URL shown in terminal. Share it! 🎊

---

## Quick Reference

| Task | Command |
|------|---------|
| Start dev (no auth) | `npm run dev` |
| Build for prod | `npm run build` |
| Deploy preview | `vercel` |
| Deploy production | `vercel --prod --yes` |
| Check env vars | `vercel env ls` |
| View logs | `vercel logs` |
| Logout Vercel | `vercel logout` |

---

## Key Points

✅ **Development**: `NEXT_PUBLIC_DEV_MODE=true` → skips auth, goes to dashboard  
✅ **Production**: `NEXT_PUBLIC_DEV_MODE=false` (or not set) → requires auth  
✅ **Vercel**: All env vars set in dashboard or via CLI  
✅ **Deployment**: Just run `vercel --prod --yes` after any git push  

---

**Need help?** See `DEPLOYMENT_VERCEL.md` for detailed guide.
