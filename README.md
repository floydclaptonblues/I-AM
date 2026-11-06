# I AM

A static dialogue encounter. Open the site and question the serpent.

## Run

Node.js 18+; no packages or build step required.

```sh
npm start
npm test
npm run check
```

The local server uses http://127.0.0.1:4173. GitHub Pages publishes `main` through `.github/workflows/pages.yml` at https://floydclaptonblues.github.io/I-AM/. Pages Settings must use **GitHub Actions** as the source. Every URL in the application is relative to support that project path.

The Publish the garden workflow runs all tests and syntax checks, packages only the public HTML, CSS, JavaScript, and assets, and deploys after those checks pass. Pushes to `main` publish automatically; the Actions tab also supports a manual run. Deployments run one at a time without interrupting an active publication. This replaces the automatic branch-publishing workflow whose November 6 retry remained queued without starting a job.

## Interaction

- The garden opens directly into the conversation. Returning visitors see their saved answer and choices immediately. A fresh visitor hears “I was always here.” automatically when browser policy permits. The visit is saved immediately, so returning to any valid save stays silent, including the opening position. A blocked opening offers Hear the Serpent in the console; selecting a question, muting, stopping, or leaving cancels the pending greeting. No entry screen is added.
- Progress is saved after each choice or navigation action in this browser’s local storage, including the Back trail, unlocks, Review transcript, and sound/motion preferences. It does not sync between devices. Cleared browser data/private-session expiry removes the save. Missing, invalid, or unavailable storage never blocks the conversation.
- Start Over is available in the console. Its confirmation offers Keep My Place; confirming resets the saved conversation and transcript while retaining sound/motion preferences, then speaks “I was always here.” unless sound is muted. First Questions still preserves progress.
- Six numbered questions are initially available, with 48 exchanges in total. Follow-up questions unfold through the conversation: uprightness leads to hands, purpose, work, and freedom; the test leads to death, burial, and memory; identity leads to age, hurry, lies, and belief; the garden leads to paradise and return; evil leads to light, darkness, abandonment, resentment, and enjoyment.
- After each answer, only its related follow-ups appear (at most four). BACK restores the previous answer and question group; FIRST QUESTIONS returns to the six opening questions. These controls stop narration without replaying it or adding duplicate transcript entries. Unlocked knowledge and the Review transcript are preserved.
- The First Light expansion adds 22 verbatim exchanges. How Old Are You leads to Before Humans, then the lights, the father, and humanity calling back. Earlier answer text, prerequisites, and navigation edges remain intact, so existing saves still restore.
- The final darkness question requires the obsession, father, and human-recognition branches. A forward route takes 17 distinct questions including the final question, with no repeats. The other lights, fear, and shadows remain optional side paths; all previous navigation edges and saves are retained. It is never in the opening menu. Its portrait holds still for a three-second silence, then reveals the exact answer. Speech uses rate 0.85, the same lowered pitch as ordinary speech, and volume 0.55. Muted visitors receive the same delayed text and a brief held gaze. Replay repeats the effect; Stop, mute, Back, another question, Review, restart, or leaving cancels it immediately. Reduced motion remains in effect.
- Select questions with mouse/touch, Tab + Enter, or number keys for the current visible group. Focus moves into each new group and returns to the previous choice when going back. Escape stops narration outside the Review dialog.
- Sound toggles audio, Replay repeats the selected answer, Silence stops it, Still pauses all visual motion, and Review opens the full conversation transcript.
- Responses follow actual sentence starts; the active word highlights when the browser voice supplies word boundaries. At the end, the whole answer remains in the scrollable text panel.
- Mute, errors, missing voices, or a stalled speech engine leave all answer text available. Unmuting never unexpectedly starts audio.
- The portrait has separate closed, partial, open, and closed-mouth blink frames. Mouth pulses are triggered by real word events; silence, cancellation, hidden pages, and reduced motion close the mouth. Voices without word boundaries receive only a brief sentence-onset movement, not a simulated talking loop.
- Reduced motion disables all portrait movement, blinking, interference, and the animated background. The user's operating-system preference takes priority over the Still switch.
- Native dialog focus management, labeled controls, a skip link, text transcripts, and a polite screen-reader status region remain available. Rapid caption changes are not announced through a live region.

