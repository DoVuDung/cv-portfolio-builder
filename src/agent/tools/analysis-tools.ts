import { BaseTool } from './base-tool'
import { cvStore, cvCompletenessScore } from '../memory/cv-memory'
import type { ToolResult } from './base-tool'

// Tool parameters and result types
type AnalyzeCVParams = void
type KeywordOptimizationParams = { jobDescription?: string }
type ConsistencyCheckParams = void

/**
 * Analysis Tools - CV analysis and optimization
 */
export class AnalyzeCVTool extends BaseTool<AnalyzeCVParams, ToolResult<any>> {
  readonly metadata = {
    name: 'analyzeCV',
    description: 'Perform comprehensive CV strength analysis',
    parameters: [],
    category: 'analysis' as const,
  }

  async execute(params: AnalyzeCVParams): Promise<ToolResult<any>> {
    const state = cvStore.state
    const completeness = cvCompletenessScore.state
    
    const analysis = {
      completeness,
      sections: {
        profile: this.analyzeProfile(state.cv.profile),
        experience: this.analyzeExperience(state.cv.experience),
        projects: this.analyzeProjects(state.cv.projects),
        skills: this.analyzeSkills(state.cv.skills),
      },
      overallScore: this.calculateOverallScore(state),
      strengths: [] as string[],
      weaknesses: [] as string[],
    }

    // Identify strengths and weaknesses
    if (completeness >= 80) {
      analysis.strengths.push('CV is mostly complete')
    } else {
      analysis.weaknesses.push('CV needs more content')
    }

    if (state.cv.experience.length > 0) {
      analysis.strengths.push('Has work experience listed')
    } else {
      analysis.weaknesses.push('No work experience added')
    }

    if (state.cv.projects.length > 0) {
      analysis.strengths.push('Has portfolio projects')
    } else {
      analysis.weaknesses.push('No projects to showcase skills')
    }

    if (state.cv.skills.length >= 10) {
      analysis.strengths.push('Good number of skills listed')
    } else {
      analysis.weaknesses.push('Add more relevant skills')
    }

    return {
      success: true,
      data: analysis,
      message: `CV Analysis Complete - Score: ${analysis.overallScore}/100`,
      suggestions: [
        ...analysis.weaknesses.map(w => `Improve: ${w}`),
        ...analysis.strengths.map(s => `Maintain: ${s}`),
      ],
    }
  }

  private analyzeProfile(profile: any) {
    const score = {
      hasName: !!profile.name,
      hasTitle: !!profile.title,
      summaryLength: profile.summary?.length || 0,
      hasContact: !!profile.contact.email,
    }

    return {
      complete: Object.values(score).every(v => v === true || (typeof v === 'number' && v >= 50)),
      score: Object.values(score).filter(Boolean).length / Object.keys(score).length * 100,
    }
  }

  private analyzeExperience(experience: any[]) {
    return {
      count: experience.length,
      averageAchievements: experience.length > 0 
        ? Math.round(experience.reduce((sum, exp) => sum + exp.achievements.length, 0) / experience.length)
        : 0,
      withMetrics: experience.filter(exp => 
        exp.achievements.some((a: string) => /\d+%|\d+x|\$\d+/.test(a))
      ).length,
    }
  }

  private analyzeProjects(projects: any[]) {
    return {
      count: projects.length,
      withTechStack: projects.filter(p => p.techStack && p.techStack.length > 0).length,
      withHighlights: projects.filter(p => p.highlights && p.highlights.length > 0).length,
    }
  }

  private analyzeSkills(skills: string[]) {
    return {
      total: skills.length,
      unique: new Set(skills.map(s => s.toLowerCase())).size,
    }
  }

  private calculateOverallScore(state: any): number {
    let score = 0
    
    // Profile section (25 points)
    if (state.cv.profile.name) score += 5
    if (state.cv.profile.title) score += 5
    if (state.cv.profile.summary && state.cv.profile.summary.length >= 50) score += 10
    if (state.cv.profile.contact.email) score += 5

    // Experience section (35 points)
    const expPoints = Math.min(35, state.cv.experience.length * 10)
    score += expPoints

    // Projects section (25 points)
    const projPoints = Math.min(25, state.cv.projects.length * 10)
    score += projPoints

    // Skills section (15 points)
    const skillPoints = Math.min(15, Math.floor(state.cv.skills.length / 2))
    score += skillPoints

    return Math.round(score)
  }
}

