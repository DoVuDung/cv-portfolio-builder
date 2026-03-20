# 🚀 Skill Agent - Quick Reference Card

## 📦 Imports

```typescript
// Main import
import { 
  useSkillAgent, 
  useCVMemory, 
  useAgentContext,
} from '@/agent/hooks/useSkillAgent'

// Direct imports
import { cvMemory } from '@/agent/memory/cv-memory'
import { contextManager } from '@/agent/context/context-manager'
import { agentLogger, debugManager } from '@/agent/services/logger'
```

---

## ⚡ Quick Start

### Basic Hook Usage
```typescript
const { analyzeCV, optimizeCV, generateSummary } = useSkillAgent({
  debugMode: true,
  llmProvider: 'mock', // or 'openai'
})

// Analyze CV
const analysis = await analyzeCV(cvData)
console.log('Score:', analysis.score)

// Optimize for ATS
const optimized = await optimizeCV(cvData, jobDescription)
console.log('Match:', optimized.matchScore, '%')

// Generate Summary
const summary = await generateSummary(cvData, 'Senior Engineer')
```

---

## 🛠️ Core Tools

| Tool | Purpose | LLM | Example |
|------|---------|-----|---------|
| `analyzeCV` | Score & feedback | ❌ | `analyzeCV(cv)` |
| `generateSummary` | Create summary | ✅ | `generateSummary(cv, role)` |
| `improveExperience` | Enhance bullets | ✅ | `improveExperience(exp)` |
| `extractSkills` | Categorize skills | ❌ | `extractSkills(cv)` |
| `optimizeATS` | Keyword match | ✅ | `optimizeATS(cv, jobDesc)` |
| `mapToUISections` | UI format | ❌ | `mapToUISections(cv)` |

---

## 💾 Memory API

### CV Memory
```typescript
import { cvMemory } from '@/agent/memory/cv-memory'

cvMemory.saveVersion(cv, ['Updated experience'])
const current = cvMemory.getLatest()
const history = cvMemory.getHistory()
cvMemory.restoreToVersion(2)
```

### Session Memory
```typescript
sessionMemory.logTool('analyzeCV', params, result)
const actions = sessionMemory.getActionHistory()
```

### Preference Memory
```typescript
preferenceMemory.update({ tone: 'professional' })
const prefs = preferenceMemory.get()
```

---

## 🎯 Context API

```typescript
import { contextManager } from '@/agent/context/context-manager'

contextManager.setTargetRole('Senior Engineer')
contextManager.setSeniority('senior')
contextManager.setDomain('SaaS')

const suggestions = contextManager.getContextualSuggestions()
```

---

## 🔍 Debug Tools

```typescript
import { debugManager, agentLogger } from '@/agent/services/logger'

// Enable debug
debugManager.enable()

// View stats
const stats = debugManager.getStatistics()
// → { totalLogs, toolCalls, errors, averageDuration }

// Log messages
agentLogger.info('Action', { action: 'analyze' })
agentLogger.error('Error', { error })
```

---

## 📊 Response Types

### CVAnalysis
```typescript
{
  score: number (0-100),
  strengths: string[],
  weaknesses: string[],
  recommendations: string[],
  sections: { [key: string]: { complete: boolean, score: number } }
}
```

### ATSOptimization
```typescript
{
  optimizedCV: CV,
  currentKeywords: string[],
  missingKeywords: string[],
  matchScore: number | null,
  recommendations: Array<{ keyword, priority, suggestion }>
}
```

### AgentResponse
```typescript
{
  success: boolean,
  result?: any,
  error?: string,
  metadata: { duration, taskId, context? }
}
```

---

## 🎨 React Patterns

### Loading State
```typescript
const { analyzeCV, isLoading, error } = useSkillAgent()

<button disabled={isLoading}>
  {isLoading ? 'Analyzing...' : 'Analyze CV'}
</button>
```

