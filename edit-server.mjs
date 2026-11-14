/**
 * AI 航海研习社案例库 · 本地编辑服务
 *
 * 用途：让网页上的「编辑文案」把改动直接写回 assets/js/edits.js
 * 启动：双击「编辑文案.bat」，或运行 node edit-server.mjs
 * 地址：http://127.0.0.1:8125/?edit=1
 */
import http from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8125);
const HOST = '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

function send(res, code, body, type) {
  res.writeHead(code, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

async function handleSave(req, res) {
  let raw = '';
  try {
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 2 * 1024 * 1024) throw new Error('too large');
    }
    const data = JSON.parse(raw || '{}');
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('bad shape');

    const js =
      'window.EDITS = ' + JSON.stringify(data, null, 2) + ';\n' +
      'window.EDITS_UPDATED = ' + Date.now() + ';\n';
    await writeFile(path.join(ROOT, 'assets', 'js', 'edits.js'), js, 'utf8');

    const count = Object.keys(data).length;
    console.log('[save] ' + new Date().toLocaleTimeString() + '  写入 ' + count + ' 条修改');
    send(res, 200, JSON.stringify({ ok: true, keys: count }), 'application/json; charset=utf-8');
  } catch (err) {
    console.error('[save] 失败:', err.message);
    send(res, 400, JSON.stringify({ ok: false, error: err.message }), 'application/json; charset=utf-8');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://' + HOST);
  let pathname = '/';
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    pathname = url.pathname;
  }

  if (req.method === 'POST' && pathname === '/api/edits') {
    await handleSave(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'method not allowed');
    return;
  }

  if (pathname === '/' || pathname.endsWith('/')) pathname += 'index.html';
  const filePath = path.join(ROOT, pathname.replace(/^\/+/, ''));
  const rel = path.relative(ROOT, filePath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    send(res, 403, 'forbidden');
    return;
  }

  try {
    const buf = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(req.method === 'HEAD' ? undefined : buf);
  } catch {
    send(res, 404, 'not found');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('\n端口 ' + PORT + ' 已被占用。可能编辑服务已经在运行，直接打开：');
    console.error('http://' + HOST + ':' + PORT + '/?edit=1\n');
  } else {
    console.error(err);
  }
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  AI 航海研习社案例库 · 编辑服务已启动');
  console.log('  打开：http://' + HOST + ':' + PORT + '/?edit=1');
  console.log('  改动会写回 assets/js/edits.js');
  console.log('  关闭这个窗口即可停止服务。');
  console.log('');
});
