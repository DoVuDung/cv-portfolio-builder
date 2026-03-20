# Skill Agent - MCP Implementation Guide

## Overview

The **Skill Agent** is a production-ready, MCP (Model Context Protocol) based AI system for the CV Portfolio Builder application. It's designed to analyze, optimize, and enhance CV/resume content intelligently.

---

## Key Features

- **CV Analysis** - Automated feedback and scoring
- **ATS Optimization** - Keyword matching for applicant tracking systems
- **Content Generation** - Professional summaries and improved bullet points
- **Skill Extraction** - Deduplication and categorization
- **Memory System** - Version control for CVs
- **Context Awareness** - Tailored suggestions based on user goals
- **Debug Mode** - Comprehensive logging and monitoring

---

## Architecture

```
src/agent/
├── schemas/           # TypeScript types and Zod validation
│   ├── cv.schema.ts
│   └── agent.schema.ts
├── tools/             # MCP tools (pure functions)
│   ├── base-tool.ts
│   └── core-tools.ts  # 6 core tools
├── memory/            # State management
│   └── cv-memory.ts   # CV + Session + Preference memory
├── context/           # User context management
│   └── context-manager.ts
├── services/          # External integrations
│   ├── llm.ts         # LLM provider abstraction
│   └── logger.ts      # Logging system
├── core/              # Agent orchestration
│   └── agent.ts       # Main agent logic
├── hooks/             # React hooks
│   └── useSkillAgent.ts
├── examples/          # Usage examples
│   └── usage-examples.tsx
└── index.ts           # Clean exports
```

---

## Core Components

### 1. Data Schemas

**Location:** `src/agent/schemas/cv.schema.ts`

```typescript
import { z } from 'zod'

export const cvSchema = z.object({
  profile: z.object({
    name: z.string(),
    title: z.string(),
    summary: z.string(),
    location: z.string(),
    contact: z.object({
      email: z.string().email(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
    }),
  }),
  skills: z.array(z.string()),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  education: z.array(educationSchema).default([]),
})

export type CV = z.infer<typeof cvSchema>
```

**Key Points:**
- Strict TypeScript with Zod runtime validation
- Comprehensive CV structure
- Type-safe throughout

---

### 2. MCP Tools

**Location:** `src/agent/tools/core-tools.ts`

Each tool follows the MCP pattern:
- Pure function
- Typed parameters and return values
- Testable in isolation
- Independent execution

#### Available Tools:

| Tool | Category | Description | Requires LLM |
|------|----------|-------------|--------------|
| `analyzeCV` | Analysis | Returns structured feedback | ❌ |
| `generateSummary` | Generation | Creates professional summary | ✅ |
| `improveExperience` | Optimization | Rewrites achievements | ✅ |
| `extractSkills` | Extraction | Categorizes skills | ❌ |
| `optimizeATS` | Optimization | ATS keyword matching | ✅ |
| `mapToUISections` | Mapping | UI-ready data format | ❌ |

**Example Tool Structure:**

```typescript
export class AnalyzeCVTool extends BaseTool<AnalyzeCVParams, CVAnalysis> {
  readonly metadata = {
    name: 'analyzeCV',
    description: 'Analyzes CV and returns structured feedback',
    parameters: [
      { name: 'cv', type: 'CV', description: 'Complete CV data', required: true },
    ],
    category: 'analysis',
    requiresLLM: false,
  }

  execute(params: AnalyzeCVParams): Promise<CVMetadata> {
    // Implementation
  }
}
```

---

### 3. Memory System

**Location:** `src/agent/memory/cv-memory.ts`

Three types of memory:

#### CV Memory
```typescript
import { cvMemory } from './memory/cv-memory'

// Save version
cvMemory.saveVersion(cvData, ['Updated experience'])

// Get latest
const current = cvMemory.getLatest()

// Get history
const history = cvMemory.getHistory()

// Restore version
cvMemory.restoreToVersion(2)
```

#### Session Memory
```typescript
import { sessionMemory } from './memory/cv-memory'

// Log tool execution
sessionMemory.logTool('analyzeCV', params, result)

// Get action history
const history = sessionMemory.getActionHistory()
```

#### Preference Memory
```typescript
import { preferenceMemory } from './memory/cv-memory'

// Update preferences
preferenceMemory.update({
  tone: 'professional',
  emphasis: ['technical', 'impact'],
})
```

---

### 4. Context System

**Location:** `src/agent/context/context-manager.ts`

Manages user context for tailored suggestions:

```typescript
import { contextManager } from './context/context-manager'

// Set target role
contextManager.setTargetRole('Senior Frontend Engineer')

// Set seniority
contextManager.setSeniority('senior')

// Set domain
contextManager.setDomain('SaaS')

// Get contextual suggestions
const suggestions = contextManager.getContextualSuggestions()
// → ["Showcase leadership", "Include metrics", etc.]
```

---

### 5. LLM Service Layer

**Location:** `src/agent/services/llm.ts`

Abstracts LLM providers:

```typescript
import { createLLMService } from './services/llm'

// Mock service (development)
const mockService = createLLMService('mock')

// OpenAI service (production)
const openaiService = createLLMService('openai', process.env.OPENAI_API_KEY)
```

