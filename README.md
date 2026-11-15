# I AM

A static dialogue encounter. Open the site and question the serpent.

## Run

Node.js 22+ and ffmpeg. Prepare audio once with `node scripts/prepare-audio.mjs` before previewing the site.

```sh
npm start
npm test
npm run check
```

The local server uses http://127.0.0.1:4173. GitHub Pages publishes `main` through `.github/workflows/pages.yml` at https://floydclaptonblues.github.io/I-AM/. Pages Settings must use **GitHub Actions** as the source. Every URL in the application is relative to support that project path.

The Publish the garden workflow runs all tests and syntax checks, packages only the public HTML, CSS, JavaScript, and assets, and deploys after those checks pass. Pushes to `main` publish automatically; the Actions tab also supports a manual run. Deployments run one at a time without interrupting an active publication. This replaces the automatic branch-publishing workflow whose November 6 retry remained queued without starting a job.

## Interaction

- The garden opens directly into the conversation. Returning visitors see their saved answer and choices immediately. A fresh visitor hears “What would you like to know? Since you already ate from the tree, I can tell you now and you'll understand.” automatically when browser policy permits. The visit is saved immediately, so returning to any valid save stays silent, including the opening position. A blocked opening offers Hear the Serpent in the console; selecting a question, muting, stopping, or leaving cancels the pending greeting. No entry screen is added.
- Progress is saved after each choice or navigation action in this browser’s local storage, including the Back trail, asked questions, Review transcript, and sound/motion preferences. It does not sync between devices. Cleared browser data/private-session expiry removes the save. Missing, invalid, or unavailable storage never blocks the conversation.
- Start Over is available in the console. Its confirmation offers Keep My Place; confirming resets the saved conversation and transcript while retaining sound/motion preferences, then speaks “I was always here.” unless sound is muted.
- The five subjects are The Universe, The Garden, God, Humanity, and I Am. Each question section opens its full unanswered list. Every response returns to the five subjects with the last reply available for Replay. The Garden directly narrates passages compiled from its original six exchanges.
- Back from a list returns to the subjects. Back from the subjects shows the preceding answer. Review preserves the conversation in the words the visitor chose. Previous saves keep their history, except for the retired solitude exchange.
- The darkness question is available on the first visit. The serpent holds its gaze for three seconds before answering, including when muted.
- Use touch, Tab and Enter, or the displayed number. For a two-digit question, type both digits in succession.
- Sound toggles audio, Replay repeats the selected answer, Silence stops it, Still pauses all visual motion, and Review opens the full conversation transcript.
- The complete selectable answer stays visible throughout narration. A stable accessible copy describes its focusable answer group; only visual token classes change for sentence and word highlights. That copy is not a live region. The delayed finale uses answer focus or one polite announcement, never both, and does not steal focus if the visitor moved to a control during the silence.
- Mute, errors, missing recordings, or stalled audio leave all answer text available. Unmuting never unexpectedly starts audio.
- The portrait has separate closed, partial, open, and closed-mouth blink frames. Mouth poses follow a smoothed 50 Hz recording envelope; silence, cancellation, hidden pages, and reduced motion close the mouth.
- Reduced motion disables all portrait movement, blinking, interference, and the animated background. The user's operating-system preference takes priority over the Still switch. Still, Review and Start Over are in the Options menu. Small screens use a compact sticky portrait and a single page scrolling surface; response and question panels do not scroll independently.
- Native dialog focus management, labeled controls, a skip link, text transcripts, and a polite screen-reader status region remain available. Rapid caption changes are not announced through a live region.

## Narrative and assets

The three original answers (`garden`, `test`, and `evil`) are unchanged from commit `3af1b1df8fba015e53ff6f0780bb3764befa9c48`. Other answers expand the conversation. No scientific or editorial disclaimer appears inside the experience; all assertions are first-person character speech.

The metal, grain, frame, controls, and interface are original code-native artwork. No Fallout images, logos, textures, or sound files are included. See [asset provenance](assets/PROVENANCE.md) for the supplied GIF/video and the derived portrait set.

The approved single David recording is shared across browsers. Ordinary pauses are 300 ms and rhetorical transitions are 650 ms. Stop, mute, switching questions, and leaving cancel playback and its cues. Audio failure retains the complete text without switching to a different device voice. The app requests no microphone access and uses no online speech service.

## Source map

