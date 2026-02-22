/**
 * Component-Specific Auto Config
 * 
 * Automatically configures app, web, mobile components with database integration
 */

import { AutoConfig, ConfigOptions } from './auto-config';
import * as fs from 'fs';
import * as path from 'path';

export type ComponentPlatform = 'app' | 'web' | 'mobile';

export interface ComponentConfigOptions extends ConfigOptions {
  components: ComponentPlatform[];
  database?: {
    type: 'postgres' | 'mysql' | 'mongodb' | 'sqlite';
    host?: string;
    port?: number;
    name?: string;
    generateMigrations?: boolean;
  };
  shared?: boolean;
}

/**
 * ComponentAutoConfig - Configure multiple components with database
 */
export class ComponentAutoConfig extends AutoConfig {
  private componentOptions: ComponentConfigOptions;

  constructor(options: ComponentConfigOptions) {
    super(options);
    this.componentOptions = options;
  }

  /**
   * Configure all components
   */
  async configureComponents(): Promise<void> {
    console.log('🔧 Starting Component Auto Config...');
    console.log(`Components: ${this.componentOptions.components.join(', ')}`);

    // Create shared directory structure if needed
    if (this.componentOptions.shared) {
      await this.setupSharedStructure();
    }

    // Configure each component
    for (const component of this.componentOptions.components) {
      await this.configureComponent(component);
    }

    // Configure database if specified
    if (this.componentOptions.database) {
      await this.configureDatabase();
    }

    // Setup cross-component integration
    await this.setupCrossComponentIntegration();

    console.log('✅ Component Auto Config completed');
  }

  /**
   * Setup shared structure
   */
  private async setupSharedStructure(): Promise<void> {
    console.log('\n📁 Setting up shared structure...');

    const sharedPath = path.join(this.componentOptions.target, 'shared');
    const directories = [
      'types',
      'utils',
      'constants',
      'components',
      'hooks',
      'api'
    ];

    for (const dir of directories) {
      const dirPath = path.join(sharedPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`  ✓ Created ${dir}`);
      }
    }

    // Create shared package.json
    const sharedPackageJson = {
      name: '@shared/common',
      version: '1.0.0',
      private: true,
      main: 'index.ts',
      types: 'index.ts'
    };

    fs.writeFileSync(
      path.join(sharedPath, 'package.json'),
      JSON.stringify(sharedPackageJson, null, 2)
    );

