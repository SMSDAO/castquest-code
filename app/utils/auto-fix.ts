/**
 * Auto Fix - Automatic Bug Fixing System
 * 
 * Intelligently detects and fixes bugs, security issues,
 * and logical errors in code.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface FixOptions {
  target: string;
  categories?: ('security' | 'performance' | 'logic' | 'style')[];
  aggressive?: boolean;
  backup?: boolean;
}

export interface Fix {
  file: string;
  line: number;
  category: string;
  issue: string;
  fix: string;
  applied: boolean;
}

export interface FixResult {
  success: boolean;
  fixes: Fix[];
  totalIssues: number;
  fixedIssues: number;
}

/**
 * AutoFix class for automatic bug fixing
 */
export class AutoFix {
  private options: FixOptions;

  constructor(options: FixOptions) {
    this.options = {
      ...options,
      categories: options.categories || ['security', 'performance', 'logic', 'style'],
      backup: options.backup ?? true
    };
  }

  /**
   * Execute auto fix
   */
  async fix(): Promise<FixResult> {
    console.log('Starting Auto Fix...');
    
    const result: FixResult = {
      success: true,
      fixes: [],
      totalIssues: 0,
      fixedIssues: 0
    };

    try {
      const files = await this.findSourceFiles(this.options.target);

      for (const file of files) {
        // Backup file if enabled
        if (this.options.backup) {
          await this.backupFile(file);
        }

        // Apply fixes by category
        for (const category of this.options.categories!) {
          await this.applyFixesForCategory(file, category, result);
        }
      }

      result.totalIssues = result.fixes.length;
      result.fixedIssues = result.fixes.filter(f => f.applied).length;
      result.success = result.fixedIssues > 0;

      console.log('Auto Fix completed');
    } catch (error) {
      result.success = false;
      console.error('Auto Fix error:', error);
    }

    return result;
  }

  /**
   * Apply fixes for specific category
   */
  private async applyFixesForCategory(
    file: string,
    category: string,
    result: FixResult
  ): Promise<void> {
    let content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      switch (category) {
        case 'security':
          const securityFix = this.fixSecurityIssue(line, lineNumber);
          if (securityFix) {
            lines[i] = securityFix.fixedLine;
            modified = true;
            result.fixes.push({
              file: path.relative(process.cwd(), file),
              line: lineNumber,
              category: 'security',
              issue: securityFix.issue,
              fix: securityFix.description,
              applied: true
            });
          }
          break;

        case 'performance':
          const perfFix = this.fixPerformanceIssue(line, lineNumber);
          if (perfFix) {
            lines[i] = perfFix.fixedLine;
            modified = true;
            result.fixes.push({
              file: path.relative(process.cwd(), file),
              line: lineNumber,
              category: 'performance',
              issue: perfFix.issue,
              fix: perfFix.description,
              applied: true
            });
          }
          break;

        case 'logic':
          const logicFix = this.fixLogicIssue(line, lineNumber, lines, i);
          if (logicFix) {
            lines[i] = logicFix.fixedLine;
            modified = true;
            result.fixes.push({
              file: path.relative(process.cwd(), file),
              line: lineNumber,
              category: 'logic',
              issue: logicFix.issue,
              fix: logicFix.description,
              applied: true
            });
          }
          break;

        case 'style':
          const styleFix = this.fixStyleIssue(line, lineNumber);
          if (styleFix) {
            lines[i] = styleFix.fixedLine;
            modified = true;
            result.fixes.push({
              file: path.relative(process.cwd(), file),
              line: lineNumber,
              category: 'style',
              issue: styleFix.issue,
              fix: styleFix.description,
              applied: true
            });
          }
          break;
      }
    }