- `index.html`: original console hardware, portrait window, response panel, choices, controls, Review dialog
- `styles.css`: metal finish, responsive layout, ivory/gold typography and the brighter Eden background, restrained CRT effects
- `app.js`: encounter state, transcripts, question selection, captions, sound/motion controls
- `dialogue.js`: original answers, section menus, transcript, and saved journey
- `response.js`: cancellable silence and held gaze for the late response
- `session.js`: versioned browser-local persistence with validation and graceful storage failures
- `speech.js`: greeting lifecycle, pacing helper, and retained legacy narrator tests
- `recorded-voice.js`: shared David audio, media-clock cues, and cancellation guards
- `portrait.js`: discrete mouth states and independent blinking
- `assets/`: original garden GIF/still, archived night photograph, portrait sheet, texture, favicon, provenance
- `tests/`: speech lifecycle, unchanged core dialogue, section navigation, portrait motion and copy audit
- `scripts/serve.mjs`: local static server
- `.nojekyll`: plain static Pages serving

## Validation and recovery

The unit suite checks dialogue fidelity, all section questions in arbitrary order, saved progress, the compiled Garden, playback, portrait motion, and the held gaze.

The original implementation remains at commit `3af1b1d`. The redesign is also retained on `codex/garden-dialogue-redesign`. To roll back, restore the desired commit through a normal revert or a new commit; do not force-push over unrelated work.

The current backdrop is the original Eden GIF, displayed at 118% brightness without a tint, shadow overlay, or vignette. Still and reduced-motion modes use its first frame with the same brightness. The console and controls retain the charcoal, warm ivory and muted gold palette and their existing layout. The night photograph remains archived and is no longer selected by the application.

The console shell uses a nearly opaque charcoal surface so the metal remains solid while Eden is visible around it. Dialogue and question panels keep their dark backing. The original serpent sheet is unchanged; contrast and lighting are adjusted subtly through CSS.

## Immersion remediation



`answer.js` owns stable answer text and visual highlighting. `background.js` decodes the original GIF into a canvas on browsers with ImageDecoder, retaining the exact displayed frame during the finale and resuming from it. Other browsers use pauseable WebM/MP4 video derived from that same GIF during the build, retaining the displayed video frame. Unsupported codecs or blocked autoplay retain a static poster. No original GIF or portrait asset is replaced. The finale brings the portrait and answer together and keeps subsequent choices hidden until delivery finishes; navigation and Stop remain usable. Muted replay can repeat the visual moment.

Speech pacing is baked into the recordings using the shared pacing helper: ordinary transitions are 300 ms and rhetorical transitions are 650 ms. The finale retains its separate three-second silence, then plays at 0.85 speed and 0.55 volume with pitch preservation.

Run `npm test` and `npm run check` without dependencies. Browser checks additionally require `npm install --no-save --package-lock=false --ignore-scripts playwright@1.56.1 axe-core@4.11.0` and `npx playwright install chromium`, then install ffmpeg and run `node scripts/prepare-background.mjs` and `node scripts/prepare-audio.mjs` before `npm run test:browser`. Set BASE_URL to inspect an existing server. The browser suite uses controlled media events, actual MP3 playback, six required viewport sizes, axe WCAG A/AA checks, and screenshots under test-results. It does not establish subjective voice quality or substitute for actual screen-reader and physical-device testing. Both working-branch verification and Pages publication run these checks.




Browser checks exercise category focus, two-digit shortcuts, refresh persistence, and full menus on small screens.

## Consistent David voice

The user-approved Microsoft David Desktop voice is recorded at SAPI pitch -6 and rate 0. Both desktop and mobile play the same files. There is no device-voice fallback: unavailable or blocked audio keeps the complete written answer and permits replay. The opening and all current responses have recordings.

Lossless sources in `voice-source/` are compressed WAV files. `node scripts/prepare-audio.mjs` uses ffmpeg to create 64 kbit/s MP3s for deployment; source files and tooling are not published. Source names include a recording hash. CI checks the exact dialogue against the recording manifest before publication.

Sentence highlighting follows measured sentence boundaries. Mouth poses follow a smoothed 50 Hz waveform envelope, with interpolation and separate opening/closing thresholds to avoid flutter. Sustained sounds hold their pose, and silence closes the jaw immediately. There are no repeating jaw timers: each display frame reads the current audio position, so dropped frames do not accumulate timing drift on mobile. This is stylized three-pose articulation, not phoneme lip-sync. The media clock handles buffering, cancellation, replay, and the quieter, slower finale. Reduced motion and the held gaze suppress mouth movement.

To regenerate after a dialogue change, use PowerShell 7 on Windows with the approved David voice installed: `node scripts/export-voice-script.mjs`, `./scripts/render-david.ps1`, `python scripts/package-david.py`, then `node scripts/prepare-audio.mjs`. Review changed recordings before committing their sources and manifest. Existing recordings require no speech service or credentials.

To rebuild mouth timing without changing any voice recording, run `python scripts/mouth-envelope.py`. The committed timing file is compact and decoding it requires no microphone permission, AudioContext, or ongoing sound analysis on mobile. Browser tests cover mobile audio-time jumps, sustained vowels, silence, buffering, and stopping.
