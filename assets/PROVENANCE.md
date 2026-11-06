# Asset provenance

- `angel-night.jpg`: user-supplied **20251029_184522.jpg**, copied byte-for-byte as the current page and console background. SHA-256: `6299e0fb92047dd2d3ffd86cfb055eab7d5b3199b24ad3ad9253ae7baa9eb164`.
- `night-fallback.svg`: original neutral charcoal fallback for a failed photograph load.
- The previous garden GIF and still remain archived; they are no longer the active background.

- `eden-figs.gif`: supplied by the user as **Eden Garden Figs Animation.gif**, copied byte-for-byte. SHA-256: `b94e7b6c9c8d735eaa3093681f0cc1d7ddbe41b356ea28a39e3857a23ec3683c`.
- `garden-still.webp`: first frame of that GIF, used for reduced motion and before entry.
- `serpent-states.webp`: an original four-frame portrait sheet derived with the built-in ImageGen tool from a frame of the user-supplied **cmaym1kxk009r3j77s9h7rwb6.mp4**. The supplied video showed a brown snake, a tree, and an arena; the edit retained the snake's facial structure while creating the requested green, close-up game portrait. It is not presented as an untouched video extraction.
- Sheet layout: closed mouth / partial mouth on the first row, open mouth / closed-mouth blink on the second row. Runtime uses CSS background-position to switch discrete cells. It never loops the sheet as a talking animation.
- `metal-grain.svg` and CSS hardware: original code-authored texture and forms.
- `garden-still.svg`: original fallback scenery retained from the first version, used only on background load failure.
- No Fallout artwork, branding, textures, fonts, or audio were copied. The reference informed layout and interaction only.

## ImageGen prompt

Edit the supplied snake image into a game-ready four-frame talking NPC portrait sprite sheet. Use this exact snake's facial structure (long wedge snout, large dark forward-set eyes, small nostrils, broad scaly lower jaw), recolor the scales rich muted forest green with a pale olive throat. Original 1990s pre-rendered CGI adventure/RPG game asset, visibly low-resolution dithered shading, restrained detail, serious ancient patient expression. No goofy grin, no eyebrows, no humanoid teeth, no cobra hood. Remove tree, arena and blue sky entirely. Plain near-black deep olive backdrop. Composition MUST be a precise 2 by 2 grid of equal square cells with NO gutters, NO borders, NO labels, NO text. In EVERY cell show IDENTICAL locked camera and identical snake head/neck placement at same size: three-quarter head turned slightly toward viewer's left, large close-up head filling upper 65% and curved neck to bottom, subtle left top light. Top-left: closed mouth, eyes open, listening. Top-right: same head with mouth partly open (small speaking gap), eyes open. Bottom-left: same head with mouth fully open (moderate speaking gape, not attacking), eyes open. Bottom-right: IDENTICAL to top-left closed mouth, eyes closed for a blink. All four cells must match precisely in silhouette position, framing, light and texture so they can be swapped without jitter. Nothing else in the image. Output square 1024 by 1024 sheet.

The returned sheet was 1254 × 1254 pixels; it was encoded as WebP for delivery. The original generated PNG is preserved outside the repository.
