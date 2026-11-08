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

- The garden opens directly into the conversation. Returning visitors see their saved answer and choices immediately. A fresh visitor hears “What would you like to know? Since you already ate from the tree, I can tell you now and you'll understand.” automatically when browser policy permits. The visit is saved immediately, so returning to any valid save stays silent, including the opening position. A blocked opening offers Hear the Serpent in the console; selecting a question, muting, stopping, or leaving cancels the pending greeting. No entry screen is added.
- Progress is saved after each choice or navigation action in this browser’s local storage, including the Back trail, unlocks, Review transcript, and sound/motion preferences. It does not sync between devices. Cleared browser data/private-session expiry removes the save. Missing, invalid, or unavailable storage never blocks the conversation.
- Start Over is available in the console. Its confirmation offers Keep My Place; confirming resets the saved conversation and transcript while retaining sound/motion preferences, then speaks “I was always here.” unless sound is muted. First Questions still preserves progress.
- Five numbered subjects are initially available: The Universe, The Garden, God, Humanity, and I Am. Selecting a subject shows its unlocked questions; all 51 exchanges belong to exactly one subject. Subject selection preserves the current answer and never counts as a discovery. The selected subject is saved across refreshes, and old saves remain compatible. All 48 original answers remain unchanged. Three paired-claim challenges become available after the relevant statements have been encountered: questioning the father and humanity calling back; enjoying evil and human suffering; solitude and the other lights. Each remains available when revisiting its relevant conversations and survives saved progress.
- After each answer, only related follow-ups appear: at most four ordinary questions plus one unlocked paired-claim challenge. BACK restores the previous answer and question group; ASK SOMETHING ELSE offers the five subjects without replacing the current answer or erasing the conversation trail. CONTINUE THIS CONVERSATION returns to its immediate follow-ups. Identity and age are under I Am; life before humans is under the universe; the finale still explicitly requires identity and age. These controls stop narration without replaying it or adding duplicate transcript entries. Asked questions use subdued italic text. No progress counters or discovery notifications are displayed. The opening no longer presumes knowledge of a “test” or unnamed “others”; the fruit question appears after the garden answer, and the fallen follow after the test.
- The First Light expansion adds 22 verbatim exchanges. How Old Are You leads to Before Humans, then the lights, the father, and humanity calling back. Earlier answer text, prerequisites, and navigation edges remain intact, so existing saves still restore.
- The final darkness question requires the obsession, father, and human-recognition branches. A forward route takes 17 distinct questions including the final question, with no repeats. The other lights, fear, and shadows remain optional side paths; all previous navigation edges and saves are retained. It is never in the opening menu. Its portrait holds still for a three-second silence, then reveals the exact answer. Speech uses rate 0.85, the same lowered pitch as ordinary speech, and volume 0.55. Muted visitors receive the same delayed text and a brief held gaze. Replay repeats the effect; Stop, mute, Back, another question, Review, restart, or leaving cancels it immediately. Reduced motion remains in effect.
- Select questions with mouse/touch, Tab + Enter, or number keys for the current visible group. After choosing, focus moves to the complete accessible answer; Tab continues through controls to the next choices. Back returns focus to the previous choice. Question buttons do not use toggle semantics. Escape stops narration outside dialogs.
- Sound toggles audio, Replay repeats the selected answer, Silence stops it, Still pauses all visual motion, and Review opens the full conversation transcript.
- The complete selectable answer stays visible throughout narration. A stable accessible copy describes its focusable answer group; only visual token classes change for sentence and word highlights. That copy is not a live region. The delayed finale uses answer focus or one polite announcement, never both, and does not steal focus if the visitor moved to a control during the silence.
- Mute, errors, missing voices, or a stalled speech engine leave all answer text available. Unmuting never unexpectedly starts audio.
- The portrait has separate closed, partial, open, and closed-mouth blink frames. Mouth pulses are triggered by real word events; silence, cancellation, hidden pages, and reduced motion close the mouth. Voices without word boundaries receive only a brief sentence-onset movement, not a simulated talking loop.
- Reduced motion disables all portrait movement, blinking, interference, and the animated background. The user's operating-system preference takes priority over the Still switch. Still, Review and Start Over are in the Options menu. Small screens use a compact sticky portrait and a single page scrolling surface; response and question panels do not scroll independently.
- Native dialog focus management, labeled controls, a skip link, text transcripts, and a polite screen-reader status region remain available. Rapid caption changes are not announced through a live region.

## Narrative and assets

The three core answers (`garden`, `test`, and `evil`) are unchanged from commit `3af1b1df8fba015e53ff6f0780bb3764befa9c48`. Other answers expand the conversation. No scientific or editorial disclaimer appears inside the experience; all assertions are first-person character speech.

