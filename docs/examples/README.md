# Examples

Real-world examples demonstrating AiCode capabilities.

## Overview

This section provides practical examples showing how to use AiCode in real projects.

## Available Examples

### [Basic Usage](./basic-usage.md)
Simple examples to get started with AiCode.

**Topics:**
- Running your first analysis
- Generating a simple component
- Creating basic tests
- Deploying a project

### [Advanced Workflows](./advanced-workflows.md)
Complex workflows combining multiple AiCode features.

**Examples:**
- Multi-stage build pipeline
- Parallel test execution
- Conditional deployments
- Custom flow composition

### [Custom Components](./custom-components.md)
Creating custom components with Component Builder.

**Examples:**
- React components
- Vue components
- Angular components
- Custom templates

### [CI/CD Integration](./ci-cd-integration.md)
Integrating AiCode with CI/CD platforms.

**Platforms:**
- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI

### [Multi-Platform Deployment](./multi-platform.md)
Deploying to multiple platforms from one codebase.

**Examples:**
- Vercel + AWS
- Netlify + Heroku
- Multi-environment deployment
- Blue-green deployment

## Quick Examples

### Example 1: Analyze and Report

```bash
# Analyze codebase
npm run aicode:analyze > analysis.json

# Review the report
cat analysis.json | jq '.data.metrics'
```

### Example 2: Generate React Component

```typescript
import { ComponentBuilder } from './builders/component-builder';

const builder = new ComponentBuilder();
const component = await builder.build({
  name: 'UserProfile',
  type: 'ui',
  framework: 'react',
  props: [
    { name: 'user', type: 'User', required: true },
    { name: 'onSave', type: '(user: User) => void', required: true }
  ],
  state: [
    { name: 'editing', type: 'boolean', initial: false }
  ]
});

console.log(component);
```

### Example 3: Automated Testing

```bash
# Generate tests for all source files
npm run auto-test -- --generate

# Run tests with coverage
npm run auto-test -- --coverage

# Watch mode for development
npm run auto-test -- --watch
```

### Example 4: Complete Workflow

```typescript
import { AiCodeEngine } from './core/aicode-engine';
import { FlowBuilder } from './builders/flow-builder';

async function completeWorkflow() {
  // Build custom flow
  const flowBuilder = new FlowBuilder();
  const flow = await flowBuilder.buildAutoFlow('./src');

  // Execute with engine
  const engine = new AiCodeEngine({
    mode: 'auto',
    target: './src',
    options: {
      verbose: true,
      autoFix: true,
      generateTests: true
    }
  });

  await engine.initialize();
  const result = await engine.process();

  console.log('Workflow complete:', result);
}

completeWorkflow();
```

### Example 5: CI/CD Pipeline

```yaml
# .github/workflows/aicode.yml
name: AiCode CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  aicode:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd app
          npm ci
      
      - name: Run AiCode Analysis
        run: npm run aicode:analyze
      
      - name: Auto Repair
        run: npm run repair
      
      - name: Run Tests
        run: npm run auto-test -- --coverage
      
      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: npm run deploy
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### Example 6: Custom Builder

```typescript
import { ComponentBuilder } from './builders/component-builder';

class CustomComponentBuilder extends ComponentBuilder {
  async buildCustom(spec: any): Promise<string> {
    // Custom component generation logic
    const baseComponent = await this.build(spec);
    
    // Add custom features
    const customCode = `
${baseComponent}

// Custom hooks
export const use${spec.name} = () => {
  // Custom logic
};
`;
    
    return customCode;
  }
}

// Usage
const builder = new CustomComponentBuilder();
const component = await builder.buildCustom({
  name: 'DataTable',
  framework: 'react'
});
```

## Project Examples

### Example Project 1: E-commerce Site

```bash
# Initialize
npm run config -- ecommerce react

# Generate components
npm run aicode:generate -- UserProfile
npm run aicode:generate -- ProductCard
npm run aicode:generate -- ShoppingCart

# Generate tests
npm run auto-test -- --generate

# Deploy
npm run deploy -- vercel
```

### Example Project 2: API Server

```bash
# Configure
npm run config -- api express

# Analyze existing code
npm run aicode:analyze

# Repair issues
npm run repair

# Generate tests
npm run auto-test -- --generate --coverage

# Deploy
npm run deploy -- heroku
```

### Example Project 3: Full Stack App

```bash
# Frontend
cd frontend
npm run aicode:generate -- components/

# Backend
cd backend
npm run aicode:analyze
npm run auto-test

# Deploy both
cd ..
npm run deploy -- --multi-platform
```

## Learning Path

1. Start with [Basic Usage](./basic-usage.md)
2. Try [Custom Components](./custom-components.md)
3. Explore [Advanced Workflows](./advanced-workflows.md)
4. Set up [CI/CD Integration](./ci-cd-integration.md)
5. Master [Multi-Platform Deployment](./multi-platform.md)

## Additional Resources

- [Core Concepts](../core-concepts/README.md)
- [Builders Documentation](../builders/README.md)
- [Automation Utilities](../automation-utilities/README.md)
- [API Reference](../api-reference/README.md)

## Contributing Examples

Have a great example? Contribute it:

1. Create a new example file
2. Follow the existing format
3. Test your example
4. Submit a pull request

---

**Ready to try?** Start with [Basic Usage](./basic-usage.md)!
