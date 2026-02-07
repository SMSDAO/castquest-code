# Quick Start Guide

Get up and running with AiCode in under 5 minutes!

## Installation

### Option 1: Using npm (Recommended)

```bash
# Navigate to the app directory
cd app/

# Install dependencies
npm install

# Verify installation
npm run aicode:auto -- --help
```

### Option 2: Direct Usage

```bash
# Clone the repository
git clone <repository-url>
cd castquest-code/app

# Run AiCode directly
node core/aicode-engine.ts auto .
```

## Your First AiCode Command

### 1. Analyze Your Code

```bash
npm run aicode:analyze
```

This will:
- Scan your codebase
- Calculate complexity metrics
- Identify patterns and anti-patterns
- Generate a comprehensive analysis report

### 2. Auto-Configure Your Project

```bash
npm run config
```

AiCode will automatically:
- Detect your framework (React, Vue, Node, etc.)
- Generate appropriate configuration files
- Set up linting and formatting
- Create test configuration

### 3. Run Automated Tests

```bash
npm run auto-test -- --generate --coverage
```

This command will:
- Generate test files for your code
- Run all tests
- Generate coverage reports

### 4. Deploy to Vercel

```bash
npm run deploy
```

One command to:
- Build your project
- Run tests
- Deploy to Vercel
- Get your deployment URL

## Basic Configuration

Create a `.aicode.config.json` in your project root:

```json
{
  "engine": {
    "mode": "auto",
    "verbose": true
  },
  "features": {
    "codeAnalysis": true,
    "codeGeneration": true,
    "automation": {
      "autoSync": true,
      "autoTest": true,
      "autoDeploy": false
    }
  }
}
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run aicode:auto` | Run full automated workflow |
| `npm run aicode:analyze` | Analyze code |
| `npm run aicode:generate` | Generate code |
| `npm run sync` | Sync code across environments |
| `npm run repair` | Auto-repair code issues |
| `npm run fix` | Fix bugs and security issues |
| `npm run auto-test` | Generate and run tests |
| `npm run comments` | Generate documentation |
| `npm run deploy` | Deploy to platform |

## Next Steps

- 📖 Read the [Installation Guide](./installation.md) for detailed setup
- ⚙️ Learn about [Configuration](./configuration.md)
- 🎯 Try [Your First Project](./first-project.md)
- 🏗️ Explore [Builders](../builders/README.md)
- ⚙️ Discover [Automation Utilities](../automation-utilities/README.md)

## Getting Help

If you encounter any issues:
1. Check the [Troubleshooting Guide](../guides/troubleshooting.md)
2. Review the [API Reference](../api-reference/README.md)
3. Look at [Examples](../examples/README.md)

## What's Next?

Now that you have AiCode running, explore:
- **Core Concepts** - Understand how AiCode works
- **Builders** - Create custom workflows
- **Automation** - Set up continuous automation
- **Examples** - See real-world use cases

Happy coding with AiCode! 🚀
