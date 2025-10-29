# Chat Sessions & History - Complete Guide

## 🎉 What's New

Your Helpers now have **persistent chat sessions** with full history management. Users can:
- Create multiple chat conversations with each helper
- Switch between different chat sessions
- View chat history in the sidebar
- Resume conversations where they left off
- Automatic session titles from first message

## 🏗️ Architecture

### Database Schema

Two new tables manage chat sessions:

#### `chat_sessions`
Stores individual conversation sessions:
```sql
- id (UUID): Session identifier
- user_id (UUID): Owner of the session
- project_id (UUID): Associated project
- helper (TEXT): Which helper (muse, architect, etc.)
- thread_id (TEXT): OpenAI thread ID
- title (TEXT): Session title (auto-generated)
- last_message_preview (TEXT): Preview of last message
- last_message_at (TIMESTAMPTZ): Timestamp of last activity
- created_at (TIMESTAMPTZ): When session was created
- updated_at (TIMESTAMPTZ): Last update time
```

#### `chat_messages`
Stores all messages in sessions:
```sql
- id (UUID): Message identifier
- session_id (UUID): Parent session
- role (TEXT): 'user' or 'assistant'
- content (TEXT): Message content
- tool_calls (JSONB): Tool usage data (optional)
- created_at (TIMESTAMPTZ): When message was sent
```

### API Endpoints

#### 1. List Sessions
**GET** `/api/chat/sessions?projectId=X&helper=muse`

Returns all sessions for a helper and project:
```json
{
  "sessions": [
    {
      "id": "session-id",
      "helper": "muse",
      "thread_id": "thread_abc123",
      "title": "Help me define the problem I'm solving",
      "last_message_preview": "Help me define the problem...",
      "last_message_at": "2025-10-27T10:30:00Z",
      "created_at": "2025-10-27T10:00:00Z"
    }
  ]
}
```

#### 2. Create Session
**POST** `/api/chat/sessions`

Body:
```json
{
  "projectId": "project-id",
  "helper": "muse",
  "title": "New Chat"
}
```

Response:
```json
{
  "session": {
    "id": "new-session-id",
    "thread_id": "new-thread-id",
    ...
  }
}
```

#### 3. Delete Session
**DELETE** `/api/chat/sessions?sessionId=X`

Deletes a session and all its messages (cascade).

#### 4. Get Session Messages
**GET** `/api/chat/sessions/[id]/messages`

Returns session details and all messages:
```json
{
  "session": { ... },
  "messages": [
    {
      "id": "msg-id",
      "role": "user",
      "content": "Help me with X",
      "createdAt": "2025-10-27T10:00:00Z"
    },
    {
      "id": "msg-id-2",
      "role": "assistant",
      "content": "Sure! Let me help you...",
      "toolCalls": [...],
      "createdAt": "2025-10-27T10:00:05Z"
    }
  ]
}
```

#### 5. Add Message to Session
**POST** `/api/chat/sessions/[id]/messages`

Body:
```json
{
  "role": "user",
  "content": "My message",
  "toolCalls": [...] // Optional
}
```

## 🎨 UI Updates

### Sidebar Chat History

The left sidebar now shows:
- **Loading state** while fetching sessions
- **Empty state** if no sessions exist
- **List of sessions** with:
  - Session title (auto-generated from first message)
  - Last message preview
  - Date of last activity
  - Active session highlighted
  - Click to switch sessions

### New Chat Button

- Creates a new session with a fresh OpenAI thread
- Automatically starts the journey with the helper
- Adds to the top of the session list
- Immediately active and ready for conversation

### Session Persistence

- Current session stored in state
- Messages loaded from database on session switch
- Thread ID maintained for OpenAI continuity
- All messages auto-saved to database

## 🔄 User Flow

### Starting Fresh

1. User opens helper chat (no sessions yet)
2. Sees empty state: "No previous chats"
3. Can click "Start Your Journey" or type a message
4. Session auto-created with thread
5. First user message becomes session title
6. Conversation proceeds normally

### Creating New Chat

1. User clicks "+ New Chat" button
2. New session created with fresh thread
3. Auto-starts journey with helper intro
4. Old session saved in history
5. New session becomes active

### Switching Sessions

1. User clicks on a session in sidebar
2. Messages loaded from database
3. Session becomes active
4. Thread ID used for continued conversation
5. Context maintained from previous messages

### Continuing Conversation

1. User types message in active session
2. Message added to state immediately
3. Message saved to database
4. Sent to OpenAI with thread ID
5. Response streams back
6. Assistant message saved to database
7. Tool calls saved if any

## 📊 Data Flow

```
User Action
  ↓
Create/Load Session
  ↓
Load Messages from DB
  ↓
Display in UI
  ↓
User Sends Message
  ↓
Save to DB + State
  ↓
Send to OpenAI (with thread_id)
  ↓
Stream Response
  ↓
Update UI + Save to DB
```

## 🔧 Key Implementation Details

### Auto-Generated Titles

First user message in a session becomes the title:
```typescript
// When first user message is sent
if (this is first user message) {
  const title = content.substring(0, 50) + "...";
  updateSession({ title });
}
```

### Session Loading

