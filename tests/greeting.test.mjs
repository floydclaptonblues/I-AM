import test from 'node:test';
import assert from 'node:assert/strict';
import { FirstVisitGreeting, Narrator } from '../speech.js';
import { opening } from '../dialogue.js';

function setup(options = {}) {
  const events = [], utterances = [];
  let greeting;
  const narrator = new Narrator({
    synth: { cancel() {}, getVoices: () => [], speak: u => { events.push('speak'); utterances.push(u); } },
    Utterance: class { constructor(text) { this.text = text; } },
    onState: state => greeting?.observe(state), setTimer: () => 1, clearTimer() {}
  });
  greeting = new FirstVisitGreeting({
    saved: false, muted: false, play: () => narrator.play(opening),
    remember: () => events.push('save'), onBlocked: () => events.push('fallback'), ...options
  });
  return { greeting, narrator, events, utterances };
}

test('a fresh visit saves first and speaks exactly the opening line once', () => {
  const s = setup(); assert.equal(s.greeting.start(), true);
  assert.deepEqual(s.events, ['save', 'speak']);
  assert.equal(s.utterances[0].text, 'I was always here.');
  s.utterances[0].onstart(); s.utterances[0].onend();
  assert.equal(s.greeting.start(), false); assert.equal(s.utterances.length, 1);
});

test('saved visits and muted visits never queue an automatic opening', () => {
  for (const options of [{ saved: true }, { muted: true }, { saved: true, muted: true }]) {
    const s = setup(options); assert.equal(s.greeting.start(), false);
    assert.deepEqual(s.events, []); assert.equal(s.utterances.length, 0);
  }
});

test('a blocked automatic opening offers one fallback without repeatedly retrying', () => {
  const s = setup(); s.greeting.start(); s.utterances[0].onerror({error:'not-allowed'});
  assert.deepEqual(s.events, ['save', 'speak', 'fallback']);
  assert.equal(s.greeting.start(), false);
  s.greeting.observe('unavailable'); assert.equal(s.events.filter(e => e === 'fallback').length, 1);
});

test('choosing another answer or cancelling suppresses stale greeting failures', () => {
  const s = setup(); s.greeting.start(); const openingUtterance = s.utterances[0];
  s.greeting.cancel(); s.narrator.play('A different answer.');
  openingUtterance.onerror(); openingUtterance.onstart();
  s.utterances[1].onerror();
  assert.ok(!s.events.includes('fallback')); assert.equal(s.greeting.start(), false);
});

test('an opening that already started does not offer an autoplay fallback on a later error', () => {
  const s = setup(); s.greeting.start(); s.utterances[0].onstart(); s.utterances[0].onerror();
  assert.ok(!s.events.includes('fallback'));
});
