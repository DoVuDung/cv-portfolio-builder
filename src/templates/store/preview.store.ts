import { Store, Derived } from '@tanstack/store'
import type { PreviewSettings } from '../types/template.types'

// Initial state
const initialPreviewSettings: PreviewSettings = {
  zoom: 1,
  pageSize: 'A4',
  showGuides: false,
  mode: 'edit',
}

interface PreviewStoreState {
  settings: PreviewSettings
  isFullscreen: boolean
  showPrintPreview: boolean
}

const initialState: PreviewStoreState = {
  settings: initialPreviewSettings,
  isFullscreen: false,
  showPrintPreview: false,
}

// Create the store
export const previewStore = new Store<PreviewStoreState>(initialState)

// Derived: Computed zoom level
export const currentZoom = new Derived({
  fn: () => previewStore.state.settings.zoom,
  deps: [previewStore],
})

// Derived: Is in edit mode
export const isEditMode = new Derived({
  fn: () => previewStore.state.settings.mode === 'edit',
  deps: [previewStore],
})

// Actions
export const previewActions = {
  updateSettings(updates: Partial<PreviewSettings>) {
    previewStore.setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates,
      },
    }))
  },

  setZoom(zoom: number) {
    // Clamp between 0.5 and 2
    const clampedZoom = Math.min(2, Math.max(0.5, zoom))
    this.updateSettings({ zoom: clampedZoom })
  },

  setPageSize(pageSize: 'A4' | 'Letter' | 'Legal') {
    this.updateSettings({ pageSize })
  },

  toggleGuides() {
    previewStore.setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        showGuides: !prev.settings.showGuides,
      },
    }))
  },

  setMode(mode: 'edit' | 'preview' | 'print') {
    this.updateSettings({ mode })
  },

  toggleFullscreen() {
    previewStore.setState(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen,
    }))
  },

  togglePrintPreview() {
    previewStore.setState(prev => ({
      ...prev,
      showPrintPreview: !prev.showPrintPreview,
    }))
  },

  resetSettings() {
    previewStore.setState(prev => ({
      ...prev,
      settings: initialPreviewSettings,
    }))
  },
}

// Mount derived states
currentZoom.mount()
isEditMode.mount()
