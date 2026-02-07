/**
 * Auto Comments - Automatic Comment and Documentation Generation
 * 
 * Automatically generates inline comments, JSDoc/TSDoc comments,
 * and code suggestions for improved code documentation.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface CommentOptions {
  target: string;
  style?: 'jsdoc' | 'tsdoc' | 'inline' | 'all';
  suggestions?: boolean;
  overwrite?: boolean;
}

export interface CommentResult {
  success: boolean;
  commented: Array<{
    file: string;
    added: number;
    updated: number;
  }>;
  suggestions: Array<{
    file: string;
    line: number;
    suggestion: string;
  }>;
}

/**
 * AutoComments class for automatic comment generation
 */
export class AutoComments {
  private options: CommentOptions;

  constructor(options: CommentOptions) {
    this.options = {
      style: 'all',
      suggestions: true,
      overwrite: false,
      ...options
    };
  }

  /**
   * Execute auto comments
   */
  async generate(): Promise<CommentResult> {
    console.log('Starting Auto Comments...');
    
    const result: CommentResult = {
      success: true,
      commented: [],
      suggestions: []
    };

    try {
      const files = await this.findSourceFiles(this.options.target);

      for (const file of files) {
        await this.processFile(file, result);
      }

      console.log('Auto Comments completed');
    } catch (error) {
      result.success = false;
      console.error('Comment generation error:', error);
    }

    return result;
  }

  /**
   * Process single file
   */
  private async processFile(file: string, result: CommentResult): Promise<void> {
    let content = fs.readFileSync(file, 'utf-8');
    let added = 0;
    let updated = 0;
    const lines = content.split('\n');
    const newLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Process functions
      if (this.isFunctionDeclaration(trimmed)) {
        const existingComment = this.getExistingComment(lines, i);
        
        if (!existingComment || this.options.overwrite) {
          const comment = this.generateFunctionComment(line, lines, i);
          if (comment && (!existingComment || this.options.overwrite)) {
            const indent = line.match(/^\s*/)?.[0] || '';
            newLines.push(indent + comment);
            added += existingComment ? 0 : 1;
            updated += existingComment ? 1 : 0;
          }
        } else if (existingComment) {
          newLines.push(lines[i - 1]); // Add existing comment
        }
      }

      // Process classes
      if (this.isClassDeclaration(trimmed)) {
        const existingComment = this.getExistingComment(lines, i);
        
        if (!existingComment || this.options.overwrite) {
          const comment = this.generateClassComment(line);
          if (comment && (!existingComment || this.options.overwrite)) {
            const indent = line.match(/^\s*/)?.[0] || '';
            newLines.push(indent + comment);
            added += existingComment ? 0 : 1;
            updated += existingComment ? 1 : 0;
          }
        } else if (existingComment) {
          newLines.push(lines[i - 1]); // Add existing comment
        }
      }

      // Add inline comments for complex logic
      if (this.options.style === 'inline' || this.options.style === 'all') {
        if (this.needsInlineComment(trimmed) && !this.hasInlineComment(line)) {
          const comment = this.generateInlineComment(trimmed);
          if (comment) {
            newLines.push(line + ' ' + comment);
            added++;
            continue;
          }
        }
      }

      // Generate suggestions
      if (this.options.suggestions) {
        const suggestion = this.generateSuggestion(trimmed, i + 1);
        if (suggestion) {
          result.suggestions.push({
            file: path.relative(process.cwd(), file),
            line: i + 1,
            suggestion
          });
        }
      }

      newLines.push(line);
    }

