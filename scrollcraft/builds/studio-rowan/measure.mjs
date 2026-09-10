import { chromium } from 'playwright-core';
const b = await chromium.launch({channel:'chrome'});
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
for (const url of ['http://localhost:4175/preview/','http://localhost:4175/preview-2/']) {
  await p.goto(url,{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
  const m = await p.evaluate(()=>({h:document.documentElement.scrollHeight, vh:innerHeight,
    acts:(window.ScrollCraft?.instances[0]?.acts||[]).length}));
  console.log(url.replace('http://localhost:4175/',''), '→', (m.h/m.vh).toFixed(1)+'vh total,', m.acts, 'acts');
}
await b.close();
