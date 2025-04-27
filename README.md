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
- [Usage](#usage)
  - [Use Git Hooks (automated)](#1-use-git-hooks-automated)
  - [Create Project Planning Template](#2-create-project-planning-template)
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

Hooks are automatically installed to prevent direct commits to `main` branch and provide basic checks.

#### Bypassing Hooks

If you need to bypass hooks manually (e.g., emergency commits, migrations), you can use:

```bash
git commit --no-verify
git push --no-verify
```

---

## Templates

- **Planning Template**  
  Provides a consistent, minimal structure for defining project goals and tasks (`templates/planning-template.md`).

- **Other Files**  
  Flexible and manually written as the project evolves:
  - **rules.md**: Guidelines or best practices for the project.
  - **philosophy.md**: The overarching principles or vision for the project.
  - **ideas.md**: Brainstorming or feature ideas for future development.

Templates should exist only where structure adds real value, following the philosophy of minimalism and flexibility.

---

## Usage

To quickly initialize local git safety and planning:

### 1. Use Git Hooks (automated)

To set up Git hooks, follow these steps:

1. Create a `git/hooks` directory in your repository.
2. Add your custom hooks (e.g., `pre-commit`, `pre-push`) to this directory.
3. Make the hooks executable using:

```bash
chmod +x git/hooks/*
```

1. Configure Git to use the hooks:

```bash
git config core.hooksPath git/hooks
```

Alternatively, you can use the following script for automated setup:

```bash
npx github:dmitriz/setup-scripts husky-setup.sh
```

This script will:

- Install Husky if missing
- Set up pre-commit enforcement
- Verify the setup automatically by testing a failing commit

✅ No manual setup needed.

---

### 2. Create Project Planning Template

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
│   └── README.md
├── hook-setup.sh
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

---

## State-of-the-Art Git Ignore File

This repository includes a state-of-the-art `.gitignore` file designed for reusability across projects. It ensures:

- Comprehensive coverage of common file types and patterns.
- Minimal manual adjustments needed for most setups.
- Improved project hygiene by excluding unnecessary files from version control.

Feel free to reuse and adapt it for your own projects.
