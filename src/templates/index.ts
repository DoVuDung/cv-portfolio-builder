// Types
export type { CV, CVWithMeta } from './types/cv.types'
export type {
  Template,
  SectionConfig,
  Theme,
  LayoutType,
  SectionPosition,
  PreviewSettings,
  TemplateRegistryEntry,
  ExportOptions,
} from './types/template.types'

// Store
export {
  templateStore,
  activeTemplate,
  hasActiveTemplate,
  templateActions,
} from './store/template.store'
export { previewStore, currentZoom, isEditMode, previewActions } from './store/preview.store'

// Layouts
export { SingleColumnLayout } from './layouts/SingleColumnLayout'
export { TwoColumnLayout } from './layouts/TwoColumnLayout'

// Sections
export * from './sections'

// Core
export { TemplateRenderer } from './core/TemplateRenderer'
export { templateRegistry } from './core/template-registry'

// Themes
export * from './themes'

// Hooks
export { useTemplateEngine } from './hooks/useTemplateEngine'
export { useCVPreview } from './hooks/useCVPreview'

// Examples
export { harvardTemplate } from './examples/harvard.template'
export { sidebarTemplate } from './examples/sidebar.template'
