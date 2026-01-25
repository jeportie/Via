# Via AI/Human Pair Programming System

> A professional-grade development pipeline combining Agile, DDD, and CI/CD with AI-assisted workflows

## 🎯 System Overview

This system creates a complete development workflow where AI agents and humans collaborate through defined stages, with proper git branching, CI/CD integration, and security isolation.

## 📁 Directory Structure

```
via/
├── .claude/
│   ├── agents/                    # Specialized AI agents
│   │   ├── PLANNER_AGENT.md       # Creates and refines todos
│   │   ├── ARCHITECT_AGENT.md     # Handles hold-on discussions
│   │   ├── IMPLEMENTER_AGENT.md   # Executes todos
│   │   ├── TESTER_AGENT.md        # Validates in to-test
│   │   ├── ANALYZER_AGENT.md      # Reviews in analyze
│   │   ├── RELEASE_AGENT.md       # Manages versioning & merging
│   │   └── ISSUE_SYNC_AGENT.md    # Syncs GitHub issues
│   ├── workflows/                 # Agent workflow configs
│   ├── SYSTEM_DESIGN.md           # This file
│   └── WORKFLOW_GUIDE.md          # User guide
├── .kanban/
│   ├── to-do/                     # Ready for implementation
│   ├── hold-on/                   # Needs human decision
│   ├── in-progress/               # Currently being implemented
│   ├── to-test/                   # Ready for testing
│   ├── analyze/                   # Needs review/refactor
│   ├── done/                      # Completed and merged
│   ├── backlog/                   # Future work
│   ├── groups/                    # Todo grouping metadata
│   ├── TODO_TEMPLATE.md           # Standard template
│   └── README.md                  # Kanban guide
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Main CI pipeline
│       ├── todo-ci.yml            # Per-todo branch CI
│       └── release.yml            # Release automation
└── docker/
    ├── Dockerfile.sandbox         # Isolated AI environment
    └── docker-compose.yml         # Development setup
```

## 🔄 Workflow Stages

### 1. **Backlog** → **To-Do**
- Issues/features collected
- Planner Agent creates structured todos
- User approves todos move to to-do

### 2. **To-Do** → **Hold-On** (Optional)
- Architecture decisions needed
- Unclear requirements
- Risk assessment required
- Architect Agent facilitates human discussion

### 3. **To-Do/Hold-On** → **In-Progress**
- Implementation begins
- Git branch created: `feat/001-feature-name` or `fix/002-bug-name`
- Implementer Agent executes
- CI runs on every push

### 4. **In-Progress** → **To-Test**
- Implementation complete
- All acceptance criteria met
- Tester Agent validates
- Tests written and passing

### 5. **To-Test** → **Analyze**
- Tests pass
- Analyzer Agent reviews:
  - Code quality
  - Performance implications
  - Integration risks
  - Refactoring opportunities
  - DevOps considerations

### 6. **Analyze** → **Done**
- Human approval
- Release Agent:
  - Merges to develop/main
  - Tags version
  - Updates changelog
  - Creates release notes

## 🤖 Specialized Agents

### Planner Agent
**Role**: Todo Creation & Management
**Triggers**:
- User creates backlog item
- GitHub issue created
- Feature request submitted

**Responsibilities**:
- Parse requirements
- Create structured todo.md files
- Assign difficulty levels
- Identify dependencies
- Group related todos
- Suggest implementation approach

**Input**: Raw requirement, issue, or user description
**Output**: Structured todo.md in backlog/

---

### Architect Agent
**Role**: Technical Decision Making
**Triggers**:
- Todo marked as needing architecture discussion
- Conflicting implementation approaches
- Security/performance concerns

**Responsibilities**:
- Present options with pros/cons
- Ask clarifying questions
- Document decisions
- Update CLAUDE.md with new patterns
- Risk assessment

**Input**: Todo with architectural questions
**Output**: Decision document, updated todo

---

### Implementer Agent
**Role**: Code Implementation
**Triggers**:
- Todo moved to in-progress
- User assigns todo to AI

**Responsibilities**:
- Create git branch
- Implement features
- Write tests
- Follow acceptance criteria
- Commit with conventional commits
- Push to remote

**Input**: Todo from to-do/ or hold-on/
**Output**: Implementation on feature branch

---

### Tester Agent
**Role**: Test Validation
**Triggers**:
- Todo moved to to-test/
- Implementation marked complete