    // Create shared index
    fs.writeFileSync(
      path.join(sharedPath, 'index.ts'),
      `// Shared exports\nexport * from './types';\nexport * from './utils';\nexport * from './constants';\n`
    );
  }

  /**
   * Configure individual component
   */
  private async configureComponent(component: ComponentPlatform): Promise<void> {
    console.log(`\n⚙️  Configuring ${component} component...`);

    const componentPath = path.join(this.componentOptions.target, component);

    // Create component directory
    if (!fs.existsSync(componentPath)) {
      fs.mkdirSync(componentPath, { recursive: true });
    }

    // Generate component-specific configuration
    switch (component) {
      case 'app':
        await this.configureAppComponent(componentPath);
        break;
      case 'web':
        await this.configureWebComponent(componentPath);
        break;
      case 'mobile':
        await this.configureMobileComponent(componentPath);
        break;
    }

    console.log(`  ✓ ${component} component configured`);
  }

  /**
   * Configure app component
   */
  private async configureAppComponent(componentPath: string): Promise<void> {
    // Create app structure
    const directories = ['src', 'src/core', 'src/utils', 'src/config', 'tests'];
    
    for (const dir of directories) {
      const dirPath = path.join(componentPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }

    // Create package.json
    const packageJson = {
      name: 'app',
      version: '1.0.0',
      main: 'src/index.ts',
      scripts: {
        start: 'node dist/index.js',
        dev: 'nodemon src/index.ts',
        build: 'tsc',
        test: 'jest'
      },
      dependencies: {},
      devDependencies: {
        '@types/node': '^18.0.0',
        typescript: '^5.0.0',
        jest: '^29.0.0'
      }
    };

    fs.writeFileSync(
      path.join(componentPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create tsconfig.json
    const tsconfig = {
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist']
    };

    fs.writeFileSync(
      path.join(componentPath, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2)
    );

    // Create environment file
    const envExample = `# App Configuration
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=\${DATABASE_URL}

# API Keys
API_KEY=your_api_key_here
`;

    fs.writeFileSync(path.join(componentPath, '.env.example'), envExample);

    console.log('  📦 App component structure created');
  }

  /**
   * Configure web component
   */
  private async configureWebComponent(componentPath: string): Promise<void> {
    // Create web structure
    const directories = [
      'src',
      'src/components',
      'src/pages',
      'src/hooks',
      'src/styles',
      'src/utils',
      'public'
    ];

    for (const dir of directories) {
      const dirPath = path.join(componentPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }

    // Create package.json for web
    const packageJson = {
      name: 'web',
      version: '1.0.0',
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        react: '^18.0.0',
        'react-dom': '^18.0.0',
        next: '^14.0.0'
      },
      devDependencies: {
        '@types/react': '^18.0.0',
        '@types/node': '^18.0.0',
        typescript: '^5.0.0'
      }
    };

    fs.writeFileSync(
      path.join(componentPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create Next.js config
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
  }
}

module.exports = nextConfig
`;

    fs.writeFileSync(path.join(componentPath, 'next.config.js'), nextConfig);

    // Create tsconfig.json
    const tsconfig = {
      compilerOptions: {
        target: 'ES2020',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        paths: {
          '@/*': ['./src/*'],
          '@shared/*': ['../shared/*']
        }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
      exclude: ['node_modules']
    };

    fs.writeFileSync(
      path.join(componentPath, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2)
    );

    // Create environment file
    const envExample = `# Web Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=MyApp

# Database
DATABASE_URL=\${DATABASE_URL}
`;

    fs.writeFileSync(path.join(componentPath, '.env.local.example'), envExample);

    console.log('  🌐 Web component structure created');
  }

  /**
   * Configure mobile component
   */
  private async configureMobileComponent(componentPath: string): Promise<void> {
    // Create mobile structure
    const directories = [
      'src',
      'src/screens',
      'src/components',
      'src/navigation',
      'src/services',
      'src/utils',
      'assets'
    ];

    for (const dir of directories) {
      const dirPath = path.join(componentPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }

    // Create package.json for mobile (React Native)
    const packageJson = {
      name: 'mobile',
      version: '1.0.0',
      main: 'index.js',
      scripts: {
        android: 'react-native run-android',
        ios: 'react-native run-ios',
        start: 'react-native start',
        test: 'jest',
        lint: 'eslint .'
      },
      dependencies: {
        react: '^18.0.0',
        'react-native': '^0.72.0',
        '@react-navigation/native': '^6.0.0',
        '@react-navigation/stack': '^6.0.0'
      },
      devDependencies: {
        '@types/react': '^18.0.0',
        '@types/react-native': '^0.72.0',
        typescript: '^5.0.0',
        jest: '^29.0.0'
      }
    };

    fs.writeFileSync(
      path.join(componentPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create tsconfig.json
    const tsconfig = {
      extends: '@react-native/typescript-config/tsconfig.json',
      compilerOptions: {
        paths: {
          '@/*': ['./src/*'],
          '@shared/*': ['../shared/*']
        }
      }
    };

    fs.writeFileSync(
      path.join(componentPath, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2)
    );

    // Create app.json
    const appJson = {
      name: 'mobile',
      displayName: 'Mobile App',
      expo: {
        name: 'mobile',
        slug: 'mobile',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        splash: {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      }
    };

    fs.writeFileSync(
      path.join(componentPath, 'app.json'),
      JSON.stringify(appJson, null, 2)
    );

    // Create environment file
    const envExample = `# Mobile Configuration
API_URL=http://localhost:3000/api
APP_NAME=MyApp

# Database (for local storage)
DATABASE_NAME=mobile_app.db
`;

    fs.writeFileSync(path.join(componentPath, '.env.example'), envExample);

    console.log('  📱 Mobile component structure created');
  }

  /**
   * Configure database
   */
  private async configureDatabase(): Promise<void> {
    console.log('\n🗄️  Configuring database...');

    const dbPath = path.join(this.componentOptions.target, 'database');
    const dbType = this.componentOptions.database!.type;

    // Create database directories
    const directories = ['schema', 'migrations', 'seeds', 'config'];
    
    for (const dir of directories) {
      const dirPath = path.join(dbPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }

    // Create database configuration
    const dbConfig = {
      type: dbType,
      host: this.componentOptions.database!.host || 'localhost',
      port: this.componentOptions.database!.port || this.getDefaultPort(dbType),
      database: this.componentOptions.database!.name || 'myapp_db',
      synchronize: false,
      logging: true,
      entities: ['../*/src/entities/**/*.ts'],
      migrations: ['./migrations/**/*.ts'],
      subscribers: ['../*/src/subscribers/**/*.ts']
    };

    fs.writeFileSync(
      path.join(dbPath, 'config', 'database.json'),
      JSON.stringify(dbConfig, null, 2)
    );

    // Create initial migration template
    if (this.componentOptions.database!.generateMigrations) {
      const migrationTemplate = `-- Initial Schema
-- Created: ${new Date().toISOString()}

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add more tables as needed
`;

      fs.writeFileSync(
        path.join(dbPath, 'migrations', `001_initial_schema.sql`),
        migrationTemplate
      );
    }

    // Create README
    const dbReadme = `# Database

## Configuration

Database type: ${dbType}
Connection details are in \`config/database.json\`

## Migrations

Run migrations:
\`\`\`bash
npm run migrate
\`\`\`

## Schema

Schema files are in \`schema/\` directory.

## Seeds

Seed files for development data are in \`seeds/\` directory.
`;

    fs.writeFileSync(path.join(dbPath, 'README.md'), dbReadme);

    console.log(`  ✓ Database configured (${dbType})`);
  }

  /**
   * Get default port for database type
   */
  private getDefaultPort(dbType: string): number {
    switch (dbType) {
      case 'postgres':
        return 5432;
      case 'mysql':
        return 3306;
      case 'mongodb':
        return 27017;
      case 'sqlite':
        return 0;
      default:
        return 5432;
    }
  }

  /**
   * Setup cross-component integration
   */
  private async setupCrossComponentIntegration(): Promise<void> {
    console.log('\n🔗 Setting up cross-component integration...');

    // Create root configuration
    const rootConfig = {
      workspaces: ['app', 'web', 'mobile', 'shared'],
      components: this.componentOptions.components,
      database: this.componentOptions.database
    };

    fs.writeFileSync(
      path.join(this.componentOptions.target, 'component-config.json'),
      JSON.stringify(rootConfig, null, 2)
    );

    // Create root package.json for monorepo
    const rootPackageJson = {
      name: 'root',
      private: true,
      workspaces: ['app', 'web', 'mobile', 'shared'],
      scripts: {
        'install:all': 'npm install && npm run install:components',
        'install:components': 'npm install --workspaces',
        'sync': 'node app/utils/component-auto-sync.ts',
        'sync:watch': 'node app/utils/component-auto-sync.ts --watch',
        'sync:database': 'node app/utils/component-auto-sync.ts --database',
        'dev:app': 'npm run dev --workspace=app',
        'dev:web': 'npm run dev --workspace=web',
        'dev:mobile': 'npm run start --workspace=mobile',
        'build:all': 'npm run build --workspaces'
      }
    };

    const rootPackagePath = path.join(this.componentOptions.target, 'package.json');
    if (!fs.existsSync(rootPackagePath)) {
      fs.writeFileSync(
        rootPackagePath,
        JSON.stringify(rootPackageJson, null, 2)
      );
    }

    console.log('  ✓ Cross-component integration configured');
  }
}

/**
 * CLI Entry Point
 */
if (require.main === module) {
  const components = (process.argv[2]?.split(',') || ['app', 'web', 'mobile']) as ComponentPlatform[];
  const target = process.argv[3] || '.';
  const dbType = process.argv[4] as any || 'postgres';

  const options: ComponentConfigOptions = {
    target,
    components,
    framework: 'auto',
    typescript: true,
    testing: 'jest',
    linting: true,
    prettier: true,
    database: {
      type: dbType,
      generateMigrations: true
    },
    shared: true
  };

  const componentConfig = new ComponentAutoConfig(options);

  componentConfig
    .configureComponents()
    .then(() => {
      console.log('\n═══════════════════════════════════════');
      console.log('   Component Configuration Complete');
      console.log('═══════════════════════════════════════');
      console.log(`\n✅ Configured components: ${components.join(', ')}`);
      console.log(`✅ Database: ${dbType}`);
      console.log(`✅ Shared structure: enabled`);
      console.log('\nNext steps:');
      console.log('1. Run: npm run install:all');
      console.log('2. Configure environment variables in each component');
      console.log('3. Run: npm run sync to synchronize components');
      console.log('\n═══════════════════════════════════════\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('Configuration error:', error);
      process.exit(1);
    });
}
