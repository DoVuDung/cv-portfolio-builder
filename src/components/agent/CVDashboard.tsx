import React from 'react'
import { useCVData, useCVAgent } from '../hooks/use-cv-agent'

/**
 * CV Dashboard Widget - Quick overview and actions
 */
export function CVDashboard() {
  const { cv, completeness, skills, lastModified } = useCVData()
  const { runAnalysis, executeTool, isProcessing } = useCVAgent()

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'analyze':
        await runAnalysis()
        break
      case 'categorize':
        await executeTool('categorizeSkills', undefined as any)
        break
      case 'check':
        await executeTool('consistencyCheck', undefined as any)
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Completeness Score */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">CV Completeness</h3>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={completeness >= 80 ? '#10b981' : completeness >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="3"
                strokeDasharray={`${completeness}, 100`}
              />
              <text
                x="18"
                y="20.35"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="currentColor"
              >
                {completeness}%
              </text>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              Your CV is{' '}
              {completeness >= 80
                ? 'mostly complete'
                : completeness >= 50
                  ? 'partially complete'
                  : 'incomplete'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Last modified: {lastModified.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-2xl font-bold">{cv.experience.length}</p>
          <p className="text-sm text-gray-600">Experiences</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-2xl font-bold">{cv.projects.length}</p>
          <p className="text-sm text-gray-600">Projects</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-2xl font-bold">{cv.skills.length}</p>
          <p className="text-sm text-gray-600">Skills</p>
        </div>
      </div>

      {/* Skills Breakdown */}
      {Object.keys(skills).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Skills Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(skills)
              .slice(0, 5)
              .map(([category, skillList]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{category}</span>
                    <span className="text-gray-600">{skillList.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (skillList.length / cv.skills.length) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickAction('analyze')}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Analyze CV
          </button>
          <button
            onClick={() => handleQuickAction('categorize')}
            disabled={isProcessing}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Categorize Skills
          </button>
          <button
            onClick={() => handleQuickAction('check')}
            disabled={isProcessing}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Consistency Check
          </button>
          <button
            onClick={() => handleQuickAction('suggest')}
            disabled={isProcessing}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            Get Suggestions
          </button>
        </div>
      </div>

      {/* Context Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Target Profile</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Job Target:</span>
            <span className="font-medium">{cv.context.jobTarget || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Domain:</span>
            <span className="font-medium">{cv.context.domain || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Experience Level:</span>
            <span className="font-medium capitalize">
              {cv.context.experienceLevel || 'Not set'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
