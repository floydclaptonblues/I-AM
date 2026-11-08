import { DialogueJourney } from './dialogue.js?v=subjects-2';

export const SAVE_KEY = 'i-am.garden.session';
// Store only canonical question IDs and preferences, never rendered text or audio.
export function loadSession(storage = () => globalThis.localStorage) {
  try {
    const raw = storage().getItem(SAVE_KEY);
    if (!raw || raw.length > 1000000) return null;
    const saved = JSON.parse(raw);
    const journey = new DialogueJourney();
    if (saved?.version !== 1 || !journey.restore(saved.conversation)) return null;
    return { journey, muted: saved.muted === true, still: saved.still === true };
  } catch { return null; }
}

export function saveSession(journey, preferences, storage = () => globalThis.localStorage) {
  try {
    storage().setItem(SAVE_KEY, JSON.stringify({
      version: 1, conversation: journey.snapshot(),
      muted: preferences.muted === true, still: preferences.still === true
    }));
    return true;
  } catch { return false; }
}

