#!/usr/bin/env node
// Check citation syntax and optionally verify identifiers through official APIs.
const fs = require('fs');
const path = require('path');
const { readTsv } = require('./tsv.js');

const ROOT = path.join(__dirname, '..');
const REACTION_DIR = path.join(ROOT, 'data', 'reactions');
const REVIEW_LOG = path.join(ROOT, 'data', 'review-log.tsv');
const ONLINE = process.argv.includes('--online');
const STRICT = process.argv.includes('--strict');
const REQUEST_TIMEOUT_MS = 8000;
const ONLINE_CONCURRENCY = 8;

const PATTERNS = [
  { type: 'RHEA', regex: /\bRHEA:\d+\b/gi },
  { type: 'KEGG', regex: /\bKEGG:R\d{5}\b/gi },
  { type: 'Reactome', regex: /\bR-HSA-\d+\b/g },
  { type: 'PMID', regex: /\bPMID:\d{7,8}\b/gi },
  { type: 'UniProt', regex: /\b(?:UniProt:)?[OPQ][0-9][A-Z0-9]{3}[0-9]\b/g }
];

function citations(text) {
  const found = [];
  for (const pattern of PATTERNS) {
    for (const match of String(text || '').matchAll(pattern.regex)) {
      found.push({ type: pattern.type, id: match[0].replace(/^rhea:/i, 'RHEA:').replace(/^kegg:/i, 'KEGG:').replace(/^pmid:/i, 'PMID:') });
    }
  }
  return found;
}

function loadRows() {
  const rows = [];
  for (const file of fs.readdirSync(REACTION_DIR).filter(name => name.endsWith('.tsv')).sort()) {
    for (const row of readTsv(path.join(REACTION_DIR, file)).rows) rows.push({ file, row });
  }
  return rows;
}

// 只把“看起来像引用写法”的片段算作可疑：前缀后必须带（半角或全角）冒号，如 KEGG:R1234、RHEA:280、PMID：123。
// 备注正文里单纯提到 “KEGG”“KEGG find” 等说明文字不算格式错误。
function malformedTokens(text) {
  const tokens = String(text || '').match(/(?:RHEA|Rhea|KEGG|PMID)\s*[:：][A-Za-z0-9-]*/g) || [];
  return tokens.filter(token => citations(token).length === 0);
}

function failureKind(status) {
  return status === 429 || status >= 500 ? 'unavailable' : 'invalid';
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': 'cell-metabolism-review/1.0' },
      signal: controller.signal
    });
    const body = await response.text();
    if (!response.ok) {
      // PubMed/接口偶发 429 限流：退避后重试一次，再失败才记为 unavailable。
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const retry = await fetch(url, {
          headers: { 'user-agent': 'cell-metabolism-review/1.0' },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        });
        const retryBody = await retry.text();
        if (retry.ok) return { ok: true, body: retryBody };
        return { ok: false, kind: failureKind(retry.status), reason: `HTTP ${retry.status}` };
      }
      return { ok: false, kind: failureKind(response.status), reason: `HTTP ${response.status}` };
    }
    return { ok: true, body };
  } catch (error) {
    const reason = error && error.name === 'AbortError' ? '请求超时' : (error.message || String(error));
    return { ok: false, kind: 'unavailable', reason };
  } finally {
    clearTimeout(timer);
  }
}

function invalid(reason) {
  return { ok: false, kind: 'invalid', reason };
}

