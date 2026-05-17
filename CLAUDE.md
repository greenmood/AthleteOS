# AthleteOS — Project Context for Claude

## What this is
A CrossFit training tracker PWA built for a specific athlete. All workouts, progressions, and targets are personalised — this is not a generic fitness app. When making changes, always refer to the athlete profile and plan below before touching any workout data.

---

## Athlete Profile

| Field | Value |
|---|---|
| Sex | Male |
| Age | 35–45 |
| Height | 1.80m |
| Weight | 93kg → goal 90kg |
| Goal | Body recomposition — retain muscle, lose fat |
| Timeline | Sustainable long-term |
| Training | 4×/week CrossFit, ~3 years experience |
| Lower back | Occasional sensitivity — flag high deadlift + metcon volume combinations |

### Strength PRs (baseline)
| Lift | Weight | Date |
|---|---|---|
| Back Squat | 155kg | — |
| Front Squat | 135kg | Apr 2025 |
| Deadlift | 180kg | May 2025 |
| Bench Press | 112.5kg | Oct 2023 |
| Push Press | 80kg | — |
| Strict Press | 75kg (theoretical) | — |
| Hang Power Clean | 80kg | Jul 2025 |
| Snatch | 50kg | — |
| OHS | 50kg | — |

### Current Working Maxes
Use these — not the PR table — when computing %-based loads for prescriptions. PRs above are historical; these reflect what the athlete can actually load *today*. Re-check at the end of each mesocycle.

| Lift | Working Max | As of | Notes |
|---|---|---|---|
| Front Squat | 125kg | W37 / 2026-05-17 | PR (135kg, Apr 2025) is stale; 80% of PR (108kg × 6 × 5) was too heavy. Re-test in Meso 3 Peaking (W45–48). |
| Clean & Jerk Complex | 80kg baseline | W37 / 2026-05-17 | Athlete computes complex % from 80kg (Hang Power Clean PR), not from full C&J 1RM — full C&J is technique-limited, not strength-limited. Re-check after Meso 4 (W51 test). |

### Skills / Limitations
- **Cannot do bar muscle-ups** — use C2B pull-ups or ring dips as substitution
- All weights and distances in **metric** (kg, cm, m, cal)
- No dietary restrictions

---

## 16-Week Training Plan

**Plan period:** W37–W52  
**Priority order:** Recomposition → Olympic Lifting → Strength → Conditioning

| Meso | Weeks | Phase | Focus |
|---|---|---|---|
| 1 | W37–40 | Accumulation | Volume base. Higher reps, 70–75% Olympic, longer metcons |
| 2 | W41–44 | Intensification | Lower volume, higher intensity. 80–85% Olympic, 2–4 rep strength |
| 3 | W45–48 | Peaking | Near-max singles, benchmark WODs, PRs targeted |
| 4 | W49–52 | Realization | W51 = test week. W52 = full deload |

### W51 PR Targets
| Lift | Current | Target |
|---|---|---|
| Clean & Jerk | ~93kg | 100–102kg |
| Snatch | 50kg | 55–57kg |
| Front Squat | 135kg | 138–140kg |
| Deadlift | 180kg | 185kg |
| Bench Press | 112.5kg | 113–115kg |
| Strict Press | 75kg | 77–78kg |

### Weekly Structure (4 days)
- **D1** — Olympic (Snatch focus) + Lower (Front Squat, hamstrings)
- **D2** — Push (Bench + Push Press + accessories)
- **D3** — Olympic (C&J focus) + Hinge (Deadlift)
- **D4** — Pull (Weighted Pull-ups) + Press (Strict Press)

Each day ends with a **3-exercise accessory block** (~18–22min):
- D1: Hip Thrust, Tibialis Raise, Band External Rotation
- D2: Lateral Raise, Face Pull, Tricep Pushdown
- D3: Heavy Hip Thrust, Banded Hamstring Curl, Calf Raise
- D4: Barbell Curl, Face Pull, Band Pull-Apart

### Workout duration target: 90–120min per session

---

## Progression Protocol

When the athlete pastes a weekly export (generated from History → Export Week), use this logic to build the next week:

**Meso 1 → 2 (W40→41):** Drop volume by ~20%, increase intensity. Move from heavy 6 to heavy 4 on bench/press. Olympic % jumps from 75% to 85%.

**Within a meso (week to week):**
- **Olympic lifts:** +2.5kg on ramp sets if all sets completed cleanly
- **Strength compounds (fixed):** +2.5kg if all sets completed at prescribed reps
- **Conditioning:** note the score, aim to beat it next time the WOD repeats
- **Accessories:** +2.5kg every 2 weeks when top of rep range is easy
- If any set was missed or form broke down → hold weight, don't progress

**Lower back flag:** If D3 has heavy deadlift (>80% 1RM) AND a high-volume metcon in the same session, note it. Consider moving the metcon to after accessories or replacing with a shorter piece.

---

## File Structure

```
athleteos-pwa/
├── index.html      — Full app (React via CDN + Babel, all logic inline)
├── manifest.json   — PWA manifest (name, icons, display: standalone)
├── sw.js           — Service worker (network-first HTML, cache-first assets; bump `CACHE` on each release)
├── icon-192.png    — Home screen icon
├── icon-512.png    — Splash screen icon
└── CLAUDE.md       — This file
```

## Tech Stack

- **React 18** via CDN (unpkg), no build step
- **Babel standalone** for JSX transpilation in-browser
- **IndexedDB** for persistence — DB `athleteos`, object store `sessions` (keyed by `id`, indexed on `week` + `date`). One-shot migration from legacy `localStorage["athleteos-history-v1"]` runs on first load; `localStorage["athleteos-initialized-v1"]` flag prevents reseeding `DEMO_HISTORY` after the user empties their log. `navigator.storage.persist()` is requested on init.
- **No external dependencies** beyond React + Babel CDN
- **Styling:** inline styles only, Barlow Condensed font (Google Fonts)
- **Theme:** dark background `#080810`, electric blue `#00b4ff` accent

## Exercise Template Types

Each exercise has a `type` field that controls the logger UI:

| Type | Used for | UI |
|---|---|---|
| `ramp` | Build to heavy single, Olympic ramp sets | Per-set rows: weight + reps + checkmark |
| `fixed` | Prescribed sets e.g. 5×6 @108kg | Single weight input + checkbox per set |
| `emom` | EMOM conditioning | Numbered interval buttons to tap done |
| `amrap` | AMRAP conditioning | Rounds + reps score fields |
| `fortime` | For Time / chipper | MM:SS time input |

## Key Decisions & Rationale

- **No bar muscle-ups anywhere** — athlete hasn't achieved this skill yet. Use C2B or ring dips.
- **All distances in cm/m** — no imperial units (no "in", "ft", "lb")
- **3 accessories per day max** — keeps sessions within 2h. Originally had 5, trimmed for time.
- **Wall-clock timer** — uses `Date.now()` on start, not interval counting, so it stays accurate when phone screen locks
- **Export button in History** — generates a formatted text block the athlete pastes to Claude to get next week's prescriptions
- **Meso color coding:** Blue (Accumulation) → Purple (Intensification) → Orange (Peaking) → Green (Realization)

## Known Issues / Future Work

- Timer still suspends when iOS PWA is fully backgrounded (OS limitation, not fixable in web)
- Progress charts use hardcoded seed data — not yet reading from logged history
- Streak counter is hardcoded to 4 — needs to calculate from actual history dates
- No PR detection on finish — currently all sessions saved with `prs: []`
- `CURRENT_WEEK = 37` in index.html is hardcoded — never auto-advances; needs to derive from current date
