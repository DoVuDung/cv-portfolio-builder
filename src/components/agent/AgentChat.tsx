import { useState } from 'react'
import { useCVAgent, useCVData, useSession } from '@/hooks/use-cv-agent'

interface Message {
  id: string
  type: 'user' | 'agent' | 'system'
  content: string
  timestamp: Date
  suggestions?: Array<string>
}

/**
 * Agent Chat Interface - Chat-like UI for interacting with the agent
 */
export function AgentChat() {
  const [messages, setMessages] = useState<Array<Message>>([
    {
      id: '1',
      type: 'agent',
      content:
        "Hi! I'm your CV assistant. I can help you create, optimize, and manage your CV and portfolio. What would you like to work on today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')

  const { executeTool, getSuggestions, isProcessing } = useCVAgent()
  const { cv, completeness } = useCVData()
  const { stats } = useSession()

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Process message
    try {
      const response = await processMessage(message)
      setMessages((prev) => [...prev, response])
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const processMessage = async (message: string): Promise<Message> => {
    const lowerMessage = message.toLowerCase()

    // Simple intent recognition
    if (lowerMessage.includes('analyze') || lowerMessage.includes('review')) {
      const result = await executeTool<void, any>('analyzeCV', undefined as any)
      return {
        id: Date.now().toString(),
        type: 'agent',
        content: `I've analyzed your CV. Current score: ${result.data?.overallScore || 0}/100. ${result.data?.strengths?.length || 0} strengths identified, ${result.data?.weaknesses?.length || 0} areas for improvement.`,
        timestamp: new Date(),
        suggestions: result.data?.weaknesses || [],
      }
    }

    if (
      lowerMessage.includes('skill') &&
      (lowerMessage.includes('gap') || lowerMessage.includes('missing'))
    ) {
      const context = cv.context
      if (context.jobTarget) {
        const result = await executeTool<any, any>('identifyGaps', {
          targetRole: context.jobTarget,
          currentSkills: cv.skills,
        })
        return {
          id: Date.now().toString(),
          type: 'agent',
          content: `I found ${result.data?.gaps?.length || 0} skill gaps for the ${context.jobTarget} role.`,
          timestamp: new Date(),
          suggestions: result.data?.recommendations?.map((r: any) => r.skill) || [],
        }
      } else {
        return {
          id: Date.now().toString(),
          type: 'agent',
          content: 'Please set your job target first so I can identify relevant skill gaps.',
          timestamp: new Date(),
        }
      }
    }

    if (lowerMessage.includes('suggest') || lowerMessage.includes('recommend')) {
      const suggestions = await getSuggestions()
      return {
        id: Date.now().toString(),
        type: 'agent',
        content: `Here are ${suggestions.length} suggestions for you:`,
        timestamp: new Date(),
        suggestions,
      }
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'agent',
      content:
        'I can help you with:\n- Analyzing your CV\n- Identifying skill gaps\n- Generating summaries\n- Enhancing achievements\n- Adding projects\n\nWhat would you like to work on?',
      timestamp: new Date(),
    }
  }

  const handleQuickAction = async (action: string) => {
    await handleSendMessage(action)
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg border">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <h2 className="text-lg font-semibold">CV Assistant</h2>
        <p className="text-sm text-gray-600">
          Session: {stats.actionsCount} actions • {stats.duration} min
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'system'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.suggestions.slice(0, 5).map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-white/20 px-2 py-1 rounded cursor-pointer hover:bg-white/30"
                      onClick={() => handleQuickAction(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}

              <p
                className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}
              >
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-2 border-t bg-gray-50 flex gap-2 overflow-x-auto">
        <button
          onClick={() => handleQuickAction('Analyze my CV')}
          className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100 whitespace-nowrap"
        >
          Analyze CV
        </button>
        <button
          onClick={() => handleQuickAction('What skills am I missing?')}
          className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100 whitespace-nowrap"
        >
          Skill Gaps
        </button>
        <button
          onClick={() => handleQuickAction('Give me suggestions')}
          className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100 whitespace-nowrap"
        >
          Suggestions
        </button>
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage(inputValue)
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about your CV..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
