import test from 'node:test';
import assert from 'node:assert/strict';
import { HeldResponse } from '../response.js';
import { Narrator } from '../speech.js';
import { Portrait } from '../portrait.js';

function setup({ reduced = false } = {}) {
  let id=0, held;
  const timers=new Map(), frames=[], captions=[], utterances=[], waits=[], holds=[];
  const setTimer=(fn,ms)=>{timers.set(++id,{fn,ms});return id;};
  const clearTimer=id=>timers.delete(id);
  const portrait=new Portrait({setFrame:frame=>frames.push(frame),setTimer,clearTimer,random:()=>0});
  const narrator=new Narrator({synth:{cancel(){},getVoices:()=>[],speak:u=>utterances.push(u)},Utterance:class{constructor(text){this.text=text;}},setTimer,clearTimer,
    onState:state=>{portrait.setSpeaking(state==='speaking'&&!held.active);held.observe(state);},onWord:()=>portrait.pulse('darkness')});
  held=new HeldResponse({setTimer,clearTimer,hold:active=>{holds.push(active);portrait.setStill(active||reduced);},waiting:active=>waits.push(active),reveal:text=>captions.push(text),speak:(text,options)=>narrator.play(text,options),done:()=>{}});
  portrait.start(); portrait.setStill(reduced);
  function fire(ms) {const hit=[...timers].find(([,timer])=>timer.ms===ms);assert.ok(hit,'No timer for '+ms);timers.delete(hit[0]);hit[1].fn();}
  return {held,narrator,portrait,timers,frames,captions,utterances,waits,holds,fire};
}
const answer='Who told you to ask me that?';

test('the held response leaves three seconds of silence before revealing or speaking',()=>{
  const s=setup();s.held.start(answer);
  assert.equal(s.held.active,true);assert.deepEqual(s.captions,['']);assert.equal(s.utterances.length,0);
  assert.equal(s.waits.at(-1),true);assert.equal(s.frames.at(-1),'closed');
  s.fire(3000);assert.equal(s.captions.at(-1),answer);assert.equal(s.waits.at(-1),false);
  assert.equal(s.utterances[0].volume,0.55);assert.equal(s.utterances[0].rate,0.70);assert.equal(s.utterances[0].pitch,0.4 * 2 ** (-2 / 12));
});

test('the mouth and blink stay frozen during speech and normal motion resumes afterward',()=>{
  const s=setup();s.held.start(answer);s.fire(3000);const u=s.utterances[0];u.onstart();
  u.onboundary({name:'word',charIndex:0,charLength:3});
  assert.ok(s.frames.every(frame=>frame==='closed'));assert.ok(![...s.timers.values()].some(t=>t.ms===5700));
  u.onend();assert.equal(s.held.active,false);assert.equal(s.portrait.still,false);
  s.portrait.setSpeaking(true);s.portrait.pulse('darkness');assert.equal(s.frames.at(-1),'open');
});

test('muted responses reveal the exact text, never speak, and release the held gaze',()=>{
  const s=setup();s.held.start(answer,{muted:true});s.fire(3000);
  assert.equal(s.captions.at(-1),answer);assert.equal(s.utterances.length,0);assert.equal(s.held.active,true);
  s.fire(1500);assert.equal(s.held.active,false);assert.equal(s.waits.at(-1),false);
});

test('Stop, mute, navigation, or leaving during the delay invalidate late callbacks',()=>{
  const s=setup();s.held.start(answer);const late=[...s.timers.values()].find(t=>t.ms===3000).fn;
  s.held.cancel();s.narrator.stop();late();
  assert.equal(s.held.active,false);assert.equal(s.utterances.length,0);assert.deepEqual(s.captions,['']);
  assert.ok(![...s.timers.values()].some(t=>t.ms===3000));
});

test('Replay can restart the effect repeatedly without old timers revealing an answer',()=>{
  const s=setup();s.held.start(answer);const stale=[...s.timers.values()].find(t=>t.ms===3000).fn;
  s.held.cancel();s.narrator.stop();s.held.start(answer);stale();assert.equal(s.utterances.length,0);
  s.fire(3000);assert.equal(s.utterances.length,1);s.utterances[0].onstart();s.utterances[0].onend();
  s.held.start(answer);s.fire(3000);assert.equal(s.utterances.length,2);
});

test('failed narration releases the portrait and retains the answer',()=>{
  const s=setup();s.held.start(answer);s.fire(3000);s.utterances[0].onerror({error:'not-allowed'});
  assert.equal(s.held.active,false);assert.equal(s.captions.at(-1),answer);assert.equal(s.portrait.still,false);
});

test('reduced motion remains respected when the special response finishes',()=>{
  const s=setup({reduced:true});s.held.start(answer,{muted:true});s.fire(3000);s.fire(1500);
  assert.equal(s.held.active,false);assert.equal(s.portrait.still,true);assert.equal(s.timers.size,0);
});

test('special voice settings do not leak into subsequent ordinary dialogue',()=>{
  const s=setup();s.held.start(answer);s.fire(3000);s.utterances[0].onstart();s.utterances[0].onend();
  s.narrator.play('I was always here.');
  assert.equal(s.utterances[1].rate,0.82);assert.equal(s.utterances[1].pitch,0.4 * 2 ** (-2 / 12));assert.equal(s.utterances[1].volume,1);
});
