# Plan: CodeRabbit Review Exporter

## Goal

Automate retrieval of CodeRabbit AI-generated review summaries for a GitHub repository.  
Output structured markdown files to enable further automation, reduce manual copying, and allow downstream analysis by AI agents or assistants.

---

## Repository Layout

- `coderabbit/`: All code and output related to CodeRabbit review exporting.
- `secrets/`: Central secure store for API tokens. Not committed.

---

## Inputs & Outputs

**Inputs:**

- GitHub repo name (`owner/repo`)
- CodeRabbit API key (loaded via `secrets/coderabbit.js`)
- (Optional) PR number for filtering

**Outputs:**

- Markdown file `coderabbit/summary.md` containing:
  - Grouped feedback by PR
  - Timestamp
  - Review content
  - Affected file paths (if available)

---

## Milestone: Minimal Script

**Purpose:**  
Fetch review summaries from CodeRabbit's API and export as human-readable markdown.

### Tasks

- [x] Create `secrets/coderabbit.js` returning token object
- [x] Create `coderabbit/fetch-review.test.js` with unit tests
- [x] Create `coderabbit/fetch-review.js` script
- [x] Validate API key and handle errors
- [x] Fetch full review history and sort by PR
- [x] Implement pagination handling for API responses
- [x] Extract summary text and structure by PR
- [x] Save result to `summary.md`
- [x] Add minimal tests (output presence, API format)
- [x] Document usage in `README.md`

---

## Design Notes

- CodeRabbit currently exposes summaries, not inline comments.
- Full review history is available; filter on client side.
- No rate limit officially documented; assume pagination if needed.
- All output is human-readable markdown; may later adapt for JSON.

---

## Out of Scope

- Real-time syncing
- Integration with GitHub inline PR comments
- Other review tools (handled separately)
