import type { Template } from '../types/template.types'
import {
  ProfileSection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  ProjectSection,
} from '../sections'
import { modernTheme } from '../themes'

// Sidebar Template - Modern two-column tech industry style
export const sidebarTemplate: Template = {
  id: 'sidebar',
  name: 'Sidebar',
  description: 'Modern tech industry format with sidebar for quick info',
  layout: 'two-column-left',
  pageSize: 'A4',
  sections: [
    // Left sidebar sections
    {
      key: 'profile',
      component: ProfileSection,
      position: 'left',
      order: 0,
      props: { compact: true },
    },
    {
      key: 'skills',
      component: SkillsSection,
      position: 'left',
      order: 1,
    },
    {
      key: 'education',
      component: EducationSection,
      position: 'left',
      order: 2,
    },
    // Right main content sections
    {
      key: 'experience',
      component: ExperienceSection,
      position: 'main',
      order: 0,
    },
    {
      key: 'projects',
      component: ProjectSection,
      position: 'main',
      order: 1,
    },
  ],
  theme: modernTheme,
}
