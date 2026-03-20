# CV Portfolio Skill Agent - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Access the Demo
Navigate to `/agent-demo` in your application to see the agent in action.

### 2. Explore the Dashboard
The dashboard shows:
- **CV Completeness Score**: Visual gauge showing how complete your CV is (0-100%)
- **Quick Stats**: Number of experiences, projects, and skills
- **Skills Breakdown**: Categorized view of your skills
- **Quick Actions**: One-click tools for common tasks

### 3. Chat with the Agent
Use the chat interface to:
- Ask for CV analysis: "Analyze my CV"
- Get skill gap insights: "What skills am I missing?"
- Request suggestions: "Give me suggestions"
- Click on suggestion chips for quick actions

---

## 💡 Common Use Cases

### Use Case 1: Complete Your CV Profile

**Step 1**: Update your profile information
```typescript
// In chat or using tools
await executeTool('updateProfile', {
  name: 'Your Name',
  title: 'Software Developer',
  summary: 'Passionate developer with...',
  location: 'Your Location',
})
```

**Step 2**: Generate a professional summary
```typescript
await executeTool('generateSummary', {
  role: 'Full Stack Developer',
  experience: 3,
  skills: ['React', 'Node.js', 'TypeScript'],
})
```

---

### Use Case 2: Add Work Experience

**Step 1**: Add a new position
```typescript
await executeTool('addExperience', {
  company: 'Tech Company',
  role: 'Software Engineer',
  startDate: '2023-01',
  achievements: [
    'Developed new features for platform',
    'Collaborated with team on projects',
  ],
  techStack: ['React', 'Node.js', 'AWS'],
})
```

**Step 2**: Enhance your achievements
```typescript
await executeTool('enhanceAchievements', {
  experienceIndex: 0,
  achievements: [
    'Developed new features for platform',
  ],
})
```

---

### Use Case 3: Build Your Portfolio

**Step 1**: Add a project
```typescript
await executeTool('addProject', {
  name: 'E-commerce Platform',
  description: 'Full-stack online shopping platform',
  techStack: ['React', 'Node.js', 'MongoDB'],
  highlights: [
    'Implemented shopping cart functionality',
    'Integrated payment processing',
  ],
})
```

**Step 2**: Generate better highlights
```typescript
await executeTool('generateHighlights', {
  projectName: 'E-commerce Platform',
  description: 'Full-stack online shopping platform',
  techStack: ['React', 'Node.js', 'MongoDB'],
})
```

**Step 3**: Link to skills
```typescript
await executeTool('linkToSkills', {
  projectIndex: 0,
})
```

---

### Use Case 4: Identify Skill Gaps

**Step 1**: Set your job target
```typescript
const { updateContext } = useCVAgent()
updateContext({
  jobTarget: 'Senior Frontend Developer',
  domain: 'E-commerce',
  experienceLevel: 'senior',
})
```

**Step 2**: Analyze gaps
```typescript
await executeTool('identifyGaps', {
  targetRole: 'Senior Frontend Developer',
  currentSkills: ['React', 'JavaScript', 'CSS'],
})
```

**Step 3**: Add missing skills
```typescript
await executeTool('addSkill', { skill: 'TypeScript' })
await executeTool('addSkill', { skill: 'Next.js' })
```

---

### Use Case 5: Optimize for ATS

**Step 1**: Run keyword optimization
```typescript
await executeTool('keywordOptimization', {
  jobDescription: 'Job posting text here...',
})
```

**Step 2**: Check consistency
```typescript
await executeTool('consistencyCheck')
```

**Step 3**: Apply recommendations
- Add missing keywords to skills
- Ensure projects demonstrate key technologies
- Update experience descriptions

---

## 🎯 Quick Tips

### For Best Results:

1. **Start with Profile**
   - Complete all profile fields
   - Write a compelling summary
   - Add all contact links (GitHub, LinkedIn, Portfolio)

2. **Quantify Achievements**
   - Use numbers wherever possible
   - Focus on impact, not just tasks
   - Example: "Improved performance by 40%" vs "Worked on performance"

3. **Showcase Projects**
   - Add 3-5 substantial projects
   - Include tech stack for each
   - Link to live demos or repositories

