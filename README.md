# setup-scripts

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Status: Minimalist](https://img.shields.io/badge/Status-Minimalist-blue.svg)](https://en.wikipedia.org/wiki/Minimalism)
[![Scripts: Setup Ready](https://img.shields.io/badge/Scripts-Setup%20Ready-success)](#usage)

Minimal reusable setup scripts and planning templates for clean, safe project initialization.

---

## Table of Contents

- [Purpose](#purpose)
- [Included](#included)
  - [Git Hooks Setup](#git-hooks-setup)
  - [Templates](#templates)
- [Protecting the Main Branch](#protecting-the-main-branch)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [License](#license)
- [Philosophy](#philosophy)

---

## Purpose

This repository provides small, focused scripts to help initialize new projects quickly, safely, and cleanly.

It is designed for speed, minimalism, and serious development hygiene.

---

## Included

### Git Hooks Setup

Hooks are automatically installed to prevent direct commits to `main` or `master` branches.

- Local pre-commit hooks ensure protection.
- Lightweight, Git-native solution.
- No external dependencies like Husky.

---

## Templates

- **Planning Template**  
  Provides a consistent, minimal structure for defining project goals and tasks (`templates/planning-template.md`).

- **Other Templates**  
  Additional templates like:
  - **rules.md**: Guidelines or best practices for the project.
  - **philosophy.md**: The overarching principles or vision.
  - **ideas.md**: Brainstorming feature ideas.

Templates are minimal, and only exist where they add real value.

---

## Protecting the Main Branch

### Problem

Accidental direct commits to the `main` (or `master`) branch can cause instability, broken production, or bypass code review processes.

To maintain project safety and clean workflows, direct commits to protected branches must be blocked **locally** at the commit level.

### Solution

We implement a minimal pre-commit hook that:

- Checks the current Git branch during every commit.
- Blocks the commit if the branch is `main` or `master`.
- Displays a clear error message.
- Allows commits to all other branches.

This local protection is:

- Lightweight
- Git-native (no external libraries)
- Quick to set up manually or automatically

> Bypassing the hook (only when absolutely necessary) can be done using:

```bash
git commit --no-verify
git push --no-verify
```

---

## Usage

### Install Git Hooks Manually

1. Create a `templates/` directory if not already present.
2. Place your custom hooks (e.g., `pre-commit`) into `templates/`.
3. Run the setup script:

```bash
bash install-git-hooks.sh
```

This script will:

- Copy hook templates into `.git/hooks/`
- Make hooks executable
- Activate hooks immediately

✅ No external libraries needed.

### Create Project Planning Template

```bash
cp templates/planning-template.md planning.md
```

Edit `planning.md` to match your project's objectives and tasks.

---

## Directory Structure

```plaintext
setup-scripts/
├── LICENSE
├── planning.md
├── templates/
│   ├── planning-template.md
│   └── pre-commit
├── install-git-hooks.sh
├── .gitignore
├── README.md
├── package.json
```

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Philosophy

- **Minimalism First**: Focus only on necessary structure.
- **Automation Preferred**: Eliminate manual repetitive tasks.
- **Flexibility**: Provide building blocks, not rigid systems.
- **Safety by Default**: Protect projects early from mistakes.
