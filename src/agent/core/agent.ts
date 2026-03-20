import { cvMemory, sessionMemory } from '../memory/cv-memory'
import { contextManager } from '../context/context-manager'
import type { AgentAction, AgentContext } from '../schemas/agent.schema'
import type { CV } from '../schemas/cv.schema'
import type { ITool } from '../tools/base-tool'
import type { LLMProvider } from '../services/llm'

/**
 * Tool Registry - Manages available tools
 */
export class ToolRegistry {
  private readonly tools: Map<string, ITool> = new Map()

  /**
   * Register a tool
   */
  register(tool: ITool): void {
    this.tools.set(tool.metadata.name, tool)
  }

  /**
   * Register multiple tools
   */
  registerMany(tools: Array<ITool>): void {
    tools.forEach(tool => this.register(tool))
  }

  /**
   * Get tool by name
   */
  get(name: string): ITool | undefined {
    return this.tools.get(name)
  }

  /**
   * Get all tools
   */
  getAll(): Array<ITool> {
    return Array.from(this.tools.values())
  }

  /**
   * Check if tool exists
   */
  has(name: string): boolean {
    return this.tools.has(name)
  }

  /**
   * List all tool names
   */
  listTools(): Array<string> {
    return Array.from(this.tools.keys())
  }
}

/**
 * Agent Orchestrator - Coordinates tool execution and state management
 */
export class AgentOrchestrator {
  private readonly toolRegistry: ToolRegistry
  private llmService?: LLMProvider
  private debugMode: boolean

  constructor(options?: {
    toolRegistry?: ToolRegistry
    llmService?: LLMProvider
    debugMode?: boolean
  }) {
    this.toolRegistry = options?.toolRegistry || new ToolRegistry()
    this.llmService = options?.llmService
    this.debugMode = options?.debugMode ?? false
  }

