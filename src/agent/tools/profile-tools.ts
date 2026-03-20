import { BaseTool } from './base-tool'
import { cvActions, cvStore } from '../memory/cv-memory'
import type { Profile } from '../schemas/cv.schema'
import type { ToolResult } from './base-tool'

// Tool parameters and result types
type UpdateProfileParams = Partial<Profile>
type GenerateSummaryParams = { role: string; experience: number; skills: string[] }
type OptimizeContactParams = { email: string; github?: string; linkedin?: string }

/**
 * Profile Tools - Manage user profile information
 */
export class UpdateProfileTool extends BaseTool<UpdateProfileParams, ToolResult<Profile>> {
  readonly metadata = {
    name: 'updateProfile',
    description: 'Update personal profile information including name, title, summary, and contact details',
    parameters: [
      { name: 'name', type: 'string', description: 'Full name', required: false },
      { name: 'title', type: 'string', description: 'Professional title', required: false },
      { name: 'summary', type: 'string', description: 'Professional summary', required: false },
      { name: 'location', type: 'string', description: 'Location', required: false },
      { name: 'contact', type: 'object', description: 'Contact information', required: false },
    ],
    category: 'profile' as const,
  }

  async execute(params: UpdateProfileParams): Promise<ToolResult<Profile>> {
    try {
      cvActions.updateProfile(params)
      
      return {
        success: true,
        data: cvStore.state.cv.profile,
        message: 'Profile updated successfully',
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile',
      }
    }
  }
}

export class GenerateSummaryTool extends BaseTool<GenerateSummaryParams, ToolResult<string>> {
  readonly metadata = {
    name: 'generateSummary',
    description: 'Generate a professional summary using AI based on role, experience, and skills',
    parameters: [
      { name: 'role', type: 'string', description: 'Current or target role', required: true },
      { name: 'experience', type: 'number', description: 'Years of experience', required: true },
      { name: 'skills', type: 'array', description: 'Key skills', required: true },
    ],
    category: 'profile' as const,
  }

  async execute(params: GenerateSummaryParams): Promise<ToolResult<string>> {
    // TODO: Integrate with AI service
    // For now, generate a template summary
    const { role, experience, skills } = params
    
    const topSkills = skills.slice(0, 5).join(', ')
    
    const summary = `Experienced ${role} with ${experience}+ years of expertise in designing and implementing scalable solutions. Proficient in ${topSkills}. Passionate about building high-quality applications and driving technical excellence.`

    return {
      success: true,
      data: summary,
      message: 'Summary generated successfully',
      suggestions: [
        'Customize this summary to reflect your unique strengths',
        'Add specific domain expertise if applicable',
        'Include notable achievements or certifications',
      ],
    }
  }
}

export class OptimizeContactTool extends BaseTool<OptimizeContactParams, ToolResult<{ suggestions: string[] }>> {
  readonly metadata = {
    name: 'optimizeContact',
    description: 'Analyze and suggest improvements to contact information',
    parameters: [
      { name: 'email', type: 'string', description: 'Email address', required: true },
      { name: 'github', type: 'string', description: 'GitHub username', required: false },
      { name: 'linkedin', type: 'string', description: 'LinkedIn profile', required: false },
    ],
    category: 'profile' as const,
  }

  validate(params: OptimizeContactParams): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(params.email)
  }

  async execute(params: OptimizeContactParams): Promise<ToolResult<{ suggestions: string[] }>> {
    const suggestions: string[] = []

    // Email validation
    if (!params.email.includes('@')) {
      suggestions.push('Use a professional email address')
    }

    // GitHub suggestion
    if (!params.github) {
      suggestions.push('Add GitHub profile to showcase your code')
    }

    // LinkedIn suggestion
    if (!params.linkedin) {
      suggestions.push('Add LinkedIn profile for professional networking')
    }

    // Portfolio suggestion
    const currentProfile = cvStore.state.cv.profile
    if (!currentProfile.contact.portfolio) {
      suggestions.push('Consider adding a portfolio website')
    }

    return {
      success: true,
      data: { suggestions },
      message: suggestions.length > 0 
        ? 'Found optimization opportunities' 
        : 'Contact information looks good!',
    }
  }
}

// Export tool instances
export const profileTools = {
  updateProfile: new UpdateProfileTool(),
  generateSummary: new GenerateSummaryTool(),
  optimizeContact: new OptimizeContactTool(),
}
