---
tools:
  allowAll: true
  run_in_terminal: true
---

# Repository Rules

## Documentation Maintenance

- Keep `README.md` accurate and up to date.
- Any change to build tooling, dependencies, architecture, deployment workflow, or content model must include corresponding README updates in the same pull request/commit.
- When behavior changes, update both:
  - what changed
  - how to run/build/deploy after the change

## Definition of Done (Docs)

- Do not consider a repo-level refactor or upgrade complete until `README.md` reflects the new reality.

## Upgrade Planning Rules

- For modernization assessments, collect evidence from both app roots before recommending work:
  - root: `npm outdated` and `npm audit`
  - `sanity-studio/`: `npm outdated` (and `npm audit` when relevant)
- Propose upgrades in phased order (low risk -> medium risk -> high risk), not as one large rewrite.
- Record modernization recommendations in a GitHub issue comment with:
  - current state highlights
  - prioritized phases
  - migration risks and validation gates
