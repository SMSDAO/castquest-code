/**
 * Tests for CodeAnalyzer
 */

import { CodeAnalyzer } from '../core/code-analyzer';

describe('CodeAnalyzer', () => {
  let analyzer: CodeAnalyzer;

  beforeEach(() => {
    analyzer = new CodeAnalyzer();
  });

  describe('Constructor', () => {
    it('should create an instance', () => {
      expect(analyzer).toBeInstanceOf(CodeAnalyzer);
    });
  });

  describe('Initialize method', () => {
    it('should have an initialize method', () => {
      expect(typeof analyzer.initialize).toBe('function');
    });

    it('should return a promise', async () => {
      const result = analyzer.initialize();
      expect(result).toBeInstanceOf(Promise);
      await result;
    });
  });

  describe('Analyze method', () => {
    it('should have an analyze method', () => {
      expect(typeof analyzer.analyze).toBe('function');
    });

    it('should throw error if not initialized', async () => {
      await expect(analyzer.analyze('./test')).rejects.toThrow('Code Analyzer not initialized');
    });
  });
});
