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

interface ATSAnalysis {
  score: number
  keywords: Array<string>
  suggestions: Array<string>
  formatting: {
    hasContactInfo: boolean
    hasSummary: boolean
    hasSkills: boolean
    hasExperience: boolean
    hasEducation: boolean
    isReadable: boolean
  }
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
  const [showATSAnalysis, setShowATSAnalysis] = useState(false)
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null)
  const [targetJobDescription, setTargetJobDescription] = useState('')

  const handleSave = () => {
    localStorage.setItem('cv-data', JSON.stringify(cvData))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setIsEditing(false)
  }

  // ATS Analysis Functions
  const analyzeATS = () => {
    const analysis: ATSAnalysis = {
      score: 0,
      keywords: [],
      suggestions: [],
      formatting: {
        hasContactInfo: false,
        hasSummary: false,
        hasSkills: false,
        hasExperience: false,
        hasEducation: false,
        isReadable: false,
      },
    }

    let score = 0
    const maxScore = 100
    const suggestions: Array<string> = []
    const keywords: Array<string> = []

    // Check Contact Info (15 points)
    if (cvData.profile.email) {
      analysis.formatting.hasContactInfo = true
      score += 5
    } else {
      suggestions.push('⚠️ Add your email address')
    }
    
    if (cvData.profile.phone) {
      score += 5
    } else {
      suggestions.push('⚠️ Add your phone number')
    }
    
    if (cvData.profile.linkedin) {
      score += 5
    } else {
      suggestions.push('⚠️ Add your LinkedIn profile URL')
    }

    // Check Summary (15 points)
    if (cvData.profile.summary && cvData.profile.summary.length > 100) {
      analysis.formatting.hasSummary = true
      score += 15
      // Extract keywords from summary
      const summaryKeywords = ['React', 'Next.js', 'TypeScript', 'frontend', 'engineer', 'developer', 'experience']
      summaryKeywords.forEach(keyword => {
        if (cvData.profile.summary.toLowerCase().includes(keyword.toLowerCase())) {
          keywords.push(keyword)
        }
      })
    } else {
      suggestions.push('⚠️ Add a professional summary (at least 100 characters)')
    }

    // Check Skills (20 points)
    if (cvData.skills.length > 0) {
      analysis.formatting.hasSkills = true
      const totalSkills = cvData.skills.reduce((acc, cat) => acc + cat.skills.length, 0)
      if (totalSkills >= 10) {
        score += 20
        // Add top skills to keywords
        cvData.skills.slice(0, 3).forEach(cat => {
          cat.skills.slice(0, 3).forEach(skill => keywords.push(skill))
        })
      } else if (totalSkills >= 5) {
        score += 15
      } else {
        score += 10
      }
    } else {
      suggestions.push('⚠️ Add at least 5-10 relevant skills')
    }

    // Check Experience (25 points)
    if (cvData.experience.length > 0) {
      analysis.formatting.hasExperience = true
      const totalProjects = cvData.experience.reduce((acc, exp) => acc + exp.projects.length, 0)
      const totalAchievements = cvData.experience.reduce(
        (acc, exp) => acc + exp.projects.reduce((pAcc, proj) => pAcc + proj.achievements.length, 0),
        0
      )
      
      if (totalProjects >= 3 && totalAchievements >= 15) {
        score += 25
      } else if (totalProjects >= 2 && totalAchievements >= 8) {
        score += 20
      } else if (totalProjects >= 1 && totalAchievements >= 4) {
        score += 15
      } else {
        score += 10
      }

      if (totalAchievements < 15) {
        suggestions.push('💡 Add more quantifiable achievements with numbers and impact')
      }
    } else {
      suggestions.push('⚠️ Add at least one work experience')
    }

    // Check Education (10 points)
    if (cvData.education.length > 0) {
      analysis.formatting.hasEducation = true
      score += 10
    } else {
      suggestions.push('⚠️ Add your education background')
    }

    // Check Readability (15 points)
    const hasAllSections = 
      cvData.profile.name && 
      cvData.profile.title && 
      cvData.profile.summary.length > 100 &&
      cvData.skills.length > 0 &&
      cvData.experience.length > 0
    
    if (hasAllSections) {
      analysis.formatting.isReadable = true
      score += 15
    } else {
      suggestions.push('💡 Ensure all major sections are complete for better readability')
    }

    // Job Description Matching (if provided)
    if (targetJobDescription.trim()) {
      const jdKeywords = extractKeywords(targetJobDescription)
      const matchedKeywords = jdKeywords.filter(keyword => 
        cvData.profile.summary.toLowerCase().includes(keyword.toLowerCase()) ||
        cvData.skills.some(cat => cat.skills.some(s => s.toLowerCase().includes(keyword.toLowerCase())))
      )
      
      if (matchedKeywords.length > 0) {
        score += 10
        suggestions.push(`✅ Good! Your CV matches ${matchedKeywords.length} keywords from the job description`)
      } else {
        suggestions.push(`⚠️ Try to include more keywords from the job description: ${jdKeywords.slice(0, 5).join(', ')}`)
      }
    }

    analysis.score = Math.min(score, maxScore)
    analysis.suggestions = suggestions
    analysis.keywords = [...new Set(keywords)] // Remove duplicates

    setAtsAnalysis(analysis)
    setShowATSAnalysis(true)
  }

  const extractKeywords = (text: string): Array<string> => {
    const commonTechKeywords = [
      'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git',
      'REST', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis',
      'frontend', 'backend', 'full-stack', 'developer', 'engineer',
      'leader', 'lead', 'senior', 'junior', 'architect'
    ]
    
    return commonTechKeywords.filter(keyword =>
      text.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 75) return 'text-blue-600 bg-blue-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
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
              <Button onClick={analyzeATS} variant="outline" className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200">
                📊 ATS Score
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

      {/* ATS Analysis Modal */}
      {showATSAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">📊 ATS Compatibility Score</h2>
                  <p className="text-purple-100 mt-1">Applicant Tracking System Optimization</p>
                </div>
                <button
                  onClick={() => setShowATSAnalysis(false)}
                  className="text-white hover:text-gray-200 transition-colors text-3xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Score Display */}
              <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <div className={`inline-block px-8 py-6 rounded-full ${getATSScoreColor(atsAnalysis.score)}`}>
                  <span className="text-6xl font-bold">{atsAnalysis.score}</span>
                  <span className="text-2xl opacity-75">/100</span>
                </div>
                <p className="text-lg font-semibold mt-4 text-gray-700">
                  {atsAnalysis.score >= 90 && '🎉 Excellent! Your CV is highly ATS-friendly'}
                  {atsAnalysis.score >= 75 && atsAnalysis.score < 90 && '✅ Good job! Minor improvements needed'}
                  {atsAnalysis.score >= 60 && atsAnalysis.score < 75 && '⚠️ Fair, but needs improvement'}
                  {atsAnalysis.score < 60 && '❌ Needs significant work'}
                </p>
              </div>

              {/* Keywords Section */}
              {atsAnalysis.keywords.length > 0 && (
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🔑</span>
                    Detected Keywords ({atsAnalysis.keywords.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {atsAnalysis.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions Section */}
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">💡</span>
                  Improvement Suggestions
                </h3>
                {atsAnalysis.suggestions.length > 0 ? (
                  <ul className="space-y-3">
                    {atsAnalysis.suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className={`p-4 rounded-lg ${
                          suggestion.includes('✅')
                            ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
                            : suggestion.includes('⚠️')
                            ? 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500'
                            : 'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
                        }`}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-600 font-semibold">🎉 No suggestions! Your CV looks great!</p>
                )}
              </div>

              {/* Formatting Checklist */}
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">✓</span>
                  ATS Formatting Checklist
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Contact Information', value: atsAnalysis.formatting.hasContactInfo },
                    { label: 'Professional Summary', value: atsAnalysis.formatting.hasSummary },
                    { label: 'Skills Section', value: atsAnalysis.formatting.hasSkills },
                    { label: 'Work Experience', value: atsAnalysis.formatting.hasExperience },
                    { label: 'Education', value: atsAnalysis.formatting.hasEducation },
                    { label: 'Readable Format', value: atsAnalysis.formatting.isReadable },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        item.value ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <span className="font-semibold text-gray-700">{item.label}</span>
                      <span className="text-2xl">{item.value ? '✅' : '❌'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Description Matching */}
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  Job Description Keyword Matcher
                </h3>
                <textarea
                  value={targetJobDescription}
                  onChange={(e) => setTargetJobDescription(e.target.value)}
                  placeholder="Paste the job description here to check keyword matching..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={analyzeATS}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
                >
                  🔄 Re-analyze with Job Description
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowATSAnalysis(false)}
                className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
