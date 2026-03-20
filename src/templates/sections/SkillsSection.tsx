import React from 'react'

interface SkillsSectionProps {
  data: string[]
}

export const SkillsSection: React.FC<SkillsSectionProps> = React.memo(({ data }) => {
  if (!data || data.length === 0) return null

  return (
    <section className="skills-section">
      <h2 className="section-title">Skills</h2>

      <div className="skills-list">
        {data.map((skill, index) => (
          <span key={index} className="skill-item">
            {skill}
          </span>
        ))}
      </div>
    </section>
  )
})

SkillsSection.displayName = 'SkillsSection'
