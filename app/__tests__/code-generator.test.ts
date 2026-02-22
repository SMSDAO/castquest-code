/**
 * Tests for CodeGenerator
 */

import { CodeGenerator } from '../core/code-generator';

describe('CodeGenerator', () => {
  let generator: CodeGenerator;

  beforeEach(() => {
    generator = new CodeGenerator();
  });

  describe('Constructor', () => {
    it('should create an instance', () => {
      expect(generator).toBeInstanceOf(CodeGenerator);
    });
  });

  describe('Initialize method', () => {
    it('should have an initialize method', () => {
      expect(typeof generator.initialize).toBe('function');
    });

    it('should return a promise', async () => {
      const result = generator.initialize();
      expect(result).toBeInstanceOf(Promise);
      await result;
    });
  });

  describe('Generate method', () => {
    it('should have a generate method', () => {
      expect(typeof generator.generate).toBe('function');
    });

    it('should throw error if not initialized', async () => {
      const spec = {
        type: 'function' as const,
        language: 'typescript',
        name: 'testFunction'
      };
      await expect(generator.generate(spec)).rejects.toThrow('Code Generator not initialized');
    });
  });
});
