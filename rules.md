# Project Rules and Best Practices

## Git Workflow

- Always work on a feature branch.
- Pull the latest changes from `main` before creating a new branch.
- Submit clean Pull Requests with minimal commits.

## Code and Script Conventions

- Favor minimal, explicit scripts.
- Shell scripts must handle failures (`set -e -u -o pipefail`) unless justified otherwise.
- Hooks must be idempotent and non-intrusive.

## Review and Merging

- Always run tests before submitting PR.
- Squash merge unless a strong reason to preserve individual commits.
- Document every major decision inside the planning file.
