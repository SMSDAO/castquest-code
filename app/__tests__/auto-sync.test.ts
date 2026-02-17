import { AutoSync } from '../utils/auto-sync'

describe('AutoSync', () => {
  let autoSync: AutoSync

  beforeEach(() => {
    autoSync = new AutoSync('.')
  })

  describe('Initialization', () => {
    it('should initialize with target directory', () => {
      expect(autoSync).toBeDefined()
    })

    it('should accept configuration options', () => {
      const sync = new AutoSync('.', {
        watch: false,
        gitSync: true,
        dependencySync: true,
      })
      expect(sync).toBeDefined()
    })
  })

  describe('Git Synchronization', () => {
    it('should detect git repository', async () => {
      const result = await autoSync.checkGitStatus()
      expect(result).toHaveProperty('isGitRepo')
    })

    it('should get current branch', async () => {
      const branch = await autoSync.getCurrentBranch()
      expect(typeof branch).toBe('string')
    })

    it('should detect uncommitted changes', async () => {
      const hasChanges = await autoSync.hasUncommittedChanges()
      expect(typeof hasChanges).toBe('boolean')
    })
  })

  describe('Dependency Synchronization', () => {
    it('should check for outdated dependencies', async () => {
      const outdated = await autoSync.checkOutdatedDependencies()
      expect(Array.isArray(outdated)).toBe(true)
    })

    it('should detect missing dependencies', async () => {
      const missing = await autoSync.detectMissingDependencies()
      expect(Array.isArray(missing)).toBe(true)
    })
  })

  describe('File Synchronization', () => {
    it('should sync files between directories', async () => {
      const result = await autoSync.syncFiles('./src', './dist')
      expect(result).toHaveProperty('success')
    })

    it('should handle sync errors gracefully', async () => {
      const result = await autoSync.syncFiles('/nonexistent', './dist')
      expect(result.success).toBe(false)
    })
  })

  describe('Watch Mode', () => {
    it('should start watch mode', () => {
      const watcher = autoSync.startWatch()
      expect(watcher).toBeDefined()
      watcher?.close()
    })

    it('should stop watch mode', () => {
      const watcher = autoSync.startWatch()
      const stopped = autoSync.stopWatch()
      expect(stopped).toBe(true)
    })
  })

  describe('Configuration Sync', () => {
    it('should sync configuration files', async () => {
      const result = await autoSync.syncConfig()
      expect(result).toHaveProperty('success')
    })

    it('should merge configuration changes', async () => {
      const merged = await autoSync.mergeConfig({}, {})
      expect(merged).toBeDefined()
    })
  })
})
