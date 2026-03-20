import { z } from 'zod'

// Contact information schema
export const contactSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
})

// Profile schema
export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  contact: contactSchema,
})

// Experience schema
export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  achievements: z.array(z.string()).min(1, 'At least one achievement is required'),
  techStack: z.array(z.string()).default([]),
})

// Project schema
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  techStack: z.array(z.string()).default([]),
  highlights: z.array(z.string()).min(1, 'At least one highlight is required'),
})

// Education schema
export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
})

// Main CV schema
export const cvSchema = z.object({
  profile: profileSchema,
  skills: z.array(z.string()).default([]),
  experience: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  education: z.array(educationSchema).default([]),
  metadata: z.object({
    version: z.string().default('1.0.0'),
    lastUpdated: z.date().optional(),
    createdAt: z.date().optional(),
  }).optional(),
})

// Export types
export type Contact = z.infer<typeof contactSchema>
export type Profile = z.infer<typeof profileSchema>
export type Experience = z.infer<typeof experienceSchema>
export type Project = z.infer<typeof projectSchema>
export type Education = z.infer<typeof educationSchema>
export type CV = z.infer<typeof cvSchema>
export type CVMetadata = z.infer<typeof cvSchema>['metadata']

// CV Version history
export interface CVVersion {
  version: string
  timestamp: Date
  changes: Array<string>
  cv: CV
}
