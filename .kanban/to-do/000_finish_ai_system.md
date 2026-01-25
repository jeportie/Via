# 000 - Finish AI System Setup

## 📋 Description

Complete and validate the AI/Human pair programming system that was designed and implemented. This includes testing all components, creating missing agent specifications, setting up GitHub workflows, and ensuring everything works together seamlessly.

The system includes:
- Docker sandbox for secure AI environment
- Makefile with 50+ commands
- Kanban workflow (7 stages)
- Specialized AI agents (7 types)
- Git integration and branching strategy
- CI/CD pipelines
- Security isolation

This todo validates that the entire infrastructure is production-ready before starting feature implementation.

## 🎯 Acceptance Criteria

### Documentation & Templates
- [ ] All agent specifications created (6 missing)
- [ ] CLAUDE.md updated with system info
- [ ] Quick Start guide works end-to-end
- [ ] Todo template is not too long (< 500 lines)
- [ ] System design is clear and scannable

### Docker Sandbox
- [ ] Sandbox builds successfully
- [ ] Can enter sandbox with `make claude`
- [ ] Sandbox has no sudo access
- [ ] Secrets are properly excluded
- [ ] Network isolation works
- [ ] Read-only mode works
- [ ] Resource limits are enforced

### Makefile Commands
- [ ] All 50+ commands execute without errors
- [ ] `make help` displays correctly
- [ ] `make setup` works on fresh clone
- [ ] `make kanban-status` works
- [ ] `make branch-create` works
- [ ] Command descriptions are accurate

### Kanban Workflow
- [ ] All directories exist and are accessible
- [ ] Todo template is complete
- [ ] Can move todos between stages
- [ ] Naming convention works (001, 002, etc.)
- [ ] Grouping structure is documented

### Git Integration
- [ ] Branch naming follows convention
- [ ] Conventional commits work
- [ ] Hooks are properly installed
- [ ] Can create branches from todos

### CI/CD
- [ ] GitHub workflow files created
- [ ] CI runs on push
- [ ] Todo-specific CI works
- [ ] Release automation configured
- [ ] Local CI simulation works (`make ci`)

### Security
- [ ] `.dockerignore` excludes secrets
- [ ] Container runs as non-root
- [ ] No sudo in sandbox
- [ ] Secrets removed from container
- [ ] Security audit passes

### Testing & Validation
- [ ] Sandbox commands tested
- [ ] Makefile commands tested
- [ ] Workflow tested end-to-end
- [ ] Agent instructions tested
- [ ] Documentation reviewed

## 🧪 How to Test

### Human Testing

**1. Fresh Clone Test**
```bash
# Simulate new developer
cd /tmp
git clone https://github.com/jeportie/via.git via-test
cd via-test

# Run setup
make setup

# Verify success
make env-check
make kanban-status
```

**2. Sandbox Test**
```bash
# Enter sandbox
make claude

# Inside sandbox, verify:
whoami  # Should be "claude", not "root"
sudo ls  # Should fail
ls ~/.ssh  # Should not exist
pnpm test  # Should work

# Exit
exit
```

**3. Makefile Test**
```bash
# Test each category
make help           # Should display all commands
make stats          # Should show project stats
make kanban-status  # Should show board
make lint           # Should run without error
make typecheck      # Should pass
```

**4. Workflow Test**
```bash
# Create and move a test todo
touch .kanban/to-do/999_test.md
make kanban-list    # Should show 999_test.md

# Move it
make kanban-move FROM=to-do TO=in-progress FILE=999_test.md
make kanban-list    # Should show in in-progress

# Clean up
rm .kanban/in-progress/999_test.md
```

**5. Git Integration Test**
```bash
# Create branch from todo
make branch-create TODO=001

# Verify branch created
git branch --show-current
# Should be: feat/001-rename-fetchapi-to-via

# Clean up
git checkout main
git branch -D feat/001-rename-fetchapi-to-via
```

