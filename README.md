# jp-kelly.com

Portfolio site for JP Kelly.

This repository contains a React single-page portfolio showcasing projects, videos, and supporting pages.

## Current Stack

- React 17
- React Router v5
- Vite 5 (build/dev tooling)
- Tailwind CSS 4 + PostCSS 8
- MDX via `@mdx-js/rollup`

Key files:

- `index.html`
- `vite.config.js`
- `postcss.config.js`
- `tailwind.config.js`
- `src/content/projects.json`
- `scripts/validate-content.mjs`

## Node Version

This repo is pinned to Node 18:

- `.nvmrc`: `18.20.8`
- `package.json` engines: `node: 18.x`, `npm: >=9 <11`

## Scripts

- `npm start` or `npm run dev`: start Vite dev server
- `npm run validate:content`: validate `src/content/projects.json` schema and route uniqueness
- `npm run build`: run content validation, then build production assets into `build/`
- `npm run preview`: preview production build locally

## Deployment Notes

Production artifacts are committed under `build/`.

If deploying by git pull (for example via Plesk), run `npm run build` before commit/push so `build/` matches source changes.

## Content Model

Project metadata is stored in one source:

- `src/content/projects.json`

This content powers:

- Gallery cards (`src/components/Gallery.js`)
- Header dropdown (`src/components/Header.js`)
- Project routes and aliases (`src/App.js`)
- Route-level title/description metadata (`src/App.js`)
- Route-level Open Graph/Twitter metadata (`src/App.js`)

MDX project page content can live under `src/content/projects/*.mdx` and embed React components.

## SEO/Social Metadata

### Base defaults

`index.html` includes fallback metadata for:

- `description`
- Open Graph (`og:*`)
- Twitter (`twitter:*`)
- canonical link (`rel="canonical"`)

### Route-level overrides

For project pages, `src/App.js` updates metadata at runtime using `projects.json` values:

- `seoTitle`
- `seoDescription`
- `seoImage`

`og:url` and canonical URL are aligned from each project's canonical path.

## Content Editing Guide

When adding/editing a project in `src/content/projects.json`:

Required fields:

- `id`
- `path`
- `menuLabel`
- `routeKey`
- `cardTitle`
- `cardText`
- `thumbnails`

Optional fields:

- `aliases`
- `seoTitle`
- `seoDescription`
- `seoImage`

MDX authoring note:

- Pilot page: `src/content/projects/notchimag.mdx`
- Reusable embed component: `src/components/mdx/VimeoEmbed.js`
- Use `autoplay={true}` for the approved silent autoplay pages. `VimeoEmbed` translates that into Vimeo background mode, mute, loop, and no controls.
- Current approved autoplay pages: Heads-up Displays, F-8 Interactive, Saturn Orbit Test, Houdini Smoke, NAC 2019 Digital Ribbon, and TOTO Hologram/Immersive Experience.
- For non-autoplay pages, `VimeoEmbed` shows the play button, starts with sound when clicked, and plays once by default.
- For autoplay pages, videos loop by default; set `loop={false}` to make an autoplay video play once.
- Current route wired to MDX content: `src/components/NotchIMAG.js`
- Additional routes wired to MDX content:
	- `src/components/NAC23VJ.js` -> `src/content/projects/nac23vj.mdx`
	- `src/components/Huds.js` -> `src/content/projects/huds.mdx`
	- `src/components/Saturn.js` -> `src/content/projects/saturn.mdx`

If a project needs its own detail page component, add/import the component and map `routeKey` in `src/App.js`.

## Changelog

- 2026-03-21: Migrated build tooling from CRA/CRACO to Vite while keeping production output at `build/`.
- 2026-03-21: Refactored project data into shared content model used by gallery, dropdown, and routes.
- 2026-03-21: Upgraded Tailwind to v4 and updated PostCSS integration.
- 2026-03-21: Added build-time content validation (`scripts/validate-content.mjs`) to `npm run build`.
- 2026-03-21: Added explicit `seoTitle` and `seoDescription` across all project entries.
- 2026-03-21: Added Open Graph/Twitter metadata wiring from project content with base fallbacks in `index.html`.
- 2026-03-21: Added explicit `seoImage` values across all project entries.
- 2026-03-21: Added canonical URL management per project route and canonical fallback in `index.html`.
- 2026-03-21: Added MDX support and converted the Notch IMAG project page to MDX with embedded React component rendering.
- 2026-03-21: Converted NAC23 VJ, Heads-up Displays, and Saturn project pages to MDX content files.
