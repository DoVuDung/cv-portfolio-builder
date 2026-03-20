import { BaseTool } from './base-tool'
import type { CV, Experience } from '../schemas/cv.schema'
import type { ToolResult } from './base-tool'

// Tool parameter types
type AnalyzeCVParams = { cv: CV }
type GenerateSummaryParams = { cv: CV; targetRole: string }
type ImproveExperienceParams = { experience: Experience }
type ExtractSkillsParams = { cv: CV }
type OptimizeATSParams = { cv: CV; jobDescription?: string }
type MapToUISectionsParams = { cv: CV }

/**
 * MCP Tool 1: analyzeCV
 * Returns structured feedback about CV weaknesses and improvement areas
 */
export class AnalyzeCVTool extends BaseTool<AnalyzeCVParams, CVAnalysis> {
  readonly metadata = {
    name: 'analyzeCV',
    description: 'Analyzes CV and returns structured feedback on weak points, missing impact, and unclear wording',
    parameters: [
      { name: 'cv', type: 'CV', description: 'Complete CV data', required: true },
    ],
    category: 'analysis' as const,
    requiresLLM: false,
  }

  validate(params: AnalyzeCVParams): boolean {
    return !!(params.cv && params.cv.profile)
  }

  execute(params: AnalyzeCVParams): Promise<CVMetadata> {
    const { cv } = params
    const analysis: CVAnalysis = {
      score: this.calculateScore(cv),
      strengths: [],
      weaknesses: [],
      recommendations: [],
      sections: {},
    }

    // Analyze profile
    if (!cv.profile.summary || cv.profile.summary.length < 50) {
      analysis.weaknesses.push('Summary is too short or missing')
      analysis.recommendations.push('Expand professional summary to at least 50 characters')
    } else {
      analysis.strengths.push('Has a comprehensive professional summary')
    }

    // Analyze experience
    if (cv.experience.length === 0) {
      analysis.weaknesses.push('No work experience listed')
      analysis.recommendations.push('Add at least 2-3 relevant work experiences')
    } else {
      analysis.strengths.push(`Has ${cv.experience.length} work experience entries`)
      
      // Check for metrics in achievements
      const hasMetrics = cv.experience.some(exp =>
        exp.achievements.some(a => /\d+%|\d+x|\$\d+/.test(a))
      )
      
      if (!hasMetrics) {
        analysis.weaknesses.push('Achievements lack quantifiable metrics')
        analysis.recommendations.push('Add numbers, percentages, or dollar amounts to achievements')
      } else {
        analysis.strengths.push('Achievements include quantifiable impact')
      }
    }

    // Analyze projects
    if (cv.projects.length === 0) {
      analysis.weaknesses.push('No projects to showcase skills')
      analysis.recommendations.push('Add 2-3 relevant portfolio projects')
    } else {
      analysis.strengths.push(`Has ${cv.projects.length} portfolio projects`)
    }

    // Analyze skills
    if (cv.skills.length < 5) {
      analysis.weaknesses.push('Too few skills listed')
      analysis.recommendations.push('Add more relevant technical skills (aim for 10+)')
    } else if (cv.skills.length > 30) {
      analysis.weaknesses.push('Too many skills listed')
      analysis.recommendations.push('Focus on most relevant skills (15-25 is optimal)')
    } else {
      analysis.strengths.push('Good number of skills listed')
    }

    // Section-by-section analysis
    analysis.sections = {
      profile: { complete: !!cv.profile.name && !!cv.profile.title, score: this.scoreSection(cv.profile) },
      experience: { complete: cv.experience.length > 0, score: this.scoreSection(cv.experience) },
      projects: { complete: cv.projects.length > 0, score: this.scoreSection(cv.projects) },
      skills: { complete: cv.skills.length > 0, score: this.scoreSection(cv.skills) },
    }

    return Promise.resolve(analysis)
  }

  private calculateScore(cv: CV): number {
    let score = 0
    
    // Profile (25 points)
    if (cv.profile.name) score += 5
    if (cv.profile.title) score += 5
    if (cv.profile.summary && cv.profile.summary.length >= 50) score += 10
    if (cv.profile.contact.email) score += 5
    
    // Experience (35 points)
    score += Math.min(35, cv.experience.length * 10)
    
    // Projects (25 points)
    score += Math.min(25, cv.projects.length * 10)
    
    // Skills (15 points)
    score += Math.min(15, Math.floor(cv.skills.length / 2))
    
    return Math.min(100, score)
  }

