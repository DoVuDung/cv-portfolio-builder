import React from 'react'
import type { Experience } from '../../types/cv.types'

interface ExperienceSectionProps {
  data: Experience[]
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = React.memo(({ data }) => {
  if (!data || data.length === 0) return null

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <section className="experience-section">
      <h2 className="section-title">Experience</h2>
      
      <div className="experience-list">
        {data.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <div>
                <h3 className="experience-role">{exp.role}</h3>
                <p className="experience-company">{exp.company}</p>
              </div>
              <div className="experience-dates">
                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
              </div>
            </div>

            {exp.achievements && exp.achievements.length > 0 && (
              <ul className="experience-achievements">
                {exp.achievements.map((achievement, idx) => (
                  <li key={idx} className="achievement-item">{achievement}</li>
                ))}
              </ul>
            )}

            {exp.techStack && exp.techStack.length > 0 && (
              <div className="experience-techstack">
                {exp.techStack.map((tech, idx) => (
                  <span key={idx} className="tech-badge">{tech}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
})

ExperienceSection.displayName = 'ExperienceSection'
