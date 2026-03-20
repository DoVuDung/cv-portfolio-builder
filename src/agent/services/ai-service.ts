/**
 * AI Service Interface - Abstracts AI provider implementation
 */

export interface AIProvider {
  name: string
  generateText: (prompt: string, options?: GenerationOptions) => Promise<string>
  generateJSON: (prompt: string, options?: GenerationOptions) => Promise<any>
}

export interface GenerationOptions {
  temperature?: number
  maxTokens?: number
  model?: string
}

export interface AIServiceInterface {
  provider: AIProvider
  setProvider: (provider: AIProvider) => void
  generateSummary: (params: GenerateSummaryParams) => Promise<string>
  enhanceAchievements: (achievements: Array<string>) => Promise<Array<string>>
  analyzeCV: (cvData: any) => Promise<CVAnalysis>
  identifySkillGaps: (currentSkills: Array<string>, targetRole: string) => Promise<SkillGapAnalysis>
}

export interface GenerateSummaryParams {
  role: string
  experience: number
  skills: Array<string>
  domain?: string
}

export interface CVAnalysis {
  strengths: Array<string>
  weaknesses: Array<string>
  recommendations: Array<string>
  score: number
}

export interface SkillGapAnalysis {
  gaps: Array<string>
  recommendations: Array<LearningRecommendation>
}

export interface LearningRecommendation {
  skill: string
  priority: 'high' | 'medium' | 'low'
  resources?: Array<string>
}

/**
 * Mock AI Provider - For development and testing
 */
export class MockAIProvider implements AIProvider {
  readonly name = 'mock'

  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return `Generated response for: "${prompt.substring(0, 50)}..."`
  }

  async generateJSON(prompt: string, options?: GenerationOptions): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      generated: true,
      prompt: prompt.substring(0, 50),
    }
  }
}

/**
 * AI Service Implementation
 */
export class AIService implements AIServiceInterface {
  private _provider: AIProvider

  constructor(provider: AIProvider = new MockAIProvider()) {
    this._provider = provider
  }

  get provider(): AIProvider {
    return this._provider
  }

  setProvider(provider: AIProvider): void {
    this._provider = provider
  }

  /**
   * Generate professional summary
   */
  async generateSummary(params: GenerateSummaryParams): Promise<string> {
    const prompt = buildSummaryPrompt(params)
    return await this._provider.generateText(prompt)
  }

  /**
   * Enhance achievement descriptions
   */
  async enhanceAchievements(achievements: Array<string>): Promise<Array<string>> {
    const prompt = buildEnhancementPrompt(achievements)
    const result = await this._provider.generateJSON(prompt)
    return result.enhanced || achievements
  }

  /**
   * Analyze CV strength
   */
  async analyzeCV(cvData: any): Promise<CVAnalysis> {
    const prompt = buildAnalysisPrompt(cvData)
    const result = await this._provider.generateJSON(prompt)
    return result.analysis || { strengths: [], weaknesses: [], recommendations: [], score: 0 }
  }

  /**
   * Identify skill gaps
   */
  async identifySkillGaps(currentSkills: Array<string>, targetRole: string): Promise<SkillGapAnalysis> {
    const prompt = buildGapAnalysisPrompt(currentSkills, targetRole)
    const result = await this._provider.generateJSON(prompt)
    return result.gaps || { gaps: [], recommendations: [] }
  }
}

// Prompt builders (would be more sophisticated in production)
function buildSummaryPrompt(params: GenerateSummaryParams): string {
  return `Generate a professional summary for a ${params.role} with ${params.experience} years of experience.
Skills: ${params.skills.join(', ')}.
${params.domain ? `Domain: ${params.domain}.` : ''}
Keep it concise, impactful, and under 100 words.`
}

function buildEnhancementPrompt(achievements: Array<string>): string {
  return `Enhance these achievement descriptions to be more impactful and quantifiable:
${achievements.map((a) => `- ${a}`).join('\n')}

Make them:
- Start with strong action verbs
- Include metrics where possible
- Focus on business impact
Use the STAR method (Situation, Task, Action, Result)`
}

function buildAnalysisPrompt(cvData: any): string {
  return `Analyze this CV and provide detailed feedback:
${JSON.stringify(cvData, null, 2)}

Provide:
1. Strengths (what's done well)
2. Weaknesses (areas for improvement)
3. Recommendations (specific actions)
4. Overall score (0-100)

Format as JSON.`
}

function buildGapAnalysisPrompt(currentSkills: Array<string>, targetRole: string): string {
  return `Identify skill gaps for a ${targetRole} role.
Current skills: ${currentSkills.join(', ')}

Research typical requirements for ${targetRole} positions and identify:
1. Missing technical skills
2. Missing soft skills
3. Recommended learning priorities

Format as JSON with gaps array and recommendations.`
}

// Export singleton instance
export const aiService = new AIService()
