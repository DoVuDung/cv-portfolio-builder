import type { Template } from '../types/template.types'
import { ProfileSection, ExperienceSection, EducationSection, SkillsSection, ProjectSection } from '../sections'
import { professionalTheme } from '../themes'

// Harvard Template - Classic academic single-column format
export const harvardTemplate: Template = {
  id: 'harvard',
  name: 'Harvard',
  description: 'Classic academic format with education focus',
  layout: 'single-column',
  pageSize: 'Letter',
  sections: [
    {
      key: 'profile',
      component: ProfileSection,
      position: 'main',
      order: 0,
    },
    {
      key: 'education',
      component: EducationSection,
      position: 'main',
      order: 1,
    },
    {
      key: 'experience',
      component: ExperienceSection,
      position: 'main',
      order: 2,
    },
    {
      key: 'skills',
      component: SkillsSection,
      position: 'main',
      order: 3,
    },
    {
      key: 'projects',
      component: ProjectSection,
      position: 'main',
      order: 4,
    },
  ],
  theme: professionalTheme,
}
