import { cvStore } from '../memory/cv-memory'
import { contextManager } from '../memory/context-manager'
import { aiService } from '../services/ai-service'
import type { ToolMetadata, AgentAction, AgentContext } from '../schemas/agent.schema'
import type { CV } from '../schemas/cv.schema'
import type { ToolResult } from '../tools/base-tool'

// Import all tools
import { profileTools } from '../tools/profile-tools'
import { experienceTools } from '../tools/experience-tools'
import { projectTools } from '../tools/project-tools'
import { skillsTools } from '../tools/skills-tools'
import { analysisTools } from '../tools/analysis-tools'

/**
 * Tool Registry - Central registry of all available tools
 */
export class ToolRegistry {
  private static instance: ToolRegistry
  private tools: Map<string, any> = new Map()

  private constructor() {
    // Register all tools
    this.registerTool('updateProfile', profileTools.updateProfile)
    this.registerTool('generateSummary', profileTools.generateSummary)
    this.registerTool('optimizeContact', profileTools.optimizeContact)
    
    this.registerTool('addExperience', experienceTools.addExperience)
    this.registerTool('enhanceAchievements', experienceTools.enhanceAchievements)
    this.registerTool('suggestTechStack', experienceTools.suggestTechStack)
    
    this.registerTool('addProject', projectTools.addProject)
    this.registerTool('generateHighlights', projectTools.generateHighlights)
    this.registerTool('linkToSkills', projectTools.linkToSkills)
    
    this.registerTool('addSkill', skillsTools.addSkill)
    this.registerTool('categorizeSkills', skillsTools.categorizeSkills)
    this.registerTool('identifyGaps', skillsTools.identifyGaps)
    
    this.registerTool('analyzeCV', analysisTools.analyzeCV)
    this.registerTool('keywordOptimization', analysisTools.keywordOptimization)
    this.registerTool('consistencyCheck', analysisTools.consistencyCheck)
  }

  static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry()
    }
    return ToolRegistry.instance
  }

  registerTool(name: string, tool: any): void {
    this.tools.set(name, tool)
  }

  getTool(name: string): any | null {
    return this.tools.get(name) || null
  }

  getAllTools(): Array<{ name: string; metadata: ToolMetadata }> {
    return Array.from(this.tools.entries()).map(([name, tool]) => ({
      name,
      metadata: tool.metadata,
    }))
  }

  getToolsByCategory(category: string): any[] {
    return Array.from(this.tools.values()).filter(
      tool => tool.metadata.category === category
    )
  }
}

/**
 * Agent Orchestrator - Main agent that coordinates tools and memory
 */
export class AgentOrchestrator {
  private toolRegistry: ToolRegistry
  private actionHistory: AgentAction[] = []
  private isProcessing: boolean = false

  constructor() {
    this.toolRegistry = ToolRegistry.getInstance()
  }

  /**
   * Execute a tool by name
   */
  async executeTool<TParams, TResult>(
    toolName: string,
    params: TParams
  ): Promise<ToolResult<TResult>> {
    const tool = this.toolRegistry.getTool(toolName)
    
    if (!tool) {
      return {
        success: false,
        message: `Tool "${toolName}" not found`,
      }
    }

    // Record action start
    const action: AgentAction = {
      type: 'analyze',
      tool: toolName,
      payload: params as any,
      status: 'executing',
    }

    try {
      this.isProcessing = true
      const result = await tool.execute(params)
      
      action.status = 'completed'
      this.actionHistory.push(action)
      
      return result
    } catch (error) {
      action.status = 'failed'
      this.actionHistory.push(action)
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Tool execution failed',
      }
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Get intelligent suggestions based on current CV state
   */
  async getSuggestions(): Promise<string[]> {
    const suggestions: string[] = []
    
    // Get context-based suggestions
    const contextSuggestions = contextManager.getContextualSuggestions()
    suggestions.push(...contextSuggestions)

    // Analyze CV for gaps
    const analysis = await this.executeTool<void, any>('analyzeCV', undefined as any)
    
    if (analysis.success && analysis.data) {
      if (analysis.data.weaknesses) {
        suggestions.push(...analysis.data.weaknesses)
      }
    }

    // Remove duplicates
    return [...new Set(suggestions)]
  }

  /**
   * Run automated analysis and provide recommendations
   */
  async runAutomatedAnalysis(): Promise<{
    score: number
    topRecommendations: string[]
    criticalIssues: string[]
  }> {
    const results = {
      score: 0,
      topRecommendations: [] as string[],
      criticalIssues: [] as string[],
    }

    // Run consistency check
    const consistencyResult = await this.executeTool<void, any>('consistencyCheck', undefined as any)
    if (consistencyResult.success && consistencyResult.data) {
      results.criticalIssues.push(...(consistencyResult.data.issues || []))
      results.topRecommendations.push(...(consistencyResult.data.suggestions || []))
    }

    // Run full CV analysis
    const analysisResult = await this.executeTool<void, any>('analyzeCV', undefined as any)
    if (analysisResult.success && analysisResult.data) {
      results.score = analysisResult.data.overallScore || 0
    }

    // Get skill gap analysis
    const context = contextManager.getContext()
    if (context.jobTarget) {
      const currentSkills = cvStore.state.cv.skills
      const gapsResult = await this.executeTool<any, any>('identifyGaps', {
        targetRole: context.jobTarget,
        currentSkills: currentSkills,
      })
      
      if (gapsResult.success && gapsResult.data) {
        results.topRecommendations.push(
          ...((gapsResult.data.suggestions || []) as string[])
        )
      }
    }

    return results
  }

  /**
   * Get action history
   */
  getActionHistory(): AgentAction[] {
    return [...this.actionHistory]
  }

  /**
   * Clear action history
   */
  clearActionHistory(): void {
    this.actionHistory = []
  }

  /**
   * Check if agent is currently processing
   */
  getIsProcessing(): boolean {
    return this.isProcessing
  }

  /**
   * Export agent state
   */
  exportState(): string {
    return JSON.stringify({
      cv: cvStore.state.cv,
      context: cvStore.state.context,
      actionHistory: this.actionHistory,
    }, null, 2)
  }

  /**
   * Import agent state
   */
  importState(stateJson: string): boolean {
    try {
      const state = JSON.parse(stateJson)
      // Would need to implement state loading in cvActions
      return true
    } catch (error) {
      console.error('Failed to import state:', error)
      return false
    }
  }
}

// Export singleton instance
export const agentOrchestrator = new AgentOrchestrator()
