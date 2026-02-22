/**
 * Tests for PatternMatcher
 */

import { PatternMatcher } from '../core/pattern-matcher';

describe('PatternMatcher', () => {
  let matcher: PatternMatcher;

  beforeEach(() => {
    matcher = new PatternMatcher();
  });

  describe('Constructor', () => {
    it('should create an instance', () => {
      expect(matcher).toBeInstanceOf(PatternMatcher);
    });
  });

  describe('Initialize method', () => {
    it('should have an initialize method', () => {
      expect(typeof matcher.initialize).toBe('function');
    });

    it('should return a promise', async () => {
      const result = matcher.initialize();
      expect(result).toBeInstanceOf(Promise);
      await result;
    });
  });

  describe('FindPatterns method', () => {
    it('should have a findPatterns method', () => {
      expect(typeof matcher.findPatterns).toBe('function');
    });

    it('should throw error if not initialized', async () => {
      const mockAnalysis = {
        file: 'test.ts',
        language: 'typescript',
        complexity: 5,
        metrics: {
          linesOfCode: 100,
          commentLines: 10,
          functionCount: 5,
          classCount: 1,
          cyclomaticComplexity: 5,
          maintainabilityIndex: 75
        },
        issues: [],
        patterns: [],
        dependencies: []
      };
      await expect(matcher.findPatterns(mockAnalysis)).rejects.toThrow('Pattern Matcher not initialized');
    });
  });
});
