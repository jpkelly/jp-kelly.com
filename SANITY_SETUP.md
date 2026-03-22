# Sanity CMS Setup

This repository uses a standalone Sanity Studio in `sanity-studio/` so the website can stay on React 17 while the CMS uses React 19.

## Project Details

- **Project ID:** `tl4n7qut`
- **Dataset:** `production`
- **Studio URL:** https://tl4n7qut.sanity.studio

## Quick Start

### 1. Install and deploy from the Studio folder

```bash
cd sanity-studio
npm install
npx sanity login
npm run deploy
```

This will build and deploy the Studio to Sanity-hosted `*.sanity.studio`.

### 2. Access Your Studio

After deployment, open the hostname you selected in deploy.

### 2.5 Import existing site content (one-time)

You can seed Sanity from current site content (`src/content/projects.json` and About defaults):

```bash
cd ..
SANITY_API_TOKEN=your_write_token npm run import:sanity
```

Notes:

- Create a write token in Sanity Manage -> API -> Tokens
- The script uploads local images from `public/thumbnails` and `src/jpkelly.jpg`
- The script also parses each project's MDX file for `<VimeoEmbed ... />` and seeds `Vimeo Videos` entries
- It uses `createOrReplace`, so rerunning updates existing seeded docs

You'll see two content types:
- **About Page** - Edit your bio, tools list, profile image, etc.
- **Project** - Add/edit portfolio projects with images and descriptions

### 3. Create Your First Documents

#### About Page
1. Click **"+ Create"** and select **About Page**
2. Fill in:
   - Heading: "JP Kelly"
   - Introduction Text: Your first paragraph
   - Body Content: Additional paragraphs
   - Site Built Text: (default is fine)
   - Copilot Text: (default is fine)
   - Tools List: Copy/paste your tools from the current About.js
   - Profile Image: Upload your photo
3. Click **Publish**

#### Projects
For each project, create a new **Project** document with:
- ID, Path, Menu Label, Route Key, Card Title, Card Text
- Thumbnails (upload images)
- SEO info
- Content (MDX for detail pages)

### 4. Fetch Content in Your React App

Content is automatically fetched via the `src/lib/sanity.js` client:

```javascript
import { getAboutContent, getProjects } from '../lib/sanity'

// Usage in components:
const about = await getAboutContent()
const projects = await getProjects()
```

Production note:

- The website can read through `public/sanity-proxy.php` using a server-side token when anonymous Content Lake reads are not available on your Sanity plan.
- Local development can continue using direct browser reads.

Required server env var for proxy mode:

- `SANITY_READ_TOKEN` (read-only token)

Optional server env vars:

- `SANITY_PROJECT_ID` (default `tl4n7qut`)
- `SANITY_DATASET` (default `production`)
- `SANITY_API_VERSION` (default `2024-03-13`)

### 5. Rebuild & Deploy

After updating content in Sanity:

```bash
npm run build
git add .
git commit -m "Update content from Sanity"
git push
# Then pull in Plesk
```

## Environment Variables

Your `.env.local` contains (keep private, don't commit):

```
VITE_SANITY_PROJECT_ID=tl4n7qut
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-03-13
```

## Sanity CLI Commands

```bash
# from repository root
cd sanity-studio

# Start local Sanity studio
npm run dev

# Deploy studio
npm run deploy
```

## API Access

- Studio publishing and website read access are configured separately.
- If anonymous read is blocked, use the same-origin proxy endpoint (`public/sanity-proxy.php`) so the browser never sees your token.
- Images remain served by Sanity's image CDN URLs.

## Next Steps

1. ✅ Deploy this schema from `sanity-studio/`
2. ✅ Create your About Page content in the studio
3. ✅ Upload projects
4. ✅ Test locally: `npm run dev`
5. ✅ Push to Plesk and verify everything loads

Questions? Check Sanity docs: https://www.sanity.io/docs
