import type { ToolMetadata } from '../schemas/agent.schema'

/**
 * Base Tool Interface - All tools must extend this
 */
export interface ITool<TParams = any, TResult = any> {
  metadata: ToolMetadata
  execute(params: TParams): Promise<TResult>
  validate?(params: TParams): boolean
}

/**
 * Abstract base class for tools
 */
export abstract class BaseTool<TParams = any, TResult = any> implements ITool<TParams, TResult> {
  abstract readonly metadata: ToolMetadata
  abstract execute(params: TParams): Promise<TResult>

  /**
   * Default validation - always returns true
   * Override in subclasses for custom validation
   */
  validate(params: TParams): boolean {
    return true
  }

  /**
   * Execute with error handling
   */
  async executeSafe(
    params: TParams
  ): Promise<{ success: boolean; result?: TResult; error?: string }> {
    try {
      if (this.validate && !this.validate(params)) {
        throw new Error('Validation failed')
      }

      const result = await this.execute(params)
      return { success: true, result }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { success: false, error: errorMessage }
    }
  }
}

/**
 * Tool execution result type
 */
export type ToolResult<T = any> = {
  success: boolean
  data?: T
  message?: string
  suggestions?: string[]
}