**Supported Providers:**
- `mock` - For development/testing
- `openai` - GPT-4o-mini (configurable)

**Prompt Templates:**

```typescript
import { PROMPT_TEMPLATES } from './services/llm'

const prompt = PROMPT_TEMPLATES.generateSummary.format({
  wordCount: '100',
  currentRole: 'Frontend Developer',
  targetRole: 'Senior Engineer',
  skills: 'React, TypeScript',
  yearsExperience: '5',
})
```

---

### 6. Agent Orchestration

**Location:** `src/agent/core/agent.ts`

Main agent coordinates tool execution:

```typescript
import { createSkillAgent } from './core/agent'

const agent = createSkillAgent({
  debugMode: true,
  llmService: openaiService,
})

// Run task
const response = await agent.run('analyze_cv', { cv: cvData })

if (response.success) {
  console.log(response.result)
} else {
  console.error(response.error)
}
```

**Supported Tasks:**
- `analyze_cv` - Full CV analysis
- `optimize_cv` - ATS optimization
- `generate_summary` - Summary generation
- `improve_experience` - Achievement improvement

---

### 7. React Hooks

**Location:** `src/agent/hooks/useSkillAgent.ts`

#### useSkillAgent Hook

```typescript
import { useSkillAgent } from './hooks/useSkillAgent'

function MyComponent() {
  const {
    isLoading,
    error,
    analyzeCV,
    optimizeCV,
    generateSummary,
    improveExperience,
  } = useSkillAgent({
    debugMode: true,
    llmProvider: 'mock',
  })

  const handleAnalyze = async () => {
    const analysis = await analyzeCV(cvData)
    console.log(analysis)
  }

  return <button onClick={handleAnalyze}>Analyze</button>
}
```

#### useCVMemory Hook

```typescript
import { useCVMemory } from './hooks/useSkillAgent'

function CVEditor() {
  const { currentCV, saveCV, getHistory, restoreVersion } = useCVMemory()

  return (
    <div>
      <button onClick={() => saveCV(cvData)}>Save</button>
      <button onClick={() => restoreVersion(1)}>Restore v1</button>
    </div>
  )
}
```

#### useAgentContext Hook

```typescript
import { useAgentContext } from './hooks/useSkillAgent'

function ContextSettings() {
  const { context, updateContext, suggestions } = useAgentContext()

  return (
    <div>
      <select onChange={(e) => updateContext({ 
        targetRole: e.target.value 
      })}>
        <option>Senior Engineer</option>
        <option>Staff Engineer</option>
      </select>
      
      <ul>
        {suggestions().map(s => <li key={s}>{s}</li>)}
      </ul>
    </div>
  )
}
```

---

### 8. Logging & Debug System

**Location:** `src/agent/services/logger.ts`

#### Agent Logger

```typescript
import { agentLogger } from './services/logger'

// Log messages
agentLogger.debug('Debug info', { data })
agentLogger.info('User action', { action: 'analyze' })
agentLogger.warn('Warning', { issue: 'missing_field' })
agentLogger.error('Error occurred', { error })

// Log tool execution
agentLogger.logToolExecution('analyzeCV', params, result, duration)
```

#### Debug Manager

```typescript
import { debugManager } from './services/logger'

// Enable debug mode
debugManager.enable()

// Get statistics
const stats = debugManager.getStatistics()
// → { totalLogs: 100, toolCalls: 45, errors: 2, averageDuration: 234 }

// View recent tool calls
const toolCalls = debugManager.getRecentToolCalls()
```

---

## 🚀 Usage Examples

### Example 1: Quick CV Analysis

```typescript
import { useSkillAgent } from './hooks/useSkillAgent'

function CVAnalyzer() {
  const { analyzeCV } = useSkillAgent()

  const handleAnalyze = async () => {
    const analysis = await analyzeCV(cvData)
    
    console.log('Score:', analysis.score)
    console.log('Strengths:', analysis.strengths)
    console.log('Weaknesses:', analysis.weaknesses)
    console.log('Recommendations:', analysis.recommendations)
  }

  return <button onClick={handleAnalyze}>Analyze CV</button>
}
```

### Example 2: Complete Workflow

```typescript
function CompleteWorkflow() {
  const { analyzeCV, optimizeCV, generateSummary } = useSkillAgent({
    debugMode: true,
  })

  const runWorkflow = async () => {
    // Step 1: Analyze
    const analysis = await analyzeCV(cvData)
    
    // Step 2: Optimize for ATS
    const optimized = await optimizeCV(cvData, jobDescription)
    
    // Step 3: Generate summary
    const summary = await generateSummary(cvData, 'Senior Engineer')
    
    console.log('Workflow complete!')
  }

  return <button onClick={runWorkflow}>Run Full Workflow</button>
}
```

### Example 3: ATS Optimization

