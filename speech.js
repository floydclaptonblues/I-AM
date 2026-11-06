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
    const hadUtterance = this.current !== null;
    this.generation++;
    this.clearTimer(this.timer);
    this.timer = null;
    this.current = null;
    if (hadUtterance) this.synth?.cancel();
    this.onState(state);
  }
  play(text, { rate = 1.0, pitch = 0.4 * 2 ** (-2 / 12), volume = 1 } = {}) {
    this.stop();
    if (!this.synth || !this.Utterance) { this.onState('unavailable'); return; }
    const generation = this.generation;
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()) ?? [text];
    const next = (index, attempt = 0) => {
      if (generation !== this.generation) return;
      if (index === sentences.length) { this.stop('finished'); return; }
      const utterance = new this.Utterance(sentences[index]);
      this.current = utterance; // Retain the utterance while the browser is speaking.
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      const voices = this.synth.getVoices();
      const preferred = voices.find(v => /^en[-_]/i.test(v.lang) && v.localService && /David|Daniel|George/i.test(v.name))
        ?? voices.find(v => /^en[-_]/i.test(v.lang) && v.localService)
        ?? voices.find(v => /^en[-_]/i.test(v.lang)) ?? null;
      utterance.voice = attempt === 0 ? preferred
        : voices.find(v => /^en[-_]/i.test(v.lang) && v.localService && v !== preferred) ?? null;
      let started = false;
      const valid = () => generation === this.generation && this.current === utterance;
      const fail = (error = '') => {
        if (!valid()) return;
        if (started || attempt > 0 || error === 'not-allowed') { this.stop('unavailable'); return; }
        this.clearTimer(this.timer);
        this.current = null; // Invalidate callbacks before cancelling the failed voice.
        this.synth.cancel();
        this.timer = this.setTimer(() => {
          if (generation !== this.generation) return;
          this.timer = null;
          next(index, 1);
        }, 150);
      };
      const watchdog = (ms, onTimeout = () => this.stop('unavailable')) => {
        this.clearTimer(this.timer);
        this.timer = this.setTimer(() => { if (valid()) onTimeout(); }, ms);
      };
      utterance.onstart = () => {
        if (!valid()) return;
        started = true;
        this.onSentence(sentences[index], index, sentences.length);
        this.onState('speaking');
        watchdog(Math.max(20000, sentences[index].length * 400));
      };
      utterance.onboundary = event => {
        if (valid() && event.name === 'word') this.onWord(event.charIndex, event.charLength, sentences[index]);
      };
      utterance.onpause = () => { if (valid()) this.onState('paused'); };
      utterance.onresume = () => { if (valid()) this.onState('speaking'); };
      utterance.onend = () => {
        if (!valid()) return;
        this.clearTimer(this.timer);
        this.timer = null;
        this.current = null;
        if (index + 1 === sentences.length) { this.stop('finished'); return; }
        this.onState('between');
        this.timer = this.setTimer(() => {
          if (generation !== this.generation) return;
          this.timer = null;
          next(index + 1);
        }, 1400);
      };
      utterance.onerror = event => fail(event?.error);
      this.onState('loading');
      watchdog(8000, fail);
      try {
        if (this.synth.paused) this.synth.resume();
        this.synth.speak(utterance);
      } catch { fail(); }
    };
    next(0);
  }
}
