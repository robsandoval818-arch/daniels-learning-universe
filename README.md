# Daniel's Learning Universe

A private, premium daily reading & math mastery game — built for one child, played on one family's devices, never published publicly.

This is **not** a Kumon product, is **not** affiliated with Kumon, and does not reproduce any Kumon worksheets, branding, or copyrighted material. It uses an **original** skill-sequencing structure inspired by the general, well-established pedagogical order visible in the attached mastery-table photos (e.g. "counting before writing numbers," "addition before subtraction," "single sentences before paragraphs"), rewritten from scratch as our own "mastery-based learning path." No table images, worksheets, page layouts, or exact wording from any copyrighted material are included in this repo.

Similarly, the five theme worlds (Robot Rescue, Ghost Catcher, Creature Quest, Superhero Training, Brick Builder) are **original creations** inspired only by broad genre styles — no character names, logos, or IP from Transformers, Ghostbusters, Pokémon, Marvel, or Lego are used anywhere in the code, copy, or assets.

---

## 1. What this app does

Daniel picks one of five original worlds. That choice re-skins the *same* underlying curriculum engine — backgrounds, his helper character, mission wording, rewards, badges, and the level-up screen all change, but the actual reading/math skill sequence underneath stays consistent and mastery-driven.

Each day is a 10–15 minute mission:

1. Theme-wrapped intro from his in-world helper
2. 5 reading questions
3. 5 math questions
4. 1 themed bonus mini-game
5. A reward chest (badge / collectible / upgrade, and a certificate every 7th day)
6. Progress is saved automatically to `localStorage`

A short **Placement Adventure** (8 questions) runs once before Day 1 and recommends a starting band: *Foundation*, *Getting Stronger*, *Ahead Track*, or *Super Advanced*. Default bias is to start easy and build confidence, then accelerate once mastery is high.

---

## 2. Curriculum interpretation (from the attached tables)

The attached photos show Kumon's official **Table of Learning Materials** for Mathematics (6A→X) and Reading (AI/AII/BI/BII/CI/CII, DI/DII/EI/EII/FI/FII, and GI/GII/HI/HII/II/III + Critique Block J/K/L). Only the **sequence of skill types** was extracted — not exact worksheet text, numbering, or images.

### Early math roadmap (Daniel's active path today — levels 6A→F)
Pencil control & tracing → counting pictures 1–5 → counting 1–10 → recognizing numbers 1–10 → writing numbers 1–10 → number order to 15 → numbers to 30 → more/less to 30 → numbers to 50 → addition to 5 → numbers to 100 → addition facts to 10 → missing-number puzzles → subtraction from 10 → mixed add/subtract to 10 → addition to 20 → subtraction to 20 → comparing 2-digit numbers → addition/subtraction to 100 (intro) → multiplication intro → division intro.

### Early reading roadmap (Daniel's active path today — levels A1→C2)
Simple sentences → who/what/where/when → making short sentences → writing from memory → subject & predicate → beginning sounds → modifiers/describing words → story sequence → descriptions in context → identifying key details → compare & contrast → constructing sentences / understanding actions & intentions.

### Future advanced roadmap (long-term only, unlocked far later — not shown to a 5-year-old day-to-day)
- **Math G→X:** algebraic expressions & equations → quadratic functions & factoring → logarithms, trigonometry & geometry → calculus foundations (differentiation/integration) → vectors, matrices, probability & statistics.
- **Reading D1→L:** combining sentences, topic & main idea → clauses, sequence & reason/result → referring words & unraveling text → reading impressions & summarizing paragraphs → broader-view inference & full-passage summary → critical reading (plot, irony, tragedy, comedy, figurative language, critical writing).

This roadmap lives in code as structured, typed data — see `src/data/mathCurriculum.ts` and `src/data/readingCurriculum.ts`. Every skill node has an internal `sourceReference` string (e.g. `"Level A — addition-facts block"`) for our own tracking; this is descriptive shorthand we wrote, not copied text.

---

## 3. Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS (custom "luxury academy" theme: obsidian backgrounds, aurora gradients, glassmorphism)
- Framer Motion for cinematic transitions
- Zustand (+ `persist` middleware) for state, saved to `localStorage`
- Zero backend, zero network calls, zero third-party analytics

---

## 4. Project structure

