# Resume Template Engine - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Import the System

```typescript
import {
  TemplateRenderer,
  useTemplateEngine,
  harvardTemplate,
  sidebarTemplate,
  templateRegistry,
} from '@/templates'
import { useCVData } from '@/hooks/use-cv-agent'
```

---

### Step 2: Basic Usage Example

```tsx
import React from 'react'
import { TemplateRenderer } from '@/templates'
import { useCVData } from '@/hooks/use-cv-agent'
import { harvardTemplate } from '@/templates/examples/harvard.template'

function SimpleResumePreview() {
  const { cv } = useCVData()

  return (
    <div className="p-8">
      <h1>My Resume</h1>

      {cv && <TemplateRenderer template={harvardTemplate} cvData={cv} />}
    </div>
  )
}

export default SimpleResumePreview
```

---

### Step 3: Template Switching

```tsx
import React, { useState } from 'react'
import { TemplateRenderer, useTemplateEngine } from '@/templates'
import { useCVData } from '@/hooks/use-cv-agent'

function ResumeWithSwitcher() {
  const { cv } = useCVData()
  const { activeTemplate, setActiveTemplate, allTemplates } = useTemplateEngine()

  return (
    <div>
      {/* Template Selector */}
      <div className="controls p-4 bg-gray-100">
        <label>Select Template:</label>
        <select
          value={activeTemplate?.id || ''}
          onChange={(e) => setActiveTemplate(e.target.value)}
          className="ml-2 p-2 border rounded"
        >
          <option value="">Choose a template...</option>
          {allTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {/* Preview */}
      {activeTemplate && cv && <TemplateRenderer template={activeTemplate} cvData={cv} />}
    </div>
  )
}
```

---

### Step 4: Preview Controls

```tsx
import React from 'react'
import { TemplateRenderer } from '@/templates'
import { useCVData } from '@/hooks/use-cv-agent'
import { useCVPreview } from '@/templates/hooks/useCVPreview'
import { harvardTemplate } from '@/templates/examples/harvard.template'

function ResumeWithControls() {
  const { cv } = useCVData()
  const { settings, setZoom, setPageSize, toggleFullscreen } = useCVPreview()

  return (
    <div>
      {/* Control Panel */}
      <div className="controls flex gap-4 p-4 bg-gray-100">
        <button onClick={() => setZoom(settings.zoom - 0.1)}>Zoom Out</button>
        <span>Zoom: {Math.round(settings.zoom * 100)}%</span>
        <button onClick={() => setZoom(settings.zoom + 0.1)}>Zoom In</button>

        <select value={settings.pageSize} onChange={(e) => setPageSize(e.target.value as any)}>
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
          <option value="Legal">Legal</option>
        </select>

        <button onClick={toggleFullscreen}>Fullscreen</button>
      </div>

      {/* Preview with Zoom */}
      <div
        className="preview-container"
        style={{
          transform: `scale(${settings.zoom})`,
          transformOrigin: 'top center',
        }}
      >
        {cv && <TemplateRenderer template={harvardTemplate} cvData={cv} />}
      </div>
    </div>
  )
}
```

---

## 📋 Available Templates

### Harvard Template

- **Layout**: Single column
- **Best For**: Academic, traditional industries
- **Sections**: Profile → Education → Experience → Skills → Projects
- **Theme**: Professional (serif fonts, conservative colors)

```typescript
import { harvardTemplate } from '@/templates/examples/harvard.template'
```

### Sidebar Template

- **Layout**: Two columns (sidebar left)
- **Best For**: Tech industry, modern companies
- **Sections**:
  - Left: Profile, Skills, Education
  - Right: Experience, Projects
- **Theme**: Modern (sans-serif, blue accent)

```typescript
import { sidebarTemplate } from '@/templates/examples/sidebar.template'
```

---

## 🎨 Theme System

### Using Pre-built Themes

```typescript
import { themes } from '@/templates/themes'

// Access any theme
const modernTheme = themes.modern
const professionalTheme = themes.professional
const creativeTheme = themes.creative
const minimalTheme = themes.minimal
```

### Creating Custom Themes

```typescript
import type { Theme } from '@/templates/types/template.types'

const myCustomTheme: Theme = {
  id: 'my-theme',
  name: 'My Custom Theme',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: {
    base: '14px',
    heading: '24px',
    small: '12px',
  },
  colors: {
    primary: '#7c3aed', // Purple
    secondary: '#64748b', // Gray
    accent: '#f59e0b', // Amber
    text: '#1f2937', // Dark gray
    background: '#ffffff', // White
    border: '#e5e7eb', // Light gray
  },
  spacing: {
    section: '2rem',
    item: '1rem',
  },
}
```

---

## 🔧 Creating Custom Templates

### Example: Creative Template

