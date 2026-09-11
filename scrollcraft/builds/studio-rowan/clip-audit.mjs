import { chromium } from 'playwright-core';
const URL='http://localhost:4175/preview-2/';
const b=await chromium.launch({channel:'chrome'});
for (const [w,h] of (process.env.SIZES||'1440x900').split(',').map(s=>s.split('x').map(Number))){
  const p=await (await b.newContext({viewport:{width:w,height:h}})).newPage();
  await p.goto(URL,{waitUntil:'networkidle'});
  await p.waitForTimeout(1400);
  const out=await p.evaluate(async ()=>{
    const bad=[];
    for(const sec of [...document.querySelectorAll('main > section')]){
      const act=sec.getAttribute('data-sc-act');
      if(act!=='pin'&&act!=='scrub') continue;
      const st=sec.querySelector('[data-sc-stage]'); if(!st) continue;
      const top=sec.getBoundingClientRect().top+scrollY, span=sec.offsetHeight-innerHeight;
      let worst=0, who='', at=0;
      // walk the whole pin: a thing is only "clipped" if it is VISIBLE and outside
      for(let k=0;k<=20;k++){
        scrollTo({top:Math.round(top+span*(k/20)),behavior:'instant'});
        await new Promise(r=>requestAnimationFrame(r));
        await new Promise(r=>setTimeout(r,60));
        const sr=st.getBoundingClientRect();
        sec.querySelectorAll('[data-sc-stage] *').forEach(e=>{
          if(e.offsetParent===null||e.closest('.sr-only')) return;
          // effective opacity: a span inside an unrevealed <p> still computes 1
          let o=1, n=e;
          while(n && n!==document.body){ o*=parseFloat(getComputedStyle(n).opacity); n=n.parentElement; }
          if(o<0.5) return;   // not revealed yet
          const r=e.getBoundingClientRect();
          if(r.height<2) return;
          const cut=Math.max(r.bottom-sr.bottom, sr.top-r.top);
          if(cut>worst){worst=cut;who=(e.textContent||e.tagName).trim().slice(0,26);at=k/20;}
        });
      }
      if(worst>1) bad.push({id:sec.id||'inter',cut:Math.round(worst),at,who});
    }
    return bad;
  });
  console.log(`${String(w+'x'+h).padEnd(9)} ${out.length? 'CLIPPED '+JSON.stringify(out) : 'no visible content outside any stage'}`);
  await p.context().close();
}
await b.close();
