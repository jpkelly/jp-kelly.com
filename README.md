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
- `npm run import:sanity`: import `projects.json` + MDX content into Sanity (requires `SANITY_API_TOKEN` write token)
- `npm run verify:sanity`: verify imported Sanity project docs against `projects.json`
- `npm run validate:content`: validate `src/content/projects.json` schema and route uniqueness
- `npm run build`: run content validation, then build production assets into `build/`
- `npm run preview`: preview production build locally

## Deployment Notes

Production artifacts are committed under `build/`.

If deploying by git pull (for example via Plesk), run `npm run build` before commit/push so `build/` matches source changes.

For Sanity reads in production, configure these PHP environment variables on the server:

- `SANITY_READ_TOKEN` (required, read-only token)
- `SANITY_PROJECT_ID` (optional, default: `tl4n7qut`)
- `SANITY_DATASET` (optional, default: `production`)
- `SANITY_API_VERSION` (optional, default: `2024-03-13`)
- `SANITY_PROXY_DEBUG` (optional, default: `false`; set `true` only temporarily for proxy path diagnostics)

For contact form sending (EmailJS), configure frontend environment variables:

- Preferred (Vite): `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_USER_ID`
- Backward-compatible: `REACT_APP_SERVICE_ID`, `REACT_APP_TEMPLATE_ID`, `REACT_APP_USER_ID`

The contact form uses `import.meta.env` and expects these values at build time. They are baked into the JS bundle during `npm run build` — **if `.env.production.local` is missing when you rebuild, the contact form will silently fail in production.** Store these values in a password manager so they can be recreated if the machine changes.


Do not expose the token in frontend `VITE_` variables.

If Plesk environment variable injection is unavailable, the proxy also supports a local server-side file fallback:

- Create `sanity-proxy.secret.php` from `sanity-proxy.secret.php.example`
- Place it in either:
	- the same directory as `sanity-proxy.php`, or
	- the parent directory of `sanity-proxy.php`
- Keep this file out of git and out of any public file listing

## CMS (Sanity)

This repository includes a standalone Sanity Studio in `sanity-studio/`.

- Website app remains on React 17
- Sanity Studio runs independently (React 19) to avoid dependency conflicts

Studio workflow:

- `cd sanity-studio`
- `npm install`
- `npx sanity login`
- `npm run dev` (local studio)
- `npm run deploy` (hosted studio at `*.sanity.studio`)

After changing Studio code (schema, plugins, or desk structure):

- If you use hosted Studio (this repo does): run `cd sanity-studio && npm run deploy` so the hosted Studio reflects your changes.
- If you use local-only Studio: restart `npm run dev`; no deploy is required.
- If project ordering is newly enabled: in Studio `Projects` list, run `Reset Order` once before drag-and-drop ordering.

Hosted studio: https://www.sanity.io/@ohaQRXW3y/studio/ar6oya1gj4hps3tav50fg85r/

Runtime content fetch in the website uses `@sanity/client` via `src/lib/sanity.js`.

In production, `src/lib/sanity.js` prefers a same-origin proxy endpoint at `public/sanity-proxy.php` and falls back to direct reads when running locally.

Optional frontend env controls:

- `VITE_SANITY_PROXY_PATH` (default: `/sanity-proxy.php`)
- `VITE_SANITY_USE_PROXY` (set `true` to force proxy even on localhost)

## Content Model

Project metadata is stored in one source:

- `src/content/projects.json`

This content powers:

- Gallery cards (`src/components/Gallery.js`) using Sanity `order` when project docs are available
- Header dropdown (`src/components/Header.js`) using Sanity `order` when project docs are available
- Additional dropdown-only links from `src/content/menuLinks.json` (for example `Archive`)
- Project routes and aliases (`src/App.js`)
- Route-level title/description metadata (`src/App.js`)
- Route-level Open Graph/Twitter metadata (`src/App.js`)

Visible project ordering is controlled in Sanity:

- `src/content/projects.json` still defines the canonical route list and fallback metadata
- `src/components/Gallery.js` and `src/components/Header.js` reorder that list at runtime using Sanity ordering (`orderRank`, fallback `order`)
- If Sanity is unavailable or a project doc has not been created yet, the site falls back to the local JSON order

Project drag-and-drop ordering in Studio:

- Studio includes the `@sanity/orderable-document-list` plugin for `project` documents.
- Open the `Projects` list in Studio and drag documents to reorder.
- On first use, choose `Reset Order` from the list menu to initialize `orderRank` values.
- Frontend reads projects ordered by `orderRank` (legacy fallback: numeric `order`).

Project detail pages are Sanity-first:

- `src/App.js` fetches a matching Sanity `project` document for every project route
- If Sanity returns `videos` or `content`, route content is rendered by `src/components/SanityProjectTemplate.js`
- If no Sanity content exists yet, the route falls back to `src/content/projects/*.mdx` when a matching file exists (auto-discovered by filename, no manual import/map required)

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

Projects dropdown links:

- Preferred: manage links in Sanity Studio under singleton `Site Settings` -> `Projects Dropdown Links`.
- Fallback: edit `src/content/menuLinks.json` if Sanity is unavailable.
- Link shape: `id`, `label`, `href`, optional `order` (number), optional `external` (boolean).
- Links are sorted by `order` ascending. If `order` is omitted, they appear after ordered links.
- Use `external: true` for links that should open in a new tab.

