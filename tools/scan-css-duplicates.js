#!/usr/bin/env node
// Scan index.html <style> for duplicate selectors within the same media context.
// Output: selector groups that appear more than once, with line numbers and declaration snippets.
// Usage: node tools/scan-css-duplicates.js [--json]
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) {
  console.error('No <style> block found');
  process.exit(1);
}
const css = styleMatch[1];

function lineAt(index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) if (css[i] === '\n') line += 1;
  return line;
}

function readBlock(text, openIndex) {
  let depth = 1;
  let i = openIndex + 1;
  while (i < text.length && depth > 0) {
    if (text[i] === '{') depth += 1;
    else if (text[i] === '}') depth -= 1;
    i += 1;
  }
  return { end: i, text: text.slice(openIndex + 1, i - 1) };
}

function parseRules(source) {
  const rules = [];
  const contextStack = [];
  let buffer = '';
  let bufferStart = 0;
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '{') {
      const prelude = buffer.trim();
      if (prelude.startsWith('@media')) {
        contextStack.push(prelude);
        buffer = '';
        i += 1;
        bufferStart = i;
        continue;
      }
      if (prelude.startsWith('@')) {
        const block = readBlock(source, i);
        i = block.end;
        buffer = '';
        bufferStart = i;
        continue;
      }
      const block = readBlock(source, i);
      rules.push({
        context: contextStack.join(' '),
        selector: prelude,
        declarations: block.text.trim(),
        line: lineAt(bufferStart),
        index: bufferStart
      });
      i = block.end;
      buffer = '';
      bufferStart = i;
      continue;
    }
    if (ch === '}') {
      if (contextStack.length) contextStack.pop();
      buffer = '';
      i += 1;
      bufferStart = i;
      continue;
    }
    buffer += ch;
    i += 1;
  }
  return rules;
}

const rules = parseRules(css);
const groups = new Map();
for (const rule of rules) {
  const key = `${rule.context}|${rule.selector}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(rule);
}

function declarationSet(declarations) {
  return new Set(declarations.split(';').map(part => part.trim()).filter(Boolean));
}

function isSuperset(a, b) {
  for (const item of b) if (!a.has(item)) return false;
  return true;
}

const duplicates = [...groups.entries()]
  .filter(([, items]) => items.length > 1)
  .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));

// Safe merge candidates: an earlier rule whose declarations are fully covered
// by a later rule in the same context/selector group.
const safeCandidates = duplicates
  .map(([key, items]) => {
    const withSets = items.map(item => ({ ...item, set: declarationSet(item.declarations) }));
    const redundant = withSets.filter((item, index) => withSets.some((other, otherIndex) => otherIndex > index && isSuperset(other.set, item.set)));
    return { key, count: items.length, redundant };
  })
  .filter(entry => entry.redundant.length > 0)
  .sort((a, b) => b.redundant.length - a.redundant.length || a.key.localeCompare(b.key));

const isJson = process.argv.includes('--json');
const isSafe = process.argv.includes('--safe');

if (isJson) {
  const source = isSafe ? safeCandidates : duplicates;
  const output = source.map(entry => {
    if (Array.isArray(entry)) {
      const [key, items] = entry;
      return {
        key,
        count: items.length,
        occurrences: items.map(item => ({ line: item.line, declarations: item.declarations }))
      };
    }
    return {
      key: entry.key,
      count: entry.count,
      occurrences: entry.redundant.map(item => ({ line: item.line, declarations: item.declarations }))
    };
  });
  console.log(JSON.stringify(output, null, 2));
} else if (isSafe) {
  console.log(`Total rules: ${rules.length}`);
  console.log(`Safe merge candidates (earlier rule covered by later rule): ${safeCandidates.length}`);
  console.log('');
  safeCandidates.slice(0, 120).forEach(entry => {
    console.log(`[${entry.redundant.length}/${entry.count}x] ${entry.key}`);
    entry.redundant.forEach(item => {
      console.log(`  REDUNDANT L${item.line}: ${item.declarations.slice(0, 140).replace(/\s+/g, ' ')}`);
    });
    console.log('');
  });
} else {
  console.log(`Total rules: ${rules.length}`);
  console.log(`Duplicate selector groups (same media context): ${duplicates.length}`);
  console.log('');
  duplicates.slice(0, 120).forEach(([key, items]) => {
    console.log(`[${items.length}x] ${key}`);
    items.forEach(item => {
      console.log(`  L${item.line}: ${item.declarations.slice(0, 120).replace(/\s+/g, ' ')}`);
    });
    console.log('');
  });
}
