# Component-Based Auto Sync and Config

Complete guide for synchronizing and configuring app, web, mobile components with database integration.

## Overview

The component-based system extends AiCode to support multi-platform applications with:
- **App Component**: Backend/API server
- **Web Component**: Web frontend (Next.js)
- **Mobile Component**: Mobile app (React Native)
- **Database**: Shared database with migrations

## Features

### Component Auto Sync

Synchronizes code, dependencies, and configurations across all components:

```bash
# Sync all components
npm run sync:components

# Sync with watch mode
npm run sync:components:watch

# Sync with database
npm run sync:components:db
```

### Component Auto Config

Automatically configures all components with proper structure:

```bash
# Configure with PostgreSQL
npm run config:components

# Configure with MongoDB
npm run config:components:mongo
```

## Component Structure

After configuration, your project structure will be:

```
project/
├── app/                 # Backend API
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── web/                 # Web frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   ├── next.config.js
│   └── .env.local.example
├── mobile/              # Mobile app
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   └── navigation/
│   ├── package.json
│   ├── app.json
│   └── .env.example
├── database/            # Database
│   ├── schema/
│   ├── migrations/
│   ├── seeds/
│   └── config/
├── shared/              # Shared code
│   ├── types/
│   ├── utils/
│   ├── constants/
│   └── package.json
└── component-config.json
```

## Usage

### 1. Configure Components

```bash
cd app/
npm install

# Configure all components with PostgreSQL
npm run config:components

# Or with specific database
node utils/component-auto-config.ts app,web,mobile . mongodb
```

This creates:
- Component directories
- Package.json files
- TypeScript configurations
- Environment files
- Database structure
- Shared directory

### 2. Install Dependencies

```bash
# Install all component dependencies
npm run install:all
```

### 3. Synchronize Components

```bash
# One-time sync
npm run sync:components

# Continuous sync (watch mode)
npm run sync:components:watch

# Sync with database
npm run sync:components:db
```

### 4. Orchestrate Components

```bash
# Run component mode orchestration
node orchestrator.ts components . --components
```

## Component Auto Sync

### Features

- **Git Synchronization**: Syncs code changes across components
- **Dependency Management**: Updates npm packages
- **Configuration Sync**: Syncs config files
- **Shared Code**: Synchronizes shared utilities and types
- **Environment Variables**: Manages .env files
- **Database Sync**: Syncs schema and migrations
- **Cross-Component**: Links shared code between components

### API

```typescript
import { ComponentAutoSync } from './utils/component-auto-sync';

const sync = new ComponentAutoSync({
  target: '.',
  components: ['app', 'web', 'mobile'],
  database: {
    enabled: true,
    syncSchema: true,
    syncMigrations: true
  },
  crossComponentSync: true
});

const result = await sync.syncComponents();
```

### Result

```typescript
interface ComponentSyncResult {
  success: boolean;
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
```

## Component Auto Config

### Features

- **Framework Detection**: Auto-detects frameworks
- **Structure Generation**: Creates proper directory structure
- **Configuration Files**: Generates all config files
- **Database Setup**: Configures database connections
- **Shared Setup**: Creates shared code structure
- **Monorepo Support**: Configures npm workspaces

### API

```typescript
import { ComponentAutoConfig } from './utils/component-auto-config';

const config = new ComponentAutoConfig({
  target: '.',
  components: ['app', 'web', 'mobile'],
  framework: 'auto',
  typescript: true,
  database: {
    type: 'postgres',
    generateMigrations: true
  },
  shared: true
});

await config.configureComponents();
```

### Supported Databases

- PostgreSQL (default port: 5432)
- MySQL (default port: 3306)
- MongoDB (default port: 27017)
- SQLite

## Database Integration

### Schema Management

Database schemas are in `database/schema/`:

```sql
-- database/schema/users.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Migrations

Migrations are in `database/migrations/`:

```sql
-- database/migrations/001_initial_schema.sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);
```

### Configuration

Database config in `database/config/database.json`:

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "database": "myapp_db",
  "entities": ["../*/src/entities/**/*.ts"],
  "migrations": ["./migrations/**/*.ts"]
}
```

## Shared Code

The `shared/` directory contains code used across all components:

### Types

```typescript
// shared/types/user.ts
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}
```

### Utils

```typescript
// shared/utils/validation.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Constants

```typescript
// shared/constants/api.ts
export const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';
```

## Component Communication

### API Integration

**App** (Backend):
```typescript
// app/src/api/users.ts
export async function getUsers() {
  return await db.users.findAll();
}
```

**Web** (Frontend):
```typescript
// web/src/services/api.ts
import { API_BASE_URL } from '@shared/constants/api';

export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/users`);
  return response.json();
}
```

**Mobile**:
```typescript
// mobile/src/services/api.ts
import { API_BASE_URL } from '@shared/constants/api';

export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/users`);
  return response.json();
}
```

## Orchestrator Integration

### Component Mode

```bash
node orchestrator.ts components .
```

This runs:
1. Component configuration
2. Component synchronization
3. Database sync (if enabled)
4. Cross-component integration

### Configuration

In orchestrator config:

```typescript
const config: OrchestratorConfig = {
  target: '.',
  mode: 'components',
  components: {
    enabled: true,
    platforms: ['app', 'web', 'mobile'],
    database: {
      enabled: true,
      type: 'postgres'
    }
  }
};
```

## Best Practices

1. **Use Shared Code**: Put common utilities in `shared/`
2. **Sync Regularly**: Run sync before committing
3. **Database Migrations**: Always create migrations for schema changes
4. **Environment Variables**: Use .env files for configuration
5. **Watch Mode**: Use watch mode during development

## Troubleshooting

### Component Not Found

If a component directory doesn't exist:
```bash
npm run config:components
```

### Dependency Issues

Reinstall all dependencies:
```bash
npm run install:all
```

### Database Connection

Check `database/config/database.json` and environment variables.

### Sync Errors

Run with verbose mode:
```bash
node utils/component-auto-sync.ts app,web,mobile . --verbose
```

## Examples

### Complete Setup

```bash
# 1. Configure components
npm run config:components

# 2. Install dependencies
npm run install:all

# 3. Sync components
npm run sync:components

# 4. Start development
npm run dev:app     # Terminal 1
npm run dev:web     # Terminal 2
npm run dev:mobile  # Terminal 3
```

### Continuous Sync

```bash
# Watch mode for automatic syncing
npm run sync:components:watch
```

### Database Setup

```bash
# Configure with database
npm run config:components

# Sync database
npm run sync:components:db

# Run migrations
cd database
npm run migrate
```

## Next Steps

- Configure environment variables for each component
- Set up database connection
- Create shared types and utilities
- Implement API endpoints
- Build frontend components
- Test cross-component communication

---

For more information, see:
- [Auto Sync Documentation](./auto-sync.md)
- [Auto Config Documentation](./auto-config.md)
- [Orchestrator Documentation](../core-concepts/architecture.md)