## Narrative and assets

The three core answers (`garden`, `test`, and `evil`) are unchanged from commit `3af1b1df8fba015e53ff6f0780bb3764befa9c48`. Other answers expand the conversation. No scientific or editorial disclaimer appears inside the experience; all assertions are first-person character speech.

The metal, grain, frame, controls, and interface are original code-native artwork. No Fallout images, logos, textures, or sound files are included. See [asset provenance](assets/PROVENANCE.md) for the supplied GIF/video and the derived portrait set.

Browser speech synthesis chooses available English voices, preferring David, Daniel, or George. Rate is 1.0 (about 22% faster than the previous 0.82 setting) and pitch is approximately 0.356 (0.4 multiplied by the frequency ratio for -2 semitones). This is a best-effort pitch approximation: the browser API uses a voice-dependent pitch scale, not calibrated semitones. There is still a 1.4-second pause between sentences. A voice that fails before starting retries once with an alternate local voice or the browser default. Cancellation invalidates retries, and speech that already started is never automatically repeated. Idle cleanup no longer sends redundant cancellation calls; a paused engine resumes before speaking. The mouth rests during these pauses; Stop, mute, switching questions, and leaving the page cancel the pending next sentence. Voice quality, word timing, and availability depend on the browser/OS; this is speech-event articulation, not phoneme-perfect lip synchronization. The app requests no microphone access and runs no custom AI service. Some browser voices use the browser vendor's online speech services.

## Source map

- `index.html`: original console hardware, portrait window, response panel, choices, controls, Review dialog
- `styles.css`: metal finish, responsive layout, ivory/gold typography and the brighter Eden background, restrained CRT effects
- `app.js`: encounter state, transcripts, question selection, captions, sound/motion controls
- `dialogue.js`: original answers, additional dialogue, unlock requirements
- `response.js`: cancellable silence and held gaze for the late response
- `session.js`: versioned browser-local persistence with validation and graceful storage failures
- `speech.js`: speech synthesis lifecycle and cancellation guards
- `portrait.js`: discrete mouth states and independent blinking
- `assets/`: original garden GIF/still, archived night photograph, portrait sheet, texture, favicon, provenance
- `tests/`: speech lifecycle, unchanged core dialogue, unlock logic, portrait motion and copy audit
- `scripts/serve.mjs`: local static server
- `.nojekyll`: plain static Pages serving

## Validation and recovery

`npm test` covers 55 cases including rapid switching, cancellation, failed speech, bounded startup retry, paused-engine recovery, full narration of all 48 answers, locked questions, reachability of every exchange, bounded related-choice groups, back/first navigation, current-group numbering, all three mouth states, independent blinking, reduced motion, all 22 supplied passages verbatim, all 26 earlier exchanges unchanged, existing-save compatibility, late-stage gates, repeatable held responses, and original-dialogue preservation. Syntax checks cover all application modules. Browser QA is performed against the published site when local preview policy prevents localhost access.

The original implementation remains at commit `3af1b1d`. The redesign is also retained on `codex/garden-dialogue-redesign`. To roll back, restore the desired commit through a normal revert or a new commit; do not force-push over unrelated work.

The current backdrop is the original Eden GIF, displayed at 118% brightness without a tint, shadow overlay, or vignette. Still and reduced-motion modes use its first frame with the same brightness. The console and controls retain the charcoal, warm ivory and muted gold palette and their existing layout. The night photograph remains archived and is no longer selected by the application.

The console shell uses a 75%-opaque charcoal surface so the Eden GIF can show through. Dialogue and question panels keep their 93%-opaque dark backing; text, controls and the portrait retain full opacity.
