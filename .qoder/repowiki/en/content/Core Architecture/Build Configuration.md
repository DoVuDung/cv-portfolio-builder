# Build Configuration

<cite>
**Referenced Files in This Document**
- [package.json](file://package.json)
- [vite.config.js](file://vite.config.js)
- [module-federation.config.js](file://module-federation.config.js)
- [tsconfig.json](file://tsconfig.json)
- [eslint.config.js](file://eslint.config.js)
- [prettier.config.js](file://prettier.config.js)
- [.github/workflows/ci.yml](file://.github/workflows/ci.yml)
- [lint-staged.config.js](file://lint-staged.config.js)
- [sonar-project.properties](file://sonar-project.properties)
- [scripts/safe-push.ts](file://scripts/safe-push.ts)
- [scripts/setup-cicd.ts](file://scripts/setup-cicd.ts)
- [README_CI_CD.md](file://README_CI_CD.md)
- [index.html](file://index.html)
- [src/main.tsx](file://src/main.tsx)
- [src/App.tsx](file://src/App.tsx)
- [src/env.ts](file://src/env.ts)
- [src/demo-mf-component.tsx](file://src/demo-mf-component.tsx)
- [src/demo-mf-self-contained.tsx](file://src/demo-mf-self-contained.tsx)
</cite>

## Update Summary
**Changes Made**
- Enhanced CI/CD infrastructure with comprehensive GitHub Actions workflows
- Added Husky git hooks with pre-commit and pre-push automation
- Integrated safe-push automation script for local validation
- Expanded Vite configuration with multi-format coverage reporting
- Added SonarQube integration for code quality analysis
- Updated package.json with new scripts for type checking, testing, and CI/CD operations
- Added comprehensive documentation for the complete CI/CD pipeline

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [CI/CD Infrastructure](#cicd-infrastructure)
7. [Dependency Analysis](#dependency-analysis)
8. [Performance Considerations](#performance-considerations)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Conclusion](#conclusion)

## Introduction
This document explains the build configuration and development setup for the project, including the newly enhanced CI/CD infrastructure. It covers Vite configuration, Module Federation setup, development server settings, build optimizations, TypeScript strict mode and path aliases, ESLint and Prettier configuration, micro-frontend communication via Module Federation, the complete CI/CD pipeline with GitHub Actions, Husky git hooks, SonarQube integration, environment variables, and troubleshooting guidance for common build issues.

## Project Structure
The project is a Vite-based React application with comprehensive CI/CD infrastructure, optional Module Federation capabilities, and a modern TypeScript setup. Key configuration files and their roles:
- Vite configuration defines plugins, test environment, path aliases, build targets, and enhanced coverage reporting.
- Module Federation configuration exposes components for remote consumption and shares React dependencies.
- TypeScript configuration enables strict mode and path aliases aligned with Vite's resolve.alias.
- ESLint and Prettier provide code quality and formatting standards.
- GitHub Actions workflows automate the complete CI/CD pipeline.
- Husky git hooks enforce code quality locally before commits and pushes.
- SonarQube integration provides continuous code quality analysis.
- Environment variables are validated using a typed environment helper.

```mermaid
graph TB
A["package.json<br/>scripts and dependencies"] --> B["vite.config.js<br/>plugins, resolve, build, coverage"]
B --> C["module-federation.config.js<br/>exposes, remotes, shared"]
B --> D["tsconfig.json<br/>strict mode, paths"]
A --> E["eslint.config.js<br/>TanStack ESLint preset"]
A --> F["prettier.config.js<br/>formatting rules"]
A --> G[".github/workflows/ci.yml<br/>GitHub Actions CI/CD"]
A --> H["lint-staged.config.js<br/>pre-commit automation"]
A --> I["sonar-project.properties<br/>code quality analysis"]
A --> J["scripts/safe-push.ts<br/>local validation script"]
A --> K["scripts/setup-cicd.ts<br/>setup automation"]
G --> L["Quality Gate Job<br/>type check, lint, test, build"]
G --> M["SonarQube Analysis Job<br/>code quality metrics"]
G --> N["Security Scan Job<br/>dependency vulnerabilities"]
G --> O["Deploy Preview Job<br/>PR builds"]
```

**Diagram sources**
- [package.json:1-80](file://package.json#L1-L80)
- [vite.config.js:1-51](file://vite.config.js#L1-L51)
- [module-federation.config.js:1-32](file://module-federation.config.js#L1-L32)
- [tsconfig.json:1-29](file://tsconfig.json#L1-L29)
- [eslint.config.js:1-6](file://eslint.config.js#L1-L6)
- [prettier.config.js:1-11](file://prettier.config.js#L1-L11)
- [.github/workflows/ci.yml:1-154](file://.github/workflows/ci.yml#L1-L154)
- [lint-staged.config.js:1-7](file://lint-staged.config.js#L1-L7)
- [sonar-project.properties:1-43](file://sonar-project.properties#L1-L43)
- [scripts/safe-push.ts:1-144](file://scripts/safe-push.ts#L1-L144)
- [scripts/setup-cicd.ts:1-196](file://scripts/setup-cicd.ts#L1-L196)

**Section sources**
- [package.json:1-80](file://package.json#L1-L80)
- [vite.config.js:1-51](file://vite.config.js#L1-L51)
- [module-federation.config.js:1-32](file://module-federation.config.js#L1-L32)
- [tsconfig.json:1-29](file://tsconfig.json#L1-L29)
- [eslint.config.js:1-6](file://eslint.config.js#L1-L6)
- [prettier.config.js:1-11](file://prettier.config.js#L1-L11)
- [.github/workflows/ci.yml:1-154](file://.github/workflows/ci.yml#L1-L154)
- [lint-staged.config.js:1-7](file://lint-staged.config.js#L1-L7)
- [sonar-project.properties:1-43](file://sonar-project.properties#L1-L43)
- [scripts/safe-push.ts:1-144](file://scripts/safe-push.ts#L1-L144)
- [scripts/setup-cicd.ts:1-196](file://scripts/setup-cicd.ts#L1-L196)

## Core Components
- Vite configuration
  - Plugins: React Fast Refresh, Tailwind CSS integration, and Module Federation.
  - Test environment configured for DOM testing with comprehensive coverage reporting.
  - Path aliases for concise imports.
  - Build target set to ESNext for modern JavaScript features.
  - Multi-format coverage reporting (text, json, html, lcov) with 70% thresholds.
- Module Federation configuration
  - Exposes two components for remote consumption.
  - Shares React and ReactDOM as singletons with required versions.
  - Defines a remote entry filename and default share scope.
- TypeScript configuration
  - Strict mode enabled with comprehensive checks.
  - Path aliases mapped to the src directory and components subdirectory.
  - Bundler mode with verbatim module syntax and no emit.
- ESLint and Prettier
  - ESLint extends a TanStack-provided configuration.
  - Prettier configured with semicolon-less, single-quote, and trailing comma rules.
- CI/CD Infrastructure
  - GitHub Actions workflows with quality gate, SonarQube analysis, security scanning, and preview deployments.
  - Husky git hooks with pre-commit and pre-push automation.
  - Safe push script for comprehensive local validation.
  - SonarQube integration for continuous code quality analysis.
- Environment variables
  - Typed environment variables using a core validator with Zod.
  - Client variables prefixed with VITE_ enforced at type and runtime.

**Section sources**
- [vite.config.js:1-51](file://vite.config.js#L1-L51)
- [module-federation.config.js:1-32](file://module-federation.config.js#L1-L32)
- [tsconfig.json:1-29](file://tsconfig.json#L1-L29)
- [eslint.config.js:1-6](file://eslint.config.js#L1-L6)
- [prettier.config.js:1-11](file://prettier.config.js#L1-L11)
- [.github/workflows/ci.yml:1-154](file://.github/workflows/ci.yml#L1-L154)
- [lint-staged.config.js:1-7](file://lint-staged.config.js#L1-L7)
- [sonar-project.properties:1-43](file://sonar-project.properties#L1-L43)
- [scripts/safe-push.ts:1-144](file://scripts/safe-push.ts#L1-L144)
- [scripts/setup-cicd.ts:1-196](file://scripts/setup-cicd.ts#L1-L196)
- [src/env.ts:1-40](file://src/env.ts#L1-L40)

## Architecture Overview
The build system integrates Vite, React, Tailwind CSS, Module Federation, and a comprehensive CI/CD pipeline. The development server supports hot reloading, remote component exposure, and enhanced coverage reporting. The production build targets modern browsers and emits optimized assets. The CI/CD pipeline automates quality gates, code analysis, security scanning, and deployment previews. Environment variables are validated and injected at build time.

```mermaid
graph TB
subgraph "Development"
V["Vite Dev Server"]
MF["Module Federation Plugin"]
R["React Plugin"]
T["Tailwind Plugin"]
HC["Husky Hooks<br/>pre-commit, pre-push"]
LS["lint-staged"]
SP["Safe Push Script"]
END["End-to-End Testing"]
end
subgraph "Application"
M["src/main.tsx"]
A["src/App.tsx"]
E["src/env.ts"]
end
subgraph "CI/CD Pipeline"
GA["GitHub Actions"]
QG["Quality Gate"]
SQ["SonarQube Analysis"]
SS["Security Scan"]
DP["Deploy Preview"]
end
subgraph "Build"
VC["vite.config.js"]
TC["tsconfig.json"]
EC["eslint.config.js"]
PC["prettier.config.js"]
SC["Setup Script"]
end
V --> R
V --> T
V --> MF
V --> HC
HC --> LS
LS --> SP
SP --> END
VC --> V
TC --> V
EC --> V
PC --> V
SC --> GA
GA --> QG
GA --> SQ
GA --> SS
GA --> DP
MF --> VC
M --> A
M --> E
```

**Diagram sources**
- [vite.config.js:1-51](file://vite.config.js#L1-L51)
- [module-federation.config.js:1-32](file://module-federation.config.js#L1-L32)
- [tsconfig.json:1-29](file://tsconfig.json#L1-L29)
- [eslint.config.js:1-6](file://eslint.config.js#L1-L6)
- [prettier.config.js:1-11](file://prettier.config.js#L1-L11)
- [scripts/setup-cicd.ts:1-196](file://scripts/setup-cicd.ts#L1-L196)
- [.github/workflows/ci.yml:1-154](file://.github/workflows/ci.yml#L1-L154)
- [src/main.tsx:1-89](file://src/main.tsx#L1-L89)
- [src/App.tsx:1-8](file://src/App.tsx#L1-L8)
- [src/env.ts:1-40](file://src/env.ts#L1-L40)

## Detailed Component Analysis

### Vite Configuration
Key behaviors:
- Plugins: React Fast Refresh, Tailwind CSS integration, and Module Federation using the external configuration file.
- Test configuration: Enables global mocks and jsdom environment for unit tests with comprehensive coverage reporting.
- Path aliases: Aliases for src and components enable shorter import paths.
- Build target: ESNext ensures modern JS features like top-level await are supported during development and build.
- Coverage reporting: Multi-format coverage output (text, json, html, lcov) with 70% thresholds for statements, branches, functions, and lines.

```mermaid
flowchart TD
Start(["Load vite.config.js"]) --> Plugins["Load plugins:<br/>React, Tailwind, Module Federation"]
Plugins --> TestCfg["Configure test environment:<br/>globals, jsdom, coverage"]
TestCfg --> Coverage["Setup multi-format coverage:<br/>text, json, html, lcov<br/>70% thresholds"]
Plugins --> Resolve["Configure path aliases"]
Plugins --> BuildTarget["Set build target to ESNext"]
Coverage --> End(["Export Vite config"])
```

**Diagram sources**
- [vite.config.js:1-51](file://vite.config.js#L1-L51)

**Section sources**
- [vite.config.js:1-51](file://vite.config.js#L1-L51)

### Module Federation Configuration
Purpose and behavior:
- Exposes two components for consumption by remote hosts.
- Declares React and ReactDOM as shared singletons with required versions from package dependencies.
- Sets a remote entry filename and default share scope.
- Supports module-type entries and a global entry name for remotes.

```mermaid
flowchart TD
Start(["Load module-federation.config.js"]) --> Filename["Set filename for remote entry"]
Filename --> Name["Set module name"]
Name --> Exposes["Expose components:<br/>DemoMfComponent, DemoMfSelfContained"]
Exposes --> Remotes["Define remotes (currently empty)"]
Remotes --> Shared["Share React and ReactDOM as singletons"]
Shared --> End(["Export federation config"])
```

**Diagram sources**
- [module-federation.config.js:1-32](file://module-federation.config.js#L1-L32)

**Section sources**
- [module-federation.config.js:1-32](file://module-federation.config.js#L1-L32)
- [src/demo-mf-component.tsx:1-4](file://src/demo-mf-component.tsx#L1-L4)
- [src/demo-mf-self-contained.tsx:1-11](file://src/demo-mf-self-contained.tsx#L1-L11)

### TypeScript Configuration
Highlights:
- Strict mode enabled with comprehensive checks (unused locals, unused parameters, fallthrough switches, unchecked side-effect imports).
- Bundler mode with verbatim module syntax and no emit to prevent extra compilation steps.
- Path aliases aligned with Vite's resolve.alias for seamless IDE support and build-time resolution.

```mermaid
flowchart TD
Start(["Load tsconfig.json"]) --> Compiler["Enable strict mode and checks"]
Compiler --> Bundler["Set bundler mode and verbatim syntax"]
Bundler --> Paths["Define path aliases for src and components"]
Paths --> NoEmit["Disable emitting compiled JS"]
NoEmit --> End(["Export TS config"])
```

**Diagram sources**
- [tsconfig.json:1-29](file://tsconfig.json#L1-L29)

**Section sources**
- [tsconfig.json:1-29](file://tsconfig.json#L1-L29)

### ESLint and Prettier Configuration
- ESLint: Extends a TanStack ESLint preset for React and TypeScript best practices.
- Prettier: Enforces formatting rules consistently across the codebase.

```mermaid
flowchart TD
Start(["Load lint/format configs"]) --> ESLint["Apply TanStack ESLint preset"]
Start --> Prettier["Apply formatting rules"]
ESLint --> End(["Linting ready"])
Prettier --> End
```

**Diagram sources**
- [eslint.config.js:1-6](file://eslint.config.js#L1-L6)
- [prettier.config.js:1-11](file://prettier.config.js#L1-L11)

**Section sources**
- [eslint.config.js:1-6](file://eslint.config.js#L1-L6)
- [prettier.config.js:1-11](file://prettier.config.js#L1-L11)

### Environment Variables
- Typed environment variables using a core validator with Zod.
- Server-side variables and client-side variables prefixed with VITE_.
- Runtime environment bound to import.meta.env for Vite.

```mermaid
sequenceDiagram
participant App as "src/main.tsx"
participant Env as "src/env.ts"
participant Meta as "import.meta.env"
App->>Env : Import typed env
Env->>Meta : Read runtime variables
Env-->>App : Provide validated env values
```

**Diagram sources**
- [src/main.tsx:1-89](file://src/main.tsx#L1-L89)
- [src/env.ts:1-40](file://src/env.ts#L1-L40)

**Section sources**
- [src/env.ts:1-40](file://src/env.ts#L1-L40)

### Build Pipeline and Entry Point
- Entry HTML loads the main script pointing to the TypeScript entry file.
- The main entry bootstraps routing, providers, and renders the app under Strict Mode.
- Scripts in package.json orchestrate dev, build, serve, test, lint, format, and comprehensive CI/CD operations.

```mermaid
sequenceDiagram
participant HTML as "index.html"
participant Main as "src/main.tsx"
participant App as "src/App.tsx"
participant Router as "TanStack Router"
participant Providers as "TanStack Query Provider"
HTML->>Main : Load /src/main.tsx
Main->>Providers : Wrap app with providers
Main->>Router : Create router with route tree
Router-->>Main : Render outlet
Main-->>HTML : Mount app to DOM
App-->>Main : Render Home component
```

**Diagram sources**
- [index.html:1-18](file://index.html#L1-L18)
- [src/main.tsx:1-89](file://src/main.tsx#L1-L89)
- [src/App.tsx:1-8](file://src/App.tsx#L1-L8)

**Section sources**
- [index.html:1-18](file://index.html#L1-L18)
- [src/main.tsx:1-89](file://src/main.tsx#L1-L89)
- [src/App.tsx:1-8](file://src/App.tsx#L1-L8)
- [package.json:5-19](file://package.json#L5-L19)

## CI/CD Infrastructure

### GitHub Actions Workflows
The CI/CD pipeline consists of four main jobs orchestrated by GitHub Actions:

**Quality Gate Job**
- Runs on push and pull request to main/master/develop branches
- Performs type checking, linting, testing with coverage, and production build
- Uses Node.js 20 with npm caching for optimal performance
- Continues on error for individual steps to capture all failures

**SonarQube Analysis Job**
- Runs after quality gate passes
- Downloads coverage artifacts from previous job
- Performs comprehensive code quality analysis with SonarCloud
- Integrates with GitHub security features and quality gates
- Waits for quality gate results before proceeding

**Security Scan Job**
- Runs independently to scan for dependency vulnerabilities
- Uses npm audit with high severity threshold
- Performs dry-run audit fix to identify potential issues
- Continues on error to avoid blocking unrelated security findings

**Deploy Preview Job**
- Runs for pull requests only
- Builds production version for preview deployment
- Uploads build artifacts for later use
- Retains artifacts for 7 days for debugging purposes

```mermaid
flowchart TD
Start(["GitHub Push/PR Event"]) --> QualityGate["Quality Gate Job<br/>Type Check → Lint → Test → Build"]
QualityGate --> SonarQube["SonarQube Analysis<br/>Code Quality Metrics"]
QualityGate --> Security["Security Scan<br/>Dependency Audit"]
QualityGate --> DeployPreview["Deploy Preview<br/>PR Builds Only"]
SonarQube --> Success["Pipeline Success"]
Security --> Success
DeployPreview --> Success
```

**Diagram sources**
- [.github/workflows/ci.yml:1-154](file://.github/workflows/ci.yml#L1-L154)

**Section sources**
- [.github/workflows/ci.yml:1-154](file://.github/workflows/ci.yml#L1-L154)

### Husky Git Hooks
The pre-commit and pre-push hooks provide automated code quality enforcement:

**Pre-commit Hook**
- Auto-formats TypeScript and TSX files using Prettier
- Runs ESLint with automatic fixing capabilities
- Processes only staged files for faster performance
- Blocks commits if any step fails, preventing poor code from entering the repository

**Pre-push Hook**
- Comprehensive validation before pushing to remote repositories
- Executes TypeScript type checking to catch compile-time errors
- Runs tests with coverage generation for quality assurance
- Performs production build verification to ensure deployability
- Blocks pushes if any validation step fails
- Provides clear feedback and exit codes for debugging

```mermaid
flowchart TD
CommitEvent["git commit/push event"] --> PreCommit["Pre-commit Hook<br/>Auto-format & Lint"]
PreCommit --> PrePush["Pre-push Hook<br/>Type Check → Test → Build"]
PrePush --> Validation{"All validations pass?"}
Validation --> |Yes| Allow["Allow commit/push"]
Validation --> |No| Block["Block operation<br/>Show error messages"]
```

**Diagram sources**
- [lint-staged.config.js:1-7](file://lint-staged.config.js#L1-L7)
- [scripts/safe-push.ts:56-137](file://scripts/safe-push.ts#L56-L137)

**Section sources**
- [lint-staged.config.js:1-7](file://lint-staged.config.js#L1-L7)
- [scripts/safe-push.ts:1-144](file://scripts/safe-push.ts#L1-L144)

### Safe Push Script
The `safe-push.ts` script provides comprehensive local validation with colored output and step-by-step feedback:

**Validation Flow**
1. TypeScript type checking using `npm run type-check`
2. Test execution with coverage using `npm run test`
3. Production build verification using `npm run build`
4. ESLint validation using `npm run lint`
5. Optional SonarQube analysis with token validation

**Features**
- Colored console output for better readability
- Detailed progress indicators for each step
- Error handling with descriptive messages
- Coverage report verification and warnings
- Optional SonarQube scanner integration
- User-friendly guidance for manual git operations

**Section sources**
- [scripts/safe-push.ts:1-144](file://scripts/safe-push.ts#L1-L144)

### Setup Automation Script
The `setup-cicd.ts` script provides an interactive wizard for complete CI/CD setup:

**Setup Process**
1. Node.js version verification and dependency installation
2. Husky initialization and hook configuration
3. SonarQube project key and organization configuration
4. File verification and completion confirmation
5. Comprehensive next steps and documentation references

**Features**
- Interactive questions for customization
- Platform-specific hook permissions
- SonarQube configuration assistance
- Verification of all required files
- Detailed documentation pointers

**Section sources**
- [scripts/setup-cicd.ts:1-196](file://scripts/setup-cicd.ts#L1-L196)

### SonarQube Integration
Comprehensive code quality analysis through SonarCloud integration:

**Configuration Features**
- TypeScript support with proper tsconfig integration
- Test file exclusions and coverage report mapping
- Quality gate enforcement with timeout configuration
- Rule exclusions for demo and test files
- Multi-criteria issue ignoring for specific patterns

**Integration Points**
- Local analysis via `npx sonar-scanner`
- GitHub Actions automatic scanning
- Quality gate blocking on failures
- Coverage report integration through lcov.info

**Section sources**
- [sonar-project.properties:1-43](file://sonar-project.properties#L1-L43)

## Dependency Analysis
- Vite depends on plugins for React, Tailwind, and Module Federation.
- Module Federation configuration depends on package.json for React version pinning.
- TypeScript configuration aligns with Vite's resolve.alias and bundler mode.
- ESLint and Prettier are integrated via npm scripts.
- CI/CD infrastructure depends on GitHub Actions, Husky, and SonarQube services.
- Coverage reporting requires @vitest/coverage-v8 and proper lcov configuration.

```mermaid
graph LR
Pkg["package.json"] --> Vite["vite.config.js"]
Pkg --> MFConf["module-federation.config.js"]
Vite --> Plugins["Plugins: React, Tailwind, Federation"]
MFConf --> ReactDep["React version from package.json"]
Vite --> TS["tsconfig.json"]
Pkg --> ESL["eslint.config.js"]
Pkg --> PRET["prettier.config.js"]
Pkg --> GA["GitHub Actions"]
Pkg --> Husky["Husky Hooks"]
Pkg --> SQ["SonarQube"]
GA --> SQ
Husky --> LS["lint-staged"]
LS --> SP["safe-push.ts"]
```

**Diagram sources**
- [package.json:1-80](file://package.json#L1-L80)
- [vite.config.js:1-51](file://vite.config.js#L1-L51)
- [module-federation.config.js:1-32](file://module-federation.config.js#L1-L32)
- [tsconfig.json:1-29](file://tsconfig.json#L1-L29)
- [eslint.config.js:1-6](file://eslint.config.js#L1-L6)
- [prettier.config.js:1-11](file://prettier.config.js#L1-L11)
- [.github/workflows/ci.yml:1-154](file://.github/workflows/ci.yml#L1-L154)
- [lint-staged.config.js:1-7](file://lint-staged.config.js#L1-L7)
- [sonar-project.properties:1-43](file://sonar-project.properties#L1-L43)

**Section sources**
- [package.json:1-80](file://package.json#L1-L80)
- [vite.config.js:1-51](file://vite.config.js#L1-L51)
- [module-federation.config.js:1-32](file://module-federation.config.js#L1-L32)
- [tsconfig.json:1-29](file://tsconfig.json#L1-L29)
- [eslint.config.js:1-6](file://eslint.config.js#L1-L6)
- [prettier.config.js:1-11](file://prettier.config.js#L1-L11)
- [.github/workflows/ci.yml:1-154](file://.github/workflows/ci.yml#L1-L154)
- [lint-staged.config.js:1-7](file://lint-staged.config.js#L1-L7)
- [sonar-project.properties:1-43](file://sonar-project.properties#L1-L43)

## Performance Considerations
- Target modern browsers by setting ESNext for both Vite and esbuild to leverage top-level await and other modern features.
- Keep shared dependencies minimal and pinned to a single version to reduce bundle duplication.
- Use path aliases to avoid deep relative imports and improve caching.
- Run lint and format checks in CI to maintain code quality and reduce build-time diffs.
- Prefer lazy loading and route-based code splitting via the router to optimize initial load.
- **Updated** Leverage multi-format coverage reporting for comprehensive quality insights.
- **Updated** Utilize GitHub Actions caching for npm dependencies to speed up CI/CD pipelines.
- **Updated** Implement pre-commit hooks to catch issues early and reduce CI failure rates.
- **Updated** Configure SonarQube quality gates to prevent low-quality code from reaching production.

## Troubleshooting Guide
Common issues and resolutions:
- Module Federation expose mismatches
  - Ensure the exposed component paths match the actual file locations and export names.
  - Verify that the remote entry filename matches the expected remote configuration.
  - Confirm that shared dependencies (React and ReactDOM) are declared as singletons and versions align with package.json.
- Path alias resolution errors
  - Align tsconfig.json path aliases with vite.config.js resolve.alias.
  - Restart the dev server after changing alias configurations.
- TypeScript strict mode failures
  - Address unused locals/parameters and fallthrough switch warnings.
  - Enable noUncheckedSideEffectImports to catch potential runtime issues.
- ESLint/Prettier conflicts
  - Run the combined check script to auto-fix formatting and lint issues.
  - Ensure editor integrations use the project's ESLint and Prettier configs.
- Environment variable runtime errors
  - Prefix client variables with VITE_ as enforced by the typed env helper.
  - Use emptyStringAsUndefined to avoid type mismatches for empty environment values.
- **Updated** CI/CD Pipeline Issues
  - GitHub Actions failures: Check workflow logs for specific error messages and verify all required secrets are configured.
  - Husky hook failures: Ensure Husky is properly initialized and hooks have executable permissions on Unix-like systems.
  - Coverage report generation: Verify lcov.info file exists and SonarQube configuration points to correct report path.
  - SonarQube analysis failures: Check project key, organization, and token configuration in GitHub secrets.
  - Safe push script errors: Run script with verbose logging to identify failing validation step.
- **Updated** Coverage Reporting Problems
  - Multi-format coverage not generating: Verify @vitest/coverage-v8 is installed and vite.config.js coverage settings are correct.
  - Low coverage thresholds: Adjust thresholds in vite.config.js or increase test coverage.
  - Coverage exclusions: Review coverage.exclude patterns to ensure important files are included.
- **Updated** Git Hook Issues
  - Pre-commit hook not running: Verify Husky is installed and lint-staged is configured correctly.
  - Pre-push hook blocking legitimate changes: Temporarily bypass with `git push --no-verify` for emergency situations only.
  - Hook permissions: On Unix-like systems, ensure hooks have executable permissions using chmod +x.

**Section sources**
- [module-federation.config.js:1-32](file://module-federation.config.js#L1-L32)
- [vite.config.js:15-20](file://vite.config.js#L15-L20)
- [tsconfig.json:17-26](file://tsconfig.json#L17-L26)
- [eslint.config.js:1-6](file://eslint.config.js#L1-L6)
- [prettier.config.js:1-11](file://prettier.config.js#L1-L11)
- [src/env.ts:13-39](file://src/env.ts#L13-L39)
- [.github/workflows/ci.yml:1-154](file://.github/workflows/ci.yml#L1-L154)
- [scripts/safe-push.ts:1-144](file://scripts/safe-push.ts#L1-L144)
- [lint-staged.config.js:1-7](file://lint-staged.config.js#L1-L7)

## Conclusion
The project's build configuration leverages Vite, React, Tailwind CSS, and Module Federation to deliver a modern, maintainable, and scalable frontend setup. **Updated** The comprehensive CI/CD infrastructure includes GitHub Actions workflows, Husky git hooks, safe-push automation, and SonarQube integration for enterprise-grade quality assurance. TypeScript strict mode, ESLint, and Prettier ensure code quality, while typed environment variables provide safe runtime configuration. The Module Federation setup exposes components for remote consumption with shared React dependencies. **Updated** The CI/CD pipeline automates quality gates, code analysis, security scanning, and deployment previews, ensuring production-ready code delivery. Following the troubleshooting guidance helps resolve common build issues and CI/CD pipeline problems quickly.