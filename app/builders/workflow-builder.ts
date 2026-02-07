/**
 * Workflow Builder - Workflow Orchestration System
 * 
 * Orchestrates complex workflows combining multiple steps,
 * parallel execution, and conditional logic.
 */

export interface WorkflowStep {
  id: string;
  name: string;
  action: () => Promise<any>;
  parallel?: boolean;
  condition?: () => boolean;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  retries?: number;
  timeout?: number;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  parallel: boolean;
}

export interface WorkflowResult {
  success: boolean;
  results: Map<string, any>;
  errors: Map<string, Error>;
  duration: number;
}

/**
 * WorkflowBuilder class for orchestrating workflows
 */
export class WorkflowBuilder {
  private workflows: Map<string, Workflow> = new Map();

  /**
   * Create a new workflow
   */
  createWorkflow(name: string): WorkflowBuilder {
    this.workflows.set(name, {
      id: `workflow-${Date.now()}`,
      name,
      steps: [],
      parallel: false
    });
    return this;
  }

  /**
   * Add step to workflow
   */
  addStep(workflowName: string, step: WorkflowStep): WorkflowBuilder {
    const workflow = this.workflows.get(workflowName);
    if (workflow) {
      workflow.steps.push(step);
    }
    return this;
  }

  /**
   * Set parallel execution
   */
  setParallel(workflowName: string, parallel: boolean): WorkflowBuilder {
    const workflow = this.workflows.get(workflowName);
    if (workflow) {
      workflow.parallel = parallel;
    }
    return this;
  }

  /**
   * Execute workflow
   */
  async execute(workflowName: string): Promise<WorkflowResult> {
    const workflow = this.workflows.get(workflowName);
    if (!workflow) {
      throw new Error(`Workflow '${workflowName}' not found`);
    }

    const startTime = Date.now();
    const results = new Map<string, any>();
    const errors = new Map<string, Error>();

    try {
      if (workflow.parallel) {
        await this.executeParallel(workflow, results, errors);
      } else {
        await this.executeSequential(workflow, results, errors);
      }
    } catch (error) {
      console.error('Workflow execution failed:', error);
    }

    return {
      success: errors.size === 0,
      results,
      errors,
      duration: Date.now() - startTime
    };
  }

  /**
   * Execute steps in parallel
   */
  private async executeParallel(
    workflow: Workflow,
    results: Map<string, any>,
    errors: Map<string, Error>
  ): Promise<void> {
    const promises = workflow.steps.map(async step => {
      try {
        if (step.condition && !step.condition()) {
          return;
        }

        const result = await this.executeStep(step);
        results.set(step.id, result);
        
        if (step.onSuccess) {
          step.onSuccess(result);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        errors.set(step.id, err);
        
        if (step.onError) {
          step.onError(err);
        }
      }
    });

    await Promise.all(promises);
  }

  /**
   * Execute steps sequentially
   */
  private async executeSequential(
    workflow: Workflow,
    results: Map<string, any>,
    errors: Map<string, Error>
  ): Promise<void> {
    for (const step of workflow.steps) {
      try {
        if (step.condition && !step.condition()) {
          continue;
        }

        const result = await this.executeStep(step);
        results.set(step.id, result);
        
        if (step.onSuccess) {
          step.onSuccess(result);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        errors.set(step.id, err);
        
        if (step.onError) {
          step.onError(err);
        }
        
        // Stop on error in sequential execution
        break;
      }
    }
  }

  /**
   * Execute single step with retries and timeout
   */
  private async executeStep(step: WorkflowStep): Promise<any> {
    const retries = step.retries || 0;
    const timeout = step.timeout || 30000;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.executeWithTimeout(step.action, timeout);
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        console.log(`Retrying step ${step.name} (attempt ${attempt + 1}/${retries})`);
      }
    }
  }

  /**
   * Execute action with timeout
   */
  private async executeWithTimeout<T>(
    action: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      action(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
  }

  /**
   * Get workflow
   */
  getWorkflow(name: string): Workflow | undefined {
    return this.workflows.get(name);
  }

  /**
   * List all workflows
   */
  listWorkflows(): string[] {
    return Array.from(this.workflows.keys());
  }
}
