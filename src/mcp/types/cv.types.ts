// CV Data Types for MCP Integration

export interface Profile {
  name: string
  title: string
  summary: string
  location: string
  phone?: string
  email?: string
  portfolio?: string
  github?: string
  linkedin?: string
  education?: string
  languages?: string
}

export interface SkillCategory {
  category: string
  skills: Array<string>
}

export interface Experience {
  company: string
  role: string
  startDate: string
  endDate?: string
  achievements: Array<string>
}

export interface Project {
  name: string
  description: string
  highlights: Array<string>
}

export interface EducationEntry {
  institution: string
  degree: string
  gpa?: string
}

export interface CVData {
  profile: Profile
  skills: Array<SkillCategory>
  experience: Array<Experience>
  projects: Array<Project>
  education: Array<EducationEntry>
}

// Google Stitch UI Data Structure
export interface StitchContext {
  profile?: {
    fullName?: string
    title?: string
    summary?: string
    location?: string
  }
  header?: {
    name?: string
    title?: string
  }
  contact?: {
    phone?: string
    email?: string
    location?: string
    portfolio?: string
    github?: string
    linkedin?: string
  }
  links?: {
    portfolio?: string
    github?: string
    linkedin?: string
  }
  summary?: string
  skills?: Array<{
    name?: string
    category?: string
    skills?: Array<string>
    items?: Array<string>
  }>
  experience?: Array<{
    company?: string
    organization?: string
    role?: string
    position?: string
    startDate?: string
    start?: string
    endDate?: string
    end?: string
    achievements?: Array<string>
  }>
  projects?: Array<{
    name?: string
    title?: string
    description?: string
    highlights?: Array<string>
  }>
  education?: {
    summary?: string
    details?: Array<{
      institution?: string
      school?: string
      degree?: string
      field?: string
      gpa?: string
    }>
  }
  languages?: Array<string> | string
}
