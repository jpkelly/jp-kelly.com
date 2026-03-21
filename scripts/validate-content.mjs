import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsPath = path.resolve(__dirname, '../src/content/projects.json');

function fail(message) {
  console.error(`Content validation failed: ${message}`);
  process.exit(1);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
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

const requiredFields = ['id', 'path', 'menuLabel', 'routeKey', 'cardTitle', 'cardText', 'thumbnails'];
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

  if ('seoTitle' in project && !isNonEmptyString(project.seoTitle)) {
    fail(`project "${project.id}" has invalid optional "seoTitle"`);
  }

  if ('seoDescription' in project && !isNonEmptyString(project.seoDescription)) {
    fail(`project "${project.id}" has invalid optional "seoDescription"`);
  }

  if ('seoImage' in project && !isNonEmptyString(project.seoImage)) {
    fail(`project "${project.id}" has invalid optional "seoImage"`);
  }

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
    if (!isNonEmptyString(thumb.alt)) {
      fail(`project "${project.id}" has thumbnail with invalid "alt" at index ${thumbIndex}`);
    }
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

console.log(`Content validation passed: ${projects.length} projects`);