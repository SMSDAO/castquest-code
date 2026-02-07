/**
 * Auto Test - Automatic Test Generation and Execution
 * 
 * Automatically generates tests, runs test suites,
 * and provides coverage reports.
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface TestOptions {
  target: string;
  framework?: 'jest' | 'mocha' | 'vitest';
  coverage?: boolean;
  generate?: boolean;
  watch?: boolean;
}

export interface TestResult {
  success: boolean;
  passed: number;
  failed: number;
  skipped: number;
  coverage?: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
  duration: number;
  generated?: string[];
}

/**
 * AutoTest class for automatic testing
 */
export class AutoTest {
  private options: TestOptions;

  constructor(options: TestOptions) {
    this.options = {
      framework: 'jest',
      coverage: false,
      generate: false,
      watch: false,
      ...options
    };
  }

  /**
   * Execute auto test
   */
  async test(): Promise<TestResult> {
    console.log('Starting Auto Test...');
    
    const startTime = Date.now();
    const result: TestResult = {
      success: false,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      generated: []
    };

    try {
      // Generate tests if requested
      if (this.options.generate) {
        result.generated = await this.generateTests();
      }

      // Run tests
      await this.runTests(result);

      result.duration = Date.now() - startTime;
      result.success = result.failed === 0;

      console.log('Auto Test completed');
    } catch (error) {
      console.error('Test execution error:', error);
      result.success = false;
    }

    return result;
  }

  /**
   * Generate tests for source files
   */
  private async generateTests(): Promise<string[]> {
    console.log('Generating tests...');
    const generated: string[] = [];
    const sourceFiles = await this.findSourceFiles(this.options.target);

    for (const sourceFile of sourceFiles) {
      const testFile = this.getTestFilePath(sourceFile);
      
      // Skip if test already exists
      if (fs.existsSync(testFile)) {
        continue;
      }

      const testContent = await this.generateTestContent(sourceFile);
      
      // Create test directory if needed
      const testDir = path.dirname(testFile);
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }

      fs.writeFileSync(testFile, testContent);
      generated.push(path.relative(process.cwd(), testFile));
      console.log(`Generated test: ${path.relative(process.cwd(), testFile)}`);
    }