export class KeywordOptimizationTool extends BaseTool<KeywordOptimizationParams, ToolResult<{ keywords: string[]; missingKeywords: string[] }>> {
  readonly metadata = {
    name: 'keywordOptimization',
    description: 'Optimize CV for ATS by analyzing keywords',
    parameters: [
      { name: 'jobDescription', type: 'string', description: 'Job description text', required: false },
    ],
    category: 'analysis' as const,
  }

  async execute(params: KeywordOptimizationParams): Promise<ToolResult<{ keywords: string[]; missingKeywords: string[] }>> {
    const { jobDescription } = params
    
    // Extract keywords from current CV
    const currentSkills = cvStore.state.cv.skills
    const currentKeywords = currentSkills.map(s => s.toLowerCase())

    // If job description provided, extract keywords from it
    let jobKeywords: string[] = []
    if (jobDescription) {
      // Simple keyword extraction (would use NLP in production)
      const commonTechKeywords = [
        'react', 'angular', 'vue', 'node', 'python', 'java', 'javascript', 'typescript',
        'aws', 'azure', 'docker', 'kubernetes', 'mongodb', 'postgresql', 'mysql',
        'graphql', 'rest', 'microservices', 'ci/cd', 'agile', 'scrum'
      ]
      
      jobKeywords = commonTechKeywords.filter(keyword => 
        jobDescription.toLowerCase().includes(keyword)
      )
    }

    // Find missing keywords
    const missingKeywords = jobKeywords.filter(
      kw => !currentKeywords.includes(kw)
    )

    return {
      success: true,
      data: { keywords: currentKeywords, missingKeywords },
      message: jobDescription 
        ? `Found ${missingKeywords.length} missing keywords from job description`
        : `Current CV has ${currentKeywords.length} keywords`,
      suggestions: missingKeywords.length > 0
        ? [`Consider adding these keywords: ${missingKeywords.slice(0, 5).join(', ')}`]
        : ['Your CV keywords look good!'],
    }
  }
}

export class ConsistencyCheckTool extends BaseTool<ConsistencyCheckParams, ToolResult<{ issues: string[]; suggestions: string[] }>> {
  readonly metadata = {
    name: 'consistencyCheck',
    description: 'Check consistency between CV sections and portfolio',
    parameters: [],
    category: 'analysis' as const,
  }

  async execute(params: ConsistencyCheckParams): Promise<ToolResult<{ issues: string[]; suggestions: string[] }>> {
    const state = cvStore.state
    const issues: string[] = []
    const suggestions: string[] = []

    // Check if skills are reflected in projects
    const projectTechStacks = state.cv.projects.flatMap(p => p.techStack.map(t => t.toLowerCase()))
    
    state.cv.skills.forEach(skill => {
      const skillLower = skill.toLowerCase()
      const isInProjects = projectTechStacks.includes(skillLower)
      
      if (!isInProjects && state.cv.projects.length > 0) {
        issues.push(`Skill "${skill}" is not demonstrated in any project`)
      }
    })

    // Check if project technologies are in skills
    state.cv.projects.forEach(project => {
      project.techStack.forEach(tech => {
        const techLower = tech.toLowerCase()
        const isInSkills = state.cv.skills.some(s => s.toLowerCase().includes(techLower))
        
        if (!isInSkills) {
          suggestions.push(`Consider adding "${tech}" from "${project.name}" to your skills`)
        }
      })
    })

    // Check experience consistency
    state.cv.experience.forEach((exp, index) => {
      if (exp.endDate && exp.startDate > exp.endDate) {
        issues.push(`Experience at ${exp.company}: End date is before start date`)
      }
    })

    // Check for empty sections
    if (!state.cv.profile.summary || state.cv.profile.summary.length < 50) {
      suggestions.push('Expand your professional summary to at least 50 characters')
    }

    return {
      success: true,
      data: { issues, suggestions },
      message: `Found ${issues.length} issues and ${suggestions.length} suggestions`,
      suggestions: [
        ...issues.map(i => `Fix: ${i}`),
        ...suggestions,
      ],
    }
  }
}

// Export tool instances
export const analysisTools = {
  analyzeCV: new AnalyzeCVTool(),
  keywordOptimization: new KeywordOptimizationTool(),
  consistencyCheck: new ConsistencyCheckTool(),
}
