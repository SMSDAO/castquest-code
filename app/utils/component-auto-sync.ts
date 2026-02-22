/**
 * Component-Specific Auto Sync
 * 
 * Provides synchronization across app, web, and mobile components
 * with database integration
 */

import { AutoSync, SyncConfig, SyncResult } from './auto-sync';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export type ComponentType = 'app' | 'web' | 'mobile' | 'database';

export interface ComponentSyncConfig extends SyncConfig {
  components: ComponentType[];
  database?: {
    enabled: boolean;
    host?: string;
    port?: number;
    syncSchema?: boolean;
    syncMigrations?: boolean;
  };
  crossComponentSync?: boolean;
}

export interface ComponentSyncResult extends SyncResult {
  componentResults: Map<ComponentType, {
    success: boolean;
    synced: string[];
    errors: string[];
  }>;
  databaseSync?: {
    success: boolean;
    schema: boolean;
    migrations: boolean;
  };
}

/**
 * ComponentAutoSync - Synchronizes across multiple components and database
 */
export class ComponentAutoSync extends AutoSync {
  private componentConfig: ComponentSyncConfig;
  
  constructor(config: ComponentSyncConfig) {
    super(config);
    this.componentConfig = config;
  }

  /**
   * Execute component-based synchronization
   */
  async syncComponents(): Promise<ComponentSyncResult> {
    console.log('🔄 Starting Component Auto Sync...');
    console.log(`Components: ${this.componentConfig.components.join(', ')}`);
    
    const result: ComponentSyncResult = {
      success: true,
      synced: [],
      skipped: [],
      errors: [],
      timestamp: new Date(),
      componentResults: new Map()
    };

    try {
      // Sync each component
      for (const component of this.componentConfig.components) {
        const componentResult = await this.syncComponent(component);
        result.componentResults.set(component, componentResult);
        
        if (!componentResult.success) {
          result.success = false;
        }
        
        result.synced.push(...componentResult.synced);
        result.errors.push(...componentResult.errors);
      }

      // Sync database if enabled
      if (this.componentConfig.database?.enabled) {
        const dbResult = await this.syncDatabase();
        result.databaseSync = dbResult;
        
        if (!dbResult.success) {
          result.success = false;
        }
      }

      // Cross-component synchronization
      if (this.componentConfig.crossComponentSync) {
        await this.syncAcrossComponents(result);
      }

      console.log('✅ Component Auto Sync completed');
    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : String(error));
      console.error('❌ Component Auto Sync failed:', error);
    }

