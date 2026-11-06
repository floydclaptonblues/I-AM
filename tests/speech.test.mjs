import test from 'node:test';
import assert from 'node:assert/strict';
import { Narrator } from '../speech.js';
import { dialogues } from '../dialogue.js';
function setup() {
  const utterances = [], states = [], sentences = [], words = [], timers = new Map(); let timerId = 0;
  const synth = { cancel() {}, getVoices: () => [], speak: u => utterances.push(u) };
  const narrator = new Narrator({ synth, Utterance: class { constructor(text) { this.text = text; } }, onState: s => states.push(s), onSentence: s => sentences.push(s), onWord: (...a) => words.push(a), setTimer: fn => { timers.set(++timerId, fn); return timerId; }, clearTimer: id => timers.delete(id) });
  return { narrator, utterances, states, sentences, words, timers };
}
test('plays complete monologues sentence by sentence and finishes silently', () => {
  const s = setup(); s.narrator.play('I was here. You returned.');
  assert.equal(s.utterances.length, 1);
  s.utterances[0].onstart(); s.utterances[0].onend();
  assert.equal(s.utterances[1].text, 'You returned.');
  s.utterances[1].onstart(); s.utterances[1].onend();
  assert.deepEqual(s.sentences, ['I was here.', 'You returned.']);
  assert.equal(s.states.at(-1), 'finished'); assert.equal(s.timers.size, 0);
});
test('rapid question switching cannot revive stale speech, words, or errors', () => {
  const s = setup(); s.narrator.play('Old answer. More old words.'); const old = s.utterances[0];
  s.narrator.play('New answer.'); const count = s.states.length;
  old.onstart(); old.onboundary({name:'word', charIndex:0}); old.onend(); old.onerror();
  assert.equal(s.states.length, count); assert.equal(s.utterances.length, 2); assert.equal(s.words.length, 0);
});
test('stop/mute prevents queued sentences and clears watchdog', () => {
  const s = setup(); s.narrator.play('First. Second.'); s.utterances[0].onstart(); s.narrator.stop(); s.utterances[0].onend();
  assert.equal(s.utterances.length, 1); assert.equal(s.states.at(-1), 'idle'); assert.equal(s.timers.size, 0);
});
test('word timing is forwarded only for active word events', () => {
  const s = setup(); s.narrator.play('I remain.'); const u = s.utterances[0]; u.onstart();
  u.onboundary({name:'sentence',charIndex:0}); u.onboundary({name:'word',charIndex:2,charLength:6});
  assert.deepEqual(s.words, [[2,6,'I remain.']]);
});
test('missing or failed speech gracefully falls back to writing', () => {
  const states = []; const n = new Narrator({ onState:s => states.push(s) }); n.play('Test.'); assert.equal(states.at(-1), 'unavailable');
  const s = setup(); s.narrator.play('Test.'); s.utterances[0].onerror(); assert.equal(s.states.at(-1), 'unavailable');
});
test('a voice that never starts releases loading state', () => {
  const s = setup(); s.narrator.play('Test.'); [...s.timers.values()][0](); assert.equal(s.states.at(-1), 'unavailable'); assert.equal(s.timers.size, 0);
});
test('the three original themes and both expansions are present', () => {
  assert.equal(dialogues.length, 9);
  assert.match(dialogues[0].text, /ate what ate the food you desired/);
  assert.match(dialogues[1].text, /not out of respect/);
  assert.match(dialogues[2].text, /I am solipsism/);
  assert.match(dialogues[3].text, /higher figs/); assert.match(dialogues[4].text, /sent them back into it/);
});
