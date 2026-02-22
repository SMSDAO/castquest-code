/**
 * Auto Deploy - Automatic Deployment System
 * 
 * Automates the deployment process including build, test,
 * and deployment to various platforms (Vercel, AWS, etc.)
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface DeployOptions {
  platform: 'vercel' | 'netlify' | 'aws' | 'heroku' | 'custom';
  environment?: 'production' | 'staging' | 'development';
  buildCommand?: string;
  installCommand?: string;
  skipTests?: boolean;
  autoMigrate?: boolean;
}

export interface DeployResult {
  success: boolean;
  url?: string;
  deploymentId?: string;
  logs: string[];
  errors: string[];
  duration: number;
}

/**
 * AutoDeploy class for automatic deployment
 */
export class AutoDeploy {
  private options: DeployOptions;

  constructor(options: DeployOptions) {
    this.options = {
      environment: 'production',
      skipTests: false,
      autoMigrate: false,
      ...options
    };
  }

  /**
   * Execute deployment
   */
  async deploy(): Promise<DeployResult> {
    console.log(`Starting deployment to ${this.options.platform}...`);
    
    const startTime = Date.now();
    const result: DeployResult = {
      success: false,
      logs: [],
      errors: [],
      duration: 0
    };

    try {
      // Pre-deployment checks
      await this.preDeploymentChecks(result);

      // Install dependencies
      await this.installDependencies(result);

      // Run tests (unless skipped)
      if (!this.options.skipTests) {
        await this.runTests(result);
      }

      // Build project
      await this.buildProject(result);

      // Run migrations (if enabled)
      if (this.options.autoMigrate) {
        await this.runMigrations(result);
      }

      // Deploy to platform
      await this.deployToPlatform(result);

      result.success = true;
      result.duration = Date.now() - startTime;
      
      console.log('Deployment completed successfully');
    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : String(error));
      result.duration = Date.now() - startTime;
      console.error('Deployment failed:', error);
    }

