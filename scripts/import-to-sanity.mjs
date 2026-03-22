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
const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g;

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
  return uploadResolvedImage(resolved);
}

async function uploadResolvedImage(resolved) {
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

function stripInlineHtml(text) {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function markdownTextToPortableSegments(text) {
  const segments = [];
  const markDefs = [];
  let lastIndex = 0;
  let match;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    const [fullMatch, label, href] = match;
    const textBefore = text.slice(lastIndex, match.index);
    if (textBefore) {
      segments.push({ text: textBefore, marks: [] });
    }

    const markKey = randomUUID();
    markDefs.push({
      _key: markKey,
      _type: 'link',
      href,
    });

    segments.push({
      text: label,
      marks: [markKey],
    });

    lastIndex = match.index + fullMatch.length;
  }

  const textAfter = text.slice(lastIndex);
  if (textAfter) {
    segments.push({ text: textAfter, marks: [] });
  }

  if (!segments.length) {
    segments.push({ text, marks: [] });
  }

  return { segments, markDefs };
}

function paragraphToPortableText(text, style = 'normal') {
  const cleaned = stripInlineHtml(text);
  if (!cleaned) {
    return null;
  }

  const { segments, markDefs } = markdownTextToPortableSegments(cleaned);

  return {
    _key: randomUUID(),
    _type: 'block',
    style,
    children: segments
      .filter((segment) => segment.text)
      .map((segment) => ({
        _key: randomUUID(),
        _type: 'span',
        text: segment.text,
        marks: segment.marks,
      })),
    markDefs,
  };
}

function headingToPortableText(text, style = 'h2') {
  return paragraphToPortableText(text, style);
}

function parseDefaultMdxImports(mdx) {
  const importMap = new Map();
  const importRegex = /^import\s+([A-Za-z0-9_$]+)\s+from\s+['"](.+?)['"];?$/gm;
  let match;

  while ((match = importRegex.exec(mdx)) !== null) {
    importMap.set(match[1], match[2]);
  }

  return importMap;
}

function parseBooleanProp(attrs, propName) {
  if (!attrs || !propName) return null;

  const explicitBooleanRegex = new RegExp(`${propName}\\s*=\\s*\\{(true|false)\\}`);
  const explicitStringRegex = new RegExp(`${propName}\\s*=\\s*["'](true|false)["']`);
  const explicitBoolean = attrs.match(explicitBooleanRegex);
  if (explicitBoolean) {
    return explicitBoolean[1] === 'true';
  }

  const explicitString = attrs.match(explicitStringRegex);
  if (explicitString) {
    return explicitString[1] === 'true';
  }

  const bareRegex = new RegExp(`(?:^|\\s)${propName}(?:\\s|$)`);
  if (bareRegex.test(attrs)) {
    return true;
  }

  return null;
}

function extractMdxImageInfo(line) {
  if (!line || !line.includes('<img')) {
    return null;
  }

  const srcCurly = line.match(/src=\{([^}]+)\}/);
  const srcQuoted = line.match(/src=['"]([^'"]+)['"]/);
  const altQuoted = line.match(/alt=['"]([^'"]*)['"]/);

  const srcSource = srcCurly ? srcCurly[1].trim() : (srcQuoted ? srcQuoted[1].trim() : null);
  if (!srcSource) {
    return null;
  }

  return {
    srcSource,
    alt: altQuoted ? altQuoted[1].trim() : '',
    caption: '',
  };
}

function extractInlineCaption(line) {
  if (!line || !line.startsWith('<p')) {
    return null;
  }

  const captionMatch = line.match(/^<p[^>]*>(.*?)<\/p>$/);
  if (!captionMatch) {
    return null;
  }

  return stripInlineHtml(captionMatch[1]);
}

async function uploadImageFromMdxSource(source, options = {}) {
  if (!source) {
    return null;
  }

  const { importMap = new Map(), mdxDir } = options;
  const mappedSource = importMap.get(source) || source;

  let resolved = null;
  if (path.isAbsolute(mappedSource) && fileExists(mappedSource)) {
    resolved = mappedSource;
  } else if (mappedSource.startsWith('.')) {
    const candidate = path.resolve(mdxDir, mappedSource);
    if (fileExists(candidate)) {
      resolved = candidate;
    }
  }

  if (!resolved) {
    resolved = resolveMediaPath(mappedSource);
  }

  if (!resolved) {
    return null;
  }

  return uploadResolvedImage(resolved);
}

async function buildPortableImageBlock(imageInfo, uploadOptions) {
  const assetId = await uploadImageFromMdxSource(imageInfo.srcSource, uploadOptions);
  if (!assetId) {
    return null;
  }

  return {
    _key: randomUUID(),
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    alt: imageInfo.alt || '',
    caption: imageInfo.caption || '',
  };
}

async function buildPortableGalleryBlock(images, uploadOptions) {
  const items = [];

  for (const imageInfo of images) {
    const assetId = await uploadImageFromMdxSource(imageInfo.srcSource, uploadOptions);
    if (!assetId) {
      continue;
    }

    items.push({
      _key: randomUUID(),
      _type: 'galleryImage',
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      },
      alt: imageInfo.alt || '',
      caption: imageInfo.caption || '',
    });
  }

  if (!items.length) {
    return null;
  }

  return {
    _key: randomUUID(),
    _type: 'imageGallery',
    items,
  };
}

