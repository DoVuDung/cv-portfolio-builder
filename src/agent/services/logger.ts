/**
 * Agent Logger - Structured logging for agent operations
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, unknown>
  metadata?: {
    tool?: string
    action?: string
    duration?: number
    sessionId?: string
  }
}

export interface LoggerOptions {
  minLevel?: LogLevel
  includeTimestamp?: boolean
  includeContext?: boolean
  outputToConsole?: boolean
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

export class AgentLogger {
  private minLevel: number
  private includeTimestamp: boolean
  private includeContext: boolean
  private outputToConsole: boolean
  private logs: Array<LogEntry> = []
  private listeners: Set<(entry: LogEntry) => void> = new Set()

  constructor(options: LoggerOptions = {}) {
    const {
      minLevel = 'debug',
      includeTimestamp = true,
      includeContext = true,
      outputToConsole = true,
    } = options

    this.minLevel = LOG_LEVELS[minLevel]
    this.includeTimestamp = includeTimestamp
    this.includeContext = includeContext
    this.outputToConsole = outputToConsole
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, unknown>, metadata?: LogEntry['metadata']): void {
    this.log('debug', message, context, metadata)
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>, metadata?: LogEntry['metadata']): void {
    this.log('info', message, context, metadata)
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>, metadata?: LogEntry['metadata']): void {
    this.log('warn', message, context, metadata)
  }

  /**
   * Log error message
   */
  error(message: string, context?: Record<string, unknown>, metadata?: LogEntry['metadata']): void {
    this.log('error', message, context, metadata)
  }

  /**
   * Log tool execution
   */
  logToolExecution(
    toolName: string,
    params: unknown,
    result: unknown,
    duration: number
  ): void {
    this.info(
      `Tool executed: ${toolName}`,
      { params, result },
      { tool: toolName, duration }
    )
  }

  /**
   * Log tool failure
   */
  logToolFailure(
    toolName: string,
    params: unknown,
    error: string,
    duration: number
  ): void {
    this.error(
      `Tool failed: ${toolName}`,
      { params, error },
      { tool: toolName, duration }
    )
  }

  /**
   * Subscribe to log entries
   */
  subscribe(callback: (entry: LogEntry) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  /**
   * Get recent logs
   */
  getRecentLogs(limit: number = 100): Array<LogEntry> {
    return this.logs.slice(-limit)
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logs = []
  }

  /**
   * Export logs as JSON
   */
  exportJSON(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  /**
   * Set minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = LOG_LEVELS[level]
  }

  /**
   * Enable console output
   */
  enableConsoleOutput(): void {
    this.outputToConsole = true
  }

  /**
   * Disable console output
   */
  disableConsoleOutput(): void {
    this.outputToConsole = false
  }

  /**
   * Private log method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    metadata?: LogEntry['metadata']
  ): void {
    // Check if level should be logged
    if (LOG_LEVELS[level] < this.minLevel) {
      return
    }

    // Create log entry
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      ...(this.includeContext && context ? { context } : {}),
      ...(metadata ? { metadata } : {}),
    }

    // Store log
    this.logs.push(entry)

    // Output to console
    if (this.outputToConsole) {
      this.outputToConsole(entry)
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(entry))
  }

  /**
   * Format console output
   */
  private outputToConsole(entry: LogEntry): void {
    const emoji = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    }[entry.level]

    const timestamp = this.includeTimestamp 
      ? `[${entry.timestamp.toISOString()}]`
      : ''

    const parts = [emoji, timestamp, `[${entry.level.toUpperCase()}]`, entry.message]

    switch (entry.level) {
      case 'debug':
      case 'info':
        console.log(...parts.filter(Boolean))
        if (entry.context) {
          console.debug(entry.context)
        }
        break
      case 'warn':
        console.warn(...parts.filter(Boolean))
        if (entry.context) {
          console.warn(entry.context)
        }
        break
      case 'error':
        console.error(...parts.filter(Boolean))
        if (entry.context) {
          console.error(entry.context)
        }
        break
    }
  }
}

/**
 * Debug Panel Component Data Provider
 */
export class DebugManager {
  private logger: AgentLogger
  private enabled: boolean = false
  private showToolCalls: boolean = true
  private showStateChanges: boolean = true
  private showNetworkRequests: boolean = false

  constructor(logger: AgentLogger) {
    this.logger = logger
  }

  /**
   * Enable debug mode
   */
  enable(): void {
    this.enabled = true
    this.logger.setMinLevel('debug')
    this.logger.info('Debug mode enabled')
  }

  /**
   * Disable debug mode
   */
  disable(): void {
    this.enabled = false
    this.logger.setMinLevel('warn')
    this.logger.info('Debug mode disabled')
  }

  /**
   * Toggle tool call visibility
   */
  toggleToolCalls(enabled: boolean): void {
    this.showToolCalls = enabled
  }

  /**
   * Toggle state change visibility
   */
  toggleStateChanges(enabled: boolean): void {
    this.showStateChanges = enabled
  }

  /**
   * Get debug status
   */
  getStatus(): {
    enabled: boolean
    showToolCalls: boolean
    showStateChanges: boolean
    logCount: number
  } {
    return {
      enabled: this.enabled,
      showToolCalls: this.showToolCalls,
      showStateChanges: this.showStateChanges,
      logCount: this.logger.getRecentLogs().length,
    }
  }

  /**
   * Get recent tool calls
   */
  getRecentToolCalls(limit: number = 20): Array<LogEntry> {
    return this.logger
      .getRecentLogs(100)
      .filter(log => log.metadata?.tool)
      .slice(-limit)
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalLogs: number
    toolCalls: number
    errors: number
    averageDuration?: number
  } {
    const logs = this.logger.getRecentLogs(1000)
    const toolCalls = logs.filter(log => log.metadata?.tool)
    const errors = logs.filter(log => log.level === 'error')
    
    const durations = toolCalls
      .map(log => log.metadata?.duration)
      .filter((d): d is number => d !== undefined)
    
    const avgDuration = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : undefined

    return {
      totalLogs: logs.length,
      toolCalls: toolCalls.length,
      errors: errors.length,
      averageDuration: avgDuration,
    }
  }
}

// Export singleton instances
export const agentLogger = new AgentLogger({
  minLevel: 'info',
  outputToConsole: true,
})

export const debugManager = new DebugManager(agentLogger)
