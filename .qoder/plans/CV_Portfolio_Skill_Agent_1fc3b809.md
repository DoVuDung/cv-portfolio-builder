# CV Portfolio Builder - Skill Agent Implementation Plan

## Overview
Build an intelligent agent system using MCP (Model Context Protocol) principles to help users create, optimize, and manage their CV and portfolio data with AI-powered suggestions.

---

## Phase 1: Core Schema & Type Definitions

### 1.1 Create CV Data Schema (`/src/agent/schemas/cv.schema.ts`)
- Define Zod schemas for type-safe CV data validation
- Include: Profile, Experience, Project, Skills, Education
- Add validation rules for required fields and formats

### 1.2 Create Agent Configuration Schema (`/src/agent/schemas/agent.schema.ts`)
- Define context types (job target, domain, experience level)
- Define agent action types and tool interfaces

---

## Phase 2: Memory & State Management

### 2.1 Create Memory Store (`/src/agent/memory/cv-memory.ts`)
- Use TanStack Store for reactive state management
- Store current CV data, user preferences, and session context
- Implement derived states for computed values (e.g., skill frequency)

### 2.2 Create Context Manager (`/src/agent/memory/context-manager.ts`)
- Manage user profile context
- Track job targets and application goals
- Maintain domain/industry settings

---

## Phase 3: Tool System (MCP Tools)

### 3.1 Create Base Tool Interface (`/src/agent/tools/base-tool.ts`)
- Define Tool abstract class with execute method
- Add tool metadata (name, description, parameters)
- Implement error handling and validation

### 3.2 Implement Core Tools:

**a. Profile Tools (`/src/agent/tools/profile-tools.ts`)**
- `updateProfile`: Update personal information
- `generateSummary`: AI-powered professional summary generation
- `optimizeContact`: Suggest contact info improvements

**b. Experience Tools (`/src/agent/tools/experience-tools.ts`)**
- `addExperience`: Add work experience entry
- `enhanceAchievements`: Rewrite achievements with impact metrics
- `suggestTechStack`: Recommend technologies based on role

**c. Project Tools (`/src/agent/tools/project-tools.ts`)**
- `addProject`: Add portfolio project
- `generateHighlights`: Create compelling project highlights
- `linkToSkills`: Connect projects to relevant skills

**d. Skills Tools (`/src/agent/tools/skills-tools.ts`)**
- `addSkill`: Add new skill
- `categorizeSkills`: Group by category (frontend, backend, etc.)
- `identifyGaps`: Find missing skills for target roles

**e. Analysis Tools (`/src/agent/tools/analysis-tools.ts`)**
- `analyzeCV`: Comprehensive CV strength analysis
- `keywordOptimization`: ATS keyword suggestions
- `consistencyCheck`: Ensure CV/portfolio alignment

---

## Phase 4: AI Services Integration

### 4.1 Create AI Service Interface (`/src/agent/services/ai-service.ts`)
- Define interface for AI operations (can be swapped: OpenAI, Anthropic, local)
- Implement prompt templates for different tasks
- Add response parsing and validation

### 4.2 Create Prompt Templates (`/src/agent/services/prompts.ts`)
- Summary generation prompts
- Achievement enhancement prompts
- Skill gap analysis prompts
- Recruiter-style feedback prompts

---

## Phase 5: Agent Core

### 5.1 Create Agent Orchestrator (`/src/agent/core/agent.ts`)
- Main agent class that coordinates tools and memory
- Implement conversation flow management
- Add decision-making logic for tool selection

### 5.2 Create Session Manager (`/src/agent/core/session.ts`)
- Manage user sessions
- Track interaction history
- Persist state between sessions

---

## Phase 6: React Integration

### 6.1 Create Custom Hooks (`/src/hooks/use-cv-agent.ts`)
- `useCVAgent`: Access agent instance
- `useCVData`: Reactive CV data access
- `useAgentTools`: Get available tools with handlers

### 6.2 Create Provider Component (`/src/components/AgentProvider.tsx`)
- Context provider for agent state
- Initialize agent on app mount
- Handle cleanup on unmount

---

## Phase 7: Demo UI Components

### 7.1 Create Agent Chat Interface (`/src/components/agent/AgentChat.tsx`)
- Chat-like interface for interacting with agent
- Display suggestions and accept/reject actions
- Show progress and status

### 7.2 Create Dashboard Widget (`/src/components/agent/CVDashboard.tsx`)
- CV strength score visualization
- Quick actions for common tasks
- Recent suggestions and changes

---

## File Structure

```
src/
├── agent/
│   ├── schemas/
│   │   ├── cv.schema.ts           # Zod schemas for CV data
│   │   └── agent.schema.ts        # Agent configuration types
│   ├── memory/
│   │   ├── cv-memory.ts           # TanStack Store for CV state
│   │   └── context-manager.ts     # User context management
│   ├── tools/
│   │   ├── base-tool.ts           # Abstract tool interface
│   │   ├── profile-tools.ts       # Profile management tools
│   │   ├── experience-tools.ts    # Experience editing tools
│   │   ├── project-tools.ts       # Project management tools
│   │   ├── skills-tools.ts        # Skills management tools
│   │   └── analysis-tools.ts      # CV analysis tools
│   ├── services/
│   │   ├── ai-service.ts          # AI integration layer
│   │   └── prompts.ts             # AI prompt templates
│   └── core/
│       ├── agent.ts               # Main agent orchestrator
│       └── session.ts             # Session management
├── hooks/
│   └── use-cv-agent.ts            # React hooks for agent
├── components/
│   └── agent/
│       ├── AgentProvider.tsx      # Context provider
│       ├── AgentChat.tsx          # Chat interface
│       └── CVDashboard.tsx        # Dashboard widget
```

---

## Key Design Decisions

1. **Zod for Validation**: Strong runtime validation matching TypeScript types
2. **TanStack Store**: Leverages existing project dependency for state
3. **Tool-Based Architecture**: MCP-inspired modular tool system
4. **Service Abstraction**: AI provider can be swapped without code changes
5. **React Integration**: Seamless integration with existing component structure
6. **Type Safety**: Full TypeScript coverage from schema to UI

---

## Implementation Notes

- Start with mock AI service for development/testing
- Add real AI integration as configurable service
- All tools must be idempotent and reversible
- Maintain undo/redo capability in memory store
- Log all agent actions for debugging and improvement

---

## Testing Strategy

- Unit tests for each tool (Vitest)
- Integration tests for agent workflows
- Snapshot tests for generated content
- End-to-end tests with UI components

---

This plan creates a production-ready, extensible agent system following MCP principles while leveraging your existing tech stack (React, TypeScript, Zod, TanStack).