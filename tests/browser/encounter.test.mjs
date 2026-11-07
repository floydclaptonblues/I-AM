import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { dialogues, DialogueJourney, opening } from '../../dialogue.js';

const require = createRequire(import.meta.url);
const base = process.env.BASE_URL || 'http://127.0.0.1:4173/';
const results = process.env.SCREENSHOT_DIR || 'test-results';
let browser, server;
before(async () => {
  await mkdir(results, { recursive: true });
  if (!process.env.BASE_URL) {
    server = spawn(process.execPath, ['scripts/serve.mjs'], { stdio: ['ignore','pipe','pipe'] });
    await new Promise((resolve,reject) => {
      const timeout=setTimeout(()=>reject(new Error('Preview startup timed out')),10000);
      server.stdout.once('data',()=>{clearTimeout(timeout);resolve();});
      server.once('exit',code=>{clearTimeout(timeout);reject(new Error('Preview exited: '+code));});
    });
  }
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel:process.env.BROWSER_CHANNEL } : {}) });
});
after(async () => { await browser?.close(); server?.kill(); });

function savedJourney(route=[]) {
  const journey = new DialogueJourney();
  for(const id of route) {
    if(id==='BACK') journey.back();
    else if(id==='FIRST') journey.firstQuestions();
    else assert.ok(journey.choose(id), 'Invalid test route: '+id);
  }
  return journey.snapshot();
}
const finaleRoute=['identity','age','before-humans','why-wait','before-light','father-brighter','god-knows','believe-father','want-god','fill-darkness','darkness-end','nothing-darkness','darkness-ended','called-back','happy','certain-light'];
const choose = (page,id) => page.locator('[data-question="'+id+'"]').click();
async function open(t, {width=390,height=844,route=[],muted=true,reduced=false,mock=true,nativeFallback=false}={}) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:reduced?'reduce':'no-preference' });
  t.after(()=>context.close());
  await context.addInitScript(({conversation,muted,mock,nativeFallback})=>{
    if(nativeFallback) Object.defineProperty(window,'ImageDecoder',{value:undefined,configurable:true});
    if(!localStorage.getItem('i-am.garden.session')) localStorage.setItem('i-am.garden.session',JSON.stringify({version:1,conversation,muted,still:false}));
    if(mock) {
      window.testUtterances=[]; window.testCancels=0;
      Object.defineProperty(window,'SpeechSynthesisUtterance',{value:class { constructor(text){this.text=text;} },configurable:true});
      Object.defineProperty(window,'speechSynthesis',{value:{paused:false,getVoices:()=>[],cancel(){window.testCancels++;},speak(u){window.testUtterances.push(u);},resume(){}},configurable:true});
    }
  },{conversation:savedJourney(route),muted,mock,nativeFallback});
  const page=await context.newPage();
  page.setDefaultTimeout(15000);
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  t.after(()=>assert.deepEqual(errors,[],'No uncaught browser errors'));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('#question-list button').first().waitFor();
  return page;
}
async function audit(page,name) {
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const report=await page.evaluate(async()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
  await writeFile(results+'/'+name+'-axe.json',JSON.stringify(report,null,2));
  assert.deepEqual(report.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),[]);
}

for(const [width,height] of [[320,568],[375,667],[390,844],[768,1024],[1366,768],[1920,1080]]) {
  test('composition, touch targets, overflow and axe at '+width+'x'+height,async t=>{
    const page=await open(t,{width,height,reduced:true});
    const layout=await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth>innerWidth,
      first:document.querySelector('#question-list button').getBoundingClientRect().bottom,
      answer:document.getElementById('caption').getBoundingClientRect().bottom,
      controls:[...document.querySelectorAll('#mute,#listen,#stop,.utilities summary')].map(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height})),
      panels:['response-scroll','questions'].map(id=>getComputedStyle(document.getElementById(id)).overflowY)
    }));
    assert.equal(layout.overflow,false);
    assert.ok(layout.controls.every(r=>r.width>=24&&r.height>=44));
    assert.ok(layout.panels.every(value=>value==='visible'));
    if(width===320) { assert.ok(layout.first<=height,JSON.stringify(layout)); assert.ok(layout.answer<height); }
    await audit(page,'opening-'+width);
    await page.screenshot({path:results+'/opening-'+width+'x'+height+'.png',fullPage:true});
  });
}

