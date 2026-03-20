/**
 * Skill Agent - Main Export File
 * 
 * Clean imports for using the Skill Agent system
 */

// Core
export { SkillAgent, AgentOrchestrator, ToolRegistry, createSkillAgent } from './core/agent'
export type { AgentTask, AgentResponse } from './core/agent'

// Schemas
export * from './schemas/cv.schema'
export * from './schemas/agent.schema'

// Tools
export { BaseTool } from './tools/base-tool'
export type { ITool, ToolResult, ToolCallLog } from './tools/base-tool'
export * from './tools/core-tools'

// Memory
export { 
  CVMemoryManager, 
  SessionMemoryManager, 
  PreferenceMemoryManager,
  cvMemory,
  sessionMemory,
  preferenceMemory,
} from './memory/cv-memory'

// Context
export { ContextManager, contextManager } from './context/context-manager'

// Services
export * from './services/llm'
export * from './services/logger'

// Hooks
export { 
  useSkillAgent, 
  useCVMemory, 
  useAgentContext,
} from './hooks/useSkillAgent'
