# 📚 Helper Template Library Guide

## Overview
Every Helper now has a **Quick Actions & Templates** library with pre-built prompts to accelerate common tasks. This feature helps users get started faster and provides best-practice prompts for each helper's specialty.

---

## 🎨 UI Features

### Floating Icon Row (Expandable)
- **Location:** Inside chat area, positioned near top-right
- **Icon:** Gradient sparkles ✨ (purple to blue, matches prompt button)
- **Position:** Scrolls naturally with chat content
- **Behavior:** Click to expand/collapse horizontally
- **Expansion:** Icons slide in from the right with smooth animation
- **Auto-close:** Click outside to close automatically
- **Hover tooltips:** Each template icon shows name and category **below** the icon

### Template Icons
Each template appears as:
- **Circular icon button** with emoji
- **White background** with shadow
- **Hover tooltip** (appears below icon) showing:
  - Template title
  - Category (quick/deep/review)
- **Scale animation** on hover
- **One-click selection**

### Floating Input Field
The chat input is floating at the bottom:
- **Always visible** - Fixed position at bottom center
- **Maximized chat space** - No full-width section wrapper
- **Rounded pill design** - Matches helper theme colors
- **Shadow effect** - Elevated appearance
- **Responsive width** - Adapts to screen size

**Categories:**
- 🟢 **Quick** - Fast questions, 5-10 min tasks
- 🔵 **Deep** - Comprehensive analysis, 20-40 min
- 🟡 **Review** - Feedback and validation tasks

---

## 📋 Templates by Helper

### ✨ Muse (The Ideator) - 5 Templates
1. **🎯 Problem Statement** - Define core problem (quick)
2. **🔍 Competitor Analysis** - Analyze top 3 competitors (deep)
3. **💎 Value Proposition** - Craft unique value (quick)
4. **👥 User Interview Script** - Prepare interview questions (deep)
5. **✅ Idea Validation** - Validate concept checklist (review)

**Use Cases:**
- Starting a new idea
- Validating market fit
- Preparing user research

---

### 🏗️ Architect (The Stack Master) - 5 Templates
1. **🏗️ Tech Stack Selection** - Choose technologies (quick)
2. **📐 System Architecture** - Design system structure (deep)
3. **🗄️ Database Schema** - Design data models (deep)
4. **🔌 API Design** - Structure API endpoints (quick)
5. **⚠️ Technical Risks** - Identify potential issues (review)

**Use Cases:**
- Planning technical foundation
- Making architecture decisions
- Risk assessment

---

### 🎨 Crafter (The Brand Weaver) - 5 Templates
1. **🎨 UI Design System** - Create design foundation (deep)
2. **🗺️ User Flow Design** - Map user journeys (quick)
3. **✏️ Wireframe Feedback** - Review designs (review)
4. **✍️ UX Copywriting** - Write better copy (quick)
5. **✨ Brand Identity** - Define brand (deep)

**Use Cases:**
- Designing UI/UX
- Creating brand identity
- Getting design feedback

---

### ⚡ Hacker (The Builder) - 5 Templates
1. **🐛 Debug Issue** - Solve technical problems (quick)
2. **👀 Code Review** - Get code feedback (review)
3. **⚡ Feature Plan** - Plan implementation (deep)
4. **🚀 Deployment Setup** - Deploy your app (quick)
5. **⚡ Performance Optimization** - Speed up app (review)

**Use Cases:**
- Building features
- Debugging issues
- Deployment help

---

### 🚀 Hypebeast (The Launch Maestro) - 5 Templates
1. **🚀 Launch Strategy** - Plan your launch (deep)
2. **📱 Social Media Content** - Create engaging posts (quick)
3. **📄 Landing Page Copy** - Write compelling copy (deep)
4. **✉️ Launch Email** - Craft launch emails (quick)
5. **📰 Press Kit** - Create press materials (review)

**Use Cases:**
- Preparing launch
- Marketing content
- Public relations

---

### 🌟 Sensei (The Growth Sage) - 5 Templates
1. **📈 Growth Strategy** - Plan growth initiatives (deep)
2. **🔄 Retention Optimization** - Keep users coming back (quick)
3. **🎯 Onboarding Flow** - Optimize first experience (deep)
4. **📊 Metrics Analysis** - Understand your data (review)
5. **🎁 Referral Program** - Design viral growth (quick)