On component mount:
```typescript
1. Fetch all sessions for helper
2. If sessions exist, load most recent
3. Display sessions in sidebar
4. Load messages for active session
```

### Message Saving

Messages are saved immediately:
```typescript
1. User sends message → save to DB
2. Assistant responds → stream to UI
3. Response complete → save to DB
4. Tool calls included in message data
```

### Thread Continuity

OpenAI threads ensure context:
```typescript
// Each session has a thread_id
{
  session: {
    thread_id: "thread_abc123",
    ...
  }
}

// Used in every API call
await openai.chat({
  thread_id: session.thread_id,
  ...
});
```

## 🧪 Testing

### Test Scenario 1: First Time User

```
1. Open helper (Muse)
2. Should see: "No previous chats"
3. Click "Start Your Journey"
4. Helper introduces themselves
5. Check sidebar: 1 session appears
6. Check database: 1 session, 1 message
```

### Test Scenario 2: Multiple Chats

```
1. Start conversation in active session
2. Send a few messages back and forth
3. Click "+ New Chat"
4. New session starts, old one in history
5. Click old session in sidebar
6. Messages reload correctly
7. Continue old conversation
8. Context maintained
```

### Test Scenario 3: Page Refresh

```
1. Have active conversation
2. Refresh page (F5)
3. Sessions reload from database
4. Most recent session auto-selected
5. Messages display correctly
6. Can continue conversation
7. Thread context preserved
```

### Test Scenario 4: Session Switching

```
1. Create 3 different chat sessions
2. Send messages in each
3. Click between sessions in sidebar
4. Each loads correct messages
5. Active session highlighted
6. Can send messages in any session
7. Context separate per session
```

## 🎯 Features

### ✅ Implemented

- [x] Database schema with RLS policies
- [x] Session CRUD API endpoints
- [x] Message storage and retrieval
- [x] Session list in sidebar
- [x] New chat creation
- [x] Session switching
- [x] Auto-generated titles
- [x] Last message preview
- [x] Timestamp display
- [x] Active session highlighting
- [x] Thread continuity
- [x] Message persistence

### 🔮 Future Enhancements

- [ ] Session renaming
- [ ] Session deletion from UI
- [ ] Session search/filter
- [ ] Export session as markdown
- [ ] Share session with team
- [ ] Session folders/organization
- [ ] Pin important sessions
- [ ] Session analytics (word count, tool usage)
- [ ] Session archiving
- [ ] Bulk session operations

## 🔍 Troubleshooting

### Issue: Sessions not loading

**Check:**
1. Database tables exist
2. RLS policies configured
3. User authenticated
4. Console for API errors

**Solution:**
```bash
# Run migration
psql -d your_db -f db/migrations/create_chat_sessions.sql
```

### Issue: Messages not saving

**Check:**
1. Session ID exists
2. User owns session
3. Content not empty
4. Network tab for failed requests

**Solution:**
- Verify session ownership
- Check RLS policies
- Ensure session exists before saving messages

### Issue: Thread context lost

**Check:**
1. Thread ID stored in session
2. Thread ID sent in API calls
3. OpenAI thread still exists

**Solution:**
- Verify thread_id in database
- Check API request body includes threadId
- Create new session if thread expired

### Issue: Sessions in wrong order

**Check:**
1. `last_message_at` updating correctly
2. Trigger function working
3. Sort order in query

**Solution:**
```sql
-- Verify trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'update_chat_session_on_message';

-- Manual fix if needed
UPDATE chat_sessions
SET last_message_at = (
  SELECT MAX(created_at) FROM chat_messages 
  WHERE session_id = chat_sessions.id
);
```

## 📝 Database Queries

### Get user's sessions for a helper

```sql
SELECT * FROM chat_sessions
WHERE user_id = 'user-id'
  AND project_id = 'project-id'
  AND helper = 'muse'
ORDER BY updated_at DESC;
```

### Get session with message count

```sql
SELECT 
  s.*,
  COUNT(m.id) as message_count
FROM chat_sessions s
LEFT JOIN chat_messages m ON m.session_id = s.id
WHERE s.user_id = 'user-id'
GROUP BY s.id
ORDER BY s.updated_at DESC;
```

### Get recent sessions across all helpers

```sql
SELECT 
  s.*,
  m.content as last_message
FROM chat_sessions s
LEFT JOIN LATERAL (
  SELECT content FROM chat_messages
  WHERE session_id = s.id
  ORDER BY created_at DESC
  LIMIT 1
) m ON true
WHERE s.user_id = 'user-id'
ORDER BY s.last_message_at DESC
LIMIT 10;
```

## 🚀 Deployment Checklist

- [ ] Run database migration
- [ ] Verify tables created
- [ ] Test RLS policies
- [ ] Check API endpoints
- [ ] Test UI functionality
- [ ] Verify session creation
- [ ] Test session switching
- [ ] Check message persistence
- [ ] Validate thread continuity
- [ ] Test with multiple users

## 📖 Related Documentation

- `AGENTIC_HELPERS_GUIDE.md` - Agent system overview
- `AGENTIC_QUICK_START.md` - Quick testing guide
- `db/migrations/create_chat_sessions.sql` - Database schema

---

**Your Helpers now remember everything!** 🧠✨

