/**
 * Pipeline Builder - Build Pipeline Management System
 * 
 * Manages build, test, and deployment pipelines with
 * dependency resolution and caching.
 */

export interface PipelineStage {
  name: string;
  commands: string[];
  environment?: Record<string, string>;
  dependencies?: string[];
  cache?: string[];
  artifacts?: string[];
}

export interface Pipeline {
  name: string;
  stages: PipelineStage[];
  environment: Record<string, string>;
  triggers?: string[];
}

/**
 * PipelineBuilder class for managing build pipelines
 */
export class PipelineBuilder {
  private pipeline: Pipeline;

  constructor(name: string) {
    this.pipeline = {
      name,
      stages: [],
      environment: {},
      triggers: []
    };
  }

  /**
   * Add stage to pipeline
   */
  addStage(stage: PipelineStage): PipelineBuilder {
    this.pipeline.stages.push(stage);
    return this;
  }

  /**
   * Set environment variables
   */
  setEnvironment(env: Record<string, string>): PipelineBuilder {
    this.pipeline.environment = { ...this.pipeline.environment, ...env };
    return this;
  }

  /**
   * Add trigger
   */
  addTrigger(trigger: string): PipelineBuilder {
    if (!this.pipeline.triggers) {
      this.pipeline.triggers = [];
    }
    this.pipeline.triggers.push(trigger);
    return this;
  }

  /**
   * Build the pipeline
   */
  build(): Pipeline {
    return this.pipeline;
  }

  /**
   * Generate CI/CD configuration
   */
  generateConfig(platform: 'github' | 'gitlab' | 'vercel'): string {
    switch (platform) {
      case 'github':
        return this.generateGitHubActions();
      case 'gitlab':
        return this.generateGitLabCI();
      case 'vercel':
        return this.generateVercelConfig();
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }

  /**
   * Generate GitHub Actions workflow
   */
  private generateGitHubActions(): string {
    const triggers = this.pipeline.triggers?.join('\n  - ') || 'push';
    
    return `name: ${this.pipeline.name}

on:
  ${triggers}

jobs:
${this.pipeline.stages.map(stage => this.generateGitHubStage(stage)).join('\n\n')}
`;
  }

  /**
   * Generate GitHub Actions stage
   */
  private generateGitHubStage(stage: PipelineStage): string {
    const dependencies = stage.dependencies?.map(d => `    needs: ${d}`).join('\n') || '';
    const env = Object.entries({ ...this.pipeline.environment, ...stage.environment })
      .map(([key, value]) => `      ${key}: ${value}`)
      .join('\n');

    return `  ${stage.name}:
    runs-on: ubuntu-latest
${dependencies}
    steps:
      - uses: actions/checkout@v3
${stage.cache ? `      - uses: actions/cache@v3
        with:
          path: ${stage.cache.join('\n            ')}
          key: \${{ runner.os }}-cache` : ''}
${env ? `    env:\n${env}` : ''}
${stage.commands.map(cmd => `      - run: ${cmd}`).join('\n')}
${stage.artifacts ? `      - uses: actions/upload-artifact@v3
        with:
          name: ${stage.name}-artifacts
          path: ${stage.artifacts.join('\n            ')}` : ''}`;
  }

  /**
   * Generate GitLab CI configuration
   */
  private generateGitLabCI(): string {
    return `stages:
${this.pipeline.stages.map(s => `  - ${s.name}`).join('\n')}

${this.pipeline.stages.map(stage => this.generateGitLabStage(stage)).join('\n\n')}
`;
  }

  /**
   * Generate GitLab CI stage
   */
  private generateGitLabStage(stage: PipelineStage): string {
    const dependencies = stage.dependencies?.map(d => `    - ${d}`).join('\n') || '';

    return `${stage.name}:
  stage: ${stage.name}
${dependencies ? `  needs:\n${dependencies}` : ''}
  script:
${stage.commands.map(cmd => `    - ${cmd}`).join('\n')}
${stage.cache ? `  cache:
    paths:
${stage.cache.map(p => `      - ${p}`).join('\n')}` : ''}
${stage.artifacts ? `  artifacts:
    paths:
${stage.artifacts.map(p => `      - ${p}`).join('\n')}` : ''}`;
  }

  /**
   * Generate Vercel configuration
   */
  private generateVercelConfig(): string {
    const buildStage = this.pipeline.stages.find(s => s.name.includes('build'));
    const installStage = this.pipeline.stages.find(s => s.name.includes('install'));

    return JSON.stringify({
      version: 2,
      builds: [{
        src: 'package.json',
        use: '@vercel/node'
      }],
      env: this.pipeline.environment,
      buildCommand: buildStage?.commands[0] || 'npm run build',
      installCommand: installStage?.commands[0] || 'npm install',
      devCommand: 'npm run dev',
      framework: 'nextjs'
    }, null, 2);
  }

  /**
   * Create standard Node.js pipeline
   */
  static createNodePipeline(name: string): PipelineBuilder {
    const builder = new PipelineBuilder(name);

    return builder
      .addStage({
        name: 'install',
        commands: ['npm ci'],
        cache: ['node_modules']
      })
      .addStage({
        name: 'lint',
        commands: ['npm run lint'],
        dependencies: ['install']
      })
      .addStage({
        name: 'test',
        commands: ['npm test'],
        dependencies: ['install']
      })
      .addStage({
        name: 'build',
        commands: ['npm run build'],
        dependencies: ['lint', 'test'],
        artifacts: ['dist']
      })
      .addTrigger('push')
      .addTrigger('pull_request');
  }

  /**
   * Create deployment pipeline
   */
  static createDeploymentPipeline(name: string, platform: string): PipelineBuilder {
    const builder = new PipelineBuilder(name);

    return builder
      .addStage({
        name: 'build',
        commands: ['npm run build']
      })
      .addStage({
        name: 'deploy',
        commands: [`${platform} deploy`],
        dependencies: ['build']
      })
      .addTrigger('push');
  }
}
