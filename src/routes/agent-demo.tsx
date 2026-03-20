import { createRoute } from '@tanstack/react-router'
import { AgentProvider } from '../components/AgentProvider'
import { AgentChat } from '../components/agent/AgentChat'
import { CVDashboard } from '../components/agent/CVDashboard'
import type { RootRoute } from '@tanstack/react-router'

export function AgentDemoRoute(rootRoute: RootRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: '/agent-demo',
    component: AgentDemo,
  })
}

export default AgentDemoRoute

function AgentDemo() {
  return (
    <AgentProvider>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">CV Portfolio Skill Agent</h1>
            <p className="text-gray-600">
              MCP-based intelligent agent for CV and portfolio management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Dashboard */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
              <CVDashboard />
            </div>

            {/* Right Column - Chat Interface */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Assistant</h2>
              <AgentChat />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Available Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded">
                <h3 className="font-semibold text-blue-900">Profile Tools</h3>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• updateProfile</li>
                  <li>• generateSummary</li>
                  <li>• optimizeContact</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <h3 className="font-semibold text-green-900">Experience Tools</h3>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• addExperience</li>
                  <li>• enhanceAchievements</li>
                  <li>• suggestTechStack</li>
                </ul>
              </div>
              <div className="p-4 bg-purple-50 rounded">
                <h3 className="font-semibold text-purple-900">Project Tools</h3>
                <ul className="text-sm text-purple-700 mt-2 space-y-1">
                  <li>• addProject</li>
                  <li>• generateHighlights</li>
                  <li>• linkToSkills</li>
                </ul>
              </div>
              <div className="p-4 bg-orange-50 rounded">
                <h3 className="font-semibold text-orange-900">Skills Tools</h3>
                <ul className="text-sm text-orange-700 mt-2 space-y-1">
                  <li>• addSkill</li>
                  <li>• categorizeSkills</li>
                  <li>• identifyGaps</li>
                </ul>
              </div>
              <div className="p-4 bg-red-50 rounded">
                <h3 className="font-semibold text-red-900">Analysis Tools</h3>
                <ul className="text-sm text-red-700 mt-2 space-y-1">
                  <li>• analyzeCV</li>
                  <li>• keywordOptimization</li>
                  <li>• consistencyCheck</li>
                </ul>
              </div>
              <div className="p-4 bg-indigo-50 rounded">
                <h3 className="font-semibold text-indigo-900">AI Services</h3>
                <ul className="text-sm text-indigo-700 mt-2 space-y-1">
                  <li>• Summary Generation</li>
                  <li>• Achievement Enhancement</li>
                  <li>• Gap Analysis</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Architecture Info */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">MCP Architecture</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Tools (Functions)</h3>
                <p className="text-gray-600">
                  15 specialized tools organized into 5 categories for managing all aspects of CV 
                  and portfolio data. Each tool is idempotent, validated, and provides detailed feedback.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Memory (State)</h3>
                <p className="text-gray-600">
                  TanStack Store provides reactive state management with derived states for computed 
                  values like completeness score and skill categorization.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Context (User Profile)</h3>
                <p className="text-gray-600">
                  Context Manager maintains user-specific information including job targets, domain, 
                  experience level, and application goals to personalize suggestions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI Service Integration</h3>
                <p className="text-gray-600">
                  Pluggable AI provider abstraction allows switching between different AI services 
                  (OpenAI, Anthropic, local models) without code changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AgentProvider>
  )
}
