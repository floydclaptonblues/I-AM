import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { dialogues, DialogueJourney, opening, subjects } from '../../dialogue.js';

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
const choose = async (page,id) => {
  if (!await page.locator('[data-question="'+id+'"]').count()) {
    const subject = subjects.find(subject => subject.questions.includes(id));
    if (!await page.locator('[data-subject="'+subject.id+'"]').count()) {
      await page.getByRole('button',{name:'Ask about something else',exact:true}).click();
    }
    await page.locator('[data-subject="'+subject.id+'"]').click();
  }
  await page.locator('[data-question="'+id+'"]').click();
};
async function open(t, {width=390,height=844,route=[],muted=true,reduced=false,mock=true,nativeFallback=false,mobile=false}={}) {
  const context = await browser.newContext({ viewport:{width,height}, isMobile:mobile, hasTouch:mobile, reducedMotion:reduced?'reduce':'no-preference' });
  t.after(()=>context.close());
  await context.addInitScript(({conversation,muted,mock,nativeFallback})=>{
    if(nativeFallback) Object.defineProperty(window,'ImageDecoder',{value:undefined,configurable:true});
    if(!localStorage.getItem('i-am.garden.session')) localStorage.setItem('i-am.garden.session',JSON.stringify({version:1,conversation,muted,still:false}));
    if(mock) {
      window.testTracks=[];
      Object.defineProperty(window,'speechSynthesis',{value:{speak(){throw new Error('Device voice must never be used');}},configurable:true});
      const originalPlay=HTMLMediaElement.prototype.play, originalPause=HTMLMediaElement.prototype.pause;
      HTMLMediaElement.prototype.play=function(){
        if(this.id!=='voice-track') return originalPlay.call(this);
        this.testActive=true;
        Object.defineProperty(this,'paused',{configurable:true,get:()=>!this.testActive});
        window.testTracks.push(this);
        queueMicrotask(()=>{ if(this.testActive) this.dispatchEvent(new Event('playing')); });
        return Promise.resolve();
      };
      HTMLMediaElement.prototype.pause=function(){
        if(this.id!=='voice-track') return originalPause.call(this);
        this.testActive=false;
      };
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
  assert.deepEqual(report.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),[]);
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
  await page.locator('[data-subject="god"]').click();
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
  await page.waitForFunction(()=>testTracks.length>0);
  await page.evaluate(()=>{const audio=testTracks.at(-1);audio.dispatchEvent(new Event('playing'));});
  assert.ok(await page.locator('.spoken-sentence').count());
  assert.equal(await page.locator('#answer-visual').textContent(),text);
  assert.equal(await page.locator('#answer-accessible').textContent(),text);
  assert.deepEqual(await page.locator('#answer-visual').boundingBox(),before);
  await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>document.activeElement.id),'mute');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#voice-track').evaluate(audio=>audio.paused),true);
  assert.equal(await page.locator('#answer-accessible').textContent(),text);
  assert.equal(await page.locator('.spoken-word').count(),0);
  await audit(page,'answer');
});

test('speech failure retains the complete answer and releases controls',async t=>{
  const page=await open(t,{muted:false});await page.locator('[data-subject="garden"]').click();
  await page.waitForFunction(()=>testTracks.length>0);
  await page.evaluate(()=>testTracks.at(-1).dispatchEvent(new Event('error')));
  assert.equal(await page.locator('#answer-accessible').textContent(),dialogues.find(d=>d.id==='garden-story').text);
  assert.equal(await page.locator('#stop').isDisabled(),true);
});

