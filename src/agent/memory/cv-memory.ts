import { Derived, Store } from '@tanstack/store'
import type { CV, Experience, Project } from '../schemas/cv.schema'
import type { AgentContext } from '../schemas/agent.schema'

// Initial CV data
const initialCVData: CV = {
  profile: {
    name: '',
    title: '',
    summary: '',
    location: '',
    contact: {
      email: '',
      github: '',
      linkedin: '',
      portfolio: '',
    },
  },
  skills: [],
  experience: [],
  projects: [],
  education: [],
}

// Agent context
const initialContext: AgentContext = {
  jobTarget: '',
  domain: '',
  experienceLevel: 'mid',
  applicationGoals: [],
}

// Main store state
interface CVStoreState {
  cv: CV
  context: AgentContext
  lastModified: Date
  modificationHistory: Array<{
    timestamp: Date
    action: string
    field?: string
  }>
}

const initialState: CVStoreState = {
  cv: initialCVData,
  context: initialContext,
  lastModified: new Date(),
  modificationHistory: [],
}

// Create the store
export const cvStore = new Store<CVStoreState>(initialState)

// Derived: Full name
export const fullName = new Derived({
  fn: () => cvStore.state.cv.profile.name,
  deps: [cvStore],
})

// Derived: Skill count
export const skillCount = new Derived({
  fn: () => cvStore.state.cv.skills.length,
  deps: [cvStore],
})

// Derived: Experience count
export const experienceCount = new Derived({
  fn: () => cvStore.state.cv.experience.length,
  deps: [cvStore],
})

// Derived: Project count
export const projectCount = new Derived({
  fn: () => cvStore.state.cv.projects.length,
  deps: [cvStore],
})

// Derived: CV completeness score (0-100)
export const cvCompletenessScore = new Derived({
  fn: () => {
    const state = cvStore.state
    let score = 0
    let maxScore = 0

    // Profile section (30 points)
    maxScore += 30
    if (state.cv.profile.name) score += 5
    if (state.cv.profile.title) score += 5
    if (state.cv.profile.summary && state.cv.profile.summary.length >= 50) score += 10
    if (state.cv.profile.location) score += 5
    if (state.cv.profile.contact.email) score += 5

    // Experience section (40 points)
    maxScore += 40
    const experiencePoints = Math.min(40, state.cv.experience.length * 10)
    score += experiencePoints

    // Projects section (20 points)
    maxScore += 20
    const projectPoints = Math.min(20, state.cv.projects.length * 10)
    score += projectPoints

    // Skills section (10 points)
    maxScore += 10
    const skillPoints = Math.min(10, Math.floor(state.cv.skills.length / 2))
    score += skillPoints

    return Math.round((score / maxScore) * 100)
  },
  deps: [cvStore],
})

// Derived: Categorized skills
export const categorizedSkills = new Derived({
  fn: () => {
    const skills = cvStore.state.cv.skills

    // Simple categorization based on keywords
    const categories: Record<string, string[]> = {
      frontend: [],
      backend: [],
      database: [],
      devops: [],
      tools: [],
      other: [],
    }

    const frontendKeywords = [
      'react',
      'vue',
      'angular',
      'html',
      'css',
      'javascript',
      'typescript',
      'next.js',
      'nuxt',
    ]
    const backendKeywords = ['node', 'python', 'java', 'go', 'rust', 'ruby', 'php', '.net']
    const databaseKeywords = ['sql', 'mongodb', 'postgres', 'mysql', 'redis', 'firebase']
    const devopsKeywords = ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins']
    const toolsKeywords = ['git', 'linux', 'bash', 'webpack', 'vite', 'npm', 'yarn']

    skills.forEach((skill) => {
      const lowerSkill = skill.toLowerCase()

      if (frontendKeywords.some((kw) => lowerSkill.includes(kw))) {
        categories.frontend.push(skill)
      } else if (backendKeywords.some((kw) => lowerSkill.includes(kw))) {
        categories.backend.push(skill)
      } else if (databaseKeywords.some((kw) => lowerSkill.includes(kw))) {
        categories.database.push(skill)
      } else if (devopsKeywords.some((kw) => lowerSkill.includes(kw))) {
        categories.devops.push(skill)
      } else if (toolsKeywords.some((kw) => lowerSkill.includes(kw))) {
        categories.tools.push(skill)
      } else {
        categories.other.push(skill)
      }
    })

    return categories
  },
  deps: [cvStore],
})

