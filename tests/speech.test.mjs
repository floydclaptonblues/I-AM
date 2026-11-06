import test from 'node:test';
import assert from 'node:assert/strict';
import { Narrator } from '../speech.js';
import { dialogues } from '../dialogue.js';
function setup() {
  const utterances = [], states = [], sentences = [], words = [], timers = new Map(), delays = new Map(); let timerId = 0;
  const synth = { cancel() {}, getVoices: () => [], speak: u => utterances.push(u) };
  const narrator = new Narrator({ synth, Utterance: class { constructor(text) { this.text = text; } }, onState: s => states.push(s), onSentence: s => sentences.push(s), onWord: (...a) => words.push(a), setTimer: (fn, ms) => { timers.set(++timerId, fn); delays.set(timerId, ms); return timerId; }, clearTimer: id => { timers.delete(id); delays.delete(id); } });
  function advance() { const [id, fn] = [...timers][0]; timers.delete(id); delays.delete(id); fn(); }
  return { narrator, utterances, states, sentences, words, timers, delays, advance };
}
test('plays complete monologues sentence by sentence and finishes silently', () => {
  const s = setup(); s.narrator.play('I was here. You returned.');
  assert.equal(s.utterances.length, 1);
  s.utterances[0].onstart(); s.utterances[0].onend();
  assert.equal(s.states.at(-1), 'between');
  assert.equal(s.utterances.length, 1);
  s.advance();
  assert.equal(s.utterances[1].text, 'You returned.');
  s.utterances[1].onstart(); s.utterances[1].onend();
  assert.deepEqual(s.sentences, ['I was here.', 'You returned.']);
  assert.equal(s.states.at(-1), 'finished'); assert.equal(s.timers.size, 0);
});

test('faster deeper speech leaves 1.4 seconds of silence before the next sentence', () => {
  const s = setup(); s.narrator.play('First. Second.');
  assert.equal(s.utterances[0].rate, 0.82); assert.equal(s.utterances[0].pitch, 0.4 * 2 ** (-2 / 12));
  s.utterances[0].onstart(); s.utterances[0].onend();
  assert.deepEqual([...s.delays.values()], [1400]);
  assert.deepEqual(s.sentences, ['First.']);
  assert.equal(s.narrator.current, null);
  s.advance(); assert.equal(s.utterances.length, 2);
  assert.deepEqual(s.sentences, ['First.']);
  s.utterances[1].onstart(); assert.deepEqual(s.sentences, ['First.', 'Second.']);
});

test('stop during a sentence gap clears the pause and prevents a late callback', () => {
  const s = setup(); s.narrator.play('First. Second.');
  s.utterances[0].onstart(); s.utterances[0].onend();
  const late = [...s.timers.values()][0]; s.narrator.stop();
  assert.equal(s.timers.size, 0); late();
  assert.equal(s.utterances.length, 1); assert.equal(s.states.at(-1), 'idle');
});

test('switching answers during a gap discards the old pause and old word events', () => {
  const s = setup(); s.narrator.play('Old. Forgotten.'); const old = s.utterances[0];
  old.onstart(); old.onend(); const late = [...s.timers.values()][0];
  old.onboundary({ name:'word', charIndex:0 }); old.onend();
  assert.equal(s.words.length, 0); assert.equal(s.timers.size, 1);
  s.narrator.play('New.'); late();
  assert.equal(s.utterances.length, 2); assert.equal(s.utterances[1].text, 'New.');
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
  assert.equal(dialogues.length, 48);
  assert.match(dialogues[0].text, /ate what ate the food you desired/);
  assert.match(dialogues[1].text, /not out of respect/);
  assert.match(dialogues[2].text, /I am solipsism/);
  assert.match(dialogues[3].text, /higher figs/); assert.match(dialogues[4].text, /sent them back into it/);
});
