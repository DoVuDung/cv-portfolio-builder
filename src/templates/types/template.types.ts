import type { CV } from './cv.types'

// Layout types
export type LayoutType = 'single-column' | 'two-column-left' | 'two-column-right'

// Section position in layout
export type SectionPosition = 'main' | 'left' | 'right'

// Theme interface
export interface Theme {
  id: string
  name: string
  fontFamily: string
  fontSize: {
    base: string
    heading: string
    small: string
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
    border: string
  }
  spacing: {
    section: string
    item: string
  }
}

// Section configuration
export interface SectionConfig {
  key: keyof CV | string
  component: React.ComponentType<any>
  position: SectionPosition
  order: number
  props?: Record<string, any>
}

// Template definition
export interface Template {
  id: string
  name: string
  description?: string
  layout: LayoutType
  sections: SectionConfig[]
  theme: Theme | string // Can reference theme by ID or provide full theme object
  pageSize: 'A4' | 'Letter' | 'Legal'
  createdAt?: Date
  updatedAt?: Date
}

// Template registry entry
export interface TemplateRegistryEntry {
  template: Template
  thumbnail?: string
  tags: string[]
  category: 'professional' | 'creative' | 'minimal' | 'academic'
}

// Preview settings
export interface PreviewSettings {
  zoom: number
  pageSize: 'A4' | 'Letter' | 'Legal'
  showGuides: boolean
  mode: 'edit' | 'preview' | 'print'
}

// Export control for sections
export interface ExportOptions {
  format: 'pdf' | 'png' | 'html'
  quality?: number
  includeMetadata?: boolean
}
