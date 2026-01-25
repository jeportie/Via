# Quick Start Guide
> Get up and running with Via's AI/Human pair programming system in 5 minutes

## 🚀 Initial Setup

```bash
# 1. Clone and enter project
git clone https://github.com/jeportie/via.git
cd via

# 2. Run initial setup (installs deps, builds sandbox, creates kanban)
make setup

# 3. Verify environment
make env-check
```

## 🎯 Common Commands

### Sandbox (Claude Code Environment)

```bash
# Enter the Claude Code sandbox
make claude

# Or explicitly:
make sandbox

# Secure sandbox (read-only, no network)
make sandbox-secure

# Execute command in sandbox
make sandbox-exec CMD="pnpm test"
```

### Development

```bash
# Install dependencies
make install

# Start development mode (watch tests)
make dev

# Run tests
make test

# Build project
make build

# Run all quality checks
make check

# Quick check before commit
make commit-ready
```

### Kanban Workflow

```bash
# Show board status
make kanban-status

# List all todos
make kanban-list

# Initialize kanban structure
make kanban-init

# Move todo between stages
make kanban-move FROM=to-do TO=in-progress FILE=001_task.md
```

### Git & Branching

```bash
# Create feature branch from todo
make branch-create TODO=001

# Show branch status
make branch-status

# View git log
make logs
```

### Testing

```bash
# Run all tests
make test

# Unit tests only
make test-unit

# Integration tests only
make test-integration

# Coverage report
make test-coverage

# Watch mode
make test-watch
```

### Quality Checks

```bash
# Run all checks (lint, format, typecheck, test)
make check

# Individual checks
make lint
make format
make typecheck
make secretlint
make spellcheck

# Auto-fix
make lint-fix
make format
```

### CI/CD

```bash
# Run CI checks locally (same as GitHub Actions)
make ci

# Quick CI (no tests)
make ci-quick

# Prepare for release
make prepublish
```

### Utilities

```bash
# Project statistics
make stats

# Show dependency tree
make deps

# Update dependencies
make deps-update

# Check outdated packages
make deps-outdated

# Search for TODO comments
make todo-grep

# Clean build artifacts
make clean
```

## 📋 Typical Workflows

### Workflow 1: Start Development

```bash
# Enter sandbox
make claude

# Inside sandbox:
pnpm dev          # Start watch mode
```

### Workflow 2: Implement a Todo

```bash
# 1. Check kanban board
make kanban-status

# 2. Create feature branch
make branch-create TODO=001

# 3. Enter sandbox and implement
make claude

# 4. Inside sandbox:
#    - Write code
#    - Write tests
#    - Run tests: pnpm test

# 5. Exit sandbox (Ctrl+D)

# 6. Move todo to testing
make kanban-move FROM=to-do TO=to-test FILE=001_task.md

# 7. Run full checks
make check

# 8. Commit and push
git add .
git commit -m "feat: implement feature X"
git push
```

### Workflow 3: Before Committing

```bash
# Run quick quality check + auto-fix
make commit-ready

# Review changes
make branch-status

# Commit
git commit -m "feat: your message"
```

### Workflow 4: Testing in Sandbox

```bash
# Run tests inside sandbox
make sandbox-test

# Or enter and test interactively
make claude
# Inside: pnpm test
```

### Workflow 5: CI/CD Simulation

```bash
# Simulate CI pipeline locally
make ci

# Or with docker-compose
docker-compose run --rm via-ci
```

## 🔧 Advanced Usage

### Docker Compose

```bash
# Start development environment
make compose-up

# Stop environment
make compose-down

# View logs
make compose-logs

# Run tests in container
docker-compose run --rm via-test

# Run CI checks in container
docker-compose run --rm via-ci
```

### Custom Sandbox Commands

```bash
# Run specific command in sandbox
make sandbox-exec CMD="pnpm build"

# Build package in sandbox
make sandbox-build-pkg

# Test in sandbox
make sandbox-test
```

### Kanban Management

```bash
# Initialize new kanban board
make kanban-init

# Move todo forward
make kanban-move FROM=to-do TO=in-progress FILE=001_task.md

# Move todo back (e.g., needs revision)
make kanban-move FROM=to-test TO=to-do FILE=001_task.md

# Move to hold-on (needs discussion)
make kanban-move FROM=to-do TO=hold-on FILE=004_task.md
```

## 🎓 Best Practices

### 1. Always Work in Sandbox

```bash
# ✅ Good: Enter sandbox first
make claude
# Then do your work

# ❌ Bad: Run commands directly on host
pnpm test  # Might affect host system
```

### 2. Check Before Committing

```bash
# Always run before commit
make commit-ready

# Or full CI check
make ci
```

### 3. Keep Kanban Updated

```bash
# Check status regularly
make kanban-status

# Move todos as you progress
make kanban-move FROM=to-do TO=in-progress FILE=001_task.md
```

### 4. Use Feature Branches

```bash
# Create branch for each todo
make branch-create TODO=001

# Implement on branch
# Test thoroughly
# Then merge to develop
```

### 5. Review with Analyzer Agent

```bash
# After implementation, move to analyze
make kanban-move FROM=to-test TO=analyze FILE=001_task.md

# Analyzer agent reviews:
# - Code quality
# - Performance
# - Security
# - Integration risks
```

## 🆘 Troubleshooting

### Sandbox Won't Start

```bash
# Rebuild sandbox
make sandbox-clean
make sandbox-build
make claude
```

### Tests Failing

```bash
# Run in sandbox (isolated environment)
make sandbox-test

# Check coverage
make test-coverage

# Run specific test
make sandbox-exec CMD="pnpm test specific.test.ts"
```

### Build Errors

```bash
# Clean and rebuild
make clean
make install
make build
```

### Dependency Issues

```bash
# Check outdated
make deps-outdated

# Update all
make deps-update

# Or fresh install
make clean
make install
```

### Docker Issues

```bash
# Clean docker
make sandbox-clean
docker system prune -a

# Rebuild
make sandbox-build
```

## 📚 Learn More

- Full system design: `.claude/SYSTEM_DESIGN.md`
- Agent documentation: `.claude/agents/*.md`
- Kanban workflow: `.kanban/README.md`
- Todo template: `.kanban/TODO_TEMPLATE.md`

## 💡 Tips

### Keyboard Shortcuts

- `Ctrl+D` - Exit sandbox
- `Ctrl+C` - Stop current process
- `Ctrl+L` - Clear terminal

### Aliases (add to ~/.bashrc or ~/.zshrc)

```bash
alias via-sandbox='make claude'
alias via-test='make test'
alias via-check='make check'
alias via-kanban='make kanban-status'
```

### Git Hooks

The project uses Husky for git hooks:
- Pre-commit: Runs lint-staged (format + lint)
- Commit-msg: Validates conventional commit format

## 🎯 Next Steps

1. **Read the System Design**: `.claude/SYSTEM_DESIGN.md`
2. **Check the Kanban Board**: `make kanban-status`
3. **Pick a Todo**: See `.kanban/to-do/`
4. **Start Coding**: `make claude`

---

**Need help?** Run `make help` to see all available commands.