    // Write updated content
    if (added > 0 || updated > 0) {
      fs.writeFileSync(file, newLines.join('\n'));
      result.commented.push({
        file: path.relative(process.cwd(), file),
        added,
        updated
      });
    }
  }

  /**
   * Check if line is a function declaration
   */
  private isFunctionDeclaration(line: string): boolean {
    return /^(export\s+)?(async\s+)?function\s+\w+/.test(line) ||
           /^(export\s+)?const\s+\w+\s*=\s*(\([^)]*\)\s*=>|function)/.test(line);
  }

  /**
   * Check if line is a class declaration
   */
  private isClassDeclaration(line: string): boolean {
    return /^(export\s+)?class\s+\w+/.test(line);
  }

  /**
   * Get existing comment
   */
  private getExistingComment(lines: string[], index: number): string | null {
    if (index === 0) return null;
    
    const prevLine = lines[index - 1].trim();
    if (prevLine.startsWith('/**') || prevLine.startsWith('//')) {
      return prevLine;
    }
    
    return null;
  }

  /**
   * Generate function comment
   */
  private generateFunctionComment(line: string, lines: string[], index: number): string {
    const functionName = this.extractFunctionName(line);
    const params = this.extractParameters(line, lines, index);
    const returnType = this.extractReturnType(line);

    let comment = '/**\n';
    comment += ` * ${this.humanizeName(functionName)}\n`;
    
    if (params.length > 0) {
      comment += ' *\n';
      params.forEach(param => {
        comment += ` * @param ${param.name} ${param.description || ''}\n`;
      });
    }
    
    if (returnType && returnType !== 'void') {
      comment += ` * @returns ${this.describeReturnType(returnType)}\n`;
    }
    
    comment += ' */';

    return comment;
  }

  /**
   * Generate class comment
   */
  private generateClassComment(line: string): string {
    const className = this.extractClassName(line);
    
    return `/**
 * ${this.humanizeName(className)} class
 * 
 * Provides functionality for ${this.humanizeName(className).toLowerCase()}
 */`;
  }

  /**
   * Check if line needs inline comment
   */
  private needsInlineComment(line: string): boolean {
    // Complex conditions
    if (line.includes('if') && line.includes('&&') && line.includes('||')) {
      return true;
    }

    // Loops with complex conditions
    if ((line.includes('for') || line.includes('while')) && line.split('&&').length > 2) {
      return true;
    }

    // Regular expressions
    if (line.includes('new RegExp') || line.match(/\/[^/]+\/[gimuy]*/)) {
      return true;
    }

    return false;
  }

  /**
   * Check if line has inline comment
   */
  private hasInlineComment(line: string): boolean {
    return line.includes('//');
  }

  /**
   * Generate inline comment
   */
  private generateInlineComment(line: string): string | null {
    if (line.includes('if') && (line.includes('&&') || line.includes('||'))) {
      return '// Complex condition';
    }

    if (line.match(/\/[^/]+\/[gimuy]*/)) {
      return '// Pattern matching';
    }

    return null;
  }

  /**
   * Generate suggestion
   */
  private generateSuggestion(line: string, lineNumber: number): string | null {
    // Suggest using const instead of let
    if (line.match(/^let\s+\w+\s*=/) && !line.includes('=') ) {
      return 'Consider using const instead of let if value does not change';
    }

    // Suggest adding error handling
    if (line.includes('await') && !line.includes('try') && !line.includes('catch')) {
      return 'Consider adding error handling for async operations';
    }

    // Suggest using optional chaining
    if (line.includes('&&') && line.includes('.')) {
      return 'Consider using optional chaining (?.)';
    }

    return null;
  }

  /**
   * Extract function name
   */
  private extractFunctionName(line: string): string {
    const match = line.match(/function\s+(\w+)/) || line.match(/const\s+(\w+)\s*=/);
    return match ? match[1] : 'function';
  }

  /**
   * Extract class name
   */
  private extractClassName(line: string): string {
    const match = line.match(/class\s+(\w+)/);
    return match ? match[1] : 'Class';
  }

  /**
   * Extract parameters
   */
  private extractParameters(line: string, lines: string[], index: number): Array<{
    name: string;
    type?: string;
    description?: string;
  }> {
    const paramsMatch = line.match(/\(([^)]*)\)/);
    if (!paramsMatch) return [];

    const paramsStr = paramsMatch[1];
    const params = paramsStr.split(',').map(p => p.trim()).filter(p => p);

    return params.map(param => {
      const [name, type] = param.split(':').map(s => s.trim());
      return {
        name: name.replace(/[{}\[\]]/g, ''),
        type,
        description: this.describeParameter(name)
      };
    });
  }

  /**
   * Extract return type
   */
  private extractReturnType(line: string): string | null {
    const match = line.match(/:\s*([^{=]+)(?:\s*[{=]|$)/);
    return match ? match[1].trim() : null;
  }

  /**
   * Humanize name
   */
  private humanizeName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Describe parameter
   */
  private describeParameter(name: string): string {
    const descriptions: Record<string, string> = {
      'id': 'Unique identifier',
      'name': 'Name value',
      'data': 'Data object',
      'options': 'Configuration options',
      'callback': 'Callback function',
      'config': 'Configuration object'
    };

    return descriptions[name.toLowerCase()] || '';
  }

  /**
   * Describe return type
   */
  private describeReturnType(type: string): string {
    if (type.includes('Promise')) {
      return 'Promise that resolves with result';
    }
    return `${type} value`;
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
  const options: CommentOptions = {
    target: process.argv[2] || './src',
    style: (process.argv[3] as any) || 'all',
    suggestions: !process.argv.includes('--no-suggestions'),
    overwrite: process.argv.includes('--overwrite')
  };

  const autoComments = new AutoComments(options);
  
  autoComments.generate()
    .then(result => {
      console.log('\nComment Generation Result:');
      console.log(`Success: ${result.success}`);
      
      if (result.commented.length > 0) {
        console.log('\nFiles Commented:');
        result.commented.forEach(item => {
          console.log(`  ${item.file}: ${item.added} added, ${item.updated} updated`);
        });
      }
      
      if (result.suggestions.length > 0) {
        console.log(`\nSuggestions: ${result.suggestions.length}`);
        result.suggestions.slice(0, 10).forEach(suggestion => {
          console.log(`  ${suggestion.file}:${suggestion.line} - ${suggestion.suggestion}`);
        });
        
        if (result.suggestions.length > 10) {
          console.log(`  ... and ${result.suggestions.length - 10} more`);
        }
      }
      
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Comment generation error:', error);
      process.exit(1);
    });
}
