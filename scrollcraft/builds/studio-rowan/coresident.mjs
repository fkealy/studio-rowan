import { chromium } from 'playwright-core';
const URL='http://localhost:4175/preview-2/';
const W=+(process.env.W||1440), H=+(process.env.H||900);
const b=await chromium.launch({channel:'chrome'});
const p=await (await b.newContext({viewport:{width:W,height:H}})).newPage();
await p.goto(URL,{waitUntil:'networkidle'});
await p.waitForTimeout(1200);
console.log(URL,`${W}x${H}`);
console.log(await p.evaluate(async ()=>{
  const vh=innerHeight, STEP=25, H2=document.documentElement.scrollHeight;
  const secs=[...document.querySelectorAll('main > section')];
  const rows=[];
  for(let y=0;y<=H2-vh;y+=STEP){
    scrollTo({top:y,behavior:'instant'});
    await new Promise(r=>requestAnimationFrame(r));
    const live=new Set(); const chs=new Set();
    secs.forEach((s,i)=>{
      const els=[...s.querySelectorAll('h1,h2,h3,p,li,dd,figcaption')].filter(e=>e.offsetParent!==null&&!e.closest('.sr-only'));
      for(const e of els){
        if(parseFloat(getComputedStyle(e).opacity)<0.3) continue;
        const r=e.getBoundingClientRect();
        if(r.bottom<=4||r.top>=vh-4||r.height<4) continue;
        live.add(i); chs.add(s.dataset.ch||('#'+i)); break;
      }
    });
    rows.push({y, secs:[...live], chs:[...chs]});
  }
  // contiguous runs where 2+ chapters are readable at once
  const runs=[]; let cur=null;
  for(const r of rows){
    if(r.chs.length>1){ if(!cur) cur={from:r.y,to:r.y,chs:new Set(r.chs)}; else {cur.to=r.y; r.chs.forEach(c=>cur.chs.add(c));} }
    else if(cur){ runs.push(cur); cur=null; }
  }
  if(cur) runs.push(cur);
  const multi=rows.filter(r=>r.chs.length>1).length;
  let out=`  frames with 2+ chapters readable at once: ${multi}/${rows.length} (${(100*multi/rows.length).toFixed(1)}%)\n`;
  out+=runs.map(r=>`    ${((r.to-r.from+25)/vh).toFixed(2)}vh  y ${r.from}..${r.to}  [${[...r.chs].join(' + ')}]`).join('\n');
  // same for 2+ sections (looser)
  const ms=rows.filter(r=>r.secs.length>1).length;
  out+=`\n  frames with 2+ sections readable at once: ${ms}/${rows.length} (${(100*ms/rows.length).toFixed(1)}%)`;
  return out;
}));
await b.close();
