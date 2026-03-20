import type { Theme } from '../types/template.types'

export const modernTheme: Theme = {
  id: 'modern',
  name: 'Modern',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: {
    base: '14px',
    heading: '24px',
    small: '12px',
  },
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#0ea5e9',
    text: '#1e293b',
    background: '#ffffff',
    border: '#e2e8f0',
  },
  spacing: {
    section: '2rem',
    item: '1rem',
  },
}

export const professionalTheme: Theme = {
  id: 'professional',
  name: 'Professional',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontSize: {
    base: '13px',
    heading: '22px',
    small: '11px',
  },
  colors: {
    primary: '#1e40af',
    secondary: '#475569',
    accent: '#0369a1',
    text: '#0f172a',
    background: '#ffffff',
    border: '#cbd5e1',
  },
  spacing: {
    section: '1.75rem',
    item: '0.875rem',
  },
}

export const creativeTheme: Theme = {
  id: 'creative',
  name: 'Creative',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: {
    base: '15px',
    heading: '28px',
    small: '13px',
  },
  colors: {
    primary: '#7c3aed',
    secondary: '#db2777',
    accent: '#f59e0b',
    text: '#1f2937',
    background: '#fefefe',
    border: '#f3f4f6',
  },
  spacing: {
    section: '2.5rem',
    item: '1.25rem',
  },
}

export const minimalTheme: Theme = {
  id: 'minimal',
  name: 'Minimal',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  fontSize: {
    base: '14px',
    heading: '20px',
    small: '12px',
  },
  colors: {
    primary: '#000000',
    secondary: '#6b7280',
    accent: '#9ca3af',
    text: '#111827',
    background: '#ffffff',
    border: '#f9fafb',
  },
  spacing: {
    section: '2rem',
    item: '1rem',
  },
}

// Export all themes
export const themes: Record<string, Theme> = {
  modern: modernTheme,
  professional: professionalTheme,
  creative: creativeTheme,
  minimal: minimalTheme,
}