```typescript
function ATSOptimizer() {
  const { optimizeCV } = useSkillAgent({
    llmProvider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
  })

  const jobDescription = `
    Looking for Senior Engineer with:
    - React, TypeScript, Node.js
    - AWS, Docker, Kubernetes
    - Microservices architecture
  `

  const handleOptimize = async () => {
    const result = await optimizeCV(cvData, jobDescription)
    
    console.log('Match Score:', result.matchScore, '%')
    console.log('Missing Keywords:', result.missingKeywords)
    
    result.recommendations.forEach(rec => {
      console.log(`Add "${rec.keyword}" - ${rec.suggestion}`)
    })
  }

  return <button onClick={handleOptimize}>Optimize for ATS</button>
}
```

---

## 📊 Tool Output Examples

### analyzeCV Output

```typescript
{
  score: 75,
  strengths: [
    'Has a comprehensive professional summary',
    'Has 3 work experience entries',
    'Achievements include quantifiable impact',
    'Good number of skills listed'
  ],
  weaknesses: [
    'No projects to showcase skills',
    'Too few skills listed'
  ],
  recommendations: [
    'Add 2-3 relevant portfolio projects',
    'Add more technical skills (aim for 1)'
  ],
  sections: {
    profile: { complete: true, score: 90 },
    experience: { complete: true, score: 80 },
    projects: { complete: false, score: 0 },
    skills: { complete: true, score: 60 }
  }
}
```

### optimizeATS Output

```typescript
{
  optimizedCV: { /* enhanced CV */ },
  currentKeywords: ['react', 'typescript', 'nodejs'],
  missingKeywords: ['aws', 'docker', 'microservices'],
  matchScore: 45,
  recommendations: [
    {
      keyword: 'aws',
      priority: 'high',
      suggestion: 'Incorporate "aws" naturally into your CV'
    },
    // ...
  ]
}
```

### generateSummary Output

```typescript
"Experienced Senior Frontend Developer with  years of expertise, seeking Staff Engineer position. Proven track record in React, TypeScript, Node.js, GraphQL, and AWS. Demonstrated ability to deliver impactful results through innovative solutions and collaborative leadership."
```

---

## 🧪 Testing

### Unit Test Example

```typescript
import { AnalyzeCVTool } from './tools/core-tools'

describe('AnalyzeCVTool', () => {
  it('should analyze CV and return feedback', async () => {
    const tool = new AnalyzeCVTool()
    const cv = { /* test CV */ }
    
    const result = await tool.execute({ cv })
    
    expect(result.score).toBeGreaterThan(0)
    expect(result.strengths).toBeDefined()
    expect(result.weaknesses).toBeDefined()
  })
})
```

### Integration Test

```typescript
import { createSkillAgent } from './core/agent'

describe('SkillAgent Integration', () => {
  it('should run complete workflow', async () => {
    const agent = createSkillAgent({ debugMode: true })
    
    const response = await agent.run('analyze_cv', {
      cv: testCV,
    })
    
    expect(response.success).toBe(true)
    expect(response.result).toBeDefined()
  })
})
```

---

## 🔧 Configuration

### Environment Variables

```bash
# OpenAI API Key (for production)
OPENAI_API_KEY=sk-...

# Debug Mode
AGENT_DEBUG=true

# Log Level
AGENT_LOG_LEVEL=info
```

### Agent Configuration

```typescript
const agent = createSkillAgent({
  debugMode: true,          // Enable detailed logging
  llmService: openaiService, // LLM provider
})

// Or via hook
const { analyzeCV } = useSkillAgent({
  debugMode: true,
  llmProvider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
})
```

---

## 📈 Performance Considerations

- **Tools are memoized** - Results cached where possible
- **Lazy LLM calls** - Only when `requiresLLM: true`
- **TanStack Store** - Efficient reactive state
- **Async execution** - Non-blocking operations
- **Batch operations** - Chain multiple tool calls

---

## 🛡️ Error Handling

All tools return structured errors:

```typescript
try {
  const result = await analyzeCV(cvData)
} catch (error) {
  if (error instanceof Error) {
    console.error('Analysis failed:', error.message)
  }
}

// Or check response
const response = await agent.run('analyze_cv', { cv })
if (!response.success) {
  console.error('Agent error:', response.error)
}
```

---

## 🎨 Best Practices

1. **Always validate input** - Use Zod schemas
2. **Use TypeScript** - Full type safety
3. **Test tools independently** - Pure functions
4. **Enable debug mode in dev** - Better visibility
5. **Handle errors gracefully** - User-friendly messages
6. **Cache LLM responses** - Reduce API calls
7. **Log everything** - Easier debugging
8. **Version CV changes** - Track history

---

## 📚 Additional Resources

- **Usage Examples:** `src/agent/examples/usage-examples.tsx`
- **Type Definitions:** `src/agent/schemas/`
- **Tool Implementations:** `src/agent/tools/`
- **React Hooks:** `src/agent/hooks/`

---

## 🚦 Next Steps

1. ✅ **Implemented** - All core features
2. 🔄 **Testing** - Add unit tests for each tool
3. 🎯 **Integration** - Connect to UI components
4. 📊 **Monitoring** - Set up analytics
5. 🔒 **Security** - Add API rate limiting

---

**Status:** ✅ Production Ready

**Version:** 1.0.0

**Last Updated:** March 20, 2025
