import type { Template, TemplateRegistryEntry } from '../types/template.types'

// Global template registry
class TemplateRegistry {
  private static instance: TemplateRegistry | null = null
  private templates: Map<string, TemplateRegistryEntry> = new Map()

  private constructor() {}

  static getInstance(): TemplateRegistry {
    if (!TemplateRegistry.instance) {
      TemplateRegistry.instance = new TemplateRegistry()
    }
    return TemplateRegistry.instance
  }

  /**
   * Register a template
   */
  register(entry: TemplateRegistryEntry): void {
    this.templates.set(entry.template.id, entry)
  }

  /**
   * Get a template by ID
   */
  getTemplate(id: string): Template | null {
    const entry = this.templates.get(id)
    return entry ? entry.template : null
  }

  /**
   * Get all templates
   */
  getAllTemplates(): Array<Template> {
    return Array.from(this.templates.values()).map(entry => entry.template)
  }

  /**
   * Get templates by category
   */
  getByCategory(category: string): Array<Template> {
    return Array.from(this.templates.values())
      .filter(entry => entry.category === category)
      .map(entry => entry.template)
  }

  /**
   * Search templates by tags
   */
  searchByTags(tags: Array<string>): Array<Template> {
    return Array.from(this.templates.values())
      .filter(entry => 
        tags.some(tag => entry.tags.includes(tag))
      )
      .map(entry => entry.template)
  }

  /**
   * Check if template exists
   */
  hasTemplate(id: string): boolean {
    return this.templates.has(id)
  }

  /**
   * Remove a template
   */
  removeTemplate(id: string): void {
    this.templates.delete(id)
  }

  /**
   * Get template metadata
   */
  getTemplateMetadata(id: string): Omit<TemplateRegistryEntry, 'template'> | null {
    const entry = this.templates.get(id)
    if (!entry) return null
    
    const { template, ...metadata } = entry
    return metadata
  }

  /**
   * List all registered template IDs
   */
  listTemplateIds(): Array<string> {
    return Array.from(this.templates.keys())
  }
}

// Export singleton instance
export const templateRegistry = TemplateRegistry.getInstance()
