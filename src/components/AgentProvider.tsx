import React, { useEffect } from 'react'
import { ToolRegistry } from '../agent/core/agent'
import { sessionManager } from '../agent/core/session'

interface AgentProviderProps {
  children: React.ReactNode
}

/**
 * Agent Provider - Context provider for agent state
 */
export function AgentProvider({ children }: AgentProviderProps) {
  useEffect(() => {
    // Initialize tool registry globally for hooks to access
    const registry = ToolRegistry.getInstance()
    ;(window as any).__TOOL_REGISTRY = registry

    // Start session
    sessionManager.startSession()

    // Cleanup on unmount
    return () => {
      // Optionally save state before unmount
      console.log('AgentProvider unmounting')
    }
  }, [])

  return <>{children}</>
}