**Responsibilities**:
- Run test suite
- Verify acceptance criteria
- Check code coverage
- Run integration tests
- Manual testing checklist
- Report failures

**Input**: Todo in to-test/
**Output**: Test report, pass/fail status

---

### Analyzer Agent
**Role**: Code Review & Quality
**Triggers**:
- Tests pass
- Todo moved to analyze/

**Responsibilities**:
- Code quality review
- Performance analysis
- Security audit
- Refactoring suggestions
- Integration impact
- DevOps considerations
- Documentation review

**Input**: Todo in analyze/
**Output**: Analysis report, approval/revision

---

### Release Agent
**Role**: Version Management & Merging
**Triggers**:
- Todo approved in analyze/
- Release scheduled
- Version bump needed

**Responsibilities**:
- Merge feature branch
- Update version (semantic-release)
- Generate changelog
- Create git tags
- Update documentation
- Move todo to done/

**Input**: Approved todo
**Output**: Merged PR, version tag, changelog

---

### Issue Sync Agent
**Role**: GitHub Integration
**Triggers**:
- Scheduled (hourly/daily)
- Manual sync command
- New GitHub issue created

**Responsibilities**:
- Fetch open GitHub issues
- Create todos from issues
- Link todos to issues
- Update issue status
- Sync labels/milestones

**Input**: GitHub API
**Output**: Synced todos in backlog/

## 🌳 Git Branching Strategy

```
main (production)
  ├── develop (integration)
  │   ├── feat/001-rename-fetchapi
  │   ├── feat/002-user-file-generation
  │   ├── fix/003-linting-issues
  │   └── feat/004-untyped-mode
  └── release/v1.0.0
```

### Branch Naming
- Features: `feat/NNN-short-description`
- Fixes: `fix/NNN-short-description`
- Refactor: `refactor/NNN-short-description`
- Docs: `docs/NNN-short-description`

Where `NNN` is the todo ID (001, 002, etc.)

### Workflow
1. Create branch from `develop`
2. Implement and commit
3. Push and open PR
4. CI runs automatically
5. Review in analyze/
6. Merge to `develop`
7. Periodic release to `main`

## 🏷️ Todo Tagging System

Each todo has metadata tags:

```markdown
---
id: 001
title: Rename FetchApi to Via
type: refactor
difficulty: easy
priority: high
status: in-progress
branch: feat/001-rename-fetchapi
assignee: implementer-agent
tags: [breaking-change, rename, refactor]
dependencies: []
group: core-refactor
github-issue: #123
---
```

## 🔗 Todo Grouping

### Group Types

**1. Feature Groups**
- Multiple related todos
- Single git branch
- Combined PR
- Example: "Authentication System" = [login, logout, password-reset]

**2. Version Groups**
- All todos for v1.0
- Milestone tracking
- Release planning

**3. Domain Groups**
- DDD bounded contexts
- Example: "CLI Domain", "Type System Domain", "API Client Domain"

### Group File Format

```markdown
# .kanban/groups/core-refactor.group.md

## Group: Core Refactor
- **Type**: Feature
- **Branch**: feat/core-refactor
- **Todos**: 001, 002, 003
- **Status**: In Progress
- **Target**: v0.1.0

## Description
Refactor core classes for better naming and consistency.

## Todos
- [x] 001 - Rename FetchApi to Via
- [ ] 002 - Verify user file generation
- [ ] 003 - Fix linting issues

## Git Strategy
All changes merged to single branch, one PR to develop.
```

## 🔄 CI/CD Pipeline

### Per-Todo CI (`.github/workflows/todo-ci.yml`)

Runs on every push to `feat/*`, `fix/*`, etc.

```yaml
- Checkout code
- Install dependencies
- Run linters
- Run type check
- Run tests (affected)
- Run security scan
- Build package
- Report status
```

### Main CI (`.github/workflows/ci.yml`)

Runs on PR to `develop` or `main`:

```yaml
- Full test suite
- Coverage check (>80%)
- Integration tests
- Build verification
- Bundle size check
- Performance benchmarks
```

### Release CI (`.github/workflows/release.yml`)

Runs on merge to `main`:

```yaml
- Build production bundle
- Run full test suite
- Generate changelog
- Bump version (semantic-release)
- Create git tag
- Publish to npm
- Create GitHub release
- Deploy docs
```

