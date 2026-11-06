# I AM

A static dialogue encounter. Open the site, enter, and question the serpent.

## Run

Node.js 18+; no packages or build step required.

```sh
npm start
npm test
npm run check
```

The local server uses http://127.0.0.1:4173. GitHub Pages serves `main` from `/(root)` at https://floydclaptonblues.github.io/I-AM/. Every URL in the application is relative to support that project path.

## Interaction

- Enter starts the opening line from a user gesture. No automatic audio before entry.
- Six numbered questions are initially available, with 26 exchanges in total. Follow-up questions unfold through the conversation: uprightness leads to hands, purpose, work, and freedom; the test leads to death, burial, and memory; identity leads to age, hurry, lies, and belief; the garden leads to paradise and return; evil leads to light, darkness, abandonment, resentment, and enjoyment.
- After each answer, only its related follow-ups appear (at most four). BACK restores the previous answer and question group; FIRST QUESTIONS returns to the six opening questions. These controls stop narration without replaying it or adding duplicate transcript entries. Unlocked knowledge and the Review transcript are preserved.
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

Browser speech synthesis chooses available English voices, preferring David, Daniel, or George. Rate is 0.82 and pitch is 0.65. Voice quality, word timing, and availability depend on the browser/OS; this is speech-event articulation, not phoneme-perfect lip synchronization. The app requests no microphone access and runs no custom AI service. Some browser voices use the browser vendor's online speech services.

## Source map

- `index.html`: entry screen, original console hardware, portrait window, response panel, choices, controls, Review dialog
- `styles.css`: metal finish, responsive layout, green/amber typography, restrained CRT effects
- `app.js`: encounter state, transcripts, question selection, captions, sound/motion controls
- `dialogue.js`: original answers, additional dialogue, unlock requirements
- `speech.js`: speech synthesis lifecycle and cancellation guards
- `portrait.js`: discrete mouth states and independent blinking
- `assets/`: original garden GIF, extracted still, portrait sheet, texture, favicon, provenance
- `tests/`: speech lifecycle, unchanged core dialogue, unlock logic, portrait motion and copy audit
- `scripts/serve.mjs`: local static server
- `.nojekyll`: plain static Pages serving

## Validation and recovery

`npm test` covers 19 cases including rapid switching, cancellation, failed speech, locked questions, reachability of every exchange, bounded related-choice groups, back/first navigation, current-group numbering, all three mouth states, independent blinking, reduced motion, and original-dialogue preservation. Syntax checks cover all application modules. Browser QA is performed against the published site when local preview policy prevents localhost access.

The original implementation remains at commit `3af1b1d`. The redesign is also retained on `codex/garden-dialogue-redesign`. To roll back, restore the desired commit through a normal revert or a new commit; do not force-push over unrelated work.
