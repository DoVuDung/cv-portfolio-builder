# 🤖 Skill Agent Directory

Production-ready MCP (Model Context Protocol) based AI agent system for CV/portfolio optimization.

---

## 📁 Directory Structure

```
agent/
├── schemas/              # TypeScript types & Zod validation
│   ├── cv.schema.ts      # CV data models with validation
│   └── agent.schema.ts   # Agent context & action models
├── tools/                # MCP tools (pure functions)
│   ├── base-tool.ts      # Base tool class & interfaces
│   └── core-tools.ts     # 6 core CV tools
├── memory/               # State management with TanStack Store
│   └── cv-memory.ts      # CV + Session + Preference managers
├── context/              # User context management
│   └── context-manager.ts # Context state & suggestions
├── services/             # External integrations
│   ├── llm.ts            # LLM provider abstraction layer
│   └── logger.ts         # Logging & debug system
├── core/                 # Agent orchestration
│   └── agent.ts          # Main agent logic & tool registry
├── hooks/                # React hooks
│   └── useSkillAgent.ts  # React integration hooks
├── examples/             # Usage examples
│   └── usage-examples.tsx # 8 complete examples
└── index.ts              # Clean public API exports
```

---

## 🎯 What It Does

The Skill Agent helps users create, optimize, and enhance their CV/resume content through:

- **Automated Analysis** - Score and feedback on CV quality
- **ATS Optimization** - Keyword matching for applicant tracking systems  
- **Content Generation** - Professional summaries and improved bullet points
- **Skill Extraction** - Categorization and deduplication
- **Smart Suggestions** - Context-aware recommendations
- **Version Control** - Track and restore CV changes

---

## 🚀 Quick Start

### Basic Usage in React Component

```typescript
import { useSkillAgent } from '@/agent'

function CVEditor() {
  const { analyzeCV, optimizeCV, generateSummary } = useSkillAgent({
    debugMode: true,
    llmProvider: 'mock', // Use 'openai' in production
  })

  const handleAnalyze = async () => {
    const analysis = await analyzeCV(cvData)
    console.log('CV Score:', analysis.score)
  }

  return (
    <button onClick={handleAnalyze}>
      Analyze CV
    </button>
  )
}
```

---

## 🛠️ Core Tools

| Tool | Purpose | LLM Required | Example |
|------|---------|--------------|---------|
| `analyzeCV` | Score & feedback | ❌ | `analyzeCV(cv)` |
| `generateSummary` | Create summary | ✅ | `generateSummary(cv, role)` |
| `improveExperience` | Enhance bullets | ✅ | `improveExperience(exp)` |
| `extractSkills` | Categorize skills | ❌ | `extractSkills(cv)` |
| `optimizeATS` | Keyword match | ✅ | `optimizeATS(cv, jobDesc)` |
| `mapToUISections` | UI format | ❌ | `mapToUISections(cv)` |

---

## 📦 Key Features

### ✅ Production Ready
- Strict TypeScript throughout
- Runtime validation with Zod
- Comprehensive error handling
- Full test coverage ready

### ✅ Modular Architecture
- Clean separation of concerns
- Pluggable service providers
- Independent, testable units
- Easy to extend

### ✅ React Integration
- Custom hooks for easy use
- Loading & error states
- Async/await support
- Reactive updates

### ✅ Memory System
- CV versioning
- Session tracking
- Preference storage
- TanStack Store powered

### ✅ Debug Capabilities
- Structured logging
- Debug mode toggle
- Statistics tracking
- Tool call monitoring

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

## 📊 Response Types

### CVAnalysis
```typescript
interface CVAnalysis {
  score: number              // 0-100
  strengths: string[]        // What's good
  weaknesses: string[]       // What needs work
  recommendations: string[]  // How to improve
  sections: {               // Section-by-section breakdown
    [key: string]: {
      complete: boolean
      score: number
    }
  }
}
```

### ATSOptimization
```typescript
interface ATSOptimization {
  optimizedCV: CV
  currentKeywords: string[]
  missingKeywords: string[]
  matchScore: number | null  // Percentage match
  recommendations: Array<{
    keyword: string
    priority: 'high' | 'medium' | 'low'
    suggestion: string
  }>
}
```

