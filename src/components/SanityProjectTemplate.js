import React from 'react';
import VimeoEmbed from './mdx/VimeoEmbed';
import { sanityImageUrl } from '../lib/sanity';

function renderSpanWithMarks(span, markDefs = []) {
	const text = span?.text || '';
	const marks = Array.isArray(span?.marks) ? span.marks : [];
	if (!text) {
		return null;
	}

	return marks.reduce((node, mark) => {
		if (mark === 'strong') {
			return <strong key={`strong-${mark}-${text}`}>{node}</strong>;
		}

		if (mark === 'em') {
			return <em key={`em-${mark}-${text}`}>{node}</em>;
		}

		if (mark === 'code') {
			return <code key={`code-${mark}-${text}`}>{node}</code>;
		}

		if (mark === 'underline') {
			return <span key={`underline-${mark}-${text}`} className="underline">{node}</span>;
		}

		if (mark === 'strike-through') {
			return <span key={`strike-${mark}-${text}`} className="line-through">{node}</span>;
		}

		const markDef = markDefs.find(def => def?._key === mark);
		if (markDef?._type === 'link' && markDef.href) {
			const isExternal = /^https?:\/\//i.test(markDef.href);
			return (
				<a
					key={`link-${mark}-${text}`}
					href={markDef.href}
					target={isExternal ? '_blank' : undefined}
					rel={isExternal ? 'noopener noreferrer' : undefined}
					className="underline"
				>
					{node}
				</a>
			);
		}

		return node;
	}, text);
}

function renderPortableTextChildren(block) {
	if (!block || !Array.isArray(block.children)) {
		return null;
	}

	const markDefs = Array.isArray(block.markDefs) ? block.markDefs : [];
	return block.children.map((child, childIndex) => {
		if (child?._type !== 'span') {
			return null;
		}

		return (
			<React.Fragment key={child._key || `span-${childIndex}`}>
				{renderSpanWithMarks(child, markDefs)}
			</React.Fragment>
		);
	});
}

function renderSanityImage(source, key, className = 'my-4 w-full object-cover') {
	const imageRef = source?.asset ? source : source?.image;
	const imageUrl = sanityImageUrl(imageRef);
	if (!imageUrl) {
		return null;
	}

	const caption = typeof source?.caption === 'string' ? source.caption.trim() : '';
	const alt = typeof source?.alt === 'string' && source.alt.trim() ? source.alt.trim() : 'Project media';

	return (
		<figure key={key} className="my-4">
			<img src={imageUrl} alt={alt} className={className} />
			{caption && <figcaption className="mt-2 text-sm text-gray-400">{caption}</figcaption>}
		</figure>
	);
}

function renderImageGallery(block, index) {
	const items = Array.isArray(block?.items) ? block.items : [];
	if (!items.length) {
		return null;
	}

	const columnsClass = items.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

	return (
		<div key={block._key || `gallery-${index}`} className={`my-6 grid grid-cols-1 gap-4 ${columnsClass}`}>
			{items.map((item, itemIndex) => renderSanityImage(item, item._key || `gallery-item-${itemIndex}`))}
		</div>
	);
}

function renderVideoBlock(block, index, containerClass = 'my-4 w-full') {
	if (!Number.isFinite(Number(block?.vimeoId))) {
		return null;
	}

	return (
		<div key={block._key || `video-${index}`} className={containerClass}>
			<VimeoEmbed
				video={block.vimeoId}
				autoplay={Boolean(block.autoplay)}
				loop={Boolean(block.loop)}
				controls={Boolean(block.controls ?? true)}
				portrait={Boolean(block.portrait)}
			/>
		</div>
	);
}

function renderContentBlock(block, index, allBlocks) {
	if (!block) {
		return null;
	}

	if (block._type === 'block') {
		const children = renderPortableTextChildren(block);
		if (!children) {
			return null;
		}

		if (block.style === 'h2') {
			return <h2 key={block._key || `h2-${index}`}>{children}</h2>;
		}

		if (block.style === 'h3') {
			return <h3 key={block._key || `h3-${index}`} className="mb-2 text-lg xl:text-xl">{children}</h3>;
		}

		return <p key={block._key || `p-${index}`}>{children}</p>;
	}

	if (block._type === 'image') {
		return renderSanityImage(block, block._key || `img-${index}`);
	}

	if (block._type === 'imageGallery') {
		return renderImageGallery(block, index);
	}

	if (block._type === 'vimeoVideoBlock') {
		return renderVideoBlock(block, index, 'my-4 w-full');
	}

	return null;
}

function groupConsecutivePortraitVideos(blocks) {
	const result = [];
	let groupIndex = 0;

	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];

		if (block?._type === 'vimeoVideoBlock' && Boolean(block.portrait)) {
			// Look ahead to find consecutive portrait videos
			const groupStart = i;
			const group = [{ block, index: i }];

			while (i + 1 < blocks.length && blocks[i + 1]?._type === 'vimeoVideoBlock' && Boolean(blocks[i + 1].portrait)) {
				i++;
				group.push({ block: blocks[i], index: i });
			}

			// If this is a group (2+ consecutive portrait videos), wrap them
			if (group.length > 1) {
				result.push({
					type: 'portraitVideoGroup',
					groupId: `portrait-group-${groupIndex}`,
					videos: group,
				});
				groupIndex++;
			} else {
				// Single portrait video, render normally
				result.push({ type: 'block', block, index: groupStart });
			}
		} else {
			result.push({ type: 'block', block, index: i });
		}
	}

	return result;
}

function SanityProjectTemplate({ project }) {
	const contentBlocks = Array.isArray(project?.content) ? [...project.content] : [];
	const legacyVideos = Array.isArray(project?.videos)
		? project.videos.filter(video => Number.isFinite(Number(video?.vimeoId)))
		: [];
	const hasVideoBlocks = contentBlocks.some(block => block?._type === 'vimeoVideoBlock');

	// Temporary compatibility path while old docs still use the legacy videos[] field.
	if (!hasVideoBlocks && legacyVideos.length > 0) {
		contentBlocks.push(
			...legacyVideos.map(video => ({
				_key: video?._key,
				_type: 'vimeoVideoBlock',
				...video,
			}))
		);
	}

	const groupedBlocks = groupConsecutivePortraitVideos(contentBlocks);

	return (
		<div className="w-full">
			{groupedBlocks.map((item) => {
				if (item.type === 'portraitVideoGroup') {
					return (
						<div key={item.groupId} className="flex flex-wrap w-full mx-auto my-4 gap-4">
							{item.videos.map(({ block }) => renderVideoBlock(block, block._key, 'w-full md:w-1/2 lg:w-1/2 lg:max-w-2xl'))}
						</div>
					);
				}

				return renderContentBlock(item.block, item.index, contentBlocks);
			})}
		</div>
	);
}

export default SanityProjectTemplate;