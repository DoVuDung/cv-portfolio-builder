# CV Portfolio Skill Agent - Technical Documentation

## Overview

A sophisticated MCP (Model Context Protocol) based intelligent agent system for creating, optimizing, and managing CV and portfolio data. Built with TypeScript, React, TanStack Store, and Zod validation.

---

## 🏗️ Architecture

The agent follows MCP principles with four core components:

### 1. **Tools** (Functions the Agent Can Call)
- 15 specialized tools organized into 5 categories
- Each tool is idempotent, validated, and provides detailed feedback
- Abstract base class ensures consistency

### 2. **Memory** (State Management)
- TanStack Store for reactive state management
- Derived states for computed values (completeness score, skill categorization)
- Automatic persistence to localStorage

### 3. **Context** (User Profile & Goals)
- Job targets and application goals
- Domain/industry settings
- Experience level configuration

### 4. **AI Services** (Content Generation)
- Pluggable AI provider abstraction
- Support for OpenAI, Anthropic, or local models
- Template-based prompt engineering

---

## 📁 File Structure

```
src/
├── agent/
│   ├── schemas/
│   │   ├── cv.schema.ts           # Zod schemas for CV data types
│   │   └── agent.schema.ts        # Agent configuration types
│   ├── memory/
│   │   ├── cv-memory.ts           # TanStack Store for CV state
│   │   └── context-manager.ts     # User context management
│   ├── tools/
│   │   ├── base-tool.ts           # Abstract tool interface
│   │   ├── profile-tools.ts       # Profile management (3 tools)
│   │   ├── experience-tools.ts    # Experience editing (3 tools)
│   │   ├── project-tools.ts       # Project management (3 tools)
│   │   ├── skills-tools.ts        # Skills management (3 tools)
│   │   └── analysis-tools.ts      # CV analysis (3 tools)
│   ├── services/
│   │   ├── ai-service.ts          # AI integration layer
│   │   └── prompts.ts             # Prompt templates
│   └── core/
│       ├── agent.ts               # Main orchestrator + tool registry
│       └── session.ts             # Session management
├── hooks/
│   ├── use-cv-agent.ts            # React hooks for agent access
│   └── ...
├── components/
│   ├── AgentProvider.tsx          # Context provider
│   └── agent/
│       ├── AgentChat.tsx          # Chat interface
│       └── CVDashboard.tsx        # Dashboard widget
└── routes/
    └── agent-demo.tsx             # Demo route
```

---

## 🔧 Core Components

### Schema Layer (`/agent/schemas/`)

**CV Schema** - Strongly typed CV structure:
```typescript
type CV = {
  profile: {
    name: string
    title: string
    summary: string
    location: string
    contact: Contact
  }
  skills: string[]
  experience: Experience[]
  projects: Project[]
  education: Education[]
}
```

**Agent Schema** - Configuration and context:
```typescript
type AgentContext = {
  jobTarget: string
  domain: string
  experienceLevel: 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
  applicationGoals: string[]
}
```

### Memory Layer (`/agent/memory/`)

**CV Store** - Reactive state with derived values:
- `cvStore`: Main store with CV data and context
- `cvCompletenessScore`: Computed completeness (0-100)
- `categorizedSkills`: Auto-categorized skills
- `cvActions`: Helper functions for updates

**Context Manager** - User-specific settings:
- Singleton pattern for global access
- Methods for updating job targets, domain, experience level
- Contextual suggestions based on user profile

### Tool System (`/agent/tools/`)

**Base Tool** - Abstract class ensuring consistency:
```typescript
abstract class BaseTool<TParams, TResult> {
  abstract metadata: ToolMetadata
  abstract execute(params: TParams): Promise<TResult>
  validate?(params: TParams): boolean
  executeSafe(params: TParams): Promise<{ success, result?, error? }>
}
```

**Tool Categories**:

1. **Profile Tools** (3 tools)
   - `updateProfile`: Update personal information
   - `generateSummary`: AI-powered summary generation
   - `optimizeContact`: Contact info optimization

