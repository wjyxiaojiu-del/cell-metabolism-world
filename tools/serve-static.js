const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const host = process.env.PREVIEW_HOST || '127.0.0.1';
const port = Number(process.env.PREVIEW_PORT || 8000);
const root = path.resolve(__dirname, '..');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.tsv': 'text/tab-separated-values; charset=utf-8',
  '.webp': 'image/webp'
};

function send(response, status, message) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(message);
}

const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    send(response, 405, 'Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
  } catch (_) {
    send(response, 400, 'Bad request');
    return;
  }

  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = path.resolve(root, relative);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    send(response, 403, 'Forbidden');
    return;
  }

  fs.stat(target, (statError, stats) => {
    const file = !statError && stats.isDirectory() ? path.join(target, 'index.html') : target;
    fs.stat(file, (fileError, fileStats) => {
      if (fileError || !fileStats.isFile()) {
        send(response, 404, 'Not found');
        return;
      }
      response.writeHead(200, {
        'Content-Type': contentTypes[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Content-Length': fileStats.size,
        'Cache-Control': 'no-store'
      });
      if (request.method === 'HEAD') response.end();
      else fs.createReadStream(file).pipe(response);
    });
  });
});

server.listen(port, host, () => {
  process.stdout.write(`Cell Metabolism World preview: http://${host}:${port}\n`);
});
