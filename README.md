# jp-kelly.com

Portfolio site for JP Kelly.

This repository contains a React single-page site that showcases projects, videos, and portfolio pages.

## Current Stack

- React 17
- React Router v5
- Vite 5 (build and dev tooling)
- Tailwind CSS 4 + PostCSS 8

Key config files:

- `vite.config.js`
- `postcss.config.js`
- `tailwind.config.js`
- `src/content/projects.js`

## Node Version

This repo is pinned to Node 18:

- `.nvmrc` is `18.20.8`
- `package.json` engines require `node: 18.x` and `npm: >=9 <11`

## Scripts

- `npm start` or `npm run dev`: start Vite dev server
- `npm run build`: create production build in `build/`
- `npm run preview`: preview production build locally

## Deployment Notes

Production output is generated into `build/`.

Important: this project currently deploys build artifacts from the repository. If you deploy through a git pull workflow, run `npm run build` before commit/push so `build/` reflects source changes.

## What The Original Build Was

The site originally used Create React App + CRACO with the older Tailwind PostCSS 7 compatibility stack.

That setup made environment and dependency upgrades increasingly brittle, and local builds became harder to keep stable.

## What Was Changed

### 1) Build Tooling Migration

- Replaced CRA/CRACO with Vite
- Removed CRA-specific entry files and template wiring
- Kept production output path as `build/` to avoid changing deployment document-root assumptions
- Preserved support for legacy environment variable names via Vite env prefix config

### 2) Tailwind and PostCSS Modernization

- Upgraded to Tailwind CSS 4
- Upgraded to PostCSS 8 and Autoprefixer 10
- Updated Tailwind config to use `content` scanning
- Kept existing site styling and utilities intact

### 3) Content Model Refactor (Single Source of Truth)

Project metadata now lives in one place:

- `src/content/projects.js`

The following are generated from that shared data:

- Gallery cards (`src/components/Gallery.js`)
- Header dropdown project list (`src/components/Header.js`)
- Project routes and aliases (`src/App.js`)

Result: adding or editing a project in one file updates menu + gallery + routing consistently.

## Changelog

- 2026-03-21: `9e9fad80` - Migrated build system from CRA/CRACO to Vite, upgraded Tailwind/PostCSS, and preserved production output to `build/`.
- 2026-03-21: `660a6f99` - Refactored project data into a shared content model used by gallery cards, dropdown items, and route generation.
- 2026-03-21: Tailwind upgraded from v3 to v4 (`tailwindcss` + `@tailwindcss/postcss`) with updated CSS entrypoint and build artifacts.

## Content Editing Guide

To add a new project, update `src/content/projects.js` with:

- `id`: unique key
- `path`: canonical route path
- `menuLabel`: dropdown label
- `routeKey`: page component mapping key used in `src/App.js`
- `cardTitle`, `cardText`, `thumbnails`: gallery card content
- optional `aliases`: additional legacy or alternate paths

If a project needs its own detail page component, add/import that component and map its `routeKey` in `src/App.js`.

## Future Plans

### Near-Term

- Keep hardening deployment consistency around `build/` artifact publishing
- Add small regression checks for routing and project list rendering

### Content and CMS Direction

- Evolve from in-code project objects to file-based content (Markdown/MDX or JSON content files)
- Keep a single content schema that powers:
	- gallery cards
	- dropdown navigation
	- route registration
	- page metadata
- Add a lightweight authoring workflow so new cards/pages can be added without editing multiple components

### Later Improvements

- Introduce automated build/deploy checks in CI
- Improve type safety around content schema
- Incrementally modernize route architecture when appropriate
