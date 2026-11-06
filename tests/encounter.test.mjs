import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { availableDialogues, dialogues } from '../dialogue.js';
import { Portrait } from '../portrait.js';

test('six initial questions and conditional follow-ups stay in a stable order', () => {
  assert.deepEqual(availableDialogues(new Set()).map(d=>d.id), ['garden','test','upright','others','evil','identity']);
  assert.ok(availableDialogues(new Set(['upright'])).some(d=>d.id==='hands'));
  assert.ok(!availableDialogues(new Set(['evil'])).some(d=>d.id==='memory'));
  assert.ok(availableDialogues(new Set(['evil','identity'])).some(d=>d.id==='memory'));
  assert.equal(availableDialogues(new Set(dialogues.map(d=>d.id))).length, 26);
});
test('every exchange is reachable through valid question prerequisites', () => {
  const ids = new Set(dialogues.map(d=>d.id));
  assert.equal(ids.size, dialogues.length, 'IDs must be unique');
  for (const entry of dialogues) for (const required of entry.requires || []) assert.ok(ids.has(required), 'Unknown prerequisite: '+required);
  const visited = new Set();
  for (let pass=0; pass<dialogues.length; pass++) {
    const before = visited.size;
    for (const entry of availableDialogues(visited)) visited.add(entry.id);
    if (visited.size === before) break;
  }
  assert.deepEqual([...visited].sort(), [...ids].sort(), 'Every answer must unlock without a cycle');
  assert.ok(!availableDialogues(new Set(['identity'])).some(d=>d.id==='believe'));
  assert.ok(availableDialogues(new Set(['identity','lied'])).some(d=>d.id==='believe'));
  assert.ok(availableDialogues(new Set(['age'])).some(d=>d.id==='hurry'));
});
test('all three core answers are unchanged from the deployed original', () => {
  const original = JSON.parse(readFileSync(new URL('./core-dialogue.json',import.meta.url),'utf8'));
  for(const id of ['garden','test','evil']) assert.equal(dialogues.find(d=>d.id===id).text, original[id]);
});
function setup() {
  let id=0;const timers=new Map(),frames=[];
  const portrait=new Portrait({setFrame:f=>frames.push(f),setTimer:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},clearTimer:n=>timers.delete(n),random:()=>0});
  return {portrait,timers,frames,fire(ms){const hit=[...timers].find(([,v])=>v.ms===ms);assert.ok(hit);timers.delete(hit[0]);hit[1].fn();}};
}
test('mouth has three states, driven by active speech events, with no perpetual talk loop', () => {
  const s=setup();s.portrait.start();s.portrait.setSpeaking(true);s.portrait.pulse('darkness');
  assert.equal(s.frames.at(-1),'open');s.fire(95);assert.equal(s.frames.at(-1),'partial');s.fire(185);assert.equal(s.frames.at(-1),'closed');
  assert.equal(s.timers.size,1); // Only the independent blink remains.
  s.portrait.setSpeaking(false);s.portrait.pulse('ignored');assert.equal(s.frames.at(-1),'closed');
});
test('blink is independent, and still mode cancels all facial motion', () => {
  const s=setup();s.portrait.start();s.fire(5700);assert.equal(s.frames.at(-1),'blink');s.fire(155);assert.equal(s.frames.at(-1),'closed');
  s.portrait.setStill(true);s.portrait.setSpeaking(true);s.portrait.pulse('darkness');assert.equal(s.frames.at(-1),'closed');assert.equal(s.timers.size,0);
});
test('hiding, stopping, or changing the question clears in-flight mouth states', () => {
  const s=setup();s.portrait.start();s.portrait.setSpeaking(true);s.portrait.pulse('darkness');s.portrait.setSpeaking(false);
  assert.equal(s.frames.at(-1),'closed');assert.equal(s.timers.size,1);
  s.portrait.suspend();assert.equal(s.frames.at(-1),'closed');assert.equal(s.timers.size,0);
});
test('visitor-facing copy contains no editorial explanation or old landing-page sections', () => {
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
  for(const pattern of [/speculative/i,/paleoanthropology/i,/unreliable witness/i,/myth told/i,/note in the margin/i,/Before the word/i,/fragment/i]) {
    assert.doesNotMatch(html,pattern);
  }
  assert.doesNotMatch(app,/Every answer is the testimony|voice-note|myth told/);
  assert.doesNotMatch(html,/<main[^>]*(?:hidden|inert)|id="(?:threshold|enter)"/);
  assert.match(html,/role="status"/);assert.match(html,/id="review-dialog"/);
});
