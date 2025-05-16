// fetchReviews.js
// Fetches CodeRabbit review summaries for a GitHub repository
// Requires secrets/coderabbit.js with { apiKey: "..." }

const fs = require("fs");
const path = require("path");
const axios = require("axios");
let coderabbitConfig;
try {
  coderabbitConfig = require("../secrets/coderabbit");
} catch (error) {
  console.error("❌ Error: secrets/coderabbit.js file not found. Please create it with your API key.");
  process.exit(1);
}

// === Constants ===
const API_URL = "https://api.coderabbit.ai/review-history"; // This may evolve
const OUTPUT_DIR = __dirname;
const DEFAULT_FILENAME = pr => `coderabbit-summary-${pr}.md`;
const SUMMARY_FILENAME = "summary.md";

// === Utility: Save markdown ===
function saveMarkdown(prNumber, content) {
  const filename = DEFAULT_FILENAME(prNumber);
function saveMarkdown(prNumber, content) {
  const filename = DEFAULT_FILENAME(prNumber);
  const fullPath = path.join(OUTPUT_DIR, filename);
  
  // Ensure the output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, "utf8");
  console.log(`✅ Saved summary to ${filename}`);
}

// === Utility: Save consolidated markdown ===
function saveConsolidatedMarkdown(content) {
  const fullPath = path.join(OUTPUT_DIR, SUMMARY_FILENAME);
  fs.writeFileSync(fullPath, content, "utf8");
  console.log(`✅ Saved consolidated summary to ${SUMMARY_FILENAME}`);
}

// === Format individual PR review into markdown ===
function formatPRReview(review) {
  const { pull_request_number, summary, created_at } = review;
  return `# CodeRabbit Review Summary – PR #${pull_request_number}

**Date:** ${created_at}

---

${summary || "_No summary available._"}
`;
}

// === Format reviews into consolidated markdown ===
function formatConsolidatedReviews(reviews) {
  const timestamp = new Date().toISOString();
  
  let markdown = `# CodeRabbit Review Summaries\n\n`;
  markdown += `**Generated:** ${timestamp}\n\n`;
  
  // Group reviews by PR
  const prGroups = {};
  
  reviews.forEach(review => {
    const { pull_request_number } = review;
    if (!prGroups[pull_request_number]) {
      prGroups[pull_request_number] = [];
    }
    prGroups[pull_request_number].push(review);
  });
  
  // Generate markdown for each PR group
  Object.keys(prGroups).sort((a, b) => b - a).forEach(prNumber => {
    markdown += `## PR #${prNumber}\n\n`;
    
    // Sort reviews by date (newest first)
    const prReviews = prGroups[prNumber].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
    
    prReviews.forEach(review => {
      const { summary, created_at, affected_files } = review;
      
      markdown += `### Review from ${created_at}\n\n`;
      markdown += `${summary || "_No summary available._"}\n\n`;
      
      // Include affected files if available
      if (affected_files && affected_files.length > 0) {
        markdown += `**Affected Files:**\n\n`;
        affected_files.forEach(file => {
          markdown += `- \`${file}\`\n`;
        });
        markdown += "\n";
      }
      
      markdown += "---\n\n";
    });
  if (!coderabbitConfig.apiKey) {
    console.error("❌ No API key found in secrets/coderabbit.js");
    process.exit(1);
    // This return is important for testing since Jest will catch the process.exit call
    return;
  }
  // Check if apiKey exists and is not undefined
  if (!coderabbitConfig.apiKey) {
    console.error("❌ No API key found in secrets/coderabbit.js");
    process.exit(1);
    // This return is important for testing since Jest will catch the process.exit call
    return;
  }

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${coderabbitConfig.apiKey}`,
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
      ? reviews.filter(r => r.pull_request_number === Number(prFilter))
      : reviews;

    if (selected.length === 0) {
      console.log(`ℹ️ No review found for PR #${prFilter}`);
      return;
    }
    
    // Generate individual PR files (original behavior)
    if (options.individual) {
      selected.forEach(review => {
        const { pull_request_number } = review;
        const md = formatPRReview(review);
        saveMarkdown(pull_request_number, md);
      });
    }
    
    // Generate consolidated summary file (new behavior)
    if (options.consolidated) {
      const markdownContent = formatConsolidatedReviews(selected);
      saveConsolidatedMarkdown(markdownContent);
    }
    
  } catch (err) {
    console.error("❌ Failed to fetch review history:");
    console.error(err.message || err);
  }
}

// === CLI Mode ===
if (require.main === module) {
  const [repo, pr, mode] = process.argv.slice(2);
  if (!repo) {
    console.log("Usage: node fetch-reviews.js <github-repo> [pr-number] [output-mode]");
    console.log("Output modes: individual, consolidated, both (default: both)");
    process.exit(0);
  }
  
  const options = {
    individual: mode === "individual" || mode === "both" || !mode,
    consolidated: mode === "consolidated" || mode === "both" || !mode
  };
  
  fetchReviews(repo, pr, options);
}

module.exports = { fetchReviews };