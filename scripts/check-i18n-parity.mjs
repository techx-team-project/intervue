#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to extract placeholders like {name}, {count}, {min}
const PLACEHOLDER_REGEX = /\{([a-zA-Z0-9_]+)\}/g;

function getPlaceholders(str) {
  if (typeof str !== 'string') return [];
  const matches = [...str.matchAll(PLACEHOLDER_REGEX)];
  return matches.map((m) => m[1]).sort();
}

// Flatten nested JSON objects into dot-notation paths
function flattenObject(obj, prefix = '') {
  const result = {};

  if (obj === null || obj === undefined) {
    result[prefix] = obj;
    return result;
  }

  if (Array.isArray(obj)) {
    // If it's an array of primitives, keep it as array or indexed paths
    obj.forEach((item, index) => {
      const newKey = prefix ? `${prefix}.${index}` : `${index}`;
      if (typeof item === 'object' && item !== null) {
        Object.assign(result, flattenObject(item, newKey));
      } else {
        result[newKey] = item;
      }
    });
    return result;
  }

  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(result, flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
    return result;
  }

  result[prefix] = obj;
  return result;
}

function checkDirectoryParity(messagesDir) {
  console.log(`\n🔍 Checking i18n key parity in: ${path.relative(rootDir, messagesDir) || '.'}`);

  const enDir = path.join(messagesDir, 'en');
  const viDir = path.join(messagesDir, 'vi');

  if (!fs.existsSync(enDir)) {
    console.error(`❌ English messages directory not found: ${enDir}`);
    return { passed: false, errors: [`Directory not found: ${enDir}`] };
  }

  if (!fs.existsSync(viDir)) {
    console.error(`❌ Vietnamese messages directory not found: ${viDir}`);
    return { passed: false, errors: [`Directory not found: ${viDir}`] };
  }

  const enFiles = fs
    .readdirSync(enDir)
    .filter((f) => f.endsWith('.json'))
    .sort();
  const viFiles = fs
    .readdirSync(viDir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  const allNamespaces = Array.from(new Set([...enFiles, ...viFiles])).sort();

  if (allNamespaces.length === 0) {
    console.error(`❌ No JSON message files found in ${enDir}`);
    return { passed: false, errors: ['No message files found'] };
  }

  let totalKeysChecked = 0;
  const errors = [];
  const namespaceSummaries = [];

  for (const file of allNamespaces) {
    const enFilePath = path.join(enDir, file);
    const viFilePath = path.join(viDir, file);
    const namespace = path.basename(file, '.json');

    const enExists = fs.existsSync(enFilePath);
    const viExists = fs.existsSync(viFilePath);

    if (!enExists) {
      errors.push(`[${namespace}] Missing EN file: ${file}`);
      continue;
    }
    if (!viExists) {
      errors.push(`[${namespace}] Missing VI file: ${file}`);
      continue;
    }

    let enData, viData;
    try {
      enData = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'));
    } catch (err) {
      errors.push(`[${namespace}] Invalid JSON in EN file: ${err.message}`);
      continue;
    }

    try {
      viData = JSON.parse(fs.readFileSync(viFilePath, 'utf-8'));
    } catch (err) {
      errors.push(`[${namespace}] Invalid JSON in VI file: ${err.message}`);
      continue;
    }

    const flatEn = flattenObject(enData);
    const flatVi = flattenObject(viData);

    const enKeys = Object.keys(flatEn).sort();
    const viKeys = Object.keys(flatVi).sort();

    const enKeySet = new Set(enKeys);
    const viKeySet = new Set(viKeys);

    let fileErrors = 0;

    // Check for keys in EN missing in VI
    for (const key of enKeys) {
      if (!viKeySet.has(key)) {
        errors.push(`[${namespace}] Missing key in VI: "${key}"`);
        fileErrors++;
      }
    }

    // Check for keys in VI missing in EN
    for (const key of viKeys) {
      if (!enKeySet.has(key)) {
        errors.push(`[${namespace}] Extra key in VI (not in EN): "${key}"`);
        fileErrors++;
      }
    }

    // Check placeholders for keys that exist in both
    for (const key of enKeys) {
      if (viKeySet.has(key)) {
        totalKeysChecked++;
        const enVal = flatEn[key];
        const viVal = flatVi[key];

        if (typeof enVal === 'string' && typeof viVal === 'string') {
          const enPlaceholders = getPlaceholders(enVal);
          const viPlaceholders = getPlaceholders(viVal);

          if (enPlaceholders.join(',') !== viPlaceholders.join(',')) {
            errors.push(
              `[${namespace}] Placeholder mismatch at "${key}": ` +
                `EN has [${enPlaceholders.join(', ')}], VI has [${viPlaceholders.join(', ')}]`
            );
            fileErrors++;
          }
        } else if (typeof enVal !== typeof viVal) {
          errors.push(
            `[${namespace}] Type mismatch at "${key}": ` +
              `EN is ${typeof enVal}, VI is ${typeof viVal}`
          );
          fileErrors++;
        }
      }
    }

    namespaceSummaries.push({
      namespace,
      keyCount: enKeys.length,
      errors: fileErrors,
    });
  }

  // Print summary per namespace
  console.log('\n--- Namespace Parity Summary ---');
  for (const s of namespaceSummaries) {
    if (s.errors === 0) {
      console.log(`  ✓ ${s.namespace.padEnd(20)}: ${s.keyCount} keys matched`);
    } else {
      console.log(`  ✗ ${s.namespace.padEnd(20)}: ${s.keyCount} keys, ${s.errors} error(s)`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ Found ${errors.length} parity error(s):`);
    for (const err of errors) {
      console.error(`   - ${err}`);
    }
    return { passed: false, errors };
  }

  console.log(`\n✅ Parity check passed! (${namespaceSummaries.length} namespaces, ${totalKeysChecked} keys verified)`);
  return { passed: true, errors: [] };
}

function main() {
  const args = process.argv.slice(2);
  let targetDirs = [];

  const dirArgIndex = args.indexOf('--dir');
  if (dirArgIndex !== -1 && args[dirArgIndex + 1]) {
    targetDirs = [path.resolve(process.cwd(), args[dirArgIndex + 1])];
  } else {
    // Default: Check root messages/ and frontend/messages/ if they exist
    const rootMessages = path.join(rootDir, 'messages');
    const frontendMessages = path.join(rootDir, 'frontend', 'messages');

    if (fs.existsSync(rootMessages)) targetDirs.push(rootMessages);
    if (fs.existsSync(frontendMessages) && frontendMessages !== rootMessages) {
      targetDirs.push(frontendMessages);
    }
  }

  if (targetDirs.length === 0) {
    console.error('❌ No messages directories found to check.');
    process.exit(1);
  }

  let allPassed = true;
  for (const dir of targetDirs) {
    const result = checkDirectoryParity(dir);
    if (!result.passed) {
      allPassed = false;
    }
  }

  if (!allPassed) {
    process.exit(1);
  }

  process.exit(0);
}

main();

