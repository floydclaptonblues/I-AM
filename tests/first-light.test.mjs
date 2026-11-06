import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dialogues, DialogueJourney, availableDialogues } from '../dialogue.js';
import { loadSession, saveSession } from '../session.js';

const path = ['identity','age','before-humans','why-wait','before-light','father-brighter','fill-darkness','darkness-fear','darkness-end','shadows','father-brighter','god-knows','believe-father','want-god','nothing-darkness','darkness-ended','other-lights','names-of-lights','called-back','happy','certain-light'];
function reachLastQuestion() {
  const journey = new DialogueJourney();
  for (const id of path) {
    assert.ok(!journey.choices.some(d => d.id === 'you-darkness'), 'Final question appeared too soon at ' + journey.current.id);
    assert.ok(journey.choose(id), 'Unreachable step ' + id + ' from ' + journey.current.id);
  }
  return journey;
}

test('all 22 First Light questions and answers match the supplied text verbatim', () => {
  const supplied = JSON.parse(readFileSync(new URL('./first-light-dialogue.json', import.meta.url), 'utf8'));
  assert.equal(supplied.length, 22);
  assert.deepEqual(dialogues.slice(26).map(({label,text}) => ({label,text})), supplied);
});

test('all 26 earlier exchanges and their prerequisites remain unchanged', () => {
  const original = JSON.parse(readFileSync(new URL('./existing-dialogue.json', import.meta.url), 'utf8'));
  assert.deepEqual(dialogues.slice(0,26).map(({id,label,text,requires}) => ({id,label,text,...(requires?{requires}:{})})), original);
});

test('the final question stays hidden through the gradual discovery path', () => {
  const journey = reachLastQuestion();
  assert.ok(journey.visited.size >= 18);
  assert.ok(journey.choices.some(d => d.id === 'you-darkness'));
  assert.ok(journey.choose('you-darkness'));
  assert.equal(journey.current.text, 'Who told you to ask me that?');
  assert.equal(journey.current.response, 'held-gaze');
  assert.ok(journey.choices.length > 0);
});

test('the obsession and identity gates cannot be bypassed by unrelated discoveries', () => {
  const all = new Set(dialogues.map(d => d.id));
  for (const required of ['nothing-darkness','fill-darkness','darkness-fear','shadows']) {
    const visited = new Set(all); visited.delete(required);
    assert.ok(!availableDialogues(visited).some(d => d.id === 'darkness-ended'));
  }
  for (const required of ['darkness-ended','other-lights','happy']) {
    const visited = new Set(all); visited.delete(required);
    assert.ok(!availableDialogues(visited).some(d => d.id === 'certain-light'));
  }
});

test('Back, saved progress, and repeat visits preserve late-stage choices', () => {
  const journey = reachLastQuestion(); journey.choose('you-darkness'); journey.back();
  let raw; const storage = { setItem: (_,value) => { raw=value; }, getItem: () => raw };
  saveSession(journey, { muted:true }, () => storage);
  const restored = loadSession(() => storage).journey;
  assert.equal(restored.current.id, 'certain-light');
  assert.deepEqual(restored.transcript, journey.transcript);
  assert.ok(restored.choose('you-darkness'));
  restored.reset();
  assert.equal(restored.visited.size, 0);
  assert.ok(!restored.choices.some(d => d.id === 'you-darkness'));
});

test('old saved conversation trails still load after the expansion', () => {
  const old = { version:1, conversation:{trail:['opening','identity','evil','light','memory'],history:['identity','evil','light','memory']},muted:false,still:true };
  const loaded = loadSession(() => ({ getItem: () => JSON.stringify(old) }));
  assert.equal(loaded.journey.current.id, 'memory');
  assert.equal(loaded.journey.history.length, 4);
  assert.equal(loaded.still, true);
});
