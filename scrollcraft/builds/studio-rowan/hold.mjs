import { chromium } from 'playwright-core';
const URL = process.env.AUDIT_URL || 'http://localhost:4175/preview-2/';
const b = await chromium.launch({channel:'chrome'});
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto(URL,{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
console.log(URL);
console.log(await p.evaluate(async ()=>{
  // For each chapter heading: how much scroll passes while the line stays
  // within 2px of the same place on screen? That is the size of the stop.
  const heads=[...document.querySelectorAll('.inter h2')];
  const out=[];
  const H=document.documentElement.scrollHeight;
  const seen=heads.map(()=>({held:0, last:null, run:0, best:0}));
  for (let y=0; y<=H-innerHeight; y+=20) {
    scrollTo({top:y,behavior:'instant'});
    await new Promise(r=>requestAnimationFrame(r));
    heads.forEach((h,i)=>{
      const r=h.getBoundingClientRect();
      const onScreen = r.bottom>0 && r.top<innerHeight;
      const st=seen[i];
      if (!onScreen) { st.last=null; st.run=0; return; }
      if (st.last!==null && Math.abs(r.top-st.last)<=2) { st.run+=20; if(st.run>st.best) st.best=st.run; }
      else st.run=0;
      st.last=r.top;
    });
  }
  heads.forEach((h,i)=>out.push(
    `  "${h.textContent.trim()}" held still for ${seen[i].best}px = ${(seen[i].best/innerHeight).toFixed(2)} viewports of scroll`));
  return out.join('\n');
}));
await b.close();
