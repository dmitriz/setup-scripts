// fetchReviews.js
// Fetches CodeRabbit review summaries for a GitHub repository
// Requires secrets/coderabbit.js with { apiKey: "..." }

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { apiKey } = require("../secrets/coderabbit");

// === Constants ===
const API_URL = "https://api.coderabbit.ai/review-history"; // This may evolve
const OUTPUT_DIR = __dirname;
const DEFAULT_FILENAME = pr => `coderabbit-summary-${pr}.md`;

// === Utility: Save markdown ===
function saveMarkdown(prNumber, content) {
  const filename = DEFAULT_FILENAME(prNumber);
  const fullPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(fullPath, content, "utf8");
  console.log(`✅ Saved summary to ${filename}`);
}

// === Entry Point ===
async function fetchReviews(repo, prFilter = null) {
  if (!apiKey) {
    console.error("❌ No API key found in secrets/coderabbit.js");
    process.exit(1);
  }

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      params: {
        repository: repo,
      },
    });

    const reviews = response.data.reviews || [];

    if (reviews.length === 0) {
      console.log("ℹ️ No reviews found for this repository.");
      return;
    }

    const selected = prFilter
      ? reviews.filter(r => r.pull_request_number == prFilter)
      : reviews;

    if (selected.length === 0) {
      console.log(`ℹ️ No review found for PR #${prFilter}`);
      return;
    }

    selected.forEach(review => {
      const { pull_request_number, summary, created_at } = review;
      const md = `# CodeRabbit Review Summary – PR #${pull_request_number}

**Date:** ${created_at}

---

${summary || "_No summary available._"}
`;
      saveMarkdown(pull_request_number, md);
    });
  } catch (err) {
    console.error("❌ Failed to fetch review history:");
    console.error(err.message || err);
  }
}

// === CLI Mode ===
if (require.main === module) {
  const [repo, pr] = process.argv.slice(2);
  if (!repo) {
    console.log("Usage: node fetchReviews.js <github-repo> [pr-number]");
    process.exit(0);
  }
  fetchReviews(repo, pr);
}

module.exports = { fetchReviews };