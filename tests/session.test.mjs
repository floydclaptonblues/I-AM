import test from 'node:test';
import assert from 'node:assert/strict';
import { DialogueJourney } from '../dialogue.js';
import { SAVE_KEY, loadSession, saveSession } from '../session.js';

function memory() {
  const items = new Map();
  return { getItem: key => items.get(key) ?? null, setItem: (key, value) => items.set(key, value) };
}
function walk() {
  const journey = new DialogueJourney();
  for (const id of ['upright', 'hands', 'purpose', 'work']) assert.ok(journey.choose(id));
  return journey;
}

test('a return restores the answer, choices, Back trail, transcript, and preferences', () => {
  const storage = memory(), journey = walk();
  journey.back();
  assert.ok(saveSession(journey, { muted: true, still: true }, () => storage));
  const saved = loadSession(() => storage);
  assert.equal(saved.journey.current.id, 'purpose');
  assert.deepEqual(saved.journey.choices.map(d => d.id), ['work']);
  assert.deepEqual(saved.journey.transcript, journey.transcript);
  assert.ok(saved.journey.visited.has('work'));
  assert.equal(saved.muted, true); assert.equal(saved.still, true);
  saved.journey.back(); assert.equal(saved.journey.current.id, 'hands');
});

test('First Questions survives a return without erasing history or unlocks', () => {
  const journey = walk(), storage = memory(); journey.firstQuestions();
  saveSession(journey, {}, () => storage);
  const restored = loadSession(() => storage).journey;
  assert.equal(restored.current.id, 'opening');
  assert.equal(restored.canGoBack, false);
  assert.equal(restored.history.length, 4);
  assert.equal(restored.visited.size, 4);
});

test('Start Over clears saved history and unlocks while retaining preferences after another return', () => {
  const journey = walk(), storage = memory();
  saveSession(journey, {}, () => storage);
  journey.reset(); saveSession(journey, { muted: true, still: true }, () => storage);
  const restored = loadSession(() => storage);
  assert.equal(restored.journey.current.id, 'opening');
  assert.equal(restored.journey.canGoBack, false);
  assert.equal(restored.journey.visited.size, 0);
  assert.equal(restored.journey.transcript.length, 1);
  assert.equal(restored.journey.choices.length, 6);
  assert.equal(restored.muted, true); assert.equal(restored.still, true);
});

test('missing, corrupt, outdated, and invalid saved data safely produce a fresh visit', () => {
  const storage = memory(); assert.equal(loadSession(() => storage), null);
  for (const raw of ['broken JSON', 'null', '{"version":2}', JSON.stringify({version:1, conversation:{trail:['opening','missing'],history:['missing']}}), JSON.stringify({version:1, conversation:{trail:['opening','work'],history:['work']}}), JSON.stringify({version:1, conversation:{trail:['opening','garden','identity'],history:['garden','identity']}})]) {
    storage.setItem(SAVE_KEY, raw); assert.equal(loadSession(() => storage), null);
  }
});

test('blocked storage getters, reads and quota failures never interrupt the conversation', () => {
  const unavailable = () => { throw new Error('Storage disabled'); };
  assert.equal(loadSession(unavailable), null);
  assert.equal(saveSession(walk(), {}, unavailable), false);
  const storage = { getItem: unavailable, setItem: unavailable };
  assert.equal(loadSession(() => storage), null);
  assert.equal(saveSession(walk(), {}, () => storage), false);
});

test('the saved payload contains IDs, never executable or rendered conversation text', () => {
  const journey = walk(), storage = memory();
  saveSession(journey, {}, () => storage);
  const raw = storage.getItem(SAVE_KEY);
  assert.ok(!raw.includes(journey.current.text));
  const saved = JSON.parse(raw); saved.conversation.text='<script>bad()</script>';
  storage.setItem(SAVE_KEY, JSON.stringify(saved));
  assert.equal(loadSession(() => storage).journey.current.text, journey.current.text);
});

test('saved snapshots and restored journeys do not share mutable arrays', () => {
  const journey = walk(), snapshot = journey.snapshot(), restored = new DialogueJourney();
  assert.ok(restored.restore(snapshot));
  snapshot.trail.length = 0; snapshot.history.length = 0;
  assert.equal(journey.current.id, 'work'); assert.equal(restored.current.id, 'work');
  assert.equal(restored.history.length, 4);
});
