// Re-export existing CV types from agent schemas
export type { CV, Profile, Experience, Project, Education, Contact } from '../agent/schemas/cv.schema'

// Extended CV type with template metadata
export interface CVWithMeta extends CV {
  lastUpdated?: Date
  version?: string
}