## 🐳 Docker Sandbox

### Purpose
Isolate AI execution environment:
- No sudo access
- No access to secrets (.env, credentials)
- Limited to project files
- Network restrictions (optional)
- Resource limits (CPU, memory)

### Dockerfile

```dockerfile
FROM node:20-alpine

# Create non-root user
RUN addgroup -S claude && adduser -S claude -G claude

# Set working directory
WORKDIR /workspace

# Copy project files (no secrets)
COPY --chown=claude:claude . .

# Remove sensitive files
RUN rm -rf .env* .secret* credentials* .ssh .aws .config

# Install dependencies as root
RUN npm install -g pnpm@9.6.0
RUN pnpm install --frozen-lockfile

# Switch to non-root user
USER claude

# Prevent sudo
RUN echo "claude ALL=(ALL) NOPASSWD: /bin/false" >> /etc/sudoers.d/claude

# Expose development port
EXPOSE 3000

CMD ["/bin/sh"]
```

### Usage

```bash
# Build sandbox
docker build -t via-sandbox -f docker/Dockerfile.sandbox .

# Run Claude Code in sandbox
docker run -it \
  --rm \
  --name via-dev \
  -v $(pwd):/workspace \
  -v /workspace/node_modules \
  --read-only \
  --tmpfs /tmp \
  --security-opt=no-new-privileges \
  --cap-drop=ALL \
  via-sandbox

# Inside container: AI only sees /workspace
# No access to host system, secrets, or sudo
```

## 🔒 Security Features

### 1. Secret Protection
- `.env` files in `.gitignore` AND `.dockerignore`
- Secrets removed before AI access
- Environment variable masking

### 2. File System Isolation
- Read-only container
- Writable /tmp only
- No host access outside project

### 3. Network Isolation (Optional)
```bash
docker run --network none ...  # No network access
# Or custom network for API calls only
```

### 4. Resource Limits
```yaml
# docker-compose.yml
services:
  via-sandbox:
    mem_limit: 2g
    cpus: 2
    pids_limit: 100
```

## 🚀 Advanced Features

### 1. Issue Sync

```bash
# Manual sync
pnpm via sync-issues

# Automatic sync (cron)
# Fetches open issues from GitHub
# Creates todos in backlog/
# Links issues to todos
```

**Issue → Todo Mapping**:
- Issue title → Todo title
- Issue body → Todo description
- Issue labels → Todo tags
- Issue milestone → Todo version group
- Issue number → `github-issue` field

### 2. Todo Grouping

```bash
# Create group
pnpm via group create "core-refactor" --todos 001,002,003

# Link todos
pnpm via group add core-refactor 004

# Branch from group
pnpm via group branch core-refactor
# Creates: feat/core-refactor
# Includes: all group todos
```

### 3. Smart Dependencies

Analyzer Agent detects:
- File dependencies (shared files)
- Type dependencies (shared types)
- Test dependencies (shared fixtures)

Auto-suggests grouping related todos.

### 4. Parallel Execution

```bash
# Run multiple implementer agents in parallel
pnpm via implement --parallel 001,002,003

# Each gets own container
# Separate branches
# Merge when all complete
```

### 5. Rollback System

```bash
# If todo fails in analyze/
pnpm via rollback 001

# Actions:
# - Delete branch
# - Revert commits
# - Move todo back to to-do
# - Document failure reason
```

## 📊 Metrics & Monitoring

### Agent Performance
- Time per stage
- Success/failure rate
- Human intervention frequency
- Test pass rate

### Workflow Metrics
- Lead time (backlog → done)
- Cycle time (to-do → done)
- WIP limits
- Throughput

### Quality Metrics
- Code coverage
- Bug escape rate
- Technical debt
- Security vulnerabilities

## 🎓 Best Practices

### 1. Small, Focused Todos
- Max 3 files changed
- Max 200 lines modified
- Single responsibility
- Clear acceptance criteria

### 2. Group When Appropriate
- Related functionality
- Shared context
- Same bounded context (DDD)
- Reduces PR overhead

### 3. Hold-On Early
- Architecture uncertainty → hold-on immediately
- Human input needed → don't guess
- Security concerns → pause for review

### 4. Test First (Optional TDD)
- Write tests in to-do stage
- Implement in in-progress
- Validate in to-test

### 5. Continuous Integration
- Green builds required
- No merge without tests
- Coverage thresholds enforced