The metal, grain, frame, controls, and interface are original code-native artwork. No Fallout images, logos, textures, or sound files are included. See [asset provenance](assets/PROVENANCE.md) for the supplied GIF/video and the derived portrait set.

Browser speech synthesis chooses available English voices, preferring David, Daniel, or George. Rate is 1.0 (about 22% faster than the previous 0.82 setting) and pitch is approximately 0.356 (0.4 multiplied by the frequency ratio for -2 semitones). This is a best-effort pitch approximation: the browser API uses a voice-dependent pitch scale, not calibrated semitones. Ordinary pauses are 300 ms; rhetorical transitions are 650 ms, with optional explicit per-sentence timing. A voice that fails before starting retries once with an alternate local voice or the browser default. Cancellation invalidates retries, and speech that already started is never automatically repeated. Idle cleanup no longer sends redundant cancellation calls; a paused engine resumes before speaking. The mouth rests during these pauses; Stop, mute, switching questions, and leaving the page cancel the pending next sentence. Voice quality, word timing, and availability depend on the browser/OS; this is speech-event articulation, not phoneme-perfect lip synchronization. The app requests no microphone access and runs no custom AI service. Some browser voices use the browser vendor's online speech services.

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

`npm test` covers 74 cases including rapid switching, cancellation, failed speech, bounded startup retry, paused-engine recovery, full narration of all 51 answers, locked questions, reachability of every exchange, bounded related-choice groups, back/first navigation, current-group numbering, all three mouth states, independent blinking, reduced motion, all 22 supplied passages verbatim, all 26 earlier exchanges unchanged, existing-save compatibility, late-stage gates, repeatable held responses, and original-dialogue preservation. Syntax checks cover all application modules. Browser QA is performed against the published site when local preview policy prevents localhost access.

The original implementation remains at commit `3af1b1d`. The redesign is also retained on `codex/garden-dialogue-redesign`. To roll back, restore the desired commit through a normal revert or a new commit; do not force-push over unrelated work.

The current backdrop is the original Eden GIF, displayed at 118% brightness without a tint, shadow overlay, or vignette. Still and reduced-motion modes use its first frame with the same brightness. The console and controls retain the charcoal, warm ivory and muted gold palette and their existing layout. The night photograph remains archived and is no longer selected by the application.

The console shell uses a nearly opaque charcoal surface so the metal remains solid while Eden is visible around it. Dialogue and question panels keep their dark backing. The original serpent sheet is unchanged; contrast and lighting are adjusted subtly through CSS.

## Immersion remediation

Light and darkness both offer Before Humans without an identity detour. The original age entrance also works. The final certainty question additionally requires age, preserving the original sixteen necessary discoveries even when the alternate entrance is used. The ambiguous Why label is displayed as Why did you wait for us?; its canonical answer is unchanged.

`answer.js` owns stable answer text and visual highlighting. `background.js` decodes the original GIF into a canvas on browsers with ImageDecoder, retaining the exact displayed frame during the finale and resuming from it. Other browsers use pauseable WebM/MP4 video derived from that same GIF during the build, retaining the displayed video frame. Unsupported codecs or blocked autoplay retain a static poster. No original GIF or portrait asset is replaced. The finale brings the portrait and answer together and keeps subsequent choices hidden until delivery finishes; navigation and Stop remain usable. Muted replay can repeat the visual moment.

Speech pacing is configurable through the Narrator play options: ordinary transitions default to 300 ms, rhetorical transitions to 650 ms, and explicit per-sentence pauses can reach 2000 ms. The finale retains its separate three-second silence. The existing rate, pitch and quieter finale voice settings remain in place.

Run `npm test` and `npm run check` without dependencies. Browser checks additionally require `npm install --no-save --package-lock=false --ignore-scripts playwright@1.56.1 axe-core@4.11.0` and `npx playwright install chromium`, then install ffmpeg and run `node scripts/prepare-background.mjs` before `npm run test:browser`. Set BASE_URL to inspect an existing server. The browser suite uses controlled speech events, six required viewport sizes, axe WCAG A/AA checks, and screenshots under test-results. It does not establish subjective voice quality or substitute for actual screen-reader and physical-device testing. Both working-branch verification and Pages publication run these checks.

The original 55 unit cases are retained. Content counts now include the three additions; the First Light fixture still compares exactly its original 22 exchanges. The bounded-choice assertion retains the four ordinary-question limit and separately allows at most one paired-claim challenge. The old 1400 ms speech expectation is replaced by the requested shorter timing. Nine additional unit cases cover the new gates, persistence, exact reactions, alternate entrance, pacing, and text offsets.


Subject checks cover complete question classification, context-sensitive availability, navigation without discoveries, saved menus, cross-subject history, and reachability with finale prerequisites. Browser checks also exercise number keys, category focus, refresh persistence and a 320 px subject list. The original single browser robot voice remains in use.