4. **Keep Skills Current**
   - Regularly add new skills
   - Remove outdated technologies
   - Categorize for clarity

5. **Use the Agent Regularly**
   - Run analysis weekly
   - Review suggestions
   - Track your progress

---

## 🔧 Tool Reference Card

### Profile Tools
| Tool | Purpose | Example |
|------|---------|---------|
| `updateProfile` | Update personal info | `{ name: '...' }` |
| `generateSummary` | AI summary | `{ role, experience, skills }` |
| `optimizeContact` | Contact suggestions | `{ email, github, linkedin }` |

### Experience Tools
| Tool | Purpose | Example |
|------|---------|---------|
| `addExperience` | Add job | `{ company, role, ... }` |
| `enhanceAchievements` | Improve bullets | `{ experienceIndex, achievements }` |
| `suggestTechStack` | Tech recommendations | `{ role, industry }` |

### Project Tools
| Tool | Purpose | Example |
|------|---------|---------|
| `addProject` | Add portfolio item | `{ name, description, ... }` |
| `generateHighlights` | Create bullets | `{ projectName, description, techStack }` |
| `linkToSkills` | Connect to skills | `{ projectIndex }` |

### Skills Tools
| Tool | Purpose | Example |
|------|---------|---------|
| `addSkill` | Add skill | `{ skill: 'React' }` |
| `categorizeSkills` | Auto-categorize | `none` |
| `identifyGaps` | Find missing | `{ targetRole, currentSkills }` |

### Analysis Tools
| Tool | Purpose | Example |
|------|---------|---------|
| `analyzeCV` | Full analysis | `none` |
| `keywordOptimization` | ATS keywords | `{ jobDescription }` |
| `consistencyCheck` | Check alignment | `none` |

---

## 📊 Understanding Your Scores

### Completeness Score (0-100%)
- **0-49%**: Needs significant work
- **50-79%**: Good foundation, room for improvement
- **80-100%**: Mostly complete, focus on quality

**How to improve:**
- Add more experiences (+10% each)
- Add projects (+10% each)
- Expand skills (+1% per 2 skills)
- Complete profile section (up to 30%)

### Analysis Score (0-100)
Based on:
- **Completeness** (25 points)
- **Impact & Achievements** (35 points)
- **Relevance & Targeting** (25 points)
- **Presentation & Clarity** (15 points)

---

## 🎨 UI Components

### AgentChat Features
- **Natural Language**: Type questions naturally
- **Quick Actions**: Click preset buttons
- **Suggestion Chips**: Click suggestions to act
- **Processing Indicator**: Shows when agent is thinking

### CVDashboard Features
- **Live Updates**: Reacts to changes instantly
- **Progress Visualization**: See your improvements
- **One-Click Actions**: Quick tool execution
- **Session Stats**: Track your activity

---

## 💾 Data Persistence

Your data is automatically saved to localStorage:
- **CV Data**: All profile, experience, projects, skills
- **Context**: Job targets, domain, experience level
- **Session**: Activity history, preferences

**Export your data:**
```typescript
const { exportState } = useCVAgent()
const state = exportState()
// Save this JSON string
```

**Import your data:**
```typescript
// Would need to implement import function
```

---

## 🐛 Troubleshooting

### Issue: Tools not executing
**Solution**: Check that AgentProvider wraps your app

### Issue: Data not persisting
**Solution**: Check browser localStorage settings

### Issue: Chat not responding
**Solution**: Try refreshing the page

### Issue: Low completeness score
**Solution**: Add more experiences and projects

---

## 📞 Need Help?

Refer to:
- **Technical Documentation**: `SKILL_AGENT_README.md`
- **Code Examples**: Check `/src/agent/tools/` for implementations
- **Demo Route**: `/agent-demo` for live examples

---

## Next Steps

1. ✅ Complete your profile
2. ✅ Add at least 2 experiences
3. ✅ Add at least 2 projects
4. ✅ List 10+ relevant skills
5. ✅ Run CV analysis
6. ✅ Address identified gaps
7. ✅ Repeat regularly!

---

Happy building! 🚀
