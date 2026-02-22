/**
 * Auto Sync - Automatic Synchronization Utility
 * 
 * Automatically synchronizes code, dependencies, and configurations
 * across the development environment.
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SyncConfig {
  target: string;
  source?: string;
  patterns?: string[];
  exclude?: string[];
  bidirectional?: boolean;
  autoCommit?: boolean;
}

export interface SyncResult {
  success: boolean;
  synced: string[];
  skipped: string[];
  errors: string[];
  timestamp: Date;
}

/**
 * AutoSync class for automatic synchronization
 */
export class AutoSync {
  private config: SyncConfig;

  constructor(config: SyncConfig) {
    this.config = config;
  }

  /**
   * Execute synchronization
   */
  async sync(): Promise<SyncResult> {
    console.log('Starting Auto Sync...');
    
    const result: SyncResult = {
      success: true,
      synced: [],
      skipped: [],
      errors: [],
      timestamp: new Date()
    };

    try {
      // Sync git repository
      await this.syncGit(result);

      // Sync dependencies
      await this.syncDependencies(result);

      // Sync configuration files
      await this.syncConfig(result);

      // Sync code files
      await this.syncFiles(result);

      console.log('Auto Sync completed successfully');
    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : String(error));
    }

    return result;
  }

  /**
   * Sync git repository
   */
  private async syncGit(result: SyncResult): Promise<void> {
    try {
      // Fetch latest changes
      await execAsync('git fetch origin');
      result.synced.push('Git: Fetched latest changes');

      // Check for uncommitted changes
      const { stdout: status } = await execAsync('git status --porcelain');
      if (status.trim()) {
        if (this.config.autoCommit) {
          await execAsync('git add .');
          await execAsync('git commit -m "Auto sync: Save local changes"');
          result.synced.push('Git: Auto-committed changes');
        } else {
          result.skipped.push('Git: Uncommitted changes (auto-commit disabled)');
        }
      }

      // Pull latest changes
      await execAsync('git pull --rebase');
      result.synced.push('Git: Pulled latest changes');

    } catch (error) {
      result.errors.push(`Git sync failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Sync dependencies
   */
  private async syncDependencies(result: SyncResult): Promise<void> {
    try {
      const packageJsonPath = path.join(this.config.target, 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        // Check if package.json changed
        const { stdout: diff } = await execAsync('git diff package.json package-lock.json');
        
        if (diff.trim()) {
          console.log('Dependencies changed, running npm install...');
          await execAsync('npm install', { cwd: this.config.target });
          result.synced.push('Dependencies: Installed updated packages');
        } else {
          result.skipped.push('Dependencies: No changes detected');
        }
      }
    } catch (error) {
      result.errors.push(`Dependencies sync failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Sync configuration files
   */
  private async syncConfig(result: SyncResult): Promise<void> {
    const configFiles = [
      '.env.example',
      'tsconfig.json',
      '.eslintrc.js',
      '.prettierrc'
    ];

    for (const file of configFiles) {
      try {
        const filePath = path.join(this.config.target, file);
        
        if (fs.existsSync(filePath)) {
          // Check if config file changed
          const { stdout: diff } = await execAsync(`git diff ${file}`);
          
          if (diff.trim()) {
            result.synced.push(`Config: ${file} synchronized`);
          }
        }
      } catch (error) {
        // Config file might not exist, skip
      }
    }
  }

  /**
   * Sync code files
   */
  private async syncFiles(result: SyncResult): Promise<void> {
    const patterns = this.config.patterns || ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'];
    const exclude = this.config.exclude || ['node_modules/**', 'dist/**', 'build/**'];

    try {
      // Find files matching patterns
      const files = await this.findFiles(this.config.target, patterns, exclude);
      
      for (const file of files) {
        try {
          const relativePath = path.relative(this.config.target, file);
          
          // Check if file changed
          const { stdout: diff } = await execAsync(`git diff ${relativePath}`);
          
          if (diff.trim()) {
            result.synced.push(`File: ${relativePath}`);
          }
        } catch (error) {
          // Skip files with errors
        }
      }
    } catch (error) {
      result.errors.push(`File sync failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Find files matching patterns
   */
  private async findFiles(
    dir: string,
    patterns: string[],
    exclude: string[]
  ): Promise<string[]> {
    const files: string[] = [];
    
    const walk = async (currentDir: string) => {
      const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const relativePath = path.relative(dir, fullPath);
        
        // Check exclusions
        if (exclude.some(pattern => this.matchPattern(relativePath, pattern))) {
          continue;
        }
        
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (patterns.some(pattern => this.matchPattern(relativePath, pattern))) {
          files.push(fullPath);
        }
      }
    };
    
    await walk(dir);
    return files;
  }

  /**
   * Simple pattern matching
   */
  private matchPattern(path: string, pattern: string): boolean {
    const regex = new RegExp(
      pattern
        .replace(/\./g, '\\.')
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
    );
    return regex.test(path);
  }

  /**
   * Watch for changes and auto-sync
   */
  async watch(interval: number = 60000): Promise<void> {
    console.log(`Auto Sync watching for changes (interval: ${interval}ms)`);
    
    setInterval(async () => {
      try {
        const result = await this.sync();
        if (result.synced.length > 0) {
          console.log('Auto sync detected changes:', result.synced);
        }
      } catch (error) {
        console.error('Auto sync watch error:', error);
      }
    }, interval);
  }
}

/**
 * CLI Entry Point
 */
if (require.main === module) {
  const config: SyncConfig = {
    target: process.argv[2] || process.cwd(),
    autoCommit: process.argv.includes('--auto-commit'),
    bidirectional: process.argv.includes('--bidirectional')
  };

  const autoSync = new AutoSync(config);
  
  if (process.argv.includes('--watch')) {
    autoSync.watch().catch(console.error);
  } else {
    autoSync.sync()
      .then(result => {
        console.log('\nSync Result:');
        console.log(`Success: ${result.success}`);
        console.log(`Synced: ${result.synced.length} items`);
        console.log(`Skipped: ${result.skipped.length} items`);
        console.log(`Errors: ${result.errors.length} items`);
        
        if (result.errors.length > 0) {
          console.error('\nErrors:', result.errors);
        }
        
        process.exit(result.success ? 0 : 1);
      })
      .catch(error => {
        console.error('Sync error:', error);
        process.exit(1);
      });
  }
}
