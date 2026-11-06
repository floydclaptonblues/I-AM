import { opening, DialogueJourney } from './dialogue.js?v=short-path-1';
import { loadSession, saveSession } from './session.js?v=short-path-1';
import { Narrator, FirstVisitGreeting } from './speech.js?v=voice-4';
import { Portrait } from './portrait.js';
import { HeldResponse } from './response.js?v=voice-4';
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const synth = window.speechSynthesis;
const saved = loadSession();
const journey = saved?.journey || new DialogueJourney();
let muted = saved?.muted ?? false, still = saved?.still ?? reduced.matches;
let current = journey.current;
let background = { still: 'assets/garden-still.webp', animated: null };
let sentence = opening;
let greeting, heldResponse;
const portrait = new Portrait({ setFrame: state => { $('portrait').dataset.mouth = state; } });
const stateLabels = { idle: 'Listening.', loading: 'Waiting for voice.', speaking: 'Speaking.', between: 'Pausing.', finished: 'Listening.', paused: 'Paused.', unavailable: 'Voice unavailable. The complete response is available in the dialogue panel and Review.' };
function showText(text) { $('caption').textContent = text; $('response-scroll').scrollTop = 0; }
const narrator = new Narrator({
  synth, Utterance: window.SpeechSynthesisUtterance,
  onState(state) {
    const speaking = state === 'speaking';
    document.body.dataset.speaking = String(speaking);
    portrait.setSpeaking(speaking && !heldResponse?.active);
    $('status').textContent = stateLabels[state];
    $('stop').disabled = !['loading','speaking','between','paused'].includes(state);
    if (state === 'finished' || state === 'unavailable') showText(current.text);
    greeting?.observe(state);
    heldResponse?.observe(state);
  },
  onSentence(text) { sentence = text; showText(text); },
  onWord(index, length, text) {
    const size = length || text.slice(index).match(/^\S+/)?.[0].length || 1;
    const spokenWord = text.slice(index, index + size);
    portrait.pulse(spokenWord);
    const word = document.createElement('span'); word.className = 'spoken-word'; word.textContent = spokenWord;
    $('caption').replaceChildren(document.createTextNode(text.slice(0,index)), word, document.createTextNode(text.slice(index+size)));
    const panel = $('response-scroll');
    const top = word.getBoundingClientRect().top - panel.getBoundingClientRect().top;
    if (top < 0 || top > panel.clientHeight - 28) panel.scrollTop += top - panel.clientHeight / 2;
  }
});
greeting = new FirstVisitGreeting({
  saved: Boolean(saved), muted,
  play: () => narrator.play(opening), remember,
  onBlocked: () => {
    $('hear-opening').hidden = false;
    $('status').textContent = 'Select Hear the serpent to hear the opening line.';
  }
});
function cancelGreeting() { greeting.cancel(); $('hear-opening').hidden = true; }
function stopResponse() { heldResponse?.cancel(); narrator.stop(); }
function play() {
  cancelGreeting(); stopResponse();
  if (current.response === 'held-gaze') { heldResponse.start(current.text, { muted }); return; }
  showText(current.text);
  if (muted) { $('status').textContent = 'Sound off. Response ready.'; return; }
  narrator.play(current.text);
}
function choose(entry) {
  if (!journey.choose(entry.id)) return;
  stopResponse();
  current = journey.current;
  renderChoices({ focus: true });
  play();
  remember();
}
function remember() {
  if (!saveSession(journey, { muted, still })) $('status').textContent = 'This browser could not save your place. You can continue this visit.';
}
function renderChoices({ focus = false, focusId = null } = {}) {
  const fragment = document.createDocumentFragment();
  journey.choices.forEach((entry,index) => {
    const li = document.createElement('li'), button = document.createElement('button');
    const number = document.createElement('span'); number.className='choice-number'; number.textContent = String(index+1)+'.'; number.setAttribute('aria-hidden','true');
    const label = document.createElement('span'); label.textContent = entry.label;
    button.type='button'; button.dataset.question=entry.id; button.dataset.visited=String(journey.visited.has(entry.id));
    button.setAttribute('aria-pressed',String(current.id === entry.id)); button.setAttribute('aria-controls','caption');
    button.append(number,label); button.addEventListener('click',()=>choose(entry)); li.append(button); fragment.append(li);
  });
  $('question-list').replaceChildren(fragment);
  $('question-navigation').hidden = !journey.canGoBack;
  $('questions').scrollTop = 0;
  if (focus) {
    const target = (focusId && $('question-list').querySelector('[data-question="'+focusId+'"]'))
      || $('question-list').querySelector('button') || $('back-questions');
    target.focus({ preventScroll: true });
  }
}
function returnToQuestions(first = false) {
  cancelGreeting();
  const focusId = first ? journey.trail[1] : current.id;
  stopResponse();
  if (first) journey.firstQuestions(); else journey.back();
  current = journey.current;
  showText(current.text);
  renderChoices({ focus: true, focusId });
  $('status').textContent = first ? 'Opening questions.' : 'Earlier questions.';
  remember();
}
$('back-questions').addEventListener('click', () => returnToQuestions());
$('first-questions').addEventListener('click', () => returnToQuestions(true));
$('listen').addEventListener('click', () => play());
$('hear-opening').addEventListener('click', () => play());
$('stop').addEventListener('click', () => { cancelGreeting(); stopResponse(); showText(current.text); });
$('mute').addEventListener('click', () => {
  cancelGreeting();
  muted=!muted; stopResponse(); showText(current.text);
  updateSound();
  $('status').textContent=muted?'Sound off.':'Sound on. Select Replay to hear the response.';
  remember();
});
function updateSound() {
  $('mute').setAttribute('aria-pressed',String(muted)); $('mute').setAttribute('aria-label',muted?'Unmute voice':'Mute voice');
  $('mute').querySelector('span').textContent=muted?'SOUND OFF':'SOUND ON';
  $('listen').disabled=muted;
}
function updateMotion() {
  const frozen = still || reduced.matches;
  document.body.classList.toggle('still',frozen);
  portrait.setStill(frozen || Boolean(heldResponse?.active));
  $('motion').setAttribute('aria-pressed',String(frozen));
  $('motion').textContent=frozen?'MOTION':'STILL';
  $('motion').setAttribute('aria-label',frozen?'Allow motion':'Pause all motion');
  $('motion').disabled=reduced.matches;
  $('garden-image').src=!frozen && background.animated ? background.animated : background.still;
}
$('motion').addEventListener('click',()=>{still=!still;updateMotion();remember();});
reduced.addEventListener('change',()=>{still=reduced.matches;updateMotion();});
$('garden-image').addEventListener('error',()=>{
  if (!$('garden-image').src.endsWith('/assets/garden-still.svg')) $('garden-image').src='assets/garden-still.svg';
});
fetch('assets/background.json?v=eden-bright-1').then(r=>{if(!r.ok)throw new Error('Background configuration missing');return r.json();}).then(config=>{background=config;updateMotion();}).catch(()=>updateMotion());
function review() {
  cancelGreeting();
  stopResponse(); showText(current.text);
  $('history').replaceChildren();
  for(const item of journey.transcript){
    const article=document.createElement('article');
    if(item.question){const heading=document.createElement('h3');heading.textContent=item.question;article.append(heading);}
    const text=document.createElement('p');text.textContent=item.text;article.append(text);$('history').append(article);
  }
  $('review-dialog').showModal();
}
$('review').addEventListener('click',review);
$('close-review').addEventListener('click',()=>$('review-dialog').close());
function askToRestart() {
  cancelGreeting();
  stopResponse(); showText(current.text);
  $('restart-dialog').showModal(); $('cancel-restart').focus();
}
$('restart').addEventListener('click', askToRestart);
$('cancel-restart').addEventListener('click', () => $('restart-dialog').close());
$('confirm-restart').addEventListener('click', () => {
  stopResponse(); journey.reset(); current=journey.current;
  $('history').replaceChildren();
  $('restart-dialog').close();
  showText(current.text); renderChoices({ focus: true });
  play();
  remember();
});
document.addEventListener('keydown',event=>{
  if($('review-dialog').open || $('restart-dialog').open || event.altKey || event.ctrlKey || event.metaKey || event.repeat)return;
  if(/^[1-9]$/.test(event.key)){
    const entry=journey.choices[Number(event.key)-1];if(entry){event.preventDefault();choose(entry);}
  }else if(event.key==='Escape'){cancelGreeting();stopResponse();showText(current.text);}
});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){cancelGreeting();stopResponse();portrait.suspend();showText(current.text);}
  else {portrait.start();updateMotion();greeting.start();}
});
window.addEventListener('pagehide',()=>{stopResponse();portrait.suspend();});
window.addEventListener('pageshow',event=>{if(event.persisted){portrait.start();updateMotion();}});
heldResponse = new HeldResponse({
  hold: active => { document.body.classList.toggle('held-gaze', active); updateMotion(); },
  waiting: active => {
    $('response-scroll').setAttribute('aria-busy', String(active));
    if (active) { $('status').textContent='Waiting.'; $('stop').disabled=false; }
  },
  reveal: showText,
  speak: (text, options) => narrator.play(text, options),
  done: () => { $('stop').disabled=true; $('status').textContent=muted?'Sound off. Response ready.':'Listening.'; }
});
showText(current.text);renderChoices();updateSound();portrait.start();updateMotion();
$('status').textContent = journey.history.length ? 'Your place is remembered. Select a question or Replay.' : 'Select a question or Replay to hear the serpent.';
if (!document.hidden) greeting.start();