2. **Experience Tools** (3 tools)
   - `addExperience`: Add work experience
   - `enhanceAchievements`: Improve achievement descriptions
   - `suggestTechStack`: Technology recommendations

3. **Project Tools** (3 tools)
   - `addProject`: Add portfolio project
   - `generateHighlights`: Create project highlights
   - `linkToSkills`: Connect projects to skills

4. **Skills Tools** (3 tools)
   - `addSkill`: Add new skill
   - `categorizeSkills`: Auto-categorize skills
   - `identifyGaps`: Find missing skills

5. **Analysis Tools** (3 tools)
   - `analyzeCV`: Comprehensive CV analysis
   - `keywordOptimization`: ATS keyword suggestions
   - `consistencyCheck`: CV/portfolio alignment

### AI Services (`/agent/services/`)

**AI Service Interface**:
```typescript
interface AIProvider {
  generateText(prompt: string): Promise<string>
  generateJSON(prompt: string): Promise<any>
}

class AIService {
  provider: AIProvider  // Pluggable
  generateSummary(params): Promise<string>
  enhanceAchievements(achievements): Promise<string[]>
  analyzeCV(cvData): Promise<CVAnalysis>
  identifySkillGaps(skills, role): Promise<SkillGapAnalysis>
}
```

**Prompt Templates** - Reusable templates for:
- Summary generation (professional, elevator pitch)
- Achievement enhancement (STAR method)
- Skill gap analysis
- CV analysis (comprehensive, ATS optimization)
- Project descriptions (highlights, case studies)

### Core Orchestrator (`/agent/core/`)

**Tool Registry**:
- Central registration for all tools
- Get tools by name or category
- Global access for hooks

**Agent Orchestrator**:
- Execute tools with error handling
- Automated analysis workflows
- Action history tracking
- State import/export

**Session Manager**:
- localStorage persistence
- Session statistics
- Activity tracking
- Automatic save/load

---

## ⚛️ React Integration

### Hooks (`/hooks/use-cv-agent.ts`)

**useCVAgent** - Access agent functionality:
```typescript
const {
  executeTool,      // Execute any tool by name
  getSuggestions,   // Get intelligent suggestions
  runAnalysis,      // Run automated analysis
  updateContext,    // Update agent context
  exportState,      // Export full state
  isProcessing,
  lastError,
} = useCVAgent()
```

**useCVData** - Reactive CV data access:
```typescript
const {
  cv,              // Current CV data
  context,         // Agent context
  completeness,    // Completeness score (0-100)
  skills,          // Categorized skills
  lastModified,    // Last modification timestamp
} = useCVData()
```

**useSession** - Session information:
```typescript
const {
  stats,          // Session duration, actions count
  clearSession,   // Reset session
  exportData,     // Export session data
  isActive,       // Session active flag
} = useSession()
```

### Provider Component

Wrap your app with `AgentProvider`:
```tsx
import { AgentProvider } from './components/AgentProvider'

function App() {
  return (
    <AgentProvider>
      <YourApp />
    </AgentProvider>
  )
}
```

---

## 🎨 UI Components

### AgentChat Component

Chat-like interface for natural language interaction:
- Intent recognition for common requests
- Quick action buttons
- Suggestion chips
- Real-time processing indicators

### CVDashboard Component

Visual dashboard with:
- Completeness score gauge
- Quick stats (experiences, projects, skills)
- Skills breakdown by category
- Quick action buttons
- Target profile display

---

## 🚀 Usage Examples

### Adding Experience
```typescript
const { executeTool } = useCVAgent()

const result = await executeTool('addExperience', {
  company: 'Tech Corp',
  role: 'Senior Developer',
  startDate: '2023-01',
  endDate: '',
  achievements: [
    'Led development of new platform',
    'Improved performance by 40%',
  ],
  techStack: ['React', 'Node.js', 'PostgreSQL'],
})

console.log(result.success)  // true
console.log(result.message)  // "Experience added successfully"
```

### Generating Summary
```typescript
const result = await executeTool('generateSummary', {
  role: 'Full Stack Developer',
  experience: 5,
  skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
})

console.log(result.data)  // Generated summary
```

