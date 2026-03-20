import React, { useState } from 'react'
import { Button } from './ui/button'
import { TemplateSwitcher } from './TemplateSwitcher'
import type { CV } from '@/agent/schemas/cv.schema'
import type { Theme } from '@/templates/types/template.types'
import { useCVMemory, useSkillAgent } from '@/agent/hooks/useSkillAgent'
import { TemplateRenderer } from '@/templates/core/TemplateRenderer'
import { useTemplateEngine } from '@/templates'

interface CVBuilderProps {
  initialData?: CV | null
}

export function CVBuilder({ initialData }: CVBuilderProps) {
  const { currentCV, saveCV } = useCVMemory()
  const { activeTemplate } = useTemplateEngine()
  const [cvData, setCvData] = useState<CV>(initialData || currentCV || getDefaultCV())
  const [isEditing, setIsEditing] = useState(true)

  function getDefaultCV(): CV {
    return {
      profile: {
        name: '',
        title: '',
        summary: '',
        location: '',
        contact: {
          email: '',
        },
      },
      skills: [],
      experience: [],
      projects: [],
      education: [],
    }
  }

  const handleSave = () => {
    saveCV(cvData, ['Manual save'])
    setIsEditing(false)
  }

  const handleLoadDemo = () => {
    const demoCV: CV = {
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
    }
    setCvData(demoCV)
    setIsEditing(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">CV Portfolio Builder</h1>
            <div className="space-x-2">
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit CV
                </Button>
              )}
              <Button onClick={handleLoadDemo} variant="outline">
                Load Demo
              </Button>
              <Button onClick={handleSave} disabled={!isEditing}>
                Save CV
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Editor */}
          <div className={`space-y-6 ${isEditing ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Editor</h2>
              <p className="text-gray-600 text-sm">
                Edit your CV information. Changes are saved locally.
              </p>
              
              {/* Profile Section */}
              <div className="mt-4 space-y-4">
                <TemplateSwitcher />
                
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={cvData.profile.name}
                    onChange={(e) => setCvData({ 
                      ...cvData, 
                      profile: { ...cvData.profile, name: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={cvData.profile.title}
                    onChange={(e) => setCvData({ 
                      ...cvData, 
                      profile: { ...cvData.profile, title: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Summary</label>
                  <textarea
                    value={cvData.profile.summary}
                    onChange={(e) => setCvData({ 
                      ...cvData, 
                      profile: { ...cvData.profile, summary: e.target.value } 
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={cvData.skills.join(', ')}
                    onChange={(e) => setCvData({ 
                      ...cvData, 
                      skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="React, TypeScript, Node.js"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* AI Assistant Panel */}
            <AIAssistantPanel cvData={cvData} onUpdateCv={setCvData} />
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:block">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
              
              {activeTemplate ? (
                <div className="border rounded-lg overflow-hidden">
                  <TemplateRenderer
                    template={activeTemplate}
                    cvData={cvData}
                    theme={activeTemplate.theme as Theme}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Select a template to preview your CV</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// AI Assistant Panel Component
interface AIAssistantPanelProps {
  cvData: CV
  onUpdateCv: (data: CV) => void
}

function AIAssistantPanel({ cvData, onUpdateCv }: AIAssistantPanelProps) {
  const { analyzeCV, generateSummary, isLoading } = useSkillAgent({ debugMode: true })
  const [result, setResult] = useState<string>('')

  const handleAnalyze = async () => {
    const analysis = await analyzeCV(cvData)
    setResult(`Score: ${analysis.score}/100\n\nStrengths:\n${analysis.strengths.join('\n')}\n\nRecommendations:\n${analysis.recommendations.join('\n')}`)
  }

  const handleGenerateSummary = async () => {
    const summary = await generateSummary(cvData, 'Senior Software Engineer')
    onUpdateCv({ ...cvData, profile: { ...cvData.profile, summary } })
    setResult(`Generated Summary:\n\n${summary}`)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>
      
      <div className="space-y-2">
        <Button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full"
          variant="outline"
        >
          Analyze CV
        </Button>

        <Button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="w-full"
          variant="outline"
        >
          Generate Summary
        </Button>
      </div>

      {isLoading && (
        <div className="mt-4 text-center text-sm text-gray-500">
          AI is thinking...
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
          {result}
        </div>
      )}
    </div>
  )
}
