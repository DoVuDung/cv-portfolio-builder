# Core Architecture

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [module-federation.config.js](file://module-federation.config.js)
- [src/main.tsx](file://src/main.tsx)
- [src/App.tsx](file://src/App.tsx)
- [src/agent/index.ts](file://src/agent/index.ts)
- [src/agent/core/agent.ts](file://src/agent/core/agent.ts)
- [src/agent/tools/base-tool.ts](file://src/agent/tools/base-tool.ts)
- [src/agent/memory/cv-memory.ts](file://src/agent/memory/cv-memory.ts)
- [src/agent/services/ai-service.ts](file://src/agent/services/ai-service.ts)
- [src/agent/core/session.ts](file://src/agent/core/session.ts)
- [src/components/AgentProvider.tsx](file://src/components/AgentProvider.tsx)
- [src/hooks/use-cv-agent.ts](file://src/hooks/use-cv-agent.ts)
- [src/templates/index.ts](file://src/templates/index.ts)
- [src/templates/core/TemplateRenderer.tsx](file://src/templates/core/TemplateRenderer.tsx)
- [src/templates/store/template.store.ts](file://src/templates/store/template.store.ts)
- [src/integrations/tanstack-query/root-provider.tsx](file://src/integrations/tanstack-query/root-provider.tsx)
- [src/integrations/tanstack-query/layout.tsx](file://src/integrations/tanstack-query/layout.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes the core system design of the CV Portfolio Builder, focusing on the integration of React 19, the TanStack ecosystem, and an AI agent system. The platform is organized as a modular application composed of:
- An AI agent subsystem with a tool registry and orchestrator
- A memory and session management layer
- A template engine for rendering CVs with themes and layouts
- UI components and providers leveraging TanStack Router, TanStack Store, and TanStack Query
- A micro-frontend boundary using Module Federation

The system emphasizes reactive state management, a tool-centric agent architecture inspired by MCP (Model Context Protocol) concepts, and clean separation of concerns across subsystems.

## Project Structure
The project follows a feature-based, layered organization:
- src/main.tsx sets up TanStack Router, integrates TanStack Query providers, and mounts the root application.
- src/agent contains the AI agent system, tools, memory, and services.
- src/templates contains the template engine, layouts, sections, themes, and stores.
- src/components provides UI components and higher-order providers.
- src/hooks exposes hooks for agent and session access.
- src/integrations/tanstack-query integrates TanStack Query providers and layout.
- module-federation.config.js defines Module Federation boundaries and shared dependencies.

```mermaid
graph TB
subgraph "Application Root"
MAIN["src/main.tsx"]
APP["src/App.tsx"]
end
subgraph "Routing & Providers"
ROUTER["TanStack Router"]
QUERY_PROVIDER["TanStack Query Provider"]
QUERY_LAYOUT["TanStack Query Layout"]
end
subgraph "Agent Subsystem"
AGENT_INDEX["src/agent/index.ts"]
AGENT_CORE["src/agent/core/agent.ts"]
AGENT_TOOLS["src/agent/tools/base-tool.ts"]
AGENT_MEMORY["src/agent/memory/cv-memory.ts"]
AGENT_AI["src/agent/services/ai-service.ts"]
AGENT_SESSION["src/agent/core/session.ts"]
AGENT_PROVIDER["src/components/AgentProvider.tsx"]
USE_AGENT_HOOKS["src/hooks/use-cv-agent.ts"]
end
subgraph "Template Engine"
TEMPLATES_INDEX["src/templates/index.ts"]
RENDERER["src/templates/core/TemplateRenderer.tsx"]
TEMPLATE_STORE["src/templates/store/template.store.ts"]
end
MAIN --> ROUTER
MAIN --> QUERY_PROVIDER
MAIN --> QUERY_LAYOUT
APP --> AGENT_PROVIDER
AGENT_PROVIDER --> AGENT_CORE
AGENT_CORE --> AGENT_TOOLS
AGENT_CORE --> AGENT_MEMORY
AGENT_CORE --> AGENT_AI
AGENT_PROVIDER --> USE_AGENT_HOOKS
APP --> RENDERER
RENDERER --> TEMPLATES_INDEX
TEMPLATES_INDEX --> TEMPLATE_STORE
```

**Diagram sources**
- [src/main.tsx:1-89](file://src/main.tsx#L1-L89)
- [src/App.tsx:1-8](file://src/App.tsx#L1-L8)
- [src/agent/index.ts:1-24](file://src/agent/index.ts#L1-L24)
- [src/agent/core/agent.ts:1-414](file://src/agent/core/agent.ts#L1-L414)
- [src/agent/tools/base-tool.ts:1-72](file://src/agent/tools/base-tool.ts#L1-L72)
- [src/agent/memory/cv-memory.ts:1-291](file://src/agent/memory/cv-memory.ts#L1-L291)
- [src/agent/services/ai-service.ts:1-174](file://src/agent/services/ai-service.ts#L1-L174)
- [src/agent/core/session.ts](file://src/agent/core/session.ts)
- [src/components/AgentProvider.tsx:1-30](file://src/components/AgentProvider.tsx#L1-L30)
- [src/hooks/use-cv-agent.ts:1-185](file://src/hooks/use-cv-agent.ts#L1-L185)
- [src/templates/index.ts:1-44](file://src/templates/index.ts#L1-L44)
- [src/templates/core/TemplateRenderer.tsx:1-74](file://src/templates/core/TemplateRenderer.tsx#L1-L74)
- [src/templates/store/template.store.ts:1-103](file://src/templates/store/template.store.ts#L1-L103)

**Section sources**
- [README.md:500-543](file://README.md#L500-L543)
- [package.json:15-44](file://package.json#L15-L44)
- [src/main.tsx:29-83](file://src/main.tsx#L29-L83)

## Core Components
- Agent subsystem: Provides a ToolRegistry, AgentOrchestrator, SkillAgent, and AI service abstraction. Tools implement a common interface and can be validated and executed safely. Memory managers track CV versions, session logs, and user preferences. A session manager tracks activity and statistics.
- Template engine: Renders CVs using layouts and themes, with a registry and stores for active templates and customization state.
- UI and providers: TanStack Router for routing, TanStack Store for reactive state, TanStack Query for data fetching, and Module Federation for micro-frontend boundaries.

**Section sources**
- [src/agent/core/agent.ts:11-168](file://src/agent/core/agent.ts#L11-L168)
- [src/agent/tools/base-tool.ts:6-49](file://src/agent/tools/base-tool.ts#L6-L49)
- [src/agent/memory/cv-memory.ts:20-149](file://src/agent/memory/cv-memory.ts#L20-L149)
- [src/agent/services/ai-service.ts:77-126](file://src/agent/services/ai-service.ts#L77-L126)
- [src/templates/core/TemplateRenderer.tsx:13-53](file://src/templates/core/TemplateRenderer.tsx#L13-L53)
- [src/templates/store/template.store.ts:19-98](file://src/templates/store/template.store.ts#L19-L98)

## Architecture Overview
The system architecture combines:
- Reactive state management via TanStack Store for agent memory and template customization
- Routing and navigation via TanStack Router
- Data fetching and caching via TanStack Query
- Micro-frontend boundaries via Module Federation
- An MCP-inspired tool architecture for the agent subsystem

```mermaid
graph TB
subgraph "UI Layer"
HOME["Home Component"]
DASHBOARD["Agent Dashboard"]
CHAT["Agent Chat"]
end
subgraph "Providers"
ROUTER["TanStack Router"]
QUERY["TanStack Query Provider"]
STORE["TanStack Store Provider"]
MF["Module Federation Exposes"]
end
subgraph "Agent Orchestration"
ORCH["AgentOrchestrator"]
REG["ToolRegistry"]
TOOL["BaseTool / Tool Implementations"]
AI["AIService"]
MEM["CVMemory / SessionMemory / Preferences"]
SESSION["Session Manager"]
end
subgraph "Template Rendering"
RENDER["TemplateRenderer"]
LAYOUTS["SingleColumn / TwoColumn Layouts"]
THEME["Theme Converter"]
TSTORE["Template Store"]
end
HOME --> ROUTER
DASHBOARD --> ORCH
CHAT --> ORCH
ROUTER --> QUERY
ROUTER --> STORE
MF --> ORCH
ORCH --> REG
ORCH --> TOOL
ORCH --> AI
ORCH --> MEM
ORCH --> SESSION
RENDER --> LAYOUTS
RENDER --> THEME
RENDER --> TSTORE
```

**Diagram sources**
- [src/main.tsx:29-83](file://src/main.tsx#L29-L83)
- [src/agent/core/agent.ts:60-168](file://src/agent/core/agent.ts#L60-L168)
- [src/agent/tools/base-tool.ts:15-49](file://src/agent/tools/base-tool.ts#L15-L49)
- [src/agent/services/ai-service.ts:77-126](file://src/agent/services/ai-service.ts#L77-L126)
- [src/agent/memory/cv-memory.ts:20-149](file://src/agent/memory/cv-memory.ts#L20-L149)
- [src/agent/core/session.ts](file://src/agent/core/session.ts)
- [src/templates/core/TemplateRenderer.tsx:13-53](file://src/templates/core/TemplateRenderer.tsx#L13-L53)
- [src/templates/store/template.store.ts:19-98](file://src/templates/store/template.store.ts#L19-L98)
- [module-federation.config.js:13-31](file://module-federation.config.js#L13-L31)

## Detailed Component Analysis

### Agent System: Tool Registry and Orchestrator
The agent system centers on a ToolRegistry and AgentOrchestrator pattern. Tools implement a common interface with optional validation and safe execution wrappers. The orchestrator executes tools, logs sessions, and coordinates agent tasks.

```mermaid
classDiagram
class ToolRegistry {
-Map~string, ITool~ tools
+register(tool) void
+registerMany(tools) void
+get(name) ITool
+getAll() ITool[]
+has(name) boolean
+listTools() string[]
}
class AgentOrchestrator {
-ToolRegistry toolRegistry
-LLMProvider llmService
-boolean debugMode
+executeTool(toolName, params) Promise
+executeToolChain(steps) Promise
+setLLMService(service) void
+setDebugMode(enabled) void
}
class SkillAgent {
-AgentOrchestrator orchestrator
-Context context
+run(task, input) Promise
+getContext() AgentContext
+updateContext(context) void
+enableDebugMode() void
+disableDebugMode() void
}
class ITool {
<<interface>>
+metadata ToolMetadata
+execute(params) Promise
+validate(params) boolean
}
class BaseTool {
+metadata ToolMetadata
+execute(params) Promise
+validate(params) boolean
+executeSafe(params) Promise
}
ToolRegistry --> ITool : "manages"
AgentOrchestrator --> ToolRegistry : "uses"
AgentOrchestrator --> ITool : "executes"
SkillAgent --> AgentOrchestrator : "coordinates"
BaseTool ..|> ITool
```

**Diagram sources**
- [src/agent/core/agent.ts:11-168](file://src/agent/core/agent.ts#L11-L168)
- [src/agent/tools/base-tool.ts:6-49](file://src/agent/tools/base-tool.ts#L6-L49)

**Section sources**
- [src/agent/core/agent.ts:60-376](file://src/agent/core/agent.ts#L60-L376)
- [src/agent/tools/base-tool.ts:15-49](file://src/agent/tools/base-tool.ts#L15-L49)

### Memory and Session Management
Memory and session management are implemented with TanStack Store-derived state for reactive updates. CVMemory tracks versions and history, SessionMemory logs tool executions, and PreferenceMemory stores user preferences.

```mermaid
flowchart TD
Start(["Initialize Memory Managers"]) --> CVInit["CVMemoryManager<br/>Store + Derived States"]
Start --> SessionInit["SessionMemoryManager<br/>Store + Logs"]
Start --> PrefInit["PreferenceMemoryManager<br/>Store + Defaults"]
CVInit --> HasCV["Derived: hasCV"]
CVInit --> VersionCount["Derived: versionCount"]
CVInit --> LastUpdated["Derived: lastUpdated"]
HasCV --> UI["UI Subscriptions"]
VersionCount --> UI
LastUpdated --> UI
SessionInit --> ActionLog["Action Log Entries"]
ActionLog --> Stats["Session Stats"]
Stats --> UI
PrefInit --> Preferences["User Preferences"]
Preferences --> UI
```

**Diagram sources**
- [src/agent/memory/cv-memory.ts:20-149](file://src/agent/memory/cv-memory.ts#L20-L149)
- [src/agent/memory/cv-memory.ts:165-228](file://src/agent/memory/cv-memory.ts#L165-L228)
- [src/agent/memory/cv-memory.ts:251-285](file://src/agent/memory/cv-memory.ts#L251-L285)

**Section sources**
- [src/agent/memory/cv-memory.ts:20-291](file://src/agent/memory/cv-memory.ts#L20-L291)

### Template Engine: Rendering and Stores
The template engine renders CVs using layouts and themes, converting theme configurations into CSS variables. Template state is managed reactively with TanStack Store and derived states.

```mermaid
sequenceDiagram
participant UI as "UI Component"
participant Renderer as "TemplateRenderer"
participant Layout as "Layout Component"
participant Theme as "Theme Converter"
participant Store as "Template Store"
UI->>Renderer : props { template, cvData, theme }
Renderer->>Theme : convertThemeToCSS(theme)
Renderer->>Layout : render(layout, sections, cvData, cssVars)
Layout-->>UI : rendered sections
UI->>Store : update active template / section order
Store-->>UI : reactive updates
```

**Diagram sources**
- [src/templates/core/TemplateRenderer.tsx:13-53](file://src/templates/core/TemplateRenderer.tsx#L13-L53)
- [src/templates/store/template.store.ts:19-98](file://src/templates/store/template.store.ts#L19-L98)

**Section sources**
- [src/templates/core/TemplateRenderer.tsx:13-74](file://src/templates/core/TemplateRenderer.tsx#L13-L74)
- [src/templates/store/template.store.ts:19-103](file://src/templates/store/template.store.ts#L19-L103)

### Micro-Frontend Architecture with Module Federation
Module Federation exposes components from the host application, enabling integration with remote consumers while sharing React and React DOM as singletons.

```mermaid
graph TB
HOST["Host App<br/>module-federation.config.js"]
REMOTE["Remote Consumer"]
EXPOSE["Exposes:<br/>./DemoMfComponent<br/>./DemoMfSelfContained"]
SHARED["Shared:<br/>react<br/>react-dom"]
HOST --> EXPOSE
HOST --> SHARED
REMOTE --> |"loads remoteEntry"| HOST
```

**Diagram sources**
- [module-federation.config.js:13-31](file://module-federation.config.js#L13-L31)

**Section sources**
- [module-federation.config.js:1-32](file://module-federation.config.js#L1-L32)

### Reactive State Management Patterns
Reactive state is implemented using TanStack Store with derived states for computed values. Hooks integrate with the agent and session managers to expose reactive data and actions to UI components.

```mermaid
sequenceDiagram
participant Hook as "useCVAgent"
participant Store as "TanStack Store"
participant Agent as "AgentOrchestrator"
participant Memory as "CVMemory / SessionMemory"
Hook->>Store : subscribe to cvStore
Hook->>Agent : executeTool(toolName, params)
Agent->>Memory : logTool / saveVersion
Agent-->>Hook : ToolResult
Hook->>Store : update derived states
Store-->>Hook : reactive updates
```

**Diagram sources**
- [src/hooks/use-cv-agent.ts:13-104](file://src/hooks/use-cv-agent.ts#L13-L104)
- [src/agent/core/agent.ts:78-127](file://src/agent/core/agent.ts#L78-L127)
- [src/agent/memory/cv-memory.ts:56-73](file://src/agent/memory/cv-memory.ts#L56-L73)

**Section sources**
- [src/hooks/use-cv-agent.ts:13-185](file://src/hooks/use-cv-agent.ts#L13-L185)
- [src/agent/memory/cv-memory.ts:20-149](file://src/agent/memory/cv-memory.ts#L20-L149)

## Dependency Analysis
The application depends on React 19, TanStack Router, TanStack Store, TanStack Query, and Module Federation. Dependencies are declared in package.json and integrated in main.tsx.

```mermaid
graph TB
PKG["package.json"]
REACT["react / react-dom"]
ROUTER["@tanstack/react-router"]
STORE["@tanstack/store + @tanstack/react-store"]
QUERY["@tanstack/react-query + @tanstack/react-router-devtools"]
MF["@module-federation/vite"]
MAIN["src/main.tsx"]
PKG --> REACT
PKG --> ROUTER
PKG --> STORE
PKG --> QUERY
PKG --> MF
MAIN --> ROUTER
MAIN --> QUERY
```

**Diagram sources**
- [package.json:15-44](file://package.json#L15-L44)
- [src/main.tsx:3-10](file://src/main.tsx#L3-L10)

**Section sources**
- [package.json:15-44](file://package.json#L15-L44)
- [src/main.tsx:3-10](file://src/main.tsx#L3-L10)

## Performance Considerations
- Use TanStack Store’s derived states judiciously to avoid unnecessary recomputation.
- Memoize expensive computations in the template renderer and tool execution paths.
- Prefer incremental updates to stores and minimize global subscriptions.
- Leverage TanStack Query’s caching and background refetching for data-heavy features.
- Keep Module Federation boundaries cohesive to reduce bundle fragmentation.

## Troubleshooting Guide
Common areas to inspect:
- Agent tool execution failures: Check ToolRegistry availability and ToolResult outcomes.
- Memory state inconsistencies: Verify CVMemory versioning and SessionMemory logs.
- Template rendering issues: Confirm theme conversion and layout selection logic.
- Provider initialization: Ensure TanStack Query provider wraps RouterProvider and AgentProvider initializes ToolRegistry and session.

**Section sources**
- [src/agent/core/agent.ts:82-127](file://src/agent/core/agent.ts#L82-L127)
- [src/agent/memory/cv-memory.ts:181-201](file://src/agent/memory/cv-memory.ts#L181-L201)
- [src/templates/core/TemplateRenderer.tsx:58-73](file://src/templates/core/TemplateRenderer.tsx#L58-L73)
- [src/components/AgentProvider.tsx:12-26](file://src/components/AgentProvider.tsx#L12-L26)

## Conclusion
The CV Portfolio Builder employs a clean, modular architecture that blends React 19 with the TanStack ecosystem and an MCP-inspired agent system. Reactive state, a robust tool registry, and a flexible template engine enable rapid iteration and extensibility. Module Federation provides a foundation for micro-frontend integration, while TanStack Router and Query deliver a modern UX and data layer.

## Appendices
- Integration points:
  - Agent orchestrator integrates with ToolRegistry, memory managers, and AI service.
  - Template renderer consumes theme and layout configurations from stores.
  - UI hooks bridge reactive state to components for agent and session access.

**Section sources**
- [src/agent/core/agent.ts:402-413](file://src/agent/core/agent.ts#L402-L413)
- [src/templates/index.ts:15-44](file://src/templates/index.ts#L15-L44)
- [src/hooks/use-cv-agent.ts:128-152](file://src/hooks/use-cv-agent.ts#L128-L152)