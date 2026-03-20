import React, { useState } from 'react'
import { Button } from './ui/button'

// Type definitions matching CV structure
interface Profile {
  name: string
  title: string
  summary: string
  location: string
  phone?: string
  email?: string
  portfolio?: string
  github?: string
  linkedin?: string
  education?: string
  languages?: string
}

interface Experience {
  company: string
  role: string
  startDate: string
  endDate?: string
  location?: string
  project?: string
  teamSize?: string
  techStack?: string
  achievements: Array<string>
}

interface Project {
  name: string
  description: string
  role?: string
  teamSize?: string
  techStack?: Array<string>
  highlights: Array<string>
}

interface Education {
  institution: string
  degree: string
  startDate?: string
  endDate?: string
  gpa?: string
}

interface SkillCategory {
  category: string
  skills: Array<string>
}

interface CV {
  profile: Profile
  skills: Array<SkillCategory>
  experience: Array<Experience>
  projects: Array<Project>
  education: Array<Education>
}

export function CVBuilder() {
  const [cvData, setCvData] = useState<CV>({
    profile: {
      name: 'Dung Do (Andy)',
      title: 'Frontend Engineer (React / Next.js / SaaS Systems / Landing Page)',
      summary: 'Frontend Engineer with 4+ years of experience building scalable SaaS products across healthcare, government, and education domains.',
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
        location: 'Da Nang, Vietnam',
        project: 'Student Finance Platform (Education government of Singapore SaaS)',
        teamSize: '80 – 100 engineers (Singapore, Vietnam, China)',
        techStack: 'React 19, TypeScript, Vite, Ant Design, Zustand, REST APIs, .NET, Dapr',
        achievements: [
          'Built scalable and responsive UI using React + TypeScript aligned with enterprise design systems',
          'Developed financial dashboards, payment forms, and workflow-driven interfaces',
          'Designed reusable components to standardize UI and improve development speed',
          'Managed state with Zustand and structured routing for large-scale applications',
          'Integrated backend services (.NET) and handled complex data flows',
          'Performed API testing (REST, GraphQL) to ensure data reliability',
          'Optimized performance (lazy loading, code splitting, reducing re-renders)',
          'Collaborated in a distributed team and participated in code reviews and Agile ceremonies',
        ],
      },
      {
        company: 'Datahouse',
        role: 'Frontend Engineer (Team Lead)',
        startDate: 'Jan 2024',
        endDate: 'Sep 2025',
        project: 'Healthcare Facility Management Platform (React / Next.js)',
        teamSize: '20 engineers',
        techStack: 'React, Next.js, React Hook Form, Zod, Elasticsearch, Stripe, ASP.NET (ABP)',
        achievements: [
          'Role: Frontend Lead (10 developers)',
          'Built a reusable Next.js frontend boilerplate',
          'Developed admin dashboards, data tables, and complex forms using React Hook Form + Zod',
          'Integrated REST APIs from ASP.NET (ABP) backend',
          'Implemented full-text search with Elasticsearch and Stripe payment integration',
          'Set up CI/CD pipelines using GitLab Runner',
        ],
      },
    ],
    projects: [],
    education: [
      {
        institution: 'Duy Tan University',
        degree: 'Bachelor Degree Information Technology',
        gpa: '3.37/4',
      },
    ],
  })
  const [isEditing, setIsEditing] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'experience' | 'education'>('profile')

  const handleSave = () => {
    localStorage.setItem('cv-data', JSON.stringify(cvData))
    alert('CV saved to browser storage!')
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">CV Portfolio Builder</h1>
            <div className="space-x-2">
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Mode
                </Button>
              )}
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
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow p-2">
              <div className="flex gap-2 overflow-x-auto">
                {(['profile', 'skills', 'experience', 'education'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md font-medium capitalize whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Section */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={cvData.profile.name}
                    onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, name: e.target.value } })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={cvData.profile.title}
                    onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, title: e.target.value } })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Summary *</label>
                  <textarea
                    value={cvData.profile.summary}
                    onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, summary: e.target.value } })}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={cvData.profile.location}
                    onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, location: e.target.value } })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={cvData.profile.phone || ''}
                    onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, phone: e.target.value } })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={cvData.profile.email || ''}
                    onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, email: e.target.value } })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Portfolio URL</label>
                  <input
                    type="url"
                    value={cvData.profile.portfolio || ''}
                    onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, portfolio: e.target.value } })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">GitHub</label>
                  <input
                    type="url"
                    value={cvData.profile.github || ''}
                    onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, github: e.target.value } })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={cvData.profile.linkedin || ''}
                    onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, linkedin: e.target.value } })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Education Info</label>
                  <input
                    type="text"
                    value={cvData.profile.education || ''}
                    onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, education: e.target.value } })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Languages</label>
                  <input
                    type="text"
                    value={cvData.profile.languages || ''}
                    onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, languages: e.target.value } })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Skills Section */}
            {activeTab === 'skills' && (
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold">Skills by Category</h2>
                {cvData.skills.map((skillCat, catIdx) => (
                  <div key={catIdx} className="border rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium">{skillCat.category}</label>
                      <button
                        onClick={() => {
                          const newSkills = [...cvData.skills]
                          newSkills.splice(catIdx, 1)
                          setCvData({ ...cvData, skills: newSkills })
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={skillCat.skills.join(', ')}
                      onChange={(e) => {
                        const newSkills = [...cvData.skills]
                        newSkills[catIdx].skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        setCvData({ ...cvData, skills: newSkills })
                      }}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Skill1, Skill2, Skill3"
                    />
                  </div>
                ))}
                <Button
                  onClick={() => setCvData({ ...cvData, skills: [...cvData.skills, { category: 'New Category', skills: [] }] })}
                  variant="outline"
                  className="w-full"
                >
                  Add Skill Category
                </Button>
              </div>
            )}

            {/* Experience Section */}
            {activeTab === 'experience' && (
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold">Work Experience</h2>
                {cvData.experience.map((exp, idx) => (
                  <div key={idx} className="border rounded p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{exp.company} - {exp.role}</h3>
                      <button
                        onClick={() => {
                          const newExp = [...cvData.experience]
                          newExp.splice(idx, 1)
                          setCvData({ ...cvData, experience: newExp })
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...cvData.experience]
                        newExp[idx].company = e.target.value
                        setCvData({ ...cvData, experience: newExp })
                      }}
                      placeholder="Company"
                      className="w-full px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const newExp = [...cvData.experience]
                        newExp[idx].role = e.target.value
                        setCvData({ ...cvData, experience: newExp })
                      }}
                      placeholder="Role"
                      className="w-full px-3 py-2 border rounded"
                    />
                    <textarea
                      value={exp.achievements.join('\n')}
                      onChange={(e) => {
                        const newExp = [...cvData.experience]
                        newExp[idx].achievements = e.target.value.split('\n')
                        setCvData({ ...cvData, experience: newExp })
                      }}
                      placeholder="Achievements (one per line)"
                      rows={6}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                ))}
                <Button
                  onClick={() => setCvData({
                    ...cvData,
                    experience: [...cvData.experience, { company: '', role: '', startDate: '', achievements: [] }]
                  })}
                  variant="outline"
                  className="w-full"
                >
                  Add Experience
                </Button>
              </div>
            )}

            {/* Education Section */}
            {activeTab === 'education' && (
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold">Education</h2>
                {cvData.education.map((edu, idx) => (
                  <div key={idx} className="border rounded p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{edu.institution}</h3>
                      <button
                        onClick={() => {
                          const newEdu = [...cvData.education]
                          newEdu.splice(idx, 1)
                          setCvData({ ...cvData, education: newEdu })
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...cvData.education]
                        newEdu[idx].institution = e.target.value
                        setCvData({ ...cvData, education: newEdu })
                      }}
                      placeholder="Institution"
                      className="w-full px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...cvData.education]
                        newEdu[idx].degree = e.target.value
                        setCvData({ ...cvData, education: newEdu })
                      }}
                      placeholder="Degree"
                      className="w-full px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => {
                        const newEdu = [...cvData.education]
                        newEdu[idx].gpa = e.target.value
                        setCvData({ ...cvData, education: newEdu })
                      }}
                      placeholder="GPA"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:block">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
              
              <div className="border rounded-lg p-6 bg-white">
                {/* Header */}
                <div className="text-center border-b pb-4 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{cvData.profile.name}</h3>
                  <p className="text-gray-700 mt-1">{cvData.profile.title}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {[cvData.profile.location, cvData.profile.phone, cvData.profile.email].filter(Boolean).join(' | ')}
                  </p>
                  <div className="flex justify-center gap-3 mt-2 text-sm text-blue-600">
                    {cvData.profile.portfolio && <a href={cvData.profile.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a>}
                    {cvData.profile.github && <a href={cvData.profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                    {cvData.profile.linkedin && <a href={cvData.profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                  </div>
                </div>

                {/* Summary */}
                {cvData.profile.summary && (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-800 mb-2">SUMMARY</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{cvData.profile.summary}</p>
                  </div>
                )}

                {/* Skills */}
                {cvData.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-800 mb-2">SKILLS</h4>
                    <div className="space-y-2">
                      {cvData.skills.map((skillCat, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-semibold text-gray-700">{skillCat.category}: </span>
                          <span className="text-gray-600">{skillCat.skills.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {cvData.experience.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-800 mb-3">EXPERIENCE</h4>
                    {cvData.experience.map((exp, idx) => (
                      <div key={idx} className="mb-4 pb-4 border-b last:border-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <div className="font-semibold text-gray-900">{exp.role}</div>
                          <div className="text-sm text-gray-600">{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}</div>
                        </div>
                        <div className="text-gray-700 font-medium">{exp.company}</div>
                        {exp.project && <div className="text-sm text-gray-600 italic mt-1">{exp.project}</div>}
                        {exp.teamSize && <div className="text-xs text-gray-500">Team size: {exp.teamSize}</div>}
                        <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {cvData.education.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">EDUCATION</h4>
                    {cvData.education.map((edu, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="font-semibold text-gray-900">{edu.degree}</div>
                        <div className="text-gray-700">{edu.institution}</div>
                        {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
                      </div>
                    ))}
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
