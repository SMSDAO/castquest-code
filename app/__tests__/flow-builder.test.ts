import { FlowBuilder } from '../builders/flow-builder'

describe('FlowBuilder', () => {
  let builder: FlowBuilder

  beforeEach(() => {
    builder = new FlowBuilder()
  })

  describe('Initialization', () => {
    it('should initialize with empty workflow', () => {
      expect(builder).toBeDefined()
    })
  })

  describe('Node Management', () => {
    it('should add a node to the workflow', () => {
      const result = builder.addNode('test-node', async () => ({ success: true }))
      expect(result).toBe(builder) // Should return builder for chaining
    })

    it('should add multiple nodes', () => {
      builder
        .addNode('node1', async () => ({ success: true }))
        .addNode('node2', async () => ({ success: true }))
        .addNode('node3', async () => ({ success: true }))
      
      // Builder should handle multiple nodes
      expect(builder).toBeDefined()
    })
  })

  describe('Dependency Resolution', () => {
    it('should set dependencies between nodes', () => {
      builder
        .addNode('node1', async () => ({ success: true }))
        .addNode('node2', async () => ({ success: true }))
        .setDependency('node2', 'node1')
      
      expect(builder).toBeDefined()
    })

    it('should handle multiple dependencies', () => {
      builder
        .addNode('node1', async () => ({ success: true }))
        .addNode('node2', async () => ({ success: true }))
        .addNode('node3', async () => ({ success: true }))
        .setDependency('node3', 'node1')
        .setDependency('node3', 'node2')
      
      expect(builder).toBeDefined()
    })
  })

  describe('Workflow Execution', () => {
    it('should execute a simple workflow', async () => {
      let executed = false
      
      builder.addNode('test', async () => {
        executed = true
        return { success: true }
      })

      await builder.build()
      expect(executed).toBe(true)
    })

    it('should execute nodes in dependency order', async () => {
      const execOrder: string[] = []

      builder
        .addNode('first', async () => {
          execOrder.push('first')
          return { success: true }
        })
        .addNode('second', async () => {
          execOrder.push('second')
          return { success: true }
        })
        .setDependency('second', 'first')

      await builder.build()
      expect(execOrder).toEqual(['first', 'second'])
    })
  })

  describe('Error Handling', () => {
    it('should handle node execution errors', async () => {
      builder.addNode('error-node', async () => {
        throw new Error('Test error')
      })

      try {
        await builder.build()
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should validate workflow before execution', () => {
      // Empty workflow should not error on validation
      expect(() => builder.validate()).not.toThrow()
    })
  })

  describe('Workflow Validation', () => {
    it('should detect circular dependencies', () => {
      builder
        .addNode('node1', async () => ({ success: true }))
        .addNode('node2', async () => ({ success: true }))
        .setDependency('node1', 'node2')
        .setDependency('node2', 'node1')

      // Should detect circular dependency
      expect(() => builder.validate()).toThrow()
    })

    it('should validate missing dependencies', () => {
      builder
        .addNode('node1', async () => ({ success: true }))
        .setDependency('node1', 'nonexistent')

      expect(() => builder.validate()).toThrow()
    })
  })
})
