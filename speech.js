// One opening attempt per fresh visit; a saved visit never queues a greeting.
export class FirstVisitGreeting {
  constructor({ saved, muted, play, remember, onBlocked }) {
    Object.assign(this, { saved, muted, play, remember, onBlocked });
    this.started = false;
    this.pending = false;
  }
  start() {
    if (this.saved || this.muted || this.started) return false;
    this.started = true; this.pending = true;
    this.remember(); this.play();
    return true;
  }
  observe(state) {
    if (!this.pending) return;
    if (state === 'speaking' || state === 'finished') this.pending = false;
    else if (state === 'unavailable') {
      this.pending = false; this.onBlocked();
    }
  }
  cancel() { this.started = true; this.pending = false; }
}

// Every callback is guarded by a generation token: cancelled voices cannot revive old dialogue.
export class Narrator {
  constructor({ synth, Utterance, onState = () => {}, onSentence = () => {}, onWord = () => {}, setTimer = (fn, ms) => setTimeout(fn, ms), clearTimer = id => clearTimeout(id) }) {
    Object.assign(this, { synth, Utterance, onState, onSentence, onWord, setTimer, clearTimer });
    this.generation = 0;
    this.timer = null;
    this.current = null;
  }
  stop(state = 'idle') {
    this.generation++;
    this.clearTimer(this.timer);
    this.timer = null;
    this.current = null;
    this.synth?.cancel();
    this.onState(state);
  }
  play(text) {
    this.stop();
    if (!this.synth || !this.Utterance) { this.onState('unavailable'); return; }
    const generation = this.generation;
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()) ?? [text];
    const next = index => {
      if (generation !== this.generation) return;
      if (index === sentences.length) { this.stop('finished'); return; }
      const utterance = new this.Utterance(sentences[index]);
      this.current = utterance; // Retain the utterance while the browser is speaking.
      utterance.lang = 'en-US';
      utterance.rate = 0.82;
      utterance.pitch = 0.65;
      const voices = this.synth.getVoices();
      utterance.voice = voices.find(v => /^en[-_]/i.test(v.lang) && /David|Daniel|George/i.test(v.name))
        ?? voices.find(v => /^en[-_]/i.test(v.lang) && v.localService)
        ?? voices.find(v => /^en[-_]/i.test(v.lang)) ?? null;
      const valid = () => generation === this.generation && this.current === utterance;
      const watchdog = ms => {
        this.clearTimer(this.timer);
        this.timer = this.setTimer(() => { if (valid()) this.stop('unavailable'); }, ms);
      };
      utterance.onstart = () => {
        if (!valid()) return;
        this.onSentence(sentences[index], index, sentences.length);
        this.onState('speaking');
        watchdog(Math.max(20000, sentences[index].length * 300));
      };
      utterance.onboundary = event => {
        if (valid() && event.name === 'word') this.onWord(event.charIndex, event.charLength, sentences[index]);
      };
      utterance.onpause = () => { if (valid()) this.onState('paused'); };
      utterance.onresume = () => { if (valid()) this.onState('speaking'); };
      utterance.onend = () => {
        if (!valid()) return;
        this.clearTimer(this.timer);
        this.onState('between');
        next(index + 1);
      };
      utterance.onerror = () => { if (valid()) this.stop('unavailable'); };
      this.onState('loading');
      watchdog(8000);
      try { this.synth.speak(utterance); } catch { this.stop('unavailable'); }
    };
    next(0);
  }
}
