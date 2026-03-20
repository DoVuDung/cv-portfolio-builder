import { Derived, Store } from '@tanstack/store'
import type { CV, CVVersion } from '../schemas/cv.schema'

/**
 * CV Memory - Manages CV versions and history
 */
interface CVMemoryState {
  currentCV: CV | null
  versions: Array<CVVersion>
  lastSaved: Date | null
}

const initialState: CVMemoryState = {
  currentCV: null,
  versions: [],
  lastSaved: null,
}

export class CVMemoryManager {
  private store: Store<CVMemoryState>
  
  // Derived states
  public hasCV: Derived<boolean>
  public versionCount: Derived<number>
  public lastUpdated: Derived<Date | null>

  constructor() {
    this.store = new Store<CVMemoryState>(initialState)
    
    // Setup derived states
    this.hasCV = new Derived({
      fn: () => this.store.state.currentCV !== null,
      deps: [this.store],
    })
    
    this.versionCount = new Derived({
      fn: () => this.store.state.versions.length,
      deps: [this.store],
    })
    
    this.lastUpdated = new Derived({
      fn: () => this.store.state.lastSaved,
      deps: [this.store],
    })
    
    // Mount derived states
    this.hasCV.mount()
    this.versionCount.mount()
    this.lastUpdated.mount()
  }

  /**
   * Save a CV version
   */
  saveVersion(cv: CV, changes?: Array<string>): void {
    const version = `v${this.store.state.versions.length + 1}.0`
    const timestamp = new Date()
    
    const cvVersion: CVVersion = {
      version,
      timestamp,
      changes: changes || ['Initial save'],
      cv,
    }
    
    this.store.setState(prev => ({
      ...prev,
      currentCV: cv,
      versions: [...prev.versions, cvVersion],
      lastSaved: timestamp,
    }))
  }

  /**
   * Get latest CV
   */
  getLatest(): CV | null {
    return this.store.state.currentCV
  }

  /**
   * Get CV history
   */
  getHistory(): Array<CVVersion> {
    return [...this.store.state.versions]
  }

  /**
   * Get specific version
   */
  getVersion(versionNumber: number): CVVersion | null {
    return this.store.state.versions[versionNumber - 1] || null
  }

  /**
   * Restore to specific version
   */
  restoreToVersion(versionNumber: number): boolean {
    const version = this.getVersion(versionNumber)
    if (!version) return false
    
    this.store.setState(prev => ({
      ...prev,
      currentCV: version.cv,
      lastSaved: new Date(),
    }))
    
    return true
  }

  /**
   * Clear all CV data
   */
  clear(): void {
    this.store.setState(initialState)
  }

  /**
   * Export CV as JSON
   */
  exportJSON(): string {
    const cv = this.getLatest()
    if (!cv) return '{}'
    return JSON.stringify(cv, null, 2)
  }

  /**
   * Import CV from JSON
   */
  importJSON(json: string): boolean {
    try {
      const cv = JSON.parse(json) as CV
      this.saveVersion(cv, ['Imported from JSON'])
      return true
    } catch {
      return false
    }
  }

  /**
   * Subscribe to changes
   */
  subscribe(callback: (cv: CV | null) => void): () => void {
    return this.store.subscribe(state => {
      callback(state.currentVal.currentCV)
    })
  }
}

/**
 * Session Memory - Manages agent session state
 */
interface SessionMemoryState {
  sessionId: string
  actionLog: Array<{
    tool: string
    params: unknown
    result: unknown
    timestamp: Date
  }>
  startTime: Date
}

export class SessionMemoryManager {
  private readonly store: Store<SessionMemoryState>
  
  constructor(sessionId?: string) {
    const id = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.store = new Store<SessionMemoryState>({
      sessionId: id,
      actionLog: [],
      startTime: new Date(),
    })
  }

  /**
   * Log tool execution
   */
  logTool(toolName: string, params: unknown, result: unknown): void {
    this.store.setState(prev => ({
      ...prev,
      actionLog: [
        ...prev.actionLog,
        {
          tool: toolName,
          params,
          result,
          timestamp: new Date(),
        },
      ],
    }))
  }

  /**
   * Get action history
   */
  getActionHistory(): Array<typeof this.store.state.actionLog[0]> {
    return [...this.store.state.actionLog]
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.store.state.sessionId
  }

  /**
   * Get session duration
   */
  getDuration(): number {
    const now = new Date()
    return now.getTime() - this.store.state.startTime.getTime()
  }

  /**
   * Clear session
   */
  clear(): void {
    this.store.setState({
      sessionId: this.store.state.sessionId,
      actionLog: [],
      startTime: new Date(),
    })
  }
}

/**
 * Preference Memory - Stores user preferences
 */
interface PreferenceMemoryState {
  tone: 'professional' | 'casual' | 'academic' | 'technical'
  emphasis: Array<'leadership' | 'technical' | 'impact' | 'collaboration'>
  formatting: {
    dateFormat: 'US' | 'EU'
    bulletStyle: 'dot' | 'dash' | 'number'
  }
}

const defaultPreferences: PreferenceMemoryState = {
  tone: 'professional',
  emphasis: [],
  formatting: {
    dateFormat: 'US',
    bulletStyle: 'dot',
  },
}

export class PreferenceMemoryManager {
  private readonly store: Store<PreferenceMemoryState>

  constructor() {
    this.store = new Store<PreferenceMemoryState>(defaultPreferences)
  }

  /**
   * Update preferences
   */
  update(preferences: Partial<PreferenceMemoryState>): void {
    this.store.setState(prev => ({
      ...prev,
      ...preferences,
      formatting: {
        ...prev.formatting,
        ...(preferences.formatting || {}),
      },
    }))
  }

  /**
   * Get preferences
   */
  get(): PreferenceMemoryState {
    return { ...this.store.state }
  }

  /**
   * Reset to defaults
   */
  reset(): void {
    this.store.setState(defaultPreferences)
  }
}

// Export singleton instances
export const cvMemory = new CVMemoryManager()
export const sessionMemory = new SessionMemoryManager()
export const preferenceMemory = new PreferenceMemoryManager()
