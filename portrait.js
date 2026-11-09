// Discrete articulation driven by speech events or recorded waveform energy.
export function articulation(word) {
  const vowels = (word.match(/[aeiouy]/gi) || []).length;
  return vowels > 1 || word.length > 5 ? 'open' : 'partial';
}
export class Portrait {
  constructor({ setFrame, setTimer = (fn, ms) => setTimeout(fn, ms), clearTimer = id => clearTimeout(id), random = Math.random }) {
    Object.assign(this, { setFrame, setTimer, clearTimer, random });
    this.timers = []; this.blinkTimer = null; this.active = false; this.speaking = false; this.still = false;
  }
  clearMouth() { this.timers.forEach(this.clearTimer); this.timers = []; this.setFrame('closed'); }
  start() { this.active = true; this.scheduleBlink(); }
  setStill(value) { this.still = value; this.clearMouth(); this.clearTimer(this.blinkTimer); if (!value) this.scheduleBlink(); }
  setSpeaking(value) {
    this.speaking = value;
    this.clearMouth();
    // A single conservative onset movement for voices with no word events.
    // Only real word events cause further mouth movement.
    if (value && !this.still && this.active) this.pulse('I');
  }
  pulse(word) {
    this.pulseShape(articulation(word));
  }
  pulseLevel(wide) { this.pulseShape(wide ? 'open' : 'partial'); }
  pulseShape(state) {
    this.clearMouth();
    if (!this.active || !this.speaking || this.still) return;
    this.setFrame(state);
    if (state === 'open') this.timers.push(this.setTimer(() => this.setFrame('partial'), 95));
    this.timers.push(this.setTimer(() => { this.setFrame('closed'); this.timers = []; }, 185));
  }
  scheduleBlink() {
    this.clearTimer(this.blinkTimer);
    if (!this.active || this.still) return;
    this.blinkTimer = this.setTimer(() => {
      if (!this.speaking && this.active && !this.still) {
        this.clearMouth(); this.setFrame('blink');
        this.timers.push(this.setTimer(() => { this.setFrame('closed'); this.timers = []; }, 155));
      }
      this.scheduleBlink();
    }, 5700 + this.random() * 7300);
  }
  suspend() { this.active = false; this.speaking = false; this.clearMouth(); this.clearTimer(this.blinkTimer); }
}

