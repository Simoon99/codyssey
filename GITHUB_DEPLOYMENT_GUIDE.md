# 🚀 GitHub & Vercel Deployment Guide

## ✅ Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface (Recommended)

1. Go to [https://github.com/new](https://github.com/new)
2. Fill in the details:
   - **Repository name**: `codyssey` or `vibecoding-helpers`
   - **Description**: "AI-powered project journey platform for indie makers"
   - **Visibility**: Public (or Private if preferred)
   - **Initialize repository**: ❌ DO NOT check this (we already have files)
3. Click **Create repository**
4. You'll see commands - use the ones below

### Option B: Using GitHub CLI

```bash
gh repo create codyssey --public --source=. --remote=origin --push
```

---

## ✅ Step 2: Push to GitHub

After creating the repository on GitHub, run these commands:

```bash
# Add GitHub as remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/Simoon99/codyssey.git

# Rename branch to main if needed
git branch -M main

# Push code to GitHub
git push -u origin main
```

**That's it!** Your code is now on GitHub at: `https://github.com/Simoon99/codyssey`

---

## ✅ Step 3: Deploy to Vercel

### Option 1: From Git Push (Automatic - Recommended)

Once Vercel is connected to GitHub, every push auto-deploys:

```bash
# Make changes, then push
git add .
git commit -m "feat: update journey flow"
git push origin main

# Vercel automatically builds and deploys! ✨
```

### Option 2: Manual Deployment via CLI

```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod --yes

# View deployment logs
vercel logs
```

---

## 📋 Complete Command Sequence

### First Time Setup (Do This Now):

```bash
# 1. Configure git (already done, but verify)
git config user.name "Simoon99"
git config user.email "simoon99@gmail.com"

# 2. Add GitHub remote
git remote add origin https://github.com/Simoon99/codyssey.git

# 3. Rename to main branch if needed
git branch -M main

# 4. Push to GitHub
git push -u origin main

# 5. Deploy to Vercel
vercel --prod --yes
```

### Future Deployments:

```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main

# If not auto-deploying, manually deploy:
vercel --prod --yes
```

---

## 🔗 Set Up Automatic Deployments

### Connect Vercel to GitHub:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project (codyssey)
3. Go to **Settings → Git Integration**
4. Connect your GitHub account
5. Select your repository: `Simoon99/codyssey`
6. Enable **Automatic Deployments** for `main` branch
7. Every push to `main` now auto-deploys! 🎉

---

## ✅ Environment Variables

Make sure these are set in Vercel:

```bash
# Check env vars
vercel env ls

# Add if missing
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_DEV_MODE  # Set to: false
```

---

## 🎯 Verify Deployment

### Check GitHub:
```
https://github.com/Simoon99/codyssey
```

### Check Vercel:
```
https://vercel.com/simoon99s-projects
```

### Check Live App:
```
https://codyssey-[random].vercel.app
```

---

## 🔄 Troubleshooting

### "fatal: 'origin' does not appear to be a 'git' repository"

**Solution**: Add the remote
```bash
git remote add origin https://github.com/Simoon99/codyssey.git
```

### "Permission denied (publickey)"

**Solution**: Set up GitHub SSH key
```bash
# Generate SSH key (follow prompts)
ssh-keygen -t ed25519 -C "simoon99@gmail.com"

# Add to GitHub: https://github.com/settings/ssh/new
# Paste public key from ~/.ssh/id_ed25519.pub
```

Or use HTTPS instead:
```bash
git remote set-url origin https://github.com/Simoon99/codyssey.git
```

### Vercel build fails after push

**Solution**:
```bash
# Check Vercel logs
vercel logs

# Redeploy manually
vercel --prod --yes
```

---

## 📚 Quick Reference

| Task | Command |
|------|---------|
| Clone repo locally | `git clone https://github.com/Simoon99/codyssey.git` |
| See all remotes | `git remote -v` |
| Push to GitHub | `git push origin main` |
| Deploy to Vercel | `vercel --prod --yes` |
| Check Vercel status | `vercel ls` |
| View Vercel logs | `vercel logs` |
| Set env var | `vercel env add KEY` |
| Remove remote | `git remote remove origin` |

---

## 🎉 Success Checklist

- ✅ Repository created on GitHub
- ✅ Code pushed to GitHub
- ✅ Vercel connected to GitHub
- ✅ Environment variables set
- ✅ App deployed and live
- ✅ Auto-deployments enabled

---

## 🔐 Security Reminders

⚠️ **NEVER commit these to GitHub:**
- `.env.local` (local secrets)
- `SUPABASE_SERVICE_ROLE_KEY` (backend key)
- `OPENAI_API_KEY` (API keys)

✅ **These are safe to commit:**
- `vercel.json`
- `.gitignore`
- Source code
- Documentation

---

## 📖 Useful Links

- [GitHub](https://github.com/Simoon99)
- [Vercel Dashboard](https://vercel.com/simoon99s-projects)
- [GitHub SSH Setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Vercel Documentation](https://vercel.com/docs)

---

**Your app is now on GitHub and Vercel! 🚀**
