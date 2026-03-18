const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
  if (req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const { filename, data } = JSON.parse(body);
        const b64 = data.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(`D:\\None\\portfolio\\img\\${filename}`, Buffer.from(b64, 'base64'));
        console.log('Saved:', filename);
        res.writeHead(200); res.end('ok');
      } catch(e) { res.writeHead(500); res.end(e.message); }
    });
  }
}).listen(3006, () => console.log('Screenshot server on port 3006'));
