# Project Planning: Minimal Git Automation Setup

This is the main file to keep track of the changes in this repository throughout the entire development cycle. It focuses on key Git hooks and their integration to ensure a clean and automated workflow.

## Phase 1: Initialize Repository

- [x] Initialize Git repository locally.
- [x] Prepare initial `README.md` with project goals and setup instructions.
- [x] Set up standard `.gitignore`.
- [x] Create basic project structure (folders, placeholder files).

## Phase 2: Basic Hook Management Setup

- [x] Create `hooks-templates/` directory for hook templates.
- [x] Write minimal `pre-commit`, `pre-push`, and `commit-msg` hooks into `hooks-templates/`.
- [x] Write `install-git-hooks.sh` script:
  - [x] Detect `.git/` presence.
  - [x] Copy templates into `.git/hooks/`.
  - [x] Set executable permissions.
- [x] Make `install-git-hooks.sh` idempotent (safe to re-run anytime).

## Phase 3: Automation Integration

- [x] Add a `prepare` script into `package.json`:

```json
"scripts": {
  "prepare": "bash install-git-hooks.sh"
}
```

- [x] (Optional) Create a `Makefile` with:

```makefile
install-hooks:
    bash install-git-hooks.sh
```

- [ ] Add automated detection of hook installation success (future enhancement).

## Phase 4: Repository Clean State Validation

- [ ] After running setup scripts:
  - [ ] Verify `.git/hooks/` contains correct executable hooks.
  - [ ] Verify no unintended files (`--version/`, broken folders).
  - [ ] Verify no staged changes (`git status` clean).
- [ ] Perform manual dry-run test:
  - [ ] Try committing on `main` branch → must be **blocked**.
  - [ ] Try committing on feature branch → must **succeed**.

## Phase 5: Version Control Commit

- [ ] Create initial clean commit on `main` branch.
- [ ] Push `main` branch to GitHub.
- [ ] Configure branch protection rules (block direct pushes to `main`).
- [ ] Create and push first feature branch (`setup-hooks`, `automation-v1`, etc).

## Phase 6: Advanced Automation (Optional Enhancements)

- [ ] Build a dry-run validation script:
  - [ ] Check if all required hooks are installed.
  - [ ] Check hook permissions.
  - [ ] Print success/failure report.
- [ ] Build auto-hook-repair script if broken (optional future).
- [ ] Add optional `--quiet` mode for install script (for CI pipelines).

## Notes

- Always prefer minimal, explicit automation.
- Every new feature should be built on a clean branch.
- Every automation step must include a verification step immediately after.
- Manual steps should decrease over time as automation improves.
- Avoid adding libraries unless **absolutely necessary** and **clear benefit** exists.

---

## Quick Next Milestones

- [ ] Finalize initial hook install and verification system.
- [ ] Push clean minimal repository to GitHub.
- [ ] Plan next phase: feature enforcement, commit formatting, CI setup (if needed).