  private scoreSection(section: unknown): number {
    if (!section) return 0
    if (Array.isArray(section)) return section.length > 0 ? 80 : 0
    if (typeof section === 'object') return Object.keys(section).length > 3 ? 75 : 50
    return 0
  }
}

/**
 * MCP Tool 2: generateSummary
 * Generates improved professional summary based on CV and target role
 */
export class GenerateSummaryTool extends BaseTool<GenerateSummaryParams, string> {
  readonly metadata = {
    name: 'generateSummary',
    description: 'Generates a compelling professional summary tailored to target role',
    parameters: [
      { name: 'cv', type: 'CV', description: 'Complete CV data', required: true },
      { name: 'targetRole', type: 'string', description: 'Target job title', required: true },
    ],
    category: 'generation' as const,
    requiresLLM: true,
  }

  async execute(params: GenerateSummaryParams): Promise<string> {
    const { cv, targetRole } = params
    
    // Extract key information
    const currentTitle = cv.profile.title
    const yearsOfExperience = this.estimateYearsOfExperience(cv)
    const topSkills = cv.skills.slice(0, 5).join(', ')
    
    // Generate summary template (would use LLM in production)
    const summary = `Experienced ${currentTitle} with ${yearsOfExperience}+ years of expertise, seeking ${targetRole} position. Proven track record in ${topSkills}. Demonstrated ability to deliver impactful results through innovative solutions and collaborative leadership.`
    
    return summary
  }

  private estimateYearsOfExperience(cv: CV): number {
    if (cv.experience.length === 0) return 0
    
    const now = new Date()
    let totalMonths = 0
    
    cv.experience.forEach(exp => {
      const start = new Date(exp.startDate)
      const end = exp.endDate ? new Date(exp.endDate) : now
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                    (end.getMonth() - start.getMonth())
      totalMonths += Math.max(0, months)
    })
    
    return Math.round(totalMonths / 12)
  }
}

/**
 * MCP Tool 3: improveExperience
 * Rewrites experience bullet points with impact and metrics
 */
export class ImproveExperienceTool extends BaseTool<ImproveExperienceParams, ImprovedExperience> {
  readonly metadata = {
    name: 'improveExperience',
    description: 'Rewrites experience achievements with stronger impact and quantifiable metrics',
    parameters: [
      { name: 'experience', type: 'Experience', description: 'Experience entry to improve', required: true },
    ],
    category: 'optimization' as const,
    requiresLLM: true,
  }

  async execute(params: ImproveExperienceParams): Promise<ImprovedExperience> {
    const { experience } = params
    
    const improvedAchievements = experience.achievements.map(achievement => {
      // Simple enhancement patterns (would use LLM in production)
      let improved = achievement
      
      // Add metric placeholder if not present
      if (!/\d+%|\d+x|\$\d+/.test(improved)) {
        improved += ' [Add metric]'
      }
      
      // Ensure starts with strong action verb
      const actionVerbs = ['Developed', 'Led', 'Improved', 'Reduced', 'Increased', 'Implemented', 'Designed', 'Optimized']
      const firstWord = improved.split(' ')[0]
      
      if (!actionVerbs.some(v => v.toLowerCase() === firstWord.toLowerCase())) {
        improved = 'Developed ' + improved.charAt(0).toLowerCase() + improved.slice(1)
      }
      
      return improved
    })
    
    return {
      ...experience,
      achievements: improvedAchievements,
      suggestions: [
        'Replace [Add metric] placeholders with real numbers',
        'Focus on business impact, not just technical details',
        'Use STAR method (Situation, Task, Action, Result)',
      ],
    }
  }
}

/**
 * MCP Tool 4: extractSkills
 * Deduplicates and normalizes skills from CV
 */
export class ExtractSkillsTool extends BaseTool<ExtractSkillsParams, SkillExtraction> {
  readonly metadata = {
    name: 'extractSkills',
    description: 'Extracts, deduplicates, and categorizes skills from CV',
    parameters: [
      { name: 'cv', type: 'CV', description: 'Complete CV data', required: true },
    ],
    category: 'extraction' as const,
    requiresLLM: false,
  }

