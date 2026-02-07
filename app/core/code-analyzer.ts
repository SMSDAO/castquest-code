/**
 * Code Analyzer - Intelligent Code Analysis System
 * 
 * Analyzes code to understand structure, patterns, complexity,
 * and potential issues.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface AnalysisResult {
  file: string;
  language: string;
  complexity: number;
  metrics: CodeMetrics;
  issues: CodeIssue[];
  patterns: CodePattern[];
  dependencies: string[];
}

export interface CodeMetrics {
  linesOfCode: number;
  commentLines: number;
  functionCount: number;
  classCount: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
}

export interface CodeIssue {
  type: 'error' | 'warning' | 'info';
  severity: number;
  message: string;
  line: number;
  column: number;
  suggestion?: string;
}

export interface CodePattern {
  type: string;
  description: string;
  locations: Array<{ file: string; line: number }>;
  confidence: number;
}

/**
 * CodeAnalyzer class for analyzing code
 */
export class CodeAnalyzer {
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    console.log('Initializing Code Analyzer...');
    this.initialized = true;
  }

  /**
   * Analyze code at the given path
   */
  async analyze(targetPath: string): Promise<AnalysisResult> {
    if (!this.initialized) {
      throw new Error('Code Analyzer not initialized');
    }

    const fullPath = path.resolve(targetPath);
    const stats = await fs.promises.stat(fullPath);

    if (stats.isDirectory()) {
      return await this.analyzeDirectory(fullPath);
    } else {
      return await this.analyzeFile(fullPath);
    }
  }

  /**
   * Analyze a single file
   */
  private async analyzeFile(filePath: string): Promise<AnalysisResult> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const language = this.detectLanguage(filePath);
    const metrics = this.calculateMetrics(content, language);
    const issues = this.findIssuesInCode(content, language);
    const patterns = this.detectPatterns(content, language);
    const dependencies = this.extractDependencies(content, language);

    return {
      file: filePath,
      language,
      complexity: metrics.cyclomaticComplexity,
      metrics,
      issues,
      patterns,
      dependencies
    };
  }

  /**
   * Analyze a directory
   */
  private async analyzeDirectory(dirPath: string): Promise<AnalysisResult> {
    const files = await this.findSourceFiles(dirPath);
    const analyses = await Promise.all(files.map(f => this.analyzeFile(f)));
    
    // Aggregate results
    return this.aggregateAnalyses(analyses);
  }

  /**
   * Find source files in directory
   */
  private async findSourceFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory() && !this.isIgnoredDirectory(entry.name)) {
        files.push(...await this.findSourceFiles(fullPath));
      } else if (entry.isFile() && this.isSourceFile(entry.name)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Check if directory should be ignored
   */
  private isIgnoredDirectory(name: string): boolean {
    return ['node_modules', '.git', 'dist', 'build', 'coverage'].includes(name);
  }

  /**
   * Check if file is a source file
   */
  private isSourceFile(name: string): boolean {
    const extensions = ['.ts', '.js', '.tsx', '.jsx', '.py', '.java', '.go', '.rs'];
    return extensions.some(ext => name.endsWith(ext));
  }

  /**
   * Detect programming language
   */
  private detectLanguage(filePath: string): string {
    const ext = path.extname(filePath);
    const langMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust'
    };
    return langMap[ext] || 'unknown';
  }

  /**
   * Calculate code metrics
   */
  private calculateMetrics(content: string, language: string): CodeMetrics {
    const lines = content.split('\n');
    const linesOfCode = lines.filter(l => l.trim() && !this.isComment(l, language)).length;
    const commentLines = lines.filter(l => this.isComment(l, language)).length;
    const functionCount = this.countFunctions(content, language);
    const classCount = this.countClasses(content, language);
    const cyclomaticComplexity = this.calculateComplexity(content, language);
    const maintainabilityIndex = this.calculateMaintainability(linesOfCode, cyclomaticComplexity);

    return {
      linesOfCode,
      commentLines,
      functionCount,
      classCount,
      cyclomaticComplexity,
      maintainabilityIndex
    };
  }

  /**
   * Check if line is a comment
   */
  private isComment(line: string, language: string): boolean {
    const trimmed = line.trim();
    if (language === 'python') {
      return trimmed.startsWith('#');
    }
    return trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*');
  }

  /**
   * Count functions in code
   */
  private countFunctions(content: string, language: string): number {
    if (language === 'typescript' || language === 'javascript') {
      const functionPattern = /function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>/g;
      return (content.match(functionPattern) || []).length;
    }
    return 0;
  }

  /**
   * Count classes in code
   */
  private countClasses(content: string, language: string): number {
    if (language === 'typescript' || language === 'javascript') {
      const classPattern = /class\s+\w+/g;
      return (content.match(classPattern) || []).length;
    }
    return 0;
  }

  /**
   * Calculate cyclomatic complexity
   */
  private calculateComplexity(content: string, language: string): number {
    // Simplified complexity calculation
    const controlStructures = /\b(if|else|for|while|switch|case|catch)\b/g;
    const matches = content.match(controlStructures) || [];
    return matches.length + 1;
  }

  /**
   * Calculate maintainability index
   */
  private calculateMaintainability(loc: number, complexity: number): number {
    // Simplified maintainability index (0-100)
    const volume = loc * Math.log2(Math.max(loc, 1));
    const index = Math.max(0, (171 - 5.2 * Math.log(volume) - 0.23 * complexity) * 100 / 171);
    return Math.round(index);
  }

  /**
   * Find issues in code
   */
  async findIssues(targetPath: string): Promise<{ warnings: string[]; errors: string[] }> {
    const analysis = await this.analyze(targetPath);
    return {
      warnings: analysis.issues.filter(i => i.type === 'warning').map(i => i.message),
      errors: analysis.issues.filter(i => i.type === 'error').map(i => i.message)
    };
  }

  /**
   * Find issues in code content
   */
  private findIssuesInCode(content: string, language: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for common issues
      if (line.includes('console.log') && language === 'typescript') {
        issues.push({
          type: 'warning',
          severity: 2,
          message: 'Console.log statement found',
          line: index + 1,
          column: line.indexOf('console.log'),
          suggestion: 'Remove debug statements before production'
        });
      }

      if (line.includes('any') && language === 'typescript') {
        issues.push({
          type: 'warning',
          severity: 3,
          message: 'Use of "any" type',
          line: index + 1,
          column: line.indexOf('any'),
          suggestion: 'Use specific types instead of "any"'
        });
      }
    });

    return issues;
  }

  /**
   * Detect code patterns
   */
  private detectPatterns(content: string, language: string): CodePattern[] {
    const patterns: CodePattern[] = [];

    // Detect singleton pattern
    if (content.includes('static getInstance')) {
      patterns.push({
        type: 'singleton',
        description: 'Singleton pattern detected',
        locations: [{ file: '', line: 0 }],
        confidence: 0.9
      });
    }

    // Detect factory pattern
    if (content.includes('create') && content.includes('Factory')) {
      patterns.push({
        type: 'factory',
        description: 'Factory pattern detected',
        locations: [{ file: '', line: 0 }],
        confidence: 0.85
      });
    }

    return patterns;
  }

  /**
   * Extract dependencies from code
   */
  private extractDependencies(content: string, language: string): string[] {
    const dependencies: string[] = [];

    if (language === 'typescript' || language === 'javascript') {
      const importPattern = /import\s+.*?\s+from\s+['"](.+?)['"]/g;
      let match;
      while ((match = importPattern.exec(content)) !== null) {
        dependencies.push(match[1]);
      }

      const requirePattern = /require\s*\(\s*['"](.+?)['"]\s*\)/g;
      while ((match = requirePattern.exec(content)) !== null) {
        dependencies.push(match[1]);
      }
    }

    return [...new Set(dependencies)];
  }

  /**
   * Extract specifications from code
   */
  async extractSpecifications(targetPath: string): Promise<any> {
    const analysis = await this.analyze(targetPath);
    return {
      language: analysis.language,
      structure: {
        functions: analysis.metrics.functionCount,
        classes: analysis.metrics.classCount
      },
      dependencies: analysis.dependencies,
      patterns: analysis.patterns
    };
  }

  /**
   * Aggregate multiple analyses
   */
  private aggregateAnalyses(analyses: AnalysisResult[]): AnalysisResult {
    const totalMetrics = analyses.reduce((acc, a) => ({
      linesOfCode: acc.linesOfCode + a.metrics.linesOfCode,
      commentLines: acc.commentLines + a.metrics.commentLines,
      functionCount: acc.functionCount + a.metrics.functionCount,
      classCount: acc.classCount + a.metrics.classCount,
      cyclomaticComplexity: acc.cyclomaticComplexity + a.metrics.cyclomaticComplexity,
      maintainabilityIndex: acc.maintainabilityIndex + a.metrics.maintainabilityIndex
    }), {
      linesOfCode: 0,
      commentLines: 0,
      functionCount: 0,
      classCount: 0,
      cyclomaticComplexity: 0,
      maintainabilityIndex: 0
    });

    totalMetrics.maintainabilityIndex /= analyses.length;

    return {
      file: analyses[0]?.file || '',
      language: 'multi',
      complexity: totalMetrics.cyclomaticComplexity,
      metrics: totalMetrics,
      issues: analyses.flatMap(a => a.issues),
      patterns: analyses.flatMap(a => a.patterns),
      dependencies: [...new Set(analyses.flatMap(a => a.dependencies))]
    };
  }
}