Sanity project page authoring:

- `videos[]` supports multiple Vimeo entries per project
- Per-video options: `autoplay`, `loop`, `show controls`, `portrait`
- `content[]` supports rich text, standalone images (with optional alt/caption), and `Image Gallery` blocks
- `Image Gallery` supports 1-6 images with per-image alt text and caption
- Two portrait videos in one project render side by side automatically; all other videos stack vertically
- Inline hyperlinks in rich text are rendered on the site

Image sizing guide (recommended):

- Thumbnails (`thumbnails[]`): 1600-2000 px wide, usually 3:2 or 16:9, target 200-500 KB per image
- Project page images (`content[]` image blocks): 2000-2800 px on the long edge, target 400 KB-1.5 MB depending on detail
- Image Gallery items (`imageGallery.items[]`): 1600-2200 px on the long edge; keep aspect ratios consistent within one gallery
- SEO image (`seoImage`): 1200x630, target under 500 KB
- Use JPG for photography and PNG only when transparency or UI/text sharpness is required
- Use sRGB color profile and avoid uploading very small source images (generally under 1200 px wide)

Creating a new project in Studio:

1. Add the project's route metadata to `src/content/projects.json`:
	- required: `id`, `path`, `menuLabel`, `routeKey`, `cardTitle`, `cardText`, `thumbnails`
	- optional: `aliases`, `seoTitle`, `seoDescription`, `seoImage`
2. Optional fallback only: if you want a local fallback page before Sanity content is published, add `src/content/projects/<project-id>.mdx`.
3. Open Sanity Studio and create a new `Project` document.
4. Set the Studio fields to match `src/content/projects.json` exactly for:
	- `id`
	- `path`
	- `menuLabel`
	- `routeKey`
	- `cardTitle`
	- `cardText`
	- `aliases` if any
5. Set project placement in Studio:
	- preferred: drag-reorder in the `Projects` orderable list (writes `orderRank`)
	- optional fallback: set numeric `order` if needed for legacy docs
6. Upload thumbnails and optional SEO image in Studio.
7. Add page content in `content[]`:
	- rich text blocks for headings and paragraphs
	- standalone images for single full-width images
	- `Image Gallery` blocks for grouped images with captions
8. Add Vimeo entries in `videos[]` if the page needs video embeds.
9. Publish the document.
10. Run `npm run build` so local validation and prerendered output stay current.
11. Commit, push, and deploy with the usual Plesk Git deploy button workflow.

Important note:

- The route exists because of `src/content/projects.json`; the page body comes from the Sanity `Project` document.
- The `id` in Studio must exactly match the `id` in `src/content/projects.json` or the frontend will not find the document.
- New projects can be published from Sanity Studio without adding MDX imports or route-component wiring in `src/App.js`.

MDX fallback note:

- Project content lives in `src/content/projects/<project-id>.mdx`.
- Routes are rendered through a single project template in `src/App.js`; MDX fallbacks are auto-discovered from `src/content/projects/*.mdx` by filename.
- Keep MDX files only as temporary fallback while migrating project bodies into Sanity.
- `scripts/import-to-sanity.mjs` now migrates Markdown links, Vimeo props (`autoplay`, `loop`, `portrait`, `controls`), standalone images, and multi-image grids into `Image Gallery` blocks where possible.
- Run `npm run verify:sanity` after import to report missing project docs, required field gaps, alias mismatches, projects that still have no Sanity body content, and broken image asset references.

Build/prerender note:

- `npm run build` now performs three steps: client build, SSR build, and prerender.
- Canonical routes are emitted as static HTML in `build/` with route-specific title, description, OG, Twitter, and canonical tags already in the HTML.
- The prerender step uses `SITE_URL` if provided; otherwise it defaults to `https://jp-kelly.com` for absolute social metadata URLs.

## Changelog

- 2026-03-22: Added `@sanity/orderable-document-list` for drag-and-drop project ordering in Studio and switched project queries to `orderRank` with `order` fallback.

- 2026-03-22: Made `Site Settings` a singleton document in Studio and added optional `menuLinks[].order` for deterministic dropdown link ordering.

- 2026-03-22: Added Sanity-managed Projects dropdown links via `siteSettings.menuLinks`, with local `src/content/menuLinks.json` fallback when Sanity is unavailable.

- 2026-03-22: Project routes now auto-discover MDX fallbacks by filename (no manual `src/App.js` import/mapping), and Projects dropdown now supports editable custom links via `src/content/menuLinks.json`.

- 2026-03-21: Added Sanity `Image Gallery` content blocks, per-video `Show Controls`, and Sanity-first project rendering for all routes with MDX fallback when Sanity content is missing.
- 2026-03-21: Enhanced `scripts/import-to-sanity.mjs` to migrate MDX links, image grids/captions, and complete Vimeo video flags into Sanity project docs.
- 2026-03-21: Added `scripts/verify-sanity-import.mjs` and `npm run verify:sanity` for post-import completeness checks.
- 2026-03-21: Switched gallery and header project ordering to use Sanity `order` with `projects.json` as the fallback when Sanity is unavailable.
- 2026-03-21: Added image sizing recommendations to the Studio authoring guide in README.

- 2026-03-22: Added `public/sanity-proxy.php` and frontend proxy-first Sanity reads for environments where anonymous Content Lake reads are restricted.

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
