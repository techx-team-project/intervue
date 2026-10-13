// PreToolUse guard (Edit|Write). Exit code 2 blocks the tool call and shows stderr to Claude.
// Blocks: editing already-committed Flyway migrations, and writing env/secret files.
const { execFileSync } = require('node:child_process');

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let filePath = '';
  try {
    filePath = (JSON.parse(raw).tool_input || {}).file_path || '';
  } catch {
    process.exit(0);
  }
  const p = filePath.replace(/\\/g, '/');

  if (/\/(\.env|application-local\.ya?ml)$/.test(p)) {
    console.error('Blocked: secret/env files must be edited by a human.');
    process.exit(2);
  }

  if (/\/db\/migration\/V[^/]+\.sql$/.test(p)) {
    try {
      execFileSync('git', ['ls-files', '--error-unmatch', filePath], { stdio: 'ignore' });
      console.error('Blocked: this Flyway migration is already committed. Create a new migration with /new-migration instead.');
      process.exit(2);
    } catch {
      // untracked file: new migration, allow
    }
  }
  process.exit(0);
});