test('keyboard focus receives one complete answer; speech never replaces or rearranges it',async t=>{
  const page=await open(t,{muted:false});
  await page.locator('[data-question="evil"]').focus(); await page.keyboard.press('Enter');
  const text=dialogues.find(d=>d.id==='evil').text;
  assert.equal(await page.locator('#answer-accessible').textContent(),text);
  assert.equal(await page.locator('#answer-visual').textContent(),text);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'caption');
  const readingPosition=await page.evaluate(()=>({answer:document.getElementById('caption').getBoundingClientRect().top,face:document.querySelector('.portrait-screen').getBoundingClientRect().bottom}));
  assert.ok(readingPosition.answer>=readingPosition.face,JSON.stringify(readingPosition));
  assert.equal(await page.locator('#caption').getAttribute('aria-describedby'),'answer-accessible');
  assert.equal(await page.locator('#answer-visual').getAttribute('aria-hidden'),'true');
  assert.equal(await page.locator('#question-list [aria-pressed]').count(),0);
  assert.equal(await page.locator('#caption [aria-live]').count(),0);
  const before=await page.locator('#answer-visual').boundingBox();
  await page.evaluate(()=>{const u=testUtterances.at(-1);u.onstart();u.onboundary({name:'word',charIndex:0,charLength:1});});
  assert.ok(await page.locator('.spoken-word').count());
  assert.equal(await page.locator('#answer-visual').textContent(),text);
  assert.equal(await page.locator('#answer-accessible').textContent(),text);
  assert.deepEqual(await page.locator('#answer-visual').boundingBox(),before);
  await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>document.activeElement.id),'mute');
  await page.keyboard.press('Enter');
  await page.evaluate(()=>{const u=testUtterances.at(-1);u.onboundary({name:'word',charIndex:4,charLength:3});u.onend();});
  assert.equal(await page.locator('#answer-accessible').textContent(),text);
  assert.equal(await page.locator('.spoken-word').count(),0);
  await audit(page,'answer');
});

test('speech failure retains the complete answer and releases controls',async t=>{
  const page=await open(t,{muted:false});await choose(page,'test');
  await page.evaluate(()=>testUtterances.at(-1).onerror({error:'not-allowed'}));
  assert.equal(await page.locator('#answer-accessible').textContent(),dialogues.find(d=>d.id==='test').text);
  assert.equal(await page.locator('#stop').isDisabled(),true);
});

test('contradictions appear only after both claims, persist, and use subdued revisited typography',async t=>{
  const page=await open(t,{route:['evil','darkness','before-humans','why-wait']});
  assert.equal(await page.locator('[data-question="alone-with-lights"]').count(),0);
  await choose(page,'other-lights');await choose(page,'alone-with-lights');
  const answer=await page.locator('#answer-accessible').textContent();
  await page.reload();assert.equal(await page.locator('#answer-accessible').textContent(),answer);
  await page.locator('#back-questions').click();
  const challenge=page.locator('[data-question="alone-with-lights"]');
  assert.equal(await challenge.getAttribute('data-visited'),'true');
  assert.equal(await challenge.locator('span').last().evaluate(el=>getComputedStyle(el).fontStyle),'italic');
  await challenge.click();assert.equal(await page.locator('#answer-accessible').textContent(),answer);
});

test('muted finale keeps face and response together, freezes the displayed frame, and reveals after silence',async t=>{
  const page=await open(t,{width:320,height:568,route:finaleRoute});
  await choose(page,'you-darkness');
  assert.equal(await page.locator('#answer-accessible').textContent(),'');
  assert.equal(await page.locator('#question-list').isHidden(),true);
  assert.equal(await page.locator('#stop').isEnabled(),true);
  const frame=await page.locator('#garden-canvas').evaluate(el=>el.toDataURL());
  await page.waitForTimeout(800);
  assert.equal(await page.locator('#garden-canvas').evaluate(el=>el.toDataURL()),frame);
  assert.equal(await page.locator('#answer-accessible').textContent(),'');
  await page.waitForFunction(()=>document.getElementById('answer-accessible').textContent==='Who told you to ask me that?');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'caption');
  assert.equal(await page.locator('#status').textContent(),'');
  const composition=await page.evaluate(()=>({face:document.querySelector('.portrait-screen').getBoundingClientRect().toJSON(),answer:document.getElementById('caption').getBoundingClientRect().toJSON(),height:innerHeight}));
  assert.ok(composition.face.y>=0&&composition.answer.bottom<=composition.height,JSON.stringify(composition));
  await page.screenshot({path:results+'/finale-320x568.png'});
  await page.locator('#question-list').waitFor({state:'visible'});
  assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('held-gaze')),false);
});