  /**
   * Execute a single tool with logging
   */
  async executeTool<TParams, TResult>(
    toolName: string,
    params: TParams
  ): Promise<{ success: boolean; result?: TResult; error?: string }> {
    const tool = this.toolRegistry.get(toolName)
    
    if (!tool) {
      return {
        success: false,
        error: `Tool not found: ${toolName}`,
      }
    }

    const startTime = Date.now()
    
    try {
      // Log tool execution start
      if (this.debugMode) {
        console.log(`[Agent] Executing tool: ${toolName}`, params)
      }

      // Execute tool
      const result = await tool.execute(params as never)
      
      // Log completion
      const duration = Date.now() - startTime
      if (this.debugMode) {
        console.log(`[Agent] Tool completed: ${toolName} (${duration}ms)`)
      }

      // Log to session memory
      sessionMemory.logTool(toolName, params, result)

      return {
        success: true,
        result: result as TResult,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (this.debugMode) {
        console.error(`[Agent] Tool failed: ${toolName}`, error)
      }

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  /**
   * Execute multiple tools in sequence
   */
  async executeToolChain(
    steps: Array<{ tool: string; params: unknown }>
  ): Promise<Array<{ tool: string; result: unknown; error?: string }>> {
    const results: Array<{ tool: string; result: unknown; error?: string }> = []

    for (const step of steps) {
      const result = await this.executeTool(step.tool, step.params)
      
      results.push({
        tool: step.tool,
        result: result.result,
        error: result.error,
      })

      // Stop on first failure
      if (!result.success) {
        break
      }
    }

    return results
  }

  /**
   * Set LLM service
   */
  setLLMService(service: LLMProvider): void {
    this.llmService = service
  }

  /**
   * Enable/disable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled
  }
}

/**
 * Skill Agent - Main agent interface
 */
export class SkillAgent {
  private readonly orchestrator: AgentOrchestrator
  private readonly context: typeof contextManager

  constructor(options?: {
    orchestrator?: AgentOrchestrator
    context?: typeof contextManager
  }) {
    this.orchestrator = options?.orchestrator || new AgentOrchestrator()
    this.context = options?.context || contextManager
  }

  /**
   * Run agent task
   */
  async run(task: AgentTask, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now()
    
    try {
      let result: unknown
      let actions: Array<AgentAction> = []

      switch (task) {
        case 'analyze_cv':
          result = await this.analyzeCV(input.cv as CV)
          actions = [{
            type: 'analyze',
            tool: 'analyzeCV',
            payload: { cv: input.cv },
            status: 'completed',
            result,
            timestamp: new Date(),
          }]
          break

        case 'optimize_cv':
          result = await this.optimizeCV(input.cv as CV, input.jobDescription as string)
          actions = [
            {
              type: 'analyze',
              tool: 'analyzeCV',
              payload: { cv: input.cv },
              status: 'completed',
              timestamp: new Date(),
            },
            {
              type: 'optimize',
              tool: 'optimizeATS',
              payload: { cv: input.cv, jobDescription: input.jobDescription },
              status: 'completed',
              result,
              timestamp: new Date(),
            },
          ]
          break

        case 'generate_summary':
          result = await this.generateSummary(input.cv as CV, input.targetRole as string)
          actions = [{
            type: 'generate',
            tool: 'generateSummary',
            payload: { cv: input.cv, targetRole: input.targetRole },
            status: 'completed',
            result,
            timestamp: new Date(),
          }]
          break

        case 'improve_experience':
          result = await this.improveExperience(input.experience as any)
          actions = [{
            type: 'optimize',
            tool: 'improveExperience',
            payload: { experience: input.experience },
            status: 'completed',
            result,
            timestamp: new Date(),
          }]
          break

        default:
          throw new Error(`Unknown task: ${task}`)
      }

      const duration = Date.now() - startTime

      return {
        success: true,
        result,
        actions,
        metadata: {
          duration,
          taskId: `task_${Date.now()}`,
          context: this.context.getContext(),
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      return {
        success: false,
        error: errorMessage,
        metadata: {
          duration: Date.now() - startTime,
          taskId: `task_${Date.now()}`,
        },
      }
    }
  }

  /**
   * Analyze CV
   */
  private async analyzeCV(cv: CV): Promise<unknown> {
    const result = await this.orchestrator.executeTool('analyzeCV', { cv })
    
    if (!result.success) {
      throw new Error(result.error)
    }

    // Save CV to memory
    cvMemory.saveVersion(cv, ['Analyzed CV'])

    return result.result
  }

  /**
   * Optimize CV for ATS
   */
  private async optimizeCV(cv: CV, jobDescription?: string): Promise<unknown> {
    const result = await this.orchestrator.executeTool('optimizeATS', { 
      cv, 
      jobDescription 
    })
    
    if (!result.success) {
      throw new Error(result.error)
    }

    // Save optimized CV
    cvMemory.saveVersion(result.result as CV, ['Optimized for ATS'])

    return result.result
  }

  /**
   * Generate professional summary
   */
  private async generateSummary(cv: CV, targetRole: string): Promise<string> {
    const result = await this.orchestrator.executeTool('generateSummary', { 
      cv, 
      targetRole 
    })
    
    if (!result.success) {
      throw new Error(result.error)
    }

    return result.result as string
  }

  /**
   * Improve experience entry
   */
  private async improveExperience(experience: any): Promise<unknown> {
    const result = await this.orchestrator.executeTool('improveExperience', { 
      experience 
    })
    
    if (!result.success) {
      throw new Error(result.error)
    }

    return result.result
  }

  /**
   * Get current context
   */
  getContext(): AgentContext {
    return this.context.getContext()
  }

  /**
   * Update context
   */
  updateContext(context: Partial<AgentContext>): void {
    this.context.update(context)
  }

  /**
   * Enable debug mode
   */
  enableDebugMode(): void {
    this.orchestrator.setDebugMode(true)
  }

  /**
   * Disable debug mode
   */
  disableDebugMode(): void {
    this.orchestrator.setDebugMode(false)
  }
}

// Type exports
export type AgentTask = 
  | 'analyze_cv'
  | 'optimize_cv'
  | 'generate_summary'
  | 'improve_experience'

export interface AgentResponse {
  success: boolean
  result?: unknown
  error?: string
  actions?: Array<AgentAction>
  metadata: {
    duration: number
    taskId: string
    context?: AgentContext
  }
}

// Export factory function
export function createSkillAgent(options?: {
  llmService?: LLMProvider
  debugMode?: boolean
}): SkillAgent {
  const toolRegistry = new ToolRegistry()
  
  const orchestrator = new AgentOrchestrator({
    toolRegistry,
    llmService: options?.llmService,
    debugMode: options?.debugMode,
  })

  const agent = new SkillAgent({ orchestrator })

  return agent
}
