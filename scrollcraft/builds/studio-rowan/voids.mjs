import { chromium } from 'playwright-core';
const URL = process.env.AUDIT_URL || 'http://localhost:4175/preview-2/';
const b = await chromium.launch({channel:'chrome'});
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto(URL,{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
console.log(URL);
console.log(await p.evaluate(async ()=>{
  // The metric that matters: sparse AND moving. Sparse and held is a full
  // stop; sparse and scrolling past is a void.
  const nodes=()=>[...document.querySelectorAll('h1,h2,h3,p,li,figure,canvas,video,img,dl')]
    .filter(e=>e.offsetParent!==null);
  const H=document.documentElement.scrollHeight;
  let prev=null; const rows=[];
  for (let y=0; y<=H-innerHeight; y+=50) {
    scrollTo({top:y,behavior:'instant'});
    await new Promise(r=>requestAnimationFrame(r));
    const bands=new Uint8Array(20); let anchor=null;
    for (const e of nodes()) {
      const s=getComputedStyle(e); if (parseFloat(s.opacity)<0.08) continue;
      const r=e.getBoundingClientRect();
      if (r.bottom<=0||r.top>=innerHeight||r.height<4) continue;
      if (anchor===null||r.top<anchor) anchor=r.top;
      const a=Math.max(0,Math.floor(r.top/innerHeight*20));
      const c=Math.min(19,Math.floor((r.bottom-1)/innerHeight*20));
      for(let i=a;i<=c;i++) bands[i]=1;
    }
    const cov=bands.reduce((a,b)=>a+b,0)/20;
    const moving = prev===null||anchor===null ? true : Math.abs(anchor-prev)>6;
    rows.push({y,cov,moving}); prev=anchor;
  }
  const runs=[]; let cur=null;
  for (const r of rows) {
    const bad = r.cov<=0.25 && r.moving;
    if (bad) { if(!cur) cur={from:r.y,to:r.y}; else cur.to=r.y; }
    else if (cur) { runs.push(cur); cur=null; }
  }
  if (cur) runs.push(cur);
  runs.sort((a,b)=>(b.to-b.from)-(a.to-a.from));
  const held = rows.filter(r=>r.cov<=0.25 && !r.moving).length;
  const vh=innerHeight;
  return `  sparse-and-HELD samples (full stops): ${held}\n` +
    (runs.length && (runs[0].to-runs[0].from)>0
      ? '  worst sparse-and-MOVING run (the actual void): ' +
        runs.slice(0,3).map(r=>`${((r.to-r.from)/vh).toFixed(2)} viewports (y ${r.from}..${r.to})`).join(', ')
      : '  no sparse-and-moving runs: every empty stretch is a held stop');
}));
await b.close();
