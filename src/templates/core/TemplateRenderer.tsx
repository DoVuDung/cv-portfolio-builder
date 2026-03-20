import React from 'react'
import type { CV } from '../types/cv.types'
import type { Template, Theme } from '../types/template.types'
import { SingleColumnLayout } from '../layouts/SingleColumnLayout'
import { TwoColumnLayout } from '../layouts/TwoColumnLayout'

interface TemplateRendererProps {
  template: Template
  cvData: CV
  theme?: Theme
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = React.memo(
  ({ template, cvData, theme }) => {
    // Convert theme to CSS variables
    const cssVariables = theme ? convertThemeToCSS(theme) : {}

    // Separate sections by position
    const leftSections = template.sections.filter((s) => s.position === 'left')
    const rightSections = template.sections.filter((s) => s.position === 'right')
    const mainSections = template.sections.filter((s) => s.position === 'main')

    // Render based on layout type
    switch (template.layout) {
      case 'single-column':
        return <SingleColumnLayout sections={mainSections} cvData={cvData} theme={cssVariables} />

      case 'two-column-left':
        return (
          <TwoColumnLayout
            leftSections={leftSections}
            rightSections={mainSections}
            cvData={cvData}
            theme={cssVariables}
          />
        )

      case 'two-column-right':
        return (
          <TwoColumnLayout
            leftSections={mainSections}
            rightSections={leftSections}
            cvData={cvData}
            theme={cssVariables}
          />
        )

      default:
        // Fallback to single column
        return <SingleColumnLayout sections={mainSections} cvData={cvData} theme={cssVariables} />
    }
  }
)

TemplateRenderer.displayName = 'TemplateRenderer'

// Helper function to convert theme to CSS variables
function convertThemeToCSS(theme: Theme): Record<string, string> {
  return {
    '--resume-font-family': theme.fontFamily,
    '--resume-font-size-base': theme.fontSize.base,
    '--resume-font-size-heading': theme.fontSize.heading,
    '--resume-font-size-small': theme.fontSize.small,
    '--resume-color-primary': theme.colors.primary,
    '--resume-color-secondary': theme.colors.secondary,
    '--resume-color-accent': theme.colors.accent,
    '--resume-color-text': theme.colors.text,
    '--resume-color-background': theme.colors.background,
    '--resume-color-border': theme.colors.border,
    '--resume-spacing-section': theme.spacing.section,
    '--resume-spacing-item': theme.spacing.item,
  }
}
