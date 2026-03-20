/**
 * Prompt Templates - Reusable AI prompt templates for various tasks
 */

export interface PromptTemplate {
  name: string
  description: string
  build: (params: any) => string
}

/**
 * Summary Generation Prompts
 */
export const summaryPrompts = {
  professional: {
    name: 'professional-summary',
    description: 'Generate a professional CV summary',
    build: (params: { role: string; experience: number; skills: string[]; domain?: string }) => `
You are an expert career coach and resume writer. Generate a compelling professional summary for a ${params.role}.

Context:
- Years of Experience: ${params.experience}
- Key Skills: ${params.skills.join(', ')}
${params.domain ? `- Domain/Industry: ${params.domain}` : ''}

Requirements:
1. Keep it between 50-100 words
2. Start with a strong opening statement
3. Highlight key achievements or expertise
4. Use active voice and powerful verbs
5. Tailor to the specified role

Generate a summary that would catch a recruiter's attention in under 10 seconds.
`.trim(),
  },

  elevator: {
    name: 'elevator-pitch',
    description: 'Generate a concise elevator pitch',
    build: (params: { role: string; valueProp: string; skills: string[] }) => `
Create a 30-second elevator pitch for a ${params.role}.

Key Information:
- Unique Value Proposition: ${params.valueProp}
- Core Skills: ${params.skills.join(', ')}

The pitch should:
1. Be conversational and natural
2. Clearly state what you do
3. Highlight what makes you unique
4. End with a call to action or conversation starter

Keep it under 75 words.
`.trim(),
  },
}

/**
 * Achievement Enhancement Prompts
 */
export const achievementPrompts = {
  enhance: {
    name: 'achievement-enhancement',
    description: 'Enhance achievement descriptions with impact',
    build: (params: { achievements: string[]; role: string; context?: string }) => `
You are helping improve CV achievement descriptions using the STAR method.

Role: ${params.role}
${params.context ? `Context: ${params.context}` : ''}

Current Achievements:
${params.achievements.map(a => `• ${a}`).join('\n')}

Enhancement Guidelines:
1. Start each bullet with a strong action verb (Led, Developed, Optimized, etc.)
2. Quantify impact wherever possible (%, $, time saved, users impacted)
3. Focus on business outcomes, not just technical details
4. Use the STAR framework: Situation, Task, Action, Result
5. Make each achievement specific and measurable

Provide enhanced versions as a JSON array of strings.
`.trim(),
  },

  quantify: {
    name: 'quantify-impact',
    description: 'Add metrics to achievements',
    build: (params: { achievement: string }) => `
Analyze this achievement and suggest specific metrics that could be added:

"${params.achievement}"

Questions to consider:
- How many users/customers were impacted?
- What percentage improvement was achieved?
- How much time or money was saved?
- What was the scale (team size, budget, users)?

Provide 3 specific suggestions for quantifying this achievement.
Format as JSON array.
`.trim(),
  },
}

/**
 * Skill Gap Analysis Prompts
 */
export const skillGapPrompts = {
  analyze: {
    name: 'skill-gap-analysis',
    description: 'Identify skill gaps for target role',
    build: (params: { currentSkills: string[]; targetRole: string; experienceLevel: string }) => `
Perform a comprehensive skill gap analysis.

Target Role: ${params.targetRole}
Experience Level: ${params.experienceLevel}
Current Skills: ${params.currentSkills.join(', ')}

Analysis Requirements:
1. Research typical requirements for ${params.targetRole} positions at ${params.experienceLevel} level
2. Compare against current skills
3. Identify critical gaps (must-have skills missing)
4. Identify nice-to-have gaps (bonus skills)
5. Prioritize learning recommendations

Output Format (JSON):
{
  "criticalGaps": ["skill1", "skill2"],
  "niceToHave": ["skill3", "skill4"],
  "prioritizedRecommendations": [
    {"skill": "...", "priority": "high|medium|low", "reason": "..."}
  ]
}
`.trim(),
  },

  learningPath: {
    name: 'learning-path',
    description: 'Create learning path for skill',
    build: (params: { skill: string; currentLevel: string; goalLevel: string }) => `
Create a structured learning path for ${params.skill}.

Current Level: ${params.currentLevel}
Goal Level: ${params.goalLevel}

Include:
1. Recommended resources (courses, books, tutorials)
2. Practice projects of increasing complexity
3. Milestones to track progress
4. Estimated time commitment

Format as a step-by-step plan with actionable items.
`.trim(),
  },
}

/**
 * CV Analysis Prompts
 */
export const analysisPrompts = {
  comprehensive: {
    name: 'comprehensive-cv-analysis',
    description: 'Full CV strength analysis',
    build: (params: { cvData: any; jobDescription?: string }) => `
You are an experienced recruiter reviewing this CV.

${params.jobDescription ? `Job Description:\n${params.jobDescription}\n\n` : ''}

CV Data:
${JSON.stringify(params.cvData, null, 2)}

Provide detailed analysis covering:
1. First Impression (what stands out positively/negatively)
2. Content Quality (depth, relevance, clarity)
3. ATS Optimization (keyword matching, formatting)
4. Recruiter Appeal (would you interview this candidate?)
5. Specific Recommendations (actionable improvements)

Score the CV from 0-100 based on:
- Completeness (25 points)
- Impact & Achievements (35 points)
- Relevance & Targeting (25 points)
- Presentation & Clarity (15 points)

Output as JSON with detailed feedback.
`.trim(),
  },

  atsCheck: {
    name: 'ats-optimization',
    description: 'ATS keyword optimization check',
    build: (params: { cvText: string; jobDescription: string }) => `
Analyze this CV for ATS (Applicant Tracking System) optimization.

Job Description Keywords: Extract key terms from the job description
CV Text: ${params.cvText.substring(0, 2000)}

Identify:
1. Matching keywords (present in both)
2. Missing keywords (in job description but not CV)
3. Keyword density issues
4. Suggested additions

Provide specific recommendations for improving ATS score.
`.trim(),
  },
}

/**
 * Project Description Prompts
 */
export const projectPrompts = {
  highlight: {
    name: 'project-highlights',
    description: 'Generate compelling project highlights',
    build: (params: { projectName: string; description: string; techStack: string[]; impact?: string }) => `
Create compelling highlights for this portfolio project.

Project Name: ${params.projectName}
Description: ${params.description}
Tech Stack: ${params.techStack.join(', ')}
${params.impact ? `Impact: ${params.impact}` : ''}

Generate 3-5 bullet points that:
1. Explain the problem being solved
2. Highlight technical challenges overcome
3. Showcase your unique contributions
4. Mention technologies used strategically
5. Quantify impact if possible

Make each highlight concise and impactful.
`.trim(),
  },

  caseStudy: {
    name: 'project-case-study',
    description: 'Expand project into case study format',
    build: (params: { projectName: string; description: string }) => `
Expand this project into a detailed case study.

Project: ${params.projectName}
Description: ${params.description}

Structure:
1. Problem Statement (what problem does this solve?)
2. Solution Approach (why did you choose this approach?)
3. Technical Implementation (key technical decisions)
4. Challenges Overcome (what obstacles did you face?)
5. Results & Impact (what was the outcome?)
6. Lessons Learned (what did you learn?)

Write in first person, keep it engaging and informative.
`.trim(),
  },
}

// Export all prompts as a single object
export const prompts = {
  summary: summaryPrompts,
  achievement: achievementPrompts,
  skillGap: skillGapPrompts,
  analysis: analysisPrompts,
  project: projectPrompts,
}
