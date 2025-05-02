# Git Automation and Workflow Master Plan

This document defines the high-level project goals, phased planning, idea management system, and clean automation guidelines for Git hook setup and project initialization.

- Every idea is recorded below, even if not immediately implemented.
- Every action must trace back to solving a real documented problem.
- Only promote ideas to tasks when we are ready.

---

## Table of Contents

- [Current Milestone](#current-milestone-secure-main-branch-server-side-protection)
- [High-Level Instructions](#high-level-instructions)
- [Plan Phases](#plan-phases)
- [Ideas Backlog](#ideas-backlog)
- [Quick Milestones](#quick-milestones)

---

## Current Milestone: Secure Main Branch (Server-Side Protection)

### Goal

Protect `main` branch on GitHub at server level.

### Tasks

- [x] Local hooks installed and verified.
- [x] Local tests passing.
- [ ] Set up GitHub Branch Protection Rules.

  **Timeline**:  
  - **Day 1**: Research GitHub branch protection options and document the required rules.  
  - **Day 2**: Configure branch protection rules for the `main` branch on GitHub.  
  - **Day 3**: Test the rules by attempting direct pushes and pull request merges.  

  **Plan**:  
  - Enable "Require pull request reviews before merging."  
  - Set "Require status checks to pass before merging" (optional for now).  
  - Block force pushes and deletions on the `main` branch.  
  - Document the configuration steps in the project README.  
- [ ] Require pull request to merge into `main`.
- [ ] Optionally enforce status checks later (not urgent).
- [ ] Update README to reflect that main is protected by GitHub rules.

---

## High-Level Instructions

- Any new ideas should first be added to the **Ideas Backlog** section.
- Ideas are evaluated based on real pain points, automation value, and clarity.
- Accepted ideas are promoted into the main plan under a specific phase.
- Every step must favor minimalism, automation, and verifiability.

Documentation must include:

- Clear description of the use case/problem.
- Explanation of how the solution helps.
- (Optional) Example of usage or scenario if needed.

Always propose several solutions at different levels of complexity:

- Minimalistic version.
- Moderate version.
- Full feature-rich version.

**Testing First**: Design minimal verification tests before full implementation.

- [ ] Write minimal `pre-commit` hook that blocks commits to protected branches (configurable, initially `main` and `master`).

---

## Plan Phases

## Phase 1: Initialize Repository

- [x] Initialize Git repository locally.
- [x] Prepare initial `README.md` with project goals and setup instructions.
- [x] Create basic project structure (folders, placeholder files).

## Phase 2: Basic Hook Management Setup

- [x] Create `templates/` directory for hook templates.
- [x] Write minimal `pre-commit`, `pre-push`, and `commit-msg` hooks into `templates/`.
- [x] Write `install-git-hooks.sh` script:
  - [x] Detect `.git/` presence.
  - [x] Copy templates into `.git/hooks/`.
  - [x] Set executable permissions.
- [x] Make `install-git-hooks.sh` idempotent.
- [x] Implement graceful failure if not inside a Git repo.

## Phase 3: Automation Integration

- [x] Add a `prepare` script into `package.json`:

  ```json
  "scripts": {
    "prepare": "bash scripts/install-git-hooks.sh"
  }
  ```

- [ ] Add automated detection of hook installation success:
  - [ ] Verify copied files exist.
  - [ ] Verify executable permissions.

## Phase 4: Repository Clean State Validation

- [ ] After running setup scripts:
  - [ ] Verify `.git/hooks/` contains correct executable hooks.
  - [ ] Verify no unintended files or broken folders.
  - [ ] Verify no staged changes (`git status` clean).
- [ ] Perform manual dry-run tests:
  - [ ] Try committing on `main` branch → must be blocked.
  - [ ] Try committing on feature branch → must succeed.

## Phase 5: Version Control Commit

- [ ] Create initial clean commit on `main` branch.
- [ ] Push `main` branch to GitHub.
- [ ] Configure branch protection rules (block direct pushes to `main`).
- [ ] Create and push first feature branch (e.g., `setup-hooks`, `automation-v1`).

## Phase 6: Advanced Automation (Optional Enhancements)

- [ ] Build a dry-run validation script.
- [ ] Build an auto-hook-repair script (optional future).
- [ ] Add `--quiet` mode for the installer script (for CI).
- [ ] Dynamic hook detection and installation.

---

## Ideas Backlog

- Build lightweight CLI for hook management.
- Explore dynamic templating for reusable scripts.
- Investigate multi-repository hook management.
- Automate README badge generation for hooks status.
- Future: Expand hook system to pre-push validations.
- Future: Build dynamic loader for all templates automatically.
- Future: Introduce lightweight CI (like GitHub Actions) to validate hooks before merging.
- Future: Tag important clean versions (v0.1.0, v0.2.0, etc.) for project history.
- Idea: Build `scripts/test-runner.sh` to auto-run all `*-test.sh` inside `templates/`.
- Idea: Modernize all branch operations to `git switch` instead of `git checkout`.
- Idea: Standardize test naming: match hook names (e.g., `pre-commit-test.sh`).
- Idea: Create a README section that explains the minimal automated project philosophy.
- Idea: Add simple verification tests that installation script (`install-git-hooks.sh`) really installs hooks.
- Future: Auto-generate install commands inside `prepare` script (npm hook).
- Future: Add automatic removal of `.Zone.Identifier` on Windows after downloads.

---

## Quick Milestones

- [ ] Finalize initial hook install and verification system.
- [ ] Push minimal repository to GitHub.
- [ ] Plan next phase: enforcement and automation hardening.
- [ ] Validate project setup flow with test runner.
- [ ] Complete GitHub Branch Protection Rule setup.
- [ ] Open new clean conversation to continue scaling system.
