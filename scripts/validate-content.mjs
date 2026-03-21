import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsPath = path.resolve(__dirname, '../src/content/projects.json');
const projectMdxDir = path.resolve(__dirname, '../src/content/projects');
const publicDir = path.resolve(__dirname, '../public');

function fail(message) {
  console.error(`Content validation failed: ${message}`);
  process.exit(1);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value);
}

function toPublicAssetPath(assetPath) {
  return assetPath.replace(/^\/+/, '').split('?')[0].split('#')[0];
}

function validatePublicAssetExists(assetPath, messagePrefix) {
  if (!isNonEmptyString(assetPath)) {
    fail(`${messagePrefix} has an invalid asset path`);
  }

  if (isHttpUrl(assetPath)) {
    return;
  }

  const normalizedPath = toPublicAssetPath(assetPath);
  const absolutePath = path.resolve(publicDir, normalizedPath);

  if (!fs.existsSync(absolutePath)) {
    fail(`${messagePrefix} references missing asset "${assetPath}"`);
  }
}

const raw = fs.readFileSync(projectsPath, 'utf8');
let projects;

try {
  projects = JSON.parse(raw);
} catch (error) {
  fail(`projects.json is not valid JSON (${error.message})`);
}

if (!Array.isArray(projects) || projects.length === 0) {
  fail('projects.json must be a non-empty array');
}

const requiredFields = ['id', 'path', 'menuLabel', 'routeKey', 'cardTitle', 'cardText', 'thumbnails', 'seoTitle', 'seoDescription', 'seoImage'];
const seenIds = new Set();
const seenPaths = new Set();

for (let index = 0; index < projects.length; index += 1) {
  const project = projects[index];
  const label = `project at index ${index}`;

  if (!project || typeof project !== 'object' || Array.isArray(project)) {
    fail(`${label} must be an object`);
  }

  for (const field of requiredFields) {
    if (!(field in project)) {
      fail(`${label} is missing required field "${field}"`);
    }
  }

  if (!isNonEmptyString(project.id)) {
    fail(`${label} has an invalid "id"`);
  }
  if (seenIds.has(project.id)) {
    fail(`duplicate project id "${project.id}"`);
  }
  seenIds.add(project.id);

  if (!isNonEmptyString(project.path) || !project.path.startsWith('/')) {
    fail(`project "${project.id}" has invalid "path" (must start with "/")`);
  }
  if (seenPaths.has(project.path)) {
    fail(`duplicate route path "${project.path}"`);
  }
  seenPaths.add(project.path);

  if (!isNonEmptyString(project.menuLabel)) {
    fail(`project "${project.id}" has an invalid "menuLabel"`);
  }
  if (!isNonEmptyString(project.routeKey)) {
    fail(`project "${project.id}" has an invalid "routeKey"`);
  }
  if (!isNonEmptyString(project.cardTitle)) {
    fail(`project "${project.id}" has an invalid "cardTitle"`);
  }
  if (!isNonEmptyString(project.cardText)) {
    fail(`project "${project.id}" has an invalid "cardText"`);
  }

  if (!isNonEmptyString(project.seoTitle)) {
    fail(`project "${project.id}" has invalid required "seoTitle"`);
  }

  if (!isNonEmptyString(project.seoDescription)) {
    fail(`project "${project.id}" has invalid required "seoDescription"`);
  }

  validatePublicAssetExists(project.seoImage, `project "${project.id}"`);

  if (!Array.isArray(project.thumbnails) || project.thumbnails.length === 0) {
    fail(`project "${project.id}" must include at least one thumbnail`);
  }

  for (let thumbIndex = 0; thumbIndex < project.thumbnails.length; thumbIndex += 1) {
    const thumb = project.thumbnails[thumbIndex];
    if (!thumb || typeof thumb !== 'object' || Array.isArray(thumb)) {
      fail(`project "${project.id}" has invalid thumbnail at index ${thumbIndex}`);
    }
    if (!isNonEmptyString(thumb.src)) {
      fail(`project "${project.id}" has thumbnail with invalid "src" at index ${thumbIndex}`);
    }
    validatePublicAssetExists(thumb.src, `project "${project.id}" thumbnail at index ${thumbIndex}`);
    if (!isNonEmptyString(thumb.alt)) {
      fail(`project "${project.id}" has thumbnail with invalid "alt" at index ${thumbIndex}`);
    }
  }

  const mdxPath = path.resolve(projectMdxDir, `${project.id}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    fail(`project "${project.id}" is missing content file "src/content/projects/${project.id}.mdx"`);
  }

  if ('aliases' in project) {
    if (!Array.isArray(project.aliases)) {
      fail(`project "${project.id}" has invalid "aliases" (must be an array)`);
    }

    for (const alias of project.aliases) {
      if (!isNonEmptyString(alias) || !alias.startsWith('/')) {
        fail(`project "${project.id}" has invalid alias "${alias}"`);
      }
      if (seenPaths.has(alias)) {
        fail(`duplicate route path/alias "${alias}"`);
      }
      seenPaths.add(alias);
    }
  }
}

const mdxFiles = fs.readdirSync(projectMdxDir).filter(fileName => fileName.endsWith('.mdx'));
for (const fileName of mdxFiles) {
  const mdxId = fileName.replace(/\.mdx$/, '');
  if (!seenIds.has(mdxId)) {
    fail(`orphan MDX content file "src/content/projects/${fileName}" has no matching project id`);
  }
}

console.log(`Content validation passed: ${projects.length} projects`);