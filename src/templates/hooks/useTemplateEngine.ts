import { useCallback } from 'react'
import { useStore } from '@tanstack/react-store'
import { templateStore, templateActions } from '../store/template.store'
import { templateRegistry } from '../core/template-registry'
import type { Template } from '../types/template.types'

/**
 * Hook to access template engine functionality
 */
export function useTemplateEngine() {
  const activeTemplate = useStore(templateStore, (state) => {
    if (!state.activeTemplateId) return null

    // Check custom templates first
    const custom = state.customTemplates.find((t) => t.id === state.activeTemplateId)
    if (custom) return custom

    // Then check registry
    return templateRegistry.getTemplate(state.activeTemplateId)
  })

  const allTemplates = useStore(templateStore, (state) => [
    ...templateRegistry.getAllTemplates(),
    ...state.customTemplates,
  ])

  const setActiveTemplate = useCallback((templateId: string) => {
    templateActions.setActiveTemplate(templateId)
  }, [])

  const addCustomTemplate = useCallback((template: Template) => {
    templateActions.addCustomTemplate(template)
  }, [])

  const updateCustomTemplate = useCallback((templateId: string, updates: Partial<Template>) => {
    templateActions.updateCustomTemplate(templateId, updates)
  }, [])

  const removeCustomTemplate = useCallback((templateId: string) => {
    templateActions.removeCustomTemplate(templateId)
  }, [])

  const getTemplatesByCategory = useCallback((category: string) => {
    return templateRegistry.getByCategory(category)
  }, [])

  return {
    activeTemplate,
    allTemplates,
    setActiveTemplate,
    addCustomTemplate,
    updateCustomTemplate,
    removeCustomTemplate,
    getTemplatesByCategory,
  }
}