**6. Security Test**
```bash
# Verify secrets excluded
docker build -t via-sandbox-test -f docker/Dockerfile.sandbox .
docker run --rm via-sandbox-test sh -c "ls ~/.ssh 2>&1"
# Should fail or show directory doesn't exist

docker run --rm via-sandbox-test sh -c "ls .env* 2>&1"
# Should fail or show no .env files

# Clean up
docker rmi via-sandbox-test
```

**7. CI Simulation Test**
```bash
# Run full CI locally
make ci

# Should run:
# - format check
# - lint
# - typecheck
# - secretlint
# - spellcheck
# - test
# - build

# All should pass
```

### AI Testing

```bash
# Automated test suite
#!/bin/bash

echo "Testing AI System..."

# Test 1: Makefile exists and help works
if make help > /dev/null 2>&1; then
    echo "✓ Makefile help works"
else
    echo "✗ Makefile help failed"
    exit 1
fi

# Test 2: Kanban directories exist
for dir in backlog to-do hold-on in-progress to-test analyze done groups; do
    if [ -d ".kanban/$dir" ]; then
        echo "✓ .kanban/$dir exists"
    else
        echo "✗ .kanban/$dir missing"
        exit 1
    fi
done

# Test 3: Docker sandbox builds
if docker build -t via-sandbox-test -f docker/Dockerfile.sandbox . > /dev/null 2>&1; then
    echo "✓ Docker sandbox builds"
    docker rmi via-sandbox-test > /dev/null 2>&1
else
    echo "✗ Docker sandbox build failed"
    exit 1
fi

# Test 4: Agent files exist
for agent in EINSTEIN_AGENT REFACTOR_AGENT TESTER_AGENT; do
    if [ -f ".claude/agents/$agent.md" ]; then
        echo "✓ $agent exists"
    else
        echo "✗ $agent missing"
    fi
done

# Test 5: Documentation exists
for doc in SYSTEM_DESIGN QUICK_START IMPLEMENTATION_SUMMARY; do
    if [ -f ".claude/$doc.md" ]; then
        echo "✓ $doc exists"
    else
        echo "✗ $doc missing"
        exit 1
    fi
done

# Test 6: Todo template exists
if [ -f ".kanban/TODO_TEMPLATE.md" ]; then
    echo "✓ Todo template exists"
else
    echo "✗ Todo template missing"
    exit 1
fi

# Test 7: Current todos count
TODO_COUNT=$(ls .kanban/to-do/*.md 2>/dev/null | wc -l)
echo "✓ $TODO_COUNT todos in to-do/"

echo ""
echo "All tests passed!"
```

## ✅ When to Validate

Complete when:
1. All acceptance criteria are checked
2. Fresh clone test succeeds
3. Sandbox works and is secure
4. All Makefile commands work
5. Documentation is complete and clear
6. Workflow can be executed end-to-end
7. CI/CD pipelines are configured
8. Security audit passes
9. At least one human has reviewed the system
10. System is ready for feature development (todos 001-005)

## 🛠️ How to Implement

### Implementation Approach

This is a **validation and completion** todo. Most of the system is already built, but we need to:
1. Create missing agent specifications
2. Test everything thoroughly
3. Fix any issues found
4. Create GitHub workflow files
5. Document any gaps
6. Ensure instructions are not overwhelming

This is the foundation for all future work, so it must be rock-solid.

### Difficulty
**Medium-Hard** - Requires thorough testing and attention to detail

### Key Files Involved

**To Create:**
- `.claude/agents/PLANNER_AGENT.md` - Planner agent specification
- `.claude/agents/ARCHITECT_AGENT.md` - Architect agent specification
- `.claude/agents/IMPLEMENTER_AGENT.md` - Implementer agent specification
- `.claude/agents/ANALYZER_AGENT.md` - Analyzer agent specification (or update REFACTOR_AGENT.md)
- `.claude/agents/RELEASE_AGENT.md` - Release agent specification
- `.claude/agents/ISSUE_SYNC_AGENT.md` - Issue sync agent specification
- `.github/workflows/ci.yml` - Main CI pipeline
- `.github/workflows/todo-ci.yml` - Per-todo CI
- `.github/workflows/release.yml` - Release automation
- `.kanban/README.md` - Kanban workflow guide

