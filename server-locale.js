#!/usr/bin/env node
// Bali – server statico per provare il sito in locale.
// Uso:   node server-locale.js   poi apri http://localhost:8890

const http = require('http');
const fs = require('fs');
const path = require('path');

const RADICE = __dirname;
const PORTA = Number(process.env.PORT) || 8890;
const TIPI = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

http.createServer((req, res) => {
  const percorso = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.join(RADICE, percorso === '/' ? 'index.html' : percorso);
  if (!file.startsWith(RADICE) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Non trovato');
  }
  res.writeHead(200, { 'Content-Type': TIPI[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}).listen(PORTA, () => console.log('Bali in locale: http://localhost:' + PORTA));
