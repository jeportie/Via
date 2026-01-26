# Kanban System

This folder contains the project's kanban board for tracking tasks and features.

## Structure

```
.kanban/
├── to-do/       # Tasks ready to be worked on
├── to-test/     # Tasks implemented and ready for testing
├── hold-on/     # Tasks blocked or on hold
├── done/        # Completed tasks
└── analyze/     # Tasks requiring analysis or investigation
```

## Workflow

1. **Create a request**: Add a `001_request.md` file in `to-do/` with a single task or feature
2. **Work on it**: Move to appropriate folder as work progresses
3. **Test**: Move to `to-test/` when implementation is complete
4. **Complete**: Move to `done/` when fully tested and verified
5. **Block**: Move to `hold-on/` if blocked by dependencies or issues
6. **Investigate**: Move to `analyze/` if the task requires research or analysis before implementation

## Request File Format

Each request file should follow this format:

```markdown
# Request 001: [Brief Title]

## Description

Clear description of the task or feature to implement.

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Context

Any relevant context, links to related issues, or background information.

## Notes

Additional notes, considerations, or constraints.
```

## Rules

- **One task per file**: Each request file should contain exactly one task or feature
- **Sequential naming**: Use `001_request.md`, `002_request.md`, etc. (leading zeros for proper sorting)
- **Move, don't copy**: When changing status, move the file between folders
- **Keep history**: Completed tasks remain in `done/` for reference