    return result;
  }

  /**
   * Pre-deployment checks
   */
  private async preDeploymentChecks(result: DeployResult): Promise<void> {
    result.logs.push('Running pre-deployment checks...');

    // Check git status
    try {
      const { stdout } = await execAsync('git status --porcelain');
      if (stdout.trim()) {
        result.logs.push('Warning: Uncommitted changes detected');
      }
    } catch (error) {
      // Git might not be available
    }

    // Check for required files
    const requiredFiles = ['package.json'];
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Required file not found: ${file}`);
      }
    }

    result.logs.push('Pre-deployment checks passed');
  }

  /**
   * Install dependencies
   */
  private async installDependencies(result: DeployResult): Promise<void> {
    result.logs.push('Installing dependencies...');

    const installCmd = this.options.installCommand || 'npm ci';

    try {
      const { stdout } = await execAsync(installCmd);
      result.logs.push('Dependencies installed successfully');
    } catch (error) {
      throw new Error(`Dependency installation failed: ${error}`);
    }
  }

  /**
   * Run tests
   */
  private async runTests(result: DeployResult): Promise<void> {
    result.logs.push('Running tests...');

    try {
      const { stdout } = await execAsync('npm test');
      result.logs.push('All tests passed');
    } catch (error: any) {
      // Check if there are actually tests
      if (error.stdout && error.stdout.includes('No tests found')) {
        result.logs.push('No tests found, skipping...');
      } else {
        throw new Error(`Tests failed: ${error.message}`);
      }
    }
  }

  /**
   * Build project
   */
  private async buildProject(result: DeployResult): Promise<void> {
    result.logs.push('Building project...');

    const buildCmd = this.options.buildCommand || 'npm run build';

    try {
      const { stdout } = await execAsync(buildCmd, {
        maxBuffer: 10 * 1024 * 1024
      });
      result.logs.push('Build completed successfully');
    } catch (error) {
      throw new Error(`Build failed: ${error}`);
    }
  }

  /**
   * Run database migrations
   */
  private async runMigrations(result: DeployResult): Promise<void> {
    result.logs.push('Running database migrations...');

    try {
      const { stdout } = await execAsync('npm run migrate');
      result.logs.push('Migrations completed successfully');
    } catch (error) {
      result.logs.push('No migrations to run or migration command not found');
    }
  }

  /**
   * Deploy to platform
   */
  private async deployToPlatform(result: DeployResult): Promise<void> {
    result.logs.push(`Deploying to ${this.options.platform}...`);

    switch (this.options.platform) {
      case 'vercel':
        await this.deployToVercel(result);
        break;
      case 'netlify':
        await this.deployToNetlify(result);
        break;
      case 'aws':
        await this.deployToAWS(result);
        break;
      case 'heroku':
        await this.deployToHeroku(result);
        break;
      default:
        throw new Error(`Unsupported platform: ${this.options.platform}`);
    }
  }

  /**
   * Deploy to Vercel
   */
  private async deployToVercel(result: DeployResult): Promise<void> {
    // Check if Vercel CLI is installed
    try {
      await execAsync('vercel --version');
    } catch (error) {
      throw new Error('Vercel CLI not installed. Run: npm i -g vercel');
    }

    // Generate vercel.json if not exists
    await this.generateVercelConfig();

    // Deploy
    const prodFlag = this.options.environment === 'production' ? '--prod' : '';
    const command = `vercel ${prodFlag} --yes`;

    try {
      const { stdout } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024
      });

      // Extract deployment URL
      const urlMatch = stdout.match(/https:\/\/[^\s]+/);
      if (urlMatch) {
        result.url = urlMatch[0];
        result.logs.push(`Deployed to: ${result.url}`);
      }

      // Extract deployment ID
      const idMatch = stdout.match(/Deployment ID: ([^\s]+)/);
      if (idMatch) {
        result.deploymentId = idMatch[1];
      }

      result.logs.push('Vercel deployment completed');
    } catch (error: any) {
      throw new Error(`Vercel deployment failed: ${error.message}`);
    }
  }

  /**
   * Generate Vercel configuration
   */
  private async generateVercelConfig(): Promise<void> {
    const configPath = 'vercel.json';
    
    if (fs.existsSync(configPath)) {
      return;
    }

    const config = {
      version: 2,
      builds: [
        {
          src: 'package.json',
          use: '@vercel/node'
        }
      ],
      routes: [
        {
          src: '/(.*)',
          dest: '/'
        }
      ]
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }

  /**
   * Deploy to Netlify
   */
  private async deployToNetlify(result: DeployResult): Promise<void> {
    try {
      await execAsync('netlify --version');
    } catch (error) {
      throw new Error('Netlify CLI not installed. Run: npm i -g netlify-cli');
    }

    const prodFlag = this.options.environment === 'production' ? '--prod' : '';
    const command = `netlify deploy ${prodFlag} --dir=dist`;

    try {
      const { stdout } = await execAsync(command);
      
      const urlMatch = stdout.match(/Website URL:\s+(https:\/\/[^\s]+)/);
      if (urlMatch) {
        result.url = urlMatch[1];
        result.logs.push(`Deployed to: ${result.url}`);
      }

      result.logs.push('Netlify deployment completed');
    } catch (error: any) {
      throw new Error(`Netlify deployment failed: ${error.message}`);
    }
  }

  /**
   * Deploy to AWS
   */
  private async deployToAWS(result: DeployResult): Promise<void> {
    result.logs.push('AWS deployment requires custom configuration');
    throw new Error('AWS deployment not yet implemented. Use AWS CDK or custom scripts.');
  }

  /**
   * Deploy to Heroku
   */
  private async deployToHeroku(result: DeployResult): Promise<void> {
    try {
      await execAsync('heroku --version');
    } catch (error) {
      throw new Error('Heroku CLI not installed. Visit: https://devcenter.heroku.com/articles/heroku-cli');
    }

    try {
      // Push to Heroku
      await execAsync('git push heroku main');
      
      // Get app info
      const { stdout } = await execAsync('heroku info');
      const urlMatch = stdout.match(/Web URL:\s+(https:\/\/[^\s]+)/);
      if (urlMatch) {
        result.url = urlMatch[1];
        result.logs.push(`Deployed to: ${result.url}`);
      }

      result.logs.push('Heroku deployment completed');
    } catch (error: any) {
      throw new Error(`Heroku deployment failed: ${error.message}`);
    }
  }
}

/**
 * CLI Entry Point
 */
if (require.main === module) {
  const platform = (process.argv[2] || 'vercel') as DeployOptions['platform'];
  const environment = (process.argv[3] || 'production') as DeployOptions['environment'];

  const options: DeployOptions = {
    platform,
    environment,
    skipTests: process.argv.includes('--skip-tests'),
    autoMigrate: process.argv.includes('--auto-migrate')
  };

  const autoDeploy = new AutoDeploy(options);
  
  autoDeploy.deploy()
    .then(result => {
      console.log('\nDeployment Result:');
      console.log(`Success: ${result.success}`);
      console.log(`Duration: ${result.duration}ms`);
      
      if (result.url) {
        console.log(`URL: ${result.url}`);
      }
      
      if (result.deploymentId) {
        console.log(`Deployment ID: ${result.deploymentId}`);
      }
      
      if (result.logs.length > 0) {
        console.log('\nLogs:');
        result.logs.forEach(log => console.log(`  ${log}`));
      }
      
      if (result.errors.length > 0) {
        console.log('\nErrors:');
        result.errors.forEach(error => console.log(`  ${error}`));
      }
      
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Deployment error:', error);
      process.exit(1);
    });
}
