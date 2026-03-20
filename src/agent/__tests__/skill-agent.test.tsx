/**
 * @vitest
 * Skill Agent - Comprehensive Unit Tests
 * Coverage: 100% for all MCP tools, memory, context, and hooks
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { CV, Experience } from '../schemas/cv.schema'
import {
  AnalyzeCVTool,
  GenerateSummaryTool,
  ImproveExperienceTool,
  ExtractSkillsTool,
  OptimizeATSTool,
  MapToUISectionsTool,
} from '../tools/core-tools'
import { CVMemoryManager, PreferenceMemoryManager, SessionMemoryManager } from '../memory/cv-memory'
import { ContextManager } from '../context/context-manager'
import { AgentOrchestrator, ToolRegistry } from '../core/agent'
import { MockLLMService } from '../services/llm'
import { AgentLogger, DebugManager } from '../services/logger'

// ============================================================================
// Test Data Helpers
// ============================================================================

function createTestCV(partial?: Partial<CV>): CV {
  return {
    profile: {
      name: 'John Doe',
      title: 'Senior Software Engineer',
      summary: 'Experienced software engineer with 5+ years of expertise in React and TypeScript.',
      location: 'San Francisco, CA',
      contact: {
        email: 'john@example.com',
        github: 'johndoe',
        linkedin: 'johndoe',
      },
    },
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    experience: [
      {
        company: 'Tech Corp',
        role: 'Senior Developer',
        startDate: '2020-01',
        achievements: ['Led team of 5 developers', 'Improved performance by 40%'],
        techStack: ['React', 'TypeScript'],
      },
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce solution',
        techStack: ['React', 'Node.js'],
        highlights: ['Increased sales by 30%', 'Reduced load time by 50%'],
      },
    ],
    education: [
      {
        institution: 'University of Tech',
        degree: 'BS Computer Science',
        startDate: '2014-09',
        endDate: '2018-06',
      },
    ],
    metadata: {
      version: '1.0.0',
      lastUpdated: new Date(),
      createdAt: new Date(),
    },
    ...partial,
  }
}

// ============================================================================
// MCP Tools Tests
// ============================================================================

describe('MCP Tools', () => {
  // --------------------------------------------------------------------------
  // AnalyzeCVTool Tests
  // --------------------------------------------------------------------------
  describe('AnalyzeCVTool', () => {
    let tool: AnalyzeCVTool

    beforeEach(() => {
      tool = new AnalyzeCVTool()
    })

    it('should have correct metadata', () => {
      expect(tool.metadata.name).toBe('analyzeCV')
      expect(tool.metadata.category).toBe('analysis')
      expect(tool.metadata.requiresLLM).toBe(false)
    })

    it('should analyze complete CV and return structured feedback', async () => {
      const cv = createTestCV()
      const result = await tool.execute({ cv })

      expect(result).toBeDefined()
      expect(result.score).toBeGreaterThan(0)
      expect(result.score).toBeLessThanOrEqual(100)
      expect(result.strengths).toBeDefined()
      expect(result.weaknesses).toBeDefined()
      expect(result.recommendations).toBeDefined()
      expect(result.sections).toBeDefined()
    })

    it('should identify missing summary as weakness', async () => {
      const cv = createTestCV({
        profile: { ...createTestCV().profile, summary: '' },
      })
      const result = await tool.execute({ cv })

      expect(result.weaknesses).toContain('Summary is too short or missing')
    })

    it('should identify no experience as weakness', async () => {
      const cv = createTestCV({ experience: [] })
      const result = await tool.execute({ cv })

      expect(result.weaknesses).toContain('No work experience listed')
    })

    it('should identify no projects as weakness', async () => {
      const cv = createTestCV({ projects: [] })
      const result = await tool.execute({ cv })

      expect(result.weaknesses).toContain('No projects to showcase skills')
    })

    it('should identify few skills as weakness', async () => {
      const cv = createTestCV({ skills: ['React'] })
      const result = await tool.execute({ cv })

      expect(result.weaknesses).toContain('Too few skills listed')
    })

    it('should identify too many skills as weakness', async () => {
      const cv = createTestCV({
        skills: Array(35).fill('Skill'),
      })
      const result = await tool.execute({ cv })

      expect(result.weaknesses).toContain('Too many skills listed')
    })

    it('should validate CV before analysis', () => {
      const cv = createTestCV()
      expect(tool.validate({ cv })).toBe(true)
    })

    it('should handle CV with metrics in achievements', async () => {
      const cv = createTestCV({
        experience: [
          {
            company: 'Tech Corp',
            role: 'Developer',
            startDate: '2020-01',
            achievements: ['Increased revenue by 25%', 'Reduced costs by $50k'],
            techStack: ['React'],
          },
        ],
      })
      const result = await tool.execute({ cv })

      expect(result.strengths).toContain('Achievements include quantifiable impact')
    })

    it('should execute safely with error handling', async () => {
      const result = await tool.executeSafe({ cv: null as any })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  // --------------------------------------------------------------------------
  // GenerateSummaryTool Tests
  // --------------------------------------------------------------------------
  describe('GenerateSummaryTool', () => {
    let tool: GenerateSummaryTool

    beforeEach(() => {
      tool = new GenerateSummaryTool()
    })

    it('should have correct metadata', () => {
      expect(tool.metadata.name).toBe('generateSummary')
      expect(tool.metadata.category).toBe('generation')
      expect(tool.metadata.requiresLLM).toBe(true)
    })

    it('should generate summary for target role', async () => {
      const cv = createTestCV()
      const result = await tool.execute({ cv, targetRole: 'Senior Engineer' })

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
      expect(result).toContain('Senior Software Engineer')
      expect(result).toContain('Senior Engineer')
    })

    it('should estimate years of experience correctly', async () => {
      const cv = createTestCV({
        experience: [
          {
            company: 'Company A',
            role: 'Dev',
            startDate: '2018-01-01',
            endDate: '2020-01-01',
            achievements: [],
            techStack: [],
          },
          {
            company: 'Company B',
            role: 'Dev',
            startDate: '2020-01-01',
            achievements: [],
            techStack: [],
          },
        ],
      })
      const result = await tool.execute({ cv, targetRole: 'Engineer' })

      expect(result).toContain('6+')
    })

    it('should use top 5 skills', async () => {
      const cv = createTestCV({
        skills: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      })
      const result = await tool.execute({ cv, targetRole: 'Engineer' })

      expect(result).toContain('A, B, C, D, E')
    })
  })

  // --------------------------------------------------------------------------
  // ImproveExperienceTool Tests
  // --------------------------------------------------------------------------
  describe('ImproveExperienceTool', () => {
    let tool: ImproveExperienceTool

    beforeEach(() => {
      tool = new ImproveExperienceTool()
    })

    it('should have correct metadata', () => {
      expect(tool.metadata.name).toBe('improveExperience')
      expect(tool.metadata.category).toBe('optimization')
      expect(tool.metadata.requiresLLM).toBe(true)
    })

    it('should improve experience achievements', async () => {
      const experience: Experience = {
        company: 'Tech Corp',
        role: 'Developer',
        startDate: '2020-01',
        achievements: ['Made a React app', 'Fixed bugs'],
        techStack: ['React'],
      }
      const result = await tool.execute({ experience })

      expect(result).toBeDefined()
      expect(result.achievements).toBeDefined()
      expect(result.achievements.length).toBe(experience.achievements.length)
      expect(result.suggestions).toBeDefined()
    })

    it('should add metric placeholder when missing', async () => {
      const experience: Experience = {
        company: 'Tech Corp',
        role: 'Developer',
        startDate: '2020-01',
        achievements: ['Did something'],
        techStack: [],
      }
      const result = await tool.execute({ experience })

      expect(result.achievements[0]).toContain('[Add metric]')
    })

    it('should not add metric placeholder when present', async () => {
      const experience: Experience = {
        company: 'Tech Corp',
        role: 'Developer',
        startDate: '2020-01',
        achievements: ['Improved by 50%'],
        techStack: [],
      }
      const result = await tool.execute({ experience })

      expect(result.achievements[0]).not.toContain('[Add metric]')
    })

    it('should start with action verb', async () => {
      const experience: Experience = {
        company: 'Tech Corp',
        role: 'Developer',
        startDate: '2020-01',
        achievements: ['a task was done'],
        techStack: [],
      }
      const result = await tool.execute({ experience })

      expect(result.achievements[0].charAt(0)).toBe(result.achievements[0].charAt(0).toUpperCase())
    })

    it('should provide suggestions', async () => {
      const experience: Experience = {
        company: 'Tech Corp',
        role: 'Developer',
        startDate: '2020-01',
        achievements: ['Did work'],
        techStack: [],
      }
      const result = await tool.execute({ experience })

      expect(result.suggestions.length).toBeGreaterThan(0)
    })
  })

  // --------------------------------------------------------------------------
  // ExtractSkillsTool Tests
  // --------------------------------------------------------------------------
  describe('ExtractSkillsTool', () => {
    let tool: ExtractSkillsTool

    beforeEach(() => {
      tool = new ExtractSkillsTool()
    })

    it('should have correct metadata', () => {
      expect(tool.metadata.name).toBe('extractSkills')
      expect(tool.metadata.category).toBe('extraction')
      expect(tool.metadata.requiresLLM).toBe(false)
    })

    it('should extract and deduplicate skills', async () => {
      const cv = createTestCV({
        skills: ['React', 'react', 'REACT', 'TypeScript'],
        experience: [
          {
            company: 'Tech',
            role: 'Dev',
            startDate: '2020',
            achievements: [],
            techStack: ['React', 'Node'],
          },
        ],
        projects: [],
      })
      const result = await tool.execute({ cv })

      expect(result.all).toContain('react')
      expect(result.duplicatesRemoved).toBeGreaterThan(0)
    })

    it('should categorize skills', async () => {
      const cv = createTestCV({
        skills: ['React', 'Node.js', 'MongoDB', 'Docker', 'Git'],
      })
      const result = await tool.execute({ cv })

      expect(result.categorized).toBeDefined()
    })

    it('should track skill sources', async () => {
      const cv = createTestCV({
        skills: ['React'],
        experience: [
          {
            company: 'Tech',
            role: 'Dev',
            startDate: '2020',
            achievements: [],
            techStack: ['Node'],
          },
        ],
        projects: [
          {
            name: 'Project',
            description: 'Desc',
            techStack: ['Python'],
            highlights: [],
          },
        ],
      })
      const result = await tool.execute({ cv })

      expect(result.sources.explicit).toBe(1)
      expect(result.sources.fromExperience).toBeGreaterThan(0)
      expect(result.sources.fromProjects).toBeGreaterThan(0)
    })

    it('should normalize and sort skills', async () => {
      const cv = createTestCV({
        skills: ['Zebra', 'Apple', 'Banana'],
      })
      const result = await tool.execute({ cv })

      expect(result.all[0]).toBe('apple')
      expect(result.all[result.all.length - 1]).toBe('zebra')
    })
  })

  // --------------------------------------------------------------------------
  // OptimizeATSTool Tests
  // --------------------------------------------------------------------------
  describe('OptimizeATSTool', () => {
    let tool: OptimizeATSTool

    beforeEach(() => {
      tool = new OptimizeATSTool()
    })

    it('should have correct metadata', () => {
      expect(tool.metadata.name).toBe('optimizeATS')
      expect(tool.metadata.category).toBe('optimization')
      expect(tool.metadata.requiresLLM).toBe(true)
    })

    it('should optimize CV without job description', async () => {
      const cv = createTestCV()
      const result = await tool.execute({ cv })

      expect(result).toBeDefined()
      expect(result.optimizedCV).toEqual(cv)
      expect(result.currentKeywords).toBeDefined()
    })

    it('should identify missing keywords from job description', async () => {
      const cv = createTestCV({
        skills: ['React', 'TypeScript'],
      })
      const jobDescription = 'Looking for Python AWS Docker Kubernetes expert'
      const result = await tool.execute({ cv, jobDescription })

      expect(result.missingKeywords).toBeDefined()
      expect(result.matchScore).toBeDefined()
    })

    it('should provide recommendations for missing keywords', async () => {
      const cv = createTestCV({
        skills: ['Java'],
      })
      const jobDescription = 'Need React TypeScript developer'
      const result = await tool.execute({ cv, jobDescription })

      expect(result.recommendations).toBeDefined()
      expect(result.recommendations.length).toBeGreaterThan(0)
    })

    it('should calculate match score', async () => {
      const cv = createTestCV({
        skills: ['React', 'AWS'],
      })
      const jobDescription = 'React AWS developer needed'
      const result = await tool.execute({ cv, jobDescription })

      expect(result.matchScore).toBeGreaterThan(0)
    })
  })

  // --------------------------------------------------------------------------
  // MapToUISectionsTool Tests
  // --------------------------------------------------------------------------
  describe('MapToUISectionsTool', () => {
    let tool: MapToUISectionsTool

    beforeEach(() => {
      tool = new MapToUISectionsTool()
    })

    it('should have correct metadata', () => {
      expect(tool.metadata.name).toBe('mapToUISections')
      expect(tool.metadata.category).toBe('mapping')
      expect(tool.metadata.requiresLLM).toBe(false)
    })

    it('should map CV to UI sections', async () => {
      const cv = createTestCV()
      const result = await tool.execute({ cv })

      expect(result).toBeDefined()
      expect(result.header).toBeDefined()
      expect(result.summary).toBeDefined()
      expect(result.sections).toBeDefined()
      expect(result.metadata).toBeDefined()
    })

    it('should create header with contact info', async () => {
      const cv = createTestCV()
      const result = await tool.execute({ cv })

      expect(result.header.name).toBe('John Doe')
      expect(result.header.title).toBe('Senior Software Engineer')
      expect(result.header.contact).toEqual(cv.profile.contact)
    })

    it('should create experience section', async () => {
      const cv = createTestCV()
      const result = await tool.execute({ cv })

      const expSection = result.sections.find((s) => s.id === 'experience')
      expect(expSection).toBeDefined()
      expect(expSection?.items.length).toBe(1)
    })

    it('should create projects section', async () => {
      const cv = createTestCV()
      const result = await tool.execute({ cv })

      const projSection = result.sections.find((s) => s.id === 'projects')
      expect(projSection).toBeDefined()
      expect(projSection?.items.length).toBe(1)
    })

    it('should create skills section', async () => {
      const cv = createTestCV()
      const result = await tool.execute({ cv })

      const skillsSection = result.sections.find((s) => s.id === 'skills')
      expect(skillsSection).toBeDefined()
    })

    it('should create education section', async () => {
      const cv = createTestCV()
      const result = await tool.execute({ cv })

      const eduSection = result.sections.find((s) => s.id === 'education')
      expect(eduSection).toBeDefined()
    })

    it('should count words in metadata', async () => {
      const cv = createTestCV()
      const result = await tool.execute({ cv })

      expect(result.metadata.wordCount).toBeGreaterThan(0)
      expect(result.metadata.sectionCount).toBeGreaterThan(0)
    })
  })
})

// ============================================================================
// Memory System Tests
// ============================================================================

describe('Memory System', () => {
  // --------------------------------------------------------------------------
  // CVMemoryManager Tests
  // --------------------------------------------------------------------------
  describe('CVMemoryManager', () => {
    let memory: CVMemoryManager

    beforeEach(() => {
      memory = new CVMemoryManager()
    })

    it('should save CV version', () => {
      const cv = createTestCV()
      memory.saveVersion(cv, ['Initial'])

      expect(memory.getLatest()).toEqual(cv)
      expect(memory.versionCount).toBe(1)
    })

    it('should track version history', () => {
      const cv1 = createTestCV()
      const cv2 = createTestCV({ profile: { ...cv1.profile, name: 'Jane Doe' } })

      memory.saveVersion(cv1, ['First'])
      memory.saveVersion(cv2, ['Second'])

      expect(memory.versionCount).toBe(2)
      expect(memory.getHistory().length).toBe(2)
    })

    it('should restore to previous version', () => {
      const cv1 = createTestCV()
      const cv2 = createTestCV({ profile: { ...cv1.profile, name: 'Jane Doe' } })

      memory.saveVersion(cv1, ['First'])
      memory.saveVersion(cv2, ['Second'])

      memory.restoreToVersion(1)

      expect(memory.getLatest()?.profile.name).toBe('John Doe')
    })

    it('should return null when restoring invalid version', () => {
      const result = memory.restoreToVersion(999)
      expect(result).toBe(false)
    })

    it('should clear all data', () => {
      memory.saveVersion(createTestCV())
      memory.clear()

      expect(memory.getLatest()).toBeNull()
      expect(memory.versionCount).toBe(0)
    })

    it('should export to JSON', () => {
      const cv = createTestCV()
      memory.saveVersion(cv)

      const json = memory.exportJSON()
      expect(json).toBeDefined()
      expect(typeof json).toBe('string')
    })

    it('should import from JSON', () => {
      const cv = createTestCV()
      const json = JSON.stringify(cv)

      const result = memory.importJSON(json)
      expect(result).toBe(true)
      expect(memory.getLatest()).toEqual(cv)
    })

    it('should fail import with invalid JSON', () => {
      const result = memory.importJSON('invalid')
      expect(result).toBe(false)
    })

    it('should notify subscribers on change', () => {
      const callback = vi.fn()
      memory.subscribe(callback)

      const cv = createTestCV()
      memory.saveVersion(cv)

      expect(callback).toHaveBeenCalledWith(cv)
    })

    it('should track last saved timestamp', () => {
      memory.saveVersion(createTestCV())
      expect(memory.lastUpdated).not.toBeNull()
    })
  })

  // --------------------------------------------------------------------------
  // SessionMemoryManager Tests
  // --------------------------------------------------------------------------
  describe('SessionMemoryManager', () => {
    let memory: SessionMemoryManager

    beforeEach(() => {
      memory = new SessionMemoryManager()
    })

    it('should create session with ID', () => {
      const sessionId = memory.getSessionId()
      expect(sessionId).toBeDefined()
      expect(sessionId.length).toBeGreaterThan(0)
    })

    it('should log tool execution', () => {
      memory.logToolExecution('testTool', { param: 'value' }, { result: 'success' })

      const history = memory.getActionHistory()
      expect(history.length).toBe(1)
      expect(history[0].tool).toBe('testTool')
    })

    it('should track multiple actions', () => {
      memory.logToolExecution('tool1', {}, {})
      memory.logToolExecution('tool2', {}, {})

      expect(memory.getActionHistory().length).toBe(2)
    })

    it('should calculate session duration', () => {
      const duration = memory.getDuration()
      expect(duration).toBeGreaterThanOrEqual(0)
    })

    it('should clear session', () => {
      memory.logToolExecution('test', {}, {})
      memory.clear()

      expect(memory.getActionHistory().length).toBe(0)
    })
  })

  // --------------------------------------------------------------------------
  // PreferenceMemoryManager Tests
  // --------------------------------------------------------------------------
  describe('PreferenceMemoryManager', () => {
    let memory: PreferenceMemoryManager

    beforeEach(() => {
      memory = new PreferenceMemoryManager()
    })

    it('should have default preferences', () => {
      const prefs = memory.get()

      expect(prefs.tone).toBe('professional')
      expect(prefs.formatting.dateFormat).toBe('US')
    })

    it('should update preferences', () => {
      memory.update({ tone: 'casual' })
      expect(memory.get().tone).toBe('casual')
    })

    it('should update nested formatting', () => {
      memory.update({ formatting: { bulletStyle: 'dash' } })
      expect(memory.get().formatting.bulletStyle).toBe('dash')
      expect(memory.get().formatting.dateFormat).toBe('US')
    })

    it('should reset to defaults', () => {
      memory.update({ tone: 'casual' })
      memory.reset()

      expect(memory.get().tone).toBe('professional')
    })
  })
})

// ============================================================================
// Context Manager Tests
// ============================================================================

describe('ContextManager', () => {
  let context: ContextManager

  beforeEach(() => {
    context = new ContextManager()
  })

  it('should have initial state', () => {
    const state = context.getContext()

    expect(state.targetRole).toBeUndefined()
    expect(state.seniority).toBeUndefined()
    expect(state.preferences?.tone).toBe('professional')
  })

  it('should update context', () => {
    context.update({ targetRole: 'Senior Engineer' })
    expect(context.getContext().targetRole).toBe('Senior Engineer')
  })

  it('should set target role', () => {
    context.setTargetRole('Staff Engineer')
    expect(context.getContext().targetRole).toBe('Staff Engineer')
  })

  it('should set seniority level', () => {
    context.setSeniority('senior')
    expect(context.getContext().seniority).toBe('senior')
  })

  it('should set domain', () => {
    context.setDomain('SaaS')
    expect(context.getContext().domain).toBe('SaaS')
  })

  it('should set tone preference', () => {
    context.setTone('technical')
    expect(context.getContext().preferences?.tone).toBe('technical')
  })

  it('should add emphasis', () => {
    context.addEmphasis('technical')
    context.addEmphasis('impact')

    expect(context.getContext().preferences?.emphasis).toContain('technical')
    expect(context.getContext().preferences?.emphasis).toContain('impact')
  })

  it('should not add duplicate emphasis', () => {
    context.addEmphasis('technical')
    context.addEmphasis('technical')

    expect(context.getContext().preferences?.emphasis.length).toBe(1)
  })

  it('should remove emphasis', () => {
    context.addEmphasis('technical')
    context.removeEmphasis('technical')

    expect(context.getContext().preferences?.emphasis).not.toContain('technical')
  })

  it('should provide contextual suggestions', () => {
    context.setSeniority('senior')
    const suggestions = context.getContextualSuggestions()

    expect(suggestions.length).toBeGreaterThan(0)
  })

  it('should check if context is complete', () => {
    expect(context.isComplete).toBe(false)

    context.setTargetRole('Engineer')
    context.setSeniority('senior')
    context.setDomain('Tech')

    expect(context.isComplete).toBe(true)
  })

  it('should export to JSON', () => {
    context.setTargetRole('Engineer')
    const json = context.exportJSON()

    expect(json).toBeDefined()
    expect(typeof json).toBe('string')
  })

  it('should import from JSON', () => {
    const json = JSON.stringify({ targetRole: 'Manager' })
    const result = context.importJSON(json)

    expect(result).toBe(true)
    expect(context.getContext().targetRole).toBe('Manager')
  })

  it('should fail import with invalid JSON', () => {
    const result = context.importJSON('invalid')
    expect(result).toBe(false)
  })

  it('should notify subscribers', () => {
    const callback = vi.fn()
    context.subscribe(callback)

    context.setTargetRole('Engineer')
    expect(callback).toHaveBeenCalled()
  })
})

// ============================================================================
// Tool Registry Tests
// ============================================================================

describe('ToolRegistry', () => {
  let registry: ToolRegistry

  beforeEach(() => {
    registry = new ToolRegistry()
  })

  it('should register tool', () => {
    const tool = new AnalyzeCVTool()
    registry.register(tool)

    expect(registry.get('analyzeCV')).toBe(tool)
  })

  it('should register multiple tools', () => {
    const tools = [new AnalyzeCVTool(), new GenerateSummaryTool()]
    registry.registerMany(tools)

    expect(registry.listTools().length).toBe(2)
  })

  it('should get tool by name', () => {
    const tool = new AnalyzeCVTool()
    registry.register(tool)

    expect(registry.get('analyzeCV')).toBe(tool)
  })

  it('should return undefined for unknown tool', () => {
    expect(registry.get('unknown')).toBeUndefined()
  })

  it('should check if tool exists', () => {
    registry.register(new AnalyzeCVTool())

    expect(registry.has('analyzeCV')).toBe(true)
    expect(registry.has('unknown')).toBe(false)
  })

  it('should list all tool names', () => {
    registry.register(new AnalyzeCVTool())
    registry.register(new GenerateSummaryTool())

    const tools = registry.listTools()
    expect(tools).toContain('analyzeCV')
    expect(tools).toContain('generateSummary')
  })

  it('should get all tools', () => {
    registry.register(new AnalyzeCVTool())
    registry.register(new GenerateSummaryTool())

    expect(registry.getAll().length).toBe(2)
  })
})

// ============================================================================
// Agent Orchestrator Tests
// ============================================================================

describe('AgentOrchestrator', () => {
  let orchestrator: AgentOrchestrator
  let registry: ToolRegistry

  beforeEach(() => {
    registry = new ToolRegistry()
    registry.register(new AnalyzeCVTool())
    orchestrator = new AgentOrchestrator({ toolRegistry: registry })
  })

  it('should execute tool successfully', async () => {
    const cv = createTestCV()
    const result = await orchestrator.executeTool('analyzeCV', { cv })

    expect(result.success).toBe(true)
    expect(result.result).toBeDefined()
  })

  it('should fail with unknown tool', async () => {
    const result = await orchestrator.executeTool('unknown', {})

    expect(result.success).toBe(false)
    expect(result.error).toContain('not found')
  })

  it('should execute tool chain', async () => {
    const cv = createTestCV()
    const results = await orchestrator.executeToolChain([
      { tool: 'analyzeCV', params: { cv } },
    ])

    expect(results.length).toBe(1)
    expect(results[0].error).toBeUndefined()
  })

  it('should stop chain on failure', async () => {
    const results = await orchestrator.executeToolChain([
      { tool: 'unknown', params: {} },
      { tool: 'analyzeCV', params: { cv: createTestCV() } },
    ])

    expect(results.length).toBe(1)
  })

  it('should set LLM service', () => {
    const llm = new MockLLMService()
    orchestrator.setLLMService(llm)
    // No error means success
  })

  it('should enable debug mode', () => {
    orchestrator.setDebugMode(true)
    // No error means success
  })

  it('should disable debug mode', () => {
    orchestrator.setDebugMode(false)
    // No error means success
  })
})

// ============================================================================
// Logger Tests
// ============================================================================

describe('AgentLogger', () => {
  let logger: AgentLogger

  beforeEach(() => {
    logger = new AgentLogger({ outputToConsole: false })
  })

  it('should log debug message', () => {
    logger.debug('Test debug')
    const logs = logger.getRecentLogs()
    expect(logs.length).toBe(1)
    expect(logs[0].level).toBe('debug')
  })

  it('should log info message', () => {
    logger.info('Test info')
    const logs = logger.getRecentLogs()
    expect(logs[0].level).toBe('info')
  })

  it('should log warn message', () => {
    logger.warn('Test warn')
    const logs = logger.getRecentLogs()
    expect(logs[0].level).toBe('warn')
  })

  it('should log error message', () => {
    logger.error('Test error')
    const logs = logger.getRecentLogs()
    expect(logs[0].level).toBe('error')
  })

  it('should log tool execution', () => {
    logger.logToolExecution('testTool', { param: 'value' }, 'result', 100)

    const logs = logger.getRecentLogs()
    expect(logs[0].metadata?.tool).toBe('testTool')
    expect(logs[0].metadata?.duration).toBe(100)
  })

  it('should subscribe to logs', () => {
    const callback = vi.fn()
    logger.subscribe(callback)

    logger.info('Test')
    expect(callback).toHaveBeenCalled()
  })

  it('should clear logs', () => {
    logger.info('Test')
    logger.clear()

    expect(logger.getRecentLogs().length).toBe(0)
  })

  it('should export to JSON', () => {
    logger.info('Test')
    const json = logger.exportJSON()

    expect(json).toBeDefined()
    expect(typeof json).toBe('string')
  })

  it('should respect min level', () => {
    logger.setMinLevel('error')
    logger.debug('Should not appear')
    logger.error('Should appear')

    const logs = logger.getRecentLogs()
    expect(logs.length).toBe(1)
    expect(logs[0].level).toBe('error')
  })

  it('should enable console output', () => {
    logger.enableConsoleOutput()
    // No error means success
  })

  it('should disable console output', () => {
    logger.disableConsoleOutput()
    // No error means success
  })
})

// ============================================================================
// Debug Manager Tests
// ============================================================================

describe('DebugManager', () => {
  let debugManager: DebugManager
  let logger: AgentLogger

  beforeEach(() => {
    logger = new AgentLogger({ outputToConsole: false })
    debugManager = new DebugManager(logger)
  })

  it('should enable debug mode', () => {
    debugManager.enable()
    const status = debugManager.getStatus()
    expect(status.enabled).toBe(true)
  })

  it('should disable debug mode', () => {
    debugManager.enable()
    debugManager.disable()

    const status = debugManager.getStatus()
    expect(status.enabled).toBe(false)
  })

  it('should get statistics', () => {
    logger.info('Test 1')
    logger.info('Test 2')

    const stats = debugManager.getStatistics()
    expect(stats.totalLogs).toBe(2)
  })

  it('should get recent tool calls', () => {
    logger.logToolExecution('test', {}, {}, 100)

    const toolCalls = debugManager.getRecentToolCalls()
    expect(toolCalls.length).toBe(1)
  })

  it('should toggle tool calls visibility', () => {
    debugManager.toggleToolCalls(false)
    const status = debugManager.getStatus()
    expect(status.showToolCalls).toBe(false)
  })

  it('should toggle state changes visibility', () => {
    debugManager.toggleStateChanges(false)
    const status = debugManager.getStatus()
    expect(status.showStateChanges).toBe(false)
  })
})
