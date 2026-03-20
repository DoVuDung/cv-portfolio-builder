import React from 'react'
import type { Project } from '../../types/cv.types'

interface ProjectSectionProps {
  data: Project[]
}

export const ProjectSection: React.FC<ProjectSectionProps> = React.memo(({ data }) => {
  if (!data || data.length === 0) return null

  return (
    <section className="project-section">
      <h2 className="section-title">Projects</h2>

      <div className="project-list">
        {data.map((project, index) => (
          <div key={index} className="project-item">
            <h3 className="project-name">{project.name}</h3>

            {project.description && <p className="project-description">{project.description}</p>}

            {project.highlights && project.highlights.length > 0 && (
              <ul className="project-highlights">
                {project.highlights.map((highlight, idx) => (
                  <li key={idx} className="highlight-item">
                    {highlight}
                  </li>
                ))}
              </ul>
            )}

            {project.techStack && project.techStack.length > 0 && (
              <div className="project-techstack">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
})

ProjectSection.displayName = 'ProjectSection'
