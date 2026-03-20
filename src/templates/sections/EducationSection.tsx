import React from 'react'
import type { Education } from '../../types/cv.types'

interface EducationSectionProps {
  data: Education[]
}

export const EducationSection: React.FC<EducationSectionProps> = React.memo(({ data }) => {
  if (!data || data.length === 0) return null

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <section className="education-section">
      <h2 className="section-title">Education</h2>
      
      <div className="education-list">
        {data.map((edu, index) => (
          <div key={index} className="education-item">
            <div className="education-header">
              <div>
                <h3 className="education-degree">{edu.degree}</h3>
                {edu.field && <p className="education-field">{edu.field}</p>}
                <p className="education-institution">{edu.institution}</p>
              </div>
              <div className="education-dates">
                {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
              </div>
            </div>

            {edu.gpa && (
              <p className="education-gpa">GPA: {edu.gpa}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
})

EducationSection.displayName = 'EducationSection'
