import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.resolve(rootDir, 'build');
const ssrDir = path.resolve(rootDir, '.prerender-tmp');
const projectsPath = path.resolve(rootDir, 'src/content/projects.json');
const templatePath = path.resolve(buildDir, 'index.html');
const siteUrl = (process.env.SITE_URL || 'https://jp-kelly.com').replace(/\/$/, '');

const DEFAULT_TITLE = 'JP Kelly | Portfolio';
const DEFAULT_DESCRIPTION = 'Portfolio site for JP Kelly.';
const DEFAULT_IMAGE_PATH = '/thumbnails/nac23vj.png';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeImagePath(imagePath) {
  if (!imagePath) {
    return DEFAULT_IMAGE_PATH;
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
}

function toAbsoluteUrl(assetPath) {
  const normalized = normalizeImagePath(assetPath);
  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return `${siteUrl}${normalized}`;
}

function upsertHeadTag(html, tagPattern, replacement) {
  if (tagPattern.test(html)) {
    return html.replace(tagPattern, replacement);
  }

  return html.replace('</head>', `  ${replacement}\n  </head>`);
}

function injectMetadata(html, metadata) {
  const canonicalUrl = escapeHtml(`${siteUrl}${metadata.canonicalPath}`);
  const imageUrl = escapeHtml(toAbsoluteUrl(metadata.imagePath));
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);

  let output = html;
  output = output.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`);
  output = upsertHeadTag(output, /<meta name="description" content=".*?"\s*\/>/i, `<meta name="description" content="${description}" />`);
  output = upsertHeadTag(output, /<meta property="og:type" content=".*?"\s*\/>/i, '<meta property="og:type" content="website" />');
  output = upsertHeadTag(output, /<meta property="og:site_name" content=".*?"\s*\/>/i, '<meta property="og:site_name" content="JP Kelly" />');
  output = upsertHeadTag(output, /<meta property="og:title" content=".*?"\s*\/>/i, `<meta property="og:title" content="${title}" />`);
  output = upsertHeadTag(output, /<meta property="og:description" content=".*?"\s*\/>/i, `<meta property="og:description" content="${description}" />`);
  output = upsertHeadTag(output, /<meta property="og:url" content=".*?"\s*\/>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  output = upsertHeadTag(output, /<meta property="og:image" content=".*?"\s*\/>/i, `<meta property="og:image" content="${imageUrl}" />`);
  output = upsertHeadTag(output, /<meta name="twitter:card" content=".*?"\s*\/>/i, '<meta name="twitter:card" content="summary_large_image" />');
  output = upsertHeadTag(output, /<meta name="twitter:title" content=".*?"\s*\/>/i, `<meta name="twitter:title" content="${title}" />`);
  output = upsertHeadTag(output, /<meta name="twitter:description" content=".*?"\s*\/>/i, `<meta name="twitter:description" content="${description}" />`);
  output = upsertHeadTag(output, /<meta name="twitter:image" content=".*?"\s*\/>/i, `<meta name="twitter:image" content="${imageUrl}" />`);
  output = upsertHeadTag(output, /<link rel="canonical" href=".*?"\s*\/>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  return output;
}

function routeToOutputPath(routePath) {
  if (routePath === '/') {
    return path.resolve(buildDir, 'index.html');
  }

  return path.resolve(buildDir, routePath.replace(/^\//, ''), 'index.html');
}

function getStaticRoutes() {
  return [
    {
      path: '/',
      canonicalPath: '/',
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      imagePath: DEFAULT_IMAGE_PATH
    },
    {
      path: '/gallery',
      canonicalPath: '/',
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      imagePath: DEFAULT_IMAGE_PATH
    },
    {
      path: '/about',
      canonicalPath: '/about',
      title: 'About | JP Kelly',
      description: 'About JP Kelly and selected work across interactive media, Notch, TouchDesigner, and creative technology.',
      imagePath: DEFAULT_IMAGE_PATH
    },
    {
      path: '/contactform',
      canonicalPath: '/contactform',
      title: 'Contact | JP Kelly',
      description: 'Get in touch with JP Kelly.',
      imagePath: DEFAULT_IMAGE_PATH
    }
  ];
}

function getProjectRoutes() {
  const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
  return projects.flatMap(project => {
    const paths = [project.path, ...(project.aliases || [])];
    return paths.map(routePath => ({
      path: routePath,
      canonicalPath: project.path,
      title: project.seoTitle || `${project.cardTitle} | JP Kelly`,
      description: project.seoDescription || project.cardText,
      imagePath: project.seoImage || project.thumbnails?.[0]?.src || DEFAULT_IMAGE_PATH
    }));
  });
}

function dedupeRoutes(routes) {
  const seen = new Set();
  return routes.filter(route => {
    const key = route.path.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

const serverEntryFile = fs
  .readdirSync(ssrDir)
  .find(fileName => /^entry-server\.(mjs|js|cjs)$/.test(fileName));

if (!serverEntryFile) {
  throw new Error('Could not find SSR entry in .prerender-tmp');
}

const { render } = await import(pathToFileURL(path.resolve(ssrDir, serverEntryFile)).href);
const template = fs.readFileSync(templatePath, 'utf8');
const routes = dedupeRoutes([...getStaticRoutes(), ...getProjectRoutes()]);

for (const route of routes) {
  const appHtml = render(route.path);
  const withApp = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  const finalHtml = injectMetadata(withApp, route);
  const outputPath = routeToOutputPath(route.path);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, finalHtml, 'utf8');
}

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`Prerendered ${routes.length} routes`);