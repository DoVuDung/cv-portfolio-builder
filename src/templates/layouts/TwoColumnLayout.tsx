import React from 'react'
import type { CV } from '../../types/cv.types'
import type { SectionConfig } from '../../types/template.types'

interface TwoColumnLayoutProps {
  leftSections: SectionConfig[]
  rightSections: SectionConfig[]
  cvData: CV
  theme?: Record<string, string>
  sidebarWidth?: string
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = React.memo(
  ({ leftSections, rightSections, cvData, theme, sidebarWidth = '280px' }) => {
    // Sort sections by order
    const sortedLeftSections = [...leftSections].sort((a, b) => a.order - b.order)
    const sortedRightSections = [...rightSections].sort((a, b) => a.order - b.order)

    return (
      <div className="resume-container two-column" style={theme}>
        <aside className="resume-sidebar" style={{ width: sidebarWidth }}>
          {sortedLeftSections.map((sectionConfig) => {
            const SectionComponent = sectionConfig.component
            const dataKey = sectionConfig.key as keyof CV

            return (
              <div key={`left-${sectionConfig.key}`} className="resume-section resume-section-left">
                <SectionComponent data={cvData[dataKey]} {...sectionConfig.props} />
              </div>
            )
          })}
        </aside>

        <main className="resume-main">
          {sortedRightSections.map((sectionConfig) => {
            const SectionComponent = sectionConfig.component
            const dataKey = sectionConfig.key as keyof CV

            return (
              <div
                key={`right-${sectionConfig.key}`}
                className="resume-section resume-section-right"
              >
                <SectionComponent data={cvData[dataKey]} {...sectionConfig.props} />
              </div>
            )
          })}
        </main>
      </div>
    )
  }
)

TwoColumnLayout.displayName = 'TwoColumnLayout'
