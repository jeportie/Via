# Via Development Makefile
# Professional AI/Human pair programming system
# Usage: make <command>

.PHONY: help
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

##@ General

help: ## Display this help message
	@awk 'BEGIN {FS = ":.*##"; printf "\n$(BLUE)Usage:$(NC)\n  make $(GREEN)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Docker Sandbox

sandbox-build: ## Build the Docker sandbox image
	@echo "$(BLUE)Building Docker sandbox...$(NC)"
	@docker build -t via-sandbox -f docker/Dockerfile.sandbox .
	@echo "$(GREEN)✓ Sandbox built successfully$(NC)"

sandbox: sandbox-build ## Build and enter the Docker sandbox (alias: claude)
	@echo "$(BLUE)Entering Claude Code sandbox...$(NC)"
	@docker run -it --rm \
		--name via-sandbox \
		-v $(PWD):/workspace \
		-v /workspace/node_modules \
		-w /workspace \
		--security-opt=no-new-privileges \
		--cap-drop=ALL \
		via-sandbox /bin/sh

claude: sandbox ## Enter the Claude Code sandbox (main command)

sandbox-shell: sandbox-build ## Enter sandbox with bash (if available)
	@docker run -it --rm \
		--name via-sandbox \
		-v $(PWD):/workspace \
		-v /workspace/node_modules \
		-w /workspace \
		via-sandbox /bin/bash || make sandbox

sandbox-secure: sandbox-build ## Enter sandbox with network isolation and read-only FS
	@echo "$(YELLOW)Entering secure sandbox (read-only, no network)...$(NC)"
	@docker run -it --rm \
		--name via-sandbox-secure \
		-v $(PWD):/workspace:ro \
		-v /workspace/node_modules \
		--tmpfs /tmp \
		--read-only \
		--network none \
		--security-opt=no-new-privileges \
		--cap-drop=ALL \
		via-sandbox /bin/sh

sandbox-clean: ## Remove sandbox Docker image
	@echo "$(YELLOW)Removing sandbox image...$(NC)"
	@docker rmi via-sandbox 2>/dev/null || echo "$(YELLOW)No sandbox image to remove$(NC)"

##@ Development

install: ## Install dependencies with pnpm
	@echo "$(BLUE)Installing dependencies...$(NC)"
	@pnpm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

dev: ## Start development mode (watch tests)
	@echo "$(BLUE)Starting development mode...$(NC)"
	@pnpm dev

build: ## Build the project (CJS + ESM)
	@echo "$(BLUE)Building project...$(NC)"
	@pnpm build
	@echo "$(GREEN)✓ Build complete$(NC)"

clean: ## Clean build artifacts and node_modules
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	@rm -rf dist coverage node_modules .eslintcache
	@echo "$(GREEN)✓ Cleaned$(NC)"

##@ Testing

test: ## Run all tests
	@echo "$(BLUE)Running tests...$(NC)"
	@pnpm test

test-unit: ## Run unit tests only
	@pnpm test:unit

test-integration: ## Run integration tests only
	@pnpm test:integration

test-coverage: ## Run tests with coverage report
	@pnpm test:coverage
	@echo "$(BLUE)Coverage report: coverage/index.html$(NC)"

test-watch: ## Run tests in watch mode
	@pnpm dev

##@ Quality Checks

check: ## Run all quality checks (format, lint, typecheck, test)
	@echo "$(BLUE)Running all quality checks...$(NC)"
	@pnpm check

lint: ## Run ESLint
	@pnpm lint

lint-fix: ## Run ESLint and auto-fix issues
	@pnpm lint --fix

format: ## Format code with Prettier
	@pnpm format

format-check: ## Check code formatting without changes
	@pnpm format --check

typecheck: ## Run TypeScript type checking
	@pnpm typecheck

secretlint: ## Check for leaked secrets
	@pnpm secretlint

spellcheck: ## Run spell checker
	@pnpm spellcheck

##@ Kanban Workflow

