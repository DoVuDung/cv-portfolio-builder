import { z } from 'zod'

// Agent context types
export const agentContextSchema = z.object({
  jobTarget: z.string().optional(),
  domain: z.string().optional(),
  experienceLevel: z.enum(['junior', 'mid', 'senior', 'lead', 'principal']).optional(),
  applicationGoals: z.array(z.string()).default([]),
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
  category: z.enum(['profile', 'experience', 'project', 'skills', 'analysis']),
})

// Agent action types
export const agentActionSchema = z.object({
  type: z.enum(['suggest', 'create', 'update', 'delete', 'analyze']),
  tool: z.string(),
  payload: z.record(z.unknown()),
  status: z.enum(['pending', 'executing', 'completed', 'failed']).default('pending'),
})

// Session state schema
export const sessionStateSchema = z.object({
  sessionId: z.string(),
  userId: z.string().optional(),
  startTime: z.date(),
  lastActivity: z.date(),
  actionHistory: z.array(agentActionSchema).default([]),
  context: agentContextSchema,
})

// Export types
export type AgentContext = z.infer<typeof agentContextSchema>
export type ToolParameter = z.infer<typeof toolParameterSchema>
export type ToolMetadata = z.infer<typeof toolMetadataSchema>
export type AgentAction = z.infer<typeof agentActionSchema>
export type SessionState = z.infer<typeof sessionStateSchema>
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'principal'
