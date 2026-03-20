# 🏗️ Skill Agent Architecture

## System Overview

```mermaid
graph TB
    User[User/React Component] --> Hooks[React Hooks]
    Hooks --> Agent[Skill Agent]
    Agent --> Orchestrator[Agent Orchestrator]
    Orchestrator --> Tools[MCP Tools]
    Tools --> Memory[Memory System]
    Tools --> Context[Context System]
    Tools --> LLM[LLM Service]
    Tools --> Logger[Logger Service]
```

---

## Detailed Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React Components]
        Hooks[useSkillAgent Hook]
        Preview[Live Preview]
    end
    
    subgraph "Agent Layer"
        Agent[Skill Agent]
        Orchestrator[Agent Orchestrator]
        Registry[Tool Registry]
    end
    
    subgraph "Tool Layer (MCP)"
        AnalyzeCV[analyzeCV Tool]
        GenerateSummary[generateSummary Tool]
        ImproveExp[improveExperience Tool]
        ExtractSkills[extractSkills Tool]
        OptimizeATS[optimizeATS Tool]
        MapToUI[mapToUISections Tool]
    end
    
    subgraph "Support Services"
        Memory[CV Memory]
        Context[Context Manager]
        LLM[LLM Provider]
        Logger[Agent Logger]
    end
    
    subgraph "Data Layer"
        CVStore[TanStack Store]
        SessionStore[Session Store]
        PrefStore[Preference Store]
    end
    
    UI --> Hooks
    Hooks --> Agent
    Agent --> Orchestrator
    Orchestrator --> Registry
    Registry --> AnalyzeCV
    Registry --> GenerateSummary
    Registry --> ImproveExp
    Registry --> ExtractSkills
    Registry --> OptimizeATS
    Registry --> MapToUI
    
    AnalyzeCV --> Memory
    GenerateSummary --> LLM
    ImproveExp --> LLM
    OptimizeATS --> LLM
    
    AllTools[All Tools] --> Context
    AllTools --> Logger
    
    Memory --> CVStore
    Memory --> SessionStore
    Memory --> PrefStore
```

---

## Data Flow

### 1. CV Analysis Flow

```mermaid
sequenceDiagram
    participant U as User
    participant H as Hook
    participant A as Agent
    participant O as Orchestrator
    participant T as AnalyzeCV Tool
    participant M as Memory
    
    U->>H: analyzeCV(cv)
    H->>A: run('analyze_cv', {cv})
    A->>O: executeTool('analyzeCV', {cv})
    O->>T: execute({cv})
    T->>T: Calculate score
    T->>T: Identify strengths
    T->>T: Identify weaknesses
    T->>M: saveVersion(cv, ['Analyzed'])
    T-->>O: CVAnalysis result
    O-->>A: Tool result
    A-->>H: AgentResponse
    H-->>U: Analysis data
```

### 2. ATS Optimization Flow

```mermaid
sequenceDiagram
    participant U as User
    participant H as Hook
    participant A as Agent
    participant O as Orchestrator
    participant T as OptimizeATS Tool
    participant L as LLM Service
    
    U->>H: optimizeCV(cv, jobDesc)
    H->>A: run('optimize_cv', {cv, jobDesc})
    A->>O: executeTool('optimizeATS', {cv, jobDesc})
    O->>T: execute({cv, jobDesc})
    T->>T: Extract CV keywords
    T->>L: Extract job keywords
    L-->>T: Job keywords
    T->>T: Compare & match
    T->>T: Generate recommendations
    T-->>O: ATSOptimization result
    O-->>A: Tool result
    A-->>H: AgentResponse
    H-->>U: Optimization data
```

---

## Component Interactions

### Memory System Architecture

```mermaid
graph LR
    subgraph "Memory Managers"
        CVM[CV Memory Manager]
        SM[Session Memory Manager]
        PM[Preference Memory Manager]
    end
    
    subgraph "TanStack Stores"
        CVS[CV Store]
        SS[Session Store]
        PS[Preference Store]
    end
    
    subgraph "Derived States"
        HasCV[hasCV]
        VersionCount[versionCount]
        LastUpdated[lastUpdated]
    end
    
    CVM --> CVS
    SM --> SS
    PM --> PS
    
    CVS --> HasCV
    CVS --> VersionCount
    CVS --> LastUpdated
```

---

## Tool Execution Pipeline

```mermaid
graph TD
    Start[Tool Call] --> Validate{Valid?}
    Validate -->|No| Error[Return Error]
    Validate -->|Yes| LogStart[Log Start]
    LogStart --> Execute[Execute Tool]
    Execute --> CheckLLM{Needs LLM?}
    CheckLLM -->|Yes| CallLLM[Call LLM Service]
    CallLLM --> Process[Process Result]
    CheckLLM -->|No| Process
    Process --> LogEnd[Log Completion]
    LogEnd --> SaveMem[Save to Memory]
    SaveMem --> Return[Return Result]
    
    Execute --> Fail{Failed?}
    Fail -->|Yes| LogError[Log Error]
    LogError --> Error
```

---

## State Management

### TanStack Store Structure

```mermaid
graph TB
    subgraph "CV Memory Store"
        CVState[currentCV]
        Versions[versions Array]
        LastSaved[lastSaved Date]
    end
    
    subgraph "Session Store"
        SessionId[sessionId String]
        ActionLog[actionLog Array]
        StartTime[startTime Date]
    end
    
    subgraph "Preference Store"
        Tone[tone Enum]
        Emphasis[emphasis Array]
        Formatting[formatting Object]
    end
    
    CVState --> Derived1[hasCV: boolean]
    Versions --> Derived2[versionCount: number]
    LastSaved --> Derived3[lastUpdated: Date | null]
