/**
 * Tests for AiCodeEngine
 */

import { AiCodeEngine } from '../core/aicode-engine';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
jest.mock('fs');

describe('AiCodeEngine', () => {
  let engine: AiCodeEngine;

  beforeEach(() => {
    engine = new AiCodeEngine({
      target: './test',
      mode: 'analyze'
    });
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create an instance with valid config', () => {
      expect(engine).toBeInstanceOf(AiCodeEngine);
    });

    it('should accept analyze mode', () => {
      const analyzeEngine = new AiCodeEngine({
        target: './test',
        mode: 'analyze'
      });
      expect(analyzeEngine).toBeInstanceOf(AiCodeEngine);
    });

    it('should accept generate mode', () => {
      const generateEngine = new AiCodeEngine({
        target: './test',
        mode: 'generate'
      });
      expect(generateEngine).toBeInstanceOf(AiCodeEngine);
    });

    it('should accept repair mode', () => {
      const repairEngine = new AiCodeEngine({
        target: './test',
        mode: 'repair'
      });
      expect(repairEngine).toBeInstanceOf(AiCodeEngine);
    });

    it('should accept optimize mode', () => {
      const optimizeEngine = new AiCodeEngine({
        target: './test',
        mode: 'optimize'
      });
      expect(optimizeEngine).toBeInstanceOf(AiCodeEngine);
    });

    it('should accept auto mode', () => {
      const autoEngine = new AiCodeEngine({
        target: './test',
        mode: 'auto'
      });
      expect(autoEngine).toBeInstanceOf(AiCodeEngine);
    });
  });

  describe('Process method', () => {
    it('should have a process method', () => {
      expect(typeof engine.process).toBe('function');
    });

    it('should return a promise', () => {
      const result = engine.process();
      expect(result).toBeInstanceOf(Promise);
    });
  });
});
