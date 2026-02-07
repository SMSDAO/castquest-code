# Installation Guide

Complete installation guide for AiCode.

## Prerequisites

Ensure you have the following installed:

```bash
# Check Node.js version (requires 18.x or higher)
node --version

# Check npm version
npm --version

# Check Git
git --version
```

## Installation Methods

### Method 1: From Repository (Recommended)

```bash
# Clone the repository
git clone https://github.com/SMSDAO/castquest-code.git
cd castquest-code/app

# Install dependencies
npm install

# Verify installation
npm run aicode:auto -- --version
```

### Method 2: As a Package

```bash
# Navigate to your project
cd your-project

# Copy app directory to your project
cp -r /path/to/castquest-code/app ./aicode

# Install dependencies
cd aicode && npm install
```

### Method 3: Global Installation

```bash
# Link AiCode globally
cd castquest-code/app
npm link

# Use from anywhere
aicode --help
```

## Platform-Specific Installation

### macOS

```bash
# Install Node.js with Homebrew
brew install node@18

# Clone and install
git clone <repository-url>
cd castquest-code/app
npm install
```

### Linux (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and install
git clone <repository-url>
cd castquest-code/app
npm install
```

### Windows

```powershell
# Install Node.js from official website
# https://nodejs.org/

# Clone and install
git clone <repository-url>
cd castquest-code/app
npm install
```

## Verification

After installation, verify AiCode is working:

```bash
# Check version
npm run aicode:auto -- --version

# Run analysis on current directory
npm run aicode:analyze

# Test auto-config
npm run config -- --help
```

## Optional Dependencies

### For TypeScript Projects

```bash
npm install --save-dev typescript @types/node
```

### For Testing

```bash
npm install --save-dev jest @types/jest ts-jest
```

### For Deployment

```bash
# Vercel CLI
npm install -g vercel

# Netlify CLI
npm install -g netlify-cli

# Heroku CLI
# Visit: https://devcenter.heroku.com/articles/heroku-cli
```

## Configuration

After installation, configure AiCode for your project:

```bash
# Generate default configuration
npm run config

# Or manually create aicode.config.json
cp app/config/aicode.config.json ./.aicode.config.json
```

## Troubleshooting Installation

### Common Issues

#### Node.js Version Mismatch

```bash
# Update Node.js using nvm
nvm install 18
nvm use 18
```

#### Permission Errors

```bash
# Fix npm permissions on macOS/Linux
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

#### Module Not Found

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

If you encounter issues:
1. Check the [Troubleshooting Guide](../guides/troubleshooting.md)
2. Review the [FAQ](../guides/faq.md)
3. Open an issue on GitHub

## Next Steps

Once installed, proceed to:
- [Configuration Guide](./configuration.md)
- [Quick Start Guide](./quick-start.md)
- [Your First Project](./first-project.md)

## Upgrading

To upgrade AiCode:

```bash
cd castquest-code
git pull origin main
cd app
npm install
```

## Uninstallation

To remove AiCode:

```bash
# If globally linked
npm unlink

# Remove installation
rm -rf aicode
```

---

**Installation complete?** Move on to [Configuration](./configuration.md)!
