import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { createClient } from '@sanity/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const projectId = process.env.SANITY_PROJECT_ID || 'tl4n7qut';
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2024-03-13';
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error('Missing SANITY_API_TOKEN.');
  console.error('Create a write token in Sanity Manage > API > Tokens, then run:');
  console.error('SANITY_API_TOKEN=your_token npm run import:sanity');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const uploadCache = new Map();

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function resolveMediaPath(mediaPath) {
  if (!mediaPath) return null;
  const clean = mediaPath.replace(/^\/+/, '');
  const candidates = [
    path.join(repoRoot, 'public', clean),
    path.join(repoRoot, clean),
  ];

  for (const c of candidates) {
    if (fileExists(c)) return c;
  }

  return null;
}

async function uploadImageIfExists(mediaPath) {
  const resolved = resolveMediaPath(mediaPath);
  if (!resolved) return null;

  if (uploadCache.has(resolved)) {
    return uploadCache.get(resolved);
  }

  const stream = fs.createReadStream(resolved);
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(resolved),
  });

  uploadCache.set(resolved, asset._id);
  return asset._id;
}

function paragraphToPortableText(text) {
  return {
    _key: randomUUID(),
    _type: 'block',
    style: 'normal',
    children: [
      {
        _key: randomUUID(),
        _type: 'span',
        text,
      },
    ],
  };
}

function extractVimeoVideosFromMdx(projectIdValue) {
  const mdxPath = path.join(repoRoot, 'src', 'content', 'projects', `${projectIdValue}.mdx`);
  if (!fileExists(mdxPath)) {
    return [];
  }

  const mdx = fs.readFileSync(mdxPath, 'utf8');
  const embedRegex = /<VimeoEmbed\s+([^>]*?)\/>/g;
  const videos = [];

  let match;
  while ((match = embedRegex.exec(mdx)) !== null) {
    const attrs = match[1] || '';
    const idMatch = attrs.match(/video=\{(\d+)\}/);
    if (!idMatch) {
      continue;
    }

    const vimeoId = Number(idMatch[1]);
    const autoplay = /autoplay=\{true\}/.test(attrs);
    const loop = /loop=\{true\}/.test(attrs);
    const portrait = /portrait=\{true\}/.test(attrs);
    const url = `https://vimeo.com/${vimeoId}`;

    videos.push({
      _key: randomUUID(),
      _type: 'vimeoVideo',
      label: `Video ${videos.length + 1}`,
      vimeoId,
      url,
      autoplay,
      loop,
      portrait,
    });
  }

  return videos;
}

async function importAboutPage() {
  const profileImageId = await uploadImageIfExists('src/jpkelly.jpg');

  const aboutDoc = {
    _id: 'aboutPage.main',
    _type: 'aboutPage',
    heading: 'JP Kelly',
    profileImage: profileImageId
      ? {
          _type: 'image',
          asset: { _type: 'reference', _ref: profileImageId },
        }
      : undefined,
    bio: [
      paragraphToPortableText(
        'I have always loved technology and science. As a kid my first major purchase was a computer with a 6502 processor and 4k of RAM (upgradeable to 8k). Although that computer was only capable of displaying graphics composed of ASCII characters, I dreamed of combining video imagery and computer graphics. Later I had access to an Amiga computer which I used to merge graphics with video.'
      ),
      paragraphToPortableText(
        'I have worked in the live events industry for many years as a video engineer and projectionist. I have a keen sense of what it takes to make imagery look great on screen. I found that I especially love to play video along with music as a VJ. Over the years I have had the opportunity to do live visuals for a number of musicians, events, and parties. I am constantly learning to use new software and equipment to create video art. I am a generalist by nature and am able to merge many disciplines. My background in electronics lends itself to the integration of sensors and other input devices to create interactive installations.'
      ),
      paragraphToPortableText(
        'While at California College of the Arts I learned how to uniquely express my views of social issues through art that engages the viewer. My goal and vision is to provide a way for people to grow and learn by touching their hearts.'
      ),
    ],
    builtByText: 'This site was originally built by hand using React',
    copilotText: 'Complete refactoring done with Copilot.',
    codeLinkText: 'Here is the code.',
    codeLinkUrl: 'https://github.com/jpkelly/jp-kelly.com',
    toolsHeading: 'Here are a few of my favorite tools:',
    toolsList:
      'Photoshop, Illustrator, After Effects, Notch, TouchDesigner, MaxMSP, VDMX, Rhino, Blender, Cinema 4D, disguise(d3), Watchout, Pixera, Barco Eventmaster (E2/3), projectors, LED screens, Ableton, Unreal Engine, graphic design & typography, Arduino, Raspberry Pi, ESP32, LiDAR, sensors, electronics theory and tools, 3D printing, GLSL, HTML, CSS, Javascript, JSX, React, PHP, MySQL, bash, Python, GitHub, Copilot, チャッピー',
  };

  await client.createOrReplace(aboutDoc);
  console.log('Imported about page.');
}

async function importProjects() {
  const projectsPath = path.join(repoRoot, 'src', 'content', 'projects.json');
  const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

  for (let i = 0; i < projects.length; i += 1) {
    const p = projects[i];
    const thumbIds = [];

    for (const t of p.thumbnails || []) {
      const id = await uploadImageIfExists(t.src);
      if (id) thumbIds.push(id);
    }

    const seoImageId = await uploadImageIfExists(p.seoImage);
    const videos = extractVimeoVideosFromMdx(p.id);

    const doc = {
      _id: `project.${p.id}`,
      _type: 'project',
      id: p.id,
      path: p.path,
      menuLabel: p.menuLabel,
      routeKey: p.routeKey,
      cardTitle: p.cardTitle,
      cardText: p.cardText,
      order: i + 1,
      aliases: p.aliases || [],
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      videos,
      content: [paragraphToPortableText(p.cardText)],
      thumbnails: thumbIds.map((assetId) => ({
        _key: randomUUID(),
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      })),
      seoImage: seoImageId
        ? {
            _type: 'image',
            asset: { _type: 'reference', _ref: seoImageId },
          }
        : undefined,
    };

    await client.createOrReplace(doc);
    console.log(`Imported project: ${p.id}`);
  }

  console.log(`Imported ${projects.length} projects.`);
}

async function main() {
  console.log(`Importing into Sanity project ${projectId}/${dataset} ...`);
  await importAboutPage();
  await importProjects();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
