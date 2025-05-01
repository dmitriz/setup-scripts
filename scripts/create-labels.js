// scripts/create-labels.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const SECRETS_PATH = path.resolve(__dirname, '../.secrets/github.json');
const LABELS = [
  // Type
  { name: 'type/action',      color: '1d76db', description: 'Task or actionable item' },
  { name: 'type/concept',     color: '006b75', description: 'Concept or knowledge item' },
  
  // Priority
  { name: 'priority/now',     color: 'b60205', description: 'Urgent or current priority' },
  { name: 'priority/next',    color: 'fbca04', description: 'Near-term priority' },
  { name: 'priority/later',   color: 'c2e0c6', description: 'Deferred or backlog' },

  // Status
  { name: 'status/untriaged', color: 'd4c5f9', description: 'Needs triage' },
  { name: 'status/today',     color: '0052cc', description: 'Active today' },
  { name: 'status/done',      color: 'd1d5da', description: 'Completed or resolved' },
  { name: 'status/needs-input', color: 'e99695', description: 'Requires input or feedback' }
];

function loadToken() {
  if (!fs.existsSync(SECRETS_PATH)) {
    throw new Error(`Secrets file not found at ${SECRETS_PATH}`);
  }
  const secrets = JSON.parse(fs.readFileSync(SECRETS_PATH));
  if (!secrets.token) throw new Error('GitHub token not found in secrets file');
  return secrets.token;
}

async function createLabel(label, repo, token) {
  const data = JSON.stringify({
    name: label.name,
    color: label.color,
    description: label.description,
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

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(`✔ Created: ${label.name}`);
        } else if (res.statusCode === 422) {
          resolve(`⚠ Already exists: ${label.name}`);
        } else {
          reject(`Error for ${label.name}: ${res.statusCode} - ${body}`);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const repo = 'dmitriz/health-routines'; // Change this as needed
  const token = loadToken();

  for (const label of LABELS) {
    try {
      const result = await createLabel(label, repo, token);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

main();
