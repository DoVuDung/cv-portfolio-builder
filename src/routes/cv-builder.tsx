import { createRoute } from '@tanstack/react-router'
import { CVBuilder } from '../components/CVBuilder'
import type { RootRoute } from '@tanstack/react-router'

function CVBuilderPage() {
  return <CVBuilder />
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/cv-builder',
    component: CVBuilderPage,
    getParentRoute: () => parentRoute,
  })
