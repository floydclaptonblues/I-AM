import test from 'node:test';
import assert from 'node:assert/strict';
import { dialogues, relatedDialogues, DialogueJourney } from '../dialogue.js';

test('choice groups stay bounded even after the whole conversation is unlocked', () => {
  const visited = new Set(dialogues.map(d => d.id));
  assert.equal(relatedDialogues('opening', visited).length, 6);
  for (const entry of dialogues) {
    const related = relatedDialogues(entry.id, visited);
    assert.ok(related.length <= 4, entry.id + ' has too many choices');
    assert.equal(new Set(related.map(d => d.id)).size, related.length);
    assert.ok(!related.some(d => d.id === entry.id));
  }
});

test('all 26 answers remain reachable through the actual related-choice graph', () => {
  const visited = new Set();
  const contexts = new Set(['opening']);
  for (let pass = 0; pass <= dialogues.length; pass++) {
    const before = visited.size;
    for (const context of [...contexts]) {
      for (const entry of relatedDialogues(context, visited)) {
        assert.ok((entry.requires || []).every(id => visited.has(id)));
        visited.add(entry.id); contexts.add(entry.id);
      }
    }
    if (visited.size === before) break;
  }
  assert.deepEqual([...visited].sort(), dialogues.map(d => d.id).sort());
});

test('back restores the previous answer and its choices without forgetting progress', () => {
  const journey = new DialogueJourney();
  for (const id of ['upright', 'hands', 'purpose', 'work']) assert.ok(journey.choose(id));
  assert.deepEqual(journey.choices.map(d => d.id), ['free']);
  journey.back();
  assert.equal(journey.current.id, 'purpose');
  assert.deepEqual(journey.choices.map(d => d.id), ['work']);
  assert.ok(journey.visited.has('work'));
  journey.back();
  assert.equal(journey.current.id, 'hands');
  assert.deepEqual(journey.choices.map(d => d.id), ['purpose']);
});

test('first questions resets the trail but preserves unlocks and rejects off-menu selections', () => {
  const journey = new DialogueJourney();
  journey.choose('identity'); journey.choose('evil');
  journey.firstQuestions();
  assert.equal(journey.current.id, 'opening');
  assert.equal(journey.canGoBack, false);
  journey.back();
  assert.equal(journey.trail.length, 1);
  assert.equal(journey.choose('memory'), false);
  assert.equal(journey.trail.length, 1);
  journey.choose('evil'); journey.choose('light');
  assert.ok(journey.choices.some(d => d.id === 'memory'));
});

test('numbered selections follow the displayed group instead of the global unlock list', () => {
  const journey = new DialogueJourney();
  journey.choose('identity');
  assert.equal(journey.choices[0].id, 'age');
  journey.choose(journey.choices[0].id);
  assert.equal(journey.current.id, 'age');
  assert.equal(journey.choices[0].id, 'hurry');
  assert.equal(journey.choices[5], undefined);
});
