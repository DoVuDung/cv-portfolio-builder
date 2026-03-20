# Vercel Build Fix

## Issue

Build failed on Vercel with error:
```
npm error notarget No matching version found for sonar-scanner@^3.5.0
```

## Root Cause

The package `sonar-scanner` version `^3.5.0` does not exist in npm registry. The correct package name is `sonarqube-scanner`, but it's not needed for Vercel deployment.

## Solution

### 1. Removed Unnecessary Dependency

Removed `sonar-scanner` from `package.json` devDependencies since:
- SonarQube scanning is only needed in GitHub Actions (which has its own runner)
- Vercel deployment doesn't need local SonarQube scanner
- The GitHub Action uses `SonarSource/sonarcloud-github-action` which includes the scanner

### 2. Updated Safe Push Script

Modified `scripts/safe-push.ts` to:
- Use `npx --yes sonarqube-scanner` for on-demand installation
- Wrap in try-catch to gracefully handle missing scanner
- Make SonarQube scan truly optional

### 3. Fixed Import Paths

Updated imports in `scripts/safe-push.ts` to use Node.js protocol:
- `child_process` → `node:child_process`
- `fs` → `node:fs`
- `path` → `node:path`

## Files Changed

1. **package.json**
   - Removed `"sonar-scanner": "^3.5.0"`

2. **scripts/safe-push.ts**
   - Fixed import paths to use `node:` prefix
   - Made SonarQube scan optional with try-catch
   - Uses `npx --yes` for on-demand installation

## Testing

After these changes:

```bash
# Install dependencies
npm install

# Test safe push (should work without SonarQube scanner)
npm run safe-push

# Verify build works
npm run build
```

## Deployment

Vercel will now successfully run:
```bash
npm install
npm run build
```

GitHub Actions will continue to work with SonarQube via the official action.

## Notes

- SonarQube scanning still works in GitHub Actions (no change needed)
- Local SonarQube scans are still possible by installing `sonarqube-scanner` optionally
- The `sonar-project.properties` configuration remains unchanged and valid

---

**Fixed:** March 20, 2026  
**Status:** ✅ Resolved
