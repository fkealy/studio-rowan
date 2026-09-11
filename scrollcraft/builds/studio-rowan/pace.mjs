import { chromium } from 'playwright-core';
const URL = process.env.AUDIT_URL || 'http://localhost:4175/preview-2/';
const W = +(process.env.W||1440), H = +(process.env.H||900);
const b = await chromium.launch({channel:'chrome'});
const p = await (await b.newContext({viewport:{width:W,height:H}})).newPage();
await p.goto(URL,{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
console.log(URL, `${W}x${H}`);
const rows = await p.evaluate(async ()=>{
  const vh = innerHeight;
  const acts = [...document.querySelectorAll('main > section')];
  const meta = acts.map((s,i)=>{
    const r = s.getBoundingClientRect();
    const top = r.top + scrollY;
    // words of real reading copy (exclude sr-only, cite notes, generated stack)
    const txt = [...s.querySelectorAll('h1,h2,h3,p,li,dd,dt,figcaption,b,span.d')]
      .filter(e=>!e.closest('.sr-only') && !e.closest('.press__stack') && !e.closest('[aria-hidden="true"]') && e.offsetParent!==null)
      .filter(e=>!e.querySelector('h1,h2,h3,p,li'))
      .map(e=>e.textContent.trim()).join(' ');
    const words = (txt.match(/[A-Za-z0-9’'£$%,.-]+/g)||[]).length;
    return {
      i, id:s.id||'', cls:s.className,
      ch: s.dataset.ch||'', act: s.dataset.scAct||'flow', span: s.dataset.scSpan||'',
      top, h: s.offsetHeight, hv: +(s.offsetHeight/vh).toFixed(2),
      words,
      label: (s.querySelector('h1,h2,h3')?.textContent.trim()||s.className).slice(0,42)
    };
  });
  // walk the page, per act: how many samples have the act's own copy stationary
  const H2 = document.documentElement.scrollHeight;
  const state = acts.map(()=>({on:0, held:0, last:null}));
  const STEP = 20;
  for (let y=0; y<=H2-vh; y+=STEP) {
    scrollTo({top:y,behavior:'instant'});
    await new Promise(r=>requestAnimationFrame(r));
    acts.forEach((s,i)=>{
      // anchor = topmost visible text node belonging to this act
      const els = [...s.querySelectorAll('h1,h2,h3,p,li,figcaption')].filter(e=>e.offsetParent!==null);
      let anchor=null;
      for (const e of els) {
        if (parseFloat(getComputedStyle(e).opacity)<0.3) continue;
        const r=e.getBoundingClientRect();
        if (r.bottom<=0||r.top>=vh||r.height<4) continue;
        if (anchor===null||r.top<anchor) anchor=r.top;
      }
      const st=state[i];
      if (anchor===null){ st.last=null; return; }
      st.on += STEP;
      if (st.last!==null && Math.abs(anchor-st.last)<=2) st.held += STEP;
      st.last = anchor;
    });
  }
  return meta.map((m,i)=>({...m,
    onPx: state[i].on, onVh:+(state[i].on/vh).toFixed(2),
    heldPx: state[i].held, heldVh:+(state[i].held/vh).toFixed(2),
    vhPer100: m.words? +((state[i].on/vh)/(m.words/100)).toFixed(2) : null,
    totalVh: +(H2/vh).toFixed(2)
  }));
});
const pad=(s,n)=>String(s).padEnd(n);
const rpad=(s,n)=>String(s).padStart(n);
console.log(pad('#',3)+pad('ch',7)+pad('act',7)+rpad('span',6)+rpad('ownVh',7)+rpad('words',7)+rpad('onVh',7)+rpad('heldVh',8)+rpad('vh/100w',9)+'  label');
for (const r of rows) console.log(
  pad(r.i,3)+pad(r.ch,7)+pad(r.act,7)+rpad(r.span||'-',6)+rpad(r.hv,7)+rpad(r.words,7)+rpad(r.onVh,7)+rpad(r.heldVh,8)+rpad(r.vhPer100??'-',9)+'  '+r.label);
console.log('\npage total:', rows[0].totalVh,'vh');
await b.close();
