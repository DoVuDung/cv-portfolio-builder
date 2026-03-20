import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import type { CVData } from '../types/cv.types'

/**
 * MCP Design Viewer Server
 * Provides tools for viewing and analyzing CV design aspects
 * 
 * Features:
 * - View complete CV structure
 * - Analyze design patterns
 * - Check ATS compatibility
 * - Export design specifications
 * - Generate design documentation
 */

// Create MCP server
const server = new McpServer({
  name: 'cv-design-viewer',
  version: '1.0.0',
  description: 'View and analyze CV portfolio design',
})

// Schema for CV data validation
const cvProfileSchema = z.object({
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
})

const cvSkillSchema = z.object({
  category: z.string(),
  skills: z.array(z.string()),
})

const cvExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    teamSize: z.string(),
    techStack: z.string(),
    achievements: z.array(z.string()),
  })).optional(),
  achievements: z.array(z.string()).optional(),
})

const cvEducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  gpa: z.string().optional(),
})

const cvDataSchema = z.object({
  profile: cvProfileSchema,
  skills: z.array(cvSkillSchema),
  experience: z.array(cvExperienceSchema),
  education: z.array(cvEducationSchema),
})

// Tool: View Complete CV Design
server.tool(
  'view-cv-design',
  'View complete CV design structure with formatting and layout analysis',
  {},
  async () => {
    try {
      // Load current CV data from localStorage (simulated)
      const cvData = await loadCurrentCV()
      
      const designAnalysis = {
        structure: {
          sections: Object.keys(cvData),
          totalSections: Object.keys(cvData).length,
          hasProfile: !!cvData.profile,
          hasSkills: cvData.skills?.length > 0,
          hasExperience: cvData.experience?.length > 0,
          hasEducation: cvData.education?.length > 0,
        },
        content: {
          profileCompleteness: calculateProfileCompleteness(cvData.profile),
          skillCount: cvData.skills?.reduce((acc, cat) => acc + cat.skills.length, 0) || 0,
          experienceCount: cvData.experience?.length || 0,
          educationCount: cvData.education?.length || 0,
          totalAchievements: countTotalAchievements(cvData),
        },
        design: {
          template: 'Modern Professional',
          colorScheme: 'Blue Gradient',
          fontFamily: 'System UI',
          layout: 'Two-column responsive',
        },
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: '✓ CV Design Analysis Complete',
              data: cvData,
              analysis: designAnalysis,
            }, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error viewing CV design: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Analyze ATS Design Compatibility
server.tool(
  'analyze-ats-design',
  'Analyze CV design for ATS (Applicant Tracking System) compatibility',
  {},
  async () => {
    try {
      const cvData = await loadCurrentCV()
      
      const atsAnalysis = {
        score: calculateATSScore(cvData),
        strengths: [] as string[],
        weaknesses: [] as string[],
        recommendations: [] as string[],
        formatting: {
          isReadable: true,
          hasClearSections: true,
          usesStandardFonts: true,
          noImages: true,
          simpleFormatting: true,
        },
        keywords: extractKeywords(cvData),
      }
      
      // Check strengths
      if (cvData.profile?.email) atsAnalysis.strengths.push('✓ Email address present')
      if (cvData.profile?.phone) atsAnalysis.strengths.push('✓ Phone number present')
      if (cvData.profile?.linkedin) atsAnalysis.strengths.push('✓ LinkedIn profile included')
      if (cvData.profile?.summary && cvData.profile.summary.length > 100) {
        atsAnalysis.strengths.push('✓ Comprehensive professional summary')
      }
      if (cvData.skills?.length > 0) atsAnalysis.strengths.push('✓ Skills section present')
      if (cvData.experience?.length > 0) atsAnalysis.strengths.push('✓ Work experience documented')
      
      // Check weaknesses
      if (!cvData.profile?.email) atsAnalysis.weaknesses.push('✗ Missing email address')
      if (!cvData.profile?.phone) atsAnalysis.weaknesses.push('✗ Missing phone number')
      if (!cvData.profile?.linkedin) atsAnalysis.weaknesses.push('✗ Missing LinkedIn profile')
      if (!cvData.profile?.summary || cvData.profile.summary.length < 100) {
        atsAnalysis.weaknesses.push('✗ Summary too short (< 100 characters)')
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: '✓ ATS Design Analysis Complete',
              analysis: atsAnalysis,
            }, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing ATS design: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Export Design Specification
server.tool(
  'export-design-spec',
  'Export complete CV design specification as JSON or Markdown',
  {
    format: z.enum(['json', 'markdown']).describe('Export format'),
  },
  async ({ format }) => {
    try {
      const cvData = await loadCurrentCV()
      
      let exportContent = ''
      
      if (format === 'json') {
        exportContent = JSON.stringify(cvData, null, 2)
      } else if (format === 'markdown') {
        exportContent = generateMarkdownSpec(cvData)
      }
      
      return {
        content: [
          {
            type: 'text',
            text: exportContent,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error exporting design spec: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Compare Design Versions
server.tool(
  'compare-design-versions',
  'Compare current CV design with a previous version',
  {
    previousCV: z.string().describe('Previous CV data as JSON string'),
  },
  async ({ previousCV }) => {
    try {
      const currentCV = await loadCurrentCV()
      const previous = JSON.parse(previousCV) as CVData
      
      const comparison = {
        profile: {
          changed: currentCV.profile.name !== previous.profile?.name,
          improvements: [] as string[],
        },
        skills: {
          added: [] as string[],
          removed: [] as string[],
          totalCountChange: (currentCV.skills?.reduce((acc, cat) => acc + cat.skills.length, 0) || 0) - 
                            (previous.skills?.reduce((acc, cat) => acc + cat.skills.length, 0) || 0),
        },
        experience: {
          added: currentCV.experience?.length - (previous.experience?.length || 0),
          achievementsAdded: countTotalAchievements(currentCV) - countTotalAchievements(previous),
        },
        overallImprovement: calculateImprovement(currentCV, previous),
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: '✓ Design Version Comparison Complete',
              comparison,
            }, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error comparing versions: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Generate Design Documentation
server.tool(
  'generate-design-docs',
  'Generate comprehensive design documentation',
  {},
  async () => {
    try {
      const cvData = await loadCurrentCV()
      
      const docs = {
        overview: {
          purpose: 'Professional CV/Portfolio showcasing frontend engineering expertise',
          targetAudience: 'Recruiters, hiring managers, tech companies',
          designPhilosophy: 'Clean, modern, ATS-friendly, responsive',
        },
        structure: {
          components: [
            'Header with gradient background',
            'Profile section with contact info',
            'Skills categorized by domain',
            'Experience with achievements',
            'Education section',
            'Live preview panel',
            'ATS analysis modal',
          ],
          layout: 'Two-panel responsive design',
          navigation: 'Tab-based section switching',
        },
        styling: {
          framework: 'Tailwind CSS',
          colorPalette: {
            primary: 'Blue gradient (#2563EB → #1D4ED8)',
            background: 'Light gray gradient',
            accent: 'Purple/pink for ATS features',
          },
          typography: 'System UI fonts',
          spacing: 'Consistent 4px grid',
        },
        features: {
          editing: 'Toggle edit/view modes',
          livePreview: 'Real-time updates',
          atsOptimization: 'Built-in ATS scoring',
          keywordMatching: 'Job description analysis',
          saveFunctionality: 'LocalStorage persistence',
        },
        technical: {
          framework: 'React 19',
          language: 'TypeScript',
          stateManagement: 'React useState',
          storage: 'Browser localStorage',
          buildTool: 'Vite',
        },
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: '✓ Design Documentation Generated',
              documentation: docs,
            }, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error generating design docs: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Helper Functions
async function loadCurrentCV(): Promise<CVData> {
  // This would normally load from localStorage or API
  // For MCP context, we'll return a sample structure
  return {
    profile: {
      name: 'Dung Do (Andy)',
      title: 'Frontend Engineer (React / Next.js / SaaS Systems / Landing Page)',
      summary: 'Frontend Engineer with 4+ years of experience...',
      location: 'Da Nang, Vietnam',
      phone: '+84 795 461 796',
      email: 'vudung05032000@gmail.com',
      portfolio: 'https://dungdo.site',
      github: 'https://github.com/DoVuDung',
      linkedin: 'https://linkedin.com/in/andydoo',
      education: 'Duy Tan University (GPA: 3.37/4), Bachelor Degree Information Technology',
      languages: 'Vietnamese (Native), English (Working Proficiency)',
    },
    skills: [
      { category: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'Redux', 'Zustand'] },
      { category: 'UI Systems', skills: ['Ant Design', 'Material UI', 'ShadCN UI'] },
      { category: 'Backend & APIs', skills: ['Node.js', 'NestJS', 'ASP.NET', 'REST APIs', 'GraphQL'] },
      { category: 'Database', skills: ['PostgreSQL', 'Prisma'] },
      { category: 'DevOps & Tools', skills: ['AWS', 'CI/CD', 'GitHub Actions', 'Docker', 'Git'] },
    ],
    experience: [
      {
        company: 'AvePoint',
        role: 'Frontend Developer',
        startDate: 'Oct 2025',
        endDate: 'Present',
        location: 'Da Nang, Vietnam',
        projects: [
          {
            name: 'Student Finance Platform',
            description: 'Singapore government education SaaS',
            teamSize: '80-100 engineers',
            techStack: 'React 19, TypeScript, Vite, Ant Design, Zustand',
            achievements: [
              'Built scalable UI using React + TypeScript',
              'Developed financial dashboards and payment forms',
              'Designed reusable components',
              'Optimized performance',
            ],
          },
        ],
      },
    ],
    education: [
      {
        institution: 'Duy Tan University',
        degree: 'Bachelor Degree Information Technology',
        gpa: '3.37/4',
      },
    ],
  }
}

function calculateProfileCompleteness(profile: any): number {
  const fields = ['name', 'title', 'summary', 'location', 'phone', 'email', 'portfolio', 'github', 'linkedin']
  const filledFields = fields.filter(field => profile?.[field])
  return Math.round((filledFields.length / fields.length) * 100)
}

function countTotalAchievements(cvData: CVData): number {
  return cvData.experience?.reduce((total, exp) => {
    const projectAchievements = exp.projects?.reduce((sum, proj) => sum + (proj.achievements?.length || 0), 0) || 0
    const expAchievements = exp.achievements?.length || 0
    return total + projectAchievements + expAchievements
  }, 0) || 0
}

function calculateATSScore(cvData: CVData): number {
  let score = 0
  
  // Contact info (15 points)
  if (cvData.profile?.email) score += 5
  if (cvData.profile?.phone) score += 5
  if (cvData.profile?.linkedin) score += 5
  
  // Summary (15 points)
  if (cvData.profile?.summary && cvData.profile.summary.length > 100) score += 15
  
  // Skills (20 points)
  const totalSkills = cvData.skills?.reduce((acc, cat) => acc + cat.skills.length, 0) || 0
  if (totalSkills >= 10) score += 20
  else if (totalSkills >= 5) score += 15
  else score += 10
  
  // Experience (25 points)
  const totalAchievements = countTotalAchievements(cvData)
  if (cvData.experience?.length >= 3 && totalAchievements >= 15) score += 25
  else if (cvData.experience?.length >= 2 && totalAchievements >= 8) score += 20
  else if (cvData.experience?.length >= 1) score += 15
  
  // Education (10 points)
  if (cvData.education?.length > 0) score += 10
  
  // Readability (15 points)
  if (cvData.profile?.name && cvData.profile?.title && cvData.profile?.summary) score += 15
  
  return Math.min(score, 100)
}

function extractKeywords(cvData: CVData): string[] {
  const keywords = new Set<string>()
  
  // Extract from summary
  const summaryKeywords = ['React', 'Next.js', 'TypeScript', 'frontend', 'engineer', 'developer', 'experience']
  summaryKeywords.forEach(keyword => {
    if (cvData.profile?.summary.toLowerCase().includes(keyword.toLowerCase())) {
      keywords.add(keyword)
    }
  })
  
  // Extract from skills
  cvData.skills?.forEach(cat => {
    cat.skills.forEach(skill => keywords.add(skill))
  })
  
  return Array.from(keywords)
}

function generateMarkdownSpec(cvData: CVData): string {
  return `# CV Design Specification

## Profile
- **Name:** ${cvData.profile.name}
- **Title:** ${cvData.profile.title}
- **Location:** ${cvData.profile.location}
- **Email:** ${cvData.profile.email}
- **Phone:** ${cvData.profile.phone}

## Summary
${cvData.profile.summary}

## Skills
${cvData.skills.map(cat => `- **${cat.category}:** ${cat.skills.join(', ')}`).join('\n')}

## Experience
${cvData.experience.map(exp => `### ${exp.role} at ${exp.company}
${exp.startDate} - ${exp.endDate}
`).join('\n')}

## Education
${cvData.education.map(edu => `- **${edu.degree}** from ${edu.institution}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}`).join('\n')}

---
Generated by MCP Design Viewer
`.trim()
}

function calculateImprovement(current: CVData, previous: CVData): string {
  const currentScore = calculateATSScore(current)
  const previousScore = calculateATSScore(previous)
  
  if (currentScore > previousScore) {
    return `Improved by ${currentScore - previousScore} points`
  } else if (currentScore < previousScore) {
    return `Decreased by ${previousScore - currentScore} points`
  }
  return 'No change'
}

// Start the server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('[MCP Design Viewer] Running on stdio')
}

main().catch((error) => {
  console.error('[MCP Design Viewer] Fatal error:', error)
  process.exit(1)
})
