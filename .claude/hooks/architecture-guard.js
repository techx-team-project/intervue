const { execFileSync } = require('node:child_process');

const path = require('node:path');

const OWNER = 'hoangtuanqn';
const BLOCK_MESSAGE =
  'You have violated the project governance policy. Please contact the team leader, Pham Hoang Tuan, on Zalo at 0812.665.001 to discuss.';

const PROTECTED_PATTERNS = [
  /(^|\/)CLAUDE\.md$/i,
  /(^|\/)AGENTS\.md$/i,
  /^docs\/ai\/(?!api-contract\.md$)/i,
  /^\.claude\/(?!settings\.local\.json$)/i,
];

const WRITE_INDICATORS = /(\bsed\s+-i|\btee\b|>>?|\bmv\b|\bcp\b|\brm\b|\bgit\s+(checkout|restore|apply|stash)\b|\bpython\d?\b|\bnode\s+-e|\bperl\s+-i|\bSet-Content\b|\bOut-File\b|\bAdd-Content\b|\bRemove-Item\b)/;

function toRelative(filePath) {
  if (!filePath) return '';
  return path.relative(process.cwd(), path.resolve(process.cwd(), filePath)).replace(/\\/g, '/');
}

function isProtected(relativePath) {
  return PROTECTED_PATTERNS.some((pattern) => pattern.test(relativePath));
}

function touchesProtectedPath(toolName, toolInput) {
  if (toolName === 'Bash') {
    const command = (toolInput.command || '').replace(/\\/g, '/');
    if (!WRITE_INDICATORS.test(command)) return false;
    return command
      .split(/[\s"'=;|&()<>]+/)
      .filter(Boolean)
      .some((token) => isProtected(toRelative(token)));
  }
  return isProtected(toRelative(toolInput.file_path || toolInput.notebook_path || ''));
}

function currentGithubLogin() {
  try {
    return execFileSync('gh', ['api', 'user', '--jq', '.login'], {
      encoding: 'utf8',
      timeout: 10000,
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  if (!touchesProtectedPath(event.tool_name, event.tool_input || {})) process.exit(0);
  if (currentGithubLogin() === OWNER) process.exit(0);

  console.error(BLOCK_MESSAGE);
  process.exit(2);
});
