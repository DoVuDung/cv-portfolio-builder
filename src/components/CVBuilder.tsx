import React, { useState } from 'react'
import { Button } from './ui/button'

// Type definitions
interface Profile {
  name: string
  title: string
  summary: string
  location: string
  phone: string
  email: string
  portfolio: string
  github: string
  linkedin: string
  education: string
  languages: string
}

interface WorkExperience {
  company: string
  role: string
  startDate: string
  endDate: string
  location: string
  projects: Array<{
    name: string
    description: string
    teamSize: string
    techStack: string
    achievements: Array<string>
  }>
}

interface SkillCategory {
  category: string
  skills: Array<string>
}

interface Education {
  institution: string
  degree: string
  gpa: string
}

interface CVData {
  profile: Profile
  skills: Array<SkillCategory>
  experience: Array<WorkExperience>
  education: Array<Education>
}

export function CVBuilder() {
  // Initialize with your actual CV data
  const [cvData, setCvData] = useState<CVData>({
    profile: {
      name: 'Dung Do (Andy)',
      title: 'Frontend Engineer (React / Next.js / SaaS Systems / Landing Page)',
      summary: 'Frontend Engineer with 4+ years of experience building scalable SaaS products across healthcare, government, and education domains. Specialized in React and Next.js, with strong expertise in performance optimization, component architecture, and data-intensive applications. Proven ability to lead frontend teams, deliver complex systems on schedule, and mentor engineers. Experienced in Full-Stack collaboration (.NET, Node.js/NestJS), API integration (REST, GraphQL), and building reusable UI systems.',
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
      {
        category: 'Frontend',
        skills: ['React', 'Next.js', 'TypeScript', 'Redux', 'Zustand', 'HTML', 'CSS', 'JavaScript'],
      },
      {
        category: 'UI Systems',
        skills: ['Ant Design', 'Material UI', 'ShadCN UI', 'Component Libraries'],
      },
      {
        category: 'Backend & APIs',
        skills: ['Node.js', 'NestJS', 'ASP.NET (.NET)', 'REST APIs', 'GraphQL'],
      },
      {
        category: 'Database',
        skills: ['PostgreSQL', 'Prisma'],
      },
      {
        category: 'DevOps & Tools',
        skills: ['AWS (Lambda, SNS, SQS)', 'CI/CD', 'GitHub Actions', 'Docker', 'Git'],
      },
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
            name: 'Student Finance Platform (Education government of Singapore SaaS)',
            description: 'Built scalable and responsive UI for Singapore government education platform',
            teamSize: '80 – 100 engineers (Singapore, Vietnam, China)',
            techStack: 'React 19, TypeScript, Vite, Ant Design, internal UI library, Zustand, React Router, REST APIs, .NET, Dapr',
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
        ],
      },
      {
        company: 'Datahouse',
        role: 'Frontend Engineer (Team Lead)',
        startDate: 'Jan 2024',
        endDate: 'Sep 2025',
        location: 'Da Nang, Vietnam',
        projects: [
          {
            name: 'Healthcare Facility Management Platform (React / Next.js)',
            description: 'Led frontend development for healthcare management system',
            teamSize: '20 engineers (Role: Frontend Lead - 10 developers)',
            techStack: 'React, Next.js, React Hook Form, Zod, Elasticsearch, Stripe, ASP.NET (ABP), GitLab Runner',
            achievements: [
              'Built a reusable Next.js frontend boilerplate',
              'Developed admin dashboards, data tables, and complex forms using React Hook Form + Zod',
              'Integrated REST APIs from ASP.NET (ABP) backend',
              'Implemented full-text search with Elasticsearch and Stripe payment integration',
              'Set up CI/CD pipelines using GitLab Runner',
            ],
          },
          {
            name: 'Dialysis Healthcare System',
            description: 'Led frontend team for dialysis patient management system',
            teamSize: '5 frontend engineers',
            techStack: 'React, Redux, NestJS, AWS Lambda',
            achievements: [
              'Led frontend team and delivered projects on time following Agile sprints',
              'Defined frontend architecture and reusable component strategy',
              'Mentored team members on React and Next.js best practices',
              'Improved code quality and development consistency across the team',
              'Collaborated with backend team for API design and integration',
            ],
          },
          {
            name: 'BPP – Tax Management Platform',
            description: 'Developed tax management system for individuals and organizations',
            teamSize: '6 – 8 engineers',
            techStack: 'React, Redux, Zustand, React Query, NestJS, Prisma, AWS SNS/SQS',
            achievements: [
              'Developed tax management system for individuals and organizations',
              'Contributed to frontend architecture redesign for scalability',
              'Implemented backend tasks using NestJS (CRUD APIs, microservices)',
              'Built asynchronous workflows using AWS SNS/SQS',
              'Performed code reviews and ensured code quality',
            ],
          },
        ],
      },
      {
        company: 'Datahouse',
        role: 'Frontend Engineer',
        startDate: 'Jan 2022',
        endDate: 'Dec 2023',
        location: 'Da Nang, Vietnam',
        projects: [
          {
            name: 'Government & Education Systems',
            description: 'Built reusable UI components for government and education clients',
            teamSize: '5 – 8 engineers',
            techStack: 'React, Material UI, Redux Saga, AWS (Cognito, SNS, SQS, Lambda), REST APIs',
            achievements: [
              'Built reusable UI components and responsive layouts',
              'Contributed to design system implementation',
              'Integrated APIs and implemented frontend business logic',
              'Improved performance and application stability',
            ],
          },
        ],
      },
      {
        company: 'Datahouse',
        role: 'Software Engineer Intern',
        startDate: 'Oct 2021',
        endDate: 'Jan 2022',
        location: 'Da Nang, Vietnam',
        projects: [
          {
            name: 'UI Development',
            description: 'Developed UI features and collaborated with design team',
            teamSize: 'Intern team',
            techStack: 'React, Git',
            achievements: [
              'Developed UI features and collaborated with UI/UX team',
              'Learned and applied modern frontend practices and Git workflows',
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
  })

  const [activeSection, setActiveSection] = useState<'profile' | 'skills' | 'experience' | 'education'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('cv-data', JSON.stringify(cvData))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setIsEditing(false)
  }

  const handleLoadDemo = () => {
    if (confirm('This will reset to demo data. Continue?')) {
      // Keep current data as is since it's already the demo
      setIsEditing(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CV Portfolio Builder</h1>
              <p className="text-sm text-gray-600 mt-1">Professional CV Editor with Live Preview</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsEditing(!isEditing)} 
                variant={isEditing ? 'default' : 'outline'}
                className="font-semibold"
              >
                {isEditing ? '✓ Editing' : '✎ Edit'}
              </Button>
              <Button onClick={handleLoadDemo} variant="outline">
                📋 Load Demo
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!isEditing}
                className={`${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {saved ? '✓ Saved!' : '💾 Save CV'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Editor */}
          <div className={`space-y-6 ${isEditing ? 'block' : 'hidden lg:block'}`}>
            {/* Section Tabs */}
            <div className="bg-white rounded-xl shadow-lg p-2">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {(['profile', 'skills', 'experience', 'education'] as const).map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`px-6 py-3 rounded-lg font-semibold capitalize whitespace-nowrap transition-all duration-200 ${
                      activeSection === section
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {section === 'profile' && '👤 '}
                    {section === 'skills' && '⚡ '}
                    {section === 'experience' && '💼 '}
                    {section === 'education' && '🎓 '}
                    {section}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-3">👤 Profile Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={cvData.profile.name}
                      onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, name: e.target.value } })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Title *</label>
                    <input
                      type="text"
                      value={cvData.profile.title}
                      onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, title: e.target.value } })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Your professional title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Summary *</label>
                    <textarea
                      value={cvData.profile.summary}
                      onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, summary: e.target.value } })}
                      disabled={!isEditing}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                      placeholder="Write a compelling professional summary..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={cvData.profile.location}
                        onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, location: e.target.value } })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={cvData.profile.phone}
                        onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, phone: e.target.value } })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="+XX XXX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={cvData.profile.email}
                      onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, email: e.target.value } })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Portfolio URL</label>
                      <input
                        type="url"
                        value={cvData.profile.portfolio}
                        onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, portfolio: e.target.value } })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Languages</label>
                      <input
                        type="text"
                        value={cvData.profile.languages}
                        onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, languages: e.target.value } })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="English, Spanish, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub</label>
                      <input
                        type="url"
                        value={cvData.profile.github}
                        onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, github: e.target.value } })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="url"
                        value={cvData.profile.linkedin}
                        onChange={(e) => setCvData({ ...cvData, profile: { ...cvData.profile, linkedin: e.target.value } })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-3">⚡ Skills by Category</h2>
                
                <div className="space-y-6">
                  {cvData.skills.map((skillCat, catIdx) => (
                    <div key={catIdx} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-lg font-bold text-gray-800">{skillCat.category}</label>
                        {isEditing && (
                          <button
                            onClick={() => {
                              const newSkills = [...cvData.skills]
                              newSkills.splice(catIdx, 1)
                              setCvData({ ...cvData, skills: newSkills })
                            }}
                            className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={skillCat.skills.join(', ')}
                        onChange={(e) => {
                          const newSkills = [...cvData.skills]
                          newSkills[catIdx].skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          setCvData({ ...cvData, skills: newSkills })
                        }}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Skill1, Skill2, Skill3"
                      />
                    </div>
                  ))}
                  
                  {isEditing && (
                    <Button
                      onClick={() => setCvData({ ...cvData, skills: [...cvData.skills, { category: 'New Category', skills: [] }] })}
                      variant="outline"
                      className="w-full py-4 text-lg font-semibold border-2 border-dashed"
                    >
                      + Add Skill Category
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-3">💼 Work Experience</h2>
                
                <div className="space-y-8">
                  {cvData.experience.map((exp, expIdx) => (
                    <div key={expIdx} className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{exp.company}</h3>
                          <p className="text-gray-600">{exp.role}</p>
                          <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate} | {exp.location}</p>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => {
                              const newExp = [...cvData.experience]
                              newExp.splice(expIdx, 1)
                              setCvData({ ...cvData, experience: newExp })
                            }}
                            className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      {exp.projects.map((proj, projIdx) => (
                        <div key={projIdx} className="bg-white rounded-lg p-4 mt-4 border">
                          <h4 className="font-bold text-gray-800 mb-2">{proj.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{proj.description}</p>
                          <div className="text-xs text-gray-500 mb-3">
                            <span className="font-semibold">Team:</span> {proj.teamSize}
                          </div>
                          <div className="text-xs text-blue-600 mb-3">
                            <span className="font-semibold">Tech:</span> {proj.techStack}
                          </div>
                          
                          <div className="mt-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Achievements (one per line)</label>
                            <textarea
                              value={proj.achievements.join('\n')}
                              onChange={(e) => {
                                const newExp = [...cvData.experience]
                                newExp[expIdx].projects[projIdx].achievements = e.target.value.split('\n')
                                setCvData({ ...cvData, experience: newExp })
                              }}
                              disabled={!isEditing}
                              rows={Math.max(4, proj.achievements.length)}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-3">🎓 Education</h2>
                
                <div className="space-y-4">
                  {cvData.education.map((edu, eduIdx) => (
                    <div key={eduIdx} className="border-2 border-gray-200 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{edu.institution}</h3>
                          <p className="text-gray-600">{edu.degree}</p>
                          {edu.gpa && <p className="text-sm text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => {
                              const newEdu = [...cvData.education]
                              newEdu.splice(eduIdx, 1)
                              setCvData({ ...cvData, education: newEdu })
                            }}
                            className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const newEdu = [...cvData.education]
                              newEdu[eduIdx].institution = e.target.value
                              setCvData({ ...cvData, education: newEdu })
                            }}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEdu = [...cvData.education]
                              newEdu[eduIdx].degree = e.target.value
                              setCvData({ ...cvData, education: newEdu })
                            }}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">GPA</label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => {
                              const newEdu = [...cvData.education]
                              newEdu[eduIdx].gpa = e.target.value
                              setCvData({ ...cvData, education: newEdu })
                            }}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:block">
            <div className="bg-white rounded-xl shadow-2xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">👁️</span>
                Live Preview
              </h2>
              
              {/* CV Preview */}
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                {/* CV Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
                  <h1 className="text-3xl font-bold mb-2">{cvData.profile.name || 'Your Name'}</h1>
                  <p className="text-xl opacity-90 mb-3">{cvData.profile.title || 'Your Professional Title'}</p>
                  <div className="flex flex-wrap justify-center gap-3 text-sm opacity-80 mt-4">
                    {cvData.profile.location && <span>📍 {cvData.profile.location}</span>}
                    {cvData.profile.phone && <span>📱 {cvData.profile.phone}</span>}
                    {cvData.profile.email && <span>✉️ {cvData.profile.email}</span>}
                  </div>
                  <div className="flex justify-center gap-4 mt-3 text-sm">
                    {cvData.profile.portfolio && (
                      <a href={cvData.profile.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        🌐 Portfolio
                      </a>
                    )}
                    {cvData.profile.github && (
                      <a href={cvData.profile.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        💻 GitHub
                      </a>
                    )}
                    {cvData.profile.linkedin && (
                      <a href={cvData.profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        💼 LinkedIn
                      </a>
                    )}
                  </div>
                </div>

                {/* CV Content */}
                <div className="p-6 space-y-6">
                  {/* Summary */}
                  {cvData.profile.summary && (
                    <section>
                      <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 mb-3 pb-1">SUMMARY</h3>
                      <p className="text-gray-700 leading-relaxed">{cvData.profile.summary}</p>
                    </section>
                  )}

                  {/* Skills */}
                  {cvData.skills.length > 0 && (
                    <section>
                      <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 mb-3 pb-1">SKILLS</h3>
                      <div className="space-y-3">
                        {cvData.skills.map((cat, idx) => (
                          <div key={idx} className="flex">
                            <span className="font-bold text-gray-800 w-40 flex-shrink-0">{cat.category}:</span>
                            <span className="text-gray-700">{cat.skills.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Experience */}
                  {cvData.experience.length > 0 && (
                    <section>
                      <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 mb-4 pb-1">EXPERIENCE</h3>
                      <div className="space-y-6">
                        {cvData.experience.map((exp, idx) => (
                          <div key={idx} className="border-l-4 border-blue-600 pl-4 pb-4 last:pb-0">
                            <div className="flex justify-between items-baseline mb-2">
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg">{exp.role}</h4>
                                <p className="text-gray-700 font-semibold">{exp.company}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600 font-semibold">{exp.startDate} - {exp.endDate}</p>
                                <p className="text-sm text-gray-500">{exp.location}</p>
                              </div>
                            </div>
                            
                            {exp.projects.map((proj, pIdx) => (
                              <div key={pIdx} className="mt-3 ml-2">
                                <p className="font-semibold text-gray-800 text-sm">{proj.name}</p>
                                <p className="text-xs text-gray-600 italic">{proj.description}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                  <span className="font-semibold">Team:</span> {proj.teamSize}
                                </div>
                                <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                                  {proj.achievements.map((achievement, aIdx) => (
                                    <li key={aIdx}>{achievement}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Education */}
                  {cvData.education.length > 0 && (
                    <section>
                      <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 mb-4 pb-1">EDUCATION</h3>
                      <div className="space-y-3">
                        {cvData.education.map((edu, idx) => (
                          <div key={idx}>
                            <p className="font-bold text-gray-900">{edu.degree}</p>
                            <p className="text-gray-700">{edu.institution}</p>
                            {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Additional Info */}
                  {(cvData.profile.languages || cvData.profile.education) && (
                    <section>
                      <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 mb-4 pb-1">ADDITIONAL INFORMATION</h3>
                      {cvData.profile.education && (
                        <p className="text-gray-700 mb-2">{cvData.profile.education}</p>
                      )}
                      {cvData.profile.languages && (
                        <p className="text-gray-700"><span className="font-semibold">Languages:</span> {cvData.profile.languages}</p>
                      )}
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
