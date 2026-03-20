#!/usr/bin/env node

/**
 * CI/CD Setup Script
 * 
 * Automates the initial setup of the CI/CD pipeline:
 * 1. Installs dependencies
 * 2. Initializes Husky
 * 3. Makes hooks executable
 * 4. Verifies configuration
 */

import { execSync } from 'child_process'
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

async function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

async function setupCI() {
  log('\n🚀 CI/CD Pipeline Setup Wizard\n', colors.cyan)
  log('This will guide you through setting up the complete CI/CD pipeline.\n')

  // Step 1: Check Node.js version
  log('Step 1: Checking Node.js version...', colors.blue)
  try {
    const nodeVersion = execSync('node --version').toString().trim()
    log(`✅ Node.js ${nodeVersion} detected\n`, colors.green)
  } catch (error) {
    log('❌ Node.js not found. Please install Node.js 18+ first.', colors.red)
    process.exit(1)
  }

  // Step 2: Install dependencies
  log('Step 2: Installing dependencies...', colors.blue)
  const installAnswer = await askQuestion('Run npm install? (y/n): ')
  
  if (installAnswer.toLowerCase() === 'y') {
    try {
      execSync('npm install', { stdio: 'inherit' })
      log('✅ Dependencies installed\n', colors.green)
    } catch (error) {
      log('❌ Failed to install dependencies', colors.red)
      process.exit(1)
    }
  } else {
    log('⚠️  Skipping dependency installation\n', colors.yellow)
  }

  // Step 3: Initialize Husky
  log('Step 3: Setting up Git hooks...', colors.blue)
  if (!existsSync(join(process.cwd(), '.husky'))) {
    try {
      log('Initializing Husky...', colors.cyan)
      execSync('npx husky init', { stdio: 'inherit' })
      log('✅ Husky initialized\n', colors.green)
    } catch (error) {
      log('❌ Failed to initialize Husky', colors.red)
      process.exit(1)
    }
  } else {
    log('✅ Husky already configured\n', colors.green)
  }

  // Step 4: Make hooks executable (Unix-like systems)
  if (process.platform !== 'win32') {
    log('Step 4: Making hooks executable...', colors.blue)
    try {
      execSync('chmod +x .husky/pre-commit', { stdio: 'ignore' })
      execSync('chmod +x .husky/pre-push', { stdio: 'ignore' })
      log('✅ Hooks made executable\n', colors.green)
    } catch (error) {
      log('⚠️  Could not make hooks executable (this is optional on Windows)\n', colors.yellow)
    }
  }

  // Step 5: SonarQube configuration
  log('Step 5: SonarQube Configuration', colors.blue)
  log('\nSonarCloud provides code quality analysis.')
  const sonarAnswer = await askQuestion('Do you want to configure SonarQube? (y/n): ')
  
  if (sonarAnswer.toLowerCase() === 'y') {
    const projectKey = await askQuestion('Enter your Sonar project key: ')
    const organization = await askQuestion('Enter your Sonar organization: ')
    
    try {
      const { readFileSync } = await import('fs')
      let config = readFileSync('sonar-project.properties', 'utf-8')
      
      config = config.replace('sonar.projectKey=cv-portfolio-builder', `sonar.projectKey=${projectKey}`)
      config = config.replace('sonar.organization=your-github-organization', `sonar.organization=${organization}`)
      
      writeFileSync('sonar-project.properties', config)
      log('✅ SonarQube configured\n', colors.green)
      
      log('\n📝 Next steps for SonarQube:', colors.cyan)
      log('1. Create account at https://sonarcloud.io')
      log('2. Generate token at: My Account → Security')
      log('3. Add GitHub secret: Settings → Secrets → SONAR_TOKEN\n')
    } catch (error) {
      log('❌ Could not update SonarQube config', colors.red)
    }
  } else {
    log('⚠️  Skipping SonarQube configuration\n', colors.yellow)
  }

  // Step 6: Verify setup
  log('Step 6: Verifying setup...', colors.blue)
  
  const checks = [
    { name: 'package.json', path: 'package.json' },
    { name: 'lint-staged.config.js', path: 'lint-staged.config.js' },
    { name: 'vite.config.js', path: 'vite.config.js' },
    { name: 'sonar-project.properties', path: 'sonar-project.properties' },
    { name: '.github/workflows/ci.yml', path: '.github/workflows/ci.yml' },
    { name: '.husky/pre-commit', path: '.husky/pre-commit' },
    { name: '.husky/pre-push', path: '.husky/pre-push' },
    { name: 'scripts/safe-push.ts', path: 'scripts/safe-push.ts' },
  ]
  
  let allGood = true
  checks.forEach((check) => {
    if (existsSync(join(process.cwd(), check.path))) {
      log(`✅ ${check.name}`, colors.green)
    } else {
      log(`❌ ${check.name} - Missing!`, colors.red)
      allGood = false
    }
  })

  if (allGood) {
    log('\n🎉 Setup Complete!', colors.green)
    log('\n' + '='.repeat(50), colors.cyan)
    log('\n✅ Your CI/CD pipeline is ready to use!\n', colors.green)
    
    log('Quick Start:', colors.magenta)
    log('─'.repeat(50))
    log('1. Test the pipeline:')
    log('   npm run safe-push\n')
    log('2. Make a commit:')
    log('   git add .')
    log('   git commit -m "feat: your feature"\n')
    log('3. Push to trigger CI:')
    log('   git push\n')
    
    log('📚 Documentation:', colors.magenta)
    log('─'.repeat(50))
    log('- Full guide: CICD_SETUP_GUIDE.md')
    log('- Quick reference: CICD_QUICK_REFERENCE.md')
    log('- Summary: CICD_IMPLEMENTATION_SUMMARY.md\n')
    
    log('💡 Pro Tips:', colors.magenta)
    log('─'.repeat(50))
    log('- Run tests in watch mode: npm run test:watch')
    log('- Auto-fix lint issues: npm run lint:fix')
    log('- View coverage report: open coverage/index.html\n')
    
  } else {
    log('\n⚠️  Some files are missing. Please review the setup.\n', colors.yellow)
  }

  rl.close()
}

// Run setup
setupCI().catch((error) => {
  log(`\n❌ Setup failed: ${error.message}\n`, colors.red)
  process.exit(1)
})