    if (modified) {
      fs.writeFileSync(file, lines.join('\n'));
    }
  }

  /**
   * Fix security issues
   */
  private fixSecurityIssue(line: string, lineNumber: number): {
    fixedLine: string;
    issue: string;
    description: string;
  } | null {
    // Fix eval usage
    if (line.includes('eval(')) {
      return {
        fixedLine: line.replace(/eval\(/g, '// SECURITY: eval removed - '),
        issue: 'Dangerous eval() usage',
        description: 'Commented out eval() call'
      };
    }

    // Fix innerHTML with user input
    if (line.includes('.innerHTML =') && !line.includes('DOMPurify')) {
      return {
        fixedLine: line.replace('.innerHTML =', '.textContent ='),
        issue: 'XSS vulnerability with innerHTML',
        description: 'Changed to textContent to prevent XSS'
      };
    }

    // Fix SQL injection potential
    if (line.match(/query\(.+\+.+\)/) || line.match(/execute\(.+\+.+\)/)) {
      return null; // Requires manual intervention
    }

    return null;
  }

  /**
   * Fix performance issues
   */
  private fixPerformanceIssue(line: string, lineNumber: number): {
    fixedLine: string;
    issue: string;
    description: string;
  } | null {
    // Fix inefficient array methods
    if (line.includes('forEach') && line.includes('push')) {
      return {
        fixedLine: line.replace('forEach', 'map'),
        issue: 'Inefficient forEach with push',
        description: 'Changed to map() for better performance'
      };
    }

    // Fix nested loops with indexOf
    if (line.includes('indexOf') && this.options.aggressive) {
      return {
        fixedLine: line.replace('indexOf', 'includes'),
        issue: 'Using indexOf instead of includes',
        description: 'Changed to includes() for clarity'
      };
    }

    return null;
  }

  /**
   * Fix logic issues
   */
  private fixLogicIssue(
    line: string,
    lineNumber: number,
    lines: string[],
    index: number
  ): {
    fixedLine: string;
    issue: string;
    description: string;
  } | null {
    // Fix == vs ===
    if (line.includes('==') && !line.includes('===') && !line.includes('===' )) {
      const match = line.match(/([^=!])={2}([^=])/);
      if (match) {
        return {
          fixedLine: line.replace(/([^=!])={2}([^=])/, '$1===$2'),
          issue: 'Using == instead of ===',
          description: 'Changed to strict equality ==='
        };
      }
    }

    // Fix != vs !==
    if (line.includes('!=') && !line.includes('!==')) {
      return {
        fixedLine: line.replace(/!={1,2}/, '!=='),
        issue: 'Using != instead of !==',
        description: 'Changed to strict inequality !=='
      };
    }

    // Fix missing null checks
    if (line.match(/\.\w+\(/) && index > 0) {
      const prevLine = lines[index - 1];
      if (!prevLine.includes('if') && !prevLine.includes('&&') && this.options.aggressive) {
        // This is aggressive and might cause issues, skip for now
        return null;
      }
    }

    return null;
  }

  /**
   * Fix style issues
   */
  private fixStyleIssue(line: string, lineNumber: number): {
    fixedLine: string;
    issue: string;
    description: string;
  } | null {
    // Fix var declarations
    if (line.match(/^\s*var\s+/)) {
      return {
        fixedLine: line.replace(/var\s+/, 'const '),
        issue: 'Using var instead of const/let',
        description: 'Changed to const (review if mutation needed)'
      };
    }

    // Fix function declarations in blocks
    if (line.match(/^\s*function\s+\w+/) && !line.includes('export')) {
      return {
        fixedLine: line.replace(/function\s+(\w+)/, 'const $1 = function'),
        issue: 'Function declaration in block',
        description: 'Changed to function expression'
      };
    }

    return null;
  }

  /**
   * Backup file
   */
  private async backupFile(file: string): Promise<void> {
    const backupPath = `${file}.backup`;
    await fs.promises.copyFile(file, backupPath);
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
  const options: FixOptions = {
    target: process.argv[2] || '.',
    aggressive: process.argv.includes('--aggressive'),
    backup: !process.argv.includes('--no-backup')
  };

  const autoFix = new AutoFix(options);
  
  autoFix.fix()
    .then(result => {
      console.log('\nFix Result:');
      console.log(`Success: ${result.success}`);
      console.log(`Total Issues: ${result.totalIssues}`);
      console.log(`Fixed Issues: ${result.fixedIssues}`);
      
      if (result.fixes.length > 0) {
        console.log('\nFixed Issues:');
        result.fixes.forEach(fix => {
          console.log(`  ${fix.file}:${fix.line} [${fix.category}]`);
          console.log(`    Issue: ${fix.issue}`);
          console.log(`    Fix: ${fix.fix}`);
        });
      }
      
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fix error:', error);
      process.exit(1);
    });
}
