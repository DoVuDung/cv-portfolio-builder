import { Store, Derived } from '@tanstack/store'
import type { Template } from '../types/template.types'

// Initial state
interface TemplateStoreState {
  activeTemplateId: string | null
  customTemplates: Template[]
  sectionOrder: Record<string, number[]> // templateId -> section order
  isCustomizing: boolean
}

const initialState: TemplateStoreState = {
  activeTemplateId: null,
  customTemplates: [],
  sectionOrder: {},
  isCustomizing: false,
}

// Create the store
export const templateStore = new Store<TemplateStoreState>(initialState)

// Derived: Active template
export const activeTemplate = new Derived({
  fn: () => {
    const state = templateStore.state
    if (!state.activeTemplateId) return null
    
    // First check custom templates
    const custom = state.customTemplates.find(
      t => t.id === state.activeTemplateId
    )
    
    if (custom) return custom
    
    // Then check registered templates (will be loaded from registry)
    return null
  },
  deps: [templateStore],
})

// Derived: Is template selected
export const hasActiveTemplate = new Derived({
  fn: () => templateStore.state.activeTemplateId !== null,
  deps: [templateStore],
})

// Actions
export const templateActions = {
  setActiveTemplate(templateId: string) {
    templateStore.setState(prev => ({
      ...prev,
      activeTemplateId: templateId,
    }))
  },

  addCustomTemplate(template: Template) {
    templateStore.setState(prev => ({
      ...prev,
      customTemplates: [...prev.customTemplates, template],
    }))
  },

  updateCustomTemplate(templateId: string, updates: Partial<Template>) {
    templateStore.setState(prev => ({
      ...prev,
      customTemplates: prev.customTemplates.map(t =>
        t.id === templateId ? { ...t, ...updates } : t
      ),
    }))
  },

  removeCustomTemplate(templateId: string) {
    templateStore.setState(prev => ({
      ...prev,
      customTemplates: prev.customTemplates.filter(t => t.id !== templateId),
      activeTemplateId: prev.activeTemplateId === templateId ? null : prev.activeTemplateId,
    }))
  },

  setSectionOrder(templateId: string, order: number[]) {
    templateStore.setState(prev => ({
      ...prev,
      sectionOrder: {
        ...prev.sectionOrder,
        [templateId]: order,
      },
    }))
  },

  toggleCustomizing(isCustomizing: boolean) {
    templateStore.setState(prev => ({
      ...prev,
      isCustomizing,
    }))
  },

  resetToDefaults() {
    templateStore.setState(initialState)
  },
}

// Mount derived states
activeTemplate.mount()
hasActiveTemplate.mount()