test('a challenge appears after both claims and stays in Review once asked',async t=>{
  const page=await open(t,{route:['evil','darkness','before-humans','why-wait']});
  assert.equal(await page.locator('[data-question="alone-with-lights"]').count(),0);
  await choose(page,'other-lights');await choose(page,'alone-with-lights');
  const answer=await page.locator('#answer-accessible').textContent();
  await page.reload();assert.equal(await page.locator('#answer-accessible').textContent(),answer);
  await page.locator('#back-questions').click();
  assert.equal(await page.locator('[data-question="alone-with-lights"]').count(),0);
  await page.getByRole('button',{name:'Ask about something else',exact:true}).click();
  await page.locator('[data-subject="serpent"]').click();
  const challenge=page.locator('[data-question="alone-with-lights"]');
  assert.equal(await challenge.count(),0);
  await page.locator('.utilities summary').click();
  await page.locator('#review').click();
  assert.ok((await page.locator('#history').innerText()).includes(answer));
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
  for(const action of ['stop','back','restart']) {
    const page=await open(t,{route:finaleRoute});
    await choose(page,'you-darkness');
    if(action==='back') {
      await page.locator('#back-questions').click();
      assert.equal(await page.locator('#answer-accessible').textContent(),'What else would I be?');
      assert.equal(await page.locator('[data-question="you-darkness"]').count(),0);
    } else if(action==='restart') {
      await page.locator('.utilities summary').click();await page.locator('#restart').click();
      assert.equal(await page.locator('body.held-gaze').count(),0);
      await page.locator('#confirm-restart').click();
      assert.equal(await page.locator('#answer-accessible').textContent(),opening);
    } else await page.locator('#stop').click();
    assert.equal(await page.locator('body.held-gaze').count(),0);
    assert.equal(await page.locator('#question-list').isVisible(),true);
    if(action==='restart') {
      await page.waitForTimeout(3300);
      assert.equal(await page.locator('#answer-accessible').textContent(),opening);
    }
  }
});

test('quiet spoken finale keeps mouth closed; failure and reduced motion release all temporary state',async t=>{
  const page=await open(t,{route:finaleRoute,muted:false,reduced:true});
  await choose(page,'you-darkness');
  await page.waitForFunction(()=>testTracks.length>0);
  const voice=await page.evaluate(()=>{const audio=testTracks.at(-1);audio.dispatchEvent(new Event('playing'));return {rate:audio.playbackRate,volume:audio.volume};});
  assert.deepEqual(voice,{rate:0.85,volume:0.55});
  assert.equal(await page.locator('#portrait').getAttribute('data-mouth'),'closed');
  await page.evaluate(()=>testTracks.at(-1).dispatchEvent(new Event('error')));
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
  assert.deepEqual(await page.locator('#question-list button').evaluateAll(nodes=>nodes.map(node=>node.dataset.subject)),
    ['universe','garden','god','humanity','serpent']);
  await page.locator('[data-subject="garden"]').click();
  const previous=await page.locator('#answer-accessible').textContent();
  await page.getByRole('button',{name:'Ask about something else',exact:true}).click();
  assert.equal(await page.locator('#answer-accessible').textContent(),previous);
  assert.equal(await page.locator('[data-subject="universe"]').count(),1);
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.subject),'universe');
  await page.reload();
  assert.equal(await page.locator('#answer-accessible').textContent(),previous);
  await page.getByRole('button',{name:'Return to follow-up questions',exact:true}).click();
  assert.equal(await page.locator('#subject-title').textContent(),'The Garden');
  assert.equal(await page.locator('[data-question="death"]').count(),0);
  assert.equal(await page.locator('[data-subject="humanity"]').count(),1);
  await page.getByRole('button',{name:'Ask about something else',exact:true}).click();
  await choose(page,'before-humans');
  assert.equal(await page.locator('#answer-accessible').textContent(),dialogues.find(d=>d.id==='before-humans').text);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'caption');
  await page.getByRole('button',{name:'Go back to the previous questions',exact:true}).click();
  assert.equal(await page.locator('#answer-accessible').textContent(),previous);
  assert.equal(await page.locator('#subject-title').textContent(),'The Garden');
  assert.equal(await page.locator('[data-question="death"]').count(),0);
  assert.equal(await page.locator('[data-subject="humanity"]').count(),1);
  const focusBounds=await page.evaluate(()=>({
    question:document.activeElement.getBoundingClientRect().top,
    portrait:document.querySelector('.upper-deck').getBoundingClientRect().bottom
  }));
  assert.ok(focusBounds.question>=focusBounds.portrait,JSON.stringify(focusBounds));
  await page.screenshot({path:results+'/change-subject-320.png',fullPage:true});
  await audit(page,'change-subject');
});


