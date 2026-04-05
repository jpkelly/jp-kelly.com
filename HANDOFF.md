# jp-kelly.com Handoff

## Session Snapshot (2026-04-05)

- Branch status: clean and synced (`main...origin/main`)
- Latest commit pushed: `09367f4b` on `main`
- Build status: passing — 19 routes prerendered
- Deployment workflow: Plesk Git deploy button
- Hosted Studio status: unchanged this session

## What Changed This Session

### Shimmer Skeleton Loading (Issue #5 — partial)

Commit: `09367f4b`

- **`src/index.css`** — Added `@keyframes shimmer` and `.shimmer` utility class (dark gray sweep, 1.4s ease infinite).
- **`src/lib/siteProjects.js`** — `useSiteProjects()` now returns `{ projects, loading }` instead of a plain array. Starts with `projects: null` / `loading: true`; resolves to array (Sanity-ordered or fallback) in `finally`. All consumers updated.
- **`src/components/Gallery.js`** — Shows 6 `<SkeletonCard>` shimmer placeholders while loading, then switches to real project cards.
- **`src/components/About.js`** — `useState(null)` initial state; renders layout-stable skeleton (heading, portrait, bio lines, button) while CMS fetch resolves. On error, falls back to local `fallbackContent`.
- **`src/components/Header.js`** — Destructures `{ projects: allProjects }` from updated hook.
- **`src/App.js`** — Destructures `{ projects }` from updated hook.

### Dropdown Menu Sections (previous session, committed 2026-04-05)

- Issues #2 and #3 closed.
- SVG gradient border + fill dropdown w/ flyout submenus grouped by Sanity `menuSection`.
- See repo memory for full architecture details.

## Issues Status

- **#2** — CLOSED (dropdown menu sections)
- **#3** — CLOSED (portrait pair controls)
- **#4** — Open (modernization audit; first-pass recommendations posted)
- **#5** — Open (shimmer/hydration UX); Gallery and About pages done; acceptance criteria may have remaining items

## Important Operational Notes

- Deploy flow: `npm run build` locally → commit (including `build/`) → push → Plesk Git deploy button.
- Content-only Sanity updates: no deploy needed.
- Studio schema changes: `cd sanity-studio && npm run deploy`.
- `useSiteProjects()` returns `{ projects, loading }` — any new consumer must destructure accordingly.

## Restart Checklist (Next Session)

1. Check Issue #5 acceptance criteria — verify if any hydration UX items remain beyond Gallery + About.
2. If implementing Issue #4 modernization, start with low-risk package upgrades first.
3. Keep `build/` committed and deploy via Plesk Git button after any code change.
4. After any Studio schema change, redeploy hosted Studio.

## Security Notes

- Keep write tokens out of git (`.sanity-token` remains gitignored).
- Use least-privilege Sanity API tokens (Canvas Editor permissions only for write scripts).

---

## Previous Session Snapshot (2026-03-25)

- Branch status: clean and synced (`main...origin/main`)
- Latest commit pushed: `9977b985` on `main`
- Build status: passing (`npm run build` succeeds after changes)
- Deployment workflow: Plesk Git deploy button (not SSH-first workflow)
- Hosted Studio status: deployed after schema update (`cd sanity-studio && npm run deploy` completed)

## What Changed This Session

### Install Reliability

- Added repo-level npm install rule to avoid peer dependency install failures with this stack.
  - Added `.npmrc` with `legacy-peer-deps=true`
  - README updated and changelog entry added
- Commit: `1abdf325`

### Vimeo Single Portrait Layout Controls

- Implemented controls for standalone portrait Vimeo embeds:
  - width preset: `small | medium | large | full`
  - alignment: `left | center | right`
- Preserved existing behavior for consecutive portrait videos (side-by-side grouping remains unchanged).
- Updated frontend renderer, Studio schema, README, and committed regenerated `build/` artifacts.
- Commit: `ed4f843c`

### About Footer + CMS Cleanup

- About footer now places code/source link immediately after the React line, on the same line.
- Removed Copilot sentence from About footer rendering.
- Removed `copilotText` field from `aboutPage` Studio schema.
- Commits:
  - `64380d92` (footer order and CMS field removal)
  - `9977b985` (same-line alignment correction)

## Issues Created / Updated

- Issue #3: Portrait pair spacing and breakpoint controls with global defaults and per-video override.
  - Added prep comment with implementation plan and precedence proposal.
- Issue #4: Full modernization audit and upgrade plan.
  - Added first-pass modernization recommendations based on `npm outdated` + `npm audit`.
- Issue #5: Fallback-content flash elimination plan.
  - Added concrete phased implementation plan and exact acceptance criteria.
  - Linked from Issue #4 as a parallel/foundation track.

## Important Operational Notes

- Deploy flow for code changes: `npm run build` locally, commit (including `build/`), push to GitHub, then run Plesk Git deploy.
- Content-only updates in Sanity do not require Plesk deploy.
- Studio schema/plugin/structure changes require hosted Studio deploy: `cd sanity-studio && npm run deploy`.
- Repo currently uses `.npmrc` `legacy-peer-deps=true` because of React 17 era dependency constraints.
- Hydration/fallback UX direction: use loading-first render for CMS-backed surfaces; render local fallback only on unavailable/error/timeout.

## Restart Checklist (Next Session)

1. If making code changes, keep `build/` in sync and deploy via Plesk Git button.
2. If implementing Issue #3, confirm override precedence rule for conflicting per-video values in a portrait pair.
3. If implementing Issue #4, start with a package-by-package upgrade matrix and execute in phased PRs.
4. If implementing Issue #5, start with project-route no-flash decision path first, then About and shared list/link surfaces.
5. After any Studio schema change, redeploy hosted Studio.

## Security Notes

- Keep write tokens out of git (`.sanity-token` remains gitignored).
- Use least-privilege Sanity API tokens (Canvas Editor permissions only for write scripts).
