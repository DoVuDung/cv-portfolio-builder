import { cvStore, cvActions } from './cv-memory'
import type { AgentContext, ExperienceLevel } from '../schemas/agent.schema'

/**
 * Context Manager - Manages user profile context and job targeting
 */
export class ContextManager {
  private static instance: ContextManager

  static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager()
    }
    return ContextManager.instance
  }

  /**
   * Get current agent context
   */
  getContext(): AgentContext {
    return cvStore.state.context
  }

  /**
   * Update agent context
   */
  updateContext(context: Partial<AgentContext>): void {
    cvActions.updateContext(context)
  }

  /**
   * Set job target
   */
  setJobTarget(target: string): void {
    this.updateContext({ jobTarget: target })
  }

  /**
   * Set domain/industry
   */
  setDomain(domain: string): void {
    this.updateContext({ domain })
  }

  /**
   * Set experience level
   */
  setExperienceLevel(level: ExperienceLevel): void {
    this.updateContext({ experienceLevel: level })
  }

  /**
   * Add application goal
   */
  addApplicationGoal(goal: string): void {
    const currentGoals = this.getContext().applicationGoals
    if (!currentGoals.includes(goal)) {
      this.updateContext({ applicationGoals: [...currentGoals, goal] })
    }
  }

  /**
   * Remove application goal
   */
  removeApplicationGoal(goal: string): void {
    const currentGoals = this.getContext().applicationGoals
    this.updateContext({
      applicationGoals: currentGoals.filter((g) => g !== goal),
    })
  }

  /**
   * Clear all application goals
   */
  clearApplicationGoals(): void {
    this.updateContext({ applicationGoals: [] })
  }

  /**
   * Get personalized suggestions based on context
   */
  getContextualSuggestions(): string[] {
    const context = this.getContext()
    const suggestions: string[] = []

    // Suggest based on experience level
    if (context.experienceLevel === 'junior') {
      suggestions.push('Add more projects to showcase practical skills')
      suggestions.push('Highlight relevant coursework and certifications')
    } else if (context.experienceLevel === 'senior') {
      suggestions.push('Emphasize leadership and mentorship experience')
      suggestions.push('Include quantifiable impact metrics')
    }

    // Suggest based on job target
    if (context.jobTarget) {
      suggestions.push(`Tailor CV for ${context.jobTarget} roles`)
      suggestions.push('Highlight relevant technical skills')
    }

    // Suggest based on domain
    if (context.domain) {
      suggestions.push(`Showcase ${context.domain} domain expertise`)
    }

    return suggestions
  }

  /**
   * Check if context is complete
   */
  isContextComplete(): boolean {
    const context = this.getContext()
    return !!(context.jobTarget && context.domain && context.experienceLevel)
  }

  /**
   * Export context as JSON
   */
  exportContext(): string {
    return JSON.stringify(this.getContext(), null, 2)
  }

  /**
   * Import context from JSON
   */
  importContext(json: string): boolean {
    try {
      const context = JSON.parse(json)
      this.updateContext(context)
      return true
    } catch (error) {
      console.error('Failed to import context:', error)
      return false
    }
  }
}

// Export singleton instance
export const contextManager = ContextManager.getInstance()