async function verifyCitation(citation) {
  let result;
  if (citation.type === 'KEGG') {
    result = await fetchText(`https://rest.kegg.jp/get/${citation.id.slice(5)}`);
    return result.ok && !result.body.trim() ? invalid('响应为空') : result;
  }
  if (citation.type === 'Reactome') {
    result = await fetchText(`https://reactome.org/ContentService/data/query/${citation.id}`);
    return result.ok && !result.body.trim() ? invalid('响应为空') : result;
  }
  if (citation.type === 'PMID') {
    const id = citation.id.slice(5);
    result = await fetchText(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${id}&retmode=json`);
    if (!result.ok) return result;
    try {
      const payload = JSON.parse(result.body);
      return payload.result && Array.isArray(payload.result.uids) && payload.result.uids.includes(id)
        ? { ok: true }
        : invalid('PubMed 未返回该 PMID');
    } catch {
      return invalid('PubMed 响应不是有效 JSON');
    }
  }
  if (citation.type === 'RHEA') {
    const id = citation.id.slice(5);
    const query = `ASK { <http://rdf.rhea-db.org/${id}> <http://rdf.rhea-db.org/status> <http://rdf.rhea-db.org/Approved> }`;
    result = await fetchText(`https://sparql.rhea-db.org/sparql?query=${encodeURIComponent(query)}&format=application%2Fsparql-results%2Bjson`);
    if (!result.ok) return result;
    try {
      return JSON.parse(result.body).boolean === true ? { ok: true } : invalid('Rhea 未返回 Approved 记录');
    } catch {
      return invalid('Rhea 响应不是有效 JSON');
    }
  }
  if (citation.type === 'UniProt') {
    const id = citation.id.replace(/^UniProt:/i, '');
    result = await fetchText(`https://rest.uniprot.org/uniprotkb/${id}.txt`);
    return result.ok && !result.body.trim() ? invalid('响应为空') : result;
  }
  return { ok: true };
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await mapper(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

(async () => {
  const sourceRows = loadRows();
  const records = sourceRows.map(item => {
    const refs = citations(item.row['备注']);
    return { ...item, refs, malformed: malformedTokens(item.row['备注']) };
  });
  if (fs.existsSync(REVIEW_LOG)) {
    for (const row of readTsv(REVIEW_LOG).rows) {
      const refs = citations(row['证据']);
      records.push({ file: `review-log:${row['文件']}:${row['源行']}`, row: { 审校: row['审校结论'], 备注: row['证据'] }, refs, malformed: malformedTokens(row['证据']) });
    }
  }
  const sourceWithRefs = records.slice(0, sourceRows.length).filter(record => record.refs.length > 0);
  const finalRows = records.slice(0, sourceRows.length).filter(record => record.row['审校'] === '已终审');
  const finalWithoutRefs = finalRows.filter(record => record.refs.length === 0);
  // 显式政策留空（备注写明理由）不算欠账；严格模式只拦截没有说明的真缺口。
  const isPolicyBlank = record => /政策性留空/.test(String(record.row['备注'] || ''));
  const finalPolicyBlanks = finalWithoutRefs.filter(isPolicyBlank);
  const finalMissing = finalWithoutRefs.filter(record => !isPolicyBlank(record));
  const malformed = records.flatMap(record => record.malformed.map(token => `${record.file}: ${token}`));
  const uniqueRefs = [...new Map(records.flatMap(record => record.refs).map(ref => [`${ref.type}:${ref.id}`, ref])).values()];

  console.log('=== 引用检查 ===');
  console.log(`反应行 ${sourceRows.length}，带机器可识别引用 ${sourceWithRefs.length} 行`);
  console.log(`已终审 ${finalRows.length} 行，其中 ${finalMissing.length} 行尚未在备注中补入机器可识别引用`
    + (finalPolicyBlanks.length ? `（另有 ${finalPolicyBlanks.length} 行显式政策留空，不计欠账）` : ''));
  if (finalMissing.length) {
    console.log('待补清单:');
    finalMissing.slice(0, 20).forEach(record => console.log(`  ${record.file} ${record.row['底物'] || ''} → ${record.row['产物'] || ''}`));
    if (finalMissing.length > 20) console.log(`  …另有 ${finalMissing.length - 20} 行`);
  }
  if (finalPolicyBlanks.length) {
    console.log('政策留空:');
    finalPolicyBlanks.forEach(record => console.log(`  ${record.file} ${record.row['底物'] || ''} → ${record.row['产物'] || ''}`));
  }
  console.log(`唯一引用 ${uniqueRefs.length} 个：` + [...new Set(uniqueRefs.map(ref => ref.type))].join('、'));
  if (malformed.length) {
    console.log('格式可疑:');
    malformed.forEach(item => console.log('  ' + item));
  }

  let onlineFailures = [];
  if (ONLINE) {
    const results = await mapWithConcurrency(uniqueRefs, ONLINE_CONCURRENCY, async ref => ({
      ref,
      result: await verifyCitation(ref).catch(error => ({ ok: false, kind: 'unavailable', reason: error.message || String(error) }))
    }));
    onlineFailures = results.filter(item => !item.result.ok);
    const invalidRefs = onlineFailures.filter(item => item.result.kind === 'invalid');
    const unavailableRefs = onlineFailures.filter(item => item.result.kind !== 'invalid');
    console.log(`在线验证 ${results.length} 个：通过 ${results.length - onlineFailures.length}，无效 ${invalidRefs.length}，接口未完成 ${unavailableRefs.length}`);
    invalidRefs.forEach(item => console.log(`  无效 ${item.ref.id}: ${item.result.reason}`));
    unavailableRefs.forEach(item => console.log(`  未完成 ${item.ref.id}: ${item.result.reason}`));
  } else {
    console.log('当前只检查格式；使用 --online 通过官方接口验证 ID');
  }

  if (malformed.length || onlineFailures.length || (STRICT && finalMissing.length)) process.exitCode = 1;
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
