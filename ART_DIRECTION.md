# Daniel's Learning Universe — Original Art Direction

This is a from-scratch character and world design brief for the five theme worlds. Everything here is original: no franchise names, logos, or copyrighted character likenesses of Transformers, Ghostbusters, Pokémon, Marvel, or Lego are referenced anywhere below, on purpose. When you connect an image-generation tool (Higgsfield or otherwise), the prompts in each section are ready to paste in as-is.

General style notes that apply to all five worlds:
- Premium, painterly-3D "luxury kids academy" look — think high-end animated feature, not flat clipart.
- Soft cinematic lighting, warm rim light, shallow depth of field.
- Rounded, friendly proportions (big eyes, soft edges) — reassuring for a 5-year-old, never scary.
- Each world has one signature accent color (already defined in `themeWorlds.ts`) that should dominate the lighting and palette.
- No text, no logos, no brand marks anywhere in generated images.

---

## 1. Robot Rescue World — helper: Captain Cog

**Design:** A palm-sized, egg-shaped rescue drone with two stubby articulated arms, a single round cyan optical lens for a "face," and a soft rubberized brushed-aluminum shell. Small retractable propeller fins on its back. No humanoid transformation gimmick — it's its own original silhouette, closer to a friendly maintenance bot than any action-figure robot.

**Palette:** brushed silver + obsidian body, cyan (#4fd8e8) glowing accents, warm gold trim on the "badge" panel on its chest.

**Personality cues:** eager, a little clumsy, chirps happily when a mission is solved.

**Sample prompt:** "A small egg-shaped friendly rescue robot mascot, brushed silver and dark obsidian metal body, single round glowing cyan optical lens, two stubby rounded arms, warm gold chest badge, soft cinematic rim lighting, floating sparkles, children's premium animated film style, 3D render, transparent background, no text, no logos."

**Environment:** Chrome Valley — a twilight canyon of smooth architectural silver towers with cyan energy lines running through the rock, floating platforms connected by light bridges.

---

## 2. Ghost Catcher Academy — helper: Professor Boo

**Design:** A round, translucent lavender ghost with a soft glow, stubby marshmallow-like arms, closed crescent-moon eyes (happy, not spooky), and a tiny bowtie. No proton-pack or trap gear resembling any existing franchise — instead a simple woven "glow-net" satchel over one shoulder.

**Palette:** lavender/violet (#8b6df5) translucency, warm white glow core, soft pink cheeks.

**Personality cues:** giggly, gentle, encouraging — a kind professor, not a hunter.

**Sample prompt:** "A round, translucent lavender ghost mascot with a soft inner glow, stubby marshmallow arms, closed happy crescent-moon eyes, tiny bowtie, carrying a small woven glow-net satchel, floating gently, dreamy violet lighting, premium animated film style, 3D render, transparent background, no text, no logos."

**Environment:** Moonlight Manor — a cozy, non-scary Victorian manor exterior at dusk with warm glowing windows, floating lanterns, and gentle purple mist.

---

## 3. Creature Quest League — helper: Ranger Wren's companion creature ("Ember")

**Design:** A small original dragon-adjacent creature — round body, big expressive eyes, tiny leaf-shaped wings, a curled tail tipped with a soft glowing berry-like light. Fully original silhouette (not a redesign of any existing "starter creature").

**Palette:** emerald/mint green (#3ee0a8) scales, warm amber belly, soft glow at tail tip.

**Personality cues:** curious, loyal, nuzzles the player's cursor/avatar when excited.

**Sample prompt:** "A small original fantasy creature, round friendly body, big expressive eyes, tiny leaf-shaped wings, curled tail with a glowing berry-like tip, emerald green scales with warm amber belly, soft magical forest lighting, premium animated film style, 3D render, transparent background, no text, no logos."

**Environment:** Wildspring Trail — misty emerald hills, oversized glowing flora, soft waterfalls.

---

## 4. Superhero Training City — helper: Coach Nova

**Design:** An original streamlined hero-in-training mentor character — simple aerodynamic bodysuit (no cape gimmick tied to any existing hero), rounded chest emblem that's an abstract starburst (not any real insignia), short practical hair, warm confident expression. Keep proportions kid-friendly (slightly stylized/rounded, not hyper-muscular).

**Palette:** rose/coral (#f0577a) primary suit color, silver accents, soft gold starburst emblem.

**Personality cues:** encouraging coach energy, high-fives, never intimidating.

**Sample prompt:** "An original friendly superhero-mentor character in a streamlined rose-coral bodysuit with silver accents and an abstract gold starburst chest emblem, no cape, kid-friendly rounded proportions, warm confident smile, dynamic heroic pose, premium animated film style, 3D render, transparent background, no text, no logos."

**Environment:** Skyline City — a bright, optimistic art-deco-inspired skyline at golden hour, soft floating light trails.

---

## 5. Brick Builder Kingdom — helper: Architect Milo

**Design:** A small original blocky-but-rounded builder character (think smooth chunky claymation proportions rather than any specific interlocking-brick figure's exact head/hand shape), wearing a simple tool belt and a soft fabric cap, holding an oversized friendly trowel.

**Palette:** gold (#f5c453) and warm terracotta, cream overalls, soft brown leather tool belt.

**Personality cues:** proud, tidy, loves showing off finished builds.

**Sample prompt:** "An original chunky claymation-style builder character, cream overalls, warm brown leather tool belt, soft fabric cap, holding an oversized friendly trowel, gold and terracotta color palette, warm workshop lighting, premium animated film style, 3D render, transparent background, no text, no logos."

**Environment:** Brickhaven Kingdom — a warm sunset kingdom of smooth rounded castle towers built from oversized glossy blocks, soft golden-hour light.

---

## Using this once an image tool is connected

1. Paste a "Sample prompt" above directly into the tool.
2. Generate at the largest size available, transparent/PNG background if supported.
3. Drop the exported PNG into `src/assets/characters/` (create that folder) and reference it from the matching entry in `src/data/themeWorlds.ts` instead of the current emoji placeholder (`helperEmoji`).
4. Keep file sizes reasonable (compress PNGs) since this is a client-only app with no CDN.

No prompt above should ever be edited to reference a real franchise, character name, or logo — if a future prompt drifts in that direction, don't run it.
