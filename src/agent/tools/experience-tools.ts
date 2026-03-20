import { BaseTool } from './base-tool'
import { cvActions, cvStore } from '../memory/cv-memory'
import type { Experience } from '../schemas/cv.schema'
import type { ToolResult } from './base-tool'

// Tool parameters and result types
type AddExperienceParams = Omit<Experience, 'achievements'> & { achievements: string[] }
type EnhanceAchievementsParams = { experienceIndex: number; achievements: string[] }
type SuggestTechStackParams = { role: string; industry?: string }

/**
 * Experience Tools - Manage work experience entries
 */
export class AddExperienceTool extends BaseTool<AddExperienceParams, ToolResult<Experience>> {
  readonly metadata = {
    name: 'addExperience',
    description: 'Add a new work experience entry to the CV',
    parameters: [
      { name: 'company', type: 'string', description: 'Company name', required: true },
      { name: 'role', type: 'string', description: 'Job title/role', required: true },
      { name: 'startDate', type: 'string', description: 'Start date (YYYY-MM)', required: true },
      { name: 'endDate', type: 'string', description: 'End date (YYYY-MM) or empty for current', required: false },
      { name: 'achievements', type: 'array', description: 'Key achievements', required: true },
      { name: 'techStack', type: 'array', description: 'Technologies used', required: false },
    ],
    category: 'experience' as const,
  }

  validate(params: AddExperienceParams): boolean {
    return !!(params.company && params.role && params.startDate && params.achievements.length > 0)
  }

  async execute(params: AddExperienceParams): Promise<ToolResult<Experience>> {
    try {
      const experience: Experience = {
        company: params.company,
        role: params.role,
        startDate: params.startDate,
        endDate: params.endDate,
        achievements: params.achievements,
        techStack: params.techStack || [],
      }

      cvActions.addExperience(experience)

      return {
        success: true,
        data: experience,
        message: 'Experience added successfully',
        suggestions: [
          'Quantify your achievements with metrics where possible',
          'Use action verbs to start each achievement',
          'Highlight technologies and methodologies used',
        ],
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add experience',
      }
    }
  }
}

export class EnhanceAchievementsTool extends BaseTool<EnhanceAchievementsParams, ToolResult<string[]>> {
  readonly metadata = {
    name: 'enhanceAchievements',
    description: 'Enhance achievement descriptions with impact metrics and stronger language',
    parameters: [
      { name: 'experienceIndex', type: 'number', description: 'Index of experience entry', required: true },
      { name: 'achievements', type: 'array', description: 'Achievements to enhance', required: true },
    ],
    category: 'experience' as const,
  }

  async execute(params: EnhanceAchievementsParams): Promise<ToolResult<string[]>> {
    const { achievements } = params
    
    // TODO: Integrate with AI service for enhancement
    // For now, provide template enhancements
    const enhanced = achievements.map(achievement => {
      // Simple enhancement patterns
      let enhanced = achievement
      
      // Add metric placeholder if not present
      if (!/\d+%|\d+x|\$\d+/.test(enhanced)) {
        enhanced += ' [Add specific metric]'
      }
      
      // Ensure starts with action verb
      const actionVerbs = ['Developed', 'Led', 'Improved', 'Reduced', 'Increased', 'Implemented', 'Designed', 'Optimized']
      const firstWord = enhanced.split(' ')[0]
      if (!actionVerbs.some(v => v.toLowerCase() === firstWord.toLowerCase())) {
        enhanced = 'Developed ' + enhanced.charAt(0).toLowerCase() + enhanced.slice(1)
      }
      
      return enhanced
    })

    return {
      success: true,
      data: enhanced,
      message: 'Achievements enhanced successfully',
      suggestions: [
        'Replace [Add specific metric] with real numbers',
        'Focus on business impact, not just technical details',
        'Use the STAR method (Situation, Task, Action, Result)',
      ],
    }
  }
}

export class SuggestTechStackTool extends BaseTool<SuggestTechStackParams, ToolResult<string[]>> {
  readonly metadata = {
    name: 'suggestTechStack',
    description: 'Suggest relevant technologies based on role and industry',
    parameters: [
      { name: 'role', type: 'string', description: 'Job role/title', required: true },
      { name: 'industry', type: 'string', description: 'Industry/domain', required: false },
    ],
    category: 'experience' as const,
  }

  async execute(params: SuggestTechStackParams): Promise<ToolResult<string[]>> {
    const { role, industry } = params
    const suggestions: string[] = []

    const roleLower = role.toLowerCase()
    
    // Role-based suggestions
    if (roleLower.includes('frontend') || roleLower.includes('react')) {
      suggestions.push('React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL')
    } else if (roleLower.includes('backend') || roleLower.includes('node')) {
      suggestions.push('Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS')
    } else if (roleLower.includes('fullstack') || roleLower.includes('full-stack')) {
      suggestions.push('React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker')
    } else if (roleLower.includes('devops')) {
      suggestions.push('Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Monitoring')
    }

    // Industry-based suggestions
    if (industry?.toLowerCase().includes('fintech')) {
      suggestions.push('Security', 'Compliance', 'Blockchain', 'API Design')
    } else if (industry?.toLowerCase().includes('healthcare')) {
      suggestions.push('HIPAA', 'Data Privacy', 'HL7', 'FHIR')
    } else if (industry?.toLowerCase().includes('ecommerce')) {
      suggestions.push('Payment Processing', 'Scalability', 'Redis', 'Microservices')
    }

    // Remove duplicates
    const uniqueSuggestions = [...new Set(suggestions)]

    return {
      success: true,
      data: uniqueSuggestions,
      message: `Found ${uniqueSuggestions.length} relevant technologies`,
    }
  }
}

// Export tool instances
export const experienceTools = {
  addExperience: new AddExperienceTool(),
  enhanceAchievements: new EnhanceAchievementsTool(),
  suggestTechStack: new SuggestTechStackTool(),
}
