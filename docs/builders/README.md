# Builders

AiCode provides powerful builder components for constructing flows, components, workflows, and pipelines.

## Overview

The Builder system enables you to:
- Create custom execution flows
- Generate UI components
- Orchestrate complex workflows
- Define CI/CD pipelines

## Builder Types

### [Flow Builder](./flow-builder.md)
Constructs execution flows that orchestrate AiCode components into automated workflows.

**Use Cases:**
- Custom processing pipelines
- Multi-step code transformations
- Automated quality checks
- Development workflows

**Example:**
```typescript
const flow = await flowBuilder.buildAutoFlow('./src');
await engine.executeFlow(flow);
```

### [Component Builder](./component-builder.md)
Generates UI components for React, Vue, and Angular frameworks.

**Use Cases:**
- Rapid component scaffolding
- Consistent component structure
- Cross-framework development
- Component library creation

**Example:**
```typescript
const component = await componentBuilder.build({
  name: 'UserProfile',
  framework: 'react',
  props: [{ name: 'user', type: 'User', required: true }]
});
```

### [Workflow Builder](./workflow-builder.md)
Orchestrates complex workflows with parallel execution and conditional logic.

**Use Cases:**
- Complex build processes
- Data processing pipelines
- Multi-stage deployments
- Automated testing suites

**Example:**
```typescript
const workflow = new WorkflowBuilder()
  .createWorkflow('build')
  .addStep({ name: 'lint', action: runLint })
  .addStep({ name: 'test', action: runTests })
  .build();
```

### [Pipeline Builder](./pipeline-builder.md)
Defines CI/CD pipelines with dependency management and caching.

**Use Cases:**
- GitHub Actions workflows
- GitLab CI/CD
- Vercel deployments
- Custom build pipelines

**Example:**
```typescript
const pipeline = PipelineBuilder
  .createNodePipeline('CI/CD')
  .generateConfig('github');
```

## Quick Start

### Install Builders

```bash
cd app/
npm install
```

### Use Flow Builder

```bash
# Run predefined auto flow
npm run aicode:auto

# Create custom flow
node -e "
const { FlowBuilder } = require('./builders/flow-builder');
const builder = new FlowBuilder();
// ... create custom flow
"
```

### Generate Components

```bash
# Generate React component
node builders/component-builder.ts MyComponent react

# Generate Vue component
node builders/component-builder.ts MyComponent vue
```

## Integration

### In Your Code

```typescript
import { FlowBuilder } from './builders/flow-builder';
import { ComponentBuilder } from './builders/component-builder';
import { WorkflowBuilder } from './builders/workflow-builder';
import { PipelineBuilder } from './builders/pipeline-builder';

// Create a complete workflow
const flowBuilder = new FlowBuilder();
const flow = await flowBuilder.buildAutoFlow('./src');

const componentBuilder = new ComponentBuilder();
const component = await componentBuilder.build(spec);

const workflowBuilder = new WorkflowBuilder();
const workflow = workflowBuilder
  .createWorkflow('build')
  .addStep(step1)
  .build();

const pipeline = PipelineBuilder.createNodePipeline('CI');
```

### Configuration

Configure builders in `builder.config.json`:

```json
{
  "builders": {
    "flow": {
      "defaultSteps": ["analyze", "test", "build"],
      "parallel": false
    },
    "component": {
      "frameworks": {
        "react": { "typescript": true, "hooks": true }
      }
    },
    "workflow": {
      "retries": 3,
      "timeout": 30000
    },
    "pipeline": {
      "stages": {
        "build": { "command": "npm run build" }
      }
    }
  }
}
```

## Builder Patterns

### Composite Pattern

```typescript
// Combine multiple builders
const flow = flowBuilder.buildFlow({
  steps: [
    { action: 'analyze', builder: 'flow' },
    { action: 'generate', builder: 'component' },
    { action: 'test', builder: 'workflow' }
  ]
});
```

### Factory Pattern

```typescript
// Create builders from configuration
class BuilderFactory {
  static create(type: string) {
    switch (type) {
      case 'flow': return new FlowBuilder();
      case 'component': return new ComponentBuilder();
      case 'workflow': return new WorkflowBuilder();
      case 'pipeline': return new PipelineBuilder('default');
    }
  }
}
```

## Best Practices

1. **Modular Flows** - Break complex flows into smaller steps
2. **Type Safety** - Use TypeScript for builder configurations
3. **Error Handling** - Implement retry logic in workflows
4. **Caching** - Use pipeline caching for faster builds
5. **Testing** - Test builders with different configurations

## Common Patterns

### Development Flow

```typescript
const devFlow = flowBuilder.buildFlow({
  name: 'Development',
  steps: [
    { id: 'sync', action: 'sync' },
    { id: 'analyze', action: 'analyze' },
    { id: 'repair', action: 'repair' },
    { id: 'test', action: 'test' }
  ]
});
```

### Production Pipeline

```typescript
const prodPipeline = new PipelineBuilder('Production')
  .addStage({ name: 'test', commands: ['npm test'] })
  .addStage({ name: 'build', commands: ['npm run build'] })
  .addStage({ name: 'deploy', commands: ['vercel deploy --prod'] })
  .build();
```

## Examples

### Example 1: Custom Component Generator

```typescript
const componentBuilder = new ComponentBuilder();

const spec = {
  name: 'UserCard',
  type: 'ui',
  framework: 'react',
  props: [
    { name: 'user', type: 'User', required: true },
    { name: 'onEdit', type: '() => void', required: false }
  ]
};

const code = await componentBuilder.build(spec);
console.log(code);
```

### Example 2: CI/CD Pipeline

```typescript
const pipeline = PipelineBuilder
  .createNodePipeline('CI/CD')
  .setEnvironment({ NODE_ENV: 'production' })
  .addTrigger('push')
  .addTrigger('pull_request');

const githubActions = pipeline.generateConfig('github');
fs.writeFileSync('.github/workflows/ci.yml', githubActions);
```

### Example 3: Complex Workflow

```typescript
const workflow = new WorkflowBuilder()
  .createWorkflow('full-stack-build')
  .addStep({
    id: 'frontend',
    name: 'Build Frontend',
    action: async () => execAsync('npm run build:frontend'),
    parallel: true
  })
  .addStep({
    id: 'backend',
    name: 'Build Backend',
    action: async () => execAsync('npm run build:backend'),
    parallel: true
  })
  .addStep({
    id: 'deploy',
    name: 'Deploy',
    action: async () => execAsync('npm run deploy'),
    dependencies: ['frontend', 'backend']
  });

const result = await workflow.execute('full-stack-build');
```

## Advanced Topics

- [Custom Flow Steps](./flow-builder.md#custom-steps)
- [Component Templates](./component-builder.md#templates)
- [Workflow Orchestration](./workflow-builder.md#orchestration)
- [Pipeline Optimization](./pipeline-builder.md#optimization)

## API Reference

For detailed API documentation, see:
- [Flow Builder API](../api-reference/builders.md#flow-builder)
- [Component Builder API](../api-reference/builders.md#component-builder)
- [Workflow Builder API](../api-reference/builders.md#workflow-builder)
- [Pipeline Builder API](../api-reference/builders.md#pipeline-builder)

## Next Steps

- Explore [Automation Utilities](../automation-utilities/README.md)
- Learn [Core Concepts](../core-concepts/README.md)
- See [Examples](../examples/README.md)
- Read [Best Practices](../guides/best-practices.md)

---

**Need help?** Check the [Troubleshooting Guide](../guides/troubleshooting.md)
