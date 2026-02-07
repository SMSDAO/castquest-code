/**
 * Auto Repair - Automatic Code Repair System
 * 
 * Automatically detects and repairs common code issues,
 * including syntax errors, linting violations, and logical problems.
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface RepairOptions {
  target: string;
  autoFix?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
}

export interface RepairResult {
  success: boolean;
  repaired: Array<{ file: string; issue: string; fix: string }>;
  failed: Array<{ file: string; issue: string; reason: string }>;
  skipped: string[];
}

/**
 * AutoRepair class for automatic code repair
 */
export class AutoRepair {
  private options: RepairOptions;

  constructor(options: RepairOptions) {
    this.options = options;
  }

  /**
   * Execute auto repair
   */
  async repair(): Promise<RepairResult> {
    console.log('Starting Auto Repair...');
    
    const result: RepairResult = {
      success: true,
      repaired: [],
      failed: [],
      skipped: []
    };

    try {
      // Run linter with auto-fix
      await this.repairLintIssues(result);

      // Fix formatting
      await this.repairFormatting(result);

      // Fix common code issues
      await this.repairCommonIssues(result);

      // Fix import statements
      await this.repairImports(result);

      // Fix type issues (TypeScript)
      await this.repairTypeIssues(result);

      console.log('Auto Repair completed');
    } catch (error) {
      result.success = false;
      result.failed.push({
        file: 'system',
        issue: 'Repair process failed',
        reason: error instanceof Error ? error.message : String(error)
      });
    }

    return result;
  }

  /**
   * Repair linting issues
   */
  private async repairLintIssues(result: RepairResult): Promise<void> {
    try {
      const { stdout, stderr } = await execAsync(
        `eslint ${this.options.target} --fix`,
        { cwd: process.cwd() }
      );

      if (!this.options.dryRun) {
        result.repaired.push({
          file: this.options.target,
          issue: 'ESLint violations',
          fix: 'Auto-fixed with ESLint'
        });
      } else {
        result.skipped.push('ESLint fixes (dry run mode)');
      }
    } catch (error) {
      // ESLint might exit with code 1 if there are issues
      if (this.options.verbose) {
        console.log('ESLint repair attempted');
      }
    }
  }

  /**
   * Repair formatting issues
   */
  private async repairFormatting(result: RepairResult): Promise<void> {
    try {
      if (!this.options.dryRun) {
        await execAsync(
          `prettier --write ${this.options.target}`,
          { cwd: process.cwd() }
        );

        result.repaired.push({
          file: this.options.target,
          issue: 'Code formatting',
          fix: 'Formatted with Prettier'
        });
      } else {
        result.skipped.push('Prettier formatting (dry run mode)');
      }
    } catch (error) {
      result.failed.push({
        file: this.options.target,
        issue: 'Formatting',
        reason: 'Prettier not available or configuration error'
      });
    }
  }