  execute(params: ExtractSkillsParams): Promise<SkillExtraction> {
    const { cv } = params
    
    // Extract skills from experience
    const experienceSkills = cv.experience.flatMap(exp => exp.techStack)
    const projectSkills = cv.projects.flatMap(proj => proj.techStack)
    
    // Combine all skills
    const allSkills = [...cv.skills, ...experienceSkills, ...projectSkills]
    
    // Normalize and deduplicate
    const normalizedSkills = Array.from(
      new Set(allSkills.map(s => s.trim().toLowerCase()))
    ).sort()
    
    // Categorize skills
    const categorized = this.categorizeSkills(normalizedSkills)
    
    return Promise.resolve({
      all: normalizedSkills,
      categorized,
      duplicatesRemoved: allSkills.length - normalizedSkills.length,
      sources: {
        explicit: cv.skills.length,
        fromExperience: experienceSkills.length,
        fromProjects: projectSkills.length,
      },
    })
  }

  private categorizeSkills(skills: Array<string>): Record<string, Array<string>> {
    const categories: Record<string, Array<string>> = {
      frontend: [],
      backend: [],
      database: [],
      devops: [],
      tools: [],
      other: [],
    }
    
    const keywords = {
      frontend: ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript'],
      backend: ['node', 'python', 'java', 'go', 'ruby', 'php', '.net'],
      database: ['sql', 'mongodb', 'postgres', 'mysql', 'redis'],
      devops: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd'],
      tools: ['git', 'linux', 'bash', 'webpack', 'vite'],
    }
    
    skills.forEach(skill => {
      const categorized = Object.keys(keywords).some(category =>
        keywords[category as keyof typeof keywords].some(kw => skill.includes(kw))
      )
      
      if (!categorized) {
        categories.other.push(skill)
      }
    })
    
    return categories
  }
}

/**
 * MCP Tool 5: optimizeATS
 * Optimizes CV for Applicant Tracking Systems
 */
export class OptimizeATSTool extends BaseTool<OptimizeATSParams, ATSOptimization> {
  readonly metadata = {
    name: 'optimizeATS',
    description: 'Optimizes CV content for better ATS keyword matching',
    parameters: [
      { name: 'cv', type: 'CV', description: 'Complete CV data', required: true },
      { name: 'jobDescription', type: 'string', description: 'Job description text', required: false },
    ],
    category: 'optimization' as const,
    requiresLLM: true,
  }

  async execute(params: OptimizeATSParams): Promise<ATSOptimization> {
    const { cv, jobDescription } = params
    
    // Extract current keywords
    const currentKeywords = this.extractKeywords(cv)
    
    // Extract keywords from job description if provided
    const jobKeywords = jobDescription ? this.extractJobKeywords(jobDescription) : []
    
    // Find missing keywords
    const missingKeywords = jobKeywords.filter(
      kw => !currentKeywords.includes(kw.toLowerCase())
    )
    
    return {
      optimizedCV: cv,
      currentKeywords,
      missingKeywords,
      matchScore: jobKeywords.length > 0 
        ? Math.round((currentKeywords.filter(k => jobKeywords.includes(k)).length / jobKeywords.length) * 100)
        : null,
      recommendations: missingKeywords.slice(0, 10).map(kw => ({
        keyword: kw,
        priority: 'high',
        suggestion: `Incorporate "${kw}" naturally into your CV`,
      })),
    }
  }

  private extractKeywords(cv: CV): Array<string> {
    const keywords = new Set<string>()
    
    // Add skills
    cv.skills.forEach(skill => keywords.add(skill.toLowerCase()))
    
    // Add tech stack from experience
    cv.experience.forEach(exp => {
      exp.techStack.forEach(tech => keywords.add(tech.toLowerCase()))
    })
    
    // Add tech stack from projects
    cv.projects.forEach(proj => {
      proj.techStack.forEach(tech => keywords.add(tech.toLowerCase()))
    })
    
    return Array.from(keywords)
  }