**Use Cases:**
- Growing user base
- Improving retention
- Analytics review

---

## 🎯 How to Use Templates

### Step-by-Step:
1. **Open chat** with any Helper
2. **Look** for sparkles ✨ icon in top right corner (floating, no background)
3. **Click** the sparkles icon to expand template icons
4. **Watch** as template icons slide in from the right
5. **Hover** over any icon to see its name and category
6. **Click** template icon → Prompt auto-fills input field
7. **Edit** if needed (customize with your details)
8. **Send** to get helper's response

### Visual Flow:
```
✨ (collapsed)  →  Click  →  🎯 🔍 💎 👥 ✅ ✨ (expanded)
                              ↓
                         Hover for tooltip
                              ↓
                         Click icon
                              ↓
                    Prompt fills input field
```

### Example Interaction:
```
1. Click sparkles ✨ icon
2. Icons slide in: 🏗️ 📐 🗄️ 🔌 ⚠️ ✨
3. Hover over 🏗️ → Tooltip shows "Tech Stack Selection (quick)"
4. Click 🏗️ icon
5. Input fills: "Help me choose a tech stack based on my constraints..."
6. Edit: Replace [Time budget] with "2 months", etc.
7. Send → Helper responds with personalized recommendations
8. Icons auto-collapse after selection
```

---

## 💡 Pro Tips

### 1. **Combine Templates**
Use multiple templates in sequence:
- Start with "Problem Statement" (Muse)
- Then "Tech Stack Selection" (Architect)
- Then "Feature Plan" (Hacker)

### 2. **Edit for Your Context**
Templates are starting points - always customize:
- Add your specific constraints
- Include relevant details
- Reference your project

### 3. **Use Categories Strategically**
- **Quick** templates for fast decisions
- **Deep** templates when you have time to dive in
- **Review** templates to validate work

### 4. **Save Custom Versions**
If you modify a template repeatedly:
- Keep it in a note/doc
- Paste when needed
- Or suggest we add it as a new template!

---

## 🔧 Technical Details

### Template Structure
```typescript
interface PromptTemplate {
  id: string;              // Unique identifier
  icon: string;            // Emoji for visual identity
  title: string;           // Short name
  description: string;     // What it helps with
  prompt: string;          // The actual prompt text
  category: "quick" | "deep" | "review";
}
```

### Adding New Templates
Located in: `lib/template-library.ts`

To add a template:
1. Open the file
2. Find your helper in `HELPER_TEMPLATES`
3. Add new template object to array
4. Choose appropriate category
5. Write clear, actionable prompt

---

## 📊 Benefits

### For Users:
- ⚡ **Faster Start** - No blank page syndrome
- 🎯 **Better Questions** - Learn to ask better prompts
- 📚 **Learn Best Practices** - Templates model good prompts
- 🚀 **Higher Quality** - Comprehensive questions = better answers

### For Your Business:
- 📈 **Higher Engagement** - Users interact more
- 💎 **Better Outcomes** - Quality guidance from start
- 🎓 **User Education** - Teaches effective prompting
- 💰 **Increased Value** - Users get more from helpers

---

## 🎨 Scrollbar Updates

### Dashboard Scrollbar
- **Track:** Transparent (matches background)
- **Thumb:** Light grey (#d1d5db)
- **Hover:** Slightly darker grey (#9ca3af)

### Chat Scrollbar
- **Main messages area:** Light grey thumb
- **Left sidebar:** White transparent (for dark backgrounds)
- **Consistent across all helpers**

---

## 🚀 Future Enhancements

Potential improvements:
- ⭐ **Favorite Templates** - Star frequently used ones
- 🔍 **Search Templates** - Filter by keyword
- 📝 **Custom Templates** - Users create their own
- 🤝 **Community Templates** - Share with other users
- 📊 **Template Analytics** - Track most useful ones
- 🏷️ **More Categories** - Add tags like "beginner", "advanced"

---

## 📞 Support

If you need help with templates:
1. Ask your current Helper: "How do I use templates effectively?"
2. Try different templates to find what works for you
3. Customize templates for your specific needs

Remember: Templates are **starting points**, not rigid rules. Feel free to modify, combine, and create your own variations!

---

**Happy Building! 🚀**

