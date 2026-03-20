import React from 'react'
import { useTemplateEngine } from '@/templates'
import type { Template } from '@/templates/types/template.types'
import { Button } from './ui/button'

interface TemplateSwitcherProps {
  onSelectTemplate?: (templateId: string) => void
}

export function TemplateSwitcher({ onSelectTemplate }: TemplateSwitcherProps) {
  const { allTemplates, activeTemplate, setActiveTemplate } = useTemplateEngine()

  const handleSelect = (templateId: string) => {
    setActiveTemplate(templateId)
    onSelectTemplate?.(templateId)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Choose Template</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {allTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelect(template.id)}
            className={`p-4 border-2 rounded-lg transition-all ${
              activeTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-sm font-medium text-gray-900">{template.name}</div>
            <div className="text-xs text-gray-500 mt-1">{template.category}</div>
          </button>
        ))}
      </div>

      {activeTemplate && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <div className="font-medium text-gray-700">Current: {activeTemplate.name}</div>
          <div className="text-gray-500 text-xs mt-1">
            Layout: {activeTemplate.layout} • Sections: {activeTemplate.sections.length}
          </div>
        </div>
      )}
    </div>
  )
}
