/**
 * AiCode Orchestrator - Complete Automated System
 * 
 * Orchestrates all AiCode components into a unified, automated system
 * that can run continuously or on-demand.
 */

import { AiCodeEngine } from './core/aicode-engine';
import { FlowBuilder } from './builders/flow-builder';
import { AutoSync } from './utils/auto-sync';
import { AutoConfig } from './utils/auto-config';
import { AutoRepair } from './utils/auto-repair';
import { AutoFix } from './utils/auto-fix';
import { AutoTest } from './utils/auto-test';
import { AutoDeploy } from './utils/auto-deploy';
import { AutoComments } from './utils/auto-comments';
import * as fs from 'fs';
import * as path from 'path';

export interface OrchestratorConfig {
  target: string;
  mode: 'full' | 'development' | 'ci' | 'deployment';
  watch?: boolean;
  interval?: number;
  deployPlatform?: 'vercel' | 'netlify' | 'aws' | 'heroku';
}

export interface OrchestratorResult {
  success: boolean;
  phases: Map<string, any>;
  duration: number;
  timestamp: Date;
}

/**
 * Main orchestrator class that coordinates all AiCode components
 */
export class AiCodeOrchestrator {
  private config: OrchestratorConfig;
  private running: boolean = false;

  constructor(config: OrchestratorConfig) {
    this.config = {
      interval: 300000, // 5 minutes default
      ...config
    };
  }

  /**
   * Execute the complete automated system
   */
  async orchestrate(): Promise<OrchestratorResult> {
    console.log('🚀 Starting AiCode Orchestration...');
    console.log(`Mode: ${this.config.mode}`);
    console.log(`Target: ${this.config.target}`);
    
    const startTime = Date.now();
    const result: OrchestratorResult = {
      success: true,
      phases: new Map(),
      duration: 0,
      timestamp: new Date()
    };

    try {
      switch (this.config.mode) {
        case 'full':
          await this.runFullAutomation(result);
          break;
        case 'development':
          await this.runDevelopmentMode(result);
          break;
        case 'ci':
          await this.runCIMode(result);
          break;
        case 'deployment':
          await this.runDeploymentMode(result);
          break;
      }

      result.duration = Date.now() - startTime;
      result.success = true;

      console.log(`✅ Orchestration completed in ${result.duration}ms`);
    } catch (error) {
      result.success = false;
      result.duration = Date.now() - startTime;
      console.error('❌ Orchestration failed:', error);
    }

    return result;
  }

  /**
   * Run full automation (all features)
   */
  private async runFullAutomation(result: OrchestratorResult): Promise<void> {
    console.log('\n📋 Running Full Automation...');

    // Phase 1: Sync
    console.log('\n1️⃣ Phase 1: Auto Sync');
    const syncResult = await this.runAutoSync();
    result.phases.set('sync', syncResult);

    // Phase 2: Config
    console.log('\n2️⃣ Phase 2: Auto Config');
    const configResult = await this.runAutoConfig();
    result.phases.set('config', configResult);

    // Phase 3: Analysis
    console.log('\n3️⃣ Phase 3: Code Analysis');
    const analysisResult = await this.runAnalysis();
    result.phases.set('analysis', analysisResult);

    // Phase 4: Repair
    console.log('\n4️⃣ Phase 4: Auto Repair');
    const repairResult = await this.runAutoRepair();
    result.phases.set('repair', repairResult);

    // Phase 5: Fix
    console.log('\n5️⃣ Phase 5: Auto Fix');
    const fixResult = await this.runAutoFix();
    result.phases.set('fix', fixResult);

    // Phase 6: Test
    console.log('\n6️⃣ Phase 6: Auto Test');
    const testResult = await this.runAutoTest();
    result.phases.set('test', testResult);

    // Phase 7: Comments
    console.log('\n7️⃣ Phase 7: Auto Comments');
    const commentsResult = await this.runAutoComments();
    result.phases.set('comments', commentsResult);

    // Phase 8: Deploy (optional)
    if (this.config.deployPlatform) {
      console.log('\n8️⃣ Phase 8: Auto Deploy');
      const deployResult = await this.runAutoDeploy();
      result.phases.set('deploy', deployResult);
    }
  }

  /**
   * Run development mode (analysis, repair, test, comments)
   */
  private async runDevelopmentMode(result: OrchestratorResult): Promise<void> {
    console.log('\n📋 Running Development Mode...');

    await this.runAutoSync();
    await this.runAnalysis();
    await this.runAutoRepair();
    await this.runAutoTest();
    await this.runAutoComments();
  }

  /**
   * Run CI mode (analysis, repair, test)
   */
  private async runCIMode(result: OrchestratorResult): Promise<void> {
    console.log('\n📋 Running CI Mode...');

    const analysisResult = await this.runAnalysis();
    result.phases.set('analysis', analysisResult);

    const repairResult = await this.runAutoRepair();
    result.phases.set('repair', repairResult);

    const testResult = await this.runAutoTest();
    result.phases.set('test', testResult);

    // Fail if tests fail
    if (!testResult.success) {
      throw new Error('Tests failed in CI mode');
    }
  }