  private extractJobKeywords(description: string): Array<string> {
    // Simple keyword extraction (would use NLP in production)
    const commonTechKeywords = [
      'react', 'angular', 'vue', 'node', 'python', 'java', 'javascript', 'typescript',
      'aws', 'azure', 'docker', 'kubernetes', 'mongodb', 'postgresql', 'mysql',
      'graphql', 'rest', 'microservices', 'agile', 'scrum',
    ]
    
    return commonTechKeywords.filter(keyword =>
      description.toLowerCase().includes(keyword)
    )
  }
}

/**
 * MCP Tool 6: mapToUISections
 * Maps CV data to UI-ready section format
 */
export class MapToUISectionsTool extends BaseTool<MapToUISectionsParams, UIMapping> {
  readonly metadata = {
    name: 'mapToUISections',
    description: 'Transforms CV data into structured format ready for template rendering',
    parameters: [
      { name: 'cv', type: 'CV', description: 'Complete CV data', required: true },
    ],
    category: 'mapping' as const,
    requiresLLM: false,
  }

  execute(params: MapToUISectionsParams): Promise<UIMapping> {
    const { cv } = params
    
    return Promise.resolve({
      header: {
        name: cv.profile.name,
        title: cv.profile.title,
        contact: cv.profile.contact,
        location: cv.profile.location,
      },
      summary: cv.profile.summary,
      sections: [
        {
          id: 'experience',
          title: 'Work Experience',
          order: 1,
          items: cv.experience.map(exp => ({
            heading: exp.role,
            subheading: exp.company,
            dateRange: `${exp.startDate} - ${exp.endDate || 'Present'}`,
            details: exp.achievements,
            tags: exp.techStack,
          })),
        },
        {
          id: 'projects',
          title: 'Portfolio Projects',
          order: 2,
          items: cv.projects.map(proj => ({
            heading: proj.name,
            subheading: proj.description,
            details: proj.highlights,
            tags: proj.techStack,
          })),
        },
        {
          id: 'skills',
          title: 'Skills',
          order: 3,
          items: [{
            heading: 'Technical Skills',
            details: cv.skills,
          }],
        },
        {
          id: 'education',
          title: 'Education',
          order: 4,
          items: cv.education.map(edu => ({
            heading: edu.degree,
            subheading: edu.institution,
            dateRange: `${edu.startDate} - ${edu.endDate || 'Present'}`,
            details: edu.field ? [edu.field] : [],
          })),
        },
      ],
      metadata: {
        lastUpdated: new Date(),
        wordCount: this.countWords(cv),
        sectionCount: 4,
      },
    })
  }

  private countWords(cv: CV): number {
    const text = JSON.stringify(cv)
    return text.split(/\s+/).length
  }
}

// Export tool instances
export const coreTools = {
  analyzeCV: new AnalyzeCVTool(),
  generateSummary: new GenerateSummaryTool(),
  improveExperience: new ImproveExperienceTool(),
  extractSkills: new ExtractSkillsTool(),
  optimizeATS: new OptimizeATSTool(),
  mapToUISections: new MapToUISectionsTool(),
}

// Type exports
export interface CVAnalysis {
  score: number
  strengths: Array<string>
  weaknesses: Array<string>
  recommendations: Array<string>
  sections: Record<string, { complete: boolean; score: number }>
}

export interface ImprovedExperience extends Experience {
  suggestions: Array<string>
}

export interface SkillExtraction {
  all: Array<string>
  categorized: Record<string, Array<string>>
  duplicatesRemoved: number
  sources: {
    explicit: number
    fromExperience: number
    fromProjects: number
  }
}

export interface ATSOptimization {
  optimizedCV: CV
  currentKeywords: Array<string>
  missingKeywords: Array<string>
  matchScore: number | null
  recommendations: Array<{
    keyword: string
    priority: 'high' | 'medium' | 'low'
    suggestion: string
  }>
}

export interface UIMapping {
  header: {
    name: string
    title: string
    contact: Contact
    location: string
  }
  summary: string
  sections: Array<{
    id: string
    title: string
    order: number
    items: Array<{
      heading: string
      subheading?: string
      dateRange?: string
      details: Array<string>
      tags?: Array<string>
    }>
  }>
  metadata: {
    lastUpdated: Date
    wordCount: number
    sectionCount: number
  }
}
