# CI/CD & Code Quality Pipeline Setup Guide

Complete guide for setting up production-ready CI/CD with guaranteed code quality.

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Git Hooks Setup](#git-hooks-setup)
- [SonarQube Configuration](#sonarqube-configuration)
- [GitHub Actions Setup](#github-actions-setup)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This pipeline ensures:
- ✅ **Zero TypeScript errors** - Strict type checking
- ✅ **All tests pass** - Automated testing with coverage
- ✅ **Build succeeds** - Production build validation
- ✅ **Code quality** - SonarQube analysis
- ✅ **No bad code pushed** - Git hooks block failing code

### Pipeline Components

```
┌─────────────────────────────────────────────────────────┐
│  Local Development (Git Hooks)                          │
├─────────────────────────────────────────────────────────┤
│  pre-commit: eslint + prettier (via lint-staged)       │
│  pre-push: type-check → test → build                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions (CI/CD)                                 │
├─────────────────────────────────────────────────────────┤
│  1. Quality Gate: type-check, lint, test, build        │
│  2. SonarQube: Code quality analysis                    │
│  3. Security: npm audit                                 │
│  4. Deploy: Build artifacts                             │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- `husky` - Git hooks
- `lint-staged` - Pre-commit formatting/linting
- `@vitest/coverage-v8` - Test coverage
- `sonar-scanner` - SonarQube CLI
- `tsx` - TypeScript execution

### Step 2: Initialize Husky

```bash
npx husky init
```

This creates the `.husky/` directory with default hooks.

**Note:** The configuration files are already provided in this repository. If you're setting up from scratch, copy the files from `.husky/` directory.

---

## 🔧 Git Hooks Setup

### Pre-commit Hook (`.husky/pre-commit`)

Runs automatically on every commit:

```bash
#!/usr/bin/env sh
npx lint-staged
```

**What it does:**
- Runs ESLint with `--fix` on staged `.ts` and `.tsx` files
- Runs Prettier on staged `.ts`, `.tsx`, `.json`, and `.md` files
- Blocks commit if any issues can't be auto-fixed

### Pre-push Hook (`.husky/pre-push`)

Runs automatically before every push:

```bash
#!/usr/bin/env sh
npm run type-check || exit 1
npm run test || exit 1
npm run build || exit 1
```

**What it does:**
1. ✅ Type Check - Ensures no TypeScript errors
2. ✅ Test - Runs all tests with coverage
3. ✅ Build - Verifies production build succeeds
4. ❌ If ANY fails → Push is BLOCKED

### Manual Hook Testing

Test pre-commit hook:
```bash
git add .
git commit -m "test commit"
```

Test pre-push hook:
```bash
npm run safe-push
```

---

## 📊 SonarQube Configuration

### Step 1: Create SonarCloud Account

1. Go to [sonarcloud.io](https://sonarcloud.io)
2. Sign in with GitHub
3. Create organization (if not exists)

### Step 2: Generate Token

1. Go to **My Account** → **Security**
2. Click **Generate Token**
3. Name: `cv-portfolio-builder`
4. Copy the token (e.g., `sqp_xxxxxxxxxxxxxx`)

### Step 3: Add GitHub Secret

```bash
# In your GitHub repository settings:
Settings → Secrets and variables → Actions → New repository secret

Name: SONAR_TOKEN
Value: sqp_xxxxxxxxxxxxxx
```

### Step 4: Update sonar-project.properties

Edit `sonar-project.properties`:

```properties
# Replace with your actual values
sonar.projectKey=your-github-username_cv-portfolio-builder
sonar.organization=your-github-organization
```

### Step 5: Local Sonar Scan (Optional)

```bash
# Set your token
export SONAR_TOKEN=sqp_xxxxxxxxxxxxxx

# Run scan
npx sonar-scanner
```

---

## 🚀 GitHub Actions Setup

### Workflow File Location

`.github/workflows/ci.yml`

### Jobs Explained

#### 1. Quality Gate Job

```yaml
quality-gate:
  - Type Check (tsc --noEmit)
  - Lint (eslint)
  - Test with Coverage (vitest --coverage)
  - Build (vite build)
```

**Purpose:** Catches all issues before merge

#### 2. SonarQube Job

```yaml
sonarqube:
  - Downloads coverage from quality-gate
  - Runs SonarCloud analysis
  - Enforces quality gate
```

**Purpose:** Code quality metrics, bug detection, security vulnerabilities

#### 3. Security Scan Job

```yaml
security-scan:
  - npm audit --audit-level=high
  - npm audit fix --dry-run
```

**Purpose:** Identifies vulnerable dependencies

#### 4. Deploy Preview Job

```yaml
deploy-preview:
  - Builds production bundle
  - Uploads dist/ as artifact
```

**Purpose:** Creates preview builds for PRs

### Workflow Triggers

- **Push** to `main`, `master`, `develop`
- **Pull Request** to same branches

---

## 💻 Usage

### Daily Development Workflow

#### 1. Make Changes

```bash
# Edit files
git add .
```

#### 2. Commit (Auto-formats)

```bash
git commit -m "feat: add new feature"
```

**What happens:**
- lint-staged runs ESLint + Prettier
- Files are auto-fixed if possible
- Commit proceeds only if clean

#### 3. Push (Validates Everything)

```bash
git push
```

**What happens:**
```
🔍 Running type check... ✅
🧪 Running tests... ✅
🏗️  Building project... ✅

🎉 All checks passed! Push allowed.
```

If anything fails:
```
❌ Tests failed
Push aborted due to errors.
error: failed to push some refs
```

### Safe Push Script

Alternative manual validation:

```bash
npm run safe-push
```

**Flow:**
1. Type Check
2. Tests with Coverage
3. Build
4. Lint
5. (Optional) SonarQube scan

**Output:**
```
🚀 Starting Safe Push Process...

═══════════════════════════════════════
Step 1/4: Running TypeScript Type Check
═══════════════════════════════════════

✅ Step 1/4: Running TypeScript Type Check passed!

... (continues for each step)

🎉 ALL CHECKS PASSED!
```

---

## 📈 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run type-check` | TypeScript compilation check |
| `npm run test` | Run tests with coverage |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format with Prettier |
| `npm run check` | Format + fix lint |
| `npm run build` | Production build |
| `npm run safe-push` | Run all validations |

---

## 🎯 Quality Gates

### TypeScript Rules

- ❌ No `any` types allowed
- ❌ No unused variables
- ❌ No missing return types
- ✅ Strict mode enabled

### Test Coverage Requirements

```javascript
// vite.config.js
thresholds: {
  global: {
    statements: 70,
    branches: 70,
    functions: 70,
    lines: 70,
  },
}
```

**Minimum:** 70% coverage across all metrics

### SonarQube Quality Gate

Default conditions:
- ✅ New bugs: 0
- ✅ New vulnerabilities: 0
- ✅ New security hotspots: 0
- ✅ Coverage on new code: > 70%
- ✅ Review rating: A

---

## 🔍 Troubleshooting

### Issue: Husky Hooks Not Running

**Symptom:** Git push doesn't run checks

**Solution:**
```bash
# Verify husky is installed
ls -la .husky/

# Reinstall if needed
npm install
npx husky install

# Make hooks executable (Unix)
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Issue: lint-staged Not Finding Files

**Symptom:** `No staged files found`

**Solution:**
```bash
# Ensure files are staged
git add <files>

# Check lint-staged config
cat lint-staged.config.js
```

### Issue: Tests Fail on Push But Pass Locally

**Symptom:** Pre-push hook fails

**Possible causes:**
1. Different Node version
2. Missing environment variables
3. Cache issues

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear vitest cache
npx vitest clean

# Run tests with verbose output
npm run test -- --reporter=verbose
```

### Issue: Build Fails But Dev Works

**Symptom:** `npm run dev` works, `npm run build` fails

**Common causes:**
1. Type errors only caught during build
2. Missing exports
3. Path resolution issues

**Solution:**
```bash
# Run type check first
npm run type-check

# Check for common issues:
# - Unused imports
# - Missing type declarations
# - Incorrect path aliases
```

### Issue: SonarQube Scan Fails

**Symptom:** `SONAR_TOKEN` not found or scan fails

**Solution:**
```bash
# Verify token is set
echo $SONAR_TOKEN

# Set token locally
export SONAR_TOKEN=sqp_xxxxx

# Run with debug logging
npx sonar-scanner -X
```

### Issue: GitHub Actions Not Triggering

**Symptom:** No workflows running on push/PR

**Solution:**
1. Check `.github/workflows/ci.yml` syntax
2. Verify branch names match triggers
3. Check Actions permissions:
   - Settings → Actions → General
   - Allow all actions and reusable workflows

---

## 📝 Best Practices

### Commit Messages

Follow conventional commits:
```bash
feat: add new template engine
fix: resolve type error in agent
docs: update README
test: add unit tests for CV builder
refactor: improve template structure
```

### Before Opening PR

```bash
# Run complete validation
npm run safe-push

# Or manually:
npm run type-check
npm run test
npm run build
npm run lint
```

### During Code Review

- Monitor SonarQube comments
- Check coverage report
- Review GitHub Actions logs

### After Merge

- Verify deployment succeeded
- Check SonarQube dashboard
- Monitor for regressions

---

## 🎨 Customization

### Adjust Coverage Thresholds

Edit `vite.config.js`:

```javascript
thresholds: {
  global: {
    statements: 80,  // Increase to 80%
    branches: 80,
    functions: 80,
    lines: 80,
  },
}
```

### Add More Git Hooks

Create `.husky/commit-msg`:
```bash
#!/usr/bin/env sh
npx --no -- commitlint -e
```

### Skip Hooks Temporarily

```bash
# Skip pre-commit
git commit -m "message" --no-verify

# Skip pre-push
git push --no-verify
```

⚠️ **Use sparingly!** Only for emergencies.

---

## 📊 Monitoring & Metrics

### Dashboard Links

- **GitHub Actions:** `https://github.com/username/repo/actions`
- **SonarCloud:** `https://sonarcloud.io/project/dashboard?id=project-key`
- **Coverage Report:** Open `coverage/index.html` after tests

### Key Metrics to Track

1. **Build Success Rate** - Should be 100%
2. **Test Coverage Trend** - Should increase
3. **SonarQube Technical Debt** - Should decrease
4. **PR Merge Time** - Should be fast

---

## 🎉 Success Criteria

Your pipeline is working correctly when:

- ✅ Commits auto-format code
- ✅ Push blocked on test failure
- ✅ GitHub Actions run on every PR
- ✅ SonarQube analyzes code
- ✅ Coverage reports generated
- ✅ Production builds succeed
- ✅ No manual intervention needed

---

## 📞 Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review GitHub Actions logs
3. Inspect SonarQube analysis
4. Consult project documentation

---

**Last Updated:** March 2026  
**Version:** 1.0.0