test('subject menus work with number keys, preserve the answer, and restore after refresh', async t => {
  const page = await open(t,{width:320,height:568,muted:false});
  const invitation = await page.locator('#answer-accessible').textContent();
  await page.keyboard.press('1');
  assert.equal(await page.locator('#subject-title').textContent(),'The Universe');
  assert.equal(await page.locator('#answer-accessible').textContent(),invitation);
  assert.equal(await page.evaluate(()=>testTracks.length),0);
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.question),'before-humans');
  await page.reload();
  assert.equal(await page.locator('#subject-title').textContent(),'The Universe');
  assert.equal(await page.locator('[data-question="you-darkness"]').count(),0);
  await audit(page,'subject-universe');
  await page.screenshot({path:results+'/subject-universe-320.png',fullPage:true});
  await page.getByRole('button',{name:'Return to subjects',exact:true}).click();
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.subject),'universe');
  await page.keyboard.press('2');
  assert.equal(await page.locator('#subject-title').textContent(),'The Garden');
  assert.equal(await page.locator('[data-question="test"]').count(),0);
  assert.equal(await page.locator('#answer-accessible').textContent(),dialogues.find(d=>d.id==='garden-story').text);
  assert.equal(await page.locator('[data-subject="universe"]').count(),1);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'caption');
});


for (const width of [390,1366]) {
  test('real David audio plays, stops and replays at width '+width,async t=>{
    const page=await open(t,{width,height:844,muted:false,mock:false,mobile:width===390});
    await page.locator('[data-subject="garden"]').click();
    await page.waitForFunction(()=>{const a=document.getElementById('voice-track');return !a.paused&&a.currentTime>.2;});
    const source=await page.locator('#voice-track').evaluate(a=>({src:a.currentSrc,voice:a.dataset.voice,duration:a.duration}));
    assert.match(source.src,/garden-story-[a-f0-9]+\.mp3$/);assert.equal(source.voice,'microsoft-david');assert.ok(source.duration>2);
    assert.ok(await page.locator('.spoken-sentence').count());
    await page.waitForFunction(()=>['partial','open'].includes(document.getElementById('portrait').dataset.mouth));
    await page.locator('#stop').click();
    assert.equal(await page.locator('#voice-track').evaluate(a=>a.paused),true);
    assert.equal(await page.locator('#portrait').getAttribute('data-mouth'),'closed');
    await page.locator('#listen').click();
    await page.waitForFunction(()=>document.getElementById('voice-track').currentTime>.2);
    await page.locator('#mute').click();
    assert.equal(await page.locator('#voice-track').evaluate(a=>a.paused),true);
    assert.equal(await page.locator('#answer-accessible').textContent(),dialogues.find(d=>d.id==='garden-story').text);
  });
}
test('unavailable recording keeps complete text without selecting a device voice',async t=>{
  const page=await open(t,{muted:false,mock:false});
  await page.route('**/assets/audio/*.mp3',route=>route.abort());
  await page.locator('[data-subject="garden"]').click();
  await page.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Voice unavailable.'));
  assert.equal(await page.locator('#stop').isDisabled(),true);
  assert.equal(await page.locator('#answer-accessible').textContent(),dialogues.find(d=>d.id==='garden-story').text);
});

test('mobile jaw follows jumps in audio time, holds vowels, and closes for silence or buffering',async t=>{
  const page=await open(t,{width:390,height:844,mobile:true,muted:false});
  await page.locator('[data-subject="garden"]').click();await page.waitForFunction(()=>testTracks.length>0);
  const manifest=JSON.parse(await readFile(new URL('../../assets/audio/manifest.json',import.meta.url),'utf8'));
  const clip=manifest.clips['garden-story'],levels=Buffer.from(clip.mouth.levels,'base64');
  const loud=levels.findIndex(value=>value>210)*clip.mouth.step;
  const quiet=levels.findIndex((value,i)=>i>10&&value===0&&levels[i-1]===0&&levels[i+1]===0)*clip.mouth.step;
  assert.ok(loud>0&&quiet>0);
  const seek=async time=>page.evaluate(time=>{
    const audio=document.getElementById('voice-track');
    Object.defineProperty(audio,'currentTime',{value:time,writable:true,configurable:true});
    audio.dispatchEvent(new Event('timeupdate'));
  },time);
  await seek(loud);assert.equal(await page.locator('#portrait').getAttribute('data-mouth'),'open');
  await page.waitForTimeout(260);
  assert.equal(await page.locator('#portrait').getAttribute('data-mouth'),'open','No fixed flap timer closes a held sound');
  await seek(quiet);assert.equal(await page.locator('#portrait').getAttribute('data-mouth'),'closed');
  await seek(loud);
  await page.locator('#voice-track').evaluate(audio=>audio.dispatchEvent(new Event('waiting')));
  assert.equal(await page.locator('#portrait').getAttribute('data-mouth'),'closed');
  await page.locator('#voice-track').evaluate(audio=>audio.dispatchEvent(new Event('playing')));
  assert.equal(await page.locator('#portrait').getAttribute('data-mouth'),'open');
  await page.locator('#stop').click();
  assert.equal(await page.locator('#portrait').getAttribute('data-mouth'),'closed');
});

