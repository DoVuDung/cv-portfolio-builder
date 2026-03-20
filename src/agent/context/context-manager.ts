import { Store, Derived } from '@tanstack/store'
import type { AgentContext, SeniorityLevel, Tone, Emphasis } from '../schemas/agent.schema'

/**
 * Context Manager - Manages agent context and preferences
 */
export class ContextManager {
  private store: Store<AgentContext>
  
  // Derived states
  public isComplete: Derived<boolean>
  public targetRole: Derived<string | undefined>
  public seniority: Derived<SeniorityLevel | undefined>

  constructor() {
    const initialContext: AgentContext = {
      targetRole: undefined,
      seniority: undefined,
      domain: undefined,
      preferences: {
        tone: 'professional',
        emphasis: [],
      },
    }
    
    this.store = new Store<AgentContext>(initialContext)
    
    // Setup derived states
    this.isComplete = new Derived({
      fn: () => !!(
        this.store.state.targetRole &&
        this.store.state.seniority &&
        this.store.state.domain
      ),
      deps: [this.store],
    })
    
    this.targetRole = new Derived({
      fn: () => this.store.state.targetRole,
      deps: [this.store],
    })
    
    this.seniority = new Derived({
      fn: () => this.store.state.seniority,
      deps: [this.store],
    })
    
    // Mount derived states
    this.isComplete.mount()
    this.targetRole.mount()
    this.seniority.mount()
  }

  /**
   * Update context
   */
  update(context: Partial<AgentContext>): void {
    this.store.setState(prev => ({
      ...prev,
      ...context,
      preferences: {
        ...prev.preferences,
        ...(context.preferences || {}),
      },
    }))
  }

  /**
   * Set target role
   */
  setTargetRole(role: string): void {
    this.update({ targetRole: role })
  }

  /**
   * Set seniority level
   */
  setSeniority(level: SeniorityLevel): void {
    this.update({ seniority: level })
  }

  /**
   * Set domain/industry
   */
  setDomain(domain: string): void {
    this.update({ domain })
  }

  /**
   * Set tone preference
   */
  setTone(tone: Tone): void {
    this.update({
      preferences: {
        ...this.store.state.preferences,
        tone,
      },
    })
  }

  /**
   * Add emphasis area
   */
  addEmphasis(emphasis: Emphasis): void {
    const current = this.store.state.preferences?.emphasis || []
    if (!current.includes(emphasis)) {
      this.update({
        preferences: {
          ...this.store.state.preferences,
          emphasis: [...current, emphasis],
        },
      })
    }
  }

  /**
   * Remove emphasis area
   */
  removeEmphasis(emphasis: Emphasis): void {
    const current = this.store.state.preferences?.emphasis || []
    this.update({
      preferences: {
        ...this.store.state.preferences,
        emphasis: current.filter(e => e !== emphasis),
      },
    })
  }

  /**
   * Get current context
   */
  getContext(): AgentContext {
    return { ...this.store.state }
  }

  /**
   * Get tailored suggestions based on context
   */
  getContextualSuggestions(): Array<string> {
    const context = this.getContext()
    const suggestions: Array<string> = []

    // Suggestions based on seniority
    switch (context.seniority) {
      case 'junior':
        suggestions.push('Highlight relevant coursework and certifications')
        suggestions.push('Emphasize projects and internships')
        break
      case 'senior':
        suggestions.push('Showcase leadership and mentorship experience')
        suggestions.push('Include quantifiable business impact')
        break
      case 'lead':
      case 'principal':
        suggestions.push('Demonstrate strategic thinking and vision')
        suggestions.push('Highlight team building and organizational impact')
        break
    }

    // Suggestions based on target role
    if (context.targetRole) {
      suggestions.push(`Tailor CV specifically for ${context.targetRole} positions`)
      suggestions.push('Research common keywords for this role')
    }

    // Suggestions based on domain
    if (context.domain) {
      suggestions.push(`Highlight ${context.domain} domain expertise`)
      suggestions.push('Include relevant industry certifications')
    }

    // Suggestions based on tone
    if (context.preferences?.tone === 'technical') {
      suggestions.push('Use precise technical terminology')
      suggestions.push('Include detailed technology stacks')
    }

    return suggestions
  }

  /**
   * Check if context matches CV
   */
  validateWithCV(cv: unknown): Array<string> {
    const warnings: Array<string> = []
    
    // This would be implemented with actual CV validation
    // For now, just a placeholder
    
    return warnings
  }

  /**
   * Export context as JSON
   */
  exportJSON(): string {
    return JSON.stringify(this.getContext(), null, 2)
  }

  /**
   * Import context from JSON
   */
  importJSON(json: string): boolean {
    try {
      const context = JSON.parse(json) as AgentContext
      this.update(context)
      return true
    } catch {
      return false
    }
  }

  /**
   * Subscribe to context changes
   */
  subscribe(callback: (context: AgentContext) => void): () => void {
    return this.store.subscribe(state => {
      callback({ ...state })
    })
  }
}

// Export singleton instance
export const contextManager = new ContextManager()
