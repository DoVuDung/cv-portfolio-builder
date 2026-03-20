import React from 'react'
import type { CV } from '../../types/cv.types'
import type { SectionConfig } from '../../types/template.types'

interface SingleColumnLayoutProps {
  sections: SectionConfig[]
  cvData: CV
  theme?: Record<string, string>
}

export const SingleColumnLayout: React.FC<SingleColumnLayoutProps> = React.memo(({
  sections,
  cvData,
  theme,
}) => {
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order)

  return (
    <div 
      className="resume-container single-column"
      style={theme}
    >
      <div className="resume-content">
        {sortedSections.map((sectionConfig) => {
          const SectionComponent = sectionConfig.component
          const dataKey = sectionConfig.key as keyof CV
          
          return (
            <div 
              key={sectionConfig.key}
              className="resume-section"
            >
              <SectionComponent 
                data={cvData[dataKey]}
                {...sectionConfig.props}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
})

SingleColumnLayout.displayName = 'SingleColumnLayout'