```
daniels-learning-universe/
├── src/
│   ├── types/index.ts              # All TypeScript interfaces (ThemeWorld, CurriculumSkill, Question, Mission, Reward, ChildProgress, MasteryRecord, ParentSettings, GameSession...)
│   ├── data/
│   │   ├── mathCurriculum.ts       # Extracted + original math skill roadmap (core + stretch)
│   │   ├── readingCurriculum.ts    # Extracted + original reading skill roadmap (core + stretch)
│   │   ├── themeWorlds.ts          # The 5 original theme worlds
│   │   ├── questionTemplates.ts    # Procedural question generators (one per question "kind")
│   │   ├── dailyMissions.ts        # 30 starter missions (day → skill pairing, bonus game, reward)
│   │   └── rewards.ts              # Reward catalog with per-theme naming
│   ├── lib/
│   │   ├── masteryEngine.ts        # 90% mastered / 70–89% practicing / <70% needs-review
│   │   ├── questionGenerator.ts    # Builds a day's 5-question set from a skill
│   │   ├── placementTest.ts        # 8-question placement adventure + scoring
│   │   └── pin.ts                  # Lightweight parent-PIN hashing (not bank-grade — family use only)
│   ├── store/
│   │   └── useGameStore.ts         # Zustand store — all game/progress/settings state, persisted locally
│   ├── components/
│   │   ├── ui/                     # GlassCard, GlowButton, ParticleField, ProgressRing, Badge, TopBar, ThemeBackground, PinPad
│   │   ├── games/
│   │   │   └── QuestionCard.tsx    # Shared question-rendering component for all 21 question "kinds"
│   │   └── screens/                # One file per MVP screen (see below)
│   ├── App.tsx                     # Screen router (simple state-machine, no react-router needed)
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json / vite.config.ts / tailwind.config.js / tsconfig*.json
├── .gitignore
└── README.md (this file)
```

### Screens (`src/components/screens/`)
`HomeScreen` · `ProfileScreen` · `ThemeSelectorScreen` · `PlacementAdventureScreen` · `MissionMapScreen` · `ReadingChallengeScreen` · `MathChallengeScreen` · `BonusGameScreen` · `RewardChestScreen` · `CertificateScreen` · `ParentDashboardScreen` (PIN-gated) · `SettingsScreen`

---

## 5. Getting started

```bash
npm install
npm run dev       # start local dev server (http://localhost:5173)
npm run build     # type-check + production build → dist/
npm run preview   # preview the production build locally
```

Requires Node 18+.

---

## 6. Putting this in a private GitHub repo

