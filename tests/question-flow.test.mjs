import test from 'node:test';
import assert from 'node:assert/strict';
import { DialogueJourney, dialogues, opening, questionLabel, isUnlocked } from '../dialogue.js';

test('the invitation leads to questions that require no prior story', () => {
  assert.equal(opening, "What would you like to know? Since you already ate from the tree, I can tell you now and you'll understand.");
  const journey = new DialogueJourney();
  assert.deepEqual(journey.choices.map(questionLabel), [
    'Who are you?', 'Why were you in the garden?', 'Why did we stand upright?',
    'Why are you evil?', 'What did you do before humans?', 'How old are you?'
  ]);
  assert.ok(journey.choose('before-humans'));
  assert.equal(journey.choices[0].id, 'why-wait');
  assert.ok(journey.choices.some(entry => entry.id === 'called-back'));
});

test('the fruit and fallen questions follow statements that make them meaningful', () => {
  const journey = new DialogueJourney();
  assert.ok(!journey.choices.some(entry => ['test','others'].includes(entry.id)));
  journey.choose('garden');
  assert.equal(questionLabel(journey.choices[0]), 'What happened when we reached for the fruit?');
  journey.choose('test');
  assert.ok(journey.choices.some(entry => questionLabel(entry) === 'What happened to those who fell?'));
});

test('changing subjects retains the answer, transcript, back trail and saved menu', () => {
  const journey = new DialogueJourney();
  journey.choose('garden'); journey.choose('test');
  const before = journey.snapshot(), answer = journey.current.text;
  journey.changeSubject();
  assert.equal(journey.current.text, answer);
  assert.deepEqual(journey.history, before.history);
  assert.deepEqual(journey.trail, before.trail);
  const restored = new DialogueJourney();
  assert.ok(restored.restore(journey.snapshot()));
  assert.equal(restored.browsing, true);
  assert.ok(restored.choose('before-humans'));
  assert.equal(restored.browsing, false);
  restored.back();
  assert.equal(restored.current.id, 'test');
  assert.equal(restored.browsing, false);
  journey.changeSubject();
  assert.deepEqual(journey.choices.map(entry => entry.id), ['death','others']);
});

test('direct cosmic and age questions cannot bypass the final identity discoveries', () => {
  const finalGate = dialogues.find(entry => entry.id === 'certain-light');
  for (const missing of ['identity', 'age', 'happy', 'darkness-ended']) {
    const visited = new Set(dialogues.map(entry => entry.id)); visited.delete(missing);
    assert.equal(isUnlocked(finalGate, visited), false, missing);
  }
});

test('old saves beginning with the removed opening questions still restore', () => {
  for (const id of ['test','others']) {
    const journey = new DialogueJourney();
    assert.ok(journey.restore({ trail:['opening',id], history:[id] }));
    assert.equal(journey.current.id, id);
    assert.ok(journey.choices.length > 0);
  }
});
