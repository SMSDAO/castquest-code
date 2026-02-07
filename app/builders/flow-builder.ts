/**
 * Flow Builder - Main Flow Construction System
 * 
 * Builds execution flows for automated code processing,
 * orchestrating various AiCode components into workflows.
 */

export interface FlowStep {
  id: string;
  name: string;
  type: 'analyze' | 'generate' | 'test' | 'deploy' | 'custom';
  action: string;
  optional: boolean;
  dependencies: string[];
  config: any;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  steps: FlowStep[];
  metadata: {
    created: Date;
    version: string;
  };
}

/**
 * FlowBuilder class for constructing execution flows
 */
export class FlowBuilder {
  private initialized: boolean = false;
  private flows: Map<string, Flow> = new Map();

  async initialize(): Promise<void> {
    console.log('Initializing Flow Builder...');
    this.loadDefaultFlows();
    this.initialized = true;
  }

  /**
   * Load default flow templates
   */
  private loadDefaultFlows(): void {
    // Auto processing flow
    this.flows.set('auto', {
      id: 'auto',
      name: 'Automatic Processing',
      description: 'Complete automated code processing workflow',
      steps: [
        {
          id: 'sync',
          name: 'Sync Code',
          type: 'custom',
          action: 'sync',
          optional: false,
          dependencies: [],
          config: {}
        },
        {
          id: 'analyze',
          name: 'Analyze Code',
          type: 'analyze',
          action: 'analyze',
          optional: false,
          dependencies: ['sync'],
          config: { deep: true }
        },
        {
          id: 'repair',
          name: 'Auto Repair',
          type: 'custom',
          action: 'repair',
          optional: true,
          dependencies: ['analyze'],
          config: { autoFix: true }
        },
        {
          id: 'test',
          name: 'Run Tests',
          type: 'test',
          action: 'test',
          optional: false,
          dependencies: ['repair'],
          config: {}
        },
        {
          id: 'comment',
          name: 'Generate Comments',
          type: 'custom',
          action: 'comment',
          optional: true,
          dependencies: ['test'],
          config: {}
        }
      ],
      metadata: {
        created: new Date(),
        version: '1.0.0'
      }
    });

    // Development flow
    this.flows.set('dev', {
      id: 'dev',
      name: 'Development Flow',
      description: 'Flow for active development',
      steps: [
        {
          id: 'config',
          name: 'Auto Config',
          type: 'custom',
          action: 'config',
          optional: false,
          dependencies: [],
          config: {}
        },
        {
          id: 'generate',
          name: 'Generate Code',
          type: 'generate',
          action: 'generate',
          optional: false,
          dependencies: ['config'],
          config: {}
        },
        {
          id: 'test-gen',
          name: 'Generate Tests',
          type: 'test',
          action: 'generateTests',
          optional: false,
          dependencies: ['generate'],
          config: {}
        }
      ],
      metadata: {
        created: new Date(),
        version: '1.0.0'
      }
    });

    // Deployment flow
    this.flows.set('deploy', {
      id: 'deploy',
      name: 'Deployment Flow',
      description: 'Complete deployment workflow',
      steps: [
        {
          id: 'test',
          name: 'Run All Tests',
          type: 'test',
          action: 'test',
          optional: false,
          dependencies: [],
          config: { all: true }
        },
        {
          id: 'build',
          name: 'Build Project',
          type: 'custom',
          action: 'build',
          optional: false,
          dependencies: ['test'],
          config: {}
        },
        {
          id: 'deploy',
          name: 'Deploy to Vercel',
          type: 'deploy',
          action: 'deploy',
          optional: false,
          dependencies: ['build'],
          config: { platform: 'vercel' }
        }
      ],
      metadata: {
        created: new Date(),
        version: '1.0.0'
      }
    });
  }

  /**
   * Build automatic processing flow
   */
  async buildAutoFlow(target: string): Promise<Flow> {
    if (!this.initialized) {
      throw new Error('Flow Builder not initialized');
    }

    const flow = this.flows.get('auto');
    if (!flow) {
      throw new Error('Auto flow not found');
    }

    // Customize flow based on target
    return {
      ...flow,
      steps: flow.steps.map(step => ({
        ...step,
        config: {
          ...step.config,
          target
        }
      }))
    };
  }

  /**
   * Build custom flow
   */
  buildFlow(config: {
    name: string;
    description: string;
    steps: Partial<FlowStep>[];
  }): Flow {
    const steps: FlowStep[] = config.steps.map((step, index) => ({
      id: step.id || `step-${index}`,
      name: step.name || `Step ${index + 1}`,
      type: step.type || 'custom',
      action: step.action || 'process',
      optional: step.optional ?? false,
      dependencies: step.dependencies || [],
      config: step.config || {}
    }));

    return {
      id: `flow-${Date.now()}`,
      name: config.name,
      description: config.description,
      steps,
      metadata: {
        created: new Date(),
        version: '1.0.0'
      }
    };
  }

  /**
   * Get predefined flow
   */
  getFlow(name: string): Flow | undefined {
    return this.flows.get(name);
  }

  /**
   * Validate flow
   */
  validateFlow(flow: Flow): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for circular dependencies
    const visited = new Set<string>();
    const checkDependencies = (stepId: string, path: Set<string> = new Set()) => {
      if (path.has(stepId)) {
        errors.push(`Circular dependency detected: ${Array.from(path).join(' -> ')} -> ${stepId}`);
        return;
      }

      if (visited.has(stepId)) {
        return;
      }

      visited.add(stepId);
      path.add(stepId);

      const step = flow.steps.find(s => s.id === stepId);
      if (step) {
        step.dependencies.forEach(dep => checkDependencies(dep, new Set(path)));
      }
    };

    flow.steps.forEach(step => checkDependencies(step.id));

    // Check for missing dependencies
    flow.steps.forEach(step => {
      step.dependencies.forEach(dep => {
        if (!flow.steps.find(s => s.id === dep)) {
          errors.push(`Step '${step.id}' has missing dependency: ${dep}`);
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Optimize flow execution order
   */
  optimizeFlow(flow: Flow): Flow {
    // Topological sort for optimal execution order
    const sorted: FlowStep[] = [];
    const visited = new Set<string>();
    
    const visit = (stepId: string) => {
      if (visited.has(stepId)) {
        return;
      }

      visited.add(stepId);
      const step = flow.steps.find(s => s.id === stepId);
      
      if (step) {
        step.dependencies.forEach(visit);
        sorted.push(step);
      }
    };

    flow.steps.forEach(step => visit(step.id));

    return {
      ...flow,
      steps: sorted
    };
  }

  /**
   * Clone flow
   */
  cloneFlow(flow: Flow, newName: string): Flow {
    return {
      ...flow,
      id: `flow-${Date.now()}`,
      name: newName,
      metadata: {
        created: new Date(),
        version: flow.metadata.version
      }
    };
  }
}