```typescript
import type { Template } from '@/templates/types/template.types'
import { ProfileSection, ExperienceSection, SkillsSection } from '@/templates/sections'
import { creativeTheme } from '@/templates/themes'

const creativeTemplate: Template = {
  id: 'creative',
  name: 'Creative',
  description: 'Bold design for creative professionals',
  layout: 'two-column-right',
  pageSize: 'A4',
  sections: [
    {
      key: 'profile',
      component: ProfileSection,
      position: 'main',
      order: 0,
      props: { showPhoto: true },
    },
    {
      key: 'skills',
      component: SkillsSection,
      position: 'left',
      order: 0,
    },
    {
      key: 'experience',
      component: ExperienceSection,
      position: 'main',
      order: 1,
    },
  ],
  theme: creativeTheme,
}

// Register it
import { templateRegistry } from '@/templates/core/template-registry'

templateRegistry.register({
  template: creativeTemplate,
  category: 'creative',
  tags: ['bold', 'colorful', 'design'],
})
```

---

## 💡 Advanced Features

### Dynamic Section Ordering

```typescript
import { templateActions } from '@/templates/store/template.store'

// Change section order for a specific template
templateActions.setSectionOrder('harvard', [
  0, // profile
  2, // experience (moved before education)
  1, // education
  3, // skills
  4, // projects
])
```

### Custom Templates

```typescript
import { templateActions } from '@/templates/store/template.store'
import type { Template } from '@/templates/types/template.types'

const myTemplate: Template = {
  // ... define template
}

// Add to store
templateActions.addCustomTemplate(myTemplate)

// Set as active
templateActions.setActiveTemplate(myTemplate.id)
```

### Export CV Data

```typescript
import { useCVData } from '@/hooks/use-cv-agent'

function ExportButton() {
  const { cv } = useCVData()

  const handleExport = () => {
    const json = JSON.stringify(cv, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'my-cv.json'
    a.click()

    URL.revokeObjectURL(url)
  }

  return <button onClick={handleExport}>Export CV</button>
}
```

---

## 🎯 Best Practices

### 1. Use Memoization

All section components are already memoized with React.memo. Don't wrap them again.

### 2. Selective Subscriptions

Subscribe only to the CV data you need:

```typescript
// Good - specific subscription
const skills = useStore(cvStore, (state) => state.cv.skills)

// Avoid - subscribes to entire CV
const cv = useStore(cvStore, (state) => state.cv)
```

### 3. Theme Consistency

Keep themes consistent across templates. Use the same color palette and typography.

### 4. Print Optimization

Always test your templates in print mode:

```typescript
const { setMode } = useCVPreview()
setMode('print') // Shows print preview
```

---

## 🔌 Integration Examples

### With Existing Agent System

```typescript
import { useCVAgent, useCVData } from '@/hooks/use-cv-agent'
import { TemplateRenderer, useTemplateEngine } from '@/templates'

function IntegratedResumeBuilder() {
  const { cv, completeness } = useCVData()
  const { executeTool } = useCVAgent()
  const { activeTemplate } = useTemplateEngine()

  return (
    <div>
      {/* Show completeness score */}
      <div>CV Completeness: {completeness}%</div>

      {/* Run analysis tool */}
      <button onClick={() => executeTool('analyzeCV', undefined)}>
        Analyze My Resume
      </button>

      {/* Render resume */}
      {activeTemplate && cv && (
        <TemplateRenderer
          template={activeTemplate}
          cvData={cv}
        />
      )}
    </div>
  )
}
```

### Standalone Usage

If you want to use the template engine independently:

```typescript
import { TemplateRenderer, harvardTemplate } from '@/templates'

function StandaloneExample() {
  const myCVData = {
    profile: {
      name: 'John Doe',
      title: 'Software Engineer',
      summary: 'Experienced developer...',
      location: 'San Francisco, CA',
      contact: {
        email: 'john@example.com',
        github: 'johndoe',
        linkedin: 'johndoe',
      },
    },
    skills: ['React', 'TypeScript', 'Node.js'],
    experience: [...],
    projects: [...],
    education: [...],
  }

  return (
    <TemplateRenderer
      template={harvardTemplate}
      cvData={myCVData}
    />
  )
}
```

---

## 📊 Performance Tips

### 1. Lazy Load Templates

```typescript
const HeavyTemplate = lazy(() => import('@/templates/examples/heavy.template'))
```

### 2. Debounce Rapid Changes

```typescript
import { debounce } from 'lodash'

const debouncedSetZoom = debounce((zoom) => {
  setZoom(zoom)
}, 100)
```

### 3. Use Derived States

```typescript
// Already provided by the system
const currentZoom = useStore(currentZoom)
const isEditMode = useStore(isEditMode)
```

---

## 🐛 Troubleshooting

### Template Not Rendering

- Check that template ID matches
- Ensure CV data is loaded
- Verify section components are imported

### Styles Not Applying

- Make sure CSS variables are defined
- Check Tailwind config
- Verify theme object structure

### State Not Updating

- Ensure you're using TanStack Store hooks correctly
- Check that stores are mounted
- Verify derived states dependencies

---

## 📚 Additional Resources

- **Technical Summary**: See `RESUME_TEMPLATE_ENGINE_SUMMARY.md`
- **Type Definitions**: `/src/templates/types/template.types.ts`
- **Example Templates**: `/src/templates/examples/`
- **Store Documentation**: TanStack Store docs

---

Happy building! 🚀
