# I AM

A garden. A witness. A story that remembers you differently.

An atmospheric, responsive, static web experience with five selectable monologues, an animated SVG serpent, browser speech synthesis, sentence captions with word highlighting when available, full transcripts, mute/replay/stop, and a still-garden control. No build step, dependencies, accounts, analytics, API keys, or backend.

## Run locally

Use Node.js 18 or newer:

```sh
npm start
```

Open http://127.0.0.1:4173. Run `npm test` for the narration lifecycle tests and `npm run check` for JavaScript syntax validation.

## GitHub Pages

This repository is ready for branch-based Pages deployment; deployment is not enabled by the source code itself.

In repository **Settings → Pages**, select **Deploy from a branch**, **main**, **/(root)**, then Save. GitHub will publish the static files without a build dependency. All asset URLs are relative, so the `/I-AM/` project path is supported. Wait for the Pages deployment to succeed and open the URL shown in Settings before claiming the site is live. No custom domain is configured.

## Narrative

The first three answers in `dialogue.js` preserve the author's garden, test, and evil passages with light grammatical edits. Two additional answers develop the uprightness and toil themes. The opening line is “I was always here.” Nothing speaks before the visitor interacts.

The footer's “A note in the margin” identifies the serpent as an unreliable fictional witness and distinguishes its account from established paleoanthropology. It links to [Smithsonian Human Origins: Walking Upright](https://humanorigins.si.edu/human-characteristics/walking-upright). The claims about concealing death through burial, fruit-driven uprightness, and discovery of death belong to the character, not a scientific explanation.

## Background provenance

`assets/eden-figs.gif` is a byte-for-byte copy of the author's supplied **Eden Garden Figs Animation.gif** (475 × 356 pixels, nine frames). `assets/garden-still.webp` is a still extracted from its first frame. `assets/background.json` selects the sources. The original drawn `garden-still.svg` is only a last-resort load-error fallback. The animated GIF is never initially embedded for visitors whose system requests reduced motion; those visitors see the static first frame.

## Voice and accessibility

- Questions, replay, mute, stop, disclosure controls, and the skip link support keyboard interaction and visible focus.
- Mute immediately cancels speech; all answer text stays visible. Unmute does not unexpectedly restart narration. Press Replay to hear it.
- Captions follow actual sentence-start events; word highlighting and jaw pulses follow `SpeechSynthesisUtterance` word-boundary events when the voice provides them.
- Browser speech synthesis does not expose a phoneme stream or audio amplitude. Jaw motion is approximate articulation, not phoneme-perfect lip sync. Voices without word boundaries use a rhythmic fallback only during actual speaking events. Voice, accent, and timing vary by OS/browser; see [MDN boundary event documentation](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/boundary_event).
- Short sentence utterances reduce long-speech engine failures. A generation token prevents cancelled callbacks from resurrecting old answers. Failed or stalled voices expose the full written answer; the visitor can retry.
- “Still garden” freezes the background and character. System reduced-motion preferences also disable jaw and idle animation, and take priority over the motion button.
- Full answers are available in an ordinary text disclosure. Rapid word updates are not an ARIA live region, avoiding repeated interruption of screen readers. Status changes use a polite status region. On phones, selecting a question focuses and scrolls to its answer.
- Leaving or hiding the page stops narration. There is no microphone access. Browser/OS voices may use their own online services; the site itself sends no narration request to a custom server.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page, serpent artwork, controls, myth note |
| `styles.css` | Responsive garden composition and motion preferences |
| `app.js` | Interaction, captions, background and jaw animation |
| `speech.js` | Narration state and cancellation |
| `dialogue.js` | Opening and five monologues |
| `assets/` | Original GIF, still frame, fallback art, favicon and configuration |
| `scripts/serve.mjs` | Dependency-free local preview |
| `tests/speech.test.mjs` | Speech lifecycle and narrative regression tests |
| `.nojekyll` | Plain static Pages serving |

## Verification

Seven automated tests cover complete sentence sequencing, rapid switching, stop/cancellation, boundary forwarding, missing/failed speech, stalled startup, and core dialogue retention. Browser checks cover desktop and 390-pixel phone layouts, all five questions, full answers while muted, still-image switching, mobile answer focus, and actual speech-driven sentence changes, word highlighting, and jaw movement. Stopping returns the jaw to zero. These checks do not guarantee every system voice; manually confirm the preferred voice on the intended target browsers before a wider release.