// Helper functions to update store
export const cvActions = {
  updateProfile(profile: Partial<CV['profile']>) {
    cvStore.setState((prev) => ({
      ...prev,
      cv: {
        ...prev.cv,
        profile: {
          ...prev.cv.profile,
          ...profile,
        },
      },
      lastModified: new Date(),
      modificationHistory: [
        ...prev.modificationHistory,
        {
          timestamp: new Date(),
          action: 'update_profile',
          field: Object.keys(profile).join(', '),
        },
      ],
    }))
  },

  addExperience(experience: Experience) {
    cvStore.setState((prev) => ({
      ...prev,
      cv: {
        ...prev.cv,
        experience: [...prev.cv.experience, experience],
      },
      lastModified: new Date(),
      modificationHistory: [
        ...prev.modificationHistory,
        {
          timestamp: new Date(),
          action: 'add_experience',
          field: experience.company,
        },
      ],
    }))
  },

  updateExperience(index: number, experience: Partial<Experience>) {
    cvStore.setState((prev) => ({
      ...prev,
      cv: {
        ...prev.cv,
        experience: prev.cv.experience.map((exp, i) =>
          i === index ? { ...exp, ...experience } : exp
        ),
      },
      lastModified: new Date(),
      modificationHistory: [
        ...prev.modificationHistory,
        {
          timestamp: new Date(),
          action: 'update_experience',
          field: prev.cv.experience[index]?.company,
        },
      ],
    }))
  },

  addProject(project: Project) {
    cvStore.setState((prev) => ({
      ...prev,
      cv: {
        ...prev.cv,
        projects: [...prev.cv.projects, project],
      },
      lastModified: new Date(),
      modificationHistory: [
        ...prev.modificationHistory,
        {
          timestamp: new Date(),
          action: 'add_project',
          field: project.name,
        },
      ],
    }))
  },

  updateProject(index: number, project: Partial<Project>) {
    cvStore.setState((prev) => ({
      ...prev,
      cv: {
        ...prev.cv,
        projects: prev.cv.projects.map((proj, i) => (i === index ? { ...proj, ...project } : proj)),
      },
      lastModified: new Date(),
      modificationHistory: [
        ...prev.modificationHistory,
        {
          timestamp: new Date(),
          action: 'update_project',
          field: prev.cv.projects[index]?.name,
        },
      ],
    }))
  },

  addSkills(skills: string[]) {
    cvStore.setState((prev) => ({
      ...prev,
      cv: {
        ...prev.cv,
        skills: [...new Set([...prev.cv.skills, ...skills])],
      },
      lastModified: new Date(),
      modificationHistory: [
        ...prev.modificationHistory,
        {
          timestamp: new Date(),
          action: 'add_skills',
          field: skills.join(', '),
        },
      ],
    }))
  },

  removeSkill(skill: string) {
    cvStore.setState((prev) => ({
      ...prev,
      cv: {
        ...prev.cv,
        skills: prev.cv.skills.filter((s) => s !== skill),
      },
      lastModified: new Date(),
      modificationHistory: [
        ...prev.modificationHistory,
        {
          timestamp: new Date(),
          action: 'remove_skill',
          field: skill,
        },
      ],
    }))
  },

  updateContext(context: Partial<AgentContext>) {
    cvStore.setState((prev) => ({
      ...prev,
      context: {
        ...prev.context,
        ...context,
      },
      lastModified: new Date(),
      modificationHistory: [
        ...prev.modificationHistory,
        {
          timestamp: new Date(),
          action: 'update_context',
        },
      ],
    }))
  },

  loadCV(cvData: CV) {
    cvStore.setState((prev) => ({
      ...prev,
      cv: cvData,
      lastModified: new Date(),
      modificationHistory: [
        ...prev.modificationHistory,
        {
          timestamp: new Date(),
          action: 'load_cv',
        },
      ],
    }))
  },

  resetCV() {
    cvStore.setState(initialState)
  },
}

// Mount all derived states
fullName.mount()
skillCount.mount()
experienceCount.mount()
projectCount.mount()
cvCompletenessScore.mount()
categorizedSkills.mount()
