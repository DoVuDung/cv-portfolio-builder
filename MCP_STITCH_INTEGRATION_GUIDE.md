# MCP Integration Guide - Google Stitch UI Clone

## Overview

This guide explains how to integrate Model Context Protocol (MCP) to clone context from Google Stitch UI and connect it to the CV Portfolio Builder.

## Architecture

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│  Google Stitch  │ ──────▶ │   MCP Server │ ──────▶ │  CV Builder     │
│      UI         │         │   (Context)  │         │                 │
└─────────────────┘         └──────────────┘         └─────────────────┘
     Context Data              Clone & Transform          Render & Edit
```

## MCP Server Setup

### 1. Install Dependencies

```bash
npm install @modelcontextprotocol/sdk zod
```

### 2. Create MCP Server

File: `src/mcp/stitch-context-server.ts`

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

// Define CV schema matching your structure
const cvSchema = z.object({
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
    location: z.string().optional(),
    project: z.string().optional(),
    teamSize: z.string().optional(),
    techStack: z.string().optional(),
    achievements: z.array(z.string()),
  })),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    role: z.string().optional(),
    teamSize: z.string().optional(),
    techStack: z.array(z.string()).optional(),
    highlights: z.array(z.string()),
  })),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
  })),
})

export type CVData = z.infer<typeof cvSchema>

// Create MCP server
const server = new McpServer({
  name: 'stitch-context-server',
  version: '1.0.0',
})

// Tool: Import CV from Google Stitch UI
server.tool(
  'import-from-stitch',
  'Import CV data from Google Stitch UI context',
  {
    stitchUrl: z.string().describe('Google Stitch UI URL'),
    contextId: z.string().describe('Stitch context ID'),
  },
  async ({ stitchUrl, contextId }) => {
    try {
      // Fetch context from Google Stitch
      const response = await fetch(`${stitchUrl}/api/context/${contextId}`)
      const stitchData = await response.json()
      
      // Transform Stitch data to CV format
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
            text: `Error importing from Stitch: ${error}`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Export CV to Google Stitch
server.tool(
  'export-to-stitch',
  'Export CV data to Google Stitch UI',
  {
    stitchUrl: z.string().describe('Google Stitch UI URL'),
    cvData: cvSchema.describe('CV data to export'),
  },
  async ({ stitchUrl, cvData }) => {
    try {
      const response = await fetch(`${stitchUrl}/api/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformCVToStitch(cvData)),
      })
      
      const result = await response.json()
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully exported to Stitch. Context ID: ${result.contextId}`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error exporting to Stitch: ${error}`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Validate CV structure
server.tool(
  'validate-cv',
  'Validate CV data structure',
  {
    cvData: cvSchema.describe('CV data to validate'),
  },
  async ({ cvData }) => {
    try {
      const validated = cvSchema.parse(cvData)
      return {
        content: [
          {
            type: 'text',
            text: 'CV structure is valid ✓',
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Validation error: ${error}`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Transformation functions
function transformStitchToCV(stitchData: any): CVData {
  // Map Google Stitch UI data structure to CV format
  return {
    profile: {
      name: stitchData.header?.name || '',
      title: stitchData.header?.title || '',
      summary: stitchData.summary || '',
      location: stitchData.contact?.location || '',
      phone: stitchData.contact?.phone || '',
      email: stitchData.contact?.email || '',
      portfolio: stitchData.contact?.portfolio || '',
      github: stitchData.contact?.github || '',
      linkedin: stitchData.contact?.linkedin || '',
      education: stitchData.education?.info || '',
      languages: stitchData.languages?.join(', ') || '',
    },
    skills: stitchData.skills?.map((cat: any) => ({
      category: cat.name,
      skills: cat.items,
    })) || [],
    experience: stitchData.experience?.map((exp: any) => ({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate,
      location: exp.location,
      project: exp.project,
      teamSize: exp.teamSize,
      techStack: exp.techStack,
      achievements: exp.achievements,
    })) || [],
    projects: stitchData.projects?.map((proj: any) => ({
      name: proj.name,
      description: proj.description,
      role: proj.role,
      teamSize: proj.teamSize,
      techStack: proj.techStack,
      highlights: proj.highlights,
    })) || [],
    education: stitchData.education?.details?.map((edu: any) => ({
      institution: edu.institution,
      degree: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa,
    })) || [],
  }
}

function transformCVToStitch(cvData: CVData): any {
  // Map CV format back to Google Stitch UI structure
  return {
    header: {
      name: cvData.profile.name,
      title: cvData.profile.title,
    },
    contact: {
      location: cvData.profile.location,
      phone: cvData.profile.phone,
      email: cvData.profile.email,
      portfolio: cvData.profile.portfolio,
      github: cvData.profile.github,
      linkedin: cvData.profile.linkedin,
    },
    summary: cvData.profile.summary,
    skills: cvData.skills.map((cat) => ({
      name: cat.category,
      items: cat.skills,
    })),
    experience: cvData.experience.map((exp) => ({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate,
      location: exp.location,
      project: exp.project,
      teamSize: exp.teamSize,
      techStack: exp.techStack,
      achievements: exp.achievements,
    })),
    projects: cvData.projects.map((proj) => ({
      name: proj.name,
      description: proj.description,
      role: proj.role,
      teamSize: proj.teamSize,
      techStack: proj.techStack,
      highlights: proj.highlights,
    })),
    education: {
      info: cvData.profile.education,
      details: cvData.education.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        startDate: edu.startDate,
        endDate: edu.endDate,
        gpa: edu.gpa,
      })),
    },
    languages: cvData.profile.languages?.split(', ') || [],
  }
}

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('MCP Stitch Context Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
```

## Integration with CV Builder

### 3. Create MCP Client Hook

File: `src/hooks/useMCPStitch.ts`

```typescript
import { useState, useCallback } from 'react'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import type { CVData } from '../mcp/stitch-context-server'

export function useMCPStitch() {
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize MCP client
  const initializeClient = useCallback(async () => {
    try {
      const transport = new StdioClientTransport({
        command: 'node',
        args: ['./dist/mcp/stitch-context-server.js'],
      })
      
      const mcpClient = new Client({
        name: 'cv-builder-client',
        version: '1.0.0',
      })
      
      await mcpClient.connect(transport)
      setClient(mcpClient)
      setError(null)
    } catch (err) {
      setError(`Failed to initialize MCP: ${err}`)
    }
  }, [])

  // Import from Google Stitch
  const importFromStitch = useCallback(async (
    stitchUrl: string,
    contextId: string
  ): Promise<CVData | null> => {
    if (!client) {
      setError('MCP client not initialized')
      return null
    }

    try {
      setIsLoading(true)
      const result = await client.callTool({
        name: 'import-from-stitch',
        arguments: { stitchUrl, contextId },
      })
      
      const cvData = JSON.parse(result.content[0].text) as CVData
      setError(null)
      return cvData
    } catch (err) {
      setError(`Import failed: ${err}`)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [client])

  // Export to Google Stitch
  const exportToStitch = useCallback(async (
    stitchUrl: string,
    cvData: CVData
  ): Promise<boolean> => {
    if (!client) {
      setError('MCP client not initialized')
      return false
    }

    try {
      setIsLoading(true)
      await client.callTool({
        name: 'export-to-stitch',
        arguments: { stitchUrl, cvData },
      })
      setError(null)
      return true
    } catch (err) {
      setError(`Export failed: ${err}`)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [client])

  // Validate CV
  const validateCV = useCallback(async (cvData: CVData): Promise<boolean> => {
    if (!client) {
      setError('MCP client not initialized')
      return false
    }

    try {
      const result = await client.callTool({
        name: 'validate-cv',
        arguments: { cvData },
      })
      return !result.isError
    } catch (err) {
      setError(`Validation failed: ${err}`)
      return false
    }
  }, [client])

  return {
    client,
    isLoading,
    error,
    initializeClient,
    importFromStitch,
    exportToStitch,
    validateCV,
  }
}
```

## Usage in CV Builder

### 4. Add MCP Controls to CV Builder

Add these buttons to the CV Builder header:

```tsx
import { useMCPStitch } from '../hooks/useMCPStitch'

function CVBuilder() {
  const { 
    initializeClient, 
    importFromStitch, 
    exportToStitch,
    isLoading,
    error 
  } = useMCPStitch()

  const handleImportFromStitch = async () => {
    const stitchUrl = prompt('Enter Google Stitch URL:')
    const contextId = prompt('Enter Context ID:')
    
    if (stitchUrl && contextId) {
      const cvData = await importFromStitch(stitchUrl, contextId)
      if (cvData) {
        setCvData(cvData)
        alert('Successfully imported from Google Stitch!')
      }
    }
  }

  const handleExportToStitch = async () => {
    const stitchUrl = prompt('Enter Google Stitch URL:')
    if (stitchUrl) {
      const success = await exportToStitch(stitchUrl, cvData)
      if (success) {
        alert('Successfully exported to Google Stitch!')
      }
    }
  }

  return (
    <header>
      {/* Existing buttons */}
      <Button onClick={initializeClient} variant="outline">
        Connect MCP
      </Button>
      <Button onClick={handleImportFromStitch} disabled={!client || isLoading}>
        Import from Stitch
      </Button>
      <Button onClick={handleExportToStitch} disabled={!client || isLoading}>
        Export to Stitch
      </Button>
      
      {isLoading && <span>Loading...</span>}
      {error && <span className="text-red-500">{error}</span>}
    </header>
  )
}
```

## Configuration

### 5. Update package.json

Add build script for MCP server:

```json
{
  "scripts": {
    "build:mcp": "tsc -p tsconfig.mcp.json",
    "start:mcp": "node dist/mcp/stitch-context-server.js"
  }
}
```

### 6. Create tsconfig.mcp.json

```json
{
  "extends": "./tsconfig.json",
  "include": ["src/mcp/**/*"],
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist/mcp",
    "rootDir": "src/mcp"
  }
}
```

## Testing

### Manual Test Flow

1. **Start MCP Server**
   ```bash
   npm run build:mcp
   npm run start:mcp
   ```

2. **Open CV Builder**
   Navigate to `/cv-builder`

3. **Connect MCP**
   Click "Connect MCP" button

4. **Import from Stitch**
   - Click "Import from Stitch"
   - Enter your Google Stitch URL
   - Enter context ID
   - CV data should populate

5. **Export to Stitch**
   - Edit your CV
   - Click "Export to Stitch"
   - Enter Google Stitch URL
   - Confirm export

## Security Considerations

- Use environment variables for Stitch API keys
- Implement authentication for MCP server
- Validate all incoming data
- Rate limit requests
- Use HTTPS for production

## Troubleshooting

### Common Issues

1. **MCP Client Won't Connect**
   - Check server is running: `ps aux | grep mcp`
   - Verify stdio transport configuration
   - Check Node.js version compatibility

2. **Import Fails**
   - Verify Stitch URL is accessible
   - Check context ID exists
   - Review CORS settings

3. **Data Mapping Errors**
   - Compare Stitch data structure with transformation functions
   - Update `transformStitchToCV()` mapping logic
   - Check required fields in schema

## Next Steps

- [ ] Deploy MCP server to cloud (AWS Lambda / Vercel Functions)
- [ ] Add OAuth2 authentication for Google Stitch
- [ ] Implement real-time sync via webhooks
- [ ] Add caching layer for performance
- [ ] Create admin dashboard for monitoring

---

**Status**: Ready for Integration  
**Version**: 1.0.0  
**Last Updated**: March 20, 2026
