import React, { useState } from 'react'
import { Button } from './ui/button'

// Define CV types locally
interface Profile {
  name: string
  title: string
  summary: string
  location: string
  contact: {
    email?: string
    phone?: string
    github?: string
    linkedin?: string
  }
}

interface Experience {
  company: string
  role: string
  startDate: string
  endDate?: string
  achievements: Array<string>
  techStack: Array<string>
}

interface Project {
  name: string
  description: string
  techStack: Array<string>
  highlights: Array<string>
}

interface Education {
  institution: string
  degree: string
  startDate: string
  endDate: string
}

interface CV {
  profile: Profile
  skills: Array<string>
  experience: Array<Experience>
  projects: Array<Project>
  education: Array<Education>
}

export function CVBuilder() {
  const [cvData, setCvData] = useState<CV>({
    profile: {
      name: '',
      title: '',
      summary: '',
      location: '',
      contact: {},
    },
    skills: [],
    experience: [],
    projects: [],
    education: [],
  })
  const [isEditing, setIsEditing] = useState(true)

  const handleSave = () => {
    localStorage.setItem('cv-data', JSON.stringify(cvData))
    alert('CV saved to browser storage!')
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
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={cvData.profile.name}
                    onChange={(e) => setCvData({ 
                      ...cvData, 
                      profile: { ...cvData.profile, name: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={cvData.profile.title}
                    onChange={(e) => setCvData({ 
                      ...cvData, 
                      profile: { ...cvData.profile, title: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Summary *</label>
                  <textarea
                    value={cvData.profile.summary}
                    onChange={(e) => setCvData({ 
                      ...cvData, 
                      profile: { ...cvData.profile, summary: e.target.value } 
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write a brief professional summary..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={cvData.profile.location}
                    onChange={(e) => setCvData({ 
                      ...cvData, 
                      profile: { ...cvData.profile, location: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={cvData.profile.contact.email || ''}
                    onChange={(e) => setCvData({ 
                      ...cvData, 
                      profile: { ...cvData.profile, contact: { ...cvData.profile.contact, email: e.target.value } } 
                    })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
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

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{cvData.experience.length}</div>
                  <div className="text-sm text-gray-600">Work Experience</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{cvData.projects.length}</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{cvData.skills.length}</div>
                  <div className="text-sm text-gray-600">Skills</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{cvData.education.length}</div>
                  <div className="text-sm text-gray-600">Education</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:block">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
              
              <div className="border rounded-lg p-6 bg-gray-50">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{cvData.profile.name || 'Your Name'}</h3>
                  <p className="text-gray-600">{cvData.profile.title || 'Your Title'}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {[cvData.profile.location, cvData.profile.contact.email].filter(Boolean).join(' | ')}
                  </p>
                </div>

                {cvData.profile.summary && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
                    <p className="text-gray-600 text-sm">{cvData.profile.summary}</p>
                  </div>
                )}

                {cvData.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {cvData.experience.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Experience</h4>
                    {cvData.experience.map((exp, idx) => (
                      <div key={idx} className="mb-3 pb-3 border-b last:border-0">
                        <div className="font-medium text-gray-900">{exp.role}</div>
                        <div className="text-sm text-gray-600">{exp.company}</div>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {cvData.projects.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Projects</h4>
                    {cvData.projects.map((project, idx) => (
                      <div key={idx} className="mb-3 pb-3 border-b last:border-0">
                        <div className="font-medium text-gray-900">{project.name}</div>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {cvData.education.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Education</h4>
                    {cvData.education.map((edu, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="font-medium text-gray-900">{edu.degree}</div>
                        <div className="text-sm text-gray-600">{edu.institution}</div>
                      </div>
                    ))}
                  </div>
                )}

                {cvData.profile.name === '' && cvData.profile.title === '' && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Start editing to see your CV preview</p>
                    <p className="text-sm mt-2">Click "Load Demo" to see an example</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
