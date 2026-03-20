import { useState, useCallback, useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import type { CV } from '../schemas/cv.schema'
import type { AgentResponse, AgentTask } from '../core/agent'
import type { CVAnalysis, ImprovedExperience, SkillExtraction, ATSOptimization } from '../tools/core-tools'
import { cvMemory } from '../memory/cv-memory'
import { createSkillAgent } from '../core/agent'
import { createLLMService } from '../services/llm'

interface UseSkillAgentOptions {
  debugMode?: boolean
  llmProvider?: 'mock' | 'openai'
  apiKey?: string
}

interface UseSkillAgentReturn {
  // State
  isLoading: boolean
  error: string | null
  lastResult: unknown
  
  // Actions
  analyzeCV: (cv: CV) => Promise<CVAnalysis>
  optimizeCV: (cv: CV, jobDescription?: string) => Promise<ATSOptimization>
  generateSummary: (cv: CV, targetRole: string) => Promise<string>
  improveExperience: (experience: Parameters<ImprovedExperience>[0]) => Promise<ImprovedExperience>
  extractSkills: (cv: CV) => Promise<SkillExtraction>
  
  // Utilities
  reset: () => void
  clearError: () => void
}

/**
 * React Hook for Skill Agent
 * Provides easy-to-use interface for CV analysis and optimization
 */
export function useSkillAgent(options: UseSkillAgentOptions = {}): UseSkillAgentReturn {
  const {
    debugMode = false,
    llmProvider = 'mock',
    apiKey,
  } = options

  // State
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<unknown>(null)

  // Create agent instance
  const [agent] = useState(() => {
    const llmService = createLLMService(llmProvider, apiKey)
    return createSkillAgent({
      llmService,
      debugMode,
    })
  })

  // Enable debug mode if requested
  useEffect(() => {
    if (debugMode) {
      agent.enableDebugMode()
    } else {
      agent.disableDebugMode()
    }
  }, [agent, debugMode])

  // Helper to execute agent tasks
  const executeTask = useCallback(async <T,>(
    task: AgentTask,
    input: Record<string, unknown>
  ): Promise<T> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await agent.run(task, input)
      
      if (!response.success) {
        throw new Error(response.error)
      }

      setLastResult(response.result)
      return response.result as T
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [agent])

  // Action: Analyze CV
  const analyzeCV = useCallback(async (cv: CV): Promise<CVAnalysis> => {
    return executeTask<CVAnalysis>('analyze_cv', { cv })
  }, [executeTask])

  // Action: Optimize CV
  const optimizeCV = useCallback(async (
    cv: CV,
    jobDescription?: string
  ): Promise<ATSOptimization> => {
    return executeTask<ATSOptimization>('optimize_cv', { 
      cv, 
      jobDescription: jobDescription || '' 
    })
  }, [executeTask])

  // Action: Generate Summary
  const generateSummary = useCallback(async (
    cv: CV,
    targetRole: string
  ): Promise<string> => {
    return executeTask<string>('generate_summary', { cv, targetRole })
  }, [executeTask])

  // Action: Improve Experience
  const improveExperience = useCallback(async (
    experience: Parameters<ImprovedExperience>[0]
  ): Promise<ImprovedExperience> => {
    return executeTask<ImprovedExperience>('improve_experience', { experience })
  }, [executeTask])

  // Action: Extract Skills (direct tool call)
  const extractSkills = useCallback(async (cv: CV): Promise<SkillExtraction> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await agent.run('analyze_cv', { cv })
      
      if (!result.success) {
        throw new Error(result.error)
      }

      // In a real implementation, this would call the extractSkills tool
      // For now, we'll simulate it
      const skills: SkillExtraction = {
        all: cv.skills,
        categorized: {},
        duplicatesRemoved: 0,
        sources: {
          explicit: cv.skills.length,
          fromExperience: 0,
          fromProjects: 0,
        },
      }

      setLastResult(skills)
      return skills
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [agent])

  // Utility: Reset state
  const reset = useCallback(() => {
    setLastResult(null)
    setError(null)
  }, [])

  // Utility: Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    lastResult,
    analyzeCV,
    optimizeCV,
    generateSummary,
    improveExperience,
    extractSkills,
    reset,
    clearError,
  }
}

/**
 * Hook for accessing CV memory state
 */
export function useCVMemory() {
  const currentCV = useStore(cvMemory.hasCV, has => has ? cvMemory.getLatest() : null)
  const versionCount = useStore(cvMemory.versionCount, count => count)
  const lastUpdated = useStore(cvMemory.lastUpdated, date => date)

  const saveCV = useCallback((cv: CV, changes?: Array<string>) => {
    cvMemory.saveVersion(cv, changes)
  }, [])

  const getHistory = useCallback(() => {
    return cvMemory.getHistory()
  }, [])

  const restoreVersion = useCallback((versionNumber: number) => {
    return cvMemory.restoreToVersion(versionNumber)
  }, [])

  return {
    currentCV,
    hasCV: currentCV !== null,
    versionCount,
    lastUpdated,
    saveCV,
    getHistory,
    restoreVersion,
  }
}

/**
 * Hook for agent context
 */
export function useAgentContext() {
  const [context, setContextState] = useState(() => {
    const { contextManager } = require('../context/context-manager')
    return contextManager.getContext()
  })

  const updateContext = useCallback((updates: Partial<typeof context>) => {
    const { contextManager } = require('../context/context-manager')
    contextManager.update(updates)
    setContextState(contextManager.getContext())
  }, [])

  const suggestions = useCallback(() => {
    const { contextManager } = require('../context/context-manager')
    return contextManager.getContextualSuggestions()
  }, [])

  return {
    context,
    updateContext,
    suggestions,
  }
}