  /**
   * Repair common code issues
   */
  private async repairCommonIssues(result: RepairResult): Promise<void> {
    const files = await this.findSourceFiles(this.options.target);

    for (const file of files) {
      try {
        let content = fs.readFileSync(file, 'utf-8');
        let modified = false;
        const fixes: string[] = [];

        // Remove trailing whitespace
        if (content !== content.replace(/[ \t]+$/gm, '')) {
          content = content.replace(/[ \t]+$/gm, '');
          modified = true;
          fixes.push('Removed trailing whitespace');
        }

        // Ensure file ends with newline
        if (!content.endsWith('\n')) {
          content += '\n';
          modified = true;
          fixes.push('Added final newline');
        }

        // Fix multiple empty lines
        if (content.match(/\n{3,}/)) {
          content = content.replace(/\n{3,}/g, '\n\n');
          modified = true;
          fixes.push('Reduced multiple empty lines');
        }

        // Remove console.log statements (optional)
        const consoleLogPattern = /console\.log\([^)]*\);?\n?/g;
        if (consoleLogPattern.test(content) && this.options.autoFix) {
          content = content.replace(consoleLogPattern, '');
          modified = true;
          fixes.push('Removed console.log statements');
        }

        if (modified && !this.options.dryRun) {
          fs.writeFileSync(file, content);
          result.repaired.push({
            file: path.relative(process.cwd(), file),
            issue: 'Common issues',
            fix: fixes.join(', ')
          });
        } else if (modified) {
          result.skipped.push(`${path.relative(process.cwd(), file)} (dry run mode)`);
        }
      } catch (error) {
        result.failed.push({
          file: path.relative(process.cwd(), file),
          issue: 'Common issues',
          reason: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }

  /**
   * Repair import statements
   */
  private async repairImports(result: RepairResult): Promise<void> {
    const files = await this.findSourceFiles(this.options.target);

    for (const file of files) {
      try {
        let content = fs.readFileSync(file, 'utf-8');
        let modified = false;

        // Sort imports
        const importLines: string[] = [];
        const otherLines: string[] = [];
        let inImportSection = true;

        content.split('\n').forEach(line => {
          if (line.match(/^import\s+/)) {
            importLines.push(line);
          } else if (line.trim() === '' && inImportSection) {
            // Empty line in import section
          } else {
            if (inImportSection && line.trim() !== '') {
              inImportSection = false;
            }
            otherLines.push(line);
          }
        });

        if (importLines.length > 1) {
          importLines.sort();
          const newContent = [...importLines, '', ...otherLines].join('\n');
          
          if (newContent !== content) {
            modified = true;
            content = newContent;
          }
        }

        if (modified && !this.options.dryRun) {
          fs.writeFileSync(file, content);
          result.repaired.push({
            file: path.relative(process.cwd(), file),
            issue: 'Import organization',
            fix: 'Sorted and organized imports'
          });
        }
      } catch (error) {
        // Skip files with errors
      }
    }
  }

  /**
   * Repair TypeScript type issues
   */
  private async repairTypeIssues(result: RepairResult): Promise<void> {
    try {
      // Check if TypeScript is available
      await execAsync('tsc --version');

      // Run TypeScript compiler
      const { stdout, stderr } = await execAsync(
        `tsc --noEmit --pretty false ${this.options.target}`,
        { cwd: process.cwd() }
      );

      // TypeScript errors can be parsed and potentially auto-fixed
      // This is a simplified implementation
      result.skipped.push('TypeScript type issues (manual review recommended)');
    } catch (error) {
      // TypeScript not available or has errors
    }
  }

  /**
   * Find source files
   */
  private async findSourceFiles(target: string): Promise<string[]> {
    const files: string[] = [];
    const extensions = ['.ts', '.js', '.tsx', '.jsx'];

    const walk = async (dir: string) => {
      try {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory() && !['node_modules', 'dist', 'build'].includes(entry.name)) {
            await walk(fullPath);
          } else if (extensions.some(ext => entry.name.endsWith(ext))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories with errors
      }
    };

    const stats = await fs.promises.stat(target);
    if (stats.isDirectory()) {
      await walk(target);
    } else {
      files.push(target);
    }

    return files;
  }
}

/**
 * CLI Entry Point
 */
if (require.main === module) {
  const options: RepairOptions = {
    target: process.argv[2] || '.',
    autoFix: process.argv.includes('--auto-fix'),
    dryRun: process.argv.includes('--dry-run'),
    verbose: process.argv.includes('--verbose')
  };

  const autoRepair = new AutoRepair(options);
  
  autoRepair.repair()
    .then(result => {
      console.log('\nRepair Result:');
      console.log(`Success: ${result.success}`);
      console.log(`Repaired: ${result.repaired.length} issues`);
      console.log(`Failed: ${result.failed.length} issues`);
      console.log(`Skipped: ${result.skipped.length} items`);
      
      if (result.repaired.length > 0 && options.verbose) {
        console.log('\nRepaired Issues:');
        result.repaired.forEach(r => {
          console.log(`  ${r.file}: ${r.issue} - ${r.fix}`);
        });
      }
      
      if (result.failed.length > 0) {
        console.log('\nFailed Repairs:');
        result.failed.forEach(f => {
          console.log(`  ${f.file}: ${f.issue} - ${f.reason}`);
        });
      }
      
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Repair error:', error);
      process.exit(1);
    });
}