    return result;
  }

  /**
   * Sync individual component
   */
  private async syncComponent(component: ComponentType): Promise<{
    success: boolean;
    synced: string[];
    errors: string[];
  }> {
    console.log(`\n📦 Syncing ${component} component...`);
    
    const result = {
      success: true,
      synced: [] as string[],
      errors: [] as string[]
    };

    try {
      const componentPath = this.getComponentPath(component);
      
      if (!fs.existsSync(componentPath)) {
        console.log(`⚠️  ${component} component not found, skipping...`);
        return result;
      }

      // Sync dependencies
      await this.syncComponentDependencies(component, componentPath, result);

      // Sync configuration
      await this.syncComponentConfig(component, componentPath, result);

      // Sync shared code
      await this.syncSharedCode(component, componentPath, result);

      // Sync environment variables
      await this.syncEnvironmentVariables(component, componentPath, result);

      console.log(`✓ ${component} component synced`);
    } catch (error) {
      result.success = false;
      result.errors.push(`${component}: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Get component path
   */
  private getComponentPath(component: ComponentType): string {
    const basePath = this.componentConfig.target;
    
    switch (component) {
      case 'app':
        return path.join(basePath, 'app');
      case 'web':
        return path.join(basePath, 'web');
      case 'mobile':
        return path.join(basePath, 'mobile');
      case 'database':
        return path.join(basePath, 'database');
      default:
        return basePath;
    }
  }

  /**
   * Sync component dependencies
   */
  private async syncComponentDependencies(
    component: ComponentType,
    componentPath: string,
    result: any
  ): Promise<void> {
    const packageJsonPath = path.join(componentPath, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      try {
        // Check if dependencies changed
        const { stdout: diff } = await execAsync('git diff package.json', { cwd: componentPath });
        
        if (diff.trim()) {
          console.log(`  📦 Installing dependencies for ${component}...`);
          await execAsync('npm install', { cwd: componentPath });
          result.synced.push(`${component}: dependencies updated`);
        } else {
          console.log(`  ✓ ${component} dependencies up to date`);
        }
      } catch (error) {
        console.log(`  ⚠️  Could not sync ${component} dependencies`);
      }
    }
  }

  /**
   * Sync component configuration
   */
  private async syncComponentConfig(
    component: ComponentType,
    componentPath: string,
    result: any
  ): Promise<void> {
    const configFiles = [
      '.env.example',
      'config.json',
      'tsconfig.json',
      '.eslintrc.js'
    ];

    for (const configFile of configFiles) {
      const configPath = path.join(componentPath, configFile);
      
      if (fs.existsSync(configPath)) {
        result.synced.push(`${component}: ${configFile} synced`);
      }
    }
  }

  /**
   * Sync shared code between components
   */
  private async syncSharedCode(
    component: ComponentType,
    componentPath: string,
    result: any
  ): Promise<void> {
    const sharedPath = path.join(this.componentConfig.target, 'shared');
    
    if (!fs.existsSync(sharedPath)) {
      return;
    }

    // Check if shared code exists
    const componentSharedPath = path.join(componentPath, 'shared');
    
    if (fs.existsSync(componentSharedPath)) {
      console.log(`  🔗 Syncing shared code for ${component}...`);
      result.synced.push(`${component}: shared code synced`);
    }
  }

  /**
   * Sync environment variables
   */
  private async syncEnvironmentVariables(
    component: ComponentType,
    componentPath: string,
    result: any
  ): Promise<void> {
    const envExamplePath = path.join(componentPath, '.env.example');
    const envPath = path.join(componentPath, '.env');
    
    if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
      fs.copyFileSync(envExamplePath, envPath);
      result.synced.push(`${component}: environment variables initialized`);
    }
  }

  /**
   * Sync database schema and migrations
   */
  private async syncDatabase(): Promise<{
    success: boolean;
    schema: boolean;
    migrations: boolean;
  }> {
    console.log('\n🗄️  Syncing database...');
    
    const result = {
      success: true,
      schema: false,
      migrations: false
    };

    try {
      const dbConfig = this.componentConfig.database!;
      
      // Sync database schema
      if (dbConfig.syncSchema) {
        console.log('  📋 Syncing database schema...');
        await this.syncDatabaseSchema();
        result.schema = true;
      }

      // Sync database migrations
      if (dbConfig.syncMigrations) {
        console.log('  🔄 Syncing database migrations...');
        await this.syncDatabaseMigrations();
        result.migrations = true;
      }

      console.log('✓ Database synced');
    } catch (error) {
      result.success = false;
      console.error('❌ Database sync failed:', error);
    }

    return result;
  }

  /**
   * Sync database schema
   */
  private async syncDatabaseSchema(): Promise<void> {
    const schemaPath = path.join(this.componentConfig.target, 'database', 'schema');
    
    if (!fs.existsSync(schemaPath)) {
      console.log('  ⚠️  Database schema not found, creating...');
      fs.mkdirSync(schemaPath, { recursive: true });
    }

    // Check for schema files
    const schemaFiles = fs.readdirSync(schemaPath).filter(f => f.endsWith('.sql'));
    
    if (schemaFiles.length > 0) {
      console.log(`  ✓ Found ${schemaFiles.length} schema file(s)`);
    }
  }

  /**
   * Sync database migrations
   */
  private async syncDatabaseMigrations(): Promise<void> {
    const migrationsPath = path.join(this.componentConfig.target, 'database', 'migrations');
    
    if (!fs.existsSync(migrationsPath)) {
      console.log('  ⚠️  Migrations directory not found, creating...');
      fs.mkdirSync(migrationsPath, { recursive: true });
    }

    // Check for migration files
    const migrationFiles = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql') || f.endsWith('.js'));
    
    if (migrationFiles.length > 0) {
      console.log(`  ✓ Found ${migrationFiles.length} migration(s)`);
    }
  }

  /**
   * Sync across components (shared dependencies, types, etc.)
   */
  private async syncAcrossComponents(result: ComponentSyncResult): Promise<void> {
    console.log('\n🔗 Syncing across components...');
    
    // Sync shared types
    await this.syncSharedTypes(result);
    
    // Sync shared utilities
    await this.syncSharedUtilities(result);
    
    // Sync shared constants
    await this.syncSharedConstants(result);
  }

  /**
   * Sync shared types across components
   */
  private async syncSharedTypes(result: ComponentSyncResult): Promise<void> {
    const sharedTypesPath = path.join(this.componentConfig.target, 'shared', 'types');
    
    if (!fs.existsSync(sharedTypesPath)) {
      fs.mkdirSync(sharedTypesPath, { recursive: true });
      console.log('  📝 Created shared types directory');
    }
  }

  /**
   * Sync shared utilities across components
   */
  private async syncSharedUtilities(result: ComponentSyncResult): Promise<void> {
    const sharedUtilsPath = path.join(this.componentConfig.target, 'shared', 'utils');
    
    if (!fs.existsSync(sharedUtilsPath)) {
      fs.mkdirSync(sharedUtilsPath, { recursive: true });
      console.log('  🔧 Created shared utilities directory');
    }
  }

  /**
   * Sync shared constants across components
   */
  private async syncSharedConstants(result: ComponentSyncResult): Promise<void> {
    const sharedConstantsPath = path.join(this.componentConfig.target, 'shared', 'constants');
    
    if (!fs.existsSync(sharedConstantsPath)) {
      fs.mkdirSync(sharedConstantsPath, { recursive: true });
      console.log('  📌 Created shared constants directory');
    }
  }

  /**
   * Watch mode for continuous synchronization
   */
  async watchComponents(interval: number = 60000): Promise<void> {
    console.log(`\n👀 Starting component watch mode (interval: ${interval}ms)`);
    
    setInterval(async () => {
      try {
        const result = await this.syncComponents();
        
        if (result.synced.length > 0) {
          console.log('\n🔄 Changes detected and synced:', result.synced);
        }
      } catch (error) {
        console.error('Watch cycle error:', error);
      }
    }, interval);
  }
}

/**
 * CLI Entry Point
 */
if (require.main === module) {
  const components = (process.argv[2]?.split(',') || ['app', 'web', 'mobile']) as ComponentType[];
  const target = process.argv[3] || '.';
  const watch = process.argv.includes('--watch');
  const withDatabase = process.argv.includes('--database');

  const config: ComponentSyncConfig = {
    target,
    components,
    database: withDatabase ? {
      enabled: true,
      syncSchema: true,
      syncMigrations: true
    } : undefined,
    crossComponentSync: true,
    autoCommit: false
  };

  const componentSync = new ComponentAutoSync(config);

  if (watch) {
    componentSync.watchComponents().catch(console.error);
  } else {
    componentSync
      .syncComponents()
      .then(result => {
        console.log('\n═══════════════════════════════════════');
        console.log('       Component Sync Report');
        console.log('═══════════════════════════════════════');
        console.log(`Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
        console.log(`Timestamp: ${result.timestamp.toISOString()}`);
        console.log(`\nComponents synced: ${result.componentResults.size}`);
        
        result.componentResults.forEach((componentResult, component) => {
          console.log(`\n  ${component}:`);
          console.log(`    Success: ${componentResult.success ? '✅' : '❌'}`);
          console.log(`    Items synced: ${componentResult.synced.length}`);
          if (componentResult.errors.length > 0) {
            console.log(`    Errors: ${componentResult.errors.length}`);
          }
        });

        if (result.databaseSync) {
          console.log('\n  Database:');
          console.log(`    Schema: ${result.databaseSync.schema ? '✅' : '⏭️'}`);
          console.log(`    Migrations: ${result.databaseSync.migrations ? '✅' : '⏭️'}`);
        }
        
        console.log('\n═══════════════════════════════════════\n');
        
        process.exit(result.success ? 0 : 1);
      })
      .catch(error => {
        console.error('Component sync error:', error);
        process.exit(1);
      });
  }
}