  /**
   * Run deployment mode (test, build, deploy)
   */
  private async runDeploymentMode(result: OrchestratorResult): Promise<void> {
    console.log('\n📋 Running Deployment Mode...');

    const testResult = await this.runAutoTest();
    result.phases.set('test', testResult);

    if (!testResult.success) {
      throw new Error('Tests must pass before deployment');
    }

    const deployResult = await this.runAutoDeploy();
    result.phases.set('deploy', deployResult);
  }

  /**
   * Run Auto Sync
   */
  private async runAutoSync(): Promise<any> {
    const autoSync = new AutoSync({
      target: this.config.target,
      autoCommit: false
    });
    return await autoSync.sync();
  }

  /**
   * Run Auto Config
   */
  private async runAutoConfig(): Promise<any> {
    const autoConfig = new AutoConfig({
      target: this.config.target,
      framework: 'auto',
      typescript: true,
      linting: true,
      prettier: true
    });
    await autoConfig.configure();
    return { success: true };
  }

  /**
   * Run Code Analysis
   */
  private async runAnalysis(): Promise<any> {
    const engine = new AiCodeEngine({
      mode: 'analyze',
      target: this.config.target
    });
    await engine.initialize();
    return await engine.process();
  }

  /**
   * Run Auto Repair
   */
  private async runAutoRepair(): Promise<any> {
    const autoRepair = new AutoRepair({
      target: this.config.target,
      autoFix: true
    });
    return await autoRepair.repair();
  }

  /**
   * Run Auto Fix
   */
  private async runAutoFix(): Promise<any> {
    const autoFix = new AutoFix({
      target: this.config.target,
      backup: true
    });
    return await autoFix.fix();
  }

  /**
   * Run Auto Test
   */
  private async runAutoTest(): Promise<any> {
    const autoTest = new AutoTest({
      target: this.config.target,
      coverage: true,
      generate: true
    });
    return await autoTest.test();
  }

  /**
   * Run Auto Comments
   */
  private async runAutoComments(): Promise<any> {
    const autoComments = new AutoComments({
      target: this.config.target,
      style: 'all',
      suggestions: true
    });
    return await autoComments.generate();
  }

  /**
   * Run Auto Deploy
   */
  private async runAutoDeploy(): Promise<any> {
    const autoDeploy = new AutoDeploy({
      platform: this.config.deployPlatform || 'vercel',
      environment: 'production',
      skipTests: false
    });
    return await autoDeploy.deploy();
  }

  /**
   * Start watch mode
   */
  async watch(): Promise<void> {
    if (this.running) {
      console.log('Orchestrator already running');
      return;
    }

    this.running = true;
    console.log(`👀 Starting watch mode (interval: ${this.config.interval}ms)`);

    while (this.running) {
      try {
        await this.orchestrate();
      } catch (error) {
        console.error('Watch cycle error:', error);
      }

      // Wait for next cycle
      await new Promise(resolve => setTimeout(resolve, this.config.interval));
    }
  }

  /**
   * Stop watch mode
   */
  stop(): void {
    this.running = false;
    console.log('⏹️ Stopping orchestrator...');
  }

  /**
   * Generate report
   */
  generateReport(result: OrchestratorResult): string {
    let report = '\n═══════════════════════════════════════\n';
    report += '      AiCode Orchestration Report\n';
    report += '═══════════════════════════════════════\n\n';
    report += `Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}\n`;
    report += `Duration: ${result.duration}ms\n`;
    report += `Timestamp: ${result.timestamp.toISOString()}\n\n`;
    report += 'Phases:\n';

    result.phases.forEach((phaseResult, phaseName) => {
      report += `\n  ${phaseName}:\n`;
      report += `    Success: ${phaseResult.success || 'N/A'}\n`;
      if (phaseResult.duration) {
        report += `    Duration: ${phaseResult.duration}ms\n`;
      }
    });

    report += '\n═══════════════════════════════════════\n';

    return report;
  }
}

/**
 * CLI Entry Point
 */
if (require.main === module) {
  const mode = (process.argv[2] || 'full') as OrchestratorConfig['mode'];
  const target = process.argv[3] || '.';
  const watch = process.argv.includes('--watch');
  const deploy = process.argv.includes('--deploy');

  const config: OrchestratorConfig = {
    mode,
    target,
    watch,
    deployPlatform: deploy ? 'vercel' : undefined
  };

  const orchestrator = new AiCodeOrchestrator(config);

  if (watch) {
    orchestrator.watch().catch(console.error);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      orchestrator.stop();
      process.exit(0);
    });
  } else {
    orchestrator
      .orchestrate()
      .then(result => {
        const report = orchestrator.generateReport(result);
        console.log(report);
        process.exit(result.success ? 0 : 1);
      })
      .catch(error => {
        console.error('Orchestration error:', error);
        process.exit(1);
      });
  }
}