```

---

## Context Flow

```mermaid
graph TB
    User[User Input] --> CM[Context Manager]
    CM --> Update[update Context]
    Update --> TS[TanStack Store]
    TS --> Derived1[isComplete]
    TS --> Derived2[targetRole]
    TS --> Derived3[seniority]
    
    Derived1 --> Suggestions[getContextualSuggestions]
    Derived2 --> Suggestions
    Derived3 --> Suggestions
    
    Suggestions --> UI[UI Display]
```

---

## LLM Service Abstraction

```mermaid
graph LR
    Agent[Agent] --> Factory[createLLMService]
    Factory --> Mock[Mock Service]
    Factory --> OpenAI[OpenAI Service]
    
    Mock --> Interface[LLMProvider Interface]
    OpenAI --> Interface
    
    Interface --> Generate[generate Method]
    Interface --> Chat[chat Method]
    
    Generate --> Templates[Prompt Templates]
    Chat --> Templates
```

---

## Error Handling Flow

```mermaid
graph TD
    Try[Tool Execution] --> Catch{Error?}
    Catch -->|Yes| CheckType{Error Type}
    CheckType --> Validation[Validation Error]
    CheckType --> LLMError[LLM Error]
    CheckType --> System[System Error]
    
    Validation --> Format[Format Message]
    LLMError --> Retry{Retry?}
    Retry -->|Yes| RetryExec[Retry Execution]
    Retry -->|No| Format
    System --> Format
    
    Format --> Log[Log Error]
    Log --> Return[Return Error Response]
    
    Catch -->|No| Success[Return Success]
```

---

## React Hook Architecture

```mermaid
graph TB
    subgraph "Custom Hooks"
        USK[useSkillAgent]
        UCM[useCVMemory]
        UAC[useAgentContext]
    end
    
    subgraph "Internal State"
        Loading[isLoading]
        Error[error]
        Result[lastResult]
    end
    
    subgraph "Actions"
        Analyze[analyzeCV]
        Optimize[optimizeCV]
        Generate[generateSummary]
        Improve[improveExperience]
    end
    
    USK --> Loading
    USK --> Error
    USK --> Result
    USK --> Analyze
    USK --> Optimize
    USK --> Generate
    USK --> Improve
    
    UCM --> CVMemory[cvMemory]
    UAC --> ContextMgr[contextManager]
```

---

## Debug System Architecture

```mermaid
graph TB
    Logger[Agent Logger] --> Levels[Log Levels]
    Levels --> Debug[debug]
    Levels --> Info[info]
    Levels --> Warn[warn]
    Levels --> Error[error]
    
    Logger --> Output[Output Methods]
    Output --> Console[Console]
    Output --> Listeners[Event Listeners]
    Output --> Storage[In-Memory Storage]
    
    DebugMgr[Debug Manager] --> Stats[Statistics]
    Stats --> TotalLogs[totalLogs]
    Stats --> ToolCalls[toolCalls]
    Stats --> Errors[errors]
    Stats --> AvgDuration[averageDuration]
    
    DebugMgr --> Controls[Controls]
    Controls --> Enable[enable/disable]
    Controls --> Filters[Filter logs]
    Controls --> Export[Export logs]
```

---

## Module Dependencies

```mermaid
graph LR
    subgraph "Core"
        Agent[agent.ts]
        Registry[registry]
    end
    
    subgraph "Tools"
        CoreTools[core-tools.ts]
        BaseTool[base-tool.ts]
    end
    
    subgraph "Schemas"
        CVSchema[cv.schema.ts]
        AgentSchema[agent.schema.ts]
    end
    
    subgraph "Services"
        LLM[llm.ts]
        Logger[logger.ts]
    end
    
    subgraph "State"
        Memory[cv-memory.ts]
        Context[context-manager.ts]
    end
    
    Agent --> CoreTools
    Agent --> Memory
    Agent --> Context
    Agent --> LLM
    Agent --> Logger
    
    CoreTools --> BaseTool
    CoreTools --> CVSchema
    CoreTools --> AgentSchema
    
    Memory --> TanStack[TanStack Store]
    Context --> TanStack
```

---

## Security Layers

```mermaid
graph TB
    Input[User Input] --> Validate[Zod Validation]
    Validate --> Sanitize[Data Sanitization]
    Sanitize --> Auth[API Key Check]
    Auth --> RateLimit[Rate Limiting]
    RateLimit --> Execute[Execute Operation]
    Execute --> Log[Audit Logging]
    
    Validate --> Reject[Reject Invalid]
    Auth --> Reject
    RateLimit --> Reject
```

---

## Performance Optimization

```mermaid
graph LR
    subgraph "Caching Layer"
        ToolCache[Tool Results]
        LLCache[LLM Responses]
        MemCache[Memory Snapshots]
    end
    
    subgraph "Optimization"
        Lazy[Lazy Loading]
        Batch[Batch Operations]
        Debounce[Input Debouncing]
    end
    
    subgraph "Reactive Updates"
        Derived[Derived States]
        Subscriptions[Event Subscriptions]
    end
    
    ToolCache --> Fast[Faster Responses]
    LLCache --> Fast
    MemCache --> Fast
    
    Lazy --> Efficient[Efficient Loading]
    Batch --> Efficient
    Debounce --> Efficient
    
    Derived --> Realtime[Real-time Updates]
    Subscriptions --> Realtime
```

---

**Architecture Documentation | v1.0.0 | March 2025**