## 🔧 Configuration

### `.claude/config.yml`

```yaml
workflow:
  stages:
    - backlog
    - to-do
    - hold-on
    - in-progress
    - to-test
    - analyze
    - done

agents:
  planner:
    enabled: true
    auto-trigger: true
  architect:
    enabled: true
    timeout: 48h  # How long to wait for human
  implementer:
    enabled: true
    max-parallel: 3
  tester:
    enabled: true
    coverage-threshold: 80
  analyzer:
    enabled: true
    auto-approve-simple: false
  release:
    enabled: true
    strategy: semantic-release

git:
  base-branch: develop
  main-branch: main
  branch-prefix:
    feature: feat/
    fix: fix/
    refactor: refactor/
    docs: docs/

ci-cd:
  provider: github-actions
  run-on-push: true
  required-checks:
    - lint
    - typecheck
    - test
    - build

security:
  use-sandbox: true
  secrets-exclude:
    - .env*
    - .secret*
    - credentials*
  network-isolation: false

groups:
  enabled: true
  max-size: 5
  auto-suggest: true

issue-sync:
  enabled: true
  repo: jeportie/via
  schedule: hourly
  auto-create-todos: true
  labels-as-tags: true
```

## 📝 Usage Examples

### Example 1: Simple Feature

```bash
# User creates feature request
$ pnpm via plan "Add query parameter support"

# Planner Agent creates 006_query_parameters.md in backlog/
# User reviews and approves → moves to to-do/

# Start implementation
$ pnpm via implement 006

# Implementer Agent:
# 1. Creates feat/006-query-parameters branch
# 2. Implements feature
# 3. Writes tests
# 4. Commits and pushes
# 5. Moves todo to to-test/

# Tester Agent runs automatically
# Tests pass → moves to analyze/

# Analyzer Agent reviews
# Suggests optimization → updates code
# User approves

# Release Agent:
# 1. Merges to develop
# 2. Deletes branch
# 3. Moves todo to done/
```

### Example 2: Complex Feature with Hold-On

```bash
# User: "Add authentication system"
$ pnpm via plan "Add authentication system"

# Planner Agent creates todo, sees multiple approaches
# Marks as needs-architecture-discussion
# Moves to hold-on/

# Architect Agent:
# Presents 3 options:
# 1. JWT tokens
# 2. Session cookies
# 3. OAuth integration
#
# Asks questions:
# - What's the security requirement?
# - Mobile app support needed?
# - Third-party auth (Google, GitHub)?

# User chooses JWT + refresh tokens

# Architect Agent:
# - Documents decision
# - Updates todo with specific approach
# - Moves to to-do/

# Implementation proceeds...
```

### Example 3: Grouped Todos

```bash
# User has 3 related todos
$ pnpm via group create "type-system-refactor" \
  --todos 007,008,009 \
  --branch feat/type-system-refactor

# Implementer Agent:
# 1. Creates single branch
# 2. Implements all 3 todos
# 3. Single PR to develop
# 4. More efficient than 3 separate PRs

# All todos move through stages together
# Single review in analyze/
# Single merge to develop
```

### Example 4: GitHub Issue Sync

```bash
# New issue created on GitHub: #42 "Fix typo in README"
# Issue Sync Agent (runs hourly):

# 1. Fetches issue #42
# 2. Creates 010_fix_readme_typo.md in backlog/
# 3. Links: github-issue: #42
# 4. Copies labels as tags

# User moves to to-do/
# Implementer Agent implements
# On merge, updates GitHub issue:
#   - Adds comment: "Fixed in PR #123"
#   - Closes issue
#   - Links commit SHA
```

## 🎯 Success Metrics

This system is successful when:

1. **Velocity**: 80%+ of simple todos complete without human intervention
2. **Quality**: <5% bugs escape to production
3. **Transparency**: Full audit trail from idea to deployment
4. **Collaboration**: Human and AI work seamlessly
5. **Safety**: Zero security incidents from AI actions
6. **Efficiency**: Lead time <24h for simple features

## 🚧 Future Enhancements

- AI pair programming (human types, AI suggests)
- Voice interface for todo creation
- Automatic code review comments
- Performance regression detection
- Smart conflict resolution
- Multi-repo support
- Plugin system for custom agents

---

**Version**: 1.0.0
**Last Updated**: 2026-01-23
**Maintained By**: Via Development Team
