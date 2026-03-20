import { z } from 'zod'

// Agent context schema
export const agentContextSchema = z.object({
  targetRole: z.string().optional(),
  seniority: z.enum(['junior', 'mid', 'senior', 'lead', 'principal']).optional(),
  domain: z.string().optional(),
  preferences: z.object({
    tone: z.enum(['professional', 'casual', 'academic', 'technical']).default('professional'),
    emphasis: z.array(z.enum(['leadership', 'technical', 'impact', 'collaboration'])).default([]),
  }).optional(),
})

// Tool parameter types
export const toolParameterSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  required: z.boolean().default(false),
})

// Tool metadata schema
export const toolMetadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.array(toolParameterSchema).default([]),
  category: z.enum(['analysis', 'generation', 'optimization', 'extraction', 'mapping']),
  requiresLLM: z.boolean().default(false),
})

// Agent action types
export const agentActionSchema = z.object({
  type: z.enum(['analyze', 'generate', 'optimize', 'extract', 'map']),
  tool: z.string(),
  payload: z.record(z.unknown()),
  status: z.enum(['pending', 'executing', 'completed', 'failed']).default('pending'),
  result: z.unknown().optional(),
  error: z.string().optional(),
  timestamp: z.date().default(() => new Date()),
})

// Session state schema
export const sessionStateSchema = z.object({
  sessionId: z.string(),
  userId: z.string().optional(),
  startTime: z.date(),
  lastActivity: z.date(),
  actionHistory: z.array(agentActionSchema).default([]),
  context: agentContextSchema,
  debugMode: z.boolean().default(false),
})

// Export types
export type AgentContext = z.infer<typeof agentContextSchema>
export type ToolParameter = z.infer<typeof toolParameterSchema>
export type ToolMetadata = z.infer<typeof toolMetadataSchema>
export type AgentAction = z.infer<typeof agentActionSchema>
export type SessionState = z.infer<typeof sessionStateSchema>
export type SeniorityLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
export type Tone = 'professional' | 'casual' | 'academic' | 'technical'
export type Emphasis = 'leadership' | 'technical' | 'impact' | 'collaboration'
