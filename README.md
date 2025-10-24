# 🎓 Codyssey - Your Gamified Project Journey

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-green)](https://supabase.com/)

**Codyssey** turns the process of building and launching an AI-powered app into a guided, gamified adventure. It's like Duolingo meets product development — level up from Spark to Grow with AI helpers guiding every step.

---

## ✨ Features

- 🎮 **5-Level Progression**: Spark → Build Prep → Core Build → Launch → Grow
- 🤖 **6 AI Helper Personas**: Muse, Architect, Crafter, Hacker, Hypebeast, Sensei
- ⚡ **XP & Task System**: Complete tasks, earn XP, level up, unlock helpers
- 💬 **AI Chat Interface**: Get personalized guidance from specialized helpers
- 📊 **Progress Tracking**: Visual journey path, stats dashboard, task management
- 🔗 **Project Hub**: Store links to Cursor, Lovable, Bolt, GitHub, and live demos
- 🎨 **Beautiful UI**: Modern, gradient-rich design with smooth animations

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier works!)
- OpenAI API key
- GitHub account (for OAuth)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** and copy your keys
3. Run the SQL files in order in **SQL Editor**:
   ```sql
   -- 1. Create tables (db/schema.sql)
   -- 2. Set up RLS (db/policies.sql)
   -- 3. Seed data (db/seed.sql)
   ```

### 3. Configure GitHub OAuth

1. Go to **GitHub → Settings → Developer settings → OAuth Apps**
2. Create new OAuth App:
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:3000/auth/callback`
3. Copy Client ID and Client Secret
4. In Supabase: **Authentication → Providers → GitHub**
   - Enable and paste credentials

### 4. Set Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 📖 Documentation

- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Complete technical documentation
- **[cod.plan.md](./cod.plan.md)** - Original MVP plan
- **[db/schema.sql](./db/schema.sql)** - Database schema with comments

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **AI**: OpenAI GPT-4o-mini
- **Hosting**: Vercel (recommended)
- **Icons**: Lucide React

---

## 📂 Project Structure

```
vibecoding-helpers/
├── app/                    # Next.js App Router
│   ├── (auth)/login/       # Login page
│   ├── dashboard/          # Main dashboard
│   └── api/                # API routes (chat, tasks)
├── components/
│   ├── auth/               # Login form
│   ├── chat/               # Chat interface
│   ├── dashboard/          # Dashboard components
│   └── ui/                 # Base UI components
├── db/                     # Database setup (schema, policies, seeds)
├── lib/                    # Utilities & core logic
│   ├── levels/             # Progression logic
│   ├── llm/                # OpenAI integration
│   ├── supabase/           # Supabase clients
│   └── types/              # TypeScript definitions
└── public/                 # Static assets
```

---

## 🎯 Key Concepts

### Levels (5 total)
1. **Spark** (0 XP) - Ideation → Unlocks Muse
2. **Build Prep** (100 XP) - Architecture → Unlocks Architect
3. **Core Build** (250 XP) - Implementation → Unlocks Crafter, Hacker
4. **Launch** (500 XP) - Go-to-market → Unlocks Hypebeast
5. **Grow** (1000 XP) - Scaling → Unlocks Sensei

### AI Helpers
- **Muse** ✨ - The Ideator: Brainstorming, validation
- **Architect** 🏗️ - The Planner: Tech stack, architecture
- **Crafter** 🎨 - The Designer: UI/UX, branding
- **Hacker** ⚡ - The Builder: Debugging, fixes
- **Hypebeast** 🚀 - The Launcher: Marketing, hype
- **Sensei** 🧘 - The Growth Master: Scaling, metrics

### Progression
- Complete **required tasks** to earn XP
- Reach XP threshold + complete all required tasks = **Level Up**
- Level up unlocks new helpers and tasks
- Track progress in visual journey path

---

## 🚢 Deployment (Vercel)

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. Add environment variables (same as `.env.local`)
4. Deploy!

### 3. Update GitHub OAuth for Production
- Create new OAuth app with production URLs
- Update Supabase GitHub provider settings

---

## 🧪 Development

### Scripts
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript errors
```

### Database Migrations
1. Make changes in Supabase SQL Editor
2. Export to `db/schema.sql`
3. Commit changes

### Testing (TODO)
```bash
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests with Playwright
```

---

## 🐛 Troubleshooting

**"Unauthorized" errors?**
- Check RLS policies are set up (`db/policies.sql`)
- Clear cookies and re-login

**Chat not working?**
- Verify `OPENAI_API_KEY` in `.env.local`
- Check OpenAI account has credits

**GitHub OAuth fails?**
- Verify callback URL matches in GitHub app
- Check Client ID/Secret in Supabase

**Build fails on Vercel?**
- Run `npm run build` locally to see errors
- Verify all environment variables are set in Vercel

See **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md#-support--troubleshooting)** for more.

---

## 📈 Roadmap

### v1.1 (Coming Soon)
- [ ] Full OpenAI streaming integration
- [ ] Interactive onboarding flow
- [ ] Real-time progress updates
- [ ] Mobile responsive improvements

### v2.0 (Future)
- [ ] Team projects & collaboration
- [ ] Leaderboards & community
- [ ] Shareable journey cards
- [ ] Custom journeys
- [ ] Integrations (GitHub, Vercel)

See full roadmap in **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md#-future-roadmap)**.

---

## 🤝 Contributing

This is currently a private project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

**© 2025 Codyssey. Built for vibecoders, by vibecoders.**

---

## 🙏 Acknowledgments

- Next.js team for the incredible framework
- Supabase for developer-friendly backend
- Vercel for seamless deployment
- OpenAI for powerful AI capabilities
- The vibecoding community for inspiration

---

## 📞 Support

- **Documentation**: [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- **Issues**: [GitHub Issues](#)
- **Discord**: Coming soon!
- **Twitter**: [@codyssey](#)

---

**Ready to build your dream project?** 🚀

```bash
npm run dev
# Visit http://localhost:3000
# Sign in and start your Codyssey! 🎓✨
```

---

Made with ❤️ for the vibecoding community
