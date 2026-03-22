# jp-kelly.com Handoff

## Session Snapshot (2026-03-21)

- Latest commit pushed: `e993d83a` on `main`
- Build status: passing (`npm run build` succeeds)
- Deployment workflow: Plesk Git deploy button (not SSH-first workflow)

## What Was Implemented

- Project pages are now Sanity-first with MDX fallback when Sanity body is empty:
	- `src/App.js`
- Sanity project renderer now supports:
	- Portable text links
	- Image captions
	- Image gallery rendering
	- Vimeo `controls` support
	- `src/components/SanityProjectTemplate.js`
- Sanity schema updated with:
	- `imageGallery` block type
	- Per-video `controls`
	- Caption/alt fields on images
	- `sanity-studio/schemaTypes/project.js`
- Import tooling enhanced:
	- MDX link migration
	- Standalone image migration
	- Multi-image gallery migration
	- Vimeo prop extraction (`autoplay`, `loop`, `portrait`, `controls`)
	- `scripts/import-to-sanity.mjs`
- Post-import verifier added:
	- Checks missing docs, required fields, alias mismatches
	- Warns on empty Sanity body content
	- Fails on broken/missing image asset references
	- `scripts/verify-sanity-import.mjs`

## NPM Commands Added

- `npm run import:sanity`
- `npm run verify:sanity`

## Important Operational Notes

- Deploy by pushing to GitHub and using the Plesk deploy button.
- `build/` is committed and must be kept in sync with source changes.
- If verification shows zero Sanity docs locally, it is usually auth context/token env, not necessarily missing live content.

## Restart Checklist (Next Session)

1. Confirm token context in local shell.
2. Run `npm run import:sanity` (if re-import needed).
3. Run `npm run verify:sanity` and resolve reported issues.
4. Check key project pages in Studio and publish.
5. Run `npm run build`.
6. Commit + push.
7. Deploy from Plesk button.
8. Smoke-test live routes and proxy endpoint.

## Security Follow-up

- A Sanity token appeared in terminal history during this session context.
- Rotate/revoke exposed token(s) in Sanity Manage and use a fresh token for future runs.