### Error Handling
```typescript
try {
  const result = await analyzeCV(cv)
} catch (err) {
  setError(err instanceof Error ? err.message : 'Failed')
}
```

### Version History
```typescript
const { currentCV, saveCV, getHistory, restoreVersion } = useCVMemory()

saveCV(cv, ['Added new job'])
const versions = getHistory()
restoreVersion(1)
```

---

## 🔧 Configuration

### Development
```typescript
useSkillAgent({
  debugMode: true,
  llmProvider: 'mock',
})
```

### Production
```typescript
useSkillAgent({
  debugMode: false,
  llmProvider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
})
```

---

## 📝 Common Patterns

### Complete Workflow
```typescript
const runWorkflow = async () => {
  const analysis = await analyzeCV(cv)
  const optimized = await optimizeCV(cv, jobDesc)
  const summary = await generateSummary(cv, targetRole)
  
  console.log('Done!', { analysis, optimized, summary })
}
```

### Conditional Execution
```typescript
if (analysis.score < 70) {
  await optimizeCV(cv)
}
```

### Batch Updates
```typescript
const improved = await Promise.all([
  improveExperience(exp1),
  improveExperience(exp2),
])
```

---

## ⚠️ Gotchas

1. **Always await async calls**
   ```typescript
   const result = await analyzeCV(cv) // ✅
   analyzeCV(cv) // ❌ Returns Promise
   ```

2. **Check for errors**
   ```typescript
   try {
     await analyzeCV(cv)
   } catch (error) {
     // Handle error
   }
   ```

3. **Validate CV structure**
   ```typescript
   import { cvSchema } from '@/agent/schemas/cv.schema'
   cvSchema.parse(cvData) // Throws if invalid
   ```

4. **Use debug mode in development**
   ```typescript
   useSkillAgent({ debugMode: true })
   ```

---

## 📚 File Locations

```
src/agent/
├── hooks/useSkillAgent.ts      # React hooks
├── memory/cv-memory.ts          # State management
├── context/context-manager.ts   # Context
├── services/
│   ├── llm.ts                   # LLM integration
│   └── logger.ts                # Logging
├── tools/core-tools.ts          # MCP tools
├── schemas/
│   ├── cv.schema.ts             # CV types
│   └── agent.schema.ts          # Agent types
└── core/agent.ts                # Main agent
```

---

## 🎯 Task Types

```typescript
type AgentTask =
  | 'analyze_cv'        // Full analysis
  | 'optimize_cv'       // ATS optimization
  | 'generate_summary'  // Summary generation
  | 'improve_experience' // Bullet improvement
```

---

## 📈 Performance Tips

1. **Cache LLM responses** - Reduce API calls
2. **Batch tool calls** - Chain operations
3. **Use derived states** - TanStack Store optimizes
4. **Debounce user input** - Don't trigger on every keystroke
5. **Lazy load heavy tools** - Load on demand

---

## 🧪 Testing Pattern

```typescript
describe('AnalyzeCVTool', () => {
  it('should analyze CV', async () => {
    const tool = new AnalyzeCVTool()
    const result = await tool.execute({ cv: testCV })
    
    expect(result.score).toBeGreaterThan(0)
    expect(result.strengths).toBeDefined()
  })
})
```

---

## 🔗 Integration Examples

### With Resume Templates
```typescript
const { mapToUISections } = useSkillAgent()
const uiData = await mapToUISections(cv)
// Pass to TemplateRenderer
```

### With Form Components
```typescript
const { improveExperience } = useSkillAgent()
const improved = await improveExperience(experienceData)
form.setValue('experience', improved)
```

---

## 💡 Pro Tips

1. **Enable debug mode** for better visibility
2. **Log all tool calls** during development
3. **Save CV versions** before major changes
4. **Use mock LLM** for faster iteration
5. **Check context suggestions** regularly

---

**Quick Reference | v1.0.0 | March 2025**
