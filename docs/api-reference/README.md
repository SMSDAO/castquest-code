# API Reference

Complete API documentation for AiCode components.

## Overview

This section provides detailed API documentation for all AiCode modules, classes, and functions.

## Core APIs

### [Engine API](./engine.md)
Complete reference for the AiCode Engine.

**Main Classes:**
- `AiCodeEngine` - Main processing engine
- `AiCodeConfig` - Configuration interface
- `AiCodeResult` - Result interface

**Methods:**
- `initialize()` - Initialize the engine
- `process()` - Process code
- `analyzeCode()` - Analyze mode
- `generateCode()` - Generate mode
- `repairCode()` - Repair mode
- `optimizeCode()` - Optimize mode

### [Analyzer API](./analyzer.md)
Code analysis system API.

**Main Classes:**
- `CodeAnalyzer` - Main analyzer class
- `AnalysisResult` - Analysis result interface
- `CodeMetrics` - Metrics interface

**Methods:**
- `analyze(target)` - Analyze code
- `findIssues(target)` - Find issues
- `extractSpecifications(target)` - Extract specs

### [Generator API](./generator.md)
Code generation system API.

**Main Classes:**
- `CodeGenerator` - Main generator class
- `GenerationSpec` - Generation specification
- `GeneratedCode` - Generated code interface

**Methods:**
- `generate(spec)` - Generate code
- `generateTests(code)` - Generate tests
- `addComments(content)` - Add comments

### [Builder APIs](./builders.md)
All builder APIs in one place.

**Builders:**
- Flow Builder
- Component Builder
- Workflow Builder
- Pipeline Builder

### [Utility APIs](./utilities.md)
Automation utility APIs.

**Utilities:**
- Auto Sync
- Auto Config
- Auto Repair
- Auto Fix
- Auto Test
- Auto Deploy
- Auto Comments

## Configuration Schema

### [Configuration Schema](./config-schema.md)
JSON schema for all configuration files.

**Files:**
- aicode.config.json
- builder.config.json
- automation.config.json

## Quick Reference

### AiCode Engine

```typescript
interface AiCodeConfig {
  mode: 'analyze' | 'generate' | 'repair' | 'optimize' | 'auto';
  target: string;
  options?: {
    verbose?: boolean;
    dryRun?: boolean;
    autoFix?: boolean;
    generateTests?: boolean;
    generateComments?: boolean;
  };
}

class AiCodeEngine {
  constructor(config: AiCodeConfig);
  async initialize(): Promise<void>;
  async process(): Promise<AiCodeResult>;
}
```

### Code Analyzer

```typescript
interface AnalysisResult {
  file: string;
  language: string;
  complexity: number;
  metrics: CodeMetrics;
  issues: CodeIssue[];
  patterns: CodePattern[];
  dependencies: string[];
}

class CodeAnalyzer {
  async initialize(): Promise<void>;
  async analyze(targetPath: string): Promise<AnalysisResult>;
  async findIssues(targetPath: string): Promise<{
    warnings: string[];
    errors: string[];
  }>;
}
```

### Code Generator

```typescript
interface GenerationSpec {
  type: 'component' | 'function' | 'class' | 'test' | 'documentation';
  language: string;
  name: string;
  description?: string;
  parameters?: any[];
  returnType?: string;
}

class CodeGenerator {
  async initialize(): Promise<void>;
  async generate(spec: GenerationSpec): Promise<GeneratedCode>;
  async generateTests(code: GeneratedCode): Promise<string>;
  async addComments(content: string): Promise<string>;
}
```

### Flow Builder

```typescript
interface Flow {
  id: string;
  name: string;
  description: string;
  steps: FlowStep[];
  metadata: {
    created: Date;
    version: string;
  };
}

class FlowBuilder {
  async initialize(): Promise<void>;
  async buildAutoFlow(target: string): Promise<Flow>;
  buildFlow(config: FlowConfig): Flow;
  validateFlow(flow: Flow): { valid: boolean; errors: string[] };
}
```

### Component Builder

```typescript
interface ComponentSpec {
  name: string;
  type: 'ui' | 'service' | 'util' | 'model';
  framework?: 'react' | 'vue' | 'angular' | 'none';
  props?: ComponentProp[];
  methods?: ComponentMethod[];
  state?: ComponentState[];
}

class ComponentBuilder {
  async build(spec: ComponentSpec): Promise<string>;
}
```

### Automation Utilities

```typescript
// Auto Sync
class AutoSync {
  constructor(config: SyncConfig);
  async sync(): Promise<SyncResult>;
  async watch(interval?: number): Promise<void>;
}

// Auto Config
class AutoConfig {
  constructor(options: ConfigOptions);
  async configure(): Promise<void>;
}

// Auto Repair
class AutoRepair {
  constructor(options: RepairOptions);
  async repair(): Promise<RepairResult>;
}

// Auto Fix
class AutoFix {
  constructor(options: FixOptions);
  async fix(): Promise<FixResult>;
}

// Auto Test
class AutoTest {
  constructor(options: TestOptions);
  async test(): Promise<TestResult>;
}

// Auto Deploy
class AutoDeploy {
  constructor(options: DeployOptions);
  async deploy(): Promise<DeployResult>;
}

// Auto Comments
class AutoComments {
  constructor(options: CommentOptions);
  async generate(): Promise<CommentResult>;
}
```

## Type Definitions

### Common Types

```typescript
// Result types
interface Result {
  success: boolean;
  data?: any;
  errors?: string[];
  warnings?: string[];
  suggestions?: string[];
}

// Configuration types
interface Config {
  version: string;
  [key: string]: any;
}

// Metrics types
interface Metrics {
  linesOfCode: number;
  commentLines: number;
  functionCount: number;
  classCount: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
}
```

## Error Handling

### Error Types

```typescript
class AiCodeError extends Error {
  code: string;
  details: any;
}

class AnalysisError extends AiCodeError {}
class GenerationError extends AiCodeError {}
class BuilderError extends AiCodeError {}
```

### Error Codes

- `INIT_ERROR` - Initialization failed
- `ANALYSIS_ERROR` - Analysis failed
- `GENERATION_ERROR` - Generation failed
- `BUILD_ERROR` - Build failed
- `DEPLOY_ERROR` - Deployment failed

## Usage Examples

See the [Examples](../examples/README.md) section for detailed usage examples.

## Contributing

Help improve the API documentation:

1. Report unclear documentation
2. Suggest improvements
3. Add examples
4. Fix errors

---

**For detailed API documentation, see the individual pages:**
- [Engine API](./engine.md)
- [Analyzer API](./analyzer.md)
- [Generator API](./generator.md)
- [Builder APIs](./builders.md)
- [Utility APIs](./utilities.md)
