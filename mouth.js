// O(1) lookup follows media time, even when a phone skips animation frames.
// Linear interpolation avoids jumping between samples; no wall-clock mouth timer.
export function mouthLevelAt(mouth, time) {
  if (!mouth || !Number.isFinite(time) || time < 0) return 0;
  const position = time / mouth.step;
  const index = Math.floor(position);
  if (index >= mouth.samples.length) return 0;
  const first = mouth.samples[index];
  const second = mouth.samples[index + 1] ?? 0;
  return (first + (second-first)*(position-index))/255;
}

// Preserve the original three poses, with separate opening/closing thresholds
// so quiet syllables don't chatter between two frames at the same loudness.
export function mouthPose(level, previous = 'closed') {
  if (level <= .07) return 'closed';
  if (previous === 'closed' && level < .12) return 'closed';
  if (level >= .72 || (previous === 'open' && level > .56)) return 'open';
  return 'partial';
}
