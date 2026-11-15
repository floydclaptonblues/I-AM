import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dialogues } from '../dialogue.js';

test('all 22 First Light questions and answers match the supplied text verbatim', () => {
  const supplied = JSON.parse(readFileSync(new URL('./first-light-dialogue.json', import.meta.url), 'utf8'));
  assert.equal(supplied.length, 22);
  assert.deepEqual(dialogues.slice(25,47).map(({label,text}) => ({label,text})), supplied);
});

test('the retained earlier exchanges match their source text', () => {
  const original = JSON.parse(readFileSync(new URL('./existing-dialogue.json', import.meta.url), 'utf8'));
  assert.deepEqual(dialogues.slice(0,25).map(({id,label,text,requires}) => ({id,label,text,...(requires?{requires}:{})})), original.filter(entry=>entry.id!=='memory'));
});

