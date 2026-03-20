import { useCallback } from 'react'
import { useStore } from '@tanstack/react-store'
import { previewStore, previewActions } from '../store/preview.store'
import type { PreviewSettings } from '../types/template.types'

/**
 * Hook to access preview functionality
 */
export function useCVPreview() {
  const settings = useStore(previewStore, (state) => state.settings)
  const isFullscreen = useStore(previewStore, (state) => state.isFullscreen)
  const showPrintPreview = useStore(previewStore, (state) => state.showPrintPreview)

  const updateSettings = useCallback((updates: Partial<PreviewSettings>) => {
    previewActions.updateSettings(updates)
  }, [])

  const setZoom = useCallback((zoom: number) => {
    previewActions.setZoom(zoom)
  }, [])

  const setPageSize = useCallback((pageSize: 'A4' | 'Letter' | 'Legal') => {
    previewActions.setPageSize(pageSize)
  }, [])

  const toggleGuides = useCallback(() => {
    previewActions.toggleGuides()
  }, [])

  const setMode = useCallback((mode: 'edit' | 'preview' | 'print') => {
    previewActions.setMode(mode)
  }, [])

  const toggleFullscreen = useCallback(() => {
    previewActions.toggleFullscreen()
  }, [])

  const togglePrintPreview = useCallback(() => {
    previewActions.togglePrintPreview()
  }, [])

  const resetSettings = useCallback(() => {
    previewActions.resetSettings()
  }, [])

  return {
    settings,
    isFullscreen,
    showPrintPreview,
    updateSettings,
    setZoom,
    setPageSize,
    toggleGuides,
    setMode,
    toggleFullscreen,
    togglePrintPreview,
    resetSettings,
  }
}
