/**
 * Predefined GitHub issue labels organized by category.
 *
 * These labels are used to categorize and manage issues in a GitHub repository.
 * Each label is defined with the following properties:
 * - `name`: A string representing the label's name, prefixed by its category (e.g., "type/", "priority/", "status/").
 const SECRETS_PATH = path.resolve(__dirname, '../secrets/github.json');
 * - `description`: A string providing a brief explanation of the label's purpose.
 *
 * Categories:
 * - **Type**: Labels that describe the nature of the issue (e.g., action, concept).
 * - **Priority**: Labels that indicate the urgency or importance of the issue (e.g., now, next, later).
 * - **Status**: Labels that reflect the current state of the issue (e.g., untriaged, today, done, needs-input).
 *
 * Example:
 * ```javascript
 * { name: 'type/action', color: '1d76db', description: 'Task or actionable item' }
 * ```
 *
 * These labels help maintainers and contributors organize and prioritize issues effectively.
 */
// scripts/create-labels.js

const fs = require('fs');
const https = require('https');
const winston = require('winston');
const LABELS = require('../config/github-labels.json');

require('dotenv').config();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Define the path to secrets file
const SECRETS_PATH = './secrets/github-token.json';

/**
 * Predefined GitHub issue labels organized by category (e.g., Type, Priority, Status).
 * These labels are used to standardize issue categorization and streamline project workflows.
 *
 * Each label object must include:
 * - name: {string} The label name, typically prefixed by its category (e.g., 'type/action').
 * - color: {string} A hex color code (without the '#' symbol) for the label's background.
 * - description: {string} A brief explanation of the label's purpose.
 *
 * @type {Array<{
 *   name: string,
 *   color: string,
 *   description: string
 * }>}
 */
// Load labels from external JSON configuration
function validateToken(token) {
  if (!token) {
    throw new Error('GitHub token not found in environment variables');
  }
  const tokenRegex = /^gh[pous]_[A-Za-z0-9_]{36}$/;
  if (!tokenRegex.test(token)) {
    throw new Error('Invalid GitHub token format');
  }
}

/**
 * Loads the GitHub authentication token from a local secrets file.
 *
 * @returns {string} The GitHub token read from the secrets file.
 *
 * @throws {Error} If the secrets file does not exist or the token is missing.
 */
function loadToken() {
  const token = process.env.GITHUB_TOKEN;
  validateToken(token);
  return token;
}

const HTTP_STATUS = {
  OK_MIN: 200,
  OK_MAX: 300,
  UNPROCESSABLE_ENTITY: 422,
};

/**
 * Creates a GitHub issue label in the specified repository using the GitHub API.
 *
 * Resolves with a success message if the label is created, or a warning if the label already exists.
 *
 * @param {Object} label - An object containing the label's `name`, `color`, and `description`.
 * @param {string} repo - The full repository name in the format `owner/repo`.
 * @param {string} token - A valid GitHub authentication token.
 * @returns {Promise<string>} A message indicating the result of the label creation.
 *
 * @throws {Error} If the API request fails with a status code other than 2xx or 422.
 */
async function createLabel(label, repo, token) {
  const data = JSON.stringify({
    name: label.name,
    color: label.color,
    description: label.description,
  });

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
  });

  const options = {
    hostname: 'api.github.com',
    path: `/repos/${repo}/labels`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'label-script',
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    }
  };

  logger.info('HTTP request options prepared', { options });

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= HTTP_STATUS.OK_MIN && res.statusCode < HTTP_STATUS.OK_MAX) {
          resolve(`✔ Created: ${LABELS.find(l => l.name === label.name)?.name || label.name}`);
        } else if (res.statusCode === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
          resolve(`⚠ Already exists: ${LABELS.find(l => l.name === label.name)?.name || label.name}`);
        } else if (res.statusCode === 403) {
          reject(new Error(`Rate limit exceeded or forbidden: ${res.statusCode} - ${body}`));
        } else {
          const error = new Error(`Error for ${label.name}: ${res.statusCode} - ${body}`);
          error.statusCode = res.statusCode;
          error.responseBody = body;
          reject(error);
        }
      });
    });

    req.on('error', error => {
      reject(new Error(`Network error: ${error.message}`));
    });

    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('Request timed out after 10 seconds'));
    });

    req.write(data);
    req.end();
  });
}

/**
 * Creates all predefined GitHub issue labels for the target repository.
 *
 * Loads the GitHub authentication token, then iterates through each label definition and attempts to create it in the specified repository. Logs the outcome of each label creation attempt to the console.
 */
async function main() {
  const repoArg = process.env.GITHUB_REPOSITORY || process.argv[2];
  if (!repoArg) {
    console.error('Usage: node create-labels.js <owner/repo> or set GITHUB_REPOSITORY environment variable');
    process.exit(1);
  }
  
  // Use GITHUB_TOKEN from env or load from secrets file
  const token = GITHUB_TOKEN || loadToken();

  for (const label of LABELS) {
    try {
      const result = await createLabel(label, repoArg, token);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