    return generated;
  }

  /**
   * Generate test content for a source file
   */
  private async generateTestContent(sourceFile: string): Promise<string> {
    const content = fs.readFileSync(sourceFile, 'utf-8');
    const fileName = path.basename(sourceFile, path.extname(sourceFile));
    const relativePath = './' + fileName;

    // Extract exports (simplified)
    const exports = this.extractExports(content);
    const functions = exports.filter(e => e.type === 'function');
    const classes = exports.filter(e => e.type === 'class');

    let testContent = `import { ${exports.map(e => e.name).join(', ')} } from '${relativePath}';\n\n`;

    // Generate tests for functions
    for (const func of functions) {
      testContent += this.generateFunctionTest(func.name);
    }

    // Generate tests for classes
    for (const cls of classes) {
      testContent += this.generateClassTest(cls.name);
    }

    return testContent;
  }

  /**
   * Extract exports from file content
   */
  private extractExports(content: string): Array<{ name: string; type: string }> {
    const exports: Array<{ name: string; type: string }> = [];

    // Match export function
    const functionPattern = /export\s+(async\s+)?function\s+(\w+)/g;
    let match;
    while ((match = functionPattern.exec(content)) !== null) {
      exports.push({ name: match[2], type: 'function' });
    }

    // Match export const function
    const constFunctionPattern = /export\s+const\s+(\w+)\s*=\s*(\([^)]*\)\s*=>|function)/g;
    while ((match = constFunctionPattern.exec(content)) !== null) {
      exports.push({ name: match[1], type: 'function' });
    }

    // Match export class
    const classPattern = /export\s+class\s+(\w+)/g;
    while ((match = classPattern.exec(content)) !== null) {
      exports.push({ name: match[1], type: 'class' });
    }

    return exports;
  }

  /**
   * Generate test for a function
   */
  private generateFunctionTest(functionName: string): string {
    return `describe('${functionName}', () => {
  it('should be defined', () => {
    expect(${functionName}).toBeDefined();
  });

  it('should work correctly', () => {
    // TODO: Add test implementation
    expect(true).toBe(true);
  });
});

`;
  }

  /**
   * Generate test for a class
   */
  private generateClassTest(className: string): string {
    return `describe('${className}', () => {
  let instance: ${className};

  beforeEach(() => {
    instance = new ${className}();
  });

  it('should create instance', () => {
    expect(instance).toBeDefined();
  });

  it('should have expected methods', () => {
    // TODO: Add method tests
    expect(true).toBe(true);
  });
});

`;
  }

  /**
   * Run tests
   */
  private async runTests(result: TestResult): Promise<void> {
    console.log('Running tests...');

    try {
      let command = this.getTestCommand();
      
      if (this.options.coverage) {
        command += ' --coverage';
      }

      if (this.options.watch) {
        command += ' --watch';
      }

      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        maxBuffer: 10 * 1024 * 1024
      });

      // Parse test results
      this.parseTestResults(stdout, result);

      if (this.options.coverage) {
        this.parseCoverage(stdout, result);
      }

    } catch (error: any) {
      // Tests may fail but still produce output
      if (error.stdout) {
        this.parseTestResults(error.stdout, result);
      } else {
        throw error;
      }
    }
  }

  /**
   * Get test command based on framework
   */
  private getTestCommand(): string {
    switch (this.options.framework) {
      case 'jest':
        return 'jest';
      case 'mocha':
        return 'mocha';
      case 'vitest':
        return 'vitest run';
      default:
        return 'npm test';
    }
  }

  /**
   * Parse test results from output
   */
  private parseTestResults(output: string, result: TestResult): void {
    // Jest/Vitest format
    const passedMatch = output.match(/(\d+) passed/);
    const failedMatch = output.match(/(\d+) failed/);
    const skippedMatch = output.match(/(\d+) skipped/);

    if (passedMatch) result.passed = parseInt(passedMatch[1]);
    if (failedMatch) result.failed = parseInt(failedMatch[1]);
    if (skippedMatch) result.skipped = parseInt(skippedMatch[1]);

    // Mocha format
    const mochaPassing = output.match(/(\d+) passing/);
    const mochaFailing = output.match(/(\d+) failing/);
    
    if (mochaPassing) result.passed = parseInt(mochaPassing[1]);
    if (mochaFailing) result.failed = parseInt(mochaFailing[1]);
  }

  /**
   * Parse coverage information
   */
  private parseCoverage(output: string, result: TestResult): void {
    const coverageMatch = output.match(/Statements\s+:\s+([\d.]+)%/);
    const functionsMatch = output.match(/Functions\s+:\s+([\d.]+)%/);
    const branchesMatch = output.match(/Branches\s+:\s+([\d.]+)%/);
    const linesMatch = output.match(/Lines\s+:\s+([\d.]+)%/);

    if (coverageMatch || functionsMatch) {
      result.coverage = {
        statements: coverageMatch ? parseFloat(coverageMatch[1]) : 0,
        functions: functionsMatch ? parseFloat(functionsMatch[1]) : 0,
        branches: branchesMatch ? parseFloat(branchesMatch[1]) : 0,
        lines: linesMatch ? parseFloat(linesMatch[1]) : 0
      };
    }
  }

  /**
   * Get test file path for source file
   */
  private getTestFilePath(sourceFile: string): string {
    const ext = path.extname(sourceFile);
    const base = sourceFile.slice(0, -ext.length);
    const dir = path.dirname(sourceFile);
    const name = path.basename(base);
    
    // Check for __tests__ directory
    const testsDir = path.join(dir, '__tests__');
    if (fs.existsSync(testsDir)) {
      return path.join(testsDir, `${name}.test${ext}`);
    }
    
    // Place test file next to source file
    return `${base}.test${ext}`;
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

          if (entry.isDirectory() && 
              !['node_modules', 'dist', 'build', '__tests__', 'test', 'tests'].includes(entry.name)) {
            await walk(fullPath);
          } else if (extensions.some(ext => entry.name.endsWith(ext)) && 
                     !entry.name.includes('.test.') && 
                     !entry.name.includes('.spec.')) {
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
  const options: TestOptions = {
    target: process.argv[2] || './src',
    coverage: process.argv.includes('--coverage'),
    generate: process.argv.includes('--generate'),
    watch: process.argv.includes('--watch')
  };

  const autoTest = new AutoTest(options);
  
  autoTest.test()
    .then(result => {
      console.log('\nTest Result:');
      console.log(`Success: ${result.success}`);
      console.log(`Passed: ${result.passed}`);
      console.log(`Failed: ${result.failed}`);
      console.log(`Skipped: ${result.skipped}`);
      console.log(`Duration: ${result.duration}ms`);
      
      if (result.generated && result.generated.length > 0) {
        console.log(`\nGenerated Tests: ${result.generated.length}`);
        result.generated.forEach(test => console.log(`  ${test}`));
      }
      
      if (result.coverage) {
        console.log('\nCoverage:');
        console.log(`  Statements: ${result.coverage.statements}%`);
        console.log(`  Functions: ${result.coverage.functions}%`);
        console.log(`  Branches: ${result.coverage.branches}%`);
        console.log(`  Lines: ${result.coverage.lines}%`);
      }
      
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test error:', error);
      process.exit(1);
    });
}
