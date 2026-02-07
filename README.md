# Claude Code

![](https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square) [![npm]](https://www.npmjs.com/package/@anthropic-ai/claude-code)

[npm]: https://img.shields.io/npm/v/@anthropic-ai/claude-code.svg?style=flat-square

Claude Code is an agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster by executing routine tasks, explaining complex code, and handling git workflows -- all through natural language commands. Use it in your terminal, IDE, or tag @claude on Github.

**Learn more in the [official documentation](https://code.claude.com/docs/en/overview)**.

<img src="./demo.gif" />

## Get started
> [!NOTE]
> Installation via npm is deprecated. Use one of the recommended methods below.

For more installation options, uninstall steps, and troubleshooting, see the [setup documentation](https://code.claude.com/docs/en/setup).

1. Install Claude Code:

    **MacOS/Linux (Recommended):**
    ```bash
    curl -fsSL https://claude.ai/install.sh | bash
    ```

    **Homebrew (MacOS/Linux):**
    ```bash
    brew install --cask claude-code
    ```

    **Windows (Recommended):**
    ```powershell
    irm https://claude.ai/install.ps1 | iex
    ```

    **WinGet (Windows):**
    ```powershell
    winget install Anthropic.ClaudeCode
    ```

    **NPM (Deprecated):**
    ```bash
    npm install -g @anthropic-ai/claude-code
    ```

2. Navigate to your project directory and run `claude`.

## AiCode - Automated Coding System

This repository now includes **AiCode**, a comprehensive automated AI-powered coding system with flow-based architecture. AiCode provides intelligent code analysis, generation, repair, testing, and deployment capabilities.

### Quick Start with AiCode

```bash
# Navigate to AiCode
cd app/

# Install dependencies
npm install

# Run full automation
node orchestrator.ts full .

# Or use individual utilities
npm run aicode:analyze    # Analyze code
npm run repair            # Repair issues
npm run auto-test         # Generate & run tests
npm run deploy            # Deploy to Vercel
```

### Key Features

- **🧠 Intelligent Analysis** - Deep code understanding and metrics
- **🤖 AI Generation** - Automatic code, tests, and documentation
- **🔧 Auto Repair** - Fix common issues automatically
- **🐛 Auto Fix** - Detect and repair bugs
- **🧪 Auto Test** - Generate tests with coverage
- **🚀 Auto Deploy** - Deploy to Vercel, Netlify, AWS, Heroku
- **📝 Auto Comments** - Generate comprehensive documentation
- **🏗️ Builders** - Flow, Component, Workflow, and Pipeline builders

### Documentation

Complete documentation available in the [docs/](./docs/) directory:
- [Getting Started](./docs/getting-started/quick-start.md)
- [Core Concepts](./docs/core-concepts/README.md)
- [Automation Utilities](./docs/automation-utilities/README.md)
- [Builders](./docs/builders/README.md)
- [Examples](./docs/examples/README.md)
- [API Reference](./docs/api-reference/README.md)

See [AICODE_SUMMARY.md](./AICODE_SUMMARY.md) for a complete overview.

## Plugins

This repository includes several Claude Code plugins that extend functionality with custom commands and agents. See the [plugins directory](./plugins/README.md) for detailed documentation on available plugins.

## Reporting Bugs

We welcome your feedback. Use the `/bug` command to report issues directly within Claude Code, or file a [GitHub issue](https://github.com/anthropics/claude-code/issues).

## Connect on Discord

Join the [Claude Developers Discord](https://anthropic.com/discord) to connect with other developers using Claude Code. Get help, share feedback, and discuss your projects with the community.

## Data collection, usage, and retention

When you use Claude Code, we collect feedback, which includes usage data (such as code acceptance or rejections), associated conversation data, and user feedback submitted via the `/bug` command.

### How we use your data

See our [data usage policies](https://code.claude.com/docs/en/data-usage).

### Privacy safeguards

We have implemented several safeguards to protect your data, including limited retention periods for sensitive information, restricted access to user session data, and clear policies against using feedback for model training.

For full details, please review our [Commercial Terms of Service](https://www.anthropic.com/legal/commercial-terms) and [Privacy Policy](https://www.anthropic.com/legal/privacy).
