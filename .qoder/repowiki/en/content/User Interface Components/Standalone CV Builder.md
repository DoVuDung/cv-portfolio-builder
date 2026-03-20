# Standalone CV Builder

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [src/App.tsx](file://src/App.tsx)
- [src/main.tsx](file://src/main.tsx)
- [src/routes/cv-builder.tsx](file://src/routes/cv-builder.tsx)
- [src/components/CVBuilder.tsx](file://src/components/CVBuilder.tsx)
- [src/components/CVEditorSections.tsx](file://src/components/CVEditorSections.tsx)
- [src/components/TemplateSwitcher.tsx](file://src/components/TemplateSwitcher.tsx)
- [src/agent/index.ts](file://src/agent/index.ts)
- [src/agent/core/agent.ts](file://src/agent/core/agent.ts)
- [src/agent/tools/core-tools.ts](file://src/agent/tools/core-tools.ts)
- [src/agent/memory/cv-memory.ts](file://src/agent/memory/cv-memory.ts)
- [src/agent/hooks/useSkillAgent.ts](file://src/agent/hooks/useSkillAgent.ts)
- [src/hooks/use-cv-agent.ts](file://src/hooks/use-cv-agent.ts)
- [src/templates/index.ts](file://src/templates/index.ts)
- [src/templates/types/template.types.ts](file://src/templates/types/template.types.ts)
- [src/templates/types/cv.types.ts](file://src/templates/types/cv.types.ts)
- [src/templates/core/TemplateRenderer.tsx](file://src/templates/core/TemplateRenderer.tsx)
- [src/templates/layouts/SingleColumnLayout.tsx](file://src/templates/layouts/SingleColumnLayout.tsx)
- [src/templates/sections/ProfileSection.tsx](file://src/templates/sections/ProfileSection.tsx)
- [ATS_OPTIMIZATION_GUIDE.md](file://ATS_OPTIMIZATION_GUIDE.md)
- [CV_BUILDER_REBUILD_SUMMARY.md](file://CV_BUILDER_REBUILD_SUMMARY.md)
- [RESUME_TEMPLATE_ENGINE_SUMMARY.md](file://RESUME_TEMPLATE_ENGINE_SUMMARY.md)
</cite>

## Update Summary
**Changes Made**
- Enhanced CV Builder with complete rebuild featuring professional UI capabilities
- Integrated ATS optimization system with scoring and keyword detection
- Added comprehensive live preview functionality with real-time updates
- Expanded CV data structures with enhanced typing and validation
- Implemented advanced template engine with multiple layouts and themes
- Added professional UI components with modern design patterns

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [AI Agent System](#ai-agent-system)
7. [Template Engine](#template-engine)
8. [ATS Optimization System](#ats-optimization-system)
9. [State Management](#state-management)
10. [Performance Considerations](#performance-considerations)
11. [Development Setup](#development-setup)
12. [Conclusion](#conclusion)

## Introduction

The Standalone CV Builder is a production-ready, full-featured CV and portfolio builder application that combines modern web technologies with AI-powered enhancements. Built with React 19 and TypeScript, this application provides a comprehensive solution for creating professional CVs with real-time preview, dynamic template switching, intelligent AI assistance, and advanced ATS optimization capabilities.

**Updated** Enhanced with complete rebuild featuring professional UI design, live preview functionality, comprehensive CV data structures, and ATS optimization integration.

Key features include:
- Live CV editor with instant preview and real-time updates
- Multiple resume templates (Single-column, Two-column layouts)
- Advanced ATS optimization with scoring and keyword detection
- AI Skill Agent with MCP (Model Context Protocol) architecture
- Professional UI with modern design patterns and responsive layout
- Comprehensive CV data structures with strict typing
- Template switching functionality with visual feedback
- PDF-ready layouts and styling
- Persistent state management with TanStack Store

The application follows clean architecture principles with strict type safety, comprehensive testing coverage, and professional user experience design, making it suitable for both development and production environments.

## Project Structure

The project follows a modular architecture organized by feature domains with enhanced UI components and ATS optimization:

```mermaid
graph TB
subgraph "Application Root"
Main[src/main.tsx] --> Router[TanStack Router]
Router --> Routes[src/routes/]
Routes --> CVBuilder[src/components/CVBuilder.tsx]
end
subgraph "Agent System"
AgentIndex[src/agent/index.ts] --> Core[Core Components]
Core --> Tools[AI Tools]
Core --> Memory[Memory Management]
Core --> Services[Services]
end
subgraph "Template System"
TemplatesIndex[src/templates/index.ts] --> Core[Template Core]
Core --> Layouts[Layout Components]
Core --> Sections[Section Components]
Core --> Store[State Management]
end
subgraph "UI Components"
CVBuilder --> EditorSections[CVEditorSections.tsx]
CVBuilder --> TemplateSwitcher[TemplateSwitcher.tsx]
CVBuilder --> UIComponents[Professional UI]
CVBuilder --> ATSEngine[ATS Optimization]
end
subgraph "ATS System"
ATSEngine --> ATSScore[Compatibility Score]
ATSEngine --> KeywordDetection[Keyword Detection]
ATSEngine --> JobMatcher[Job Description Matcher]
end
AgentIndex --> TemplatesIndex
CVBuilder --> AgentIndex
CVBuilder --> ATSEngine
```

**Diagram sources**
- [src/main.tsx:1-79](file://src/main.tsx#L1-L79)
- [src/agent/index.ts:1-43](file://src/agent/index.ts#L1-L43)
- [src/templates/index.ts:1-44](file://src/templates/index.ts#L1-L44)
- [ATS_OPTIMIZATION_GUIDE.md:1-530](file://ATS_OPTIMIZATION_GUIDE.md#L1-L530)

**Section sources**
- [README.md:83-111](file://README.md#L83-L111)
- [src/main.tsx:1-79](file://src/main.tsx#L1-L79)

## Core Components

### Enhanced CV Builder Application

The CV Builder serves as the main application container and orchestrates the entire CV creation workflow with professional UI capabilities:

```mermaid
classDiagram
class CVBuilder {
+CV cvData
+boolean isEditing
+string activeSection
+boolean saved
+handleSave() void
+handleLoadDemo() void
+toggleEditMode() void
+render() JSX.Element
}
class Profile {
+string name
+string title
+string summary
+string location
+Contact contact
+string education
+string languages
}
class WorkExperience {
+string company
+string role
+string startDate
+string endDate
+string location
+Project[] projects
}
class Project {
+string name
+string description
+string teamSize
+string techStack
+string[] achievements
}
class SkillCategory {
+string category
+string[] skills
}
class Education {
+string institution
+string degree
+string gpa
}
class ATSAnalysis {
+number score
+string[] keywords
+Formatting formatting
+suggestions string[]
}
CVBuilder --> Profile : contains
CVBuilder --> WorkExperience : contains
CVBuilder --> SkillCategory : contains
CVBuilder --> Education : contains
CVBuilder --> ATSAnalysis : contains
```

**Diagram sources**
- [src/components/CVBuilder.tsx:41-103](file://src/components/CVBuilder.tsx#L41-L103)

The CV Builder component manages:
- Complete CV data structure with enhanced typed interfaces
- Professional tab-based editing interface with icon navigation
- Real-time editing and live preview functionality
- Edit mode toggle with visual feedback
- Local storage persistence with save confirmation
- Demo data loading with professional styling
- Responsive two-panel layout (editor + preview)
- ATS optimization integration with scoring system

**Section sources**
- [src/components/CVBuilder.tsx:1-1093](file://src/components/CVBuilder.tsx#L1-L1093)

### Professional Template Switcher Component

The Template Switcher enables dynamic template selection with enhanced visual feedback:

```mermaid
sequenceDiagram
participant User as User
participant Switcher as TemplateSwitcher
participant Engine as TemplateEngine
participant Store as TemplateStore
User->>Switcher : Click template card
Switcher->>Engine : setActiveTemplate(templateId)
Engine->>Store : Update active template
Store-->>Switcher : Template state change
Switcher-->>User : Visual feedback with active state
Note over Switcher,Store : Template state persists across sessions
```

**Diagram sources**
- [src/components/TemplateSwitcher.tsx:10-16](file://src/components/TemplateSwitcher.tsx#L10-L16)

**Section sources**
- [src/components/TemplateSwitcher.tsx:1-50](file://src/components/TemplateSwitcher.tsx#L1-L50)

## Architecture Overview

The application follows a layered architecture with clear separation of concerns and enhanced professional UI components:

```mermaid
graph TB
subgraph "Presentation Layer"
CVBuilder[Enhanced CVBuilder Component]
TemplateSwitcher[Professional TemplateSwitcher]
UIComponents[Modern UI Components]
ATSEngine[ATS Optimization Engine]
end
subgraph "Application Layer"
Router[TanStack Router]
StateManagement[TanStack Store]
Hooks[Custom Hooks]
ATSHooks[ATS Analysis Hooks]
end
subgraph "Agent Layer (AI)"
SkillAgent[SkillAgent]
AgentOrchestrator[AgentOrchestrator]
ToolRegistry[ToolRegistry]
Tools[MCP Tools]
end
subgraph "Template Layer"
TemplateEngine[Advanced Template Engine]
Layouts[Layout Components]
Sections[Section Components]
Themes[Theme System]
Preview[Live Preview System]
end
subgraph "Infrastructure"
Memory[Memory Management]
Services[Service Layer]
Persistence[Local Storage]
ATSIntegration[ATS Integration]
end
CVBuilder --> AgentLayer
CVBuilder --> TemplateEngine
CVBuilder --> ATSEngine
AgentLayer --> Memory
TemplateEngine --> Services
TemplateEngine --> Preview
StateManagement --> Persistence
ATSEngine --> ATSIntegration
```

**Diagram sources**
- [src/agent/core/agent.ts:173-376](file://src/agent/core/agent.ts#L173-L376)
- [src/templates/index.ts:1-44](file://src/templates/index.ts#L1-L44)
- [ATS_OPTIMIZATION_GUIDE.md:1-530](file://ATS_OPTIMIZATION_GUIDE.md#L1-L530)

## Detailed Component Analysis

### Enhanced CV Editor Sections

The CV Editor Sections component provides structured form-based editing with comprehensive validation and professional styling:

```mermaid
flowchart TD
Start([Professional Form Initialization]) --> LoadCV[Load Enhanced CV Data]
LoadCV --> RenderProfile[Render Profile Section with Icons]
RenderProfile --> RenderExperience[Render Experience Section with Projects]
RenderExperience --> RenderSkills[Render Skills Section with Categories]
RenderSkills --> RenderEducation[Render Education Section]
RenderProfile --> ValidateProfile[Validate Profile Data]
ValidateProfile --> UpdateCV[Update CV State]
RenderExperience --> ValidateExperience[Validate Experience Data]
ValidateExperience --> UpdateCV
RenderSkills --> ValidateSkills[Validate Skills Data]
ValidateSkills --> UpdateCV
RenderEducation --> ValidateEducation[Validate Education Data]
ValidateEducation --> UpdateCV
UpdateCV --> SaveState[Save to Local Storage with Confirmation]
SaveState --> End([Professional Form Updated])
```

**Diagram sources**
- [src/components/CVEditorSections.ts:12-121](file://src/components/CVEditorSections.ts#L12-L121)

**Section sources**
- [src/components/CVEditorSections.ts:1-122](file://src/components/CVEditorSections.ts#L1-L122)

### Enhanced State Management Architecture

The application uses TanStack Store for reactive state management with multiple stores and enhanced CV data structures:

```mermaid
classDiagram
class CVMemoryManager {
+Store~CVMemoryState~ store
+Derived~boolean~ hasCV
+Derived~number~ versionCount
+saveVersion(cv, changes) void
+getLatest() CV
+getHistory() CVVersion[]
}
class SessionMemoryManager {
+Store~SessionMemoryState~ store
+logTool(toolName, params, result) void
+getActionHistory() ActionLog[]
+getSessionId() string
}
class PreferenceMemoryManager {
+Store~PreferenceMemoryState~ store
+update(preferences) void
+get() PreferenceMemoryState
+reset() void
}
class CVMemoryState {
+CVWithMeta currentCV
+CVVersion[] versions
+Date lastSaved
}
class SessionMemoryState {
+string sessionId
+ActionLog[] actionLog
+Date startTime
}
class CVWithMeta {
+CV cv
+Date lastUpdated
+string version
}
CVMemoryManager --> CVMemoryState
SessionMemoryManager --> SessionMemoryState
PreferenceMemoryManager --> PreferenceMemoryState
CVMemoryState --> CVWithMeta
```

**Diagram sources**
- [src/agent/memory/cv-memory.ts:19-289](file://src/agent/memory/cv-memory.ts#L19-L289)
- [src/templates/types/cv.types.ts:11-16](file://src/templates/types/cv.types.ts#L11-L16)

**Section sources**
- [src/agent/memory/cv-memory.ts:1-290](file://src/agent/memory/cv-memory.ts#L1-L290)

## AI Agent System

The AI Agent System implements the Model Context Protocol (MCP) for intelligent CV enhancement with ATS optimization integration:

```mermaid
sequenceDiagram
participant User as User
participant Agent as SkillAgent
participant Orchestrator as AgentOrchestrator
participant Registry as ToolRegistry
participant Tool as MCP Tool
participant Memory as Memory Managers
participant ATSEngine as ATSEngine
User->>Agent : run(task, input)
Agent->>Agent : validate task type
Agent->>Orchestrator : executeTool(toolName, params)
Orchestrator->>Registry : get(toolName)
Registry-->>Orchestrator : Tool instance
Orchestrator->>Tool : execute(params)
Tool-->>Orchestrator : Tool result
Orchestrator->>Memory : logToolExecution
Memory-->>Orchestrator : Confirmation
Orchestrator-->>Agent : Execution result
Agent->>ATSEngine : integrateWithATS(result)
ATSEngine-->>Agent : ATS-optimized result
Agent-->>User : Enhanced CV Response
Note over Agent,Tool : Debug mode available for development
```

**Diagram sources**
- [src/agent/core/agent.ts:188-281](file://src/agent/core/agent.ts#L188-L281)

### Enhanced AI Tools with ATS Integration

The system provides seven specialized MCP tools for comprehensive CV enhancement including ATS optimization:

| Tool Name | Purpose | LLM Required | Category | ATS Integration |
|-----------|---------|--------------|----------|-----------------|
| `analyzeCV` | Structural CV analysis with scoring | No | Analysis | CV Analysis |
| `generateSummary` | Professional summary generation | Yes | Generation | ATS Optimization |
| `improveExperience` | Experience bullet point enhancement | Yes | Optimization | ATS Optimization |
| `extractSkills` | Skill extraction and categorization | No | Extraction | Skill Analysis |
| `optimizeATS` | Applicant Tracking System optimization | Yes | Optimization | Core Feature |
| `mapToUISections` | CV data transformation for templates | No | Mapping | Template Engine |
| `detectKeywords` | Keyword extraction from CV and job descriptions | No | Analysis | ATS Optimization |

**Section sources**
- [src/agent/tools/core-tools.ts:1-539](file://src/agent/tools/core-tools.ts#L1-L539)

## Template Engine

The template engine provides a flexible system for CV presentation with multiple layouts, themes, and live preview capabilities:

```mermaid
classDiagram
class Template {
+string id
+string name
+string description
+LayoutType layout
+SectionConfig[] sections
+Theme theme
+PageSize pageSize
+Date createdAt
+Date updatedAt
+getLayout() LayoutType
+render(props) JSX.Element
}
class TemplateRenderer {
+Template template
+CV cvData
+Theme theme
+render() JSX.Element
+validateSections() boolean
}
class SectionConfig {
+keyof CV key
+ComponentType component
+SectionPosition position
+number order
+Props props
}
class Theme {
+string id
+string name
+FontFamily fontFamily
+FontSize fontSize
+Colors colors
+Spacing spacing
}
class PreviewSettings {
+number zoom
+PageSize pageSize
+boolean showGuides
+PreviewMode mode
}
Template --> SectionConfig : contains
TemplateRenderer --> Template : renders
TemplateRenderer --> Theme : applies
TemplateRenderer --> PreviewSettings : uses
```

**Diagram sources**
- [src/templates/types/template.types.ts:43-77](file://src/templates/types/template.types.ts#L43-L77)

**Section sources**
- [src/templates/types/template.types.ts:1-77](file://src/templates/types/template.types.ts#L1-L77)

### Enhanced Available Templates

The system supports four distinct template layouts with professional designs:

1. **Single Column Layout**: Traditional, easy-to-read format ideal for academic or minimalist styles
2. **Two Column Left**: Modern sidebar layout with main content on the right
3. **Two Column Right**: Mirror image of two-column left with sidebar on the right
4. **Harvard Template**: Academic single-column format with classic styling

Each template supports different section arrangements, professional themes, and live preview capabilities.

## ATS Optimization System

The ATS Optimization System provides comprehensive Applicant Tracking System compatibility analysis and improvement suggestions:

```mermaid
flowchart TD
Start([ATS Analysis Request]) --> LoadCV[Load CV Data]
LoadCV --> ExtractKeywords[Extract Keywords from CV]
ExtractKeywords --> AnalyzeScore[Calculate ATS Score]
AnalyzeScore --> CheckFormatting[Check Formatting Compliance]
CheckFormatting --> GenerateSuggestions[Generate Improvement Suggestions]
GenerateSuggestions --> CheckJobDesc[Optional: Analyze Job Description]
CheckJobDesc --> CalculateJDMatch[Calculate Job Description Match]
CalculateJDMatch --> CombineResults[Combine All Results]
CombineResults --> ReturnAnalysis[Return Complete Analysis]
ReturnAnalysis --> End([ATS Analysis Complete])
```

**Diagram sources**
- [ATS_OPTIMIZATION_GUIDE.md:395-436](file://ATS_OPTIMIZATION_GUIDE.md#L395-L436)

### ATS Analysis Features

The system provides comprehensive ATS optimization capabilities:

- **Compatibility Score**: Automated scoring (0-100) with color-coded feedback
- **Keyword Detection**: Automatic extraction of technical keywords from CV content
- **Formatting Analysis**: Checklist for ATS-friendly formatting compliance
- **Job Description Matching**: Keyword comparison with pasted job descriptions
- **Smart Suggestions**: Actionable recommendations categorized by priority
- **Real-time Feedback**: Instant analysis with progress tracking

**Section sources**
- [ATS_OPTIMIZATION_GUIDE.md:1-530](file://ATS_OPTIMIZATION_GUIDE.md#L1-L530)

## State Management

The application implements a multi-layered state management system using TanStack Store with enhanced CV data structures:

```mermaid
graph LR
subgraph "Local Storage"
LS[localStorage]
end
subgraph "TanStack Store"
CVStore[Enhanced CV Store]
TemplateStore[Template Store]
PreviewStore[Preview Store]
ATSStore[ATS Analysis Store]
end
subgraph "Memory Managers"
CVMem[CV Memory]
SessionMem[Session Memory]
PrefMem[Preference Memory]
ATSMem[ATS Memory]
end
subgraph "Reactive State"
HasCV[Derived: hasCV]
VersionCount[Derived: versionCount]
LastUpdated[Derived: lastUpdated]
ATSScore[Derived: ATSScore]
ATSKeywords[Derived: ATSKeywords]
EndState[Derived: EndState]
end
LS --> CVStore
CVStore --> CVMem
TemplateStore --> SessionMem
PreviewStore --> PrefMem
ATSStore --> ATSMem
CVMem --> HasCV
CVMem --> VersionCount
CVMem --> LastUpdated
ATSMem --> ATSScore
ATSMem --> ATSKeywords
ATSMem --> EndState
```

**Diagram sources**
- [src/agent/memory/cv-memory.ts:22-50](file://src/agent/memory/cv-memory.ts#L22-L50)

**Section sources**
- [src/agent/memory/cv-memory.ts:1-290](file://src/agent/memory/cv-memory.ts#L1-L290)

## Performance Considerations

The application is optimized for performance with several key considerations:

- **Build Size**: ~348 KB total (107 KB gzipped) for enhanced features
- **Initial Load**: <1 second on 3G networks with professional UI
- **Hot Reload**: <100ms development iteration time
- **Type Checking**: Strict TypeScript mode with zero errors
- **Test Suite**: <1 second execution time with 92 passing tests
- **Rendering Performance**: React.memo on all template components
- **State Updates**: Optimized TanStack Store subscriptions

Performance optimizations include:
- Tree-shaking for unused code elimination
- Lazy loading for non-critical components
- Efficient state updates with TanStack Store
- Minimal re-renders through proper React patterns
- Optimized bundle splitting for faster initial loads
- Memoized template rendering for better performance
- Professional UI optimizations for smooth interactions

## Development Setup

### Prerequisites

- Node.js 18+ or Bun 1.0+
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cv-portfolio-builder

# Install dependencies
npm install
# or
bun install
```

### Running the Application

```bash
# Start development server
npm run dev
# or
bun run dev

# Open http://localhost:3000/cv-builder
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server on port 3000 |
| `build` | Create production build |
| `serve` | Preview production build |
| `test` | Run test suite with coverage |
| `lint` | Run ESLint for code quality |
| `format` | Format code with Prettier |
| `check` | Run both lint and format |

### Project Structure Details

The application follows a feature-based organization with enhanced UI components:

- **src/agent/**: AI Skill Agent system with MCP architecture and ATS integration
- **src/components/**: Enhanced React components for professional UI and functionality
- **src/templates/**: Advanced template engine with layouts, sections, and live preview
- **src/routes/**: TanStack Router definitions
- **src/hooks/**: Custom React hooks for state management and ATS analysis
- **src/integrations/**: Third-party library integrations
- **src/mcp/**: MCP integration types and contexts

**Section sources**
- [README.md:45-82](file://README.md#L45-L82)
- [package.json:5-20](file://package.json#L5-L20)

## Conclusion

The Standalone CV Builder represents a comprehensive solution for modern CV creation, combining intuitive user experience with powerful AI-driven enhancements and advanced ATS optimization capabilities. The application demonstrates excellent architectural decisions with clear separation of concerns, robust type safety, extensive testing coverage, and professional user interface design.

**Updated** Key enhancements include complete rebuild with professional UI design, live preview functionality, comprehensive CV data structures, ATS optimization integration, and advanced template engine capabilities.

Key strengths include:
- **Production-ready architecture** with clean separation of concerns and enhanced UI components
- **AI-powered enhancement** through MCP-compatible tools with ATS integration
- **Advanced template system** supporting multiple layouts, themes, and live preview
- **Professional ATS optimization** with scoring, keyword detection, and job matching
- **Real-time collaboration** features with persistent state management and visual feedback
- **Performance optimization** with enhanced bundle size and fast loading times
- **Developer-friendly** with comprehensive documentation, testing, and professional design patterns

The modular design allows for easy extension and customization, making it suitable for both individual use and enterprise deployment scenarios. The combination of modern web technologies with AI capabilities and ATS optimization positions this application as a leading solution in the CV builder space.

Future enhancements could include cloud synchronization, advanced export formats, collaborative editing features, expanded AI capabilities, additional template themes, and enhanced ATS analysis features.