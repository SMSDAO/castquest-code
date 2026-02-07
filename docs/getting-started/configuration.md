# Configuration Guide

Learn how to configure AiCode for your specific needs.

## Configuration Files

AiCode uses three main configuration files:

1. **aicode.config.json** - Main AiCode settings
2. **builder.config.json** - Builder-specific configuration
3. **automation.config.json** - Automation utilities settings

## Main Configuration (aicode.config.json)

### Basic Configuration

```json
{
  "version": "1.0.0",
  "name": "My AiCode Project",
  "engine": {
    "mode": "auto",
    "verbose": true,
    "dryRun": false
  }
}
```

### Complete Configuration

```json
{
  "version": "1.0.0",
  "name": "AiCode System",
  "description": "Automated AI-powered code processing",
  "engine": {
    "mode": "auto",
    "verbose": true,
    "dryRun": false
  },
  "features": {
    "codeAnalysis": {
      "enabled": true,
      "deep": true,
      "patterns": true
    },
    "codeGeneration": {
      "enabled": true,
      "tests": true,
      "documentation": true,
      "comments": true
    },
    "automation": {
      "autoSync": true,
      "autoConfig": true,
      "autoRepair": true,
      "autoFix": true,
      "autoTest": true,
      "autoDeploy": false,
      "autoComments": true
    }
  },
  "targets": {
    "sourceDirectory": "./src",
    "buildDirectory": "./dist",
    "testDirectory": "./tests",
    "docsDirectory": "./docs"
  },
  "excludePatterns": [
    "node_modules/**",
    "dist/**",
    "build/**",
    ".git/**"
  ]
}
```

## Builder Configuration (builder.config.json)

### Flow Builder

```json
{
  "builders": {
    "flow": {
      "defaultSteps": [
        "sync",
        "analyze",
        "repair",
        "test",
        "comment"
      ],
      "parallel": false,
      "continueOnError": false
    }
  }
}
```

### Component Builder

```json
{
  "builders": {
    "component": {
      "frameworks": {
        "react": {
          "template": "functional",
          "typescript": true,
          "hooks": true
        },
        "vue": {
          "version": 3,
          "typescript": true,
          "composition": true
        }
      },
      "naming": {
        "convention": "PascalCase",
        "suffix": true
      }
    }
  }
}
```

## Automation Configuration (automation.config.json)

### Auto Sync

```json
{
  "automation": {
    "autoSync": {
      "enabled": true,
      "interval": 60000,
      "autoCommit": false,
      "patterns": ["**/*.ts", "**/*.js"],
      "exclude": ["node_modules/**"]
    }
  }
}
```

### Auto Test

```json
{
  "automation": {
    "autoTest": {
      "enabled": true,
      "framework": "jest",
      "coverage": true,
      "generate": true,
      "threshold": {
        "lines": 80,
        "functions": 80,
        "branches": 75
      }
    }
  }
}
```

### Auto Deploy

```json
{
  "automation": {
    "autoDeploy": {
      "enabled": false,
      "platform": "vercel",
      "environment": "production",
      "skipTests": false,
      "autoMigrate": false
    }
  }
}
```

## Environment-Specific Configuration

### Development

```json
{
  "engine": {
    "mode": "auto",
    "verbose": true,
    "dryRun": true
  },
  "features": {
    "automation": {
      "autoDeploy": false
    }
  }
}
```

### Production

```json
{
  "engine": {
    "mode": "auto",
    "verbose": false,
    "dryRun": false
  },
  "features": {
    "automation": {
      "autoSync": true,
      "autoTest": true,
      "autoDeploy": true
    }
  }
}
```

## Configuration Priority

AiCode loads configuration in this order:
1. Default configuration (app/config/*.json)
2. Project configuration (.aicode.config.json)
3. Environment variables
4. Command-line arguments

## Environment Variables

```bash
# Engine settings
AICODE_MODE=auto
AICODE_VERBOSE=true
AICODE_DRY_RUN=false

# Targets
AICODE_SOURCE_DIR=./src
AICODE_BUILD_DIR=./dist

# Deployment
AICODE_DEPLOY_PLATFORM=vercel
AICODE_DEPLOY_ENV=production
```

## Command-Line Arguments

Override configuration with CLI arguments:

```bash
# Set mode
npm run aicode:auto -- --mode analyze

# Enable verbose output
npm run aicode:auto -- --verbose

# Dry run mode
npm run aicode:auto -- --dry-run

# Specify target
npm run aicode:analyze -- ./src
```

## Advanced Configuration

### Custom Flows

```json
{
  "builders": {
    "flow": {
      "customFlows": {
        "deploy-flow": {
          "steps": [
            "analyze",
            "test",
            "build",
            "deploy"
          ]
        }
      }
    }
  }
}
```

### Custom Templates

```json
{
  "builders": {
    "component": {
      "templates": {
        "custom-react": {
          "path": "./templates/react-component.ts",
          "props": true,
          "state": true
        }
      }
    }
  }
}
```

## Configuration Validation

Validate your configuration:

```bash
# Validate configuration
npm run config -- --validate

# Show current configuration
npm run config -- --show
```

## Best Practices

1. **Start Simple** - Begin with basic configuration
2. **Environment-Specific** - Use different configs for dev/prod
3. **Version Control** - Commit aicode.config.json
4. **Secrets** - Never commit sensitive data
5. **Documentation** - Document custom configurations

## Configuration Examples

### React Project

```json
{
  "features": {
    "codeGeneration": {
      "enabled": true,
      "tests": true
    }
  },
  "builders": {
    "component": {
      "frameworks": {
        "react": {
          "typescript": true,
          "hooks": true
        }
      }
    }
  },
  "targets": {
    "sourceDirectory": "./src",
    "testDirectory": "./src/__tests__"
  }
}
```

### Node.js API

```json
{
  "features": {
    "codeAnalysis": {
      "enabled": true,
      "deep": true
    },
    "automation": {
      "autoTest": true,
      "autoDeploy": true
    }
  },
  "automation": {
    "autoDeploy": {
      "platform": "heroku",
      "autoMigrate": true
    }
  }
}
```

## Next Steps

- Learn about [Core Concepts](../core-concepts/README.md)
- Explore [Builders](../builders/README.md)
- Try [Your First Project](./first-project.md)

---

**Need help?** Check the [Troubleshooting Guide](../guides/troubleshooting.md)!