async function extractPortableContentFromMdx(projectIdValue, fallbackText) {
  const mdxPath = path.join(repoRoot, 'src', 'content', 'projects', `${projectIdValue}.mdx`);
  if (!fileExists(mdxPath)) {
    const fallbackBlock = paragraphToPortableText(fallbackText);
    return fallbackBlock ? [fallbackBlock] : [];
  }

  const mdx = fs.readFileSync(mdxPath, 'utf8');
  const importMap = parseDefaultMdxImports(mdx);
  const uploadOptions = {
    importMap,
    mdxDir: path.dirname(mdxPath),
  };
  const lines = mdx.split(/\r?\n/);
  const blocks = [];
  let paragraphBuffer = [];
  let imageRun = [];

  const flushParagraph = () => {
    const text = stripInlineHtml(paragraphBuffer.join(' ').replace(/\s+/g, ' ').trim());
    if (text) {
      const paragraph = paragraphToPortableText(text);
      if (paragraph) {
        blocks.push(paragraph);
      }
    }
    paragraphBuffer = [];
  };

  const flushImageRun = async () => {
    if (!imageRun.length) {
      return;
    }

    if (imageRun.length === 1) {
      const imageBlock = await buildPortableImageBlock(imageRun[0], uploadOptions);
      if (imageBlock) {
        blocks.push(imageBlock);
      }
    } else {
      const galleryBlock = await buildPortableGalleryBlock(imageRun, uploadOptions);
      if (galleryBlock) {
        blocks.push(galleryBlock);
      }
    }

    imageRun = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      await flushImageRun();
      continue;
    }

    if (line.startsWith('import ')) {
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      await flushImageRun();
      blocks.push(headingToPortableText(line.replace(/^##\s+/, '').trim(), 'h2'));
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      await flushImageRun();
      blocks.push(headingToPortableText(line.replace(/^###\s+/, '').trim(), 'h3'));
      continue;
    }

    if (line.includes('<VimeoEmbed')) {
      flushParagraph();
      await flushImageRun();
      continue;
    }

    const imageInfo = extractMdxImageInfo(line);
    if (imageInfo) {
      flushParagraph();
      imageRun.push(imageInfo);
      continue;
    }

    const caption = extractInlineCaption(line);
    if (caption && imageRun.length > 0) {
      imageRun[imageRun.length - 1].caption = caption;
      continue;
    }

    if (line.startsWith('<') && line.endsWith('>')) {
      continue;
    }

    if (imageRun.length > 0) {
      await flushImageRun();
    }

    paragraphBuffer.push(line);
  }

  flushParagraph();
  await flushImageRun();

  if (!blocks.length) {
    const fallbackBlock = paragraphToPortableText(fallbackText);
    return fallbackBlock ? [fallbackBlock] : [];
  }

  return blocks;
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
    const autoplay = parseBooleanProp(attrs, 'autoplay') ?? false;
    const explicitLoop = parseBooleanProp(attrs, 'loop');
    const loop = explicitLoop == null ? autoplay : explicitLoop;
    const portrait = parseBooleanProp(attrs, 'portrait') ?? false;
    const controls = parseBooleanProp(attrs, 'controls') ?? !autoplay;
    const url = `https://vimeo.com/${vimeoId}`;

    videos.push({
      _key: randomUUID(),
      _type: 'vimeoVideo',
      label: `Video ${videos.length + 1}`,
      vimeoId,
      url,
      autoplay,
      loop,
      controls,
      portrait,
    });
  }

  return videos;
}

function videoToContentBlock(video) {
  return {
    _key: randomUUID(),
    _type: 'vimeoVideoBlock',
    label: video?.label || '',
    vimeoId: video?.vimeoId,
    url: video?.url,
    autoplay: Boolean(video?.autoplay),
    loop: Boolean(video?.loop),
    controls: Boolean(video?.controls ?? true),
    portrait: Boolean(video?.portrait),
  };
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
    const contentBlocks = await extractPortableContentFromMdx(p.id, p.cardText);
    const contentWithVideos = [
      ...contentBlocks,
      ...videos.map((video) => videoToContentBlock(video)),
    ];

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
      content: contentWithVideos,
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
