# ⚡ Quick Start - Get Running in 10 Minutes

## 1. Install Dependencies (1 min)
```bash
cd codyssey
npm install
```

## 2. Create Supabase Project (3 min)
1. Go to https://supabase.com → New Project
2. Go to SQL Editor
3. Run these files in order:
   - `db/schema.sql`
   - `db/policies.sql`  
   - `db/seed.sql`

## 3. Get API Keys (2 min)
- **Supabase**: Project Settings → API
- **OpenAI**: https://platform.openai.com → API Keys

## 4. Setup GitHub OAuth (2 min)
1. GitHub Settings → Developer → OAuth Apps → New
2. Callback: `http://localhost:3000/auth/callback`
3. Add to Supabase: Authentication → Providers → GitHub

## 5. Configure Environment (1 min)
```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

## 6. Run! (1 min)
```bash
npm run dev
```

Open http://localhost:3000 🎉

---

**Need Help?** See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