test('a fresh visitor can follow the shadow from the Garden to the held gaze',async t=>{
  const page=await open(t,{width:390,height:844,mobile:true});
  await page.getByRole('button',{name:'The Garden',exact:true}).click();
  assert.equal(await page.locator('#answer-accessible').textContent(),dialogues.find(d=>d.id==='garden-story').text);
  assert.equal(await page.locator('#question-list [data-question]').count(),0);
  await page.getByRole('button',{name:'Follow the shadow into The Universe',exact:true}).click();
  for(const id of ['shadows','certain-light','you-darkness']){
    const first=page.locator('#question-list button').first();
    assert.equal(await first.getAttribute('data-question'),id);
    await first.click();
  }
  assert.equal(await page.locator('#answer-accessible').textContent(),'');
  await page.waitForFunction(()=>document.getElementById('answer-accessible').textContent==='Who told you to ask me that?');
});

test('Universe ends a thread at its remaining questions, also after refresh and Back', async t => {
  const page = await open(t,{width:390,height:844,mobile:true});
  await page.getByRole('button',{name:'The Universe',exact:true}).click();
  for (const name of ['What did you do before humans?', 'Who else was waiting with you?',
    'If you couldn’t see beyond your own light, how did you know the others were there?', 'What did the other lights sound like?']) {
    await page.getByRole('button',{name,exact:true}).click();
  }
  assert.equal(await page.locator('#section-menu-note').innerText(),'Main questions');
  const remaining = await page.locator('#question-list [data-question]').evaluateAll(buttons => buttons.map(b => b.dataset.question));
  assert.deepEqual(remaining, ['before-light','why-wait','names-of-lights']);
  await page.reload();
  assert.equal(await page.locator('#section-menu-note').isVisible(),true);
  await page.getByRole('button',{name:'Go back to the previous questions'}).click();
  assert.equal(await page.locator('[data-question="voices-of-lights"]').count(),0);
  await page.getByRole('button',{name:'Did the other lights have names?'}).click();
  assert.match(await page.locator('#answer-accessible').textContent(),/^You gave them names/);
});

test('God returns to its unanswered main questions after the serpent describes putting out his light',async t=>{
  const page=await open(t,{width:390,height:844,mobile:true,muted:false,mock:false});
  const ask=name=>page.getByRole('button',{name,exact:true}).click();
  await ask('God');
  await ask('What do you hold against God?');
  await ask('What was it like where God sent you?');
  await ask('Did God abandon you?');
  await ask('If you could put out your light, would you?');
  await page.waitForFunction(()=>{const audio=document.getElementById('voice-track');return audio.currentSrc.includes('/quiet-light-')&&audio.currentTime>.15;});
  const buttons=page.locator('#question-list [data-question]');
  assert.deepEqual(await buttons.evaluateAll(items=>items.map(item=>item.dataset.question)),['father-brighter']);
  assert.equal(await page.locator('#section-menu-note').innerText(),'Main questions');
  assert.match(await page.locator('#answer-accessible').textContent(),/^For one breath/);
  await page.reload();
  assert.deepEqual(await buttons.evaluateAll(items=>items.map(item=>item.dataset.question)),['father-brighter']);
  await ask('Go back to the previous questions');
  assert.equal(await page.locator('[data-question="quiet-light"]').count(),0);
  await ask('Was God’s light brighter than yours?');
  await ask('Does God know what lies in the darkness?');
  await ask('Do you believe him?');
  await ask('What do you want from God?');
  await ask('Would an answer be enough for you now?');
  await page.waitForFunction(()=>{const audio=document.getElementById('voice-track');return audio.currentSrc.includes('/say-my-name-')&&audio.currentTime>.15;});
  assert.equal(await buttons.count(),0);
  assert.equal(await page.locator('#section-menu-note').innerText(),'You’ve asked all the God questions available here.');
  assert.match(await page.locator('#answer-accessible').textContent(),/^Let him say my name first/);
  await ask('Ask about something else');
  await ask('God');
  assert.equal(await buttons.count(),0);
});

