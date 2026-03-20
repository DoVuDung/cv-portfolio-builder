# 🔐 mcps-lock.json - MCP Servers Lock File Documentation

## Overview

The **`mcps-lock.json`** is a comprehensive lock file that defines all MCP (Model Context Protocol) servers, their configurations, tools, dependencies, and capabilities for the CV Portfolio Builder project.

---

## 📋 Purpose

This file serves as:
1. **Single Source of Truth** - Complete MCP server registry
2. **Dependency Management** - Tracks all MCP-related packages
3. **Tool Registry** - Documents all available tools and schemas
4. **Configuration Hub** - Centralized server settings
5. **Security & Performance** - Defines limits and policies

---

## 🏗️ Structure

### 1. **Version Information**
```json
{
  "version": "1.0.0",
  "lockfileVersion": 1,
  "requires": true,
  "description": "MCP Servers Lock File - CV Portfolio Builder"
}
```

### 2. **Servers Registry** (`servers`)

Defines all MCP servers with complete metadata:

#### A. CV Design Viewer Server
- **Purpose**: View and analyze CV design
- **Tools**: 5 tools for design analysis
- **Capabilities**: Design analysis, ATS optimization, version comparison, documentation generation
- **File**: `src/mcp/design-viewer-server.ts`

#### B. Stitch Context Server
- **Purpose**: Google Stitch UI integration
- **Tools**: 2 tools for data sync
- **Capabilities**: Context cloning, bidirectional transfer, data sync
- **File**: `src/mcp/stitch-context-server.ts`

#### C. Skill Agent Server
- **Purpose**: AI-powered CV optimization
- **Tools**: 6 tools for content enhancement
- **Capabilities**: CV analysis, ATS optimization, content generation, skill extraction
- **File**: `src/agent/core/agent.ts`

---

## 🛠️ Server Configuration Details

### CV Design Viewer Server

```json
{
  "cv-design-viewer": {
    "version": "1.0.0",
    "resolved": "src/mcp/design-viewer-server.ts",
    "tools": [
      {
        "name": "view-cv-design",
        "inputSchema": {},
        "outputSchema": { /* JSON Schema */ }
      },
      {
        "name": "analyze-ats-design",
        "inputSchema": {},
        "outputSchema": { /* JSON Schema */ }
      },
      // ... 3 more tools
    ],
    "capabilities": {
      "design_analysis": true,
      "ats_optimization": true,
      "version_comparison": true,
      "documentation_generation": true
    },
    "configuration": {
      "debug": false,
      "autoSave": true,
      "defaultFormat": "json",
      "atsThreshold": 75,
      "enableLogging": true,
      "maxConcurrentOperations": 10,
      "cacheEnabled": true,
      "cacheTTL": 3600
    }
  }
}
```

### Key Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `debug` | boolean | false | Enable debug logging |
| `autoSave` | boolean | true | Auto-save analysis results |
| `defaultFormat` | string | "json" | Default export format |
| `atsThreshold` | number | 75 | Target ATS score |
| `enableLogging` | boolean | true | Enable operation logging |
| `maxConcurrentOperations` | number | 10 | Max parallel operations |
| `cacheEnabled` | boolean | true | Enable result caching |
| `cacheTTL` | number | 3600 | Cache time-to-live (seconds) |

---

## 📦 Dependencies

### External Packages

```json
{
  "packages": {
    "@modelcontextprotocol/sdk": {
      "version": "1.0.0",
      "integrity": "sha512-...",
      "dependencies": ["content-type", "raw-body", "zod"]
    },
    "zod": {
      "version": "3.22.4",
      "integrity": "sha512-..."
    },
    "@tanstack/store": {
      "version": "0.5.0",
      "peerDependencies": ["react"]
    }
  }
}
```

### Peer Dependencies
- **TypeScript**: ^5.0.0 (required)
- **React**: ^18.0.0 || ^19.0.0 (optional, for Skill Agent)

---

## 🔧 Tool Registry

### Total Tools: 13

#### By Server
- **cv-design-viewer**: 5 tools
- **stitch-context-server**: 2 tools
- **skill-agent-server**: 6 tools

#### By Category
- **Analysis**: 3 tools (view-cv-design, analyze-ats-design, analyze-cv)
- **Optimization**: 2 tools (optimize-ats, improve-experience)
- **Generation**: 2 tools (generate-summary, generate-design-docs)
- **Extraction**: 2 tools (extract-skills, map-to-sections)
- **Integration**: 2 tools (clone-stitch-context, push-to-stitch)
- **Documentation**: 1 tool (export-design-spec)
- **Comparison**: 1 tool (compare-design-versions)

---

## 🎯 Capabilities Matrix

