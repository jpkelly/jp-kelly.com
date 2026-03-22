import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@sanity/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const projectId = process.env.SANITY_PROJECT_ID || 'tl4n7qut';
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2024-03-13';
const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_API_TOKEN || undefined;

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

function readLocalProjects() {
  const projectsPath = path.join(repoRoot, 'src', 'content', 'projects.json');
  const raw = fs.readFileSync(projectsPath, 'utf8');
  return JSON.parse(raw);
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function checkRequiredFields(doc, localProject) {
  const missing = [];

  const requiredFields = [
    ['id', doc.id],
    ['path', doc.path],
    ['menuLabel', doc.menuLabel],
    ['routeKey', doc.routeKey],
    ['cardTitle', doc.cardTitle],
    ['cardText', doc.cardText],
  ];

  for (const [fieldName, value] of requiredFields) {
    if (!hasText(value)) {
      missing.push(fieldName);
    }
  }

  if (!Array.isArray(doc.thumbnails) || doc.thumbnails.length === 0) {
    missing.push('thumbnails');
  }

  if (localProject) {
    if (doc.path !== localProject.path) {
      missing.push(`path mismatch (sanity: ${doc.path}, local: ${localProject.path})`);
    }

    const localAliases = Array.isArray(localProject.aliases) ? localProject.aliases : [];
    const sanityAliases = Array.isArray(doc.aliases) ? doc.aliases : [];
    const missingAliases = localAliases.filter((alias) => !sanityAliases.includes(alias));
    if (missingAliases.length > 0) {
      missing.push(`aliases missing: ${missingAliases.join(', ')}`);
    }
  }

  return missing;
}

function checkWarnings(doc) {
  const warnings = [];

  const videos = Array.isArray(doc.videos) ? doc.videos : [];
  const content = Array.isArray(doc.content) ? doc.content : [];
  if (videos.length === 0 && content.length === 0) {
    warnings.push('has no videos and no content (will fall back to MDX)');
  }

  if (content.some((block) => block && block._type === 'imageGallery')) {
    const galleries = content.filter((block) => block && block._type === 'imageGallery');
    galleries.forEach((gallery, index) => {
      const count = Array.isArray(gallery.items) ? gallery.items.length : 0;
      if (count === 0) {
        warnings.push(`imageGallery #${index + 1} has no items`);
      }
    });
  }

  return warnings;
}

function collectImageAssetRefs(doc) {
  const refs = [];

  if (Array.isArray(doc.thumbnails)) {
    doc.thumbnails.forEach((thumb, index) => {
      const ref = thumb?.asset?._ref;
      refs.push({
        path: `thumbnails[${index}]`,
        ref,
      });
    });
  }

  refs.push({
    path: 'seoImage',
    ref: doc.seoImage?.asset?._ref,
  });

  if (Array.isArray(doc.content)) {
    doc.content.forEach((block, blockIndex) => {
      if (block?._type === 'image') {
        refs.push({
          path: `content[${blockIndex}]`,
          ref: block?.asset?._ref,
        });
      }

      if (block?._type === 'imageGallery' && Array.isArray(block.items)) {
        block.items.forEach((item, itemIndex) => {
          refs.push({
            path: `content[${blockIndex}].items[${itemIndex}]`,
            ref: item?.image?.asset?._ref,
          });
        });
      }
    });
  }

  return refs;
}

async function verifyProjects() {
  const localProjects = readLocalProjects();
  const localById = new Map(localProjects.map((p) => [p.id, p]));

  const sanityProjects = await client.fetch(
    `*[_type == "project"]{_id, id, path, menuLabel, routeKey, cardTitle, cardText, aliases, thumbnails, seoImage, videos, content}`
  );

  const sanityById = new Map();
  for (const doc of sanityProjects) {
    if (hasText(doc.id)) {
      sanityById.set(doc.id, doc);
    }
  }

  const failures = [];
  const warnings = [];

  const allAssetRefs = new Set();
  for (const doc of sanityProjects) {
    const refs = collectImageAssetRefs(doc)
      .map((entry) => entry.ref)
      .filter((ref) => typeof ref === 'string' && ref.trim().length > 0);

    refs.forEach((ref) => allAssetRefs.add(ref));
  }

  const existingAssetRefs = new Set();
  if (allAssetRefs.size > 0) {
    const assetRefsArray = Array.from(allAssetRefs);
    const existingAssets = await client.fetch(
      `*[_type == "sanity.imageAsset" && _id in $assetIds]{_id}`,
      { assetIds: assetRefsArray }
    );

    existingAssets.forEach((asset) => {
      if (asset && typeof asset._id === 'string') {
        existingAssetRefs.add(asset._id);
      }
    });
  }

  for (const localProject of localProjects) {
    const doc = sanityById.get(localProject.id);
    if (!doc) {
      failures.push(`${localProject.id}: missing Sanity project document`);
      continue;
    }

    const missingFields = checkRequiredFields(doc, localProject);
    if (missingFields.length > 0) {
      failures.push(`${localProject.id}: ${missingFields.join('; ')}`);
    }

    const projectWarnings = checkWarnings(doc);
    if (projectWarnings.length > 0) {
      for (const warning of projectWarnings) {
        warnings.push(`${localProject.id}: ${warning}`);
      }
    }

    const imageRefs = collectImageAssetRefs(doc);
    imageRefs.forEach((entry) => {
      if (!entry.ref) {
        warnings.push(`${localProject.id}: ${entry.path} is missing image asset reference`);
        return;
      }

      if (!existingAssetRefs.has(entry.ref)) {
        failures.push(`${localProject.id}: ${entry.path} points to missing asset ${entry.ref}`);
      }
    });
  }

  const localIds = new Set(localProjects.map((p) => p.id));
  for (const [id, doc] of sanityById.entries()) {
    if (!localIds.has(id)) {
      warnings.push(`${id}: exists in Sanity but not in src/content/projects.json (${doc._id})`);
    }
  }

  return {
    localCount: localProjects.length,
    sanityCount: sanityProjects.length,
    failures,
    warnings,
  };
}

function printList(title, items) {
  if (items.length === 0) {
    console.log(`${title}: none`);
    return;
  }

  console.log(`${title}:`);
  for (const item of items) {
    console.log(`- ${item}`);
  }
}

async function main() {
  console.log(`Verifying Sanity import for ${projectId}/${dataset} ...`);

  try {
    const result = await verifyProjects();
    console.log(`Local projects: ${result.localCount}`);
    console.log(`Sanity project docs: ${result.sanityCount}`);
    printList('Failures', result.failures);
    printList('Warnings', result.warnings);

    if (result.failures.length > 0) {
      console.error('Verification failed. Fix the issues above and run again.');
      process.exit(1);
    }

    console.log('Verification passed. All project docs are present and structurally valid.');
  } catch (err) {
    console.error('Verification error:', err.message || err);
    process.exit(1);
  }
}

main();
