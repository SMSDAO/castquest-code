/**
 * Auto Config - Automatic Configuration Management
 * 
 * Automatically detects, generates, and manages project configurations
 * for various tools and frameworks.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ConfigOptions {
  target: string;
  framework?: 'react' | 'vue' | 'node' | 'express' | 'auto';
  typescript?: boolean;
  testing?: 'jest' | 'vitest' | 'mocha' | 'none';
  linting?: boolean;
  prettier?: boolean;
}

/**
 * AutoConfig class for configuration management
 */
export class AutoConfig {
  private options: ConfigOptions;

  constructor(options: ConfigOptions) {
    this.options = options;
  }

  /**
   * Auto-configure project
   */
  async configure(): Promise<void> {
    console.log('Starting Auto Config...');

    // Detect framework if auto
    if (this.options.framework === 'auto') {
      this.options.framework = await this.detectFramework();
    }

    // Generate configurations
    await this.generatePackageJson();
    await this.generateTSConfig();
    await this.generateLintConfig();
    await this.generatePrettierConfig();
    await this.generateTestConfig();
    await this.generateGitIgnore();
    await this.generateEnvExample();

    console.log('Auto Config completed successfully');
  }

  /**
   * Detect framework
   */
  private async detectFramework(): Promise<'react' | 'vue' | 'node' | 'express'> {
    const packageJsonPath = path.join(this.options.target, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (deps.react) return 'react';
      if (deps.vue) return 'vue';
      if (deps.express) return 'express';
    }
    
    return 'node';
  }

  /**
   * Generate package.json
   */
  private async generatePackageJson(): Promise<void> {
    const packageJsonPath = path.join(this.options.target, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      const packageJson = {
        name: path.basename(this.options.target),
        version: '1.0.0',
        description: 'Auto-generated project',
        main: 'index.js',
        scripts: {
          start: 'node index.js',
          dev: 'nodemon index.js',
          test: this.options.testing !== 'none' ? this.options.testing : 'echo "No tests"',
          lint: 'eslint .',
          format: 'prettier --write .'
        },
        keywords: [],
        author: '',
        license: 'MIT'
      };
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('Generated package.json');
    }
  }

  /**
   * Generate tsconfig.json
   */
  private async generateTSConfig(): Promise<void> {
    if (!this.options.typescript) return;

    const tsconfigPath = path.join(this.options.target, 'tsconfig.json');
    
    if (!fs.existsSync(tsconfigPath)) {
      const tsconfig = {
        compilerOptions: {
          target: 'ES2020',
          module: 'commonjs',
          lib: ['ES2020'],
          outDir: './dist',
          rootDir: './src',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          resolveJsonModule: true,
          declaration: true,
          declarationMap: true,
          sourceMap: true
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist']
      };
      
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      console.log('Generated tsconfig.json');
    }
  }

  /**
   * Generate ESLint config
   */
  private async generateLintConfig(): Promise<void> {
    if (!this.options.linting) return;

    const eslintPath = path.join(this.options.target, '.eslintrc.json');
    
    if (!fs.existsSync(eslintPath)) {
      const eslintConfig = {
        env: {
          node: true,
          es2021: true
        },
        extends: [
          'eslint:recommended',
          ...(this.options.typescript ? ['plugin:@typescript-eslint/recommended'] : [])
        ],
        parser: this.options.typescript ? '@typescript-eslint/parser' : undefined,
        parserOptions: {
          ecmaVersion: 12,
          sourceType: 'module'
        },
        rules: {
          'no-console': 'warn',
          'no-unused-vars': 'error'
        }
      };
      
      fs.writeFileSync(eslintPath, JSON.stringify(eslintConfig, null, 2));
      console.log('Generated .eslintrc.json');
    }
  }

  /**
   * Generate Prettier config
   */
  private async generatePrettierConfig(): Promise<void> {
    if (!this.options.prettier) return;

    const prettierPath = path.join(this.options.target, '.prettierrc');
    
    if (!fs.existsSync(prettierPath)) {
      const prettierConfig = {
        semi: true,
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 100,
        tabWidth: 2
      };
      
      fs.writeFileSync(prettierPath, JSON.stringify(prettierConfig, null, 2));
      console.log('Generated .prettierrc');
    }
  }

  /**
   * Generate test config
   */
  private async generateTestConfig(): Promise<void> {
    if (this.options.testing === 'none') return;

    const testConfigPath = path.join(this.options.target, 
      this.options.testing === 'jest' ? 'jest.config.js' : 'vitest.config.ts');
    
    if (!fs.existsSync(testConfigPath)) {
      if (this.options.testing === 'jest') {
        const jestConfig = `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ]
};`;
        fs.writeFileSync(testConfigPath, jestConfig);
      }
      console.log(`Generated ${this.options.testing} config`);
    }
  }

  /**
   * Generate .gitignore
   */
  private async generateGitIgnore(): Promise<void> {
    const gitignorePath = path.join(this.options.target, '.gitignore');
    
    if (!fs.existsSync(gitignorePath)) {
      const gitignore = `node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
coverage/
.vscode/
.idea/`;
      
      fs.writeFileSync(gitignorePath, gitignore);
      console.log('Generated .gitignore');
    }
  }

  /**
   * Generate .env.example
   */
  private async generateEnvExample(): Promise<void> {
    const envExamplePath = path.join(this.options.target, '.env.example');
    
    if (!fs.existsSync(envExamplePath)) {
      const envExample = `# Environment variables
NODE_ENV=development
PORT=3000
# Add your environment variables here`;
      
      fs.writeFileSync(envExamplePath, envExample);
      console.log('Generated .env.example');
    }
  }
}

/**
 * CLI Entry Point
 */
if (require.main === module) {
  const options: ConfigOptions = {
    target: process.argv[2] || process.cwd(),
    framework: (process.argv[3] as any) || 'auto',
    typescript: process.argv.includes('--ts'),
    testing: process.argv.includes('--jest') ? 'jest' : 'none',
    linting: !process.argv.includes('--no-lint'),
    prettier: !process.argv.includes('--no-prettier')
  };

  const autoConfig = new AutoConfig(options);
  
  autoConfig.configure()
    .then(() => {
      console.log('\nConfiguration completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Configuration error:', error);
      process.exit(1);
    });
}
