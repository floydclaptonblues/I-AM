import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const types = { '.jpg':'image/jpeg', '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.gif':'image/gif', '.png':'image/png', '.webp':'image/webp' };
http.createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/') pathname = '/index.html';
    const file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) || pathname.split('/').some(p => p.startsWith('.'))) throw new Error('Forbidden');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('I AM preview: http://127.0.0.1:4173'));
