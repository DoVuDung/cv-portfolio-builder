import { useState, useCallback, useMemo } from 'react'
import { useStore } from '@tanstack/react-store'
import { cvStore, cvCompletenessScore, categorizedSkills } from '../agent/memory/cv-memory'
import { contextManager } from '../agent/memory/context-manager'
import { agentOrchestrator } from '../agent/core/agent'
import { sessionManager } from '../agent/core/session'
import type { CV } from '../agent/schemas/cv.schema'
import type { ToolResult } from '../agent/tools/base-tool'

/**
 * Hook to access CV agent functionality
 */
export function useCVAgent() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  /**
   * Execute a tool with error handling and loading state
   */
  const executeTool = useCallback(
    async <TParams, TResult>(toolName: string, params?: TParams): Promise<ToolResult<TResult>> => {
      try {
        setIsProcessing(true)
        setLastError(null)

        const result = await agentOrchestrator.executeTool<TParams, TResult>(
          toolName,
          params as TParams
        )

        // Update session activity
        sessionManager.updateActivity({
          type: 'suggest',
          tool: toolName,
          payload: params as any,
          status: result.success ? 'completed' : 'failed',
        })

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        setLastError(errorMessage)
        throw error
      } finally {
        setIsProcessing(false)
      }
    },
    []
  )

  /**
   * Get intelligent suggestions
   */
  const getSuggestions = useCallback(async (): Promise<string[]> => {
    try {
      setIsProcessing(true)
      return await agentOrchestrator.getSuggestions()
    } catch (error) {
      console.error('Failed to get suggestions:', error)
      return []
    } finally {
      setIsProcessing(false)
    }
  }, [])

  /**
   * Run automated analysis
   */
  const runAnalysis = useCallback(async () => {
    try {
      setIsProcessing(true)
      return await agentOrchestrator.runAutomatedAnalysis()
    } catch (error) {
      console.error('Analysis failed:', error)
      return { score: 0, topRecommendations: [], criticalIssues: [] }
    } finally {
      setIsProcessing(false)
    }
  }, [])

  /**
   * Update context
   */
  const updateContext = useCallback((context: Partial<any>) => {
    contextManager.updateContext(context)
  }, [])

  /**
   * Export agent state
   */
  const exportState = useCallback(() => {
    return agentOrchestrator.exportState()
  }, [])

  return {
    executeTool,
    getSuggestions,
    runAnalysis,
    updateContext,
    exportState,
    isProcessing,
    lastError,
  }
}

/**
 * Hook to access reactive CV data
 */
export function useCVData() {
  const cv = useStore(cvStore, (state) => state.cv)
  const context = useStore(cvStore, (state) => state.context)
  const completeness = useStore(cvCompletenessScore)
  const skills = useStore(categorizedSkills)
  const lastModified = useStore(cvStore, (state) => state.lastModified)

  return {
    cv,
    context,
    completeness,
    skills,
    lastModified,
  }
}

/**
 * Hook to access available agent tools
 */
export function useAgentTools() {
  const [availableTools] = useState(() => {
    const registry = (window as any).__TOOL_REGISTRY
    return registry ? registry.getAllTools() : []
  })

  const toolsByCategory = useMemo(() => {
    const categories: Record<string, any[]> = {}

    availableTools.forEach((tool) => {
      const category = tool.metadata.category
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(tool)
    })

    return categories
  }, [availableTools])

  return {
    availableTools,
    toolsByCategory,
  }
}

/**
 * Hook to access session information
 */
export function useSession() {
  const [sessionStats, setSessionStats] = useState(() => sessionManager.getSessionStats())

  // Update stats periodically
  useState(() => {
    const interval = setInterval(() => {
      setSessionStats(sessionManager.getSessionStats())
    }, 60000) // Every minute

    return () => clearInterval(interval)
  })

  const clearSession = useCallback(() => {
    sessionManager.clearSession()
    setSessionStats(sessionManager.getSessionStats())
  }, [])

  const exportData = useCallback(() => {
    return sessionManager.exportSessionData()
  }, [])

  return {
    stats: sessionStats,
    clearSession,
    exportData,
    isActive: sessionManager.isSessionActive(),
  }
}
