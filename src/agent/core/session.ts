import { cvStore, cvActions } from '../memory/cv-memory'
import type { SessionState, AgentAction } from '../schemas/agent.schema'

/**
 * Session Manager - Manages user sessions and persistence
 */
export class SessionManager {
  private static instance: SessionManager
  private sessionKey = 'cv-portfolio-session'
  private currentSession: SessionState | null = null

  private constructor() {
    this.loadSession()
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  /**
   * Get current session
   */
  getCurrentSession(): SessionState | null {
    return this.currentSession
  }

  /**
   * Start a new session
   */
  startSession(userId?: string): SessionState {
    const session: SessionState = {
      sessionId: this.generateSessionId(),
      userId,
      startTime: new Date(),
      lastActivity: new Date(),
      actionHistory: [],
      context: {
        jobTarget: '',
        domain: '',
        experienceLevel: 'mid',
        applicationGoals: [],
      },
    }

    this.currentSession = session
    this.saveSession()
    
    return session
  }

  /**
   * Update session activity
   */
  updateActivity(action?: AgentAction): void {
    if (!this.currentSession) {
      this.startSession()
      return
    }

    this.currentSession.lastActivity = new Date()
    
    if (action) {
      this.currentSession.actionHistory.push(action)
    }

    this.saveSession()
  }

  /**
   * Save session to localStorage
   */
  private saveSession(): void {
    try {
      if (this.currentSession) {
        localStorage.setItem(this.sessionKey, JSON.stringify({
          ...this.currentSession,
          startTime: this.currentSession.startTime.toISOString(),
          lastActivity: this.currentSession.lastActivity.toISOString(),
        }))
      }
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  /**
   * Load session from localStorage
   */
  private loadSession(): void {
    try {
      const saved = localStorage.getItem(this.sessionKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        this.currentSession = {
          ...parsed,
          startTime: new Date(parsed.startTime),
          lastActivity: new Date(parsed.lastActivity),
        }
      } else {
        this.startSession()
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      this.startSession()
    }
  }

  /**
   * Clear current session
   */
  clearSession(): void {
    try {
      localStorage.removeItem(this.sessionKey)
      this.currentSession = null
      this.startSession()
    } catch (error) {
      console.error('Failed to clear session:', error)
    }
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    duration: number
    actionsCount: number
    lastActive: Date
  } {
    if (!this.currentSession) {
      return {
        duration: 0,
        actionsCount: 0,
        lastActive: new Date(),
      }
    }

    const now = new Date()
    const duration = now.getTime() - this.currentSession.startTime.getTime()
    
    return {
      duration: Math.round(duration / 1000 / 60), // minutes
      actionsCount: this.currentSession.actionHistory.length,
      lastActive: this.currentSession.lastActivity,
    }
  }

  /**
   * Export session data
   */
  exportSessionData(): string {
    if (!this.currentSession) {
      return '{}'
    }

    return JSON.stringify({
      session: this.currentSession,
      cv: cvStore.state.cv,
      context: cvStore.state.context,
    }, null, 2)
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Check if session is active (within last 30 minutes)
   */
  isSessionActive(): boolean {
    if (!this.currentSession) {
      return false
    }

    const now = new Date()
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)
    
    return this.currentSession.lastActivity > thirtyMinutesAgo
  }

  /**
   * Resume session if it exists
   */
  resumeSession(): boolean {
    this.loadSession()
    return this.currentSession !== null
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance()
