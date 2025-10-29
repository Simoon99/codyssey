# Brave Search API Setup for Web Search

## Why Brave Search?

DuckDuckGo's free API returns 0 results most of the time. Brave Search offers:
- ✅ **2,000 FREE searches/month**
- ✅ **Fast and reliable**
- ✅ **Real-time web results**
- ✅ **Better quality than DuckDuckGo**

## Quick Setup (5 minutes)

### Step 1: Get Your API Key

1. **Go to:** https://brave.com/search/api/
2. **Click "Get Started"** or "Sign Up"
3. **Create a free account**
4. **Go to Dashboard** → **API Keys**
5. **Create a new API key**
6. **Copy the key** (starts with `BSA...`)

### Step 2: Add to Your Project

Open your `.env.local` file and add:

```bash
# Brave Search API (for web search in helpers)
BRAVE_SEARCH_API_KEY=your_key_here
```

Example:
```bash
BRAVE_SEARCH_API_KEY=BSAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

## Test It

1. **Ask Muse:** "What AI tools are trending right now?"
2. **Watch the logs** for:
   ```
   [searchWeb] Using Brave Search API
   [searchWeb] Brave found 5 results
   ```
3. **Get real-time results!** 🎉

## What Changes?

### Before (DuckDuckGo - No Results)
```
[searchWeb] Found 0 results
```
❌ Helper says "I couldn't fetch trending AI tools"

### After (Brave Search - Real Results)
```
[searchWeb] Using Brave Search API
[searchWeb] Brave found 5 results
```
✅ Helper uses actual search results to answer

## Pricing

| Plan | Searches/Month | Cost |
|------|----------------|------|
| **Free** | 2,000 | $0 |
| Starter | 15,000 | $5 |
| Pro | 50,000 | $15 |
| Premium | 200,000 | $50 |

**2,000 free searches/month** is plenty for development and testing!

## Alternative: Serper API (Google-powered)

If you want Google search results:

1. **Go to:** https://serper.dev/
2. **Sign up** (100 free searches/month)
3. **Get API key**
4. **Add to `.env.local`:**
   ```bash
   SERPER_API_KEY=your_key_here
   ```

Then update `lib/llm/agent-tools.ts` to use Serper instead of Brave.

## Current Fallback Behavior

**Without API Key:**
- Web search returns empty results
- Helper uses its training data instead
- Still provides good answers, but not real-time

**With API Key:**
- Web search returns real results
- Helper uses current information
- More accurate and up-to-date answers

## Troubleshooting

### "Search unavailable" message

**Check:**
1. Did you add `BRAVE_SEARCH_API_KEY` to `.env.local`?
2. Did you restart your dev server?
3. Is the key correct? (should start with `BSA`)

### Rate limiting

If you hit the 2,000/month limit:
- Upgrade to paid plan
- Use caching (implement in `searchWeb` function)
- Switch to Serper or another provider

## Security Note

✅ **Safe:** API key is in `.env.local` (server-side only)  
✅ **Safe:** Never exposed to frontend  
✅ **Safe:** Not committed to Git (in `.gitignore`)

⚠️ **Warning:** Don't share your API key publicly!

## Next Steps

Once web search is working:
1. **Test with all helpers** (Muse, Architect, Hacker, Sensei)
2. **Try different queries** to see real-time results
3. **Consider caching** results to reduce API calls
4. **Monitor usage** in Brave dashboard

## Questions?

- **Brave Search API Docs:** https://brave.com/search/api/docs/
- **Rate limits:** https://brave.com/search/api/pricing/
- **Support:** support@brave.com

Happy searching! 🔍✨

