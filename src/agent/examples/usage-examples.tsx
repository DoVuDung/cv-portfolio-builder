/**
 * Skill Agent - Usage Examples
 * 
 * This file demonstrates how to use the MCP-based Skill Agent system
 */

import type { CV, Experience } from './schemas/cv.schema'
import { useSkillAgent } from './hooks/useSkillAgent'

// ============================================================================
// Example 1: Basic CV Analysis in React Component
// ============================================================================

function CVAnalyzerExample() {
  const { analyzeCV, isLoading, error, lastResult } = useSkillAgent()

  const handleAnalyze = async () => {
    const cvData: CV = {
      profile: {
        name: 'John Doe',
        title: 'Senior Frontend Developer',
        summary: 'Experienced developer with 5+ years building web applications.',
        location: 'San Francisco, CA',
        contact: {
          email: 'john@example.com',
          github: 'johndoe',
          linkedin: 'johndoe',
        },
      },
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      experience: [
        {
          company: 'Tech Corp',
          role: 'Senior Developer',
          startDate: '2020-01',
          achievements: [
            'Built a React application',
            'Improved performance',
          ],
          techStack: ['React', 'TypeScript'],
        },
      ],
      projects: [],
      education: [],
    }

    try {
      const analysis = await analyzeCV(cvData)
      console.log('CV Score:', analysis.score)
      console.log('Strengths:', analysis.strengths)
      console.log('Weaknesses:', analysis.weaknesses)
      console.log('Recommendations:', analysis.recommendations)
    } catch (err) {
      console.error('Analysis failed:', err)
    }
  }

  return (
    <div>
      <button onClick={handleAnalyze} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze CV'}
      </button>
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {lastResult && (
        <div>
          <h3>Analysis Results</h3>
          <pre>{JSON.stringify(lastResult, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 2: Generate Professional Summary
// ============================================================================

function SummaryGeneratorExample() {
  const { generateSummary, isLoading } = useSkillAgent({ debugMode: true })

  const handleGenerate = async () => {
    const cvData: CV = {
      profile: {
        name: 'Jane Smith',
        title: 'Full Stack Developer',
        summary: '',
        location: 'New York, NY',
        contact: { email: 'jane@example.com' },
      },
      skills: ['React', 'Node.js', 'Python', 'AWS', 'PostgreSQL'],
      experience: [
        {
          company: 'StartupXYZ',
          role: 'Lead Developer',
          startDate: '2019-03',
          endDate: '2023-12',
          achievements: [
            'Led team of 5 developers',
            'Architected microservices platform',
            'Reduced deployment time by 60%',
          ],
          techStack: ['React', 'Node.js', 'AWS'],
        },
      ],
      projects: [],
      education: [],
    }

    const summary = await generateSummary(cvData, 'Engineering Manager')
    console.log('Generated Summary:', summary)
  }

  return (
    <button onClick={handleGenerate} disabled={isLoading}>
      {isLoading ? 'Generating...' : 'Generate Summary'}
    </button>
  )
}

// ============================================================================
// Example 3: Optimize CV for ATS
// ============================================================================

function ATSOptimizerExample() {
  const { optimizeCV, isLoading, error } = useSkillAgent({
    llmProvider: 'mock', // Use 'openai' with apiKey in production
  })

  const handleOptimize = async () => {
    const cvData: CV = {
      profile: {
        name: 'Bob Johnson',
        title: 'Software Engineer',
        summary: 'Developer with experience in various technologies.',
        location: 'Austin, TX',
        contact: { email: 'bob@example.com' },
      },
      skills: ['JavaScript', 'React', 'Node'],
      experience: [
        {
          company: 'Web Company',
          role: 'Developer',
          startDate: '2021-01',
          achievements: ['Created web pages', 'Fixed bugs'],
          techStack: ['JavaScript', 'React'],
        },
      ],
      projects: [],
      education: [],
    }

    const jobDescription = `
      We're looking for a Senior Software Engineer with:
      - 5+ years experience in React and TypeScript
      - Strong understanding of microservices architecture
      - Experience with AWS cloud services
      - Leadership and mentoring skills
      - Knowledge of CI/CD pipelines
    `

    const result = await optimizeCV(cvData, jobDescription)
    
    console.log('Match Score:', result.matchScore)
    console.log('Missing Keywords:', result.missingKeywords)
    console.log('Recommendations:', result.recommendations)
  }

  return (
    <button onClick={handleOptimize} disabled={isLoading}>
      {isLoading ? 'Optimizing...' : 'Optimize for ATS'}
    </button>
  )
}

// ============================================================================
// Example 4: Improve Experience Entry
// ============================================================================

function ExperienceImproverExample() {
  const { improveExperience } = useSkillAgent()

  const handleImprove = async () => {
    const experience: Experience = {
      company: 'Innovation Labs',
      role: 'Frontend Developer',
      startDate: '2020-06',
      endDate: '2022-12',
      achievements: [
        'Made a React app',
        'Worked on performance',
        'Helped teammates',
      ],
      techStack: ['React', 'TypeScript', 'Webpack'],
    }

    const improved = await improveExperience(experience)
    
    console.log('Original Achievements:')
    experience.achievements.forEach(a => console.log(`  - ${a}`))
    
    console.log('\nImproved Achievements:')
    improved.achievements.forEach(a => console.log(`  - ${a}`))
    
    console.log('\nSuggestions:')
    improved.suggestions.forEach(s => console.log(`  - ${s}`))
  }

  return (
    <button onClick={handleImprove}>
      Improve Experience
    </button>
  )
}

// ============================================================================
// Example 5: Complete Workflow - Analyze → Optimize → Generate
// ============================================================================

function CompleteWorkflowExample() {
  const { analyzeCV, optimizeCV, generateSummary, isLoading } = useSkillAgent({
    debugMode: true,
  })

  const handleCompleteWorkflow = async () => {
    const cvData: CV = {
      profile: {
        name: 'Alice Chen',
        title: 'Senior Software Engineer',
        summary: 'Passionate developer with expertise in frontend technologies.',
        location: 'Seattle, WA',
        contact: {
          email: 'alice@example.com',
          github: 'alicechen',
          linkedin: 'alicechen',
        },
      },
      skills: [
        'React', 'TypeScript', 'JavaScript', 'Node.js',
        'GraphQL', 'AWS', 'Docker', 'PostgreSQL',
      ],
      experience: [
        {
          company: 'Cloud Tech Inc',
          role: 'Senior Engineer',
          startDate: '2019-01',
          achievements: [
            'Led migration from JavaScript to TypeScript',
            'Implemented CI/CD pipeline reducing deployment time by 70%',
            'Mentored 3 junior developers',
            'Architected real-time dashboard used by 10k+ users',
          ],
          techStack: ['React', 'TypeScript', 'AWS', 'GraphQL'],
        },
        {
          company: 'StartupHub',
          role: 'Full Stack Developer',
          startDate: '2016-06',
          endDate: '2018-12',
          achievements: [
            'Built MVP that raised $2M in funding',
            'Developed REST API serving 1M+ requests daily',
          ],
          techStack: ['Node.js', 'React', 'MongoDB'],
        },
      ],
      projects: [
        {
          name: 'Open Source Contribution',
          description: 'Active contributor to React ecosystem',
          techStack: ['TypeScript', 'React'],
          highlights: [
            'Contributed to major open source libraries',
            'Created popular React component library with 5k+ stars',
          ],
        },
      ],
      education: [
        {
          institution: 'University of Washington',
          degree: 'BS Computer Science',
          startDate: '2012-09',
          endDate: '2016-06',
        },
      ],
    }

    try {
      // Step 1: Analyze CV
      console.log('📊 Analyzing CV...')
      const analysis = await analyzeCV(cvData)
      console.log('Score:', analysis.score, '/ 100')
      console.log('Strengths:', analysis.strengths.length)
      console.log('Weaknesses:', analysis.weaknesses.length)

      // Step 2: Optimize for target role
      console.log('\n🎯 Optimizing for Staff Engineer role...')
      const optimized = await optimizeCV(cvData)
      console.log('Keywords found:', optimized.currentKeywords.length)
      console.log('Recommendations:', optimized.recommendations.length)

      // Step 3: Generate tailored summary
      console.log('\n✍️ Generating professional summary...')
      const summary = await generateSummary(cvData, 'Staff Software Engineer')
      console.log('Generated Summary:')
      console.log(summary)

      console.log('\n✅ Workflow complete!')
    } catch (err) {
      console.error('❌ Workflow failed:', err)
    }
  }

  return (
    <button onClick={handleCompleteWorkflow} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Run Complete Workflow'}
    </button>
  )
}

// ============================================================================
// Example 6: Using CV Memory
// ============================================================================

function CVMemoryExample() {
  const { useCVMemory } = require('./hooks/useSkillAgent')
  const { currentCV, saveCV, getHistory, restoreVersion, versionCount } = useCVMemory()

  const handleSave = () => {
    const newCV: CV = {
      profile: {
        name: 'Test User',
        title: 'Developer',
        summary: 'A developer',
        location: 'Remote',
        contact: { email: 'test@example.com' },
      },
      skills: ['JavaScript', 'React'],
      experience: [],
      projects: [],
      education: [],
    }

    saveCV(newCV, ['Initial version'])
    console.log('CV saved!')
  }

  const handleViewHistory = () => {
    const history = getHistory()
    console.log('Version History:')
    history.forEach((version, index) => {
      console.log(`${index + 1}. ${version.version} - ${version.timestamp}`)
      console.log(`   Changes: ${version.changes.join(', ')}`)
    })
  }

  const handleRestore = () => {
    if (versionCount > 1) {
      restoreVersion(1)
      console.log('Restored to version 1')
    }
  }

  return (
    <div>
      <button onClick={handleSave}>Save CV</button>
      <button onClick={handleViewHistory}>View History ({versionCount} versions)</button>
      <button onClick={handleRestore} disabled={versionCount <= 1}>
        Restore v1
      </button>
      
      {currentCV && (
        <div>
          <h3>Current CV</h3>
          <pre>{JSON.stringify(currentCV, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 7: Context Management
// ============================================================================

function ContextExample() {
  const { useAgentContext } = require('./hooks/useSkillAgent')
  const { context, updateContext, suggestions } = useAgentContext()

  const handleSetTargetRole = () => {
    updateContext({
      targetRole: 'Senior Frontend Engineer',
      seniority: 'senior',
      domain: 'SaaS',
    })
  }

  const handleSetPreferences = () => {
    updateContext({
      preferences: {
        tone: 'professional',
        emphasis: ['technical', 'impact'],
      },
    })
  }

  return (
    <div>
      <button onClick={handleSetTargetRole}>Set Target Role</button>
      <button onClick={handleSetPreferences}>Set Preferences</button>
      
      <div>
        <h3>Current Context</h3>
        <pre>{JSON.stringify(context, null, 2)}</pre>
      </div>
      
      <div>
        <h3>Suggestions</h3>
        <ul>
          {suggestions().map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// Example 8: Debug Mode with Logging
// ============================================================================

function DebugExample() {
  const { useSkillAgent } = require('./hooks/useSkillAgent')
  const { debugManager, agentLogger } = require('./services/logger')

  const enableDebug = () => {
    debugManager.enable()
    console.log('Debug mode enabled')
  }

  const disableDebug = () => {
    debugManager.disable()
    console.log('Debug mode disabled')
  }

  const viewStats = () => {
    const stats = debugManager.getStatistics()
    console.log('Debug Statistics:')
    console.log(`  Total Logs: ${stats.totalLogs}`)
    console.log(`  Tool Calls: ${stats.toolCalls}`)
    console.log(`  Errors: ${stats.errors}`)
    console.log(`  Avg Duration: ${stats.averageDuration}ms`)
  }

  const viewToolCalls = () => {
    const toolCalls = debugManager.getRecentToolCalls()
    console.log('Recent Tool Calls:')
    toolCalls.forEach(call => {
      console.log(`  ${call.metadata?.tool} - ${call.metadata?.duration}ms`)
    })
  }

  return (
    <div>
      <button onClick={enableDebug}>Enable Debug</button>
      <button onClick={disableDebug}>Disable Debug</button>
      <button onClick={viewStats}>View Statistics</button>
      <button onClick={viewToolCalls}>View Tool Calls</button>
    </div>
  )
}

// ============================================================================
// Export Examples
// ============================================================================

export {
  CVAnalyzerExample,
  SummaryGeneratorExample,
  ATSOptimizerExample,
  ExperienceImproverExample,
  CompleteWorkflowExample,
  CVMemoryExample,
  ContextExample,
  DebugExample,
}