kanban-status: ## Show current kanban board status
	@echo "$(BLUE)Kanban Board Status$(NC)"
	@echo ""
	@echo "$(YELLOW)To-Do:$(NC)"
	@ls -1 .kanban/to-do/*.md 2>/dev/null | wc -l | xargs -I {} echo "  {} tasks"
	@echo "$(YELLOW)Hold-On:$(NC)"
	@ls -1 .kanban/hold-on/*.md 2>/dev/null | wc -l | xargs -I {} echo "  {} tasks"
	@echo "$(YELLOW)In-Progress:$(NC)"
	@ls -1 .kanban/in-progress/*.md 2>/dev/null | wc -l | xargs -I {} echo "  {} tasks"
	@echo "$(YELLOW)To-Test:$(NC)"
	@ls -1 .kanban/to-test/*.md 2>/dev/null | wc -l | xargs -I {} echo "  {} tasks"
	@echo "$(YELLOW)Analyze:$(NC)"
	@ls -1 .kanban/analyze/*.md 2>/dev/null | wc -l | xargs -I {} echo "  {} tasks"
	@echo "$(GREEN)Done:$(NC)"
	@ls -1 .kanban/done/*.md 2>/dev/null | wc -l | xargs -I {} echo "  {} tasks"

kanban-list: ## List all todos with details
	@echo "$(BLUE)=== To-Do ===$(NC)"
	@ls .kanban/to-do/*.md 2>/dev/null | xargs -I {} basename {} || echo "  (empty)"
	@echo ""
	@echo "$(YELLOW)=== Hold-On ===$(NC)"
	@ls .kanban/hold-on/*.md 2>/dev/null | xargs -I {} basename {} || echo "  (empty)"
	@echo ""
	@echo "$(BLUE)=== In-Progress ===$(NC)"
	@ls .kanban/in-progress/*.md 2>/dev/null | xargs -I {} basename {} || echo "  (empty)"
	@echo ""
	@echo "$(BLUE)=== To-Test ===$(NC)"
	@ls .kanban/to-test/*.md 2>/dev/null | xargs -I {} basename {} || echo "  (empty)"
	@echo ""
	@echo "$(YELLOW)=== Analyze ===$(NC)"
	@ls .kanban/analyze/*.md 2>/dev/null | xargs -I {} basename {} || echo "  (empty)"
	@echo ""
	@echo "$(GREEN)=== Done ===$(NC)"
	@ls .kanban/done/*.md 2>/dev/null | xargs -I {} basename {} || echo "  (empty)"

kanban-init: ## Initialize kanban directories
	@echo "$(BLUE)Initializing kanban structure...$(NC)"
	@mkdir -p .kanban/{backlog,to-do,hold-on,in-progress,to-test,analyze,done,groups}
	@echo "$(GREEN)✓ Kanban structure initialized$(NC)"

kanban-move: ## Move todo between stages (usage: make kanban-move FROM=to-do TO=in-progress FILE=001_task.md)
	@if [ -z "$(FROM)" ] || [ -z "$(TO)" ] || [ -z "$(FILE)" ]; then \
		echo "$(RED)Error: Missing parameters$(NC)"; \
		echo "Usage: make kanban-move FROM=to-do TO=in-progress FILE=001_task.md"; \
		exit 1; \
	fi
	@mv .kanban/$(FROM)/$(FILE) .kanban/$(TO)/$(FILE)
	@echo "$(GREEN)✓ Moved $(FILE) from $(FROM) to $(TO)$(NC)"

##@ Git & Branching

branch-create: ## Create feature branch (usage: make branch-create TODO=001)
	@if [ -z "$(TODO)" ]; then \
		echo "$(RED)Error: TODO number required$(NC)"; \
		echo "Usage: make branch-create TODO=001"; \
		exit 1; \
	fi
	@TITLE=$$(grep "^# " .kanban/to-do/$(TODO)_*.md | head -1 | sed 's/# [0-9]* - //g' | tr '[:upper:]' '[:lower:]' | tr ' ' '-'); \
	BRANCH="feat/$(TODO)-$$TITLE"; \
	git checkout -b $$BRANCH; \
	echo "$(GREEN)✓ Created branch: $$BRANCH$(NC)"

branch-status: ## Show current branch and status
	@echo "$(BLUE)Current Branch:$(NC)"
	@git branch --show-current
	@echo ""
	@git status -s

##@ CI/CD

ci: ## Run CI checks locally (same as GitHub Actions)
	@echo "$(BLUE)Running CI checks...$(NC)"
	@make format-check
	@make lint
	@make typecheck
	@make secretlint
	@make spellcheck
	@make test
	@make build
	@echo "$(GREEN)✓ All CI checks passed$(NC)"

ci-quick: ## Run quick CI checks (no tests)
	@echo "$(BLUE)Running quick CI checks...$(NC)"
	@make format-check
	@make lint
	@make typecheck
	@echo "$(GREEN)✓ Quick checks passed$(NC)"

validate: ## Validate package exports
	@pnpm validate

##@ Release & Versioning

changelog: ## Generate changelog (semantic-release)
	@echo "$(BLUE)Generating changelog...$(NC)"
	@npx semantic-release --dry-run

version-check: ## Check current version
	@echo "$(BLUE)Current version:$(NC)"
	@node -p "require('./package.json').version"

prepublish: ## Prepare for npm publish
	@echo "$(BLUE)Preparing for publish...$(NC)"
	@make clean
	@make install
	@make build
	@make test
	@echo "$(GREEN)✓ Ready for publish$(NC)"

##@ CLI Testing

cli-test: ## Test the Via CLI locally
	@echo "$(BLUE)Testing Via CLI...$(NC)"
	@pnpm build
	@node dist/mjs/cli/index.js

cli-test-sandbox: ## Test CLI in sandbox
	@echo "$(BLUE)Testing CLI in sandbox...$(NC)"
	@docker run -it --rm \
		-v $(PWD):/workspace \
		-w /workspace \
		via-sandbox \
		sh -c "node dist/mjs/cli/index.js"

##@ Utilities

logs: ## Show git log (pretty format)
	@git log --oneline --graph --decorate --all -20

stats: ## Show project statistics
	@echo "$(BLUE)Project Statistics$(NC)"
	@echo ""
	@echo "$(YELLOW)Files:$(NC)"
	@find src -name "*.ts" | wc -l | xargs -I {} echo "  TypeScript: {}"
	@find __tests__ -name "*.ts" | wc -l | xargs -I {} echo "  Tests: {}"
	@echo ""
	@echo "$(YELLOW)Lines of Code:$(NC)"
	@find src -name "*.ts" -exec cat {} \; | wc -l | xargs -I {} echo "  Source: {}"
	@find __tests__ -name "*.ts" -exec cat {} \; | wc -l | xargs -I {} echo "  Tests: {}"
	@echo ""
	@echo "$(YELLOW)Todos:$(NC)"
	@find .kanban -name "*.md" | wc -l | xargs -I {} echo "  Total: {}"

deps: ## Show dependency tree
	@pnpm list --depth=1

deps-update: ## Update dependencies
	@echo "$(YELLOW)Updating dependencies...$(NC)"
	@pnpm update
	@echo "$(GREEN)✓ Dependencies updated$(NC)"

deps-outdated: ## Check for outdated dependencies
	@pnpm outdated

todo-grep: ## Search for TODO comments in code
	@echo "$(BLUE)Searching for TODO comments...$(NC)"
	@grep -rn "TODO\|FIXME\|XXX\|HACK" src/ --color=always || echo "$(GREEN)No TODOs found$(NC)"

##@ Documentation

docs-serve: ## Serve documentation locally (if available)
	@echo "$(BLUE)Serving documentation...$(NC)"
	@echo "$(YELLOW)Not implemented yet$(NC)"

readme: ## Open README in default browser
	@open README.md || xdg-open README.md || echo "Please open README.md manually"

##@ Docker Compose

compose-up: ## Start development environment with docker-compose
	@docker-compose up -d

compose-down: ## Stop development environment
	@docker-compose down

compose-logs: ## Show docker-compose logs
	@docker-compose logs -f

##@ Advanced

sandbox-exec: ## Execute command in sandbox (usage: make sandbox-exec CMD="pnpm test")
	@if [ -z "$(CMD)" ]; then \
		echo "$(RED)Error: CMD required$(NC)"; \
		echo "Usage: make sandbox-exec CMD=\"pnpm test\""; \
		exit 1; \
	fi
	@docker run --rm \
		-v $(PWD):/workspace \
		-w /workspace \
		via-sandbox \
		sh -c "$(CMD)"

sandbox-test: ## Run tests inside sandbox
	@make sandbox-exec CMD="pnpm test"

sandbox-build-pkg: ## Build package inside sandbox
	@make sandbox-exec CMD="pnpm build"

env-check: ## Check development environment
	@echo "$(BLUE)Environment Check$(NC)"
	@echo ""
	@echo "$(YELLOW)Node.js:$(NC)"
	@node --version || echo "$(RED)Not installed$(NC)"
	@echo "$(YELLOW)pnpm:$(NC)"
	@pnpm --version || echo "$(RED)Not installed$(NC)"
	@echo "$(YELLOW)Docker:$(NC)"
	@docker --version || echo "$(RED)Not installed$(NC)"
	@echo "$(YELLOW)Git:$(NC)"
	@git --version || echo "$(RED)Not installed$(NC)"
	@echo ""
	@echo "$(GREEN)✓ Environment check complete$(NC)"

setup: ## Initial project setup
	@echo "$(BLUE)Setting up Via development environment...$(NC)"
	@make install
	@make kanban-init
	@make sandbox-build
	@echo ""
	@echo "$(GREEN)✓ Setup complete!$(NC)"
	@echo ""
	@echo "$(BLUE)Next steps:$(NC)"
	@echo "  1. Run $(GREEN)make claude$(NC) to enter the sandbox"
	@echo "  2. Run $(GREEN)make dev$(NC) to start development mode"
	@echo "  3. Run $(GREEN)make kanban-status$(NC) to see todo board"

##@ Quick Commands

quick-check: ## Quick quality check before commit
	@make format
	@make lint-fix
	@make typecheck
	@make test-unit

commit-ready: ## Prepare for commit (format, lint, test)
	@make quick-check
	@echo "$(GREEN)✓ Ready to commit$(NC)"

start: dev ## Start development (alias for dev)

all: clean install build test ## Clean, install, build, and test