### Analyzing CV
```typescript
const { runAnalysis } = useCVAgent()

const analysis = await runAnalysis()
console.log(analysis.score)              // 75
console.log(analysis.topRecommendations) // ["Add more metrics", ...]
console.log(analysis.criticalIssues)     // ["No projects", ...]
```

### Identifying Skill Gaps
```typescript
const result = await executeTool('identifyGaps', {
  targetRole: 'Senior Frontend Developer',
  currentSkills: ['React', 'JavaScript', 'CSS'],
})

console.log(result.data.gaps)           
// ['TypeScript', 'Next.js', 'Testing', ...]
```

---

## 🔑 Key Features

### ✅ Type Safety
- Full TypeScript coverage
- Zod runtime validation
- Type-safe tool parameters and results

### ✅ Reactive State
- TanStack Store for reactivity
- Derived states auto-update
- No manual subscription management

### ✅ Error Handling
- All tools have safe execution wrapper
- Detailed error messages
- Graceful degradation

### ✅ Persistence
- Automatic localStorage save
- Session recovery
- State export/import

### ✅ Extensibility
- Pluggable AI providers
- Easy to add new tools
- Configurable prompts
- Modular architecture

### ✅ Best Practices
- Idempotent operations
- Validation before execution
- Detailed logging
- Separation of concerns

---

## 🎯 Demo Route

Access the demo at `/agent-demo` which showcases:
- Interactive dashboard
- Chat interface
- All available tools
- Architecture documentation

---

## 🔮 Future Enhancements

1. **Real AI Integration**
   - OpenAI provider implementation
   - Anthropic Claude integration
   - Local LLM support

2. **Advanced Features**
   - Multi-language support
   - PDF export
   - ATS score simulation
   - Job description matching

3. **Collaboration**
   - Share CV for review
   - Collaborative editing
   - Feedback system

4. **Analytics**
   - CV view tracking
   - Application success rate
   - A/B testing for versions

---

## 📝 Testing Strategy

### Unit Tests
- Test each tool independently
- Validate schema enforcement
- Test edge cases and errors

### Integration Tests
- Test tool workflows
- Test state updates
- Test persistence

### E2E Tests
- Test complete user flows
- Test UI interactions
- Test session management

---

## 🛠️ Development

### Adding a New Tool

1. Create tool file in `/agent/tools/`:
```typescript
import { BaseTool } from './base-tool'

export class MyNewTool extends BaseTool<Params, Result> {
  readonly metadata = {
    name: 'myNewTool',
    description: 'What it does',
    parameters: [...],
    category: 'category' as const,
  }

  async execute(params: Params): Promise<Result> {
    // Implementation
  }
}
```

2. Register in `/agent/core/agent.ts`:
```typescript
this.registerTool('myNewTool', new MyNewTool())
```

3. Use in components:
```typescript
const result = await executeTool('myNewTool', params)
```

### Adding AI Provider

Implement `AIProvider` interface:
```typescript
class MyAIProvider implements AIProvider {
  readonly name = 'my-ai'
  
  async generateText(prompt: string): Promise<string> {
    // Call your AI API
  }
  
  async generateJSON(prompt: string): Promise<any> {
    // Call your AI API and parse JSON
  }
}

// Set provider
aiService.setProvider(new MyAIProvider())
```

---

## 📊 Performance Considerations

- **Lazy Loading**: Tools loaded on demand
- **Memoization**: Derived states cached
- **Debouncing**: Rapid updates batched
- **LocalStorage**: Minimal writes, strategic saves

---

## 🔒 Security

- No sensitive data in localStorage
- Input validation on all user inputs
- XSS prevention through React escaping
- CORS considerations for AI APIs

---

## 📄 License

MIT

---

## 👥 Contributing

1. Follow existing code structure
2. Add tests for new features
3. Update documentation
4. Ensure type safety

---

This system provides a production-ready foundation for intelligent CV and portfolio management with clean architecture, strong typing, and extensible design.
