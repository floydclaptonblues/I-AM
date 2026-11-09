import { mouthPose } from './mouth.js?v=mouth-1';
// The original poses follow the recording's syllable envelope.
export function articulation(word) {
  const vowels = (word.match(/[aeiouy]/gi) || []).length;
  return vowels > 1 || word.length > 5 ? 'open' : 'partial';
}
export class Portrait {
  constructor({ setFrame, setTimer = (fn, ms) => setTimeout(fn, ms), clearTimer = id => clearTimeout(id), random = Math.random }) {
    Object.assign(this, { setFrame, setTimer, clearTimer, random });
    this.timers = []; this.blinkTimer = null; this.active = false; this.speaking = false; this.still = false;
    this.mouthState = 'closed';
  }
  clearMouth() { this.timers.forEach(this.clearTimer); this.timers = []; this.mouthState = 'closed'; this.setFrame('closed'); }
  start() { this.active = true; this.scheduleBlink(); }
  setStill(value) { this.still = value; this.clearMouth(); this.clearTimer(this.blinkTimer); if (!value) this.scheduleBlink(); }
  setSpeaking(value) {
    if (this.speaking === value) return;
    this.speaking = value;
    this.clearMouth();
  }
  pulse(word) {
    this.pulseShape(articulation(word));
  }
  setMouthLevel(level) {
    if (!this.active || !this.speaking || this.still) return;
    const pose = mouthPose(level, this.mouthState);
    if (pose === this.mouthState) return;
    this.timers.forEach(this.clearTimer); this.timers = [];
    this.mouthState = pose;
    this.setFrame(pose);
  }
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

