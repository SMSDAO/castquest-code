/**
 * Tests for Orchestrator
 */

import { AiCodeOrchestrator } from '../orchestrator';

describe('AiCodeOrchestrator', () => {
  let orchestrator: AiCodeOrchestrator;

  beforeEach(() => {
    orchestrator = new AiCodeOrchestrator({
      target: './test',
      mode: 'full'
    });
  });

  describe('Constructor', () => {
    it('should create an instance', () => {
      expect(orchestrator).toBeInstanceOf(AiCodeOrchestrator);
    });

    it('should accept full mode', () => {
      const fullOrchestrator = new AiCodeOrchestrator({
        target: './test',
        mode: 'full'
      });
      expect(fullOrchestrator).toBeInstanceOf(AiCodeOrchestrator);
    });

    it('should accept development mode', () => {
      const devOrchestrator = new AiCodeOrchestrator({
        target: './test',
        mode: 'development'
      });
      expect(devOrchestrator).toBeInstanceOf(AiCodeOrchestrator);
    });

    it('should accept ci mode', () => {
      const ciOrchestrator = new AiCodeOrchestrator({
        target: './test',
        mode: 'ci'
      });
      expect(ciOrchestrator).toBeInstanceOf(AiCodeOrchestrator);
    });

    it('should accept deployment mode', () => {
      const deployOrchestrator = new AiCodeOrchestrator({
        target: './test',
        mode: 'deployment'
      });
      expect(deployOrchestrator).toBeInstanceOf(AiCodeOrchestrator);
    });

    it('should accept components mode', () => {
      const componentsOrchestrator = new AiCodeOrchestrator({
        target: './test',
        mode: 'components'
      });
      expect(componentsOrchestrator).toBeInstanceOf(AiCodeOrchestrator);
    });
  });

  describe('Orchestrate method', () => {
    it('should have an orchestrate method', () => {
      expect(typeof orchestrator.orchestrate).toBe('function');
    });

    it('should return a promise', () => {
      const result = orchestrator.orchestrate();
      expect(result).toBeInstanceOf(Promise);
    });
  });
});