| Capability | Servers | Tools |
|------------|---------|-------|
| **Design Analysis** | cv-design-viewer | view-cv-design, analyze-ats-design |
| **ATS Optimization** | cv-design-viewer, skill-agent | analyze-ats-design, optimize-ats |
| **Content Generation** | skill-agent | generate-summary, improve-experience |
| **Data Sync** | stitch-context-server | clone-stitch-context, push-to-stitch |
| **Documentation** | cv-design-viewer | generate-design-docs, export-design-spec |
| **Skill Extraction** | skill-agent | extract-skills |
| **Version Comparison** | cv-design-viewer | compare-design-versions |

---

## 🔒 Security Configuration

```json
{
  "security": {
    "sandboxed": true,
    "requiresAuth": false,
    "allowedOrigins": ["*"],
    "rateLimiting": {
      "enabled": true,
      "maxRequestsPerMinute": 60,
      "maxRequestsPerHour": 1000
    },
    "dataPrivacy": {
      "localOnly": true,
      "noExternalCalls": true,
      "encryptAtRest": false
    }
  }
}
```

### Security Features
- ✅ **Sandboxed Execution** - Isolated environment
- ✅ **Rate Limiting** - Prevents abuse (60 req/min, 1000 req/hour)
- ✅ **Local-Only Processing** - No external data transmission
- ✅ **Origin Control** - Configurable allowed origins
- ⚠️ **No Auth Required** - Can be enabled for production

---

## ⚡ Performance Metrics

### Response Times
```json
{
  "avgResponseTime": {
    "view-cv-design": "50ms",
    "analyze-ats-design": "100ms",
    "export-design-spec": "150ms",
    "compare-design-versions": "200ms",
    "generate-design-docs": "300ms"
  }
}
```

### Memory Usage
```json
{
  "memoryUsage": {
    "base": "20MB",
    "perOperation": "5-15MB",
    "maxConcurrent": "10 operations"
  }
}
```

### Caching Strategy
```json
{
  "caching": {
    "enabled": true,
    "strategy": "lru",
    "ttl": 3600,
    "maxSize": "100MB"
  }
}
```

---

## 🌐 Compatibility

### MCP Protocol
- **Version**: 1.0.0
- **Min Client Version**: 0.1.0

### Supported Clients
- ✅ Cursor IDE
- ✅ Claude Desktop
- ✅ Windsurf
- ✅ Custom MCP Clients

### Transport Protocols
- ✅ stdio (standard in/out)
- ✅ HTTP
- ✅ WebSocket

### Platform Support
- **OS**: darwin, linux, win32
- **CPU**: x64, arm64
- **Node.js**: >=18.0.0
- **Bun**: >=1.0.0

---

## 🛠️ Usage Examples

### Accessing Server Configuration

```typescript
import mcpsLock from './mcps-lock.json'

// Get server info
const server = mcpsLock.servers['cv-design-viewer']
console.log(server.version) // "1.0.0"
console.log(server.tools.length) // 5 tools

// Check capabilities
if (server.capabilities.design_analysis) {
  console.log('✅ Design analysis supported')
}

// Get tool schema
const tool = server.tools.find(t => t.name === 'analyze-ats-design')
console.log(tool.inputSchema)
console.log(tool.outputSchema)
```

### Validating Tool Calls

```typescript
import { z } from 'zod'
import mcpsLock from './mcps-lock.json'

// Validate input against schema
function validateToolInput(toolName: string, input: any) {
  const server = Object.values(mcpsLock.servers).find(s => 
    s.tools.some(t => t.name === toolName)
  )
  
  if (!server) throw new Error(`Tool ${toolName} not found`)
  
  const tool = server.tools.find(t => t.name === toolName)
  const schema = z.object({
    // Convert JSON Schema to Zod
    // This is simplified - use a proper converter
  })
  
  return schema.parse(input)
}
```

### Checking Compatibility

```typescript
// Check if client is compatible
function isClientCompatible(clientVersion: string): boolean {
  const minVersion = mcpsLock.compatibility.minClientVersion
  return semver.gte(clientVersion, minVersion)
}

// Check transport support
function supportsTransport(transport: string): boolean {
  return mcpsLock.compatibility.transportProtocols.includes(transport)
}
```

---

## 🔍 Tool Schemas

### Example: analyze-ats-design

```json
{
  "name": "analyze-ats-design",
  "inputSchema": {},
  "outputSchema": {
    "type": "object",
    "properties": {
      "message": { "type": "string" },
      "analysis": {
        "type": "object",
        "properties": {
          "score": { 
            "type": "number", 
            "minimum": 0, 
            "maximum": 100 
          },
          "strengths": { 
            "type": "array", 
            "items": { "type": "string" } 
          },
          "weaknesses": { 
            "type": "array", 
            "items": { "type": "string" } 
          },
          "recommendations": { 
            "type": "array", 
            "items": { "type": "string" } 
          },
          "keywords": { 
            "type": "array", 
            "items": { "type": "string" } 
          }
        }
      }
    }
  }
}
```

