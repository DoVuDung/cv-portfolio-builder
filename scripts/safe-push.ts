#!/usr/bin/env node

/**
 * Safe Push Script
 * 
 * This script ensures code quality before allowing a push:
 * 1. Runs type checking
 * 2. Runs tests
 * 3. Runs build
 * 4. Optionally runs SonarQube scan
 * 5. If all pass, commits and pushes
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function executeCommand(command: string, stepName: string): boolean {
  try {
    log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`)
    log(`${colors.blue}${stepName}${colors.reset}`)
    log(`${colors.cyan}═══════════════════════════════════════${colors.reset}\n`)
    
    execSync(command, { 
      stdio: 'inherit',
      env: { ...process.env, CI: 'true' }
    })
    
    log(`✅ ${stepName} passed!`, colors.green)
    return true
  } catch (error) {
    log(`❌ ${stepName} failed!`, colors.red)
    log('Push aborted due to errors.', colors.red)
    return false
  }
}

function checkFileExists(filePath: string): boolean {
  return existsSync(join(process.cwd(), filePath))
}

async function safePush(): Promise<void> {
  log('\n🚀 Starting Safe Push Process...', colors.cyan)
  
  // Step 1: Type Check
  const typeCheckPassed = executeCommand(
    'npm run type-check',
    'Step 1/4: Running TypeScript Type Check'
  )
  
  if (!typeCheckPassed) {
    process.exit(1)
  }
  
  // Step 2: Tests
  const testsPassed = executeCommand(
    'npm run test',
    'Step 2/4: Running Tests with Coverage'
  )
  
  if (!testsPassed) {
    process.exit(1)
  }
  
  // Verify coverage report was generated
  if (!checkFileExists('coverage/lcov.info')) {
    log('⚠️  Warning: Coverage report not found at coverage/lcov.info', colors.yellow)
  } else {
    log('✅ Coverage report generated successfully', colors.green)
  }
  
  // Step 3: Build
  const buildPassed = executeCommand(
    'npm run build',
    'Step 3/4: Building Project'
  )
  
  if (!buildPassed) {
    process.exit(1)
  }
  
  // Step 4: Lint
  const lintPassed = executeCommand(
    'npm run lint',
    'Step 4/4: Running ESLint'
  )
  
  if (!lintPassed) {
    process.exit(1)
  }
  
  // Optional: SonarQube local scan (if configured)
  if (checkFileExists('sonar-project.properties') && process.env.SONAR_TOKEN) {
    const sonarPassed = executeCommand(
      'npx sonar-scanner',
      'Bonus: Running SonarQube Analysis (Optional)'
    )
    
    if (!sonarPassed) {
      log('⚠️  SonarQube scan failed, but continuing...', colors.yellow)
    }
  }
  
  // All checks passed!
  log('\n' + colors.green + '═══════════════════════════════════════' + colors.reset)
  log('🎉 ALL CHECKS PASSED!', colors.green)
  log('═══════════════════════════════════════' + colors.reset)
  
  // Ask user if they want to commit and push
  log('\n📝 Ready to commit and push your changes.', colors.cyan)
  log('Note: The actual git commit and push should be done manually.', colors.yellow)
  log('\nRecommended commands:', colors.cyan)
  log('  git add .', colors.reset)
  log('  git commit -m "feat: your commit message"', colors.reset)
  log('  git push', colors.reset)
  
  log('\n✅ Safe push completed successfully!', colors.green)
}

// Run the safe push process
safePush().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red)
  process.exit(1)
})
