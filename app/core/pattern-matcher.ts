/**
 * Pattern Matcher - Code Pattern Recognition System
 * 
 * Identifies common design patterns, anti-patterns, and code smells
 * in the analyzed codebase.
 */

export interface Pattern {
  type: string;
  name: string;
  description: string;
  locations: PatternLocation[];
  confidence: number;
  category: 'design-pattern' | 'anti-pattern' | 'code-smell' | 'best-practice';
}

export interface PatternLocation {
  file: string;
  line: number;
  snippet: string;
}

/**
 * PatternMatcher class for recognizing code patterns
 */
export class PatternMatcher {
  private initialized: boolean = false;
  private patterns: Map<string, RegExp> = new Map();

  async initialize(): Promise<void> {
    console.log('Initializing Pattern Matcher...');
    this.loadPatternDefinitions();
    this.initialized = true;
  }

  /**
   * Load pattern definitions
   */
  private loadPatternDefinitions(): void {
    // Design Patterns
    this.patterns.set('singleton', /class\s+\w+\s*{[\s\S]*?static\s+getInstance[\s\S]*?}/);
    this.patterns.set('factory', /class\s+\w*Factory[\s\S]*?create\w+/);
    this.patterns.set('observer', /class\s+\w+\s*{[\s\S]*?(subscribe|addListener|on)[\s\S]*?}/);
    this.patterns.set('decorator', /@\w+\s*\(\s*\)/);
    
    // Anti-patterns
    this.patterns.set('god-class', /class\s+\w+\s*{[\s\S]{500,}}/);
    this.patterns.set('magic-numbers', /(?<![a-zA-Z_])\d{3,}(?![a-zA-Z_])/);
    
    // Code Smells
    this.patterns.set('long-parameter-list', /function\s+\w+\s*\([^)]{100,}\)/);
    this.patterns.set('duplicated-code', /(.{50,})\1{2,}/);
  }

  /**
   * Find patterns in analyzed code
   */
  async findPatterns(analysis: any): Promise<Pattern[]> {
    if (!this.initialized) {
      throw new Error('Pattern Matcher not initialized');
    }

    const patterns: Pattern[] = [];

    // Design Patterns
    if (analysis.patterns?.some((p: any) => p.type === 'singleton')) {
      patterns.push({
        type: 'singleton',
        name: 'Singleton Pattern',
        description: 'Ensures a class has only one instance',
        locations: [],
        confidence: 0.9,
        category: 'design-pattern'
      });
    }

    if (analysis.patterns?.some((p: any) => p.type === 'factory')) {
      patterns.push({
        type: 'factory',
        name: 'Factory Pattern',
        description: 'Creates objects without specifying exact class',
        locations: [],
        confidence: 0.85,
        category: 'design-pattern'
      });
    }

    // Anti-patterns
    if (analysis.metrics?.cyclomaticComplexity > 20) {
      patterns.push({
        type: 'high-complexity',
        name: 'High Complexity',
        description: 'Code has excessive cyclomatic complexity',
        locations: [],
        confidence: 1.0,
        category: 'anti-pattern'
      });
    }

    // Code Smells
    if (analysis.metrics?.functionCount > 50) {
      patterns.push({
        type: 'god-class',
        name: 'God Class',
        description: 'Class has too many responsibilities',
        locations: [],
        confidence: 0.8,
        category: 'code-smell'
      });
    }

    // Best Practices
    if (analysis.metrics?.commentLines > analysis.metrics?.linesOfCode * 0.2) {
      patterns.push({
        type: 'well-documented',
        name: 'Well Documented',
        description: 'Code has good documentation coverage',
        locations: [],
        confidence: 1.0,
        category: 'best-practice'
      });
    }

    return patterns;
  }

  /**
   * Match specific pattern in code content
   */
  matchPattern(content: string, patternType: string): PatternLocation[] {
    const pattern = this.patterns.get(patternType);
    if (!pattern) {
      return [];
    }

    const locations: PatternLocation[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        locations.push({
          file: '',
          line: index + 1,
          snippet: line.trim()
        });
      }
    });

    return locations;
  }

  /**
   * Detect architectural patterns
   */
  detectArchitecturalPatterns(analysis: any): Pattern[] {
    const patterns: Pattern[] = [];

    // MVC Pattern
    if (this.hasMVCStructure(analysis)) {
      patterns.push({
        type: 'mvc',
        name: 'MVC Architecture',
        description: 'Model-View-Controller pattern detected',
        locations: [],
        confidence: 0.9,
        category: 'design-pattern'
      });
    }

    // Microservices
    if (this.hasMicroservicesStructure(analysis)) {
      patterns.push({
        type: 'microservices',
        name: 'Microservices Architecture',
        description: 'Microservices pattern detected',
        locations: [],
        confidence: 0.85,
        category: 'design-pattern'
      });
    }

    return patterns;
  }

  /**
   * Check for MVC structure
   */
  private hasMVCStructure(analysis: any): boolean {
    const deps = analysis.dependencies || [];
    return deps.some((d: string) => 
      d.includes('model') || d.includes('view') || d.includes('controller')
    );
  }

  /**
   * Check for Microservices structure
   */
  private hasMicroservicesStructure(analysis: any): boolean {
    const deps = analysis.dependencies || [];
    return deps.some((d: string) => 
      d.includes('service') || d.includes('api') || d.includes('gateway')
    );
  }

  /**
   * Analyze pattern quality
   */
  analyzePatternQuality(patterns: Pattern[]): {
    score: number;
    strengths: string[];
    weaknesses: string[];
  } {
    const score = this.calculatePatternScore(patterns);
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    patterns.forEach(pattern => {
      if (pattern.category === 'design-pattern' || pattern.category === 'best-practice') {
        strengths.push(`Uses ${pattern.name}`);
      } else if (pattern.category === 'anti-pattern' || pattern.category === 'code-smell') {
        weaknesses.push(`Contains ${pattern.name}`);
      }
    });

    return { score, strengths, weaknesses };
  }

  /**
   * Calculate overall pattern score
   */
  private calculatePatternScore(patterns: Pattern[]): number {
    let score = 100;

    patterns.forEach(pattern => {
      if (pattern.category === 'anti-pattern') {
        score -= 20;
      } else if (pattern.category === 'code-smell') {
        score -= 10;
      } else if (pattern.category === 'best-practice') {
        score += 5;
      }
    });

    return Math.max(0, Math.min(100, score));
  }
}
