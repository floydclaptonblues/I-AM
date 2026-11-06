import { dialogues, opening } from './dialogue.js';
import { Narrator } from './speech.js';

const $ = id => document.getElementById(id);
const synth = window.speechSynthesis;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let muted = false;
let still = reduced.matches;
let current = { text: opening, fragment: '00 · THE PRESENCE' };
let sentence = opening;
let speaking = false;
let frame = 0;
let lastWordAt = 0;
let speechStartAt = 0;
let background = { still: 'assets/garden-still.webp', animated: null };
const visited = new Set();

function closeJaw() {
  speaking = false;
  cancelAnimationFrame(frame);
  document.documentElement.style.setProperty('--jaw', '0');
}
function animate(now) {
  if (!speaking || still || reduced.matches) return;
  // A word-boundary pulse follows actual narration. Voices without boundaries use
  // approximate articulation, only between real speech start/end events.
  const sinceWord = now - lastWordAt;
  const opening = lastWordAt && sinceWord < 440
    ? Math.max(0, Math.sin((sinceWord / 440) * Math.PI)) * .8
    : (.28 + .35 * Math.sin((now - speechStartAt) / 72) ** 2) * (.7 + .3 * Math.sin(now / 173));
  document.documentElement.style.setProperty('--jaw', String(opening));
  frame = requestAnimationFrame(animate);
}
const states = {
  idle: 'Waiting for you', loading: 'A breath in the dark…', speaking: 'The witness speaks',
  between: 'The witness remembers', finished: 'The witness falls silent',
  paused: 'The witness pauses', unavailable: 'Voice unavailable · read below'
};
const narrator = new Narrator({
  synth, Utterance: window.SpeechSynthesisUtterance,
  onState(state) {
    closeJaw();
    $('status').textContent = states[state];
    $('stop').disabled = !['loading', 'speaking', 'between', 'paused'].includes(state);
    if (state === 'speaking') {
      speaking = true; lastWordAt = 0; speechStartAt = performance.now();
      frame = requestAnimationFrame(animate);
    }
    if (state === 'finished') {
      $('caption').textContent = sentence;
      $('listen').innerHTML = 'Replay <span aria-hidden="true">↻</span>';
    }
    if (state === 'unavailable') {
      $('caption').textContent = current.text;
      $('transcript').open = true;
      $('voice-note').textContent = 'The words remain. Try Replay to ask for the voice again.';
      $('listen').innerHTML = 'Replay <span aria-hidden="true">↻</span>';
    }
  },
  onSentence(text) { sentence = text; $('caption').textContent = text; },
  onWord(index, length, text) {
    lastWordAt = performance.now();
    const size = length || text.slice(index).match(/^\S+/)?.[0].length || 1;
    const word = document.createElement('span');
    word.className = 'spoken-word'; word.textContent = text.slice(index, index + size);
    $('caption').replaceChildren(document.createTextNode(text.slice(0, index)), word, document.createTextNode(text.slice(index + size)));
  }
});

function showCurrent() {
  $('fragment').textContent = current.fragment;
  $('full-answer').textContent = current.text;
  $('caption').textContent = current.text;
  $('listen').innerHTML = 'Replay <span aria-hidden="true">↻</span>';
  $('voice-note').textContent = muted ? 'The garden keeps its voice. The words remain.' : 'Every answer is the testimony of an unreliable witness.';
}
function play() {
  if (muted) { narrator.stop(); $('status').textContent = 'Voice muted · read below'; return; }
  narrator.play(current.text);
}
for (const entry of dialogues) {
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.textContent = entry.label;
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-controls', 'caption full-answer');
  button.addEventListener('click', () => {
    narrator.stop(); current = entry; visited.add(entry.id);
    for (const other of $('question-list').querySelectorAll('button')) other.setAttribute('aria-pressed', String(other === button));
    button.dataset.visited = 'true';
    $('progress').textContent = visited.size === dialogues.length ? 'You have heard the witness. Do you believe it?' : `${visited.size} of 5 fragments remembered.`;
    showCurrent(); play();
    if (matchMedia('(max-width: 760px)').matches) {
      $('caption').focus({ preventScroll: true });
      $('caption').scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'center' });
    }
  });
  li.append(button); $('question-list').append(li);
}
$('listen').addEventListener('click', () => { showCurrent(); play(); });
$('stop').addEventListener('click', () => {
  narrator.stop(); $('caption').textContent = current.text;
  $('status').textContent = 'The witness falls silent';
});
$('mute').addEventListener('click', () => {
  muted = !muted; narrator.stop();
  $('mute').setAttribute('aria-pressed', String(muted));
  $('mute').textContent = muted ? 'Unmute voice' : 'Mute voice';
  $('listen').disabled = muted;
  showCurrent();
  $('status').textContent = muted ? 'Voice muted · read below' : 'Voice ready · press Replay';
});
function updateMotion() {
  document.body.classList.toggle('still', still);
  $('motion').setAttribute('aria-pressed', String(still));
  $('motion').textContent = still ? 'Allow motion' : 'Still garden';
  $('garden-image').src = !still && !reduced.matches && background.animated ? background.animated : background.still;
  cancelAnimationFrame(frame);
  document.documentElement.style.setProperty('--jaw', '0');
  if (speaking && !still && !reduced.matches) frame = requestAnimationFrame(animate);
}
$('motion').addEventListener('click', () => { still = !still; updateMotion(); });
reduced.addEventListener('change', () => { still = reduced.matches; updateMotion(); });
$('garden-image').addEventListener('error', () => {
  if (!$('garden-image').src.endsWith('/assets/garden-still.svg')) $('garden-image').src = 'assets/garden-still.svg';
});
fetch('assets/background.json').then(r => { if (!r.ok) throw new Error('Missing background configuration'); return r.json(); })
  .then(config => { background = config; updateMotion(); }).catch(() => updateMotion());
updateMotion();
// Never leave narration running after a visitor hides or leaves the garden.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { narrator.stop(); $('caption').textContent = current.text; }
});
window.addEventListener('pagehide', () => narrator.stop());
if (!synth || !window.SpeechSynthesisUtterance) {
  $('voice-note').textContent = 'This browser has no narration voice. Every answer is available in writing.';
}
