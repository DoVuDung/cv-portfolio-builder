import type { ToolMetadata } from '../schemas/agent.schema'

/**
 * Base Tool Interface - All MCP tools must implement this
 */
export interface ITool<TParams = unknown, TResult = unknown> {
  readonly metadata: ToolMetadata
  execute(params: TParams): Promise<TResult>
  validate?(params: TParams): boolean
}

/**
 * Abstract base class for MCP tools
 */
export abstract class BaseTool<TParams = unknown, TResult = unknown> implements ITool<TParams, TResult> {
  abstract readonly metadata: ToolMetadata
  abstract execute(params: TParams): Promise<TResult>

  /**
   * Default validation - always returns true
   * Override in subclasses for custom validation
   */
  validate(_params: TParams): boolean {
    return true
  }

  /**
   * Execute with error handling and logging
   */
  async executeSafe(params: TParams): Promise<ToolResult<TResult>> {
    try {
      if (this.validate && !this.validate(params)) {
        throw new Error('Validation failed')
      }

      const result = await this.execute(params)
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        success: false,
        error: errorMessage,
      }
    }
  }
}

/**
 * Tool execution result type
 */
export interface ToolResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  warnings?: Array<string>
  metadata?: Record<string, unknown>
}

/**
 * Tool call log entry
 */
export interface ToolCallLog {
  toolName: string
  params: unknown
  result: unknown
  duration: number
  timestamp: Date
}