test('Humanity returns to its remaining questions with the last reply and recorded voice intact', async t=>{
  const page=await open(t,{width:390,height:844,mobile:true,muted:false,mock:false});
  const ask=name=>page.getByRole('button',{name,exact:true}).click();
  await ask('Humanity');
  await ask('Why did we stand upright?');
  await ask('What did we do with our hands once they were free?');
  await ask('How did we first come to understand death?');
  await ask('Why did we bury our dead?');
  await ask('What made you think a burial could be an act of love?');
  await page.waitForFunction(()=>{const a=document.getElementById('voice-track');return a.currentSrc.includes('/burial-love-')&&a.currentTime>.15;});
  assert.match(await page.locator('#answer-accessible').textContent(),/bring news to the dead/);
  const list=()=>page.locator('#question-list [data-question]').evaluateAll(nodes=>nodes.map(n=>n.dataset.question));
  const remaining=['called-back','human','purpose','remember'];
  assert.deepEqual(await list(),remaining);
  assert.equal(await page.locator('#section-menu-note').innerText(),'Main questions');
  await page.reload();
  assert.deepEqual(await list(),remaining);
  await ask('Go back to the previous questions');
  assert.deepEqual(await list(),['remember']);
  await ask('Ask about something else'); await ask('Humanity');
  await ask('What were our hands meant for?'); await ask('Why do we have to work?');
  await ask('Would you have had us break those promises?');
  await page.waitForFunction(()=>{const a=document.getElementById('voice-track');return a.currentSrc.includes('/kept-promise-')&&a.currentTime>.15;});
  assert.deepEqual(await list(),['free']);
  await ask('Are we free?');
  assert.equal(await page.locator('#section-menu-note').innerText(),'Main questions');
  assert.ok((await list()).includes('hurry'));
  assert.equal(await page.locator('[data-question="kept-promise"]').count(),0);
});

test('I Am follows names and permission, plays both new recordings, and keeps unasked forks', async t=>{
  const page=await open(t,{width:390,height:844,mobile:true,muted:false,mock:false});
  const ask=name=>page.getByRole('button',{name,exact:true}).click();
  const list=()=>page.locator('#question-list [data-question]').evaluateAll(nodes=>nodes.map(n=>n.dataset.question));
  await ask('I Am'); await ask('Who are you?'); await ask('What did you call yourself before we named you?');
  await page.waitForFunction(()=>{const a=document.getElementById('voice-track');return a.currentSrc.includes('/first-name-')&&a.currentTime>.15;});
  await ask('Are you still alone, even with me here?');
  assert.match(await page.locator('#answer-accessible').textContent(),/Tell me something I could not have invented/);
  assert.deepEqual(await list(),['lied','age','light']);
  assert.equal(await page.locator('#section-menu-note').innerText(),'Main questions');
  await page.reload(); assert.deepEqual(await list(),['lied','age','light']);
  await ask('Go back to the previous questions'); assert.deepEqual(await list(),['light']);
  await ask('Ask about something else'); await ask('I Am');
  await ask('Have you ever lied to us?'); await ask('How could you tell when we wanted permission?');
  await page.waitForFunction(()=>{const a=document.getElementById('voice-track');return a.currentSrc.includes('/permission-')&&a.currentTime>.15;});
  await ask('Then why should we believe you?');
  assert.deepEqual(await list(),['age','light']);
  assert.equal(await page.locator('#section-menu-note').innerText(),'Main questions');
});
