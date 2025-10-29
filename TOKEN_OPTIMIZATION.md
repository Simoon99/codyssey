# Token Optimization Strategy

## Overview
This document outlines the token optimization strategies implemented to reduce OpenAI API costs while maintaining high-quality context awareness for the Helper system.

## Token Usage Before Optimization

**Previous Approach:**
- Included ALL completed tasks from all levels
- Showed last 5 messages from each helper conversation
- Full message content in system prompts (150+ chars per message preview)
- Verbose formatting with multiple newlines

**Estimated Token Usage per Request:** ~1,500-2,500 tokens for context alone

## Optimizations Implemented

### 1. **Completed Tasks Filtering** (`lib/llm/provider.ts`)
**Before:**
```typescript
// Showed all completed tasks from all levels
Object.keys(tasksByLevel).forEach(level => {
  // Listed every task with full details
});
```

**After:**
```typescript
// Only show tasks from current and previous level
const recentTasks = context.allCompletedTasks.filter(
  task => task.level >= currentLevel - 1 && task.level <= currentLevel
);
// Compact format: comma-separated list
prompt += `Recent Completed Tasks: ${recentTasks.map(t => t.title).join(', ')}`;
```

**Token Savings:** ~200-400 tokens (depending on progress)

### 2. **Helper Conversation Compression** (`lib/llm/provider.ts`)
**Before:**
```typescript
// Last 5 messages from each helper, 150 char preview each
helperConvo.recentMessages.slice(-3).forEach(msg => {
  const preview = msg.content.substring(0, 150) + '...';
  prompt += `\n- ${msg.role}: ${preview}`;
});
```

**After:**
```typescript
// Only last user question + last assistant response (1 of each)
const lastUserMsg = messages.filter(m => m.role === 'user').slice(-1)[0];
const lastAssistantMsg = messages.filter(m => m.role === 'assistant').slice(-1)[0];
// Compressed previews: 80 chars for user, 100 for assistant
prompt += `Asked about: "${lastUserMsg.content.substring(0, 80)}..." | Key point: ${lastAssistantMsg.content.substring(0, 100)}...`;
```

**Token Savings:** ~300-600 tokens per request

### 3. **Message Limit Reduction** (`app/api/context/route.ts`)
**Before:**
```typescript
.slice(0, 5) // Last 5 messages from each helper
```

**After:**
```typescript
.slice(0, 2) // Last 2 messages from each helper
```

**Token Savings:** ~150-300 tokens per request

### 4. **Compact Formatting**
- Removed verbose section headers
- Consolidated information into single lines where possible
- Removed redundant explanations
- Used compact punctuation (|, :, —) instead of newlines

**Token Savings:** ~100-200 tokens per request

## Total Token Savings

**Estimated Reduction:** 750-1,500 tokens per request (50-60% reduction in context tokens)

**New Estimated Token Usage per Request:** ~750-1,000 tokens for context

## Cost Impact Analysis

### Assumptions:
- Model: gpt-4o-mini
- Input cost: $0.150 per 1M tokens
- Output cost: $0.600 per 1M tokens
- Average conversation: 10 messages
- Average users per day: 100 users × 5 helpers = 500 conversations/day

### Monthly Savings:

**Before Optimization:**
- Context tokens per request: 2,000
- Total input tokens/day: 500 conversations × 10 messages × 2,000 = 10M tokens
- Monthly input tokens: 10M × 30 = 300M tokens
- Cost: 300M × $0.150 / 1M = **$45/month** (context only)

**After Optimization:**
- Context tokens per request: 800
- Total input tokens/day: 500 × 10 × 800 = 4M tokens
- Monthly input tokens: 4M × 30 = 120M tokens
- Cost: 120M × $0.150 / 1M = **$18/month** (context only)

**Monthly Savings: ~$27/month or 60% reduction**

At scale (1,000 users): **$270/month savings**

## Quality Preservation

Despite token reduction, we maintain high-quality context awareness by:

1. **Keeping most relevant information:**
   - Current and previous level tasks (recent progress)
   - Latest question and answer from each helper (key insights)
   - All current step tasks (full detail)

2. **Smart filtering:**
   - Only includes helpers that have actual conversations
   - Filters out empty or irrelevant context

3. **Structured summaries:**
   - "Asked about X | Key point: Y" format provides context efficiently
   - Task titles alone are sufficient for reference

## Further Optimization Opportunities

If costs need further reduction:

1. **Conversation history trimming:** Only keep last 10-15 messages in chat history
2. **Selective helper context:** Only include relevant helpers based on current task type
3. **Caching:** Cache system prompts and context for repeated requests (when available in OpenAI API)
4. **Lazy loading:** Only fetch extended context when user explicitly asks for cross-helper insights

## Monitoring

To track effectiveness:

```typescript
// Add to chat API
console.log('Context tokens:', JSON.stringify(context).length / 4); // rough estimate
```

## Conclusion

The optimizations reduce token usage by 50-60% while preserving all critical context. The system remains fully aware of:
- Project details
- Journey progress
- Recent achievements
- Key insights from other helpers

This balanced approach ensures high-quality responses at a fraction of the cost.