test('Stop, Back and restart clean up an interrupted finale without stale reveals',async t=>{
  const page=await open(t,{route:finaleRoute});
  for(const action of ['stop','back','restart']) {
    if(action!=='stop') await page.locator('#listen').click(); else await choose(page,'you-darkness');
    if(action==='back') {
      await page.locator('#back-questions').click();
      assert.equal(await page.locator('#answer-accessible').textContent(),'What else would I be?');
      await choose(page,'you-darkness');await page.locator('#stop').click();
    } else if(action==='restart') {
      await page.locator('.utilities summary').click();await page.locator('#restart').click();
      assert.equal(await page.locator('body.held-gaze').count(),0);
      await page.locator('#confirm-restart').click();
      assert.equal(await page.locator('#answer-accessible').textContent(),opening);
    } else await page.locator('#stop').click();
    assert.equal(await page.locator('body.held-gaze').count(),0);
    assert.equal(await page.locator('#question-list').isVisible(),true);
  }
  await page.waitForTimeout(3300);
  assert.equal(await page.locator('#answer-accessible').textContent(),opening);
});

test('quiet spoken finale keeps mouth closed; failure and reduced motion release all temporary state',async t=>{
  const page=await open(t,{route:finaleRoute,muted:false,reduced:true});
  await choose(page,'you-darkness');
  await page.waitForFunction(()=>testUtterances.length>0);
  const voice=await page.evaluate(()=>{const u=testUtterances.at(-1);u.onstart();u.onboundary({name:'word',charIndex:0,charLength:3});return {rate:u.rate,volume:u.volume};});
  assert.deepEqual(voice,{rate:0.85,volume:0.55});
  assert.equal(await page.locator('#portrait').getAttribute('data-mouth'),'closed');
  await page.evaluate(()=>testUtterances.at(-1).onerror({error:'synthesis-failed'}));
  assert.equal(await page.locator('body.held-gaze').count(),0);
  assert.equal(await page.locator('body.still').count(),1);
  assert.equal(await page.locator('#question-list').isVisible(),true);
  await audit(page,'finale-reduced-motion');
});

test('a visitor who tabs away during the pause is not pulled back by the reveal',async t=>{
  const page=await open(t,{route:finaleRoute});await choose(page,'you-darkness');
  await page.locator('#listen').focus();
  await page.waitForFunction(()=>document.getElementById('answer-accessible').textContent==='Who told you to ask me that?');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'listen');
  assert.equal(await page.locator('#status').textContent(),'Who told you to ask me that?');
});

test('browsers without ImageDecoder pause the same garden video frame and resume it',async t=>{
  const page=await open(t,{route:finaleRoute,nativeFallback:true});
  try { await page.waitForFunction(()=>document.getElementById('garden-video').currentTime>0.1); }
  catch(error) {
    const video=await page.locator('#garden-video').evaluate(el=>({src:el.currentSrc,paused:el.paused,readyState:el.readyState,error:el.error?.message}));
    throw new Error(JSON.stringify(video),{cause:error});
  }
  await choose(page,'you-darkness');
  const frame=await page.locator('#garden-video').evaluate(el=>({paused:el.paused,time:el.currentTime,hidden:el.hidden}));
  assert.equal(frame.paused,true); assert.equal(frame.hidden,false);
  await page.waitForTimeout(600);
  assert.equal(await page.locator('#garden-video').evaluate(el=>el.currentTime),frame.time);
  await page.locator('#stop').click();
  await page.waitForFunction(time=>document.getElementById('garden-video').currentTime>time,frame.time);
});

test('visitors can change subjects without losing the answer or conversation', async t => {
  const page=await open(t,{width:320,height:568});
  assert.deepEqual(await page.locator('#question-list button').evaluateAll(nodes=>nodes.map(node=>node.dataset.question)),
    ['identity','garden','upright','evil','before-humans','age']);
  await choose(page,'garden');
  await choose(page,'test');
  const previous=await page.locator('#answer-accessible').textContent();
  await page.getByRole('button',{name:'Ask about something else',exact:true}).click();
  assert.equal(await page.locator('#answer-accessible').textContent(),previous);
  assert.equal(await page.locator('[data-question="before-humans"]').count(),1);
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.question),'identity');
  await page.reload();
  assert.equal(await page.locator('#answer-accessible').textContent(),previous);
  await page.getByRole('button',{name:'Return to follow-up questions',exact:true}).click();
  assert.equal(await page.locator('[data-question="death"]').count(),1);
  await page.getByRole('button',{name:'Ask about something else',exact:true}).click();
  await choose(page,'before-humans');
  assert.equal(await page.locator('#answer-accessible').textContent(),dialogues.find(d=>d.id==='before-humans').text);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'caption');
  await page.getByRole('button',{name:'Go back to the previous questions',exact:true}).click();
  assert.equal(await page.locator('#answer-accessible').textContent(),previous);
  assert.equal(await page.locator('[data-question="death"]').count(),1);
  await audit(page,'change-subject');
});
