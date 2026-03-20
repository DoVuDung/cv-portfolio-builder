import { BaseTool } from './base-tool'
import { cvActions, cvStore, categorizedSkills } from '../memory/cv-memory'
import type { ToolResult } from './base-tool'

// Tool parameters and result types
type AddSkillParams = { skill: string; category?: string }
type CategorizeSkillsParams = void
type IdentifyGapsParams = { targetRole: string; currentSkills: string[] }

/**
 * Skills Tools - Manage technical skills
 */
export class AddSkillTool extends BaseTool<AddSkillParams, ToolResult<{ skill: string }>> {
  readonly metadata = {
    name: 'addSkill',
    description: 'Add a new skill to the CV',
    parameters: [
      { name: 'skill', type: 'string', description: 'Skill name', required: true },
      {
        name: 'category',
        type: 'string',
        description: 'Skill category (optional)',
        required: false,
      },
    ],
    category: 'skills' as const,
  }

  validate(params: AddSkillParams): boolean {
    return !!(params.skill && params.skill.trim().length > 0)
  }

  async execute(params: AddSkillParams): Promise<ToolResult<{ skill: string }>> {
    try {
      const skillName = params.skill.trim()

      // Check if skill already exists
      const existingSkills = cvStore.state.cv.skills
      const skillExists = existingSkills.some((s) => s.toLowerCase() === skillName.toLowerCase())

      if (skillExists) {
        return {
          success: false,
          message: 'Skill already exists in your CV',
          data: { skill: skillName },
        }
      }

      cvActions.addSkills([skillName])

      return {
        success: true,
        data: { skill: skillName },
        message: `Added "${skillName}" to your skills`,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add skill',
      }
    }
  }
}

export class CategorizeSkillsTool extends BaseTool<CategorizeSkillsParams, ToolResult<any>> {
  readonly metadata = {
    name: 'categorizeSkills',
    description: 'Automatically categorize skills into logical groups',
    parameters: [],
    category: 'skills' as const,
  }

  async execute(params: CategorizeSkillsParams): Promise<ToolResult<any>> {
    const categories = categorizedSkills.state

    // Filter out empty categories
    const nonEmptyCategories = Object.fromEntries(
      Object.entries(categories).filter(([_, skills]) => skills.length > 0)
    )

    return {
      success: true,
      data: nonEmptyCategories,
      message: `Categorized ${cvStore.state.cv.skills.length} skills into ${Object.keys(nonEmptyCategories).length} groups`,
      suggestions: [
        'Review categories for accuracy',
        'Consider splitting large categories',
        'Remove outdated or irrelevant skills',
      ],
    }
  }
}

export class IdentifyGapsTool extends BaseTool<
  IdentifyGapsParams,
  ToolResult<{ gaps: string[]; recommendations: string[] }>
> {
  readonly metadata = {
    name: 'identifyGaps',
    description: 'Identify skill gaps based on target role requirements',
    parameters: [
      { name: 'targetRole', type: 'string', description: 'Target job role', required: true },
      { name: 'currentSkills', type: 'array', description: 'Current skills list', required: true },
    ],
    category: 'skills' as const,
  }

  async execute(
    params: IdentifyGapsParams
  ): Promise<ToolResult<{ gaps: string[]; recommendations: string[] }>> {
    const { targetRole, currentSkills } = params
    const currentSkillsLower = currentSkills.map((s) => s.toLowerCase())

    // Role-based skill requirements (simplified - would use AI/ML in production)
    const roleRequirements: Record<string, string[]> = {
      'frontend developer': [
        'React',
        'TypeScript',
        'JavaScript',
        'HTML',
        'CSS',
        'State Management',
        'Responsive Design',
        'Testing',
      ],
      'backend developer': [
        'Node.js',
        'Python',
        'Database',
        'API Design',
        'Security',
        'Caching',
        'Message Queues',
      ],
      'full stack developer': [
        'React',
        'Node.js',
        'TypeScript',
        'Database',
        'API Design',
        'Deployment',
        'Testing',
      ],
      'devops engineer': [
        'Docker',
        'Kubernetes',
        'CI/CD',
        'Cloud Platforms',
        'Infrastructure as Code',
        'Monitoring',
        'Linux',
      ],
      'software engineer': [
        'Data Structures',
        'Algorithms',
        'System Design',
        'Version Control',
        'Testing',
        'Problem Solving',
      ],
    }

    // Find closest matching role
    const targetRoleLower = targetRole.toLowerCase()
    let requiredSkills: string[] = []

    for (const [role, skills] of Object.entries(roleRequirements)) {
      if (targetRoleLower.includes(role)) {
        requiredSkills = skills
        break
      }
    }

    // If no match found, use generic software engineering skills
    if (requiredSkills.length === 0) {
      requiredSkills = roleRequirements['software engineer']
    }

    // Identify gaps
    const gaps = requiredSkills.filter(
      (skill) => !currentSkillsLower.some((s) => s.includes(skill.toLowerCase()))
    )

    // Generate recommendations
    const recommendations = gaps.slice(0, 5).map((skill) => ({
      skill,
      priority: gaps.indexOf(skill) < 3 ? 'high' : 'medium',
      learningPath: `Learn ${skill} through projects and courses`,
    }))

    return {
      success: true,
      data: { gaps, recommendations },
      message: `Identified ${gaps.length} skill gaps for ${targetRole} role`,
      suggestions: [
        `Focus on high-priority skills first: ${gaps.slice(0, 3).join(', ')}`,
        'Build projects using these technologies',
        'Consider relevant certifications or courses',
      ],
    }
  }
}

// Export tool instances
export const skillsTools = {
  addSkill: new AddSkillTool(),
  categorizeSkills: new CategorizeSkillsTool(),
  identifyGaps: new IdentifyGapsTool(),
}
