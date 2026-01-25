# Todo Template Format

This document defines the standard format for all todo files in the `.kanban/to-do/` folder.

## File Naming Convention

Use incremental numbering with leading zeros:
- `001_todo_name.md`
- `002_todo_name.md`
- `003_todo_name.md`
- etc.

## Template Structure

Each todo file MUST contain the following sections:

```markdown
# [TODO ID] - [Title]

## 📋 Description

[Clear, detailed description of what needs to be done. Include context, requirements, and acceptance criteria.]

## 🎯 Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## 🧪 How to Test

### Human Testing
[Step-by-step instructions for manual testing]

### AI Testing
[Instructions for automated testing or verification]

## ✅ When to Validate

[Clear conditions that indicate the todo is complete and ready to be moved to `to-test/` or `done/`]

## 🛠️ How to Implement

### Implementation Approach
[High-level approach to solving the problem. Describe the strategy, files to modify, and key decisions.]

### Difficulty
[Easy / Medium / Hard]

### Key Files Involved
- `path/to/file1.ts` - What changes are needed
- `path/to/file2.ts` - What changes are needed

### Attention Points
[Important considerations, edge cases, potential pitfalls, or areas requiring extra care]

### Implementation Steps
1. Step 1
2. Step 2
3. Step 3

## 📚 Context & References

[Links to related issues, documentation, or discussions]

## 🔗 Dependencies

[List any todos that must be completed before this one, or related work]
```

## Rules

1. **One task per file** - Each todo should be focused on a single feature or fix
2. **Sequential naming** - Use leading zeros for proper sorting (001, 002, etc.)
3. **Complete sections** - All template sections must be filled in
4. **Move, don't copy** - When a todo progresses, move the file between folders
5. **Update status** - Check off acceptance criteria as work progresses
6. **Clear validation** - "When to Validate" should be unambiguous

## Example

See `001_example_todo.md` for a complete example following this template.
