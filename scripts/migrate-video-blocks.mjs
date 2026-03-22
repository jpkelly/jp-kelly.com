import { randomUUID } from 'crypto';
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID || 'tl4n7qut';
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2024-03-13';
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error('Missing SANITY_API_TOKEN.');
  console.error('Create a write token in Sanity Manage > API > Tokens, then run:');
  console.error('SANITY_API_TOKEN=your_token npm run migrate:video-blocks');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

function hasValidVimeoId(video) {
  return Number.isFinite(Number(video?.vimeoId));
}

function videoToContentBlock(video) {
  return {
    _key: randomUUID(),
    _type: 'vimeoVideoBlock',
    label: video?.label || '',
    vimeoId: Number(video.vimeoId),
    url: video?.url || `https://vimeo.com/${Number(video.vimeoId)}`,
    autoplay: Boolean(video?.autoplay),
    loop: Boolean(video?.loop),
    controls: Boolean(video?.controls ?? true),
    portrait: Boolean(video?.portrait),
  };
}

async function migrate() {
  console.log(`Migrating legacy videos[] to content[] video blocks for ${projectId}/${dataset} ...`);

  const projects = await client.fetch(
    `*[_type == "project"]{_id, id, videos, content}`
  );

  let scanned = 0;
  let migrated = 0;
  let unchanged = 0;

  for (const project of projects) {
    scanned += 1;

    const legacyVideos = Array.isArray(project.videos) ? project.videos.filter(hasValidVimeoId) : [];
    const content = Array.isArray(project.content) ? project.content : [];

    if (legacyVideos.length === 0) {
      unchanged += 1;
      continue;
    }

    const existingVimeoIds = new Set(
      content
        .filter((block) => block && block._type === 'vimeoVideoBlock' && hasValidVimeoId(block))
        .map((block) => Number(block.vimeoId))
    );

    const blocksToAppend = legacyVideos
      .filter((video) => !existingVimeoIds.has(Number(video.vimeoId)))
      .map((video) => videoToContentBlock(video));

    const nextContent = [...content, ...blocksToAppend];

    await client
      .patch(project._id)
      .set({ content: nextContent })
      .unset(['videos'])
      .commit({ autoGenerateArrayKeys: true });

    migrated += 1;
    const projectLabel = project.id || project._id;
    console.log(`- migrated ${projectLabel}: appended ${blocksToAppend.length} video block(s)`);
  }

  console.log('Migration complete.');
  console.log(`Scanned: ${scanned}`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Already clean/no legacy videos: ${unchanged}`);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