**To Test:**
- `Makefile` - All 50+ commands
- `docker/Dockerfile.sandbox` - Sandbox build and security
- `docker-compose.yml` - All services
- `.dockerignore` - Secret exclusion
- `.claude/SYSTEM_DESIGN.md` - Completeness
- `.claude/QUICK_START.md` - Accuracy
- `.kanban/TODO_TEMPLATE.md` - Length and clarity

**To Update:**
- ✅ `CLAUDE.md` - Already updated with system info
- `README.md` - May need Makefile commands added
- `.claude/IMPLEMENTATION_SUMMARY.md` - Update with findings

### Attention Points

1. **Documentation Length**: Agent instructions and todo templates should be concise
   - Aim for <300 lines per agent
   - Use clear, scannable formatting
   - Include examples
   - Link to detailed docs rather than repeating

2. **Security Validation**: Critical for production use
   - Test with actual secrets in .env
   - Verify they don't appear in container
   - Test sudo denial
   - Verify non-root user
   - Check filesystem permissions

3. **Makefile Cross-Platform**: May not work on Windows
   - Test on macOS (primary)
   - Test on Linux (CI)
   - Document Windows alternatives (WSL2)

4. **Docker Requirements**: Users need Docker installed
   - Document in README
   - Add to prerequisites
   - Provide installation links

5. **Instruction Overload**: Too many docs can overwhelm
   - Prioritize Quick Start
   - Link to detailed docs
   - Use progressive disclosure
   - Clear navigation

6. **Agent Instructions**: Claude Code has token limits
   - Keep agent specs focused
   - Use clear triggers
   - Avoid repetition
   - Test with actual Claude Code CLI

7. **GitHub Workflows**: Need proper permissions
   - GITHUB_TOKEN scope
   - Write access to repo
   - npm publish token (for release)
   - Codecov token (optional)

### Implementation Steps

#### Phase 1: Create Missing Agents (Priority: High)

1. **Create Planner Agent** (`.claude/agents/PLANNER_AGENT.md`):
   ```markdown
   # Planner Agent

   ## Role
   Creates structured todos from requirements

   ## Triggers
   - User requests "create todo"
   - GitHub issue needs todo
   - Feature request submitted

   ## Responsibilities
   - Parse requirements
   - Create todo.md file
   - Assign difficulty
   - Identify dependencies
   - Use TODO_TEMPLATE.md format

   ## Process
   1. Read requirement
   2. Ask clarifying questions if needed
   3. Create todo using template
   4. Save to .kanban/backlog/
   5. Get user approval to move to to-do/
   ```

2. **Create Architect Agent** (`.claude/agents/ARCHITECT_AGENT.md`):
   - Use EINSTEIN_AGENT as base
   - Focus on architecture discussions
   - Present multiple options
   - Document decisions

3. **Create Implementer Agent** (`.claude/agents/IMPLEMENTER_AGENT.md`):
   - Executes todos from to-do/
   - Creates git branches
   - Writes code and tests
   - Follows acceptance criteria

4. **Create Analyzer Agent** (`.claude/agents/ANALYZER_AGENT.md`):
   - Use REFACTOR_AGENT as base
   - Add security audit
   - Add performance review
   - Add DevOps considerations

5. **Create Release Agent** (`.claude/agents/RELEASE_AGENT.md`):
   - Version management
   - Changelog generation
   - Merge to main
   - Create releases

6. **Create Issue Sync Agent** (`.claude/agents/ISSUE_SYNC_AGENT.md`):
   - GitHub API integration
   - Issue → Todo mapping
   - Status synchronization

#### Phase 2: Test Infrastructure (Priority: High)

1. **Test Docker Sandbox**:
   ```bash
   # Build
   make sandbox-build

   # Test entry
   make claude
   # Inside: verify environment

   # Test secure mode
   make sandbox-secure

   # Test command execution
   make sandbox-exec CMD="pnpm --version"
   ```

2. **Test Makefile Commands**:
   ```bash
   # Test each category
   make help
   make stats
   make kanban-status
   make kanban-list
   make env-check
   make branch-create TODO=001  # Then delete branch
   make ci-quick
   ```

