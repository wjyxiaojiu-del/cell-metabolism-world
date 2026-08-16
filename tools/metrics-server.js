const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.METRICS_PORT || 18765);
const DATA_FILE = process.env.METRICS_FILE || '/var/lib/cell-metabolism/metrics.json';
const ONLINE_WINDOW_MS = 75_000;
const heartbeats = new Map();

function readMetrics() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return { visits: 0, updatedAt: null }; }
}
function writeMetrics(metrics) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(metrics));
  fs.renameSync(tmp, DATA_FILE);
}
function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type' }); return res.end(); }
  if (req.url === '/api/stats' && req.method === 'GET') {
    const now = Date.now();
    const metrics = readMetrics();
    for (const [id, seenAt] of heartbeats) if (now - seenAt > ONLINE_WINDOW_MS) heartbeats.delete(id);
    return json(res, 200, { visits: Number(metrics.visits || 0), online: heartbeats.size, windowSeconds: ONLINE_WINDOW_MS / 1000 });
  }
  if (req.url === '/api/visit' && req.method === 'POST') {
    const now = Date.now();
    const metrics = readMetrics();
    metrics.visits = Number(metrics.visits || 0) + 1;
    metrics.updatedAt = new Date(now).toISOString();
    writeMetrics(metrics);
    return json(res, 200, { visits: metrics.visits });
  }
  if (req.url === '/api/heartbeat' && req.method === 'POST') {
    let raw = '';
    req.on('data', chunk => { raw += chunk; if (raw.length > 256) req.destroy(); });
    req.on('end', () => {
      try {
        const id = String(JSON.parse(raw).id || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
        if (!id) return json(res, 400, { error: 'missing id' });
        heartbeats.set(id, Date.now());
        return json(res, 200, { online: heartbeats.size });
      } catch { return json(res, 400, { error: 'invalid body' }); }
    });
    return;
  }
  json(res, 404, { error: 'not found' });
});

server.listen(PORT, '127.0.0.1', () => console.log(`metrics listening on ${PORT}`));