---

## 🧪 Testing

### Unit Test Example
```typescript
import { AnalyzeCVTool } from './tools/core-tools'

describe('AnalyzeCVTool', () => {
  it('should analyze CV and return feedback', async () => {
    const tool = new AnalyzeCVTool()
    const cv = createTestCV()
    
    const result = await tool.execute({ cv })
    
    expect(result.score).toBeGreaterThan(0)
    expect(result.strengths).toBeDefined()
    expect(result.weaknesses).toBeDefined()
  })
})
```

---

## 🔗 Dependencies

### Required
- React 19+
- TypeScript 5+
- Zod (runtime validation)
- @tanstack/store (state management)
- @tanstack/react-store (React integration)

### Optional
- OpenAI API (for LLM features)

---

## 📚 Documentation

- **Quick Reference:** [`SKILL_AGENT_QUICK_REFERENCE.md`](../SKILL_AGENT_QUICK_REFERENCE.md)
- **Full Guide:** [`SKILL_AGENT_GUIDE.md`](../SKILL_AGENT_GUIDE.md)
- **Architecture:** [`SKILL_AGENT_ARCHITECTURE.md`](../SKILL_AGENT_ARCHITECTURE.md)
- **Implementation:** [`SKILL_AGENT_IMPLEMENTATION_COMPLETE.md`](../SKILL_AGENT_IMPLEMENTATION_COMPLETE.md)

---

## 💡 Examples

See [`examples/usage-examples.tsx`](./examples/usage-examples.tsx) for:
- Basic CV analysis
- Summary generation
- ATS optimization
- Experience improvement
- Complete workflows
- Memory management
- Context usage
- Debug panel

---

## 🎨 Best Practices

1. **Always validate input**
   ```typescript
   import { cvSchema } from './schemas/cv.schema'
   cvSchema.parse(cvData) // Throws if invalid
   ```

2. **Use debug mode in development**
   ```typescript
   useSkillAgent({ debugMode: true })
   ```

3. **Handle errors gracefully**
   ```typescript
   try {
     await analyzeCV(cv)
   } catch (error) {
     setError(error instanceof Error ? error.message : 'Failed')
   }
   ```

4. **Save CV versions**
   ```typescript
   cvMemory.saveVersion(cv, ['Updated experience'])
   ```

5. **Log important actions**
   ```typescript
   agentLogger.info('User analyzed CV', { cvId: '123' })
   ```

---

## 🚦 Status

**Status:** ✅ Production Ready

**Version:** 1.0.0

**Last Updated:** March 20, 2025

---

## 🤝 Contributing

### Adding New Tools

1. Extend `BaseTool` class
2. Implement `metadata` and `execute`
3. Register in tool registry
4. Add tests

```typescript
export class MyNewTool extends BaseTool<MyParams, MyResult> {
  readonly metadata = {
    name: 'myNewTool',
    description: 'Does something useful',
    category: 'optimization',
    requiresLLM: false,
  }

  execute(params: MyParams): Promise<MyResult> {
    // Implementation
  }
}
```

---

## 📞 Support

### Common Issues

**Q: Import errors?**
A: Use clean exports from `@/agent/index.ts`

**Q: Type errors?**
A: Ensure Zod schemas match your usage

**Q: LLM errors?**
A: Check API key configuration and network

### Getting Help

1. Check documentation files
2. Review example code
3. Enable debug mode
4. Check logs with `debugManager`

---

## 🎯 Roadmap

### Phase 1 (Current) ✅
- Core MCP tools
- Memory system
- Context management
- React integration
- LLM integration
- Logging system

### Phase 2 (Planned)
- PDF export
- A/B testing
- Collaboration features
- Industry templates
- Advanced analytics

---

## 🏆 Success Metrics

- ✅ All 6 core tools implemented
- ✅ Full TypeScript coverage
- ✅ Runtime validation
- ✅ Comprehensive examples
- ✅ Production ready
- ✅ Well documented

---

**Built with:** React 19, TypeScript 5, Zod, TanStack Store

**Architecture:** MCP (Model Context Protocol)

**License:** MIT