---

## 📊 Statistics

### File Metrics
- **Total Lines**: 539
- **Servers Defined**: 3
- **Tools Documented**: 13
- **Capabilities Tracked**: 10+
- **Dependencies**: 3 core packages

### Coverage
- **Design Tools**: 5/5 documented
- **Integration Tools**: 2/2 documented
- **AI Tools**: 6/6 documented
- **Configuration**: 100% covered
- **Security**: All policies defined
- **Performance**: All metrics tracked

---

## 🔄 Update Process

### When to Update
- Adding new MCP servers
- Updating tool schemas
- Changing server configurations
- Modifying security policies
- Updating performance metrics

### How to Update
1. Edit `mcps-lock.json`
2. Update version numbers if needed
3. Update checksums for modified files
4. Update `lastUpdated` timestamp
5. Test all affected tools
6. Commit changes

---

## 🎯 Best Practices

### ✅ Do's
- Keep versions in sync with actual server implementations
- Update checksums when source files change
- Document all tools with complete schemas
- Set reasonable rate limits
- Enable caching for better performance
- Regularly review security settings

### ❌ Don'ts
- Don't hardcode sensitive credentials
- Don't disable rate limiting in production
- Don't allow all origins without validation
- Don't ignore update timestamps
- Don't skip checksum validation

---

## 🔐 Security Considerations

### Current Settings
```json
{
  "sandboxed": true,        // ✅ Good - isolated execution
  "requiresAuth": false,    // ⚠️ Consider enabling for production
  "allowedOrigins": ["*"],  // ⚠️ Restrict in production
  "localOnly": true         // ✅ Good - no external calls
}
```

### Recommendations
1. **Enable Authentication** for production deployments
2. **Restrict Origins** to known domains
3. **Enable Encryption** for sensitive data at rest
4. **Monitor Rate Limits** and adjust based on usage
5. **Audit Logs** regularly for suspicious activity

---

## 📈 Monitoring

### Key Metrics to Track
- Tool invocation counts
- Average response times
- Error rates per tool
- Cache hit/miss ratios
- Memory usage trends
- Rate limit violations

### Logging Configuration
```json
{
  "environment": {
    "NODE_ENV": "production",
    "DEBUG": "false",
    "LOG_LEVEL": "info"
  }
}
```

---

## 🎓 Integration Guide

### With Package Managers

```bash
# Install MCP SDK
npm install @modelcontextprotocol/sdk zod

# Or with Bun
bun install @modelcontextprotocol/sdk zod

# Verify installation matches lock file
npm list @modelcontextprotocol/sdk zod
```

### With Build Systems

```javascript
// vite.config.js
export default {
  define: {
    MCPS_LOCK: JSON.stringify(require('./mcps-lock.json'))
  }
}

// Usage in code
import MCPS_LOCK from 'virtual:mcps-lock'
console.log(MCPS_LOCK.servers)
```

---

## ✅ Validation Checklist

Use this to validate your `mcps-lock.json`:

- [ ] All servers have valid version strings
- [ ] All tools have complete input/output schemas
- [ ] Dependencies match package.json
- [ ] Checksums are up-to-date
- [ ] Security settings are appropriate
- [ ] Performance metrics are realistic
- [ ] Capabilities match actual features
- [ ] Timestamps are current
- [ ] Maintainer info is correct

---

## 📞 Support

### Related Documentation
- [MCP Design Viewer Guide](./MCP_DESIGN_VIEWER_GUIDE.md)
- [Quick Reference](./MCP_QUICK_REFERENCE.md)
- [Server Implementation](./src/mcp/design-viewer-server.ts)

### Getting Help
- Check tool schemas for expected inputs/outputs
- Review server configurations for settings
- Monitor logs for error messages
- Validate checksums for integrity

---

## 🎉 Summary

The `mcps-lock.json` file is your **central configuration hub** for all MCP servers, providing:

- ✅ Complete server registry (3 servers)
- ✅ Tool documentation (13 tools)
- ✅ Dependency tracking (3 packages)
- ✅ Security policies (rate limits, origins)
- ✅ Performance metrics (response times, memory)
- ✅ Capability matrix (10+ capabilities)
- ✅ Compatibility info (clients, protocols)

**Status:** ✅ Created and Ready  
**Version:** 1.0.0  
**Last Updated:** March 20, 2026  
**Maintainer:** Dung Do (Andy)  

---

**Built with:** JSON Schema, TypeScript, MCP Protocol  
**License:** MIT  
**Repository:** github:DoVuDung/cv-portfolio-builder
