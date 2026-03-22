# Sanity CMS Setup

This project is integrated with Sanity CMS for managing content (About page, projects, images, etc.).

## Project Details

- **Project ID:** `tl4n7qut`
- **Dataset:** `production`
- **Studio URL:** https://tl4n7qut.sanity.studio

## Quick Start

### 1. Deploy Your Schema to Sanity

Run this command to deploy the content schema to your Sanity project:

```bash
npx sanity deploy
```

This will:
1. Build your Sanity studio
2. Deploy it to your Sanity project
3. Give you the studio URL

### 2. Access Your Studio

Once deployed, go to: https://tl4n7qut.sanity.studio

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
# Deploy studio to your project
npx sanity deploy

# Start local Sanity studio (optional, for testing)
npx sanity start

# Manage project (web UI)
npx sanity manage
```

## API Access

Your Sanity data is publicly readable via the API:

```
https://tl4n7qut.api.sanity.io/v2024-03-13/data/query/production?query=*[_type == "aboutPage"]
```

(Images are also publicly accessible via Sanity's image CDN)

## Next Steps

1. ✅ Deploy this schema: `npx sanity deploy`
2. ✅ Create your About Page content in the studio
3. ✅ Upload projects
4. ✅ Test locally: `npm run dev`
5. ✅ Push to Plesk and verify everything loads

Questions? Check Sanity docs: https://www.sanity.io/docs
