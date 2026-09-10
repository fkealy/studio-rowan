// Serves the repo with the _headers CSP applied, so the policy can be tested
// before it reaches Cloudflare. Verification only; not part of the deploy.
import http from 'http'; import fs from 'fs'; import path from 'path';
const ROOT = '/Users/freddiekealy/Development/studio-rowan';
const CSP = fs.readFileSync(path.join(ROOT,'_headers'),'utf8')
  .split('\n').find(l=>l.trim().startsWith('Content-Security-Policy:'))
  .trim().replace(/^Content-Security-Policy:\s*/,'');
const TYPES={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2',
  '.avif':'image/avif','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png',
  '.mp4':'video/mp4','.webm':'video/webm','.json':'application/json'};
http.createServer((req,res)=>{
  let u = decodeURIComponent(req.url.split('?')[0]);
  if(u.endsWith('/')) u += 'index.html';
  const f = path.join(ROOT, u);
  if(!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()){ res.writeHead(404); return res.end('nope'); }
  const h = {'Content-Type': TYPES[path.extname(f)]||'application/octet-stream'};
  if(u.startsWith('/preview/')) h['Content-Security-Policy'] = CSP;
  res.writeHead(200,h); fs.createReadStream(f).pipe(res);
}).listen(4176, ()=>console.log('csp test server on 4176; policy:', CSP.slice(0,60)+'...'));
