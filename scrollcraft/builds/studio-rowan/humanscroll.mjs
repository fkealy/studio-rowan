import { chromium } from 'playwright-core';
const URL = process.env.AUDIT_URL || 'http://localhost:4175/preview/';
const b = await chromium.launch({channel:'chrome'});
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto(URL,{waitUntil:'networkidle'});
await p.waitForTimeout(1500);
// One continuous pass down the page in small steps, like a reader.
const bad = await p.evaluate(async ()=>{
  const acts=ScrollCraft.instances[0].acts.filter(a=>a.pinned);
  const problems=[];
  const h=document.documentElement.scrollHeight;
  for (let y=0; y<=h-innerHeight; y+=90) {
    scrollTo({top:y,behavior:'instant'});
    await new Promise(r=>requestAnimationFrame(r));
    for (const a of acts) {
      // While an act owns the screen, its stage must be exactly at the top.
      const inPin = y > a.top + 4 && y < a.top + a.height - innerHeight - 4;
      if (!inPin) continue;
      const t = Math.round(a.stage.getBoundingClientRect().top);
      if (t !== 0) problems.push({act:a.el.id, y, stageTop:t});
    }
  }
  return problems;
});
console.log(URL);
if (!bad.length) console.log('  PASS: every pinned stage held at top 0 for its whole pin, across a continuous scroll.');
else {
  console.log(`  ${bad.length} bad samples:`);
  console.log('  ' + JSON.stringify(bad.slice(0,12)));
}
await b.close();
