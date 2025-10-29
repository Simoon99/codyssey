# Chat Sessions - Quick Start

## 🚀 Setup (5 minutes)

### 1. Run Database Migration

```bash
# If using Supabase CLI
supabase migration new create_chat_sessions
# Copy content from db/migrations/create_chat_sessions.sql
supabase db push

# Or directly with psql
psql -d your_database -f db/migrations/create_chat_sessions.sql
```

### 2. Verify Tables Created

```bash
# Check tables exist
psql -d your_database -c "\dt chat_*"

# Should show:
# - chat_sessions
# - chat_messages
```

### 3. Test the Feature

```bash
npm run dev
```

## ✅ Testing Checklist

### Test 1: First Chat

- [ ] Open any helper (e.g., Muse)
- [ ] Click "Start Your Journey"
- [ ] Helper introduces themselves
- [ ] Look at sidebar: 1 session appears
- [ ] Session title matches first message

### Test 2: New Chat

- [ ] Click "+ New Chat" button
- [ ] New session starts
- [ ] Old session appears in history
- [ ] Both sessions in sidebar
- [ ] Can click between them

### Test 3: Messages Persist

- [ ] Send several messages
- [ ] Refresh page (F5)
- [ ] Messages reload correctly
- [ ] Conversation history intact
- [ ] Can continue chatting

### Test 4: Multiple Helpers

- [ ] Switch to different helper (e.g., Architect)
- [ ] Should see empty/"No previous chats"
- [ ] Create new session
- [ ] Switch back to first helper
- [ ] Original sessions still there
- [ ] Each helper has separate history

## 🎯 What to Look For

### Sidebar Updates

**Before**: "No previous chats"

**After**:
```
+ New Chat (button works)

Chat History
├── Help me define the problem...
│   └── Help me define the problem...
│       📅 Oct 27
├── What tech stack should I use?
│   └── What tech stack should...
│       📅 Oct 26
```

### Session Behavior

1. **Active session highlighted** (lighter background)
2. **Click to switch** between sessions
3. **Titles auto-generated** from first message
4. **Last message preview** shown
5. **Date displayed** for each session

### Message Flow

```
User: "Help me with X"
  ↓
💾 Saved to database
  ↓
🤖 Helper responds
  ↓
💾 Response saved
  ↓
✅ Both messages in session
```

## 🐛 Quick Fixes

### No sessions showing up?

```sql
-- Check if tables exist
SELECT * FROM pg_tables WHERE tablename LIKE 'chat_%';

-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('chat_sessions', 'chat_messages');
```

### Can't create sessions?

Check browser console for errors:
- 401: Authentication issue
- 403: RLS policy blocking
- 500: Database error

### Messages not persisting?

```sql
-- Verify trigger exists
SELECT tgname FROM pg_trigger 
WHERE tgname = 'update_chat_session_on_message';

-- Check message count
SELECT 
  s.title,
  COUNT(m.id) as messages
FROM chat_sessions s
LEFT JOIN chat_messages m ON m.session_id = s.id
GROUP BY s.id, s.title;
```

## 📊 Database Check

```sql
-- View all sessions for a user
SELECT 
  helper,
  title,
  last_message_at,
  (SELECT COUNT(*) FROM chat_messages WHERE session_id = chat_sessions.id) as msg_count
FROM chat_sessions
WHERE user_id = 'your-user-id'
ORDER BY last_message_at DESC;
```

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ "+ New Chat" button creates new sessions
2. ✅ Sessions appear in sidebar with titles
3. ✅ Can click sessions to switch between them
4. ✅ Active session highlighted
5. ✅ Messages persist after page refresh
6. ✅ Each helper has separate session history
7. ✅ Thread IDs maintained for continuity
8. ✅ Tool calls saved with messages

## 🚨 Common Issues

| Issue | Fix |
|-------|-----|
| "Unauthorized" error | Check user is logged in |
| Sessions not loading | Run migration script |
| Can't switch sessions | Check RLS policies |
| Messages disappearing | Verify trigger function |
| Duplicate sessions | Check session creation logic |

## 📝 Manual Testing Script

```
1. Login to app
2. Navigate to dashboard
3. Click on Muse helper
4. Verify: Empty state or existing sessions
5. Click "Start Your Journey"
6. Verify: Session created, appears in sidebar
7. Send message: "Help me define my problem"
8. Verify: Title updates to match message
9. Click "+ New Chat"
10. Verify: New session created, old one in history
11. Click old session in sidebar
12. Verify: Messages reload, can continue
13. Refresh page (F5)
14. Verify: Everything persists
15. Switch to different helper
16. Verify: Separate session history
```

## 🎓 Next Steps

Once basic functionality works:

1. **Test edge cases**: Empty messages, very long messages
2. **Test tool calls**: Verify they're saved with messages
3. **Test multiple users**: Ensure RLS working
4. **Test performance**: Many sessions, many messages
5. **Add analytics**: Track session metrics

## 📚 Full Documentation

For complete details, see `CHAT_SESSIONS_GUIDE.md`

---

**Sessions are ready to use!** 💬✨

