const { execFileSync } = require('node:child_process');

const OWNER = 'hoangtuanqn';
const BLOCK_MESSAGE = '⛔ Architectural change blocked: this change must be requested by hoangtuanqn.';

const PROTECTED_PATTERNS = [
  /(^|\/)CLAUDE\.md$/,
  /(^|\/)AGENTS\.md$/,
  /^docs\/ai\/(architecture|conventions|frontend-guide|domain-glossary|git-commit)\.md$/,
  /^docs\/ai\/adr\//,
  /^docs\/ai\/CHANGELOG\.md$/,
  /^\.claude\/(settings\.json|hooks\/|agents\/|skills\/|commands\/)/,
  /^backend\/pom\.xml$/,
  /^backend\/src\/main\/resources\/application\.ya?ml$/,
  /^backend\/src\/main\/java\/com\/techx\/intervue\/(config|filters)\//,
  /^docker-compose\.ya?ml$/,
  /^lefthook\.ya?ml$/,
  /^frontend\/(package\.json|next\.config\.ts|tsconfig\.json)$/,
];

const WRITE_INDICATORS = /(\bsed\s+-i|\btee\b|>>?|\bmv\b|\bcp\b|\brm\b|\bgit\s+(checkout|restore|apply|stash)\b|\bpython\d?\b|\bnode\s+-e|\bperl\s+-i|\bSet-Content\b|\bOut-File\b|\bAdd-Content\b|\bRemove-Item\b)/;

function toRelative(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  const root = process.cwd().replace(/\\/g, '/').replace(/\/$/, '');
  return normalized.toLowerCase().startsWith(root.toLowerCase() + '/')
    ? normalized.slice(root.length + 1)
    : normalized;
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
  return isProtected(toRelative(toolInput.file_path || ''));
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
