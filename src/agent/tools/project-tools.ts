import { BaseTool } from './base-tool'
import { cvActions, cvStore } from '../memory/cv-memory'
import type { Project } from '../schemas/cv.schema'
import type { ToolResult } from './base-tool'

// Tool parameters and result types
type AddProjectParams = Omit<Project, 'highlights'> & { highlights: string[] }
type GenerateHighlightsParams = { projectName: string; description: string; techStack: string[] }
type LinkToSkillsParams = { projectIndex: number }

/**
 * Project Tools - Manage portfolio projects
 */
export class AddProjectTool extends BaseTool<AddProjectParams, ToolResult<Project>> {
  readonly metadata = {
    name: 'addProject',
    description: 'Add a new project to the portfolio',
    parameters: [
      { name: 'name', type: 'string', description: 'Project name', required: true },
      { name: 'description', type: 'string', description: 'Project description', required: true },
      { name: 'techStack', type: 'array', description: 'Technologies used', required: false },
      {
        name: 'highlights',
        type: 'array',
        description: 'Key highlights/achievements',
        required: true,
      },
    ],
    category: 'project' as const,
  }

  validate(params: AddProjectParams): boolean {
    return !!(params.name && params.description && params.highlights.length > 0)
  }

  async execute(params: AddProjectParams): Promise<ToolResult<Project>> {
    try {
      const project: Project = {
        name: params.name,
        description: params.description,
        techStack: params.techStack || [],
        highlights: params.highlights,
      }

      cvActions.addProject(project)

      return {
        success: true,
        data: project,
        message: 'Project added successfully',
        suggestions: [
          'Include links to live demos or repositories',
          'Add screenshots or visuals if possible',
          'Quantify the impact of your project',
        ],
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add project',
      }
    }
  }
}

export class GenerateHighlightsTool extends BaseTool<
  GenerateHighlightsParams,
  ToolResult<string[]>
> {
  readonly metadata = {
    name: 'generateHighlights',
    description: 'Generate compelling project highlights based on project details',
    parameters: [
      { name: 'projectName', type: 'string', description: 'Name of the project', required: true },
      { name: 'description', type: 'string', description: 'Project description', required: true },
      { name: 'techStack', type: 'array', description: 'Technologies used', required: true },
    ],
    category: 'project' as const,
  }

  async execute(params: GenerateHighlightsParams): Promise<ToolResult<string[]>> {
    const { projectName, description, techStack } = params

    // TODO: Integrate with AI service for generation
    // For now, provide template highlights
    const highlights: string[] = [
      `Designed and developed ${projectName} to solve [specific problem]`,
      `Implemented using ${techStack.slice(0, 3).join(', ')} for optimal performance`,
      'Achieved [quantifiable result] through innovative solutions',
      'Integrated best practices for code quality and maintainability',
    ]

    return {
      success: true,
      data: highlights,
      message: 'Highlights generated successfully',
      suggestions: [
        'Replace placeholders with specific metrics',
        'Focus on user impact and business value',
        'Highlight technical challenges overcome',
      ],
    }
  }
}

export class LinkToSkillsTool extends BaseTool<
  LinkToSkillsParams,
  ToolResult<{ linkedSkills: string[] }>
> {
  readonly metadata = {
    name: 'linkToSkills',
    description: 'Link project technologies to CV skills and identify gaps',
    parameters: [
      {
        name: 'projectIndex',
        type: 'number',
        description: 'Index of project entry',
        required: true,
      },
    ],
    category: 'project' as const,
  }

  async execute(params: LinkToSkillsParams): Promise<ToolResult<{ linkedSkills: string[] }>> {
    const { projectIndex } = params
    const projects = cvStore.state.cv.projects

    if (projectIndex < 0 || projectIndex >= projects.length) {
      return {
        success: false,
        message: 'Invalid project index',
        data: { linkedSkills: [] },
      }
    }

    const project = projects[projectIndex]
    const currentSkills = cvStore.state.cv.skills
    const projectTech = project.techStack.map((t) => t.toLowerCase())

    // Find skills from project that aren't in CV yet
    const newSkills = project.techStack.filter(
      (tech) => !currentSkills.some((skill) => skill.toLowerCase() === tech.toLowerCase())
    )

    // Find existing skills that are used in this project
    const matchedSkills = currentSkills.filter((skill) => projectTech.includes(skill.toLowerCase()))

    const allLinkedSkills = [...matchedSkills, ...newSkills]

    return {
      success: true,
      data: { linkedSkills: allLinkedSkills },
      message: `Found ${allLinkedSkills.length} skills linked to this project`,
      suggestions:
        newSkills.length > 0
          ? [`Consider adding these new skills to your CV: ${newSkills.join(', ')}`]
          : ['All project technologies are already in your skills list'],
    }
  }
}

// Export tool instances
export const projectTools = {
  addProject: new AddProjectTool(),
  generateHighlights: new GenerateHighlightsTool(),
  linkToSkills: new LinkToSkillsTool(),
}