3. **Test Security**:
   ```bash
   # Create test secret
   echo "SECRET_KEY=test123" > .env.test

   # Build sandbox
   make sandbox-build

   # Verify secret not in container
   make sandbox-exec CMD="cat .env.test"
   # Should fail

   # Clean up
   rm .env.test
   ```

#### Phase 3: Create GitHub Workflows (Priority: Medium)

1. **Create `.github/workflows/ci.yml`**:
   ```yaml
   name: CI
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       strategy:
         matrix:
           node-version: [18, 20, 22]
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
           with:
             version: 9.6.0
         - uses: actions/setup-node@v4
           with:
             node-version: ${{ matrix.node-version }}
         - run: pnpm install
         - run: pnpm check
         - run: pnpm build
   ```

2. **Create `.github/workflows/todo-ci.yml`**:
   - Runs on feature branches
   - Lighter checks
   - Faster feedback

3. **Create `.github/workflows/release.yml`**:
   - Runs on main branch
   - semantic-release
   - npm publish

#### Phase 4: Documentation Review (Priority: Medium)

1. **Review SYSTEM_DESIGN.md**:
   - Check for clarity
   - Ensure examples work
   - Verify links
   - Check length (~500 lines OK)

2. **Review QUICK_START.md**:
   - Test all commands
   - Verify workflows
   - Check for errors
   - Ensure 5-minute onboarding

3. **Review TODO_TEMPLATE.md**:
   - Check length (currently OK)
   - Ensure not overwhelming
   - Verify all sections needed
   - Get user feedback

4. **Update README.md**:
   - Add Makefile commands section
   - Link to Quick Start
   - Add Docker requirements

#### Phase 5: End-to-End Test (Priority: High)

1. **Fresh Clone Test**:
   ```bash
   cd /tmp
   git clone <repo> via-fresh
   cd via-fresh
   make setup
   make claude
   # Test workflow
   ```

2. **Complete Workflow Test**:
   ```bash
   # Start with todo
   make kanban-status

   # Create branch
   make branch-create TODO=001

   # Enter sandbox
   make claude
   # Implement something

   # Exit and move todo
   make kanban-move FROM=to-do TO=to-test FILE=001_...md

   # Run tests
   make test

   # Move to analyze
   make kanban-move FROM=to-test TO=analyze FILE=001_...md
   ```

3. **CI Simulation**:
   ```bash
   make ci
   # Should complete without errors
   ```

#### Phase 6: Refinement (Priority: Low)

1. **Check instruction length**:
   - Agent specs: <300 lines each
   - Todo template: <500 lines
   - Quick Start: <400 lines
   - System Design: Can be long (reference doc)

2. **Simplify where possible**:
   - Remove redundancy
   - Add clear navigation
   - Use progressive disclosure
   - Link rather than repeat

3. **Get feedback**:
   - User tests system
   - Notes confusion points
   - Suggests improvements
   - Approves for use

## 📚 Context & References

- System Design: `.claude/SYSTEM_DESIGN.md`
- Quick Start: `.claude/QUICK_START.md`
- Implementation Summary: `.claude/IMPLEMENTATION_SUMMARY.md`
- Existing agents: `.claude/agents/`
- Makefile: Root `Makefile`
- Docker config: `docker/Dockerfile.sandbox`, `docker-compose.yml`

## 🔗 Dependencies

None - This is the foundation. All other todos (001-005) depend on this.

## 📝 Notes

**Why Priority 000?**
This todo is numbered 000 to indicate it's foundational infrastructure that must be completed before starting feature development (001+).

**Estimated Time:**
- Agent creation: 2-3 hours
- Testing: 2-3 hours
- GitHub workflows: 1-2 hours
- Documentation review: 1 hour
- Refinement: 1-2 hours
- **Total: 7-11 hours**

**Can be split into sub-todos if needed:**
- 000a: Create missing agents
- 000b: Test infrastructure
- 000c: Create GitHub workflows
- 000d: Documentation review
- 000e: End-to-end validation

**Success Indicator:**
When a new developer can run `make setup && make claude` and have a working environment in 5 minutes.
