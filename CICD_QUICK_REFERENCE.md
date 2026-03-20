# CI/CD Quick Reference

## 🚀 Quick Start (First Time Setup)

```bash
# 1. Install dependencies
npm install

# 2. Initialize Husky (if needed)
npx husky init

# 3. Set SonarQube token (GitHub Secret)
# Settings → Secrets and variables → Actions → New repository secret
# Name: SONAR_TOKEN
# Value: your-sonarcloud-token

# 4. Update sonar-project.properties with your project key
```

---

## 📝 Daily Workflow

### Normal Development

```bash
# Code...
git add .
git commit -m "feat: your feature"  # Auto-formats
git push                            # Validates everything
```

### If Push Fails

```bash
# Fix issues, then:
npm run type-check
npm run test
npm run build
npm run lint:fix

# Then try again
git push
```

---

## ✅ Pre-commit Checklist

Before committing:

- [ ] Code formatted (Prettier auto-runs)
- [ ] No ESLint errors (auto-fixed)
- [ ] Tests passing locally
- [ ] No TypeScript errors

---

## 🔍 Commands Reference

| Command | When to Use |
|---------|-------------|
| `npm run type-check` | Before committing |
| `npm run test` | During development |
| `npm run test:watch` | TDD workflow |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format all files |
| `npm run safe-push` | Full validation |
| `npm run build` | Test production build |

---

## 🎯 Quality Gates

### Must Pass

- ✅ TypeScript: 0 errors
- ✅ Tests: 100% pass
- ✅ Build: Success
- ✅ Coverage: ≥70%
- ✅ Lint: No errors

### Nice to Have

- SonarQube rating: A
- Coverage: ≥80%
- Zero code smells

---

## 🐛 Common Issues

### Push Blocked?

```bash
# Run full check
npm run safe-push

# Or individual checks
npm run type-check  # Fix TS errors
npm run test        # Fix failing tests
npm run build       # Fix build issues
npm run lint:fix    # Fix lint errors
```

### Coverage Not Generated?

```bash
# Ensure vitest coverage is installed
npm install --save-dev @vitest/coverage-v8

# Run tests with coverage flag
npm run test
```

### Hooks Not Running?

```bash
# Make executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push

# Or reinstall
npm install
npx husky install
```

---

## 📊 Coverage Reports

After running tests:

```bash
# View text report in terminal
npm run test

# View HTML report
open coverage/index.html

# Check lcov for SonarQube
cat coverage/lcov.info
```

---

## 🔐 Environment Variables

### Required Secrets

```bash
# GitHub Actions (.github/workflows/ci.yml)
SONAR_TOKEN=<your-sonarcloud-token>
GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}
```

### Local Development

```bash
# Optional: Set for local SonarQube scan
export SONAR_TOKEN=sqp_xxxxx
```

---

## 📈 Monitoring

### Check Pipeline Status

- **GitHub Actions:** https://github.com/username/repo/actions
- **SonarCloud:** https://sonarcloud.io/project/dashboard

### What to Monitor

- Build success rate
- Coverage trend
- SonarQube quality gate
- Security vulnerabilities

---

## 🎨 Git Hook Flow

```
git commit
  ↓
pre-commit: eslint + prettier
  ↓
Commit created ✓

git push
  ↓
pre-push:
  - type-check
  - test
  - build
  ↓
Push allowed ✓
```

---

## 🚦 CI/CD Pipeline Flow

```
Push/PR
  ↓
Quality Gate Job
  - Type check
  - Lint
  - Test + Coverage
  - Build
  ↓
SonarQube Job
  - Code analysis
  - Quality gate
  ↓
Security Scan
  - npm audit
  ↓
Deploy Preview (PR only)
  - Build artifacts
```

---

## 💡 Pro Tips

1. **Run `npm run safe-push` before PR**
   - Catches issues early
   - Saves CI time

2. **Use `npm run test:watch` for TDD**
   - Faster feedback loop
   - Auto-reruns on changes

3. **Check SonarQube before merging**
   - Look for new bugs
   - Check coverage drop
   - Review code smells

4. **Keep commits small**
   - Easier to review
   - Faster CI feedback
   - Simpler rollbacks

5. **Update dependencies regularly**
   - Security patches
   - Performance improvements
   - Bug fixes

---

## 📞 Need Help?

1. Check `CICD_SETUP_GUIDE.md` for detailed docs
2. Review GitHub Actions logs
3. Inspect SonarQube dashboard
4. Run `npm run safe-push` for diagnostics

---

**Remember:** The pipeline is your friend! It catches issues before production. 🎉
