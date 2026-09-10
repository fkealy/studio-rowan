import { chromium } from 'playwright-core';
const URL = process.env.AUDIT_URL || 'http://localhost:4175/preview-2/';
const b = await chromium.launch({channel:'chrome'});
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto(URL,{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
console.log(URL);
console.log(await p.evaluate(async ()=>{
  // "Ink coverage": the share of the viewport's vertical band that has any
  // visible text or media in it. Low coverage over a long run of scroll is a
  // gap the reader experiences as nothing happening.
  const nodes=[...document.querySelectorAll('h1,h2,h3,p,li,figure,canvas,video,img,dl,ol,ul')]
    .filter(e=>e.offsetParent!==null || getComputedStyle(e).position==='fixed');
  const rows=[];
  const H=document.documentElement.scrollHeight;
  for (let y=0; y<=H-innerHeight; y+=100) {
    scrollTo({top:y,behavior:'instant'});
    await new Promise(r=>requestAnimationFrame(r));
    const bands=new Uint8Array(20);           // 20 slices of the viewport
    for (const e of nodes) {
      const s=getComputedStyle(e);
      if (parseFloat(s.opacity) < 0.08) continue;
      const r=e.getBoundingClientRect();
      if (r.bottom<=0 || r.top>=innerHeight || r.height<4) continue;
      const a=Math.max(0,Math.floor(r.top/innerHeight*20));
      const c=Math.min(19,Math.floor((r.bottom-1)/innerHeight*20));
      for(let i=a;i<=c;i++) bands[i]=1;
    }
    rows.push({y, cov: bands.reduce((a,b)=>a+b,0)/20});
  }
  // Longest runs where coverage <= 0.25
  const runs=[]; let cur=null;
  for (const r of rows) {
    if (r.cov<=0.25) { if(!cur) cur={from:r.y,to:r.y,min:r.cov}; else {cur.to=r.y; cur.min=Math.min(cur.min,r.cov);} }
    else if (cur) { runs.push(cur); cur=null; }
  }
  if (cur) runs.push(cur);
  runs.sort((a,b)=>(b.to-b.from)-(a.to-a.from));
  const vh=innerHeight;
  const out=runs.slice(0,6).map(r=>`  ${((r.to-r.from)/vh).toFixed(2)} viewports nearly empty  (y ${r.from}..${r.to}, min coverage ${(r.min*100).toFixed(0)}%)`);
  const mean=rows.reduce((a,r)=>a+r.cov,0)/rows.length;
  return `  mean ink coverage across the page: ${(mean*100).toFixed(0)}%\n` + (out.length?out.join('\n'):'  no runs below 25% coverage');
}));
await b.close();
