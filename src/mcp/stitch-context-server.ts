import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type { CVData } from '../types/cv.types'

// Create MCP server for Google Stitch UI context cloning
const server = new McpServer({
  name: 'stitch-context-server',
  version: '1.0.0',
})

// Tool: Clone context from Google Stitch UI
server.tool(
  'clone-stitch-context',
  'Clone CV data from Google Stitch UI context',
  {
    stitchUrl: z.string().describe('Google Stitch UI base URL'),
    contextId: z.string().describe('Stitch context or project ID'),
  },
  async ({ stitchUrl, contextId }) => {
    try {
      // Fetch context data from Google Stitch
      const response = await fetch(`${stitchUrl}/api/v1/context/${contextId}`)
      
      if (!response.ok) {
        throw new Error(`Stitch API error: ${response.statusText}`)
      }
      
      const stitchData = await response.json()
      
      // Transform to our CV format
      const cvData = transformStitchToCV(stitchData)
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(cvData, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error cloning from Stitch: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Push CV to Google Stitch
server.tool(
  'push-to-stitch',
  'Push CV data to Google Stitch UI as context',
  {
    stitchUrl: z.string().describe('Google Stitch UI base URL'),
    cvData: z.object({
      profile: z.object({
        name: z.string(),
        title: z.string(),
        summary: z.string(),
        location: z.string(),
        phone: z.string().optional(),
        email: z.string().optional(),
        portfolio: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        education: z.string().optional(),
        languages: z.string().optional(),
      }),
      skills: z.array(z.object({
        category: z.string(),
        skills: z.array(z.string()),
      })),
      experience: z.array(z.object({
        company: z.string(),
        role: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
        achievements: z.array(z.string()),
      })),
      education: z.array(z.object({
        institution: z.string(),
        degree: z.string(),
        gpa: z.string().optional(),
      })),
    }).describe('CV data to push'),
  },
  async ({ stitchUrl, cvData }) => {
    try {
      const response = await fetch(`${stitchUrl}/api/v1/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformCVToStitch(cvData)),
      })
      
      if (!response.ok) {
        throw new Error(`Stitch API error: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      return {
        content: [
          {
            type: 'text',
            text: `✓ Successfully pushed to Google Stitch. Context ID: ${result.contextId}`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error pushing to Stitch: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Transformation: Google Stitch → CV Format
function transformStitchToCV(stitchData: any): CVData {
  return {
    profile: {
      name: stitchData.profile?.fullName || stitchData.header?.name || '',
      title: stitchData.profile?.title || stitchData.header?.title || '',
      summary: stitchData.summary || stitchData.profile?.summary || '',
      location: stitchData.contact?.location || stitchData.profile?.location || '',
      phone: stitchData.contact?.phone || '',
      email: stitchData.contact?.email || '',
      portfolio: stitchData.contact?.portfolio || stitchData.links?.portfolio || '',
      github: stitchData.contact?.github || stitchData.links?.github || '',
      linkedin: stitchData.contact?.linkedin || stitchData.links?.linkedin || '',
      education: stitchData.education?.summary || '',
      languages: Array.isArray(stitchData.languages) 
        ? stitchData.languages.join(', ') 
        : stitchData.languages || '',
    },
    skills: Array.isArray(stitchData.skills) 
      ? stitchData.skills.map((cat: any) => ({
          category: cat.name || cat.category || 'Other',
          skills: Array.isArray(cat.skills) ? cat.skills : cat.items || [],
        }))
      : [],
    experience: Array.isArray(stitchData.experience)
      ? stitchData.experience.map((exp: any) => ({
          company: exp.company || exp.organization || '',
          role: exp.role || exp.position || '',
          startDate: exp.startDate || exp.start || '',
          endDate: exp.endDate || exp.end || '',
          achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
        }))
      : [],
    projects: Array.isArray(stitchData.projects)
      ? stitchData.projects.map((proj: any) => ({
          name: proj.name || proj.title || '',
          description: proj.description || '',
          highlights: Array.isArray(proj.highlights) ? proj.highlights : [],
        }))
      : [],
    education: Array.isArray(stitchData.education?.details)
      ? stitchData.education.details.map((edu: any) => ({
          institution: edu.institution || edu.school || '',
          degree: edu.degree || edu.field || '',
          gpa: edu.gpa || '',
        }))
      : [],
  }
}

// Transformation: CV Format → Google Stitch
function transformCVToStitch(cvData: CVData): any {
  return {
    profile: {
      fullName: cvData.profile.name,
      title: cvData.profile.title,
      summary: cvData.profile.summary,
      location: cvData.profile.location,
    },
    contact: {
      phone: cvData.profile.phone,
      email: cvData.profile.email,
      portfolio: cvData.profile.portfolio,
      github: cvData.profile.github,
      linkedin: cvData.profile.linkedin,
    },
    links: {
      portfolio: cvData.profile.portfolio,
      github: cvData.profile.github,
      linkedin: cvData.profile.linkedin,
    },
    summary: cvData.profile.summary,
    skills: cvData.skills.map((cat) => ({
      name: cat.category,
      skills: cat.skills,
      items: cat.skills,
    })),
    experience: cvData.experience.map((exp) => ({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate,
      achievements: exp.achievements,
    })),
    projects: cvData.projects.map((proj) => ({
      name: proj.name,
      description: proj.description,
      highlights: proj.highlights,
    })),
    education: {
      summary: cvData.profile.education,
      details: cvData.education.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        gpa: edu.gpa,
      })),
    },
    languages: cvData.profile.languages.split(', ').filter(Boolean),
  }
}

// Start the server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('[MCP Stitch Server] Running on stdio')
}

main().catch((error) => {
  console.error('[MCP Stitch Server] Fatal error:', error)
  process.exit(1)
})
