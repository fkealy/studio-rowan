import { chromium } from 'playwright-core';

const URL = process.env.AUDIT_URL || 'http://localhost:4175/preview-2/';

async function audit(label, vw, vh) {
  const b = await chromium.launch({channel:'chrome'});
  const p = await (await b.newContext({viewport:{width:vw,height:vh}})).newPage();
  const warns = [];
  p.on('console', m => { if (m.type()==='warning') warns.push(m.text()); });
  await p.goto(URL, {waitUntil:'networkidle'});
  await p.waitForTimeout(1200);
  // Warm the page: scroll it through once so every counter has run and any
  // content-driven relayout has already happened. Auditing a cold page walks
  // it while the geometry is still settling and measures the settling, not
  // the page.
  await p.evaluate(async ()=>{
    const h=document.documentElement.scrollHeight;
    for(let y=0;y<h;y+=400){ scrollTo({top:y,behavior:'instant'}); await new Promise(r=>setTimeout(r,20)); }
    scrollTo({top:0,behavior:'instant'});
  });
  await p.waitForTimeout(1800);

  const acts = await p.evaluate(()=>ScrollCraft.instances[0].acts.map((a,idx)=>({
    idx,
    id:a.el.id||'(no id)', device:a.device, pinned:a.pinned, span:a.span,
    top:Math.round(a.top), height:Math.round(a.height),
    hasStage:!!a.stage,
    stagePos: a.stage ? getComputedStyle(a.stage).position : null,
    padTop: parseFloat(getComputedStyle(a.el).paddingTop),
    padBottom: parseFloat(getComputedStyle(a.el).paddingBottom),
    contentH: a.stage ? Math.round(a.stage.firstElementChild?.scrollHeight||0) : 0,
  })));

  console.log(`\n===== ${label}  (${vw}x${vh}) =====`);
  for (const a of acts) {
    if (!a.pinned) { console.log(`  ${a.id.padEnd(6)} flow   ${a.device}`); continue; }

    // Walk the act and record where the stage actually sits.
    const trace = await p.evaluate(async (idx)=>{
      const a = ScrollCraft.instances[0].acts[idx];
      const out=[];
      for (let i=0;i<=10;i++){
        const f=i/10;
        scrollTo({top:a.top+(a.height-innerHeight)*f, behavior:'instant'});
        await new Promise(r=>setTimeout(r,320));
        out.push({st:Math.round(a.stage.getBoundingClientRect().top),
                  want:Math.round(a.top+(a.height-innerHeight)*f),
                  got:Math.round(scrollY)});
      }
      return out;
    }, a.idx);

    const drift = trace.map(t=>t.got-t.want);
    const stuckFrames = trace.filter(t=>t.st===0).length;
    const overflow = a.contentH - vh;
    let verdict = 'OK';
    if (a.stagePos !== 'sticky') verdict = 'NOT STICKY';
    else if (stuckFrames < 9) verdict = `SLIPS (${11-stuckFrames}/11 samples off top)`;
    console.log(`  ${a.id.padEnd(6)} pin/${a.device.padEnd(6)} span ${String(a.span).padEnd(4)} pad ${a.padTop}/${a.padBottom}  ` +
                `stageTop: [${trace.map(t=>t.st).join(', ')}]  scrollDrift: [${drift.join(', ')}]`);
    console.log(`         content ${a.contentH}px vs viewport ${vh}px` +
                (overflow>4 ? `  >>> ${overflow}px CLIPPED AND UNREACHABLE` : '  (fits)') +
                `   => ${verdict}`);
  }
  if (warns.length) console.log('  engine warnings:', warns.join(' | '));
  await b.close();
}

await audit('DESKTOP', 1440, 900);
await audit('MOBILE', 390, 844);
