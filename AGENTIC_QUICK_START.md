# Agentic Helpers - Quick Start

## ⚡ TL;DR

Your Helpers are now **AI agents** that can:
- 💾 Save documents, code, and designs
- ✅ Create and track tasks
- 📊 Analyze project data
- 🔍 Search for resources
- 🔔 Schedule reminders

## 🚀 Try It Now

### 1. Start the Dev Server

```bash
npm run dev
```

### 2. Test Each Helper's Agency

#### Muse (Problem Validation)
```
You: "Help me define the problem I'm solving"
Muse: [Asks questions, then AUTOMATICALLY saves problem statement]
Look for: Purple "Save Artifact" badge → Green checkmark
```

#### Architect (Tech Planning)
```
You: "What tech stack should I use for a SaaS app?"
Architect: [Recommends stack, then AUTOMATICALLY saves tech doc]
Look for: Purple "Save Artifact" badge with document
```

#### Crafter (Design)
```
You: "Create a design system for my app"
Crafter: [Designs system, then AUTOMATICALLY saves style guide]
Look for: Purple "Save Artifact" badge with design
```

#### Hacker (Development)
```
You: "Show me how to implement authentication"
Hacker: [Provides code, then AUTOMATICALLY saves snippet]
Look for: Purple "Save Artifact" badge with code
```

#### Hypebeast (Launch)
```
You: "Write a Product Hunt launch post for me"
Hypebeast: [Writes post, then AUTOMATICALLY saves content]
Look for: Purple "Save Artifact" badge with launch copy
```

#### Sensei (Growth)
```
You: "What metrics should I track?"
Sensei: [Recommends metrics, then AUTOMATICALLY saves framework]
Look for: Purple "Save Artifact" badge with metrics doc
```

## 👀 What to Look For

### Tool Usage Indicators:

1. **Purple Badge** (Tool Being Called):
   ```
   🔮 Save Artifact
      In progress...
   ```

2. **Green Checkmark** (Tool Completed):
   ```
   ✓ Problem Statement v1
   ```

### Conversation Persistence:

1. Start conversation with Muse
2. Ask a question, get response
3. **Refresh the page**
4. Continue conversation
5. ✅ Context should be maintained!

## 🎯 Key Differences

### Before:
```
You: "Create a problem statement"
Helper: "Here's a problem statement: [text]"
[User has to copy/paste manually]
```

### Now:
```
You: "Create a problem statement"  
Helper: "Let me help you..." [asks questions]
[AUTOMATICALLY uses save_artifact tool]
[Purple badge appears showing action]
[Green checkmark shows success]
Result: Document saved! User can download/reference later
```

## 🛠️ Environment Setup

Ensure you have:

```env
OPENAI_API_KEY=sk-...
```

## 🔧 Quick Fixes

### Tools Not Working?

1. Check console for errors
2. Verify `OPENAI_API_KEY` is set
3. Make sure `/api/chat` runtime is "nodejs" not "edge"

### Not Seeing Tool Badges?

1. Check browser console for streaming events
2. Look for `type: "tool_call"` events
3. Verify `currentToolCalls` state is updating

### Thread Not Persisting?

1. Check `threadId` is being stored
2. Verify subsequent requests include `threadId`
3. Check localStorage/state management

## 📊 Testing Checklist

- [ ] Muse can save artifacts (problem statement, competitive analysis)
- [ ] Architect can save tech docs and create tasks
- [ ] Crafter can save designs and generate templates
- [ ] Hacker can save code and update task status
- [ ] Hypebeast can save launch content and schedule reminders
- [ ] Sensei can analyze data and save growth strategies
- [ ] Tool badges appear when tools are called
- [ ] Green checkmarks show when tools succeed
- [ ] Conversations persist across page refreshes
- [ ] Multiple messages work in same thread

## 🎨 Visual Cues

### Tool Badge Design:
- **Background**: Purple-to-blue gradient
- **Icon**: Loader (spinning) → CheckCircle (success)
- **Text**: Tool name (formatted)
- **Position**: Between messages

### Example Flow:
```
[User Message: "Help me with X"]
↓
[Assistant starts responding...]
↓
[Purple Badge: "Save Artifact - In progress..."]
↓
[Badge turns green: "✓ Artifact Name"]
↓
[Assistant continues/completes response]
```

## 📝 Example Prompts to Test

### Testing save_artifact:
- "Create a problem statement for my fitness app"
- "Design a tech stack for my project"
- "Write launch copy for Product Hunt"

### Testing create_task:
- "What tasks do I need to complete this week?"
- "Break down the MVP into tasks"
- "Create a launch timeline"

### Testing generate_template:
- "Generate an interview script"
- "Create a launch checklist"
- "Make a metrics dashboard template"

### Testing analyze_project_data:
- "What are the biggest risks in my project?"
- "Analyze my progress so far"
- "Identify what I should focus on next"

## 🚨 Common Issues

### Issue: "Failed to get response"
- **Fix**: Check OpenAI API key and billing

### Issue: No tool badges appearing
- **Fix**: Open dev console, check for streaming events

### Issue: Thread not persisting
- **Fix**: Check that `threadId` is in localStorage/state

## 🎯 Success Indicators

You'll know it's working when:

1. ✅ Purple badges appear when agent uses tools
2. ✅ Green checkmarks show successful actions
3. ✅ Conversations continue after page refresh
4. ✅ Agents proactively create artifacts
5. ✅ Tasks are created automatically
6. ✅ Responses reference previous context

## 🚀 Next Steps

Once basic functionality works:

1. **Add persistence**: Save artifacts to database
2. **Build artifact library**: UI to view all saved items
3. **Enable downloads**: Let users download artifacts
4. **Add notifications**: Alert users when tasks are created
5. **Implement scheduling**: Actually send scheduled reminders

## 💡 Pro Tips

1. **Be specific**: "Create and save a problem statement" is clearer than "help me"
2. **Ask for actions**: "Generate a launch checklist for me" triggers tools
3. **Test edge cases**: Try multiple tool calls in one response
4. **Monitor console**: Streaming events show what's happening
5. **Use dev tools**: Network tab shows API calls

## 📚 Full Documentation

For complete details, see `AGENTIC_HELPERS_GUIDE.md`

---

**Your Helpers are ready to work autonomously!** 🎉