1. Create a new **private** repository on GitHub (Settings visible only to you — do not make it public).
2. From this project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Daniel's Learning Universe"
   git branch -M main
   git remote add origin https://github.com/<your-username>/daniels-learning-universe.git
   git push -u origin main
   ```
3. Double-check the repo visibility is **Private** in GitHub's repo Settings → General → Danger Zone (or set it at creation time).
4. Never commit the original Kumon reference photos. The `.gitignore` already excludes a `/reference-images/` folder — drop any reference photos there locally if you want to keep them on disk, they will not be tracked by git.

---

## 7. Deployment (optional — for viewing on an iPad at home)

Both are free-tier friendly and support a "password protect this deployment" option, which is recommended since this app has no login of its own beyond the parent PIN.

**Vercel**
```bash
npm i -g vercel
vercel
```
Follow the prompts, link to your private GitHub repo, framework preset = Vite. Enable "Password Protection" or "Vercel Authentication" in the project's Deployment Protection settings so the URL isn't publicly guessable.

**Netlify**
```bash
npm i -g netlify-cli
netlify deploy --build
```
Or connect the GitHub repo in the Netlify dashboard (Build command: `npm run build`, Publish directory: `dist`). Use Netlify's "Password protection" (available on paid tiers) or restrict via Netlify Identity if you want an extra login layer beyond the in-app parent PIN.

Since all progress is stored in the browser's `localStorage`, progress is per-device. If you want progress to sync across an iPad and a laptop, see the "Future upgrades" section below.

---

## 8. Adding more curriculum

Open `src/data/mathCurriculum.ts` or `src/data/readingCurriculum.ts` and add a new object to the `MATH_CORE_SKILLS` / `READING_CORE_SKILLS` array (or the `_STRETCH_SKILLS` array for long-term roadmap items):

```ts
{
  id: 'math-c-03',
  subject: 'math',
  level: 'C',
  order: 17.5,                 // controls sequencing — keep it between neighboring skills
  skillName: 'Doubles Facts',
  sourceReference: 'Level C — doubles block',
  childFriendlyExplanation: 'Quickly add a number to itself, like 6 + 6.',
  prerequisites: ['math-c-02'],
  difficulty: 4,
  masteryRule: '90% correct over last 5 tries',
  sampleQuestionIds: [],
  questionTemplateId: 'math-fact',   // must match a key in questionTemplates.ts
  visualSupportType: 'number-line',
  rewardValue: 10,
  stage: 'core',
}
```

Then either:
- Reuse an existing `questionTemplateId` (e.g. `math-fact`, `short-comprehension`) so questions generate automatically, or
- Add a brand-new generator function in `src/data/questionTemplates.ts` and register it in the `QUESTION_GENERATORS` dispatch table at the bottom of that file.

To extend the 30-day mission plan, edit `src/data/dailyMissions.ts` — increase the `length: 30` in the `Array.from(...)` call and add matching titles to `MISSION_TITLES`. The pacing function `skillForDay()` automatically maps days to skills, so longer roadmaps "just work."

---

## 9. Adding more themes

Open `src/data/themeWorlds.ts` and add a new entry to `THEME_WORLDS` following the existing `ThemeWorld` shape (name, tagline, helper character, colors, currency, badge names, bonus game id, etc). Then add the new `ThemeId` to the `ThemeId` union type in `src/types/index.ts`, and add a matching `themeVariants` entry for every object in `src/data/rewards.ts`. The theme selector screen picks up new themes automatically — no other code changes needed.

Keep new themes **original** — inspired by a genre, not copied from any specific franchise's names, logos, or characters.

---

## 10. Adding custom questions / words / math facts

- **Quick, no-code way:** Parent Dashboard → Parent Controls → "Add Custom Sight Word" / "Add Custom Math Fact." These are stored in `ParentSettings` and shown in the dashboard (wire them into a generator in `questionTemplates.ts` if you want them to appear in gameplay — currently they're tracked for reference/export).
- **Code way:** add entries to the word banks at the top of `src/data/questionTemplates.ts` (e.g. `SIMPLE_SENTENCES`, `VOCAB_BANK`, `BEGINNING_SOUND_BANK`, `COMPREHENSION_BANK`) — every generator function pulls from these arrays, so adding entries instantly increases variety.

---

## 11. Mastery system

`src/lib/masteryEngine.ts` implements:
- **90%+** accuracy over the last 5 attempts on a skill → `mastered`
- **70–89%** → `practicing` (keep going)
- **below 70%** → `needs-review` (surfaced to the parent dashboard; the child is never shown a "failed" message)
- Two wrong answers in a row on one question reveals the correct answer with a gentle explanation — no shaming, no red "X," always an encouraging phrase (`"Let's solve it together."`, `"Almost! Look closely."`, etc.)

---

## 12. Child safety & privacy

- No ads, anywhere, ever.
- No external links reachable from any child-facing screen.
- No chat, no social features, no public profile.
- No tracking, no third-party analytics, no data selling.
- All data lives in `localStorage` on the device — nothing is sent anywhere.
- Parent Dashboard is gated behind a PIN (set it in Parent Controls the first time you open the dashboard).
- No loot boxes or randomized rewards — every mission has one guaranteed, visible reward.

---

## 13. Future upgrades (not built yet, intentionally out of MVP scope)

- Supabase or Firebase for cloud save + true multi-device sync
- A lightweight parent login (email/password) if you deploy this somewhere other than a single trusted device
- A real drawing/tracing canvas (the current `trace-number` question type is a simplified tap-to-confirm interaction, not full stylus tracing)
- Custom, recorded audio (currently narration uses the browser's built-in voice — see below)

## 14. Read-aloud narration

Every question, its answer choices, feedback, mission intros, and reward reveals can be read aloud automatically using the browser's built-in Web Speech API (`src/lib/speech.ts`) — no audio files, no third-party service, works offline. This is on by default and matters most for a pre/early reader like Daniel.

- Toggle it anytime in Settings ("Read-Aloud Narration") or the Parent Dashboard.
- Each question also has a 🔊 replay button in case the auto-narration doesn't fire (some browsers require one user tap before allowing speech).
- Voice quality depends on what's installed on the device — iPads/Macs generally have good built-in voices; if you want a specific voice, adjust the preference logic in `pickVoice()` inside `src/lib/speech.ts`.

---

Built for Daniel. 💛
